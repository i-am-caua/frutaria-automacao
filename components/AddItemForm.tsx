import React, { useState } from 'react';
import { DADOS_PRODUTOS, findProductData, getOfficialProductName } from '../constants';

interface AddItemFormProps {
    onAddItem: (item: { name: string; quantity: number; unit: string; price: number }) => void;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({ onAddItem }) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [feedback, setFeedback] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback(null);
        const qty = parseFloat(quantity);
        if (!name.trim() || isNaN(qty) || qty <= 0) {
            setFeedback('Informe um produto válido do catálogo e uma quantidade maior que zero.');
            return;
        }

        const officialName = getOfficialProductName(name);
        const productData = findProductData(officialName);
        if (productData) {
            onAddItem({
                name: officialName,
                quantity: qty,
                unit: productData.unidade,
                price: productData.preco,
            });
            setName('');
            setQuantity('');
        } else {
            setFeedback(`Produto "${name}" não consta na tabela de preços padrão.`);
        }
    };
    
    return (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Inclusão Manual de Item do Catálogo
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                <div className="sm:col-span-6">
                    <label htmlFor="novo-produto-nome" className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Produto
                    </label>
                    <input
                        type="text"
                        id="novo-produto-nome"
                        list="produtos-datalist"
                        className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/60 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none transition-colors"
                        placeholder="Buscar no catálogo..."
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (feedback) setFeedback(null);
                        }}
                    />
                    <datalist id="produtos-datalist">
                        {Object.keys(DADOS_PRODUTOS).sort().map(nome => (
                            <option key={nome} value={nome} />
                        ))}
                    </datalist>
                </div>
                <div className="sm:col-span-3">
                    <label htmlFor="novo-produto-qtd" className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Qtd.
                    </label>
                    <input
                        type="number"
                        id="novo-produto-qtd"
                        className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/60 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none transition-colors"
                        placeholder="0.00"
                        value={quantity}
                        onChange={(e) => {
                            setQuantity(e.target.value);
                            if (feedback) setFeedback(null);
                        }}
                        step="0.1"
                        min="0"
                    />
                </div>
                <div className="sm:col-span-3">
                    <button
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-semibold py-2.5 px-4 rounded-lg transition-colors whitespace-nowrap shrink-0"
                    >
                        Incluir Item
                    </button>
                </div>
            </form>
            {feedback && (
                <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
                    {feedback}
                </p>
            )}
        </div>
    );
};
