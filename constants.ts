
import { ProductDatabase, ProductData } from './types';

export const DADOS_PRODUTOS: ProductDatabase = {
    'ABACATE': { 'unidade': 'KG', 'preco': 14.43, 'peso_cx': 18.000 },
    'ABACAXI': { 'unidade': 'KG', 'preco': 12.60, 'peso_cx': 7.200 },
    'ABOBORA CABOTIA': { 'unidade': 'KG', 'preco': 9.40, 'peso_cx': 20.000 },
    'ABOBRINHA VERDE': { 'unidade': 'KG', 'preco': 3.90, 'peso_cx': 18.000 },
    'ALFACE GRANDE': { 'unidade': 'MOE', 'preco': 9.00, 'peso_cx': 3.600 },
    'ALHO': { 'unidade': 'KG', 'preco': 45.00, 'peso_cx': 10.000 },
    'AMEIXA': { 'unidade': 'KG', 'preco': 14.00, 'peso_cx': 8.000 },
    'BANANA FRITAR': { 'unidade': 'KG', 'preco': 3.50, 'peso_cx': 20.000 },
    'BANANA MACA': { 'unidade': 'KG', 'preco': 4.50, 'peso_cx': 20.000 },
    'BANANA MARMELA': { 'unidade': 'KG', 'preco': 3.00, 'peso_cx': 20.000 },
    'BANANA PRATA': { 'unidade': 'KG', 'preco': 12.00, 'peso_cx': 20.000 },
    'BATATA DOCE': { 'unidade': 'KG', 'preco': 9.00, 'peso_cx': 22.000 },
    'BATATINHA': { 'unidade': 'KG', 'preco': 13.00, 'peso_cx': 25.000 },
    'BERINJELA': { 'unidade': 'KG', 'preco': 2.70, 'peso_cx': 18.000 },
    'BETERRABA': { 'unidade': 'KG', 'preco': 9.00, 'peso_cx': 20.000 },
    'BROCOLIS': { 'unidade': 'PC', 'preco': 20.00, 'peso_cx': 6.000 },
    'CAQUI': { 'unidade': 'KG', 'preco': 25.00, 'peso_cx': 8.000 },
    'CARA': { 'unidade': 'KG', 'preco': 2.60, 'peso_cx': 20.000 },
    'CARTELA DE MILHO VERDE': { 'unidade': 'KG', 'preco': 36.67, 'peso_cx': 12.000 },
    'CEBOLA': { 'unidade': 'KG', 'preco': 2.40, 'peso_cx': 20.000 },
    'CENOURA': { 'unidade': 'KG', 'preco': 9.40, 'peso_cx': 20.000 },
    'CHEIRO VERDE': { 'unidade': 'MOE', 'preco': 9.00, 'peso_cx': 2.000 },
    'CHUCHU': { 'unidade': 'KG', 'preco': 9.00, 'peso_cx': 20.000 },
    'COUVE': { 'unidade': 'MOE', 'preco': 9.00, 'peso_cx': 2.000 },
    'COUVE FLOR': { 'unidade': 'PC', 'preco': 20.00, 'peso_cx': 8.000 },
    'FARINHA DE MANDIOCA': { 'unidade': 'KG', 'preco': 17.00 },
    'INHAME': { 'unidade': 'KG', 'preco': 13.00, 'peso_cx': 20.000 },
    'JILO': { 'unidade': 'KG', 'preco': 25.00, 'peso_cx': 15.000 },
    'KIWI': { 'unidade': 'KG', 'preco': 60.00, 'peso_cx': 10.000 },
    'LARANJA': { 'unidade': 'KG', 'preco': 8.00, 'peso_cx': 20.000 },
    'LIMAO': { 'unidade': 'KG', 'preco': 14.00, 'peso_cx': 18.000 },
    'MACA': { 'unidade': 'KG', 'preco': 14.00, 'peso_cx': 20.000 },
    'MAMAO': { 'unidade': 'KG', 'preco': 20.00, 'peso_cx': 8.000 },
    'MAMAO PAPAIA': { 'unidade': 'KG', 'preco': 20.00, 'peso_cx': 8.000 },
    'MANDIOCA': { 'unidade': 'KG', 'preco': 9.33, 'peso_cx': 20.000 },
    'MANGA': { 'unidade': 'KG', 'preco': 15.00, 'peso_cx': 6.000 },
    'MARACUJA': { 'unidade': 'KG', 'preco': 20.00, 'peso_cx': 10.000 },
    'MELANCIA': { 'unidade': 'KG', 'preco': 6.00, 'peso_cx': 18.000 },
    'MELAO': { 'unidade': 'KG', 'preco': 16.67, 'peso_cx': 18.000 },
    'MEXERICA PONKAN': { 'unidade': 'KG', 'preco': 15.00, 'peso_cx': 18.000 },
    'MORANGO': { 'unidade': 'KG', 'preco': 60.00, 'peso_cx': 2.000 },
    'OVOS': { 'unidade': 'DZ', 'preco': 6.20 },
    'OVOS DE CODORNA': { 'unidade': 'UN', 'preco': 10.30 },
    'PEPINO': { 'unidade': 'KG', 'preco': 25.00, 'peso_cx': 20.000 },
    'PERA': { 'unidade': 'KG', 'preco': 35.00, 'peso_cx': 18.000 },
    'PESSEGO': { 'unidade': 'KG', 'preco': 60.00, 'peso_cx': 8.000 },
    'PIMENTA ARDIDA': { 'unidade': 'KG', 'preco': 70.00, 'peso_cx': 5.000 },
    'PIMENTA DE CHEIRO': { 'unidade': 'KG', 'preco': 70.00, 'peso_cx': 5.000 },
    'PIMENTAO': { 'unidade': 'KG', 'preco': 5.70, 'peso_cx': 10.000 },
    'POLPA DE FRUTA MARACUJA': { 'unidade': 'UN', 'preco': 53.33 },
    'POLPA DE FRUTA TAMARINDO': { 'unidade': 'UN', 'preco': 46.67 },
    'QUIABO': { 'unidade': 'KG', 'preco': 6.30, 'peso_cx': 12.000 },
    'REPOLHO': { 'unidade': 'KG', 'preco': 9.00, 'peso_cx': 25.000 },
    'TOMATE': { 'unidade': 'KG', 'preco': 14.67, 'peso_cx': 20.000 },
    'UVA': { 'unidade': 'KG', 'preco': 20.00, 'peso_cx': 8.000 },
    'VAGEM': { 'unidade': 'KG', 'preco': 20.60, 'peso_cx': 8.000 },
};

// Estimativa de peso médio (em KG) de uma unidade para conversão
// Valores baseados na lista original "peso_un" do cliente
export const PESO_MEDIO_UNITARIO_KG: { [key: string]: number } = {
    'ABACATE': 0.500,
    'ABACAXI': 1.200,
    'ABOBORA CABOTIA': 2.500,
    'ABOBRINHA VERDE': 0.300,
    'ALHO': 0.010, // Cabeça
    'AMEIXA': 0.050,
    'BANANA FRITAR': 0.800, // BANANA TERRA
    'BANANA MACA': 0.150, // BANANA
    'BANANA MARMELA': 0.150,
    'BANANA PRATA': 0.150,
    'BATATA DOCE': 0.300,
    'BATATINHA': 0.200, // BATATA
    'BERINJELA': 0.300,
    'BETERRABA': 0.200,
    'BROCOLIS': 0.500,
    'CAQUI': 0.150,
    'CARA': 0.500,
    'CEBOLA': 0.150,
    'CENOURA': 0.180,
    'CHEIRO VERDE': 0.100, // CHEIRO VERDE COM COENTRO
    'CHUCHU': 0.300,
    'COUVE': 0.100,
    'COUVE FLOR': 0.500,
    'FARINHA DE MANDIOCA': 1.000,
    'INHAME': 0.200,
    'JILO': 0.050,
    'KIWI': 0.100,
    'LARANJA': 0.200,
    'LIMAO': 0.100,
    'MACA': 0.400,
    'MAMAO': 1.500,
    'MAMAO PAPAIA': 0.400, // Mantido menor pois papaia é menor, embora original MAMAO fosse 1.5
    'MANDIOCA': 1.000,
    'MANGA': 0.400,
    'MARACUJA': 0.200,
    'MELANCIA': 18.000, // Valor original peso_un
    'MELAO': 2.000,
    'MEXERICA PONKAN': 0.150, // MEXERICA
    'CARTELA DE MILHO VERDE': 0.500, // MILHO VERDE
    'MORANGO': 0.250,
    'PEPINO': 0.250,
    'PERA': 0.200,
    'PESSEGO': 0.200,
    'PIMENTA ARDIDA': 0.010,
    'PIMENTA DE CHEIRO': 0.010,
    'PIMENTAO': 0.200,
    'POLPA DE FRUTA MARACUJA': 1.000,
    'POLPA DE FRUTA TAMARINDO': 1.000,
    'QUIABO': 0.500,
    'REPOLHO': 1.500,
    'TOMATE': 0.150,
    'UVA': 0.500,
    'VAGEM': 0.500,
};

