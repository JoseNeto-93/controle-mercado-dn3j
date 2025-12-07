
import React, { useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';

export const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    // Check if already in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    
    if (isIosDevice && !isStandalone) {
      setIsIOS(true);
      // Optional: Show iOS hint automatically or wait for user action. 
      // For now, we'll keep it hidden unless we want to force a banner.
      setShowIOSHint(true); 
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (!isVisible && !showIOSHint) return null;

  return (
    <>
      {/* Android / Chrome Install Button */}
      {isVisible && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40 animate-fade-in-up">
          <button
            onClick={handleInstallClick}
            className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg font-medium flex items-center gap-2 hover:bg-indigo-700 transition-colors border border-indigo-400"
          >
            <Download className="w-4 h-4" />
            Instalar App
          </button>
        </div>
      )}

      {/* iOS Hint Banner (Optional, appears at bottom) */}
      {showIOSHint && isIOS && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-800 border-t border-slate-700 p-4 shadow-2xl animate-fade-in-up">
          <div className="max-w-3xl mx-auto flex items-start justify-between">
            <div className="text-sm text-slate-300">
              <p className="font-bold text-white mb-1">Instale o App no iPhone:</p>
              <div className="flex items-center gap-1">
                1. Toque em <Share className="w-4 h-4 inline mx-1 text-blue-400" /> (Compartilhar)
              </div>
              <div className="mt-1">
                2. Selecione <span className="font-bold text-white">Adicionar à Tela de Início</span>
              </div>
            </div>
            <button 
              onClick={() => setShowIOSHint(false)}
              className="p-1 text-slate-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
