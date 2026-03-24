
import { ShoppingListItem } from "../types";
import { findProductData, getOfficialProductName } from "../constants";

declare const pdfjsLib: any;

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]); // remove the "data:mime/type;base64," part
        };
        reader.onerror = error => reject(error);
    });
};

export const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
    }
    return fullText;
};

export const parseCsv = (file: File): Promise<ShoppingListItem[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const lines = text.split('\n').slice(1); // Skip header
                const items: ShoppingListItem[] = [];

                lines.forEach(line => {
                    if (!line.trim()) return;
                    const columns = line.split(/[;,]/);
                    if (columns.length >= 2) {
                        const name = columns[0].trim().replace(/"/g, '');
                        const quantity = parseFloat(columns[1].trim().replace(/"/g, '').replace(',', '.'));
                        
                        if (name && !isNaN(quantity)) {
                            const officialName = getOfficialProductName(name);
                            const productData = findProductData(officialName);
                            items.push({
                                id: `${Date.now()}-${officialName}-${Math.random()}`,
                                name: officialName,
                                quantity,
                                unit: productData?.unidade || 'UN',
                                price: productData?.preco || 0
                            });
                        }
                    }
                });
                resolve(items);
            } catch (error) {
                reject(new Error("Failed to parse CSV file."));
            }
        };
        reader.onerror = () => reject(new Error("Failed to read CSV file."));
        reader.readAsText(file);
    });
};
