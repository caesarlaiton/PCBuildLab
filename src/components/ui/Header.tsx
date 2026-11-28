import React from 'react';
import {
  Cpu,
  Layers,
  Volume2,
  VolumeX,
  Bot,
  Box,
  RotateCcw,
  Monitor,
  Tag,
} from 'lucide-react';
import { ViewMode } from '../../types';
import { getSoundEnabled, setSoundEnabled, playSelectSound } from '../../utils/audio';

interface HeaderProps {
  viewMode: ViewMode;
  onSetViewMode: (mode: ViewMode) => void;
  showCase: boolean;
  onToggleCase: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  onOpenAIAssistant: () => void;
  onResetView: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onSetViewMode,
  showCase,
  onToggleCase,
  showLabels,
  onToggleLabels,
  onOpenAIAssistant,
  onResetView,
}) => {
  const [soundOn, setSoundOn] = React.useState(getSoundEnabled());

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playSelectSound();
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-20 p-3 pointer-events-none flex flex-col md:flex-row items-center justify-between gap-3 opacity-90 hover:opacity-100 transition-opacity duration-300">
      <div 
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className="pointer-events-auto flex items-center gap-3 glass-panel px-4 py-2 rounded-2xl border border-slate-300 shadow-sm"
      >
        <div className="w-8 h-8 rounded-xl bg-slate-950 text-white flex items-center justify-center shadow-md">
          <Cpu className="w-4 h-4 text-white stroke-[2.5]" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-[9px] tracking-[0.3em] uppercase font-bold text-slate-950 font-mono">
            Laboratorio de Ensamblaje
          </h1>
          <p className="text-sm font-bold tracking-tight text-slate-900 font-mono flex items-center gap-1.5">
            PCBUILDLAB <span className="text-[10px] text-slate-500 font-normal">v4.0.2</span>
          </p>
        </div>
      </div>

      <div 
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 glass-panel p-1.5 rounded-full px-3.5 border border-slate-300 shadow-sm"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            playSelectSound();
            onSetViewMode('standard');
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase font-mono transition-all cursor-pointer ${
            viewMode === 'standard'
              ? 'bg-slate-950 text-white shadow-md'
              : 'text-slate-600 hover:text-black hover:bg-slate-100'
          }`}
        >
          <Box className="w-3 h-3" />
          Ensamblaje
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            playSelectSound();
            onSetViewMode('exploded');
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase font-mono transition-all cursor-pointer ${
            viewMode === 'exploded'
              ? 'bg-slate-950 text-white shadow-md'
              : 'text-slate-600 hover:text-black hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3 h-3" />
          Explosionada
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            playSelectSound();
            onToggleCase();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          title="Alternar chasis del case 3D de PC"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase font-mono transition-all cursor-pointer border ${
            showCase
              ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/25 ring-2 ring-blue-400/30'
              : 'bg-slate-100 text-slate-700 border-slate-300 hover:text-black hover:bg-slate-200'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Case: {showCase ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            playSelectSound();
            onToggleLabels();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          title="Alternar tags de nombres de componentes"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase font-mono transition-all cursor-pointer border ${
            showLabels
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/25 ring-2 ring-emerald-400/30'
              : 'bg-slate-100 text-slate-700 border-slate-300 hover:text-black hover:bg-slate-200'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Tags: {showLabels ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      <div 
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className="pointer-events-auto flex items-center gap-2"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            playSelectSound();
            onResetView();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          title="Restablecer vista de cámara"
          className="p-2 rounded-xl glass-panel text-slate-800 hover:text-black hover:bg-slate-100 border border-slate-300 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSound();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          title={soundOn ? 'Silenciar SFX' : 'Activar SFX'}
          className="p-2 rounded-xl glass-panel text-slate-800 hover:text-black hover:bg-slate-100 border border-slate-300 transition-all cursor-pointer"
        >
          {soundOn ? <Volume2 className="w-3.5 h-3.5 text-black" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            playSelectSound();
            onOpenAIAssistant();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black text-white font-bold text-[11px] uppercase tracking-wider hover:bg-slate-800 transition-colors shadow-md cursor-pointer"
        >
          <Bot className="w-3.5 h-3.5 text-white" />
          <span>Consultar IA</span>
        </button>
      </div>
    </header>
  );
};