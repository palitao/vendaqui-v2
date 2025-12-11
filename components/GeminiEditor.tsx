import React, { useState, useRef } from 'react';
import { editImageWithGemini } from '../services/geminiService';
import { Button } from './UI';
import { Wand2, Image as ImageIcon, Loader2, Download, AlertCircle } from 'lucide-react';

export const GeminiEditor: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setGeneratedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const result = await editImageWithGemini(selectedImage, prompt);
      if (result) {
        setGeneratedImage(result);
      } else {
        setError("Não foi possível gerar a imagem. Tente novamente.");
      }
    } catch (err) {
      setError("Erro ao processar imagem com a IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-primary to-purple-600 rounded-lg text-white">
          <Wand2 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Estúdio AI VendeAqui</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Edite fotos dos seus produtos usando Inteligência Artificial (Gemini 2.5)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer transition-colors ${selectedImage ? 'border-primary bg-blue-50/30 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
             {selectedImage ? (
                <img src={selectedImage} alt="Original" className="h-full w-full object-contain rounded-lg p-2" />
             ) : (
                <div className="text-center p-6">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Clique para carregar uma foto</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG até 5MB</p>
                </div>
             )}
             <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          </div>

          <div className="space-y-3">
             <label className="text-sm font-medium text-gray-700 dark:text-gray-300">O que deseja alterar?</label>
             <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Adicione um fundo de estúdio branco, remova o objeto ao fundo, melhore a iluminação..."
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm min-h-[100px]"
             />
             <Button 
                onClick={handleGenerate} 
                disabled={!selectedImage || !prompt || loading} 
                className="w-full shadow-lg shadow-primary/20"
                variant="primary"
             >
                {loading ? (
                   <>
                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                     Processando com IA...
                   </>
                ) : (
                   <>
                     <Wand2 className="w-4 h-4 mr-2" />
                     Gerar Edição
                   </>
                )}
             </Button>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex flex-col h-full min-h-[400px]">
           <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Resultado</h3>
           
           <div className="flex-1 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 overflow-hidden relative">
              {loading ? (
                <div className="text-center">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-2" />
                  <p className="text-xs text-gray-500 animate-pulse">A IA está a pensar...</p>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 p-4">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">{error}</p>
                </div>
              ) : generatedImage ? (
                <img src={generatedImage} alt="Gerada" className="w-full h-full object-contain" />
              ) : (
                <p className="text-gray-400 text-sm">A imagem editada aparecerá aqui.</p>
              )}
           </div>

           {generatedImage && (
             <div className="mt-4">
                <a href={generatedImage} download="vendeaqui-edit.png" className="w-full block">
                   <Button variant="secondary" className="w-full">
                     <Download className="w-4 h-4 mr-2" />
                     Baixar Imagem
                   </Button>
                </a>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};