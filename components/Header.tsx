
import React, { useState, useEffect } from 'react';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

export const Header: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

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
            <button
                onClick={toggleTheme}
                className="absolute top-0 right-0 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
            >
                {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>
        </header>
    );
};
