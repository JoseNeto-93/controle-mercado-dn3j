import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { generateShoppingList } from '../services/geminiService';
import { MarketItem } from '../types';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItems: (items: MarketItem[]) => void;
  currentBudget: number;
}

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({ isOpen, onClose, onAddItems, currentBudget }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const items = await generateShoppingList(prompt, currentBudget);
      onAddItems(items);
      onClose();
      setPrompt('');
    } catch (err) {
      console.error(err);
      setError("Falha ao gerar lista. Verifique sua chave API ou tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in-up border border-slate-700">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-purple-800 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-white text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              Assistente Mágico
            </h2>
            <p className="text-indigo-200 text-sm mt-1">Descreva o que você precisa comprar.</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Exemplos: "Churrasco para 10 pessoas", "Limpeza da casa mensal", "Jantar romântico italiano".
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Digite aqui..."
            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[120px] resize-none"
          />

          {error && (
            <div className="mt-3 p-3 bg-red-900/30 text-red-300 text-sm rounded-lg border border-red-900/50">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-slate-300 font-medium hover:bg-slate-700 rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Pensando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Gerar Lista
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};