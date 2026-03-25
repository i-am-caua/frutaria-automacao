import React, { useEffect, useState } from 'react';
import { getOrders, Order, updateOrderStatus } from '../services/firebaseService';
import { Loader } from './Loader';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const OrdersHistory: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

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

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        setIsUpdatingStatus(true);
        try {
            await updateOrderStatus(orderId, newStatus);
            await fetchOrders();
            setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
        } catch (err) {
            alert('Erro ao atualizar status.');
        } finally {
            setIsUpdatingStatus(false);
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
            <h2 className="text-2xl font-semibold mb-6">Histórico de Pedidos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 dark:text-blue-300">Total de Pedidos</p>
                    <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
                    <p className="text-sm text-yellow-600 dark:text-yellow-300">Pendentes</p>
                    <p className="text-2xl font-bold">{orders.filter(o => o.status === 'Pendente').length}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                    <p className="text-sm text-green-600 dark:text-green-300">Aprovados</p>
                    <p className="text-2xl font-bold">{orders.filter(o => o.status === 'Aprovado').length}</p>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                <h3 className="text-xl font-semibold">Lista de Pedidos</h3>
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
                                <tr key={order.id} onClick={() => setSelectedOrder(order)} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer">
                                    <td className="py-3 px-4 text-sm">
                                        {new Date(order.createdAt).toLocaleString('pt-BR')}
                                    </td>
                                    <td className="py-3 px-4 text-sm font-semibold">
                                        {order.totalItems.toFixed(2)}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${order.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : order.status === 'Aprovado' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-4">Detalhes do Pedido</h3>
                        <p className="text-sm text-gray-500 mb-4">Data: {new Date(selectedOrder.createdAt).toLocaleString('pt-BR')}</p>
                        
                        <table className="w-full mb-4">
                            <thead>
                                <tr className="text-left text-sm text-gray-600 dark:text-gray-300">
                                    <th className="py-1">Item</th>
                                    <th className="py-1">Qtd</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder.items.map((item, idx) => (
                                    <tr key={idx} className="border-t border-gray-100 dark:border-gray-700">
                                        <td className="py-2">{item.name}</td>
                                        <td className="py-2">{item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        <p className="font-bold mb-4">Total de Itens: {selectedOrder.totalItems.toFixed(2)}</p>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Status:</label>
                            <select 
                                value={selectedOrder.status} 
                                onChange={(e) => handleStatusChange(selectedOrder.id!, e.target.value)}
                                disabled={isUpdatingStatus}
                                className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
                            >
                                <option value="Pendente">Pendente</option>
                                <option value="Aprovado">Aprovado</option>
                                <option value="Cancelado">Cancelado</option>
                            </select>
                        </div>
                        
                        <button 
                            onClick={() => setSelectedOrder(null)}
                            className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 py-2 rounded transition-colors"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