export const MAPEAMENTO_NOMES: { [key: string]: string } = {
    // Mapeamentos para garantir que nomes comuns encontrem os produtos da lista
    'ABOBORA': 'ABOBORA CABOTIA',
    'KABUTIA': 'ABOBORA CABOTIA',
    'ABOBORA CABUTIA': 'ABOBORA CABOTIA',
    'ABOBRINHA': 'ABOBRINHA VERDE',
    'ALFACE': 'ALFACE GRANDE',
    'ALFACE CRESPA': 'ALFACE GRANDE',
    'ALFACE AMERICANA': 'ALFACE GRANDE',
    'ALFACE LISA': 'ALFACE GRANDE',
    'BANANA': 'BANANA PRATA', // Default para Banana
    'BANANA NANICA': 'BANANA PRATA',
    'BANANA DE FRITAR': 'BANANA FRITAR',
    'BANANA TERRA': 'BANANA FRITAR',
    'BATATA': 'BATATINHA',
    'BATATA INGLESA': 'BATATINHA',
    'BROCOLI': 'BROCOLIS',
    'CARÁ': 'CARA',
    'CHEIRO-VERDE': 'CHEIRO VERDE',
    'COENTRO': 'CHEIRO VERDE',
    'SALSINHA': 'CHEIRO VERDE',
    'COUVE-FLOR': 'COUVE FLOR',
    'FARINHA': 'FARINHA DE MANDIOCA',
    'JILÓ': 'JILO',
    'LIMÃO': 'LIMAO',
    'LIMOES': 'LIMAO',
    'MAÇÃ': 'MACA',
    'MAÇAS': 'MACA',
    'MAMÃO': 'MAMAO',
    'MAMOES': 'MAMAO',
    'MANDIOCAS': 'MANDIOCA',
    'AIPIM': 'MANDIOCA',
    'MACAXEIRA': 'MANDIOCA',
    'MELÃO': 'MELAO',
    'MEXERICA': 'MEXERICA PONKAN',
    'TANGERINA': 'MEXERICA PONKAN',
    'PONKAN': 'MEXERICA PONKAN',
    'MILHO': 'CARTELA DE MILHO VERDE',
    'MILHO VERDE': 'CARTELA DE MILHO VERDE',
    'ESPIGA DE MILHO': 'CARTELA DE MILHO VERDE',
    'OVO': 'OVOS',
    'PIMENTÃO': 'PIMENTAO',
    'PIMENTA': 'PIMENTA DE CHEIRO', // Default arriscado, mas comum
    'POLPA DE MARACUJA': 'POLPA DE FRUTA MARACUJA',
    'POLPA DE TAMARINDO': 'POLPA DE FRUTA TAMARINDO',
    'TAMARINDO': 'POLPA DE FRUTA TAMARINDO',
    'VARGEM': 'VAGEM',
};

const normalizarTexto = (texto: string) => texto.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();

export const findProductData = (name: string): ProductData | undefined => {
    const normalizedName = normalizarTexto(name);
    
    // Direct match
    if (DADOS_PRODUTOS[normalizedName]) {
        return DADOS_PRODUTOS[normalizedName];
    }
    
    // Alias match
    if (MAPEAMENTO_NOMES[normalizedName] && DADOS_PRODUTOS[MAPEAMENTO_NOMES[normalizedName]]) {
        return DADOS_PRODUTOS[MAPEAMENTO_NOMES[normalizedName]];
    }

    // Check official names directly
    const officialNameMatch = Object.keys(DADOS_PRODUTOS).find(officialName => normalizarTexto(officialName) === normalizedName);
    if(officialNameMatch) return DADOS_PRODUTOS[officialNameMatch];
    
    // Check aliases
    const aliasMatch = Object.keys(MAPEAMENTO_NOMES).find(alias => normalizarTexto(alias) === normalizedName);
    if(aliasMatch) return DADOS_PRODUTOS[MAPEAMENTO_NOMES[aliasMatch]];

    return undefined;
};


export const getOfficialProductName = (name: string): string => {
    const normalizedName = normalizarTexto(name);

    // Check strict direct match first
    if (DADOS_PRODUTOS[normalizedName]) return normalizedName;
    if (MAPEAMENTO_NOMES[normalizedName]) return MAPEAMENTO_NOMES[normalizedName];

    // Check fuzzy/normalized keys
    const officialNameMatch = Object.keys(DADOS_PRODUTOS).find(officialName => normalizarTexto(officialName) === normalizedName);
    if (officialNameMatch) return officialNameMatch;

    const aliasMatchKey = Object.keys(MAPEAMENTO_NOMES).find(alias => normalizarTexto(alias) === normalizedName);
    if(aliasMatchKey) return MAPEAMENTO_NOMES[aliasMatchKey];
    
    return name; // fallback
};
