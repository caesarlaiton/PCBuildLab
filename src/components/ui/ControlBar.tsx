import React from 'react';
import { ComponentId, InventoryComponent } from '../../types';
import { Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { playSelectSound } from '../../utils/audio';

interface ControlBarProps {
  selectedComponentId: ComponentId | null;
  onSelectComponent: (id: ComponentId) => void;
  explodedFactor: number;
  onChangeExplodedFactor: (val: number) => void;
  selectedProducts: Record<ComponentId, InventoryComponent | null>;
  compatibilityResults: Array<{ status: 'compatible' | 'warning' | 'incompatible' }>;
}

// Lista de componentes
const SHORT_SLOTS: { id: ComponentId; label: string }[] = [
  { id: 'cpu', label: 'CPU' },
  { id: 'motherboard', label: 'MOBO' },
  { id: 'ram', label: 'RAM' },
  { id: 'gpu', label: 'GPU' },
  { id: 'storage', label: 'SSD' },
  { id: 'cooler', label: 'AIO' },
  { id: 'psu', label: 'PSU' },
];

export const ControlBar: React.FC<ControlBarProps> = ({
  selectedComponentId,
  onSelectComponent,
  explodedFactor,
  onChangeExplodedFactor,
  selectedProducts,
  compatibilityResults,
}) => {
  // Cantidad de componentes elegidos sobre los 7 requeridos
  const selectedCount = Object.values(selectedProducts).filter(Boolean).length;
  
  // Consumo en Watts acumulado
  const totalWatts = Object.values(selectedProducts).reduce(
    (sum, prod) => sum + (prod?.powerDrawWatts || 0),
    0
  );

  // Verificación rápida de fallas de compatibilidad
  const hasIncompatible = compatibilityResults.some((r) => r.status === 'incompatible');
  const hasWarning = compatibilityResults.some((r) => r.status === 'warning');

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-2 max-w-[95vw]">
      <div 
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className="pointer-events-auto flex items-center gap-2 glass-panel p-2 px-3 rounded-2xl border border-slate-300 shadow-lg overflow-x-auto max-w-full opacity-90 hover:opacity-100 transition-opacity"
      >
        {/* Widget resumen de ensamblaje */}
        <div className="flex items-center gap-2 pr-2 border-r border-slate-300 shrink-0">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
              Build:
            </span>
            <span className="text-xs font-mono font-black text-slate-900">
              {selectedCount}/7
            </span>
          </div>

          <div className="flex items-center gap-1 pl-1 text-xs font-mono">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-bold text-slate-900">{totalWatts}W</span>
          </div>

          {hasIncompatible ? (
            <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
              <AlertCircle className="w-3 h-3" /> Error
            </span>
          ) : hasWarning ? (
            <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              <AlertCircle className="w-3 h-3" /> Alerta
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" /> OK
            </span>
          )}
        </div>

        {/* Botones de slots con nombres cortos */}
        <div className="flex items-center gap-1 shrink-0">
          {SHORT_SLOTS.map((slot) => {
            const isSelected = selectedComponentId === slot.id;
            const isConfigured = !!selectedProducts[slot.id];

            return (
              <button
                key={slot.id}
                onClick={() => {
                  playSelectSound();
                  onSelectComponent(slot.id);
                }}
                className={`px-2 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  isSelected
                    ? 'bg-slate-950 text-white shadow-sm scale-105'
                    : isConfigured
                    ? 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800'
                }`}
              >
                <span>{slot.label}</span>
                {isConfigured && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Control deslizante de vista explosionada 3D */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-300 shrink-0">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase whitespace-nowrap">
            Desglose:
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={explodedFactor}
            onChange={(e) => onChangeExplodedFactor(parseFloat(e.target.value))}
            className="w-20 accent-slate-950 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};