
import React, { useState, useEffect } from 'react';
import { SummaryHeader } from './components/SummaryHeader';
import { ItemList } from './components/ItemList';
import { ItemInput } from './components/ItemInput';
import { HistoryView } from './components/HistoryView';
import { InstallPWA } from './components/InstallPWA';
import { MarketItem, ShoppingTrip } from './types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'mercado-dn3j-data-v2';

interface AppState {
  items: MarketItem[];
  budget: number;
  history: ShoppingTrip[];
}

const App: React.FC = () => {
  const [items, setItems] = useState<MarketItem[]>([]);
  const [budget, setBudget] = useState<number>(500); 
  const [history, setHistory] = useState<ShoppingTrip[]>([]);
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentView, setCurrentView] = useState<'current' | 'history'>('current');

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: AppState = JSON.parse(saved);
        setItems(parsed.items || []);
        setBudget(parsed.budget || 500);
        setHistory(parsed.history || []);
      } catch (e) {
        console.error("Failed to load data", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isInitialized) {
      const stateToSave: AppState = { items, budget, history };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }
  }, [items, budget, history, isInitialized]);

  const totalSpent = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleAddItem = (item: MarketItem) => {
    setItems(prev => [item, ...prev]);
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleToggleItem = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  };

  const handleUpdateItem = (id: string, updates: Partial<MarketItem>) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const handleUpdateBudget = (newBudget: number) => {
    setBudget(newBudget);
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(trip => trip.id !== id));
  };

  const handleFinishShopping = (dateString: string) => {
    const purchasedItems = items.filter(i => i.checked);
    
    if (purchasedItems.length === 0) {
      alert("Para finalizar, marque os itens que você já comprou clicando no círculo ao lado do nome.");
      return;
    }

    // Direct execution without confirm dialog for smoother UX
    const tripTotal = purchasedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    // Create date object
    const dateObj = new Date(dateString);
    const now = new Date();
    // Preserve current time to avoid timezone rollback on just date strings
    dateObj.setHours(now.getHours(), now.getMinutes());

    const newTrip: ShoppingTrip = {
      id: uuidv4(),
      date: dateObj.toISOString(),
      total: tripTotal,
      itemCount: purchasedItems.length,
      items: purchasedItems
    };

    // Update History
    setHistory(prev => [newTrip, ...prev]);
    
    // Remove checked items from current list
    setItems(prev => prev.filter(i => !i.checked));

    // Update Budget: Subtract the total spent from current budget
    setBudget(prev => {
      const newBudget = prev - tripTotal;
      // Ensure we format it properly to avoid floating point weirdness like 300.00000004
      return parseFloat(newBudget.toFixed(2));
    });
    
    // Switch view to history immediately so user sees the result
    setCurrentView('history');
  };

  return (
    <div className="min-h-screen pb-24 relative bg-slate-900 font-sans text-slate-200">
      <SummaryHeader 
        total={totalSpent} 
        budget={budget} 
        itemCount={items.length}
        onUpdateBudget={handleUpdateBudget}
        view={currentView}
        onChangeView={setCurrentView}
      />

      <main className="max-w-3xl mx-auto px-4 py-6">
        
        {currentView === 'current' ? (
          <>
            <ItemInput onAdd={handleAddItem} />
            
            <div className="mt-6">
              <ItemList 
                items={items}
                onToggle={handleToggleItem}
                onDelete={handleDeleteItem}
                onUpdate={handleUpdateItem}
                onFinish={handleFinishShopping}
              />
            </div>
          </>
        ) : (
          <HistoryView history={history} onDelete={handleDeleteHistory} />
        )}
      </main>

      <InstallPWA />

      {/* Footer Signature */}
      <div className="fixed bottom-2 right-3 z-0 opacity-50 hover:opacity-100 transition-opacity select-none pointer-events-none">
        <p className="text-[10px] text-slate-600 font-semibold tracking-wide">Desenvolvido por DN3J</p>
      </div>
    </div>
  );
};

export default App;
