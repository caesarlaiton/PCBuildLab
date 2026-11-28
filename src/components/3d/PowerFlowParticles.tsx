import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PowerFlowParticlesProps {
  active: boolean;
}

export const PowerFlowParticles: React.FC<PowerFlowParticlesProps> = ({ active }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current || !active) return;
    const t = state.clock.getElapsedTime();

    groupRef.current.children.forEach((child, idx) => {
      const offset = (t * 2 + idx * 0.4) % 1;
      // Interpola a lo largo de rutas de señal predefinidas
      if (idx % 3 === 0) {
        // Ruta CPU -> RAM
        child.position.x = 0 + offset * 0.95;
        child.position.y = 0.45;
        child.position.z = 0.2 - offset * 0.1;
      } else if (idx % 3 === 1) {
        // Ruta CPU -> GPU
        child.position.x = 0;
        child.position.y = 0.45 - offset * 0.85;
        child.position.z = 0.2 + offset * 0.9;
      } else {
        // Ruta alimentación PSU -> Motherboard
        child.position.x = -0.8 + offset * 0.8;
        child.position.y = -1.35 + offset * 1.35;
        child.position.z = 0.3 - offset * 0.4;
      }
    });
  });

  if (!active) return null;

  return (
    <group ref={groupRef}>
      {Array.from({ length: 18 }).map((_, idx) => (
        <mesh key={idx}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshBasicMaterial
            color={idx % 2 === 0 ? '#ffffff' : '#e2e8f0'}
            transparent
            opacity={0.95}
          />
        </mesh>
      ))}
    </group>
  );
};