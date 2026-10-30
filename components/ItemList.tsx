import React from 'react';
import { ShoppingListItem } from '../types';
import { ItemRow } from './ItemRow';

interface ItemListProps {
    items: ShoppingListItem[];
    onUpdateItem: (id: string, newQuantity: number) => void;
    onDeleteItem: (id: string) => void;
}

export const ItemList: React.FC<ItemListProps> = ({ items, onUpdateItem, onDeleteItem }) => {
    if (items.length === 0) {
        return (
            <div className="text-center py-10 text-sm text-slate-500 dark:text-slate-400">
                Nenhum item adicionado à lista.
            </div>
        );
    }
    
    const sortedItems = [...items].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="overflow-x-auto max-h-[380px] overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-lg">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-950 sticky top-0 z-10">
                    <tr>
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Produto</th>
                        <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-500 dark:text-slate-400">Quantidade</th>
                        <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-500 dark:text-slate-400">Unitário</th>
                        <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-500 dark:text-slate-400">Subtotal</th>
                        <th className="px-3 py-2.5 text-center text-xs font-medium text-slate-500 dark:text-slate-400 w-12"></th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800/70">
                    {sortedItems.map(item => (
                        <ItemRow key={item.id} item={item} onUpdateItem={onUpdateItem} onDeleteItem={onDeleteItem} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
