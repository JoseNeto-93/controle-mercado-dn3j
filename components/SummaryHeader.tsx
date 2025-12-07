
import React, { useState, useRef, useEffect } from 'react';
import { Wallet, Pencil, Check, History, ShoppingCart } from 'lucide-react';

interface SummaryHeaderProps {
  total: number;
  budget: number;
  itemCount: number;
  onUpdateBudget: (newBudget: number) => void;
  view: 'current' | 'history';
  onChangeView: (view: 'current' | 'history') => void;
}

export const SummaryHeader: React.FC<SummaryHeaderProps> = ({ 
  total, 
  budget, 
  itemCount, 
  onUpdateBudget,
  view,
  onChangeView 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState(budget.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  const remaining = budget - total;
  const isOverBudget = remaining < 0;
  const progressPercent = Math.min((total / (budget || 1)) * 100, 100);
  
  // Color logic
  let statusColor = "bg-emerald-500";
  if (progressPercent > 75) statusColor = "bg-yellow-500";
  if (progressPercent > 90) statusColor = "bg-orange-500";
  if (isOverBudget) statusColor = "bg-red-500";

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Update temp budget when actual budget changes (e.g. after finishing a trip)
  useEffect(() => {
    setTempBudget(budget.toString());
  }, [budget]);

  const handleSave = () => {
    const val = parseFloat(tempBudget);
    if (!isNaN(val)) { // Removed val > 0 check to allow 0 or negative if needed
      onUpdateBudget(val);
    } else {
      setTempBudget(budget.toString()); // Revert if invalid
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setTempBudget(budget.toString());
      setIsEditing(false);
    }
  };

  return (
    <div className="sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm pb-0 pt-4">
      {/* Top Row */}
      <div className="px-4 sm:px-6 flex justify-between items-end mb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-3 tracking-tight">
            Controle de Gastos Mercado
          </h1>
          {view === 'current' && (
            <p className="text-xs text-slate-400 mt-1 animate-fade-in">{itemCount} itens na lista</p>
          )}
        </div>
        
        <div className="text-right">
           <div className="text-sm text-slate-400 flex items-center justify-end gap-1 mb-1">
             Orçamento <Wallet className="w-3 h-3 text-slate-500" />
           </div>
           
           {isEditing ? (
             <div className="flex items-center justify-end gap-2 h-8">
               <input
                 ref={inputRef}
                 type="number"
                 step="10"
                 value={tempBudget}
                 onChange={(e) => setTempBudget(e.target.value)}
                 onKeyDown={handleKeyDown}
                 onBlur={handleSave}
                 className="w-24 bg-slate-900 border border-indigo-500 rounded px-2 py-1 text-right text-white font-bold text-lg focus:outline-none"
               />
               <button onClick={handleSave} className="text-emerald-400 hover:text-emerald-300">
                 <Check className="w-5 h-5" />
               </button>
             </div>
           ) : (
             <div 
               className={`flex items-center justify-end gap-2 text-2xl font-bold cursor-pointer group ${isOverBudget ? 'text-red-400' : 'text-white'}`}
               onClick={() => {
                 setTempBudget(budget.toString());
                 setIsEditing(true);
               }}
               title="Clique para editar orçamento"
             >
               <span>
                 R$ {total.toFixed(2)}
                 <span className="text-sm text-slate-500 font-normal ml-1">
                   / {budget.toFixed(2)}
                 </span>
               </span>
               <Pencil className="w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
             </div>
           )}
        </div>
      </div>

      {/* Progress Bar (Only visible in Current List view) */}
      {view === 'current' && (
        <div className="px-4 sm:px-6 mb-4 animate-fade-in">
          <div className="relative h-3 w-full bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`absolute top-0 left-0 h-full transition-all duration-500 ${statusColor}`} 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs font-medium">
            <span className="text-slate-500">Gasto Atual</span>
            <span className={`${isOverBudget ? 'text-red-400 font-bold' : 'text-emerald-400'}`}>
              {isOverBudget ? `Estourou R$ ${Math.abs(remaining).toFixed(2)}` : `Restam R$ ${remaining.toFixed(2)}`}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex mt-2">
        <button
          onClick={() => onChangeView('current')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${
            view === 'current' 
              ? 'border-indigo-500 text-indigo-400 bg-slate-800' 
              : 'border-transparent text-slate-500 hover:text-slate-300 bg-slate-900/30'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          Lista Atual
        </button>
        <button
          onClick={() => onChangeView('history')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${
            view === 'history' 
              ? 'border-indigo-500 text-indigo-400 bg-slate-800' 
              : 'border-transparent text-slate-500 hover:text-slate-300 bg-slate-900/30'
          }`}
        >
          <History className="w-4 h-4" />
          Histórico
        </button>
      </div>
    </div>
  );
};
