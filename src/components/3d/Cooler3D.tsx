import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Cooler3DProps {
  isSelected: boolean;
  viewMode: string;
  showTubes?: boolean;
  showCase?: boolean;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}

/**
 * Bloque de bomba y tubos trenzados de refrigeración líquida AIO de 360mm
 * Incluye:
 * - Pantalla LCD circular de telemetría de alto contraste de 3.5" ("32° CPU")
 * - Tubos de refrigeración de baja permeabilidad con malla trenzada negra profunda
 * - Los tubos se curvan suavemente y se extienden por completo hacia el radiador superior debajo de los ventiladores superiores
 * - Doble collarín de compresión cromado pulido en el radiador superior y en el bloque de bomba
 * - Peines organizadores de tubos en negro mate
 * - Base fría de cobre puro micro-ranurado con soporte de retención de acero inoxidable
 */
export const Cooler3D: React.FC<Cooler3DProps> = ({
  isSelected,
  viewMode,
  showTubes = true,
  showCase = false,
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef<THREE.Mesh>(null);

  // Genera una textura nítida en canvas para la pantalla LCD circular de la bomba ("32° CPU")
  const lcdScreenTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, 512, 512);

      // Fondo negro profundo de la pantalla circular
      ctx.fillStyle = '#05070c';
      ctx.beginPath();
      ctx.arc(256, 256, 250, 0, Math.PI * 2);
      ctx.fill();

      // Anillo de acento exterior (borde blanco nítido)
      ctx.lineWidth = 18;
      ctx.strokeStyle = '#ffffff';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(256, 256, 225, 0, Math.PI * 2);
      ctx.stroke();

      // Pista interior del arco medidor
      ctx.lineWidth = 6;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.beginPath();
      ctx.arc(256, 256, 195, 0, Math.PI * 2);
      ctx.stroke();

      // Relleno activo del arco medidor
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(256, 256, 195, -Math.PI / 2, Math.PI * 0.45);
      ctx.stroke();

      // Indicador central grande y en negrita de temperatura "32°"
      ctx.shadowColor = 'rgba(255, 255, 255, 0.95)';
      ctx.shadowBlur = 20;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 128px "Helvetica Neue", "Arial Black", sans-serif';
      ctx.fillText('32°', 256, 220);

      // Subtítulo "CPU" / texto de estado debajo de la temperatura
      ctx.font = '800 42px "Helvetica Neue", "Arial", sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('CPU', 256, 320);

      // Degradado sutil de brillo en el cristal
      ctx.shadowBlur = 0;
      const sheenGrad = ctx.createLinearGradient(0, 0, 512, 512);
      sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
      sheenGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
      sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
      ctx.fillStyle = sheenGrad;
      ctx.beginPath();
      ctx.arc(256, 256, 245, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    return tex;
  }, []);

  // Mapa difuso fotorrealista de malla de nylon trenzada (tejido entrelazado en negro intenso / carbón oscuro)
  const braidedDiffuseTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Capa base de sombra en negro intenso para las hendiduras
      ctx.fillStyle = '#020204';
      ctx.fillRect(0, 0, 512, 512);

      const step = 32; // Dimensión de celda del tejido
      const halfStep = step / 2;

      // Dibuja haces de hebras entrelazadas con gradientes de iluminación cilíndrica 3D en negro azabache y carbón oscuro
      for (let y = -step; y < 512 + step; y += step) {
        for (let x = -step; x < 512 + step; x += step) {
          const isOver = ((x / step + y / step) % 2 + 2) % 2 === 0;

          // Hebra 1: Diagonal \ (arriba a la izquierda hacia abajo a la derecha)
          const drawDiagonal1 = (elevated: boolean) => {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, y + halfStep);
            ctx.lineTo(x + halfStep, y);
            ctx.lineTo(x + step + halfStep, y + step);
            ctx.lineTo(x + step, y + step + halfStep);
            ctx.closePath();

            // Gradiente a lo ancho de la hebra para dar volumen a la fibra trenzada de nylon oscuro
            const grad = ctx.createLinearGradient(x, y, x + step, y + step);
            if (elevated) {
              // Pasando por encima: brillo sutil de fibra de nylon carbón oscuro
              grad.addColorStop(0.0, '#040507');
              grad.addColorStop(0.2, '#0d0f14');
              grad.addColorStop(0.5, '#1e2129');
              grad.addColorStop(0.55, '#282c37'); // Pico sutil de brillo del nylon
              grad.addColorStop(0.8, '#0d0f14');
              grad.addColorStop(1.0, '#040507');
            } else {
              // Pasando por debajo: sombra en los bordes
              grad.addColorStop(0.0, '#010102');
              grad.addColorStop(0.3, '#06070a');
              grad.addColorStop(0.5, '#0e1015');
              grad.addColorStop(0.7, '#06070a');
              grad.addColorStop(1.0, '#010102');
            }
            ctx.fillStyle = grad;
            ctx.fill();

            // Líneas de microfilamentos dentro del haz (3 microfibras)
            ctx.lineWidth = 1.0;
            for (let f = -4; f <= 4; f += 4) {
              ctx.strokeStyle = elevated ? 'rgba(80, 90, 110, 0.25)' : 'rgba(30, 35, 45, 0.2)';
              ctx.beginPath();
              ctx.moveTo(x + f, y + halfStep + f);
              ctx.lineTo(x + step + f, y + step + halfStep + f);
              ctx.stroke();
            }
            ctx.restore();
          };

          // Hebra 2: Diagonal / (abajo a la izquierda hacia arriba a la derecha)
          const drawDiagonal2 = (elevated: boolean) => {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x + halfStep, y + step);
            ctx.lineTo(x + step, y + halfStep);
            ctx.lineTo(x, y - halfStep);
            ctx.lineTo(x - halfStep, y);
            ctx.closePath();

            const grad = ctx.createLinearGradient(x - halfStep, y + halfStep, x + step, y - halfStep);
            if (elevated) {
              grad.addColorStop(0.0, '#040507');
              grad.addColorStop(0.2, '#0d0f14');
              grad.addColorStop(0.5, '#1e2129');
              grad.addColorStop(0.55, '#282c37');
              grad.addColorStop(0.8, '#0d0f14');
              grad.addColorStop(1.0, '#040507');
            } else {
              grad.addColorStop(0.0, '#010102');
              grad.addColorStop(0.3, '#06070a');
              grad.addColorStop(0.5, '#0e1015');
              grad.addColorStop(0.7, '#06070a');
              grad.addColorStop(1.0, '#010102');
            }
            ctx.fillStyle = grad;
            ctx.fill();

            // Microfilamentos
            ctx.lineWidth = 1.0;
            for (let f = -4; f <= 4; f += 4) {
              ctx.strokeStyle = elevated ? 'rgba(80, 90, 110, 0.25)' : 'rgba(30, 35, 45, 0.2)';
              ctx.beginPath();
              ctx.moveTo(x + halfStep + f, y + step - f);
              ctx.lineTo(x - halfStep + f, y - f);
              ctx.stroke();
            }
            ctx.restore();
          };

          if (isOver) {
            drawDiagonal2(false);
            drawDiagonal1(true);
          } else {
            drawDiagonal1(false);
            drawDiagonal2(true);
          }
        }
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 42);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    return tex;
  }, []);

  // Mapa de relieve/altura (bump map) de la malla trenzada para dar relieve físico 3D
  const braidedBumpTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Las hendiduras hundidas son negro puro (altura 0)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 512, 512);

      const step = 32;
      const halfStep = step / 2;

      for (let y = -step; y < 512 + step; y += step) {
        for (let x = -step; x < 512 + step; x += step) {
          const isOver = ((x / step + y / step) % 2 + 2) % 2 === 0;

          // Dibuja relieve para la diagonal 1
          const drawBump1 = (elevated: boolean) => {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, y + halfStep);
            ctx.lineTo(x + halfStep, y);
            ctx.lineTo(x + step + halfStep, y + step);
            ctx.lineTo(x + step, y + step + halfStep);
            ctx.closePath();

            const grad = ctx.createLinearGradient(x, y, x + step, y + step);
            const peak = elevated ? 'rgb(255, 255, 255)' : 'rgb(140, 140, 140)';
            const mid = elevated ? 'rgb(180, 180, 180)' : 'rgb(80, 80, 80)';
            const edge = 'rgb(10, 10, 10)';
            grad.addColorStop(0.0, edge);
            grad.addColorStop(0.25, mid);
            grad.addColorStop(0.5, peak);
            grad.addColorStop(0.75, mid);
            grad.addColorStop(1.0, edge);

            ctx.fillStyle = grad;
            ctx.fill();
            ctx.restore();
          };

          // Dibuja relieve para la diagonal 2
          const drawBump2 = (elevated: boolean) => {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x + halfStep, y + step);
            ctx.lineTo(x + step, y + halfStep);
            ctx.lineTo(x, y - halfStep);
            ctx.lineTo(x - halfStep, y);
            ctx.closePath();

            const grad = ctx.createLinearGradient(x - halfStep, y + halfStep, x + step, y - halfStep);
            const peak = elevated ? 'rgb(255, 255, 255)' : 'rgb(140, 140, 140)';
            const mid = elevated ? 'rgb(180, 180, 180)' : 'rgb(80, 80, 80)';
            const edge = 'rgb(10, 10, 10)';
            grad.addColorStop(0.0, edge);
            grad.addColorStop(0.25, mid);
            grad.addColorStop(0.5, peak);
            grad.addColorStop(0.75, mid);
            grad.addColorStop(1.0, edge);

            ctx.fillStyle = grad;
            ctx.fill();
            ctx.restore();
          };

          if (isOver) {
            drawBump2(false);
            drawBump1(true);
          } else {
            drawBump1(false);
            drawBump2(true);
          }
        }
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 42);
    tex.anisotropy = 16;
    return tex;
  }, []);

  // Tubo 1 de refrigeración líquida trenzado (tubo interior: curvatura suave hasta el depósito del radiador en el borde del módulo de ventiladores)
  const tube1Geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.04, 0.20, 0.22),   // Salida del codo giratorio 1 de la bomba
      new THREE.Vector3(0.06, 0.36, 0.48),   // Arco suave hacia adelante dentro de la cámara principal
      new THREE.Vector3(0.02, 0.54, 0.85),   // Curva amplia en el espacio libre del case
      new THREE.Vector3(-0.25, 0.68, 1.26),  // Ascenso gradual hacia la parte superior frontal
      new THREE.Vector3(-0.70, 0.74, 1.62),  // Subida vertical en la esquina frontal
      new THREE.Vector3(-1.14, 0.76, 1.77),  // Entrada al collarín cromado 1 en el depósito del radiador (borde del módulo de ventiladores)
    ]);
    return new THREE.TubeGeometry(curve, 96, 0.048, 24, false);
  }, []);

  // Tubo 2 de refrigeración líquida trenzado (tubo exterior: recorrido paralelo hasta el depósito del radiador en el borde del módulo de ventiladores)
  const tube2Geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.06, 0.20, 0.22),  // Salida del codo giratorio 2 de la bomba
      new THREE.Vector3(-0.04, 0.36, 0.48),  // Arco paralelo
      new THREE.Vector3(-0.10, 0.54, 0.85),  // Curva amplia paralela
      new THREE.Vector3(-0.35, 0.68, 1.34),  // Ascenso paralelo
      new THREE.Vector3(-0.76, 0.74, 1.76),  // Subida vertical en la esquina frontal
      new THREE.Vector3(-1.14, 0.76, 1.93),  // Entrada al collarín cromado 2 en el depósito del radiador (borde del módulo de ventiladores)
    ]);
    return new THREE.TubeGeometry(curve, 96, 0.048, 24, false);
  }, []);

  useFrame((state) => {
    if (ringRef.current) {
      const t = state.clock.getElapsedTime();
      const pulse = 0.9 + Math.sin(t * 3.0) * 0.1;
      (ringRef.current.material as THREE.MeshBasicMaterial).color.setRGB(pulse, pulse, pulse);
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
      {/* 1. BLOQUE DE BOMBA LÍQUIDA AIO (montado directamente sobre el socket de la CPU) */}
      <group position={[0, 0, 0]}>
        {/* Base fría de cobre puro con microaletas */}
        <mesh position={[0, -0.04, 0]}>
          <boxGeometry args={[0.68, 0.03, 0.68]} />
          <meshStandardMaterial color="#b45309" metalness={0.92} roughness={0.15} />
        </mesh>

        {/* Soporte exterior de montaje / anillo de retención con 4 tornillos de resorte de acero inoxidable */}
        <mesh position={[0, -0.015, 0]}>
          <boxGeometry args={[0.80, 0.02, 0.80]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
        </mesh>
        {[
          [-0.35, -0.35],
          [0.35, -0.35],
          [-0.35, 0.35],
          [0.35, 0.35],
        ].map(([x, z], idx) => (
          <mesh key={`screw-${idx}`} position={[x, 0.01, z]}>
            <cylinderGeometry args={[0.035, 0.035, 0.06, 12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
          </mesh>
        ))}

        {/* Cuerpo cilíndrico de la bomba en aluminio anodizado */}
        <mesh castShadow position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.32, 0.35, 0.28, 36]} />
          <meshStandardMaterial
            color={isThermal ? '#06b6d4' : isSelected ? '#18181b' : hovered ? '#27272a' : '#0a0d14'}
            metalness={0.92}
            roughness={0.08}
            emissive={isThermal ? '#0891b2' : isSelected ? '#ffffff' : hovered ? '#cbd5e1' : '#000000'}
            emissiveIntensity={isThermal ? 0.7 : isSelected ? 0.4 : hovered ? 0.2 : 0}
          />
        </mesh>

        {/* Anillo de bisel espejo pulido alrededor de la pantalla */}
        <mesh position={[0, 0.285, 0]}>
          <cylinderGeometry args={[0.31, 0.31, 0.015, 36]} />
          <meshStandardMaterial color="#020617" roughness={0.05} metalness={0.98} />
        </mesh>

        {/* Anillo cromado exterior biselado */}
        <mesh position={[0, 0.292, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.27, 0.305, 36]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.98} roughness={0.05} />
        </mesh>

        {/* PANTALLA LCD CENTRAL DE TELEMETRÍA ("32° CPU") */}
        <mesh position={[0, 0.296, 0]} rotation={showCase ? [-Math.PI / 2, 0, Math.PI / 2] : [-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.268, 36]} />
          <meshStandardMaterial
            map={lcdScreenTexture}
            emissiveMap={lcdScreenTexture}
            emissive="#ffffff"
            emissiveIntensity={1.3}
            roughness={0.05}
            metalness={0.2}
            toneMapped={false}
          />
        </mesh>

        {/* Racores de compresión giratorios dobles de 90 grados en la parte superior lateral de la bomba */}
        {[
          { x: 0.04, y: 0.20, z: 0.22 },
          { x: -0.06, y: 0.20, z: 0.22 },
        ].map((pos, i) => (
          <group key={`pump-fitting-${i}`} position={[pos.x, pos.y, pos.z]}>
            {/* Collarín giratorio cromado del racor */}
            <mesh rotation={[0, 0, 0]}>
              <cylinderGeometry args={[0.054, 0.054, 0.08, 20]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.98} roughness={0.05} />
            </mesh>
            {/* Anillo de bloqueo moleteado */}
            <mesh position={[0, 0.04, 0]}>
              <cylinderGeometry args={[0.058, 0.058, 0.025, 20]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))}

        {/* 2. TUBOS DOBLES DE REFRIGERACIÓN LÍQUIDA DE NYLON TRENZADO NEGRO AZABACHE (se muestran solo cuando el case está visible) */}
        {showTubes && (
          <>
            <mesh geometry={tube1Geo} castShadow receiveShadow>
              <meshStandardMaterial
                color="#0b0c10"
                map={braidedDiffuseTexture}
                bumpMap={braidedBumpTexture}
                bumpScale={0.024}
                roughness={0.82}
                metalness={0.08}
                envMapIntensity={0.2}
              />
            </mesh>
            <mesh geometry={tube2Geo} castShadow receiveShadow>
              <meshStandardMaterial
                color="#0b0c10"
                map={braidedDiffuseTexture}
                bumpMap={braidedBumpTexture}
                bumpScale={0.024}
                roughness={0.82}
                metalness={0.08}
                envMapIntensity={0.2}
              />
            </mesh>

            {/* 3. SUJETADORES / PEINES ORGANIZADORES DE TUBOS (según la imagen de referencia) */}
            {/* Peine inferior del arco */}
            <group position={[-0.04, 0.54, 0.85]} rotation={[0.35, 0.12, -0.2]}>
              <mesh castShadow>
                <boxGeometry args={[0.04, 0.05, 0.22]} />
                <meshStandardMaterial color="#050508" roughness={0.88} metalness={0.05} />
              </mesh>
            </group>
            {/* Peine intermedio del ascenso */}
            <group position={[-0.52, 0.71, 1.50]} rotation={[0.22, 0.08, -0.1]}>
              <mesh castShadow>
                <boxGeometry args={[0.04, 0.05, 0.24]} />
                <meshStandardMaterial color="#050508" roughness={0.88} metalness={0.05} />
              </mesh>
            </group>
            {/* Peine superior cerca de los collarines del radiador */}
            <group position={[-0.92, 0.75, 1.74]} rotation={[0.08, 0.04, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.04, 0.05, 0.26]} />
                <meshStandardMaterial color="#050508" roughness={0.88} metalness={0.05} />
              </mesh>
            </group>

            {/* 4. COLLARINES DOBLES CROMADOS PULIDOS DE ENTRADA/SALIDA DEL RADIADOR (en el depósito del radiador / borde del módulo de ventiladores) */}
            {[
              { x: -1.14, y: 0.76, z: 1.77 },
              { x: -1.14, y: 0.76, z: 1.93 },
            ].map((pos, idx) => (
              <group key={`rad-collar-${idx}`} position={[pos.x, pos.y, pos.z]}>
                {/* Placa base superior de conexión del radiador */}
                <mesh position={[-0.03, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <boxGeometry args={[0.03, 0.14, 0.14]} />
                  <meshStandardMaterial color="#090d15" metalness={0.92} roughness={0.18} />
                </mesh>
                {/* Collarín de compresión cromado pulido (según la foto de referencia) */}
                <mesh position={[0.03, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.058, 0.058, 0.10, 24]} />
                  <meshStandardMaterial
                    color="#ffffff"
                    metalness={0.98}
                    roughness={0.03}
                    envMapIntensity={2.5}
                  />
                </mesh>
                {/* Anillo de bloqueo moleteado */}
                <mesh position={[0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.054, 0.054, 0.025, 24]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.88} roughness={0.25} />
                </mesh>
              </group>
            ))}
          </>
        )}
      </group>
    </group>
  );
};