
import React, { useState } from 'react';
import { ShoppingListItem } from '../types';
import { Loader } from './Loader';
import { ItemList } from './ItemList';
import { AddItemForm } from './AddItemForm';
import { CsvIcon } from './icons/CsvIcon';
import { PdfIcon } from './icons/PdfIcon';
import { TrashIcon } from './icons/TrashIcon';
import { generateCsv, generatePdf } from '../utils/exportUtils';

interface OutputPanelProps {
    items: ShoppingListItem[];
    isLoading: boolean;
    error: string | null;
    ignoredLines: string[];
    showOutput: boolean;
    onUpdateItem: (id: string, newQuantity: number) => void;
    onDeleteItem: (id: string) => void;
    onAddItem: (item: Omit<ShoppingListItem, 'id'>) => void;
    onClear: () => void;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
    items, isLoading, error, ignoredLines, showOutput,
    onUpdateItem, onDeleteItem, onAddItem, onClear
}) => {
    const [customFileName, setCustomFileName] = useState('');

    if (!showOutput) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center justify-center h-full min-h-[300px]">
                <div className="text-center text-gray-500 dark:text-gray-400">
                    <h2 className="text-2xl font-semibold mb-2">Sua lista aparecerá aqui</h2>
                    <p>Cole um texto ou carregue um arquivo para começar.</p>
                </div>
            </div>
        );
    }
    
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">2. Revise e Exporte</h2>
            
            {isLoading && <div className="flex justify-center items-center h-40"><Loader /></div>}

            {error && <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Erro!</strong>
                <span className="block sm:inline ml-2">{error}</span>
            </div>}

            {!isLoading && !error && (
                <>
                    {ignoredLines.length > 0 && (
                         <div className="mb-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-600 text-yellow-800 dark:text-yellow-200 px-4 py-3 rounded">
                            <h3 className="font-bold">⚠️ Itens não reconhecidos:</h3>
                            <ul className="list-disc list-inside text-sm mt-2">
                                {ignoredLines.map((line, i) => <li key={i}>{line}</li>)}
                            </ul>
                        </div>
                    )}
                    
                    <ItemList items={items} onUpdateItem={onUpdateItem} onDeleteItem={onDeleteItem} />
                    
                    {items.length > 0 && (
                        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg text-right">
                             <p className="text-lg font-bold">TOTAL GERAL ESTIMADO: 
                                <span className="text-blue-600 dark:text-blue-400 ml-2">
                                    {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            </p>
                        </div>
                    )}

                    <AddItemForm onAddItem={onAddItem} />

                    {items.length > 0 && (
                        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="mb-4">
                                <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Nome do Arquivo (Opcional):
                                </label>
                                <input
                                    type="text"
                                    id="fileName"
                                    value={customFileName}
                                    onChange={(e) => setCustomFileName(e.target.value)}
                                    placeholder="Ex: Compras da Semana"
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={() => generateCsv(items, customFileName)} className="flex-1 bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center">
                                    <CsvIcon /> <span className="ml-2">Gerar CSV</span>
                                </button>
                                <button onClick={() => generatePdf(items, customFileName)} className="flex-1 bg-orange-600 text-white font-bold py-3 px-4 rounded-md hover:bg-orange-700 transition-colors flex items-center justify-center">
                                    <PdfIcon /> <span className="ml-2">Gerar PDF</span>
                                </button>
                                <button onClick={() => { onClear(); setCustomFileName(''); }} className="flex-1 bg-red-500 text-white font-bold py-3 px-4 rounded-md hover:bg-red-600 transition-colors flex items-center justify-center">
                                    <TrashIcon /> <span className="ml-2">Limpar Tudo</span>
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};