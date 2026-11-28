import React from 'react';

interface ThermalOverlayProps {
  active: boolean;
}

export const ThermalOverlay: React.FC<ThermalOverlayProps> = ({ active }) => {
  if (!active) return null;

  return (
    <group>
      {/* Aura térmica de la CPU (alta temperatura 78°C) */}
      <mesh position={[0, 0.5, 0.2]}>
        <sphereGeometry args={[0.65, 24, 24]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.25} wireframe />
      </mesh>

      {/* Aura térmica de la GPU (temperatura moderada 68°C) */}
      <mesh position={[0, -0.3, 1.1]}>
        <sphereGeometry args={[0.9, 24, 24]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.2} wireframe />
      </mesh>

      {/* Zona térmica de fases de alimentación VRM */}
      <mesh position={[-0.7, 0.3, 0.2]}>
        <boxGeometry args={[0.6, 0.5, 1.3]} />
        <meshBasicMaterial color="#dc2626" transparent opacity={0.3} />
      </mesh>

      {/* Zona térmica del SSD NVMe */}
      <mesh position={[0.1, -0.1, 0.15]}>
        <boxGeometry args={[0.4, 0.3, 0.9]} />
        <meshBasicMaterial color="#ea580c" transparent opacity={0.25} />
      </mesh>
    </group>
  );
};