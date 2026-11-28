import React, { useState } from 'react';

interface CPU3DProps {
  isSelected: boolean;
  viewMode: string;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}

export const CPU3D: React.FC<CPU3DProps> = ({
  isSelected,
  viewMode,
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  const [hovered, setHovered] = useState(false);
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
      {/* 1. PCB del sustrato de silicio */}
      <mesh castShadow position={[0, -0.02, 0]}>
        <boxGeometry args={[0.82, 0.035, 0.82]} />
        <meshStandardMaterial
          color={isThermal ? '#ef4444' : isSelected ? '#18181b' : '#047857'}
          metalness={0.4}
          roughness={0.45}
        />
      </mesh>

      {/* Borde de contactos / pads dorados */}
      <mesh position={[0, -0.035, 0]}>
        <boxGeometry args={[0.84, 0.008, 0.84]} />
        <meshStandardMaterial color="#d97706" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Triángulo dorado indicador del pin 1 en la esquina */}
      <mesh position={[-0.38, -0.001, -0.38]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.06, 0.06]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.95} />
      </mesh>

      {/* Arreglos de capacitores de montaje superficial en la parte superior del PCB */}
      {[-0.32, -0.24, 0.24, 0.32].map((x, i) =>
        [-0.32, 0.32].map((z, j) => (
          <mesh key={`smc-${i}-${j}`} position={[x, 0.002, z]}>
            <boxGeometry args={[0.03, 0.01, 0.03]} />
            <meshStandardMaterial color="#d1d5db" metalness={0.9} />
          </mesh>
        ))
      )}

      {/* 2. Dispersor térmico integrado (IHS) de cobre niquelado */}
      <mesh castShadow position={[0, 0.035, 0]}>
        <boxGeometry args={[0.7, 0.065, 0.7]} />
        <meshStandardMaterial
          color={isThermal ? '#ef4444' : isSelected ? '#18181b' : hovered ? '#ffffff' : '#f8fafc'}
          metalness={0.96}
          roughness={0.12}
          emissive={isThermal ? '#dc2626' : isSelected ? '#ffffff' : hovered ? '#cbd5e1' : '#000000'}
          emissiveIntensity={isThermal ? 0.8 : isSelected ? 0.4 : hovered ? 0.2 : 0}
        />
      </mesh>

      {/* Aletas biseladas del borde del IHS */}
      <mesh position={[0, 0.015, 0]}>
        <boxGeometry args={[0.78, 0.015, 0.78]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.08} />
      </mesh>

      {/* Marcado láser y placa de especificaciones del producto */}
      <mesh position={[0, 0.068, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, 0.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.25} metalness={0.85} />
      </mesh>

      {/* Líneas grabadas a láser con especificaciones del núcleo */}
      <mesh position={[0, 0.069, -0.08]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.38, 0.04]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.069, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.32, 0.03]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 3. Sujeciones y mecanismo de bloqueo de acero inoxidable del socket LGA */}
      <mesh position={[-0.39, 0.01, 0]}>
        <boxGeometry args={[0.04, 0.04, 0.8]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.98} roughness={0.05} />
      </mesh>
      <mesh position={[0.39, 0.01, 0]}>
        <boxGeometry args={[0.04, 0.04, 0.8]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.98} roughness={0.05} />
      </mesh>
    </group>
  );
};