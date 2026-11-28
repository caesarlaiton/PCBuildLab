import React, { useState, useMemo } from 'react';
import * as THREE from 'three';

interface Storage3DProps {
  isSelected: boolean;
  viewMode: string;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}

export const Storage3D: React.FC<Storage3DProps> = ({
  isSelected,
  viewMode,
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  const [hovered, setHovered] = useState(false);
  const isThermal = viewMode === 'thermal';

  // Genera una textura nítida 2K en canvas similar a un SSD NVMe Samsung 990 PRO
  const ssdLabelTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // 1. Base de etiqueta en negro mate
      ctx.fillStyle = '#0f1014';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Borde exterior de la etiqueta
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#22252e';
      ctx.beginPath();
      ctx.roundRect(10, 10, canvas.width - 20, canvas.height - 20, 12);
      ctx.stroke();

      // Cuerpo interior de la etiqueta
      ctx.fillStyle = '#14161c';
      ctx.beginPath();
      ctx.roundRect(14, 14, canvas.width - 28, canvas.height - 28, 10);
      ctx.fill();

      // 2. Sección izquierda: V-NAND SSD
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '600 36px system-ui, -apple-system, sans-serif';
      ctx.fillText('V-NAND SSD', 50, 85);

      // 3. Modelo principal: 990 PRO
      ctx.font = '900 120px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('990', 50, 195);

      const numWidth = ctx.measureText('990').width;
      ctx.fillStyle = '#f43f5e'; // Rojo carmesí
      ctx.fillText('PRO', 50 + numWidth + 24, 195);

      // Barra roja de acento
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(50, 212, 340, 5);

      // 4. Subtítulo: PCIe 4.0 NVMe M.2 SSD
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 28px system-ui, -apple-system, sans-serif';
      ctx.fillText('PCIe 4.0 NVMe M.2 SSD', 50, 252);

      // 5. Sección derecha: logotipo SAMSUNG
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 52px system-ui, -apple-system, sans-serif';
      ctx.fillText('SAMSUNG', 700, 90);

      // Insignia de capacidad: 1TB
      ctx.font = '800 64px system-ui, -apple-system, sans-serif';
      ctx.fillText('1TB', 430, 280);

      // Texto legal / web al pie
      ctx.fillStyle = '#64748b';
      ctx.font = '500 20px system-ui, -apple-system, sans-serif';
      ctx.fillText('www.samsung.com/ssd', 50, 285);
      ctx.fillText('SAMSUNG ELECTRONICS CO., LTD.', 50, 305);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    return tex;
  }, []);

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
      {/* 1. SUSTRATO PCB NEGRO MATE DE SSD NVME M.2 2280 */}
      <mesh castShadow position={[0, -0.01, 0]}>
        <boxGeometry args={[0.26, 0.018, 0.86]} />
        <meshStandardMaterial
          color={isThermal ? '#ef4444' : isSelected ? '#18181b' : '#0a0d12'}
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>

      {/* 2. CHIPS DE MEMORIA NAND FLASH DEBAJO DE LA ETIQUETA */}
      {/* Chip controlador (dispersor térmico niquelado) */}
      <mesh position={[0, 0.008, 0.12]}>
        <boxGeometry args={[0.21, 0.012, 0.20]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* 2 encapsulados de memoria 3D V-NAND */}
      {[-0.24, -0.02].map((z, idx) => (
        <mesh key={`nand-chip-${idx}`} position={[0, 0.008, z]}>
          <boxGeometry args={[0.22, 0.012, 0.18]} />
          <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      {/* Microrresistencias / capacitores SMD a lo largo de los bordes del PCB */}
      {[-0.38, -0.32, -0.26, 0.22, 0.28, 0.34].map((zPos, idx) => (
        <React.Fragment key={`smd-row-${idx}`}>
          <mesh position={[-0.10, 0.006, zPos]}>
            <boxGeometry args={[0.02, 0.01, 0.025]} />
            <meshStandardMaterial color={idx % 2 === 0 ? '#eab308' : '#cbd5e1'} metalness={0.9} />
          </mesh>
          <mesh position={[0.10, 0.006, zPos]}>
            <boxGeometry args={[0.02, 0.01, 0.025]} />
            <meshStandardMaterial color={idx % 2 === 1 ? '#eab308' : '#94a3b8'} metalness={0.9} />
          </mesh>
        </React.Fragment>
      ))}

      {/* 3. ETIQUETA ADHESIVA DISIPADORA DE MARCA SAMSUNG 990 PRO */}
      <mesh position={[0, 0.016, -0.03]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[0.70, 0.23]} />
        <meshStandardMaterial
          map={ssdLabelTexture}
          roughness={0.3}
          metalness={0.1}
          emissive={isThermal ? '#ef4444' : isSelected ? '#38bdf8' : hovered ? '#64748b' : '#000000'}
          emissiveIntensity={isThermal ? 0.6 : isSelected ? 0.3 : hovered ? 0.15 : 0}
        />
      </mesh>

      {/* 4. CONTACTOS DORADOS M.2 KEY-M */}
      <group position={[0, -0.01, 0.43]}>
        {/* Bloque izquierdo de pines */}
        <mesh position={[-0.06, 0, 0]}>
          <boxGeometry args={[0.10, 0.016, 0.06]} />
          <meshStandardMaterial color="#eab308" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Separación de muesca Key-M */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.018, 0.016, 0.06]} />
          <meshStandardMaterial color="#090a0f" />
        </mesh>
        {/* Bloque derecho de pines */}
        <mesh position={[0.06, 0, 0]}>
          <boxGeometry args={[0.10, 0.016, 0.06]} />
          <meshStandardMaterial color="#eab308" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* 5. MUESCA TRASERA DE MONTAJE CON ANILLO DORADO CIRCUNDANTE */}
      <group position={[0, -0.01, -0.41]}>
        {/* Anillo dorado de tierra alrededor de la muesca */}
        <mesh position={[0, 0.002, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.018, 16]} />
          <meshStandardMaterial color="#eab308" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Recorte de muesca para tornillo de montaje */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.032, 0.032, 0.022, 16]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
      </group>

      {/* Indicador LED sutil de lectura/escritura */}
      <mesh position={[0.10, 0.016, -0.38]}>
        <sphereGeometry args={[0.012, 12, 12]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
    </group>
  );
};