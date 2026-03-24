
import React from 'react';

export const Loader: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <div
                className="w-12 h-12 rounded-full animate-spin border-4 border-solid border-blue-500 border-t-transparent"
                role="status"
            >
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Processando com IA...</p>
        </div>
    );
};
