
import React, { useState } from 'react';
import { MarketItem } from '../types';
import { Trash2, CheckCircle, Circle, ArrowRight, Calendar } from 'lucide-react';

interface ItemListProps {
  items: MarketItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<MarketItem>) => void;
  onFinish: (date: string) => void;
}

export const ItemList: React.FC<ItemListProps> = ({ items, onToggle, onDelete, onUpdate, onFinish }) => {
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);

  if (items.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
          <CheckCircle className="w-10 h-10 text-slate-600" />
        </div>
        <h3 className="text-slate-300 font-medium text-lg">Sua lista está vazia</h3>
        <p className="text-slate-500 text-sm mt-1">Adicione itens manualmente para começar.</p>
      </div>
    );
  }

  // Group by category, but keep checked items at bottom
  const activeItems = items.filter(i => !i.checked);
  const checkedItems = items.filter(i => i.checked);
  const hasCheckedItems = checkedItems.length > 0;

  const renderItem = (item: MarketItem) => (
    <div 
      key={item.id} 
      className={`group flex flex-col sm:flex-row items-start sm:items-center p-4 bg-slate-800 border-b border-slate-700 last:border-0 transition-all ${item.checked ? 'bg-slate-900/40' : ''}`}
    >
      {/* Checkbox & Name */}
      <div className="flex items-center flex-1 gap-3 w-full sm:w-auto">
        <button 
          onClick={() => onToggle(item.id)}
          className={`flex-shrink-0 transition-colors ${item.checked ? 'text-emerald-500' : 'text-slate-500 hover:text-indigo-400'}`}
        >
          {item.checked ? <CheckCircle className="w-6 h-6 fill-current" /> : <Circle className="w-6 h-6" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-medium truncate ${item.checked ? 'text-slate-600 line-through' : 'text-slate-200'}`}>
              {item.name}
            </span>
            {item.isEstimated && !item.checked && (
               <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-900/30 text-amber-200" title="Preço estimado pela IA">
                 IA
               </span>
            )}
          </div>
          <div className="text-xs text-slate-500">{item.category}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto mt-3 sm:mt-0 gap-4 pl-9 sm:pl-0">
        
        {/* Quantity */}
        <div className="flex items-center border border-slate-600 rounded-lg bg-slate-900">
          <button 
            onClick={() => onUpdate(item.id, { quantity: Math.max(0.1, item.quantity - 1) })}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-700 rounded-l-lg"
          >
            -
          </button>
          <input 
            type="number" 
            className="w-10 text-center bg-transparent text-sm font-medium text-slate-200 focus:outline-none"
            value={item.quantity}
            onChange={(e) => onUpdate(item.id, { quantity: parseFloat(e.target.value) || 0 })}
          />
          <button 
             onClick={() => onUpdate(item.id, { quantity: item.quantity + 1 })}
             className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-700 rounded-r-lg"
          >
            +
          </button>
        </div>

        {/* Price Input */}
        <div className="relative w-24">
          <span className="absolute left-2 top-1.5 text-xs text-slate-400">R$</span>
          <input
            type="number"
            step="0.01"
            value={item.price}
            onChange={(e) => onUpdate(item.id, { price: parseFloat(e.target.value) || 0, isEstimated: false })}
            className={`w-full pl-6 pr-2 py-1.5 text-right text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 ${item.isEstimated ? 'border-amber-700/50 bg-amber-900/10 text-amber-200' : 'border-slate-600 bg-slate-900 text-white'}`}
          />
        </div>

        {/* Delete */}
        <button 
          onClick={() => onDelete(item.id)}
          className="text-slate-600 hover:text-red-400 transition-colors p-1"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden">
        {activeItems.map(renderItem)}
        
        {hasCheckedItems && (
          <>
            <div className="bg-slate-900/40 px-4 py-2 border-y border-slate-700 flex items-center gap-2">
               <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Comprados ({checkedItems.length})</span>
            </div>
            {checkedItems.map(renderItem)}
          </>
        )}
      </div>

      {hasCheckedItems && (
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg space-y-3">
           <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div className="flex flex-col w-full sm:w-auto">
                <label className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Data da Compra
                </label>
                <input 
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <button 
                onClick={() => onFinish(purchaseDate)}
                className="w-full sm:w-auto flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Finalizar Compra
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>
           </div>
           <p className="text-center text-xs text-slate-500">
             Os itens marcados serão movidos para o histórico e o gráfico será atualizado.
           </p>
        </div>
      )}
    </div>
  );
};
