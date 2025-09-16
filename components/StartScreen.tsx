/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useCallback, useState } from 'react';
import { UploadIcon, CloseIcon } from './icons';

interface StartScreenProps {
  brandName: string;
  setBrandName: (value: string) => void;
  uploadedImage: string | null;
  setUploadedImage: (value: string | null) => void;
  prompt: string;
  setPrompt: (value: string) => void;
  onGenerate: () => void;
  onEnhance: () => void;
}

const StartScreen: React.FC<StartScreenProps> = (props) => {
  const [mode, setMode] = useState<'generate' | 'enhance'>('generate');
  
  const handleModeChange = (newMode: 'generate' | 'enhance') => {
      setMode(newMode);
      // Reset inputs when switching modes
      props.setBrandName('');
      props.setPrompt('');
      props.setUploadedImage(null);
  };

  const isGenerateDisabled = !props.brandName.trim();
  const isEnhanceDisabled = !props.prompt.trim() || !props.uploadedImage;

  return (
    <div className="w-full max-w-3xl mx-auto text-center p-8 animate-fade-in">
      <div className="flex flex-col items-center gap-6">
        {mode === 'generate' ? (
          <>
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-100 sm:text-6xl md:text-7xl">
              Create Your <span className="text-blue-400">New Logo</span> with AI.
            </h1>
            <p className="max-w-2xl text-lg text-gray-400 md:text-xl">
              Describe your brand and vision, and our AI will generate unique logo concepts for you in seconds.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-100 sm:text-6xl md:text-7xl">
              Enhance Your <span className="text-blue-400">Existing Logo</span> with AI.
            </h1>
            <p className="max-w-2xl text-lg text-gray-400 md:text-xl">
              Upload your logo or sketch, describe the changes you want, and let our AI bring your vision to life.
            </p>
          </>
        )}
        
        <div className="w-full mt-8 flex flex-col items-center gap-6">
          {/* Mode switcher */}
          <div className="flex p-1 bg-gray-800/80 border border-gray-700 rounded-xl">
            <button
              onClick={() => handleModeChange('generate')}
              className={`px-6 py-2 text-lg font-semibold rounded-lg transition-colors ${
                mode === 'generate' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Generate New Logo
            </button>
            <button
              onClick={() => handleModeChange('enhance')}
              className={`px-6 py-2 text-lg font-semibold rounded-lg transition-colors ${
                mode === 'enhance' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Enhance Existing
            </button>
          </div>
          
          {mode === 'generate' ? (
            <GenerateForm 
              brandName={props.brandName}
              setBrandName={props.setBrandName}
              prompt={props.prompt}
              setPrompt={props.setPrompt}
              onGenerate={props.onGenerate}
              isDisabled={isGenerateDisabled}
            />
          ) : (
            <EnhanceForm
              uploadedImage={props.uploadedImage}
              setUploadedImage={props.setUploadedImage}
              prompt={props.prompt}
              setPrompt={props.setPrompt}
              onEnhance={props.onEnhance}
              isDisabled={isEnhanceDisabled}
            />
          )}
        </div>
      </div>
    </div>
  );
};


const GenerateForm: React.FC<any> = ({ brandName, setBrandName, prompt, setPrompt, onGenerate, isDisabled }) => (
    <form
      onSubmit={(e) => { e.preventDefault(); onGenerate(); }}
      className="w-full flex flex-col items-center gap-6"
    >
      <div className="w-full">
        <label htmlFor="brand-name" className="text-lg font-semibold text-gray-300 block text-left mb-2">Brand Name</label>
        <input
          id="brand-name"
          type="text"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          placeholder="e.g., 'Aperture Labs'"
          className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg p-4 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          required
        />
      </div>
      <div className="w-full">
        <label htmlFor="logo-prompt" className="text-lg font-semibold text-gray-300 block text-left mb-2">Describe Your Logo <span className="text-gray-500 font-normal">(Optional)</span></label>
        <textarea
          id="logo-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'a minimalist line art camera shutter icon', 'a fierce geometric lion head', 'playful and colorful lettering'"
          className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg p-4 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition h-32 resize-none"
        />
      </div>
      <button
        type="submit"
        className="w-full max-w-md bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-5 px-8 text-xl rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner disabled:from-gray-600 disabled:to-gray-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
        disabled={isDisabled}
      >
        Generate Logos
      </button>
    </form>
);

const EnhanceForm: React.FC<any> = ({ uploadedImage, setUploadedImage, prompt, setPrompt, onEnhance, isDisabled }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setUploadedImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };
    
    const onUploaderClick = () => fileInputRef.current?.click();
    
    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setUploadedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }
    
    const onDragOver = useCallback((e: React.DragEvent) => e.preventDefault(), []);
    
    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => setUploadedImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    }, [setUploadedImage]);

    return (
        <form
          onSubmit={(e) => { e.preventDefault(); onEnhance(); }}
          className="w-full flex flex-col items-center gap-6"
        >
          <div className="w-full">
            <label className="text-lg font-semibold text-gray-300 block text-left mb-2">Upload Logo or Sketch</label>
            {!uploadedImage ? (
                <div
                    onClick={onUploaderClick}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    className="w-full h-48 border-2 border-dashed border-gray-600 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:border-blue-500 hover:bg-gray-800/50 transition-colors"
                >
                    <UploadIcon className="w-10 h-10 text-gray-500 mb-2"/>
                    <p className="text-gray-400"><span className="font-semibold text-blue-400">Click to upload</span> or drag and drop</p>
                    <p className="text-sm text-gray-500">PNG, JPG, WEBP, etc.</p>
                </div>
            ) : (
                <div className="w-full relative">
                    <img src={uploadedImage} alt="Uploaded logo preview" className="w-full h-auto max-h-72 object-contain rounded-lg bg-white p-2" />
                    <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-black/50 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors" aria-label="Remove image">
                       <CloseIcon className="w-5 h-5" />
                    </button>
                </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>
          <div className="w-full">
             <label htmlFor="logo-prompt" className="text-lg font-semibold text-gray-300 block text-left mb-2">Describe Your Changes</label>
            <textarea
              id="logo-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'make this logo look 3D', 'change the color to a deep blue', 'add a lion next to the shield'"
              className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg p-4 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition h-32 resize-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full max-w-md bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-5 px-8 text-xl rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner disabled:from-gray-600 disabled:to-gray-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
            disabled={isDisabled}
          >
            Enhance Logo
          </button>
        </form>
    );
};

export default StartScreen;