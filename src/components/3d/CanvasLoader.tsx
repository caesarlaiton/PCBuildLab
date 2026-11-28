import React from 'react';
import { useProgress } from '@react-three/drei';
import { Cpu } from 'lucide-react';

interface CanvasLoaderProps {
  // Permite renderizarse como overlay sobre la escena
  isOverlay?: boolean;
  // Progreso combinado para garantizar avance visible incluso sin eventos del DefaultLoadingManager
  displayProgress?: number;
  // Indica si la animacion de salida esta en curso
  isFadingOut?: boolean;
}

export const CanvasLoader: React.FC<CanvasLoaderProps> = ({
  isOverlay = true,
  displayProgress,
  isFadingOut = false,
}) => {
  const { progress } = useProgress();

  // Prioriza el progreso calculado de la escena si se provee; de lo contrario usa useProgress
  const rawProgress = typeof displayProgress === 'number' ? displayProgress : progress;
  const clampedProgress = Math.max(0, Math.min(100, rawProgress));

  const loaderContent = (
    <div className="flex flex-col items-center justify-center p-6 rounded-2xl glass-panel-dark text-white border border-slate-700/80 shadow-2xl min-w-[260px] bg-slate-950/90 backdrop-blur-md">
      <div className="relative mb-3 flex items-center justify-center">
        <Cpu className="w-8 h-8 text-blue-400 animate-pulse" />
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
      </div>
      <p className="text-xs font-mono font-bold tracking-widest uppercase text-slate-300 mb-1">
        Cargando Laboratorio 3D
      </p>
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
        <div
          className="bg-blue-500 h-full transition-all duration-150"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      <span className="text-[10px] font-mono text-slate-400 font-bold">
        {clampedProgress.toFixed(0)}% COMPLETADO
      </span>
    </div>
  );

  if (isOverlay) {
    return (
      <div
        className={`absolute inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm pointer-events-auto transition-opacity duration-300 ${
          isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};