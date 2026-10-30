import React from 'react';

export const Loader: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <div
                className="w-8 h-8 rounded-full animate-spin border-2 border-solid border-emerald-600 border-t-transparent"
                role="status"
            />
            <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                Padronizando itens e convertendo unidades...
            </p>
        </div>
    );
};
