
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
    // Estado local para permitir digitação livre sem formatação forçada a cada tecla
    const [inputValue, setInputValue] = useState(item.quantity.toString());
    const [isFocused, setIsFocused] = useState(false);

    // Sincroniza o estado local com a prop item.quantity quando o item muda externamente
    // Mas APENAS se o usuário não estiver editando o campo neste momento
    useEffect(() => {
        if (!isFocused) {
            // Formata para remover zeros desnecessários (ex: 1.50 vira 1.5) mas mantém precisão se necessário
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
            // Opcional: permitir que fique vazio visualmente, mas tratar como 0 ou manter último valor válido no estado global
             onUpdateItem(item.id, 0);
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
        // Ao sair do campo, garante a formatação limpa
        setInputValue(parseFloat(item.quantity.toFixed(2)).toString());
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const totalItem = item.quantity * item.price;

    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
            <td className="px-4 py-2 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{item.unit}</div>
            </td>
            <td className="px-4 py-2 whitespace-nowrap">
                <input
                    type="number"
                    value={inputValue}
                    onChange={handleQuantityChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onWheel={(e) => e.currentTarget.blur()}
                    className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    step="0.01"
                    min="0"
                />
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{formatCurrency(item.price)}</td>
            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{formatCurrency(totalItem)}</td>
            <td className="px-1 py-2 whitespace-nowrap text-center">
                <button
                    onClick={() => onDeleteItem(item.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    aria-label={`Remover ${item.name}`}
                >
                    <TrashIcon />
                </button>
            </td>
        </tr>
    );
};
