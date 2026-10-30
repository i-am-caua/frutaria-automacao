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
    const [statusFilter, setStatusFilter] = useState<'Todos' | 'Pendente' | 'Aprovado' | 'Cancelado'>('Todos');

    const fetchOrders = async () => {
        if (!auth.currentUser) return;
        setIsLoading(true);
        try {
            const data = await getOrders();
            setOrders(data);
            setError(null);
        } catch (err) {
            setError('Não foi possível carregar o histórico de pedidos.');
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
            setError('Erro ao atualizar o status do pedido.');
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

    const filteredOrders = statusFilter === 'Todos'
        ? orders
        : orders.filter(o => o.status === statusFilter);

    const getStatusColorClass = (status: string) => {
        if (status === 'Aprovado') return 'text-emerald-700 dark:text-emerald-400';
        if (status === 'Pendente') return 'text-amber-700 dark:text-amber-400';
        return 'text-red-700 dark:text-red-400';
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Histórico de Pedidos Registrados
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Acompanhamento de cotações salvas, volumes consolidados e status de aprovação
                    </p>
                </div>

                {isAuthenticated && (
                    <div className="flex items-center gap-3">
                        {/* Functional interactive segmented filter */}
                        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            {(['Todos', 'Pendente', 'Aprovado', 'Cancelado'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setStatusFilter(tab)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                                        statusFilter === tab
                                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={fetchOrders}
                            className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
                        >
                            Atualizar
                        </button>
                    </div>
                )}
            </div>

            {!isAuthenticated ? (
                <div className="py-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Sessão não autenticada
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Acesse sua conta no botão superior direito para consultar e gerenciar pedidos salvos.
                    </p>
                </div>
            ) : isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <Loader />
                </div>
            ) : error ? (
                <div className="py-8 text-center">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    <button
                        onClick={fetchOrders}
                        className="mt-3 text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline"
                    >
                        Tentar novamente
                    </button>
                </div>
            ) : (
                <>
                    {/* Clean unboxed KPI strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Total de Pedidos</p>
                            <p className="font-mono text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
                                {orders.length}
                            </p>
                        </div>
                        <div className="sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-6">
                            <p className="text-xs text-slate-500 dark:text-slate-400">Aguardando Aprovação</p>
                            <p className="font-mono text-2xl font-semibold text-amber-700 dark:text-amber-400 mt-1 tabular-nums">
                                {orders.filter(o => o.status === 'Pendente').length}
                            </p>
                        </div>
                        <div className="sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-6">
                            <p className="text-xs text-slate-500 dark:text-slate-400">Pedidos Aprovados</p>
                            <p className="font-mono text-2xl font-semibold text-emerald-700 dark:text-emerald-400 mt-1 tabular-nums">
                                {orders.filter(o => o.status === 'Aprovado').length}
                            </p>
                        </div>
                    </div>

                    {filteredOrders.length === 0 ? (
                        <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                            Nenhum pedido encontrado para o filtro selecionado.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400">
                                        <th className="py-3 px-4">Data de Registro</th>
                                        <th className="py-3 px-4">Variedade</th>
                                        <th className="py-3 px-4 text-right">Volume Total</th>
                                        <th className="py-3 px-4 text-right">Situação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                                    {filteredOrders.map(order => (
                                        <tr
                                            key={order.id}
                                            onClick={() => setSelectedOrder(order)}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                                        >
                                            <td className="py-3 px-4 font-mono text-xs text-slate-700 dark:text-slate-300 tabular-nums">
                                                {new Date(order.createdAt).toLocaleString('pt-BR')}
                                            </td>
                                            <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400">
                                                {order.items.length} {order.items.length === 1 ? 'produto' : 'produtos'}
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono text-sm font-medium text-slate-900 dark:text-slate-100 tabular-nums">
                                                {order.totalItems.toFixed(2)}
                                            </td>
                                            <td className="py-3 px-4 text-right text-xs font-medium">
                                                <span className={getStatusColorClass(order.status)}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {selectedOrder && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-xl max-w-lg w-full max-h-[85vh] flex flex-col">
                        <div className="flex items-baseline justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                                    Detalhes do Pedido
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums mt-0.5">
                                    Registrado em {new Date(selectedOrder.createdAt).toLocaleString('pt-BR')}
                                </p>
                            </div>
                            <span className={`text-xs font-medium ${getStatusColorClass(selectedOrder.status)}`}>
                                {selectedOrder.status}
                            </span>
                        </div>

                        <div className="overflow-y-auto flex-grow mb-5 border border-slate-200 dark:border-slate-800 rounded-lg">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                                    <tr className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                        <th className="py-2 px-3">Produto</th>
                                        <th className="py-2 px-3 text-right">Quantidade</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-sm">
                                    {selectedOrder.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="py-2 px-3 text-slate-800 dark:text-slate-200">{item.name}</td>
                                            <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                                                {item.quantity}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between text-sm pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
                            <span className="text-slate-500 dark:text-slate-400">Volume Total Consolidado</span>
                            <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                                {selectedOrder.totalItems.toFixed(2)}
                            </span>
                        </div>

                        <div className="mb-5">
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                                Alterar situação do pedido
                            </label>
                            <select
                                value={selectedOrder.status}
                                onChange={(e) => handleStatusChange(selectedOrder.id!, e.target.value)}
                                disabled={isUpdatingStatus}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:border-emerald-600 outline-none"
                            >
                                <option value="Pendente">Pendente</option>
                                <option value="Aprovado">Aprovado</option>
                                <option value="Cancelado">Cancelado</option>
                            </select>
                        </div>

                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-semibold py-2.5 rounded-lg transition-colors"
                        >
                            Fechar Detalhes
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
