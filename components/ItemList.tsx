
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
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                Nenhum item na lista ainda.
            </div>
        );
    }
    
    const sortedItems = [...items].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Produto</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Qtd</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Preço</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                        <th className="px-1 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ação</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedItems.map(item => (
                        <ItemRow key={item.id} item={item} onUpdateItem={onUpdateItem} onDeleteItem={onDeleteItem} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
