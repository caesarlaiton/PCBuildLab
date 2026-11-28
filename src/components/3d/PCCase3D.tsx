import React from 'react';
import { UniFan3D } from './UniFan3D';

interface PCCase3DProps {
  explodedFactor?: number;
}

/**
 * Chasis del case 3D para PC y ecosistema de 10 ventiladores
 * Réplica 1:1 del chasis panorámico de doble cámara de la foto de referencia con:
 * - 10 ventiladores ARGB estilo Lian Li Uni Fan TL / SL-Infinity con iluminación RGB en blanco puro:
 *   • 3 ventiladores superiores de extracción en el radiador AIO de 360mm
 *   • 3 ventiladores inferiores de admisión en el riel base
 *   • 3 ventiladores verticales laterales de admisión en el soporte delantero
 *   • 1 ventilador trasero de extracción en el panel I/O posterior
 * - Módulo frontal inferior en ángulo con puertos USB 3.0 dobles en naranja, USB-C, jack de audio y botón de encendido
 * - Paneles envolventes frontal y lateral de cristal templado continuo
 * - Iluminación interior limpia en blanco puro
 */
export const PCCase3D: React.FC<PCCase3DProps> = ({ explodedFactor = 0 }) => {
  // Desplazamientos de los paneles para la vista explosionada
  const sideGlassOffset = explodedFactor * 2.2;
  const frontGlassOffset = explodedFactor * 1.6;
  const topMeshOffset = explodedFactor * 1.2;

  // Dimensiones del case: doble cámara panorámico estilizado (ancho X = 2.8, alto Y = 4.6, profundidad Z = 5.1)
  const HALF_X = 1.40; // Límites en X: -1.40 a +1.40 (ancho 2.8)
  const HALF_Y = 2.30; // Límites en Y: -2.30 a +2.30 (alto 4.6)
  const HALF_Z = 2.55; // Límites en Z: -2.55 a +2.55 (profundidad 5.1)

  return (
    <group position={[0, -0.1, 0]}>
      {/* ========================================================================= */}
      {/* 1. ESTRUCTURA DE ACERO PESADO EN NEGRO MATE DE DOBLE CÁMARA */}
      {/* ========================================================================= */}
      {/* Riel superior principal del chasis */}
      <mesh castShadow receiveShadow position={[0, HALF_Y, 0]}>
        <boxGeometry args={[HALF_X * 2, 0.08, HALF_Z * 2]} />
        <meshStandardMaterial color="#090d15" metalness={0.88} roughness={0.25} />
      </mesh>

      {/* Placa base inferior del chasis */}
      <mesh castShadow receiveShadow position={[0, -HALF_Y, 0]}>
        <boxGeometry args={[HALF_X * 2, 0.08, HALF_Z * 2]} />
        <meshStandardMaterial color="#090d15" metalness={0.88} roughness={0.25} />
      </mesh>

      {/* Panel trasero sólido de acero de la cámara de cables (pared exterior derecha) */}
      <mesh castShadow receiveShadow position={[-HALF_X, 0, 0]}>
        <boxGeometry args={[0.08, HALF_Y * 2 - 0.08, HALF_Z * 2]} />
        <meshStandardMaterial color="#060910" metalness={0.85} roughness={0.3} />
      </mesh>

      {/* Placa trasera del panel I/O (diseño plano de doble cámara) */}
      <group position={[0, 0, -HALF_Z]}>
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[HALF_X * 2 - 0.08, HALF_Y * 2 - 0.08, 0.08]} />
          <meshStandardMaterial color="#090d15" metalness={0.88} roughness={0.25} />
        </mesh>
        {/* Recorte del escudo I/O trasero de la motherboard */}
        <mesh position={[-0.65, 0.90, 0.01]}>
          <boxGeometry args={[0.8, 1.8, 0.02]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Cubiertas horizontales de ranuras PCIe */}
        {[0.1, -0.1, -0.3, -0.5, -0.7, -0.9, -1.1].map((y, i) => (
          <mesh key={`pci-slot-${i}`} position={[-0.1, y, 0.05]}>
            <boxGeometry args={[1.4, 0.14, 0.02]} />
            <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.1} />
          </mesh>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* 2. BANDEJA DE MONTAJE DE LA MOTHERBOARD */}
      {/* ========================================================================= */}
      <group position={[-0.82, 0.25, -0.60]}>
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.04, 2.9, 2.8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.3} />
        </mesh>
        {/* Pasacables de goma alrededor de la motherboard */}
        <mesh position={[0.03, 0, 1.48]}>
          <boxGeometry args={[0.02, 2.8, 0.12]} />
          <meshStandardMaterial color="#020617" roughness={0.9} />
        </mesh>
        <mesh position={[0.03, 1.52, 0]}>
          <boxGeometry args={[0.02, 0.12, 2.8]} />
          <meshStandardMaterial color="#020617" roughness={0.9} />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 3. RADIADOR SUPERIOR AIO DE 360MM Y 3 X UNI FANS (RGB BLANCO PURO) */}
      {/* ========================================================================= */}
      <group position={[0, HALF_Y - 0.35 + topMeshOffset, -0.30]}>
        {/* Cuerpo del bloque de aletas del radiador de aluminio */}
        <mesh castShadow position={[0, 0.14, 0]}>
          <boxGeometry args={[1.65, 0.18, 4.0]} />
          <meshStandardMaterial color="#0d1117" metalness={0.92} roughness={0.2} />
        </mesh>
        {/* Moldura lateral decorativa en aluminio del radiador */}
        <mesh position={[0.83, 0.14, 0]}>
          <boxGeometry args={[0.02, 0.14, 3.9]} />
          <meshStandardMaterial color="#475569" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Depósito / cámara terminal del radiador (borde frontal del conjunto del radiador) */}
        <group position={[0, -0.04, 1.95]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.58, 0.20, 0.34]} />
            <meshStandardMaterial color="#090d14" metalness={0.92} roughness={0.18} />
          </mesh>
          {/* Moldura lateral en aluminio cepillado */}
          <mesh position={[0.80, 0, 0]}>
            <boxGeometry args={[0.02, 0.16, 0.32]} />
            <meshStandardMaterial color="#64748b" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* Puertos dobles hundidos para racores */}
          <mesh position={[0.10, -0.10, -0.08]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.02, 20]} />
            <meshStandardMaterial color="#020617" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0.10, -0.10, 0.08]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.02, 20]} />
            <meshStandardMaterial color="#020617" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>

        {/* 3 ventiladores de extracción encadenados Uni Fan TL / SL-INF (RGB blanco puro) */}
        <group position={[0, -0.06, 0]}>
          {[-1.20, 0, 1.20].map((zPos, idx) => (
            <UniFan3D
              key={`top-fan-${idx}`}
              position={[0, 0, zPos]}
              rotation={[Math.PI / 2, 0, 0]}
              rgbColor="#ffffff"
              rgbIntensity={1.5}
              spinSpeed={12}
            />
          ))}
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 4. ARREGLO INFERIOR DE 3 X UNI FANS DE ADMISIÓN (RGB BLANCO PURO - FLUJO HACIA ARRIBA) */}
      {/* ========================================================================= */}
      <group position={[0, -HALF_Y + 0.28, -0.30]}>
        {/* Riel de soporte inferior para montaje */}
        <mesh position={[0, -0.14, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.04, 3.9]} />
          <meshStandardMaterial color="#090d15" metalness={0.85} roughness={0.3} />
        </mesh>

        {/* 3 ventiladores de admisión encadenados Uni Fan TL / SL-INF (RGB blanco puro) */}
        {[-1.20, 0, 1.20].map((zPos, idx) => (
          <UniFan3D
            key={`bot-fan-${idx}`}
            position={[0, 0, zPos]}
            rotation={[-Math.PI / 2, 0, 0]}
            rgbColor="#ffffff"
            rgbIntensity={1.5}
            spinSpeed={12}
          />
        ))}
      </group>

      {/* ========================================================================= */}
      {/* 5. ARREGLO LATERAL VERTICAL DE 3 X UNI FANS DE ADMISIÓN (RGB BLANCO PURO) */}
      {/* ========================================================================= */}
      <group position={[-0.75, 0.15, 1.60]}>
        {/* Bandeja lateral de montaje de ventiladores con aberturas */}
        <mesh position={[-0.14, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.04, 3.8, 1.35]} />
          <meshStandardMaterial color="#090d15" metalness={0.88} roughness={0.25} />
        </mesh>

        {/* 3 ventiladores verticales de admisión encadenados Uni Fan TL / SL-INF (RGB blanco puro) */}
        {[1.20, 0, -1.20].map((yPos, idx) => (
          <UniFan3D
            key={`side-fan-${idx}`}
            position={[0, yPos, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            rgbColor="#ffffff"
            rgbIntensity={1.65}
            spinSpeed={12}
          />
        ))}
      </group>

      {/* ========================================================================= */}
      {/* 6. VENTILADOR TRASERO DE EXTRACCIÓN UNI FAN DE 120MM (RGB BLANCO PURO) */}
      {/* ========================================================================= */}
      <group position={[-0.15, 0.90, -HALF_Z + 0.16]}>
        <UniFan3D
          rotation={[0, 0, 0]}
          rgbColor="#ffffff"
          rgbIntensity={1.65}
          spinSpeed={12}
        />
      </group>

      {/* ========================================================================= */}
      {/* 7. MÓDULO FRONTAL INFERIOR EN ÁNGULO CARACTERÍSTICO (SEGÚN FOTO DE REFERENCIA) */}
      {/* ========================================================================= */}
      <group position={[0.42, -HALF_Y - 0.08, HALF_Z - 0.22]} rotation={[0.22, 0, 0]}>
        {/* Carcasa en ángulo de aluminio cepillado del módulo I/O */}
        <mesh castShadow>
          <boxGeometry args={[1.35, 0.24, 0.42]} />
          <meshStandardMaterial color="#1e293b" metalness={0.92} roughness={0.18} />
        </mesh>

        {/* Botón de encendido (izquierda) */}
        <mesh position={[-0.45, 0.04, 0.215]}>
          <boxGeometry args={[0.10, 0.08, 0.02]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.98} roughness={0.05} />
        </mesh>

        {/* Puertos dobles USB 3.0 Tipo A en naranja (coinciden con los puertos naranjas de la imagen) */}
        {[-0.22, -0.02].map((xPos, idx) => (
          <group key={`front-usb-${idx}`} position={[xPos, 0.04, 0.215]}>
            <mesh>
              <boxGeometry args={[0.11, 0.06, 0.02]} />
              <meshStandardMaterial color="#020617" />
            </mesh>
            {/* Lengüeta interior característica en naranja */}
            <mesh position={[0, 0.005, 0.005]}>
              <boxGeometry args={[0.09, 0.02, 0.015]} />
              <meshStandardMaterial color="#ea580c" metalness={0.8} />
            </mesh>
          </group>
        ))}

        {/* Conector combinado de 3.5mm para audífonos / micrófono */}
        <mesh position={[0.18, 0.04, 0.215]}>
          <cylinderGeometry args={[0.032, 0.032, 0.02, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} />
        </mesh>

        {/* Puerto USB 3.2 Gen 2x2 Tipo C */}
        <mesh position={[0.38, 0.04, 0.215]}>
          <boxGeometry args={[0.10, 0.04, 0.02]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 8. PANELES FRONTAL Y LATERAL PANORÁMICOS DE CRISTAL TEMPLADO */}
      {/* ========================================================================= */}
      {/* Panel frontal continuo de cristal */}
      <group position={[0, 0, HALF_Z + frontGlassOffset]}>
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[HALF_X * 2 - 0.08, HALF_Y * 2 - 0.08, 0.05]} />
          <meshStandardMaterial
            color="#e2e8f0"
            transparent
            opacity={0.16}
            depthWrite={false}
            metalness={0.95}
            roughness={0.01}
            envMapIntensity={2.8}
          />
        </mesh>
        {/* Tornillos de sujeción de acero inoxidable */}
        {[
          [HALF_X - 0.15, HALF_Y - 0.20, 0.03],
          [-HALF_X + 0.15, HALF_Y - 0.20, 0.03],
          [HALF_X - 0.15, -HALF_Y + 0.20, 0.03],
          [-HALF_X + 0.15, -HALF_Y + 0.20, 0.03],
        ].map((pos, i) => (
          <mesh key={`f-screw-${i}`} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.98} roughness={0.05} />
          </mesh>
        ))}
      </group>

      {/* Panel lateral izquierdo panorámico de cristal */}
      <group position={[HALF_X + sideGlassOffset, 0, 0]}>
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.05, HALF_Y * 2 - 0.08, HALF_Z * 2 - 0.08]} />
          <meshStandardMaterial
            color="#e2e8f0"
            transparent
            opacity={0.16}
            depthWrite={false}
            metalness={0.95}
            roughness={0.01}
            envMapIntensity={2.8}
          />
        </mesh>
        {/* Franja perimetral oscurecida ahumada */}
        <mesh position={[0.01, HALF_Y - 0.10, 0]}>
          <boxGeometry args={[0.052, 0.16, HALF_Z * 2 - 0.08]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
        <mesh position={[0.01, -HALF_Y + 0.10, 0]}>
          <boxGeometry args={[0.052, 0.16, HALF_Z * 2 - 0.08]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
        <mesh position={[0.01, 0, HALF_Z - 0.10]}>
          <boxGeometry args={[0.052, HALF_Y * 2 - 0.08, 0.16]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
        <mesh position={[0.01, 0, -HALF_Z + 0.10]}>
          <boxGeometry args={[0.052, HALF_Y * 2 - 0.08, 0.16]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
        {/* Tornillos moleteados manuales de acero inoxidable */}
        {[
          [0.03, HALF_Y - 0.20, HALF_Z - 0.25],
          [0.03, HALF_Y - 0.20, -HALF_Z + 0.25],
          [0.03, -HALF_Y + 0.20, HALF_Z - 0.25],
          [0.03, -HALF_Y + 0.20, -HALF_Z + 0.25],
        ].map((pos, i) => (
          <mesh key={`s-screw-${i}`} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.98} roughness={0.05} />
          </mesh>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* 9. PATAS RESISTENTES DEL CASE E ILUMINACIÓN AMBIENTAL EN BLANCO PURO */}
      {/* ========================================================================= */}
      {[
        [-HALF_X + 0.2, -HALF_Y - 0.10, -HALF_Z + 0.35],
        [HALF_X - 0.2, -HALF_Y - 0.10, -HALF_Z + 0.35],
        [-HALF_X + 0.2, -HALF_Y - 0.10, HALF_Z - 0.35],
        [HALF_X - 0.2, -HALF_Y - 0.10, HALF_Z - 0.35],
      ].map((pos, idx) => (
        <group key={`case-foot-${idx}`} position={pos as [number, number, number]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.22, 0.28, 0.14, 16]} />
            <meshStandardMaterial color="#090d15" metalness={0.88} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.08, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.02, 16]} />
            <meshStandardMaterial color="#020617" roughness={0.95} />
          </mesh>
        </group>
      ))}

      {/* ILUMINACIÓN INTERIOR ARGB AMBIENTAL EN BLANCO PURO */}
      <pointLight position={[0, 1.4, 0]} intensity={2.8} color="#ffffff" distance={5} />
      <pointLight position={[0.3, -1.0, 0.8]} intensity={2.4} color="#ffffff" distance={4} />
      <pointLight position={[-0.4, 0.8, -1.2]} intensity={2.0} color="#f8fafc" distance={4} />
    </group>
  );
};