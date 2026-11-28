import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RAM3DProps {
  isSelected: boolean;
  viewMode: string;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}

export const RAM3D: React.FC<RAM3DProps> = ({
  isSelected,
  viewMode,
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  const rgbBarRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (rgbBarRef.current) {
      const t = state.clock.getElapsedTime();
      const brightness = 0.88 + Math.sin(t * 3.5) * 0.12;
      (rgbBarRef.current.material as THREE.MeshBasicMaterial).color.setRGB(
        brightness,
        brightness,
        brightness
      );
    }
  });

  const isThermal = viewMode === 'thermal';

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onPointerOver();
      }}
      onPointerOut={() => {
        setHovered(false);
        onPointerOut();
      }}
    >
      {/* 2 módulos de memoria DDR5 de alta velocidad en doble canal (en ranuras 2 y 4) */}
      {[-0.06, 0.18].map((xOffset, idx) => (
        <group key={`ram-stick-${idx}`} position={[xOffset, 0, 0]}>
          {/* Cuerpo principal del disipador (aluminio negro cepillado anodizado) */}
          <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[0.045, 0.48, 1.18]} />
            <meshStandardMaterial
              color={isThermal ? '#ef4444' : isSelected ? '#18181b' : hovered ? '#27272a' : '#0d1117'}
              metalness={0.92}
              roughness={0.14}
              emissive={isThermal ? '#dc2626' : isSelected ? '#ffffff' : hovered ? '#cbd5e1' : '#000000'}
              emissiveIntensity={isThermal ? 0.6 : isSelected ? 0.4 : hovered ? 0.2 : 0}
            />
          </mesh>

          {/* Aletas decorativas plateadas metálicas con corte diamante */}
          <mesh position={[0.024, 0.08, 0]}>
            <boxGeometry args={[0.005, 0.28, 1.08]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.98} roughness={0.05} />
          </mesh>
          <mesh position={[-0.024, 0.08, 0]}>
            <boxGeometry args={[0.005, 0.28, 1.08]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.98} roughness={0.05} />
          </mesh>

          {/* Relieve central del controlador PMIC de gestión de energía */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.052, 0.12, 0.25]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>

          {/* Contactos dorados en el borde inferior con muesca clave DDR5 */}
          <group position={[0, -0.26, 0]}>
            <mesh position={[0, 0, -0.26]}>
              <boxGeometry args={[0.02, 0.045, 0.58]} />
              <meshStandardMaterial color="#d97706" metalness={0.95} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0, 0.28]}>
              <boxGeometry args={[0.02, 0.045, 0.54]} />
              <meshStandardMaterial color="#d97706" metalness={0.95} roughness={0.1} />
            </mesh>
          </group>

          {/* Difusor superior blanco de acrílico esmerilado para barra de luz */}
          <mesh ref={idx === 0 ? rgbBarRef : undefined} position={[0, 0.255, 0]}>
            <boxGeometry args={[0.048, 0.055, 1.20]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}
    </group>
  );
};