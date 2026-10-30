import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { ShoppingListItem } from './types';
import { parseShoppingListFromImage, parseShoppingListFromText } from './services/geminiService';
import { extractTextFromPdf, parseCsv } from './utils/fileUtils';
import { OrdersHistory } from './components/OrdersHistory';
import { testConnection } from './services/firebaseService';
import { DADOS_PRODUTOS, PESO_MEDIO_UNITARIO_KG } from './constants';
import { SunIcon } from './components/icons/SunIcon';
import { MoonIcon } from './components/icons/MoonIcon';

const App: React.FC = () => {
    const [items, setItems] = useState<ShoppingListItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [ignoredLines, setIgnoredLines] = useState<string[]>([]);
    const [showOutput, setShowOutput] = useState<boolean>(false);
    const [activeSection, setActiveSection] = useState<'workspace' | 'catalog' | 'history'>('workspace');
    const [catalogSearch, setCatalogSearch] = useState<string>('');
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    useEffect(() => {
        testConnection();
        const theme = localStorage.getItem('theme');
        if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
        setIsDarkMode(!isDarkMode);
    };

    const handleProcessing = async (processor: () => Promise<ShoppingListItem[]>) => {
        setIsLoading(true);
        setError(null);
        setIgnoredLines([]);
        setShowOutput(true);
        try {
            const newItems = await processor();
            
            setItems(prevItems => {
                const updatedItems = [...prevItems];
                newItems.forEach(newItem => {
                    const existingItemIndex = updatedItems.findIndex(item => item.name.toUpperCase() === newItem.name.toUpperCase());
                    if (existingItemIndex > -1) {
                        updatedItems[existingItemIndex].quantity += newItem.quantity;
                    } else {
                        updatedItems.push(newItem);
                    }
                });
                return updatedItems;
            });

        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'Ocorreu um erro inesperado ao processar a lista.');
        } finally {
            setIsLoading(false);
        }
    };

    const processText = useCallback((text: string) => {
        if (!text.trim()) {
            setError("Insira ao menos um item na caixa de texto.");
            setShowOutput(true);
            return;
        }
        handleProcessing(() => parseShoppingListFromText(text));
    }, []);

    const processFiles = useCallback(async (files: File[]) => {
        if (files.length === 0) return;

        const batchProcessor = async (): Promise<ShoppingListItem[]> => {
            const promises = files.map(file => {
                if (file.type.startsWith('image/')) {
                    return parseShoppingListFromImage(file);
                }
                if (file.type === 'application/pdf') {
                    return extractTextFromPdf(file).then(text => text ? parseShoppingListFromText(text) : []);
                }
                if (file.name.endsWith('.csv')) {
                    return parseCsv(file);
                }
                console.warn(`Arquivo não suportado ignorado: ${file.name}`);
                return Promise.resolve<ShoppingListItem[]>([]);
            });

            const results = await Promise.allSettled(promises);
            const allNewItems: ShoppingListItem[] = [];

            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    allNewItems.push(...result.value);
                } else {
                    console.error(`Falha ao processar arquivo ${files[index].name}:`, result.reason);
                }
            });
            
            return allNewItems;
        };

        await handleProcessing(batchProcessor);
    }, []);

    const handleUpdateItem = (id: string, updatedQuantity: number) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity: Math.max(0, updatedQuantity) } : item
            )
        );
    };

    const handleDeleteItem = (id: string) => {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const handleAddItem = (item: Omit<ShoppingListItem, 'id'>) => {
        const newItem = { ...item, id: `${Date.now()}-${item.name}` };
        setShowOutput(true);
        setItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(i => i.name.toUpperCase() === newItem.name.toUpperCase());
            if (existingItemIndex > -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += newItem.quantity;
                return updatedItems;
            }
            return [...prevItems, newItem];
        });
    };
    
    const handleClear = () => {
        setItems([]);
        setError(null);
        setIgnoredLines([]);
        setShowOutput(false);
    };

    const catalogEntries = Object.entries(DADOS_PRODUTOS)
        .filter(([name]) => name.toLowerCase().includes(catalogSearch.trim().toLowerCase()))
        .sort(([a], [b]) => a.localeCompare(b));

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
            <Header activeSection={activeSection} onNavigate={setActiveSection} />

            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
                {/* Workspace Header & Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-slate-200 dark:border-slate-800">
                    <div>
                        <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                            Sistema de Automação Comercial · Hortifruti e Mercearia
                        </p>
                        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100" style={{ textWrap: 'balance' }}>
                            Central de Padronização e Cotação de Pedidos
                        </h1>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-auto">
                        {/* Mobile section switcher */}
                        <div className="flex md:hidden items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-900 rounded-lg">
                            <button
                                type="button"
                                onClick={() => setActiveSection('workspace')}
                                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                                    activeSection === 'workspace'
                                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                                        : 'text-slate-600 dark:text-slate-400'
                                }`}
                            >
                                Cotação
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveSection('catalog')}
                                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                                    activeSection === 'catalog'
                                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                                        : 'text-slate-600 dark:text-slate-400'
                                }`}
                            >
                                Preços
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveSection('history')}
                                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                                    activeSection === 'history'
                                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                                        : 'text-slate-600 dark:text-slate-400'
                                }`}
                            >
                                Histórico
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                            aria-label="Alternar tema claro ou escuro"
                        >
                            {isDarkMode ? <SunIcon /> : <MoonIcon />}
                            <span>{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
                        </button>
                    </div>
                </div>

                {activeSection === 'workspace' && (
                    <>
                        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                            <div className="lg:col-span-5">
                                <InputPanel
                                    onProcessText={processText}
                                    onProcessFiles={processFiles}
                                    isLoading={isLoading}
                                />
                            </div>
                            <div className="lg:col-span-7">
                                <OutputPanel
                                    items={items}
                                    isLoading={isLoading}
                                    error={error}
                                    ignoredLines={ignoredLines}
                                    showOutput={showOutput}
                                    onUpdateItem={handleUpdateItem}
                                    onDeleteItem={handleDeleteItem}
                                    onAddItem={handleAddItem}
                                    onClear={handleClear}
                                />
                            </div>
                        </main>

                        <section className="mt-10">
                            <OrdersHistory />
                        </section>
                    </>
                )}

                {activeSection === 'catalog' && (
                    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-200 dark:border-slate-800">
                            <div>
                                <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
                                    Tabela Oficial de Produtos e Conversões
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Base de referência utilizada para cálculo automático de caixas, quilos e unidades
                                </p>
                            </div>
                            <div className="w-full sm:w-72">
                                <input
                                    type="search"
                                    value={catalogSearch}
                                    onChange={(e) => setCatalogSearch(e.target.value)}
                                    placeholder="Filtrar produto..."
                                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-600 outline-none"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400">
                                        <th className="py-3 px-4">Produto</th>
                                        <th className="py-3 px-4">Unidade Base</th>
                                        <th className="py-3 px-4 text-right">Preço Unitário</th>
                                        <th className="py-3 px-4 text-right">Peso Caixa (kg)</th>
                                        <th className="py-3 px-4 text-right">Peso Médio Un. (kg)</th>
                                        <th className="py-3 px-4 text-right">Ação Rápida</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-sm">
                                    {catalogEntries.map(([name, data]) => (
                                        <tr key={name} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                                                {name}
                                            </td>
                                            <td className="py-2.5 px-4 text-xs text-slate-500 dark:text-slate-400">
                                                {data.unidade}
                                            </td>
                                            <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-800 dark:text-slate-200">
                                                {data.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </td>
                                            <td className="py-2.5 px-4 text-right font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
                                                {data.peso_cx ? `${data.peso_cx.toFixed(1)} kg` : '—'}
                                            </td>
                                            <td className="py-2.5 px-4 text-right font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
                                                {PESO_MEDIO_UNITARIO_KG[name] ? `${PESO_MEDIO_UNITARIO_KG[name].toFixed(3)} kg` : '—'}
                                            </td>
                                            <td className="py-2.5 px-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        handleAddItem({
                                                            name,
                                                            quantity: 1,
                                                            unit: data.unidade,
                                                            price: data.preco,
                                                        });
                                                        setActiveSection('workspace');
                                                    }}
                                                    className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline whitespace-nowrap"
                                                >
                                                    Adicionar +1 {data.unidade}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {activeSection === 'history' && (
                    <section>
                        <OrdersHistory />
                    </section>
                )}
            </div>

            <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-5 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span>Mercato Cotação — Plataforma de Padronização de Pedidos</span>
                    <span>Catálogo ativo: {Object.keys(DADOS_PRODUTOS).length} produtos cadastrados</span>
                </div>
            </footer>
        </div>
    );
};

export default App;
