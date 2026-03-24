
import React, { useState } from 'react';
import { DADOS_PRODUTOS, findProductData, getOfficialProductName } from '../constants';

interface AddItemFormProps {
    onAddItem: (item: { name: string; quantity: number; unit: string; price: number }) => void;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({ onAddItem }) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const qty = parseFloat(quantity);
        if (!name || isNaN(qty) || qty <= 0) {
            alert('Por favor, preencha o nome do produto e uma quantidade válida.');
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
            alert(`Produto '${name}' não encontrado. Tente adicionar como um item personalizado.`);
        }
    };
    
    return (
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-lg font-semibold mb-2">Adicionar Novo Item</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div className="md:col-span-2">
                    <label htmlFor="novo-produto-nome" className="text-sm font-medium">Nome do Produto</label>
                    <input
                        type="text"
                        id="novo-produto-nome"
                        list="produtos-datalist"
                        className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                        placeholder="Digite o nome..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <datalist id="produtos-datalist">
                        {Object.keys(DADOS_PRODUTOS).sort().map(nome => (
                            <option key={nome} value={nome} />
                        ))}
                    </datalist>
                </div>
                <div>
                    <label htmlFor="novo-produto-qtd" className="text-sm font-medium">Quantidade</label>
                    <input
                        type="number"
                        id="novo-produto-qtd"
                        className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                        placeholder="Ex: 5"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        step="0.1"
                    />
                </div>
                 <div className="md:col-span-3">
                    <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
                        Adicionar Item
                    </button>
                </div>
            </form>
        </div>
    );
};
