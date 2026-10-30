import React, { useState, useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { TextIcon } from './icons/TextIcon';

interface InputPanelProps {
    onProcessText: (text: string) => void;
    onProcessFiles: (files: File[]) => void;
    isLoading: boolean;
}

const SAMPLE_LIST = `2 cx de Tomate
15 kg de Batata Inglesa
5 kg de Cebola
3 maços de Alface Crespa
4 kg de Cenoura
2 dz de Ovos`;

export const InputPanel: React.FC<InputPanelProps> = ({ onProcessText, onProcessFiles, isLoading }) => {
    const [text, setText] = useState('');
    const [fileName, setFileName] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTextProcess = () => {
        if (!text.trim()) return;
        onProcessText(text);
        setText('');
    };

    const handleLoadSample = () => {
        setText(SAMPLE_LIST);
    };

    const handleFiles = (files: FileList | null) => {
        if (files && files.length > 0) {
            const fileArray = Array.from(files);
            setFileName(files.length === 1 ? files[0].name : `${files.length} arquivos selecionados`);
            onProcessFiles(fileArray);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(event.target.files);
    };
    
    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
    };

    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col h-full">
            <div className="flex items-baseline justify-between pb-4 mb-5 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
                        01. Entrada de Dados
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Insira pedidos em texto livre ou importe arquivos para padronização automática
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleLoadSample}
                    disabled={isLoading}
                    className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline whitespace-nowrap shrink-0 disabled:opacity-50"
                >
                    Preencher exemplo
                </button>
            </div>

            <div className="flex-grow flex flex-col space-y-5">
                <div className="flex-grow flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <label htmlFor="listaInput" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Descrição ou lista bruta do pedido
                        </label>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono tabular-nums">
                            {text.trim() ? `${text.trim().split('\n').length} linhas` : 'Texto livre'}
                        </span>
                    </div>
                    <textarea
                        id="listaInput"
                        rows={9}
                        className="w-full flex-grow p-3.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/60 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 dark:focus:border-emerald-500 outline-none transition-colors resize-y font-mono"
                        placeholder={`Exemplo de entrada:\n2 cx de Tomate\n15 kg de Batata\n5 cachos de Uva\n3 unidades de Alface`}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                <button
                    onClick={handleTextProcess}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-sm font-semibold py-2.5 px-4 rounded-lg disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
                    disabled={isLoading || !text.trim()}
                >
                    <TextIcon />
                    <span>Processar Texto na Lista</span>
                </button>

                <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                    <span className="flex-shrink mx-3 text-xs text-slate-400 dark:text-slate-500">
                        ou importe documentos
                    </span>
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                </div>

                <div>
                    <label
                        className={`w-full border border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors block ${
                            isDragging
                                ? 'border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20'
                                : 'border-slate-300 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-950/30 hover:border-emerald-600 dark:hover:border-emerald-500'
                        }`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    >
                        <UploadIcon className="mx-auto h-7 w-7 text-slate-400 dark:text-slate-500" />
                        <span className="mt-2 block text-sm font-medium text-slate-800 dark:text-slate-200">
                            Selecione arquivos ou arraste para esta área
                        </span>
                        <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                            Suporta fotos de listas manuscritas (JPG, PNG), PDF e planilhas CSV
                        </span>
                        {fileName && (
                            <p className="mt-2.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                Último envio: {fileName}
                            </p>
                        )}
                        <input
                            type="file"
                            id="fileInput"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*,.pdf,.csv"
                            onChange={handleFileChange}
                            disabled={isLoading}
                            multiple
                        />
                    </label>
                </div>
            </div>
        </div>
    );
};
