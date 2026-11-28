import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PSU3DProps {
  isSelected: boolean;
  viewMode: string;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}

export const PSU3D: React.FC<PSU3DProps> = ({
  isSelected,
  viewMode,
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  const psuFanRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (psuFanRef.current) {
      psuFanRef.current.rotation.z += delta * 9;
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
      {/* 1. CARCASA PRINCIPAL DE ACERO PESADO CON RECUBRIMIENTO EN POLVO (perfil vertical para doble cámara) */}
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.54, 1.25, 1.35]} />
        <meshStandardMaterial
          color={isThermal ? '#ef4444' : isSelected ? '#18181b' : hovered ? '#27272a' : '#0e131f'}
          metalness={0.88}
          roughness={0.22}
          emissive={isThermal ? '#dc2626' : isSelected ? '#ffffff' : hovered ? '#cbd5e1' : '#000000'}
          emissiveIntensity={isThermal ? 0.6 : isSelected ? 0.4 : hovered ? 0.2 : 0}
        />
      </mesh>

      {/* INSIGNIA DE CERTIFICACIÓN DE ALTA EFICIENCIA 80+ PLATINUM */}
      <mesh position={[-0.275, 0.2, 0.2]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.34, 0.34]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.98} roughness={0.05} />
      </mesh>

      {/* 2. CONECTOR TRASERO C14, INTERRUPTOR BALANCÍN Y MALLA TIPO PANAL DE EXTRACCIÓN */}
      <group position={[0, 0, -0.68]}>
        {/* Patrón de malla tipo panal (vertical) */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[0.5, 1.2]} />
          <meshStandardMaterial color="#020617" wireframe />
        </mesh>

        {/* Toma de corriente C14 */}
        <mesh position={[0, -0.35, -0.01]}>
          <boxGeometry args={[0.24, 0.18, 0.04]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* Interruptor general de encendido */}
        <mesh position={[0, -0.15, -0.01]}>
          <boxGeometry args={[0.12, 0.12, 0.04]} />
          <meshStandardMaterial color="#dc2626" metalness={0.8} />
        </mesh>
      </group>

      {/* 3. REJILLA LATERAL DE ADMISIÓN DE 120MM Y VENTILADOR FDB (orientado hacia el panel lateral sólido exterior) */}
      <group position={[-0.275, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Anillo exterior circular de la rejilla */}
        <mesh>
          <ringGeometry args={[0.34, 0.44, 32]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.95} />
        </mesh>

        {/* Anillos concéntricos de protección de la rejilla */}
        {[0.12, 0.22, 0.32].map((radius, idx) => (
          <mesh key={`grille-${idx}`}>
            <torusGeometry args={[radius, 0.01, 12, 32]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
          </mesh>
        ))}

        {/* Aspas giratorias del ventilador */}
        <group ref={psuFanRef}>
          {[0, 60, 120, 180, 240, 300].map((angle, idx) => (
            <mesh key={`psu-blade-${idx}`} rotation={[0, 0, (angle * Math.PI) / 180]}>
              <boxGeometry args={[0.08, 0.38, 0.012]} />
              <meshStandardMaterial color="#3f3f46" metalness={0.6} />
            </mesh>
          ))}
        </group>
      </group>

      {/* 4. PANEL DE CONECTORES TOTALMENTE MODULAR (orientado hacia el frente del case) */}
      <group position={[0, 0, 0.68]}>
        {/* Arreglo de puertos de salida modulares */}
        {[-0.35, -0.12, 0.12, 0.35].map((y, i) =>
          [-0.14, 0.14].map((x, j) => (
            <mesh key={`mod-port-${i}-${j}`} position={[x, y, 0]}>
              <boxGeometry args={[0.16, 0.16, 0.02]} />
              <meshStandardMaterial color="#020617" roughness={0.3} />
            </mesh>
          ))
        )}
      </group>


    </group>
  );
};