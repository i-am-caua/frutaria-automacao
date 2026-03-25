
import React, { useState, useEffect } from 'react';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';

export const Header: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
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

    useEffect(() => {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            setIsDarkMode(true);
        } else if (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
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

    return (
        <header className="text-center relative">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
                🚀 Super Gerador de Listas IA 🚀
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
                Crie listas de compras a partir de texto ou fotos usando o poder da IA!
            </p>
            
            <div className="absolute top-0 right-0 flex items-center gap-4">
                {user ? (
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 dark:text-gray-300 hidden md:inline">
                            Olá, {user.displayName?.split(' ')[0]}
                        </span>
                        <button 
                            onClick={handleLogout}
                            className="text-sm bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 px-3 py-1.5 rounded transition-colors"
                        >
                            Sair
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={handleLogin}
                        className="text-sm bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 px-3 py-1.5 rounded transition-colors"
                    >
                        Entrar com Google
                    </button>
                )}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Toggle dark mode"
                >
                    {isDarkMode ? <SunIcon /> : <MoonIcon />}
                </button>
            </div>
        </header>
    );
};
