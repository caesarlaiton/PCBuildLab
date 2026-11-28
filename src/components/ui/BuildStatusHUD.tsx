import React from 'react';
import { ComponentId, InventoryComponent } from '../../types';
import { Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { playSelectSound } from '../../utils/audio';

interface BuildStatusHUDProps {
  selectedProducts: Record<ComponentId, InventoryComponent | null>;
  onSelectSlot: (id: ComponentId) => void;
  compatibilityResults: Array<{ status: 'compatible' | 'warning' | 'incompatible' }>;
}

const SLOTS: { id: ComponentId; label: string }[] = [
  { id: 'cpu', label: 'CPU' },
  { id: 'motherboard', label: 'MOBO' },
  { id: 'ram', label: 'RAM' },
  { id: 'gpu', label: 'GPU' },
  { id: 'storage', label: 'SSD' },
  { id: 'cooler', label: 'AIO' },
  { id: 'psu', label: 'PSU' },
];

export const BuildStatusHUD: React.FC<BuildStatusHUDProps> = ({
  selectedProducts,
  onSelectSlot,
  compatibilityResults,
}) => {
  const selectedCount = Object.values(selectedProducts).filter(Boolean).length;
  
  const totalWatts = Object.values(selectedProducts).reduce(
    (sum, prod) => sum + (prod?.powerDrawWatts || 0),
    0
  );

  const hasIncompatible = compatibilityResults.some((r) => r.status === 'incompatible');
  const hasWarning = compatibilityResults.some((r) => r.status === 'warning');

  return (
    <div 
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className="absolute top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex items-center gap-3 glass-panel p-2 px-4 rounded-full shadow-lg border border-slate-300 max-w-[95vw] overflow-x-auto opacity-90 hover:opacity-100 transition-opacity"
    >
      <div className="flex items-center gap-1.5 border-r border-slate-300 pr-3 shrink-0">
        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
          Ensamblaje:
        </span>
        <span className="text-xs font-mono font-black text-slate-900">
          {selectedCount}/7
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {SLOTS.map((slot) => {
          const isSelected = !!selectedProducts[slot.id];
          return (
            <button
              key={slot.id}
              onClick={() => {
                playSelectSound();
                onSelectSlot(slot.id);
              }}
              className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded-md transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700'
              }`}
            >
              {slot.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5 border-l border-slate-300 pl-3 shrink-0">
        <Zap className="w-3.5 h-3.5 text-amber-500" />
        <span className="text-xs font-mono font-black text-slate-900">
          {totalWatts}W
        </span>
      </div>

      <div className="flex items-center border-l border-slate-300 pl-3 shrink-0">
        {hasIncompatible ? (
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
            <AlertCircle className="w-3 h-3" /> Incompatible
          </span>
        ) : hasWarning ? (
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <AlertCircle className="w-3 h-3" /> Revisar
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Correcto
          </span>
        )}
      </div>
    </div>
  );
};