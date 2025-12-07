import React, { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { MarketItem, CATEGORIES } from '../types';

interface ItemInputProps {
  onAdd: (item: MarketItem) => void;
}

export const ItemInput: React.FC<ItemInputProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [category, setCategory] = useState<string>(CATEGORIES[2]); // Default 'Mercearia'
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: MarketItem = {
      id: uuidv4(),
      name: name.trim(),
      quantity: parseFloat(quantity) || 1,
      price: parseFloat(price) || 0,
      category,
      checked: false,
      isEstimated: false
    };

    onAdd(newItem);
    setName('');
    setPrice('');
    setQuantity('1');
    setIsExpanded(false);
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden mb-4">
      {!isExpanded ? (
        <button 
          onClick={() => setIsExpanded(true)}
          className="w-full p-4 flex items-center gap-3 text-slate-400 hover:text-indigo-400 hover:bg-slate-700 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-900/30 flex items-center justify-center text-indigo-400">
            <Plus className="w-5 h-5" />
          </div>
          <span className="font-medium">Adicionar item manualmente</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="p-4 animate-fade-in">
          <div className="grid grid-cols-12 gap-3">
            
            {/* Name */}
            <div className="col-span-12 sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Leite Integral"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                autoFocus
              />
            </div>

            {/* Category */}
            <div className="col-span-12 sm:col-span-6">
               <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Categoria</label>
               <div className="relative">
                 <select 
                   value={category}
                   onChange={(e) => setCategory(e.target.value)}
                   className="w-full appearance-none bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                 >
                   {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
                 <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
               </div>
            </div>

            {/* Qty */}
            <div className="col-span-4 sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Qtd</label>
              <input
                type="number"
                step="0.1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Price */}
            <div className="col-span-8 sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Preço (Un)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-500 text-sm">R$</span>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="col-span-12 sm:col-span-4 flex items-end gap-2 mt-2 sm:mt-0">
               <button 
                type="button" 
                onClick={() => setIsExpanded(false)}
                className="flex-1 py-2 px-3 text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
               >
                 Cancelar
               </button>
               <button 
                type="submit" 
                className="flex-1 py-2 px-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
               >
                 Salvar
               </button>
            </div>

          </div>
        </form>
      )}
    </div>
  );
};