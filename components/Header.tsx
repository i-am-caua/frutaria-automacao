import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';

interface HeaderProps {
    activeSection: 'workspace' | 'catalog' | 'history';
    onNavigate: (section: 'workspace' | 'catalog' | 'history') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeSection, onNavigate }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Erro ao fazer login", error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Erro ao fazer logout", error);
        }
    };

    return (
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
                {/* Zone 1: Single text element wordmark */}
                <a
                    href="#workspace"
                    onClick={(e) => {
                        e.preventDefault();
                        onNavigate('workspace');
                    }}
                    className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded"
                >
                    Mercato Cotação
                </a>

                {/* Zone 2: Clean single-line navigation links */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <button
                        type="button"
                        onClick={() => onNavigate('workspace')}
                        className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                            activeSection === 'workspace'
                                ? 'border-emerald-600 text-slate-900 dark:text-slate-100 dark:border-emerald-500'
                                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                    >
                        Mesa de Cotação
                    </button>
                    <button
                        type="button"
                        onClick={() => onNavigate('catalog')}
                        className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                            activeSection === 'catalog'
                                ? 'border-emerald-600 text-slate-900 dark:text-slate-100 dark:border-emerald-500'
                                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                    >
                        Tabela de Preços
                    </button>
                    <button
                        type="button"
                        onClick={() => onNavigate('history')}
                        className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                            activeSection === 'history'
                                ? 'border-emerald-600 text-slate-900 dark:text-slate-100 dark:border-emerald-500'
                                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                    >
                        Histórico de Pedidos
                    </button>
                </nav>

                {/* Zone 3: 1 primary action */}
                <div className="flex items-center shrink-0">
                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
                            title={user.email || 'Encerrar sessão'}
                        >
                            Sair ({user.displayName?.split(' ')[0] || 'Conta'})
                        </button>
                    ) : (
                        <button
                            onClick={handleLogin}
                            className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap shrink-0"
                        >
                            Entrar na Conta
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};
