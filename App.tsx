
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { ShoppingListItem } from './types';
import { parseShoppingListFromImage, parseShoppingListFromText } from './services/geminiService';
import { extractTextFromPdf, parseCsv } from './utils/fileUtils';
import { OrdersHistory } from './components/OrdersHistory';
import { testConnection } from './services/firebaseService';

const App: React.FC = () => {
    const [items, setItems] = useState<ShoppingListItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [ignoredLines, setIgnoredLines] = useState<string[]>([]);
    const [showOutput, setShowOutput] = useState<boolean>(false);

    React.useEffect(() => {
        testConnection();
    }, []);

    const handleProcessing = async (processor: () => Promise<ShoppingListItem[]>) => {
        setIsLoading(true);
        setError(null);
        setIgnoredLines([]);
        setShowOutput(true);
        try {
            const newItems = await processor();
            
            // Merge new items with existing ones, summing quantities
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
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const processText = useCallback((text: string) => {
        if (!text.trim()) {
            setError("The text area is empty.");
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
                console.warn(`Unsupported file type skipped: ${file.name}`);
                return Promise.resolve<ShoppingListItem[]>([]);
            });

            const results = await Promise.allSettled(promises);
            const allNewItems: ShoppingListItem[] = [];

            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    allNewItems.push(...result.value);
                } else {
                    console.error(`Failed to process file ${files[index].name}:`, result.reason);
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

    return (
        <div className="container mx-auto p-4 md:p-8 min-h-screen">
            <Header />
            <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <InputPanel onProcessText={processText} onProcessFiles={processFiles} isLoading={isLoading} />
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
            </main>
            
            <section className="mt-12">
                <OrdersHistory />
            </section>

            <footer className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
                <p>Powered by AI. Reimagined for the web.</p>
            </footer>
        </div>
    );
};

export default App;
