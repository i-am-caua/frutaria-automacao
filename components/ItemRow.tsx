import React, { useState, useEffect } from 'react';
import { ShoppingListItem } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface ItemRowProps {
    item: ShoppingListItem;
    onUpdateItem: (id: string, newQuantity: number) => void;
    onDeleteItem: (id: string) => void;
}

const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const ItemRow: React.FC<ItemRowProps> = ({ item, onUpdateItem, onDeleteItem }) => {
    const [inputValue, setInputValue] = useState(item.quantity.toString());
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (!isFocused) {
            setInputValue(parseFloat(item.quantity.toFixed(2)).toString());
        }
    }, [item.quantity, isFocused]);
    
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        const parsed = parseFloat(newValue);
        if (!isNaN(parsed)) {
            onUpdateItem(item.id, parsed);
        } else if (newValue === '') {
            onUpdateItem(item.id, 0);
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
        setInputValue(parseFloat(item.quantity.toFixed(2)).toString());
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const totalItem = item.quantity * item.price;

    return (
        <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
            <td className="px-4 py-2.5 whitespace-nowrap">
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Unidade: {item.unit}</div>
            </td>
            <td className="px-4 py-2.5 whitespace-nowrap text-right">
                <input
                    type="number"
                    value={inputValue}
                    onChange={handleQuantityChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onWheel={(e) => e.currentTarget.blur()}
                    className="w-20 px-2.5 py-1 text-right font-mono text-sm tabular-nums border border-slate-200 dark:border-slate-700 rounded-md bg-slate-50/60 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none transition-colors"
                    step="0.01"
                    min="0"
                />
            </td>
            <td className="px-4 py-2.5 whitespace-nowrap text-right font-mono text-xs text-slate-600 dark:text-slate-400 tabular-nums">
                {formatCurrency(item.price)}
            </td>
            <td className="px-4 py-2.5 whitespace-nowrap text-right font-mono text-sm font-medium text-slate-900 dark:text-slate-100 tabular-nums">
                {formatCurrency(totalItem)}
            </td>
            <td className="px-3 py-2.5 whitespace-nowrap text-center">
                <button
                    onClick={() => onDeleteItem(item.id)}
                    className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    aria-label={`Remover ${item.name}`}
                >
                    <TrashIcon className="h-4 w-4" />
                </button>
            </td>
        </tr>
    );
};
