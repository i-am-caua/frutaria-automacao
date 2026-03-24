
import { ShoppingListItem } from '../types';

declare global {
    interface Window {
        jspdf: any;
    }
}

const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const getFilename = (userFileName: string | undefined, extension: string) => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
    let name = userFileName && userFileName.trim() !== '' ? userFileName.trim() : `Lista_de_Compras_${timestamp}`;
    
    // Ensure extension is correct
    if (!name.toLowerCase().endsWith(`.${extension}`)) {
        name = `${name}.${extension}`;
    }
    return name;
};

export const generateCsv = (items: ShoppingListItem[], fileName?: string) => {
    if (items.length === 0) return;

    let csvContent = "PRODUTOS;QUANTIDADE;UNIDADE;PREÇO P/ UNID.;VALOR TOTAL\n";
    let totalGeral = 0;

    items.forEach(item => {
        if (item.quantity > 0) {
            const totalItem = item.quantity * item.price;
            totalGeral += totalItem;

            const qtdFormatada = item.quantity.toFixed(2).replace('.', ',');
            const precoFormatado = `R$ ${item.price.toFixed(2)}`.replace('.', ',');
            const totalFormatado = `R$ ${totalItem.toFixed(2)}`.replace('.', ',');

            csvContent += `${item.name};${qtdFormatada};${item.unit};${precoFormatado};${totalFormatado}\n`;
        }
    });

    const totalGeralFinalFormatado = `R$ ${totalGeral.toFixed(2)}`.replace('.', ',');
    csvContent += `;;;TOTAL GERAL;${totalGeralFinalFormatado}\n`;

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const downloadName = getFilename(fileName, 'csv');
    
    link.setAttribute("href", url);
    link.setAttribute("download", downloadName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const generatePdf = (items: ShoppingListItem[], fileName?: string) => {
    if (items.length === 0) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const tableColumns = ['Produto', 'Qtd', 'Unid', 'Preço Unit.', 'Valor Total'];
    const tableRows: (string | number)[][] = [];
    let totalGeral = 0;

    items.forEach(item => {
        if (item.quantity > 0) {
            const totalItem = item.quantity * item.price;
            totalGeral += totalItem;

            tableRows.push([
                item.name,
                item.quantity.toFixed(2),
                item.unit,
                formatCurrency(item.price),
                formatCurrency(totalItem)
            ]);
        }
    });

    doc.autoTable({
        head: [tableColumns],
        body: tableRows,
        startY: 20,
        theme: 'striped',
        headStyles: { fillColor: [30, 64, 175] } // Tailwind's blue-700
    });

    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL GERAL ESTIMADO: ${formatCurrency(totalGeral)}`, 14, finalY + 15);

    const downloadName = getFilename(fileName, 'pdf');
    doc.save(downloadName);
};
