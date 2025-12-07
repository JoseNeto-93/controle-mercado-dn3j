
import React, { useEffect, useState } from 'react';
import { Download, Share, X, HelpCircle, Menu } from 'lucide-react';

export const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [showAndroidHint, setShowAndroidHint] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    // Check if already in standalone mode
    const inStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    
    setIsStandalone(inStandalone);

    if (isIosDevice && !inStandalone) {
      setIsIOS(true);
    }

    // 1. Check if the event was already captured in index.html
    if ((window as any).deferredPrompt) {
      setDeferredPrompt((window as any).deferredPrompt);
      setIsVisible(true);
    }

    // 2. Listen for future events
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
      // Store globally
      (window as any).deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // If we don't have the prompt (maybe browser blocked it or user declined before), show instructions
      setShowAndroidHint(true);
      return;
    }

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsVisible(false);
      setDeferredPrompt(null);
      (window as any).deferredPrompt = null;
    }
  };

  if (isStandalone) return null;

  return (
    <>
      {/* Main Install Button (Floating) */}
      {!isStandalone && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40 animate-fade-in-up">
          <button
            onClick={() => isIOS ? setShowIOSHint(true) : handleInstallClick()}
            className="bg-indigo-600 text-white px-5 py-3 rounded-full shadow-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all border border-indigo-400/50 active:scale-95"
          >
            <Download className="w-5 h-5" />
            {isVisible ? "Instalar App" : "Instalar / Ajuda"}
          </button>
        </div>
      )}

      {/* iOS Hint Banner */}
      {showIOSHint && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-slate-700 relative">
             <button 
              onClick={() => setShowIOSHint(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl"></span> Instalar no iPhone
            </h3>
            
            <div className="space-y-4 text-slate-300 text-sm">
              <div className="flex items-start gap-3">
                <div className="bg-slate-700 p-2 rounded-lg">
                  <Share className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">1. Toque em Compartilhar</p>
                  <p className="text-slate-400">Geralmente no rodapé do navegador.</p>
                </div>
              </div>
              
              <div className="w-px h-4 bg-slate-700 ml-5"></div>

              <div className="flex items-start gap-3">
                <div className="bg-slate-700 p-2 rounded-lg">
                  <div className="w-5 h-5 border-2 border-white rounded-[4px] flex items-center justify-center">
                    <span className="text-[10px] font-bold">+</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-white">2. Adicionar à Tela de Início</p>
                  <p className="text-slate-400">Role para baixo nas opções.</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowIOSHint(false)}
              className="w-full mt-6 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 rounded-xl transition-colors"
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      {/* Android/Generic Hint Modal (Shown if automatic install fails) */}
      {showAndroidHint && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in">
           <div className="bg-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-slate-700 relative">
             <button 
              onClick={() => setShowAndroidHint(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-400" /> 
              Instalação Manual
            </h3>
            
            <p className="text-slate-300 text-sm mb-4">
              Se o botão automático não funcionou, siga estes passos:
            </p>

            <div className="space-y-4 text-slate-300 text-sm">
              <div className="flex items-start gap-3">
                <div className="bg-slate-700 p-2 rounded-lg">
                   <Menu className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">1. Abra o Menu</p>
                  <p className="text-slate-400">Toque nos 3 pontinhos no canto da tela.</p>
                </div>
              </div>

              <div className="w-px h-4 bg-slate-700 ml-5"></div>

              <div className="flex items-start gap-3">
                <div className="bg-slate-700 p-2 rounded-lg">
                  <Download className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">2. Instalar Aplicativo</p>
                  <p className="text-slate-400">Procure por "Instalar App" ou "Adicionar à tela inicial".</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowAndroidHint(false)}
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Fechar
            </button>
           </div>
        </div>
      )}
    </>
  );
};
