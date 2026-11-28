import React from 'react';
import { Html } from '@react-three/drei';
import { ComponentId } from '../../types';

interface Component3DLabelProps {
  id: ComponentId;
  // Nombre abreviado del componente que se muestra en la línea superior de la etiqueta.
  name: string;
  // Nombre del producto elegido para este componente; null o undefined indica que aún no hay selección.
  productName?: string | null;
  // URL de la imagen del producto elegido, usada para mostrar una miniatura circular.
  productImageUrl?: string | null;
  color: string;
  isSelected: boolean;
  isHovered: boolean;
  hidden?: boolean;
  position: [number, number, number];
  onClick: (e?: any) => void;
  onPointerOver: (e?: any) => void;
  onPointerOut: (e?: any) => void;
}

export const Component3DLabel: React.FC<Component3DLabelProps> = ({
  name,
  productName,
  productImageUrl,
  color,
  isSelected,
  isHovered,
  hidden = false,
  position,
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  if (hidden) return null;

  const active = isSelected || isHovered;

  const triggerClick = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    onClick(e);
  };

  return (
    <Html
      position={position}
      center
      distanceFactor={7.5}
      zIndexRange={[10, 0]}
      pointerEvents="auto"
    >
      <button
        type="button"
        onClick={triggerClick}
        onPointerDown={(e) => {
          e.stopPropagation();
          // Dispara la selección en pointer down para una respuesta instantánea de un solo clic
          onClick(e);
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onPointerOver(e);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onPointerOut(e);
        }}
        className={`group cursor-pointer flex items-center gap-2 transition-all duration-300 select-none rounded-full border shadow-md ${
          isSelected
            ? 'bg-slate-950 text-white border-black scale-105 px-3.5 py-1.5 opacity-100 ring-2 ring-black z-30 shadow-xl'
            : isHovered
            ? 'bg-white text-slate-950 border-slate-900 scale-100 px-3 py-1.5 opacity-100 z-20 shadow-lg'
            : 'bg-white/70 backdrop-blur-md border-slate-300/80 text-slate-800 opacity-40 hover:opacity-100 px-2.5 py-1 scale-90 hover:scale-100'
        }`}
      >
        <span
          className={`rounded-full transition-all duration-300 ${
            active ? 'w-2.5 h-2.5 animate-pulse shadow-sm' : 'w-2 h-2 opacity-80'
          }`}
          style={{ backgroundColor: color }}
        />

        <div className="flex min-w-0 flex-col text-left transition-all duration-300">
          {/* Mantiene visibles los detalles al seleccionar o pasar el cursor, y también para componentes que ya tienen un producto elegido. */}
          {active || Boolean(productName) ? (
            <>
              {/* La línea superior identifica el tipo de componente con su abreviatura, en lugar de mostrar la categoría descriptiva. */}
              <div className="flex items-center gap-1.5 leading-tight">
                <span className={`text-[8px] uppercase tracking-wider font-mono font-extrabold ${
                  isSelected ? 'text-slate-300' : 'text-slate-500'
                }`}>
                  {name}
                </span>
                {isSelected && (
                  <span className="text-[8px] bg-white text-black px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                    INSPECCIONANDO
                  </span>
                )}
              </div>

              {/* La línea inferior resalta el producto elegido o invita a seleccionar uno cuando aún no existe una selección. */}
              <div className={`flex max-w-[230px] min-w-0 items-center gap-1.5 text-[11px] font-black leading-tight ${
                isSelected ? 'text-white' : 'text-slate-900'
              }`}>
                <span className="min-w-0 flex-1 truncate">
                  {productName || 'Selecciona un producto'}
                </span>

                {/* La miniatura circular solo aparece cuando hay un producto elegido y este tiene una imagen disponible. */}
                {productName && productImageUrl && (
                  <img
                    src={productImageUrl}
                    alt={`Imagen de ${productName}`}
                    title={productName}
                    loading="lazy"
                    draggable={false}
                    className="h-5 w-5 shrink-0 rounded-full border border-white/50 object-cover shadow-sm"
                  />
                )}
              </div>
            </>
          ) : (
            /* Las etiquetas sin selección permanecen compactas para evitar saturar visualmente la escena 3D. */
            <span className="text-[10px] font-mono font-bold tracking-tight text-slate-900 whitespace-nowrap">
              {name}
            </span>
          )}
        </div>
      </button>
    </Html>
  );
};
