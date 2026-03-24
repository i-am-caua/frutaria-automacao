
import React, { useState, useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { TextIcon } from './icons/TextIcon';

interface InputPanelProps {
    onProcessText: (text: string) => void;
    onProcessFiles: (files: File[]) => void;
    isLoading: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({ onProcessText, onProcessFiles, isLoading }) => {
    const [text, setText] = useState('');
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTextProcess = () => {
        onProcessText(text);
        setText(''); // Clear text after processing to indicate it has been added
    };

    const handleFiles = (files: FileList | null) => {
        if (files && files.length > 0) {
            const fileArray = Array.from(files);
            setFileName(files.length === 1 ? files[0].name : `${files.length} arquivos selecionados`);
            onProcessFiles(fileArray);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset for re-uploading the same file(s)
            }
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(event.target.files);
    };
    
    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        handleFiles(event.dataTransfer.files);
    };

    // FIX: Define handleDragOver to prevent default browser behavior for drag and drop.
    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };


    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg h-full flex flex-col">
            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                1. Adicionar Itens
            </h2>

            <div className="flex-grow flex flex-col space-y-4">
                <div className="flex-grow">
                    <label htmlFor="listaInput" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Cole uma lista:
                    </label>
                    <textarea
                        id="listaInput"
                        rows={10}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
                        placeholder={`Ex:\n1 - 10kg de Batata\n2 - 5 cachos de uva\n3 - alface (orgânico)\n...`}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <button
                    onClick={handleTextProcess}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 transition-colors duration-300 flex items-center justify-center"
                    disabled={isLoading || !text.trim()}
                >
                    <TextIcon />
                    <span className="ml-2">Adicionar da Caixa de Texto</span>
                </button>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                    <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400">ou</span>
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                </div>

                <div>
                    <label 
                        className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors block"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        <UploadIcon className="mx-auto" />
                        <span className="mt-2 block font-semibold text-blue-600 dark:text-blue-400">
                            Clique para carregar ou arraste arquivos
                        </span>
                        <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                           Imagens, PDFs, ou CSVs
                        </span>
                        {fileName && <p className="mt-2 text-sm text-green-600 dark:text-green-400">Pronto para adicionar: {fileName}</p>}
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
