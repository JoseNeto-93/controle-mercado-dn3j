
import React, { useState } from 'react';
import { ShoppingTrip } from '../types';
import { Calendar, ChevronDown, ChevronUp, BarChart3, List, ShoppingBag, Trash2 } from 'lucide-react';

interface HistoryViewProps {
  history: ShoppingTrip[];
  onDelete: (id: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history, onDelete }) => {
  const [activeTab, setActiveTab] = useState<'list' | 'chart'>('list');
  const [expandedTripId, setExpandedTripId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedTripId(expandedTripId === id ? null : id);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    // Parar a propagação é crucial para não abrir o accordion ao clicar na lixeira
    e.stopPropagation();
    // Removido window.confirm para garantir execução imediata
    onDelete(id);
  };

  // --- Logic for Chart ---
  const processChartData = () => {
    // 1. Aggregate by ISO Year-Month (e.g., "2024-02") for stable sorting
    const monthsMap: Record<string, number> = {};
    
    history.forEach(trip => {
      // Create date object correctly handling timezone offsets roughly
      // We rely on the stored ISO string.
      const date = new Date(trip.date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const key = `${year}-${month}`;
      
      monthsMap[key] = (monthsMap[key] || 0) + trip.total;
    });

    // 2. Sort keys chronologically
    const sortedKeys = Object.keys(monthsMap).sort();

    // 3. Transform to display format
    const data = sortedKeys.map(key => {
      const [year, month] = key.split('-');
      // Create a date for formatting (using middle of month to avoid timezone skips)
      const dateForLabel = new Date(parseInt(year), parseInt(month) - 1, 15);
      
      // Label format: "Fev/2024" or similar
      const label = dateForLabel.toLocaleString('pt-BR', { month: 'short', year: '2-digit' });
      
      return { 
        label: label.replace('.', ''), // Clean up "fev." to "fev" if needed
        value: monthsMap[key],
        fullDate: key // store for reference if needed
      };
    });

    const maxValue = Math.max(...data.map(d => d.value), 100);

    return { data, maxValue };
  };

  const { data: chartData, maxValue } = processChartData();

  return (
    <div className="animate-fade-in pb-10">
      {/* Tabs */}
      <div className="flex bg-slate-800 rounded-lg p-1 mb-6 border border-slate-700">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'list' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <List className="w-4 h-4" />
          Lista Detalhada
        </button>
        <button
          onClick={() => setActiveTab('chart')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'chart' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Gráfico Mensal
        </button>
      </div>

      {/* Content */}
      {history.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>Nenhum histórico de compras ainda.</p>
        </div>
      ) : (
        <>
          {activeTab === 'list' && (
            <div className="space-y-4">
              {history.map((trip) => (
                <div key={trip.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-sm hover:border-slate-600 transition-colors">
                  <div 
                    onClick={() => toggleExpand(trip.id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-700/30 transition-colors relative"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-indigo-900/30 p-2.5 rounded-lg text-indigo-400 border border-indigo-500/20">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {new Date(trip.date).toLocaleDateString('pt-BR', { 
                            weekday: 'short', day: '2-digit', month: 'long', year: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {trip.itemCount} itens • <span className="text-emerald-400 font-medium">R$ {trip.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                       <button
                         onClick={(e) => handleDeleteClick(e, trip.id)}
                         className="relative z-10 p-2 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
                         title="Excluir histórico"
                       >
                         <Trash2 className="w-5 h-5" />
                       </button>
                       <div className="w-px h-6 bg-slate-700 mx-1"></div>
                       {expandedTripId === trip.id ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </div>
                  </div>

                  {expandedTripId === trip.id && (
                    <div className="bg-slate-900/50 p-4 border-t border-slate-700/50 animate-fade-in">
                      <ul className="space-y-2">
                        {trip.items.map((item, idx) => (
                          <li key={`${trip.id}-${idx}`} className="flex justify-between text-sm py-1 border-b border-slate-800 last:border-0 border-dashed">
                            <span className="text-slate-300">
                              <span className="text-slate-500 mr-2 font-mono text-xs">{item.quantity}x</span>
                              {item.name}
                            </span>
                            <span className="text-slate-400">R$ {(item.price * item.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 pt-3 border-t border-slate-700 flex justify-between text-white font-bold text-base">
                        <span>Total da Compra</span>
                        <span className="text-emerald-400">R$ {trip.total.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'chart' && (
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
              <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
                 <BarChart3 className="w-5 h-5 text-indigo-400" />
                 Evolução de Gastos
              </h3>
              
              <div className="flex items-end justify-around gap-3 h-64 px-2 pb-2">
                {chartData.map((dataPoint, idx) => {
                  const heightPercent = Math.max((dataPoint.value / maxValue) * 100, 2); 
                  
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                      
                      {/* Bar Value (Always visible on hover, or always if space permits) */}
                      <div 
                         className="mb-2 text-xs font-bold text-white opacity-80 group-hover:opacity-100 group-hover:text-indigo-300 transition-all transform group-hover:-translate-y-1"
                      >
                         R$ {Math.round(dataPoint.value)}
                      </div>

                      {/* Bar */}
                      <div 
                        className="w-full max-w-[40px] bg-gradient-to-t from-indigo-900 via-indigo-600 to-indigo-400 rounded-t-lg shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 relative overflow-hidden"
                        style={{ height: `${heightPercent}%` }} 
                      >
                         {/* Shine effect */}
                         <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent"></div>
                      </div>
                      
                      {/* X Axis Label */}
                      <div className="text-[10px] sm:text-xs text-slate-400 mt-3 font-medium truncate w-full text-center uppercase tracking-wide border-t border-slate-700 pt-2 w-full">
                        {dataPoint.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
