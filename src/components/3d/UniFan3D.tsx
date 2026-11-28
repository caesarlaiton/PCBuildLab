import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface UniFan3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;
  spinSpeed?: number; // radianes por segundo
  reverseSpin?: boolean;
  showSideMirror?: boolean;
  rgbColor?: string;
  rgbIntensity?: number;
  bladeOpacity?: number;
  variant?: 'exhaust' | 'intake';
}

/**
 * Réplica fotorrealista 1:1 del ventilador ARGB de 120mm Lian Li UNI FAN TL / SL-Infinity
 * Depurado y alineado:
 * - Iluminación ARGB en blanco puro según lo solicitado
 * - Insignia LCD / espejo infinito en el buje central con emblema geométrico
 * - Halo circular característico con patrón perforado de matriz de puntos
 * - 7 aspas curvas tipo hoz translúcidas esmeriladas contenidas limpiamente dentro del marco del ventilador
 * - Marco cuadrado modular de encaje de precisión con almohadillas amortiguadoras en las esquinas y alojamientos para tornillos
 * - Moldura lateral doble en aluminio cepillado con canales luminosos de espejo infinito
 */
export const UniFan3D: React.FC<UniFan3DProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  spinSpeed = 10,
  reverseSpin = false,
  showSideMirror = true,
  rgbColor = '#ffffff',
  rgbIntensity = 1.6,
  bladeOpacity = 0.92,
}) => {
  const rotorRef = useRef<THREE.Group>(null);

  // Rota las aspas suavemente en cada frame alrededor del eje Z
  useFrame((_, delta) => {
    if (rotorRef.current) {
      const dir = reverseSpin ? -1 : 1;
      rotorRef.current.rotation.z += delta * spinSpeed * dir;
    }
  });

  // 1. Textura de la pantalla LCD / insignia infinita central (emblema en blanco puro)
  const centerBadgeTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 512, 512);

      // Base circular en negro obsidiana profundo
      ctx.fillStyle = '#05070a';
      ctx.beginPath();
      ctx.arc(256, 256, 250, 0, Math.PI * 2);
      ctx.fill();

      // Anillo exterior metálico del bisel
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#334155';
      ctx.stroke();

      ctx.lineWidth = 4;
      ctx.strokeStyle = '#64748b';
      ctx.beginPath();
      ctx.arc(256, 256, 242, 0, Math.PI * 2);
      ctx.stroke();

      // Contenedor interior tipo píldora / rectángulo redondeado de pantalla LCD
      const pillW = 260;
      const pillH = 130;
      const pillX = 256 - pillW / 2;
      const pillY = 256 - pillH / 2;
      const radius = 24;

      // Fondo y resplandor de la píldora
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, radius);
      ctx.fill();

      ctx.lineWidth = 6;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
      ctx.shadowBlur = 16;
      ctx.stroke();

      // Emblema geométrico nítido de hardware dentro de la píldora
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 18;

      // Dibuja un ícono geométrico tipo corona/corchete
      ctx.beginPath();
      // Corchete izquierdo
      ctx.rect(256 - 70, 256 - 32, 20, 64);
      // Corchete derecho
      ctx.rect(256 + 50, 256 - 32, 20, 64);
      // Bloque / chevrón geométrico central
      ctx.moveTo(256 - 36, 256 - 28);
      ctx.lineTo(256 + 36, 256 - 28);
      ctx.lineTo(256 + 36, 256 - 12);
      ctx.lineTo(256 + 14, 256 - 12);
      ctx.lineTo(256 + 14, 256 + 14);
      ctx.lineTo(256 + 36, 256 + 14);
      ctx.lineTo(256 + 36, 256 + 30);
      ctx.lineTo(256 - 36, 256 + 30);
      ctx.lineTo(256 - 36, 256 + 14);
      ctx.lineTo(256 - 14, 256 + 14);
      ctx.lineTo(256 - 14, 256 - 12);
      ctx.lineTo(256 - 36, 256 - 12);
      ctx.closePath();
      ctx.fill();

      // Reflejo sutil de brillo sobre el cristal
      ctx.shadowBlur = 0;
      const grad = ctx.createLinearGradient(0, pillY, 0, pillY + pillH);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(pillX + 4, pillY + 4, pillW - 8, (pillH - 8) / 2, [20, 20, 4, 4]);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    return tex;
  }, []);

  // 2. Textura característica del halo perforado tipo matriz de puntos (ARGB blanco)
  const dotMatrixHaloTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 1024, 1024);

      const cx = 512;
      const cy = 512;
      const innerR = 340;
      const outerR = 470;

      // Anillo suave de fondo blanco para difusión luminosa
      const bgGrad = ctx.createRadialGradient(cx, cy, innerR - 10, cx, cy, outerR + 10);
      bgGrad.addColorStop(0, 'rgba(255, 255, 255, 0.0)');
      bgGrad.addColorStop(0.15, 'rgba(255, 255, 255, 0.25)');
      bgGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.55)');
      bgGrad.addColorStop(0.85, 'rgba(255, 255, 255, 0.25)');
      bgGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2, true);
      ctx.fill();

      // 6 anillos concéntricos de micropuntos (perforación tipo matriz de puntos)
      const numRings = 6;
      for (let rIdx = 0; rIdx < numRings; rIdx++) {
        const radius = innerR + 15 + rIdx * ((outerR - innerR - 30) / (numRings - 1));
        const numDots = Math.floor(64 + rIdx * 16);
        const dotRadius = rIdx === 0 || rIdx === numRings - 1 ? 3.0 : 4.5;

        for (let d = 0; d < numDots; d++) {
          const angle = (d * 2 * Math.PI) / numDots;
          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * radius;

          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Líneas finas blancas interiores y exteriores del borde del halo
      ctx.shadowBlur = 10;
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy, innerR + 4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, outerR - 4, 0, Math.PI * 2);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    return tex;
  }, []);

  // 3. Textura de la ranura lateral de espejo infinito
  const sideInfinityTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0a0d14';
      ctx.fillRect(0, 0, 512, 128);

      // Borde en aluminio
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 6;
      ctx.strokeRect(6, 6, 500, 116);

      // Franja luminosa central infinita
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 16;
      ctx.fillRect(24, 48, 464, 32);

      // Línea fina interior
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(36, 58, 440, 12);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  // Dimensiones del marco del ventilador: perfil cuadrado estándar de 120mm (1.18 x 1.18 x 0.24)
  const FRAME_SIZE = 1.18;
  const HALF_FRAME = FRAME_SIZE / 2;
  const FRAME_DEPTH = 0.24;
  const HALF_DEPTH = FRAME_DEPTH / 2;
  const BORE_RADIUS = 0.52;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* ========================================================================= */}
      {/* 1. MARCO MODULAR CUADRADO DEL CHASIS (negro mate gunmetal) */}
      {/* ========================================================================= */}
      {/* Riel superior del marco */}
      <mesh position={[0, HALF_FRAME - 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[FRAME_SIZE, 0.10, FRAME_DEPTH]} />
        <meshStandardMaterial color="#090d14" metalness={0.85} roughness={0.28} />
      </mesh>

      {/* Riel inferior del marco */}
      <mesh position={[0, -HALF_FRAME + 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[FRAME_SIZE, 0.10, FRAME_DEPTH]} />
        <meshStandardMaterial color="#090d14" metalness={0.85} roughness={0.28} />
      </mesh>

      {/* Riel izquierdo del marco */}
      <mesh position={[-HALF_FRAME + 0.05, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.10, FRAME_SIZE - 0.20, FRAME_DEPTH]} />
        <meshStandardMaterial color="#090d14" metalness={0.85} roughness={0.28} />
      </mesh>

      {/* Riel derecho del marco */}
      <mesh position={[HALF_FRAME - 0.05, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.10, FRAME_SIZE - 0.20, FRAME_DEPTH]} />
        <meshStandardMaterial color="#090d14" metalness={0.85} roughness={0.28} />
      </mesh>

      {/* 4 bloques de esquina con almohadillas antivibración y alojamientos hexagonales para tornillos */}
      {[
        [-HALF_FRAME + 0.11, HALF_FRAME - 0.11],
        [HALF_FRAME - 0.11, HALF_FRAME - 0.11],
        [-HALF_FRAME + 0.11, -HALF_FRAME + 0.11],
        [HALF_FRAME - 0.11, -HALF_FRAME + 0.11],
      ].map(([cx, cy], idx) => (
        <group key={`corner-${idx}`} position={[cx, cy, 0]}>
          {/* Bloque sólido principal de esquina */}
          <mesh castShadow>
            <boxGeometry args={[0.22, 0.22, FRAME_DEPTH - 0.005]} />
            <meshStandardMaterial color="#0c1017" metalness={0.85} roughness={0.25} />
          </mesh>

          {/* Almohadillas de goma antivibración (cara frontal y trasera) */}
          <mesh position={[0, 0, HALF_DEPTH + 0.003]}>
            <boxGeometry args={[0.18, 0.18, 0.008]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0, -HALF_DEPTH - 0.003]}>
            <boxGeometry args={[0.18, 0.18, 0.008]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
          </mesh>

          {/* Alojamientos hexagonales en acero inoxidable para tornillos (rotados correctamente en el eje Z) */}
          <mesh position={[0, 0, HALF_DEPTH + 0.008]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.038, 0.038, 0.010, 12]} />
            <meshStandardMaterial color="#64748b" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0, -HALF_DEPTH - 0.008]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.038, 0.038, 0.010, 12]} />
            <meshStandardMaterial color="#64748b" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
      ))}

      {/* ========================================================================= */}
      {/* 2. MOLDURA LATERAL EN ALUMINIO CEPILLADO Y FRANJAS DE ESPEJO INFINITO LINEAL */}
      {/* ========================================================================= */}
      {showSideMirror && (
        <>
          {/* Franja luminosa lateral superior de espejo infinito */}
          <mesh position={[0, HALF_FRAME + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[FRAME_SIZE * 0.72, FRAME_DEPTH * 0.75]} />
            <meshStandardMaterial
              map={sideInfinityTexture}
              emissiveMap={sideInfinityTexture}
              emissive={rgbColor}
              emissiveIntensity={rgbIntensity * 0.9}
              roughness={0.15}
              metalness={0.8}
            />
          </mesh>

          {/* Franja luminosa lateral inferior de espejo infinito */}
          <mesh position={[0, -HALF_FRAME - 0.002, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[FRAME_SIZE * 0.72, FRAME_DEPTH * 0.75]} />
            <meshStandardMaterial
              map={sideInfinityTexture}
              emissiveMap={sideInfinityTexture}
              emissive={rgbColor}
              emissiveIntensity={rgbIntensity * 0.9}
              roughness={0.15}
              metalness={0.8}
            />
          </mesh>

          {/* Franja lateral izquierda de aluminio */}
          <mesh position={[-HALF_FRAME - 0.002, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[FRAME_DEPTH * 0.9, FRAME_SIZE * 0.72]} />
            <meshStandardMaterial
              map={sideInfinityTexture}
              emissiveMap={sideInfinityTexture}
              emissive={rgbColor}
              emissiveIntensity={rgbIntensity * 0.9}
              roughness={0.15}
              metalness={0.8}
            />
          </mesh>

          {/* Franja lateral derecha de aluminio */}
          <mesh position={[HALF_FRAME + 0.002, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[FRAME_DEPTH * 0.9, FRAME_SIZE * 0.72]} />
            <meshStandardMaterial
              map={sideInfinityTexture}
              emissiveMap={sideInfinityTexture}
              emissive={rgbColor}
              emissiveIntensity={rgbIntensity * 0.9}
              roughness={0.15}
              metalness={0.8}
            />
          </mesh>
        </>
      )}

      {/* Cilindro interior del alojamiento del ventilador (rotado correctamente en el eje Z) */}
      <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[BORE_RADIUS, BORE_RADIUS, FRAME_DEPTH - 0.02, 36, 1, true]} />
        <meshStandardMaterial color="#080b12" metalness={0.8} roughness={0.35} side={THREE.BackSide} />
      </mesh>

      {/* ========================================================================= */}
      {/* 3. ANILLO HALO PERFORADO TIPO MATRIZ DE PUNTOS (RGB BLANCO PURO) */}
      {/* ========================================================================= */}
      {/* Disco del anillo halo con matriz de puntos en la cara frontal */}
      <mesh position={[0, 0, HALF_DEPTH + 0.002]}>
        <ringGeometry args={[BORE_RADIUS * 0.76, BORE_RADIUS * 0.995, 48]} />
        <meshStandardMaterial
          map={dotMatrixHaloTexture}
          emissiveMap={dotMatrixHaloTexture}
          emissive={rgbColor}
          emissiveIntensity={rgbIntensity * 1.3}
          transparent
          alphaTest={0.02}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Disco del anillo halo con matriz de puntos en la cara trasera */}
      <mesh position={[0, 0, -HALF_DEPTH - 0.002]} rotation={[0, Math.PI, 0]}>
        <ringGeometry args={[BORE_RADIUS * 0.76, BORE_RADIUS * 0.995, 48]} />
        <meshStandardMaterial
          map={dotMatrixHaloTexture}
          emissiveMap={dotMatrixHaloTexture}
          emissive={rgbColor}
          emissiveIntensity={rgbIntensity * 1.3}
          transparent
          alphaTest={0.02}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Anillo circular interior difusor de luz */}
      <mesh position={[0, 0, HALF_DEPTH - 0.015]}>
        <torusGeometry args={[BORE_RADIUS * 0.96, 0.014, 16, 48]} />
        <meshStandardMaterial
          color={rgbColor}
          emissive={rgbColor}
          emissiveIntensity={rgbIntensity * 1.5}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0, -HALF_DEPTH + 0.015]}>
        <torusGeometry args={[BORE_RADIUS * 0.96, 0.014, 16, 48]} />
        <meshStandardMaterial
          color={rgbColor}
          emissive={rgbColor}
          emissiveIntensity={rgbIntensity * 1.5}
          toneMapped={false}
        />
      </mesh>

      {/* ========================================================================= */}
      {/* 4. NERVADURAS TRASERAS DEL ESTATOR (4 brazos radiales estilizados) */}
      {/* ========================================================================= */}
      <group position={[0, 0, -HALF_DEPTH + 0.02]}>
        {[45, 135, 225, 315].map((deg) => (
          <group key={`stator-${deg}`} rotation={[0, 0, (deg * Math.PI) / 180]}> <mesh position={[BORE_RADIUS * 0.55, 0, 0]}> <boxGeometry args={[BORE_RADIUS * 0.65, 0.025, 0.012]} /> <meshStandardMaterial color="#090d14" metalness={0.8} roughness={0.3} /> </mesh> </group> ))} </group>  {/* ========================================================================= */} {/* 5. CONJUNTO GIRATORIO: ASPAS ESMERILADAS + BUJE CENTRAL E INSIGNIA LCD */} {/* ========================================================================= */} <group ref={rotorRef} position={[0, 0, 0]}> {/* Cuerpo del buje central del rotor (rotado correctamente en el eje Z) */} <mesh castShadow rotation={[Math.PI / 2, 0, 0]}> <cylinderGeometry args={[0.20, 0.20, FRAME_DEPTH * 0.60, 36]} /> <meshStandardMaterial color="#090d16" metalness={0.92} roughness={0.15} /> </mesh>  {/* Anillo biselado pulido alrededor del buje */} <mesh position={[0, 0, HALF_DEPTH * 0.60 + 0.002]}> <ringGeometry args={[0.185, 0.205, 36]} /> <meshStandardMaterial color="#cbd5e1" metalness={0.98} roughness={0.05} /> </mesh> <mesh position={[0, 0, -HALF_DEPTH * 0.60 - 0.002]}> <ringGeometry args={[0.185, 0.205, 36]} /> <meshStandardMaterial color="#cbd5e1" metalness={0.98} roughness={0.05} /> </mesh>  {/* INSIGNIA CENTRAL LCD / INFINITA EN LA CARA FRONTAL (logotipo geométrico en blanco puro) */} <mesh position={[0, 0, HALF_DEPTH * 0.60 + 0.005]}> <circleGeometry args={[0.182, 36]} /> <meshStandardMaterial map={centerBadgeTexture} emissiveMap={centerBadgeTexture} emissive={rgbColor} emissiveIntensity={rgbIntensity * 1.4} roughness={0.1} metalness={0.2} toneMapped={false} /> </mesh>  {/* INSIGNIA CENTRAL EN LA CARA TRASERA */} <mesh position={[0, 0, -HALF_DEPTH * 0.60 - 0.005]} rotation={[0, Math.PI, 0]}> <circleGeometry args={[0.182, 36]} /> <meshStandardMaterial map={centerBadgeTexture} emissiveMap={centerBadgeTexture} emissive={rgbColor} emissiveIntensity={rgbIntensity * 1.4} roughness={0.1} metalness={0.2} toneMapped={false} /> </mesh>  {/* Anillo LED blanco interior del buje */} <mesh position={[0, 0, 0]}> <torusGeometry args={[0.205, 0.015, 16, 36]} /> <meshStandardMaterial color={rgbColor} emissive={rgbColor} emissiveIntensity={rgbIntensity * 1.8} toneMapped={false} /> </mesh>  {/* 7 aspas difusoras blancas esmeriladas tipo hoz (contenidas dentro del marco) */} {Array.from({ length: 7 }).map((_, bIdx) => { const angle = (bIdx * 2 * Math.PI) / 7; return ( <group key={`blade-${bIdx}`} rotation={[0, 0, angle]}>
              {/* Sección de aspa inclinada aerodinámicamente entre radios 0.20 y 0.49 */}
              <group position={[0.34, 0.02, 0]} rotation={[0.42, 0, 0.22]}>
                <mesh castShadow>
                  <boxGeometry args={[0.24, 0.12, 0.012]} />
                  <meshStandardMaterial
                    color={rgbColor}
                    emissive={rgbColor}
                    emissiveIntensity={rgbIntensity * 0.95}
                    transparent
                    opacity={bladeOpacity}
                    roughness={0.22}
                    metalness={0.1}
                    toneMapped={false}
                  />
                </mesh>
              </group>
            </group>
          );
        })}
      </group>
    </group>
  );
};