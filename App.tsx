/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useCallback } from 'react';
import { generateLogos, enhanceLogo } from './services/geminiService';
import Header from './components/Header';
import Spinner from './components/Spinner';
import StartScreen from './components/StartScreen'; 
import { DownloadIcon } from './components/icons';

const App: React.FC = () => {
    const [brandName, setBrandName] = useState('');
    const [prompt, setPrompt] = useState('');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    
    const [generatedLogos, setGeneratedLogos] = useState<string[]>([]);
    const [generatedLogo, setGeneratedLogo] = useState<string | null>(null);
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!brandName.trim()) {
            setError('Please provide a brand name.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedLogos([]);
        setGeneratedLogo(null);
        setOriginalImage(null);

        try {
            const logos = await generateLogos(brandName, prompt);
            setGeneratedLogos(logos);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to generate logos. ${errorMessage}`);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [brandName, prompt]);
    
    const handleEnhance = useCallback(async () => {
        if (!uploadedImage) {
            setError('Please upload an image.');
            return;
        }
        if (!prompt.trim()) {
            setError('Please provide a description of the changes you want.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedLogo(null);
        setGeneratedLogos([]);
        setOriginalImage(uploadedImage);

        try {
            const logo = await enhanceLogo(uploadedImage, prompt);
            setGeneratedLogo(logo);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to enhance logo. ${errorMessage}`);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [uploadedImage, prompt]);
    
    const handleStartOver = () => {
        setGeneratedLogo(null);
        setOriginalImage(null);
        setUploadedImage(null);
        setGeneratedLogos([]);
        setBrandName('');
        setPrompt('');
        setError(null);
    };
    
    const handleDownload = (imageUrl: string, index: number) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        const name = brandName ? brandName.toLowerCase().replace(/\s+/g, '-') : 'logo';
        link.download = `brandspark-${name}-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="text-center animate-fade-in flex flex-col items-center gap-4">
                    <Spinner />
                    <h2 className="text-2xl font-bold text-gray-200">Our AI is Working...</h2>
                    <p className="text-md text-gray-400 max-w-sm">Your vision is coming to life. This may take a moment.</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center animate-fade-in bg-red-500/10 border border-red-500/20 p-8 rounded-lg max-w-2xl mx-auto flex flex-col items-center gap-4">
                    <h2 className="text-2xl font-bold text-red-300">An Error Occurred</h2>
                    <p className="text-md text-red-400">{error}</p>
                    <button
                        onClick={handleStartOver}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg text-md transition-colors mt-2"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        if (generatedLogos.length > 0) {
             return (
                <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-8 animate-fade-in">
                    <h2 className="text-4xl font-extrabold tracking-tight text-center">Your Generated Logos for "{brandName}"</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                        {generatedLogos.map((logo, index) => (
                            <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 w-full relative group flex flex-col items-center">
                                 <img src={logo} alt={`Generated logo ${index + 1}`} className="w-full h-auto object-contain rounded-md aspect-square bg-white shadow-inner" />
                                 <button
                                     onClick={() => handleDownload(logo, index)}
                                     className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-500 text-white font-bold p-3 rounded-full transition-all duration-300 ease-in-out shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 active:scale-95"
                                     aria-label="Download logo"
                                 >
                                     <DownloadIcon className="w-6 h-6" />
                                 </button>
                             </div>
                        ))}
                    </div>
                     <button
                         onClick={handleStartOver}
                         className="bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-3 px-8 text-lg rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner"
                     >
                         Start Over
                     </button>
                </div>
            );
        }

        if (generatedLogo && originalImage) {
            return (
                <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-8 animate-fade-in">
                    <h2 className="text-4xl font-extrabold tracking-tight text-center">Your Enhanced Logo</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        <div className="flex flex-col gap-3 items-center">
                            <h3 className="text-xl font-bold text-gray-400">Original</h3>
                            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 w-full">
                                <img src={originalImage} alt="Original logo" className="w-full h-auto object-contain rounded-md aspect-square bg-white shadow-inner" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 items-center">
                            <h3 className="text-xl font-bold text-blue-400">Enhanced</h3>
                            <div className="bg-gray-800/50 border border-blue-500/30 rounded-lg p-4 w-full relative group">
                                <img src={generatedLogo} alt="Enhanced logo" className="w-full h-auto object-contain rounded-md aspect-square bg-white shadow-inner" />
                                <button
                                    onClick={() => handleDownload(generatedLogo, 0)}
                                    className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-500 text-white font-bold p-3 rounded-full transition-all duration-300 ease-in-out shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 active:scale-95"
                                    aria-label="Download logo"
                                >
                                    <DownloadIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleStartOver}
                        className="bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-3 px-8 text-lg rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner"
                    >
                        Enhance Another
                    </button>
                </div>
            );
        }

        return (
            <StartScreen
                brandName={brandName}
                setBrandName={setBrandName}
                uploadedImage={uploadedImage}
                setUploadedImage={setUploadedImage}
                prompt={prompt}
                setPrompt={setPrompt}
                onGenerate={handleGenerate}
                onEnhance={handleEnhance}
            />
        );
    };
  
  return (
    <div className="min-h-screen text-gray-100 flex flex-col">
      <Header />
      <main className={`flex-grow w-full max-w-[1600px] mx-auto p-4 md:p-8 flex justify-center items-center`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;