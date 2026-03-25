import React, { useEffect, useState } from 'react';
import { getOrders, Order } from '../services/firebaseService';
import { Loader } from './Loader';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const OrdersHistory: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const fetchOrders = async () => {
        if (!auth.currentUser) return;
        setIsLoading(true);
        try {
            const data = await getOrders();
            setOrders(data);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar o histórico de pedidos.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
                fetchOrders();
            } else {
                setIsAuthenticated(false);
                setOrders([]);
                setIsLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    if (!isAuthenticated) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mt-8 text-center text-gray-500">
                Faça login para ver seu histórico de pedidos.
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mt-8 flex justify-center items-center h-40">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mt-8 text-center text-red-500">
                {error}
                <button onClick={fetchOrders} className="ml-4 underline text-blue-500">Tentar novamente</button>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
            <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                <h2 className="text-2xl font-semibold">Histórico de Pedidos</h2>
                <button 
                    onClick={fetchOrders} 
                    className="text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded transition-colors"
                >
                    Atualizar
                </button>
            </div>
            
            {orders.length === 0 ? (
                <div className="text-gray-500 dark:text-gray-400 p-4 text-center">Nenhum pedido encontrado.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                                <th className="py-2 px-4 font-medium">Data</th>
                                <th className="py-2 px-4 font-medium">Itens Totais</th>
                                <th className="py-2 px-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                    <td className="py-3 px-4 text-sm">
                                        {new Date(order.createdAt).toLocaleString('pt-BR')}
                                    </td>
                                    <td className="py-3 px-4 text-sm font-semibold">
                                        {order.totalItems.toFixed(2)}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
