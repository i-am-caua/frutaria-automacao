
import { GoogleGenAI, Type } from "@google/genai";
import { ShoppingListItem } from '../types';
import { fileToBase64 } from '../utils/fileUtils';
import { findProductData, getOfficialProductName, PESO_MEDIO_UNITARIO_KG } from "../constants";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

const responseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            name: {
                type: Type.STRING,
                description: 'The name of the shopping item, normalized to a common name (e.g., "Batatinha" becomes "Batata").',
            },
            quantity: {
                type: Type.NUMBER,
                description: 'The numeric quantity of the item. For example, for "300g", this should be 0.3 if the unit is kg, or 300 if the unit is g.',
            },
            unit: {
                type: Type.STRING,
                description: 'The unit of measurement found in the text. Do NOT standardize to "un" if it is specific like "bdj", "penca", "maço", "dúzia". Keep it descriptive.',
            },
        },
        required: ['name', 'quantity', 'unit'],
    },
};

const systemInstruction = `You are an expert shopping list parser from Brazil. Your task is to analyze text or images of handwritten shopping lists and extract the items, quantities, and units.

RULES:
- Convert fractional words to numbers: "meio" to 0.5.
- Normalize product names based on common Brazilian Portuguese variations. For instance, 'Batatinha' or 'Batata Inglesa' should be 'Batata'.
- If an item has no quantity, assume 1 unit.
- **Unit Handling:**
  - Standardize generic units: "unidades" -> "un", "quilos" -> "kg", "gramas" -> "g".
  - **CRITICAL:** Preserve specific container names exactly as written (or abbreviated). Do NOT convert them to generic "un".
    - Keep "bdj" or "bandeja".
    - Keep "maço".
    - Keep "penca".
    - Keep "pé" or "pés".
    - Keep "cacho".
    - Keep "dúzia" or "dz".
    - Keep "sacola" or "saquinho".
  - Standardize large containers: "caixa" -> "cx", "saco" (large sack) -> "cx".
- Return the data ONLY as a valid JSON array conforming to the provided schema.`;

const parseWithGemini = async (promptParts: any[]): Promise<ShoppingListItem[]> => {
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: promptParts },
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.1
            },
        });

        const jsonText = response.text;
        const parsedResult = JSON.parse(jsonText) as { name: string; quantity: number; unit: string }[];

        return parsedResult.map(item => {
            const officialName = getOfficialProductName(item.name);
            const productData = findProductData(officialName);
            
            let finalQuantity = item.quantity;
            let normalizedUnit = item.unit ? item.unit.toLowerCase().trim() : '';

            // CORREÇÃO CRÍTICA: Se a unidade estiver vazia ou for igual ao nome do produto (ex: "7 abacaxi"), assumir 'un'
            if (!normalizedUnit || normalizedUnit === item.name.toLowerCase().trim()) {
                normalizedUnit = 'un';
            }

            // 1. Definição de Grupos de Unidades (Regex/Listas)
            
            // Dúzia: Multiplica por 12
            const isDozen = ['dz', 'duzia', 'dúzia', 'duzias', 'dúzias'].some(u => normalizedUnit.includes(u));
            
            // Gramas: Divide por 1000
            const isGram = ['g', 'gramas', 'gr', 'grama'].includes(normalizedUnit);
            
            // Caixas/Sacos Grandes: Multiplica pelo peso da caixa
            // Cuidado: 'saco' entra aqui, mas 'sacola'/'saquinho' não devem entrar
            const isBox = ['cx', 'caixa', 'cx.', 'caixas', 'box', 'fardo'].includes(normalizedUnit) || 
                          (normalizedUnit === 'saco' || normalizedUnit === 'sacos');

            // Unidades e Derivados (Bandejas, Maços, etc.): Multiplica pelo peso médio unitário
            const isUnitLike = [
                'un', 'unidade', 'unidades', 'und', 'uni', 'pc', 'pça', 'pca',
                'bdj', 'bandeja', 'bandejas',
                'maço', 'maco', 'macos', 'maços', 'moe', 'moio', 'moios',
                'penca', 'pencas',
                'pe', 'pé', 'pes', 'pés',
                'cacho', 'cachos',
                'cabeca', 'cabeça',
                'sacola', 'sacolas',
                'saquinho', 'saquinhos',
                'garrafa', 'garrafas',
                'dz', 'duzia', 'dúzia' // Dúzia também é um tipo de unidade para fins de buscar peso médio
            ].some(u => normalizedUnit.startsWith(u));


            // 2. Aplicação da Lógica de Cálculo
            
            // Passo A: Tratar Dúzia (Multiplicador de quantidade)
            if (isDozen) {
                finalQuantity = finalQuantity * 12;
            }

            // Passo B: Conversão para KG se o produto for vendido por KG
            if (productData?.unidade === 'KG') {
                if (isGram) {
                    // Conversão Grama -> KG
                    finalQuantity = finalQuantity / 1000;
                } 
                else if (isBox) {
                    // Conversão Caixa/Saco -> KG
                    const pesoCaixa = productData.peso_cx || 18.0;
                    finalQuantity = finalQuantity * pesoCaixa;
                } 
                else if (isUnitLike || isDozen) { // isDozen aqui garante que convertemos as 12/24/36 unidades para peso
                    // Conversão Unidade/Bandeja/Maço -> KG
                    const avgWeight = PESO_MEDIO_UNITARIO_KG[officialName];
                    
                    if (avgWeight) {
                        finalQuantity = finalQuantity * avgWeight;
                    } else {
                        // FALLBACK DE SEGURANÇA:
                        // "Saquinho" de tempero geralmente é leve (100g), frutas são ~150g.
                        if (normalizedUnit.includes('saquinho') || normalizedUnit.includes('pimenta')) {
                             finalQuantity = finalQuantity * 0.100;
                        } else {
                             finalQuantity = finalQuantity * 0.15;
                        }
                    }
                }
            }

            return {
                id: `${Date.now()}-${officialName}-${Math.random()}`,
                name: officialName,
                quantity: finalQuantity,
                unit: productData?.unidade || (normalizedUnit === 'un' ? 'UN' : item.unit.toUpperCase()),
                price: productData?.preco || 0,
            };
        });

    } catch (error) {
        console.error("Error processing with Gemini:", error);
        throw new Error("Failed to parse the list with AI. The format might be too complex or the image unclear.");
    }
};

export const parseShoppingListFromText = async (text: string): Promise<ShoppingListItem[]> => {
    const prompt = `Please parse the following shopping list:\n\n${text}`;
    return parseWithGemini([{ text: prompt }]);
};

export const parseShoppingListFromImage = async (file: File): Promise<ShoppingListItem[]> => {
    const base64Data = await fileToBase64(file);
    const imagePart = {
        inlineData: {
            mimeType: file.type,
            data: base64Data,
        },
    };
    const textPart = {
        text: "Please parse the shopping list from this image.",
    };
    return parseWithGemini([imagePart, textPart]);
};
