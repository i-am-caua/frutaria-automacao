import React, { useState } from 'react';
import { ShoppingListItem } from '../types';
import { Loader } from './Loader';
import { ItemList } from './ItemList';
import { AddItemForm } from './AddItemForm';
import { CsvIcon } from './icons/CsvIcon';
import { PdfIcon } from './icons/PdfIcon';
import { TrashIcon } from './icons/TrashIcon';
import { generateCsv, generatePdf } from '../utils/exportUtils';
import { saveOrder } from '../services/firebaseService';
import { auth } from '../firebase';

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
    const [isSaving, setIsSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSaveOrder = async () => {
        setStatusMessage(null);
        if (!auth.currentUser) {
            setStatusMessage({
                type: 'error',
                text: 'Autentique-se no topo da página para salvar pedidos no histórico.',
            });
            return;
        }
        setIsSaving(true);
        try {
            await saveOrder(items);
            setStatusMessage({
                type: 'success',
                text: 'Pedido registrado com sucesso no histórico.',
            });
            setTimeout(() => {
                onClear();
                setStatusMessage(null);
            }, 1500);
        } catch (err) {
            setStatusMessage({
                type: 'error',
                text: 'Não foi possível salvar o pedido. Verifique sua conexão e tente novamente.',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalVolume = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col h-full">
            <div className="flex items-baseline justify-between pb-4 mb-5 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
                        02. Revisão e Fechamento
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Ajuste quantidades convertidas, adicione itens avulsos e exporte a cotação
                    </p>
                </div>
                {items.length > 0 && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums whitespace-nowrap shrink-0">
                        {items.length} {items.length === 1 ? 'item' : 'itens'} · {totalVolume.toFixed(2)} un/kg
                    </span>
                )}
            </div>

            {isLoading && (
                <div className="flex-grow flex justify-center items-center py-16">
                    <Loader />
                </div>
            )}

            {error && (
                <div className="mb-5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm" role="alert">
                    <span className="font-semibold">Falha no processamento: </span>
                    <span>{error}</span>
                </div>
            )}

            {statusMessage && (
                <div
                    className={`mb-5 px-4 py-3 rounded-lg text-sm border ${
                        statusMessage.type === 'success'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300'
                    }`}
                    role="status"
                >
                    {statusMessage.text}
                </div>
            )}

            {!isLoading && (
                <div className="flex-grow flex flex-col justify-between space-y-6">
                    <div>
                        {ignoredLines.length > 0 && (
                            <div className="mb-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-200 px-4 py-3 rounded-lg">
                                <h3 className="text-xs font-semibold">Linhas não identificadas automaticamente:</h3>
                                <ul className="list-disc list-inside text-xs mt-1.5 space-y-0.5 font-mono">
                                    {ignoredLines.map((line, i) => <li key={i}>{line}</li>)}
                                </ul>
                            </div>
                        )}

                        {!showOutput && items.length === 0 ? (
                            <div className="py-12 px-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Nenhum item na cotação atual
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                                    Processe uma lista ao lado, envie uma foto/PDF do pedido ou insira produtos manualmente abaixo.
                                </p>
                            </div>
                        ) : (
                            <ItemList items={items} onUpdateItem={onUpdateItem} onDeleteItem={onDeleteItem} />
                        )}

                        {items.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-baseline justify-between">
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    Valor Total Estimado
                                </span>
                                <span className="font-mono text-xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                                    {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-5">
                        <AddItemForm onAddItem={onAddItem} />

                        {items.length > 0 && (
                            <div className="pt-5 border-t border-slate-200 dark:border-slate-800 space-y-4">
                                <div>
                                    <label htmlFor="fileName" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                                        Identificação do arquivo para exportação (opcional)
                                    </label>
                                    <input
                                        type="text"
                                        id="fileName"
                                        value={customFileName}
                                        onChange={(e) => setCustomFileName(e.target.value)}
                                        placeholder="Ex: Pedido_Restaurante_Central"
                                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/60 dark:bg-slate-950/60 text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none transition-colors"
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2.5">
                                    <button
                                        onClick={handleSaveOrder}
                                        disabled={isSaving}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center whitespace-nowrap shrink-0 disabled:opacity-50"
                                    >
                                        {isSaving ? 'Registrando pedido...' : 'Aprovar e Salvar Pedido'}
                                    </button>
                                    <button
                                        onClick={() => generateCsv(items, customFileName)}
                                        className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium py-2.5 px-3.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
                                    >
                                        <CsvIcon />
                                        <span>Exportar CSV</span>
                                    </button>
                                    <button
                                        onClick={() => generatePdf(items, customFileName)}
                                        className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium py-2.5 px-3.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
                                    >
                                        <PdfIcon />
                                        <span>Exportar PDF</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            onClear();
                                            setCustomFileName('');
                                            setStatusMessage(null);
                                        }}
                                        className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-medium py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
                                        title="Limpar todos os itens"
                                    >
                                        <TrashIcon />
                                        <span>Limpar</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};