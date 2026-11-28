import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GPU3DProps {
  isSelected: boolean;
  viewMode: string;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}

/**
 * Modelo 3D de NVIDIA GeForce RTX 4090 Founders Edition
 * Réplica 1:1 que incluye:
 * - Perfil grueso de 3.5 slots con armazón tipo reloj de arena en titanio champán anodizado y biseles pulidos
 * - Cubierta cóncava en grafito mate con logotipo iluminado "RTX 4090"
 * - Ventiladores axiales duales de flujo pasante de 116mm con giro opuesto
 * - Logotipo lateral iluminado "GEFORCE RTX" con conector de alimentación de 16 pines 12VHPWR (PCIe 5.0)
 * - Aletas densas de disipador de aluminio y heatpipes de cobre
 * - Conector de contactos dorados PCIe 4.0/5.0 x16 de longitud completa
 * - Soporte trasero de E/S (I/O) de acero inoxidable cepillado de triple slot
 */
export const GPU3D: React.FC<GPU3DProps> = ({
  isSelected,
  viewMode,
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  const fan1Ref = useRef<THREE.Group>(null);
  const fan2Ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // 1. Textura del logotipo en la cubierta RTX 4090 ("RTX" en blanco/plata nítido + "4090" regular sobre calcomanía transparente)
  const rtxLogoTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 1024, 256);

      const text1 = 'RTX ';
      const text2 = '4090';
      ctx.font = '900 138px "Arial Black", "Helvetica Neue", "Arial", sans-serif';
      const w1 = ctx.measureText(text1).width;
      ctx.font = '400 138px "Helvetica Neue", "Arial", sans-serif';
      const w2 = ctx.measureText(text2).width;
      const totalWidth = w1 + w2;
      const startX = (canvas.width - totalWidth) / 2;

      // Dibuja "RTX " (blanco metálico nítido con corte diamante en negrita)
      ctx.shadowColor = 'rgba(255, 255, 255, 0.85)';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 138px "Arial Black", "Helvetica Neue", "Arial", sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text1, startX, 128);

      // Dibuja "4090" (gris/plata elegante de peso regular)
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '400 138px "Helvetica Neue", "Arial", sans-serif';
      ctx.fillText(text2, startX + w1, 128);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, []);

  // 3. Forma auténtica del armazón infinito tipo reloj de arena (figura en 8) de la Founders Edition
  const hourglassShape = useMemo(() => {
    const shape = new THREE.Shape();

    // PERÍMETRO EXTERIOR TIPO RELOJ DE ARENA (sentido antihorario alrededor de la cara de la tarjeta Founders Edition)
    // Esquina superior izquierda redondeada
    shape.moveTo(-1.26, 0.56);
    shape.lineTo(-0.35, 0.56);
    shape.quadraticCurveTo(-0.28, 0.56, -0.24, 0.51);
    shape.lineTo(-0.09, 0.06);
    // Puente central superior horizontal
    shape.quadraticCurveTo(-0.05, 0.025, 0.0, 0.025);
    shape.quadraticCurveTo(0.05, 0.025, 0.09, 0.06);
    // Transición diagonal hacia el borde horizontal superior derecho
    shape.lineTo(0.24, 0.51);
    shape.quadraticCurveTo(0.28, 0.56, 0.35, 0.56);
    shape.lineTo(1.26, 0.56);
    // Esquina superior derecha redondeada
    shape.quadraticCurveTo(1.38, 0.56, 1.38, 0.44);
    shape.lineTo(1.38, -0.44);
    // Esquina inferior derecha redondeada
    shape.quadraticCurveTo(1.38, -0.56, 1.26, -0.56);
    // Borde horizontal inferior derecho
    shape.lineTo(0.35, -0.56);
    shape.quadraticCurveTo(0.28, -0.56, 0.24, -0.51);
    shape.lineTo(0.09, -0.06);
    // Puente central inferior horizontal
    shape.quadraticCurveTo(0.05, -0.025, 0.0, -0.025);
    shape.quadraticCurveTo(-0.05, -0.025, -0.09, -0.06);
    // Transición diagonal hacia el borde horizontal inferior izquierdo
    shape.lineTo(-0.24, -0.51);
    shape.quadraticCurveTo(-0.28, -0.56, -0.35, -0.56);
    shape.lineTo(-1.26, -0.56);
    // Esquina inferior izquierda redondeada
    shape.quadraticCurveTo(-1.38, -0.56, -1.38, -0.44);
    shape.lineTo(-1.38, 0.44);
    // Esquina superior izquierda redondeada de vuelta al inicio
    shape.quadraticCurveTo(-1.38, 0.56, -1.26, 0.56);
    shape.closePath();

    // ABERTURA INTERIOR IZQUIERDA (sentido antihorario para el recorte extruido, ancho fino de cinta de 0.036)
    const leftHole = new THREE.Path();
    leftHole.moveTo(-1.24, 0.524);
    leftHole.quadraticCurveTo(-1.344, 0.524, -1.344, 0.42);
    leftHole.lineTo(-1.344, -0.42);
    leftHole.quadraticCurveTo(-1.344, -0.524, -1.24, -0.524);
    leftHole.lineTo(-0.37, -0.524);
    leftHole.quadraticCurveTo(-0.31, -0.524, -0.27, -0.478);
    leftHole.lineTo(-0.13, -0.05);
    leftHole.quadraticCurveTo(-0.10, 0.00, -0.13, 0.05);
    leftHole.lineTo(-0.27, 0.478);
    leftHole.quadraticCurveTo(-0.31, 0.524, -0.37, 0.524);
    leftHole.lineTo(-1.24, 0.524);

    // ABERTURA INTERIOR DERECHA (sentido antihorario para el recorte extruido)
    const rightHole = new THREE.Path();
    rightHole.moveTo(1.24, 0.524);
    rightHole.lineTo(0.37, 0.524);
    rightHole.quadraticCurveTo(0.31, 0.524, 0.27, 0.478);
    rightHole.lineTo(0.13, 0.05);
    rightHole.quadraticCurveTo(0.10, 0.00, 0.13, -0.05);
    rightHole.lineTo(0.27, -0.478);
    rightHole.quadraticCurveTo(0.31, -0.524, 0.37, -0.524);
    rightHole.lineTo(1.24, -0.524);
    rightHole.quadraticCurveTo(1.344, -0.524, 1.344, -0.42);
    rightHole.lineTo(1.344, 0.42);
    rightHole.quadraticCurveTo(1.344, 0.524, 1.24, 0.524);

    shape.holes.push(leftHole, rightHole);
    return shape;
  }, []);

  // 4. Placa hundida de la cubierta en grafito mate de la sección izquierda (coincide con el bucle izquierdo del reloj de arena)
  const leftPanelShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1.23, 0.518);
    shape.lineTo(-0.38, 0.518);
    shape.quadraticCurveTo(-0.32, 0.518, -0.28, 0.472);
    shape.lineTo(-0.14, 0.05);
    shape.quadraticCurveTo(-0.11, 0.00, -0.14, -0.05);
    shape.lineTo(-0.28, -0.472);
    shape.quadraticCurveTo(-0.32, -0.518, -0.38, -0.518);
    shape.lineTo(-1.23, -0.518);
    shape.quadraticCurveTo(-1.338, -0.518, -1.338, -0.41);
    shape.lineTo(-1.338, 0.41);
    shape.quadraticCurveTo(-1.338, 0.518, -1.23, 0.518);
    return shape;
  }, []);

  // 5. Placa hundida de la cubierta en grafito mate de la sección derecha con abertura circular para el ventilador
  const rightPanelShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(1.23, 0.518);
    shape.lineTo(0.38, 0.518);
    shape.quadraticCurveTo(0.32, 0.518, 0.28, 0.472);
    shape.lineTo(0.14, 0.05);
    shape.quadraticCurveTo(0.11, 0.00, 0.14, -0.05);
    shape.lineTo(0.28, -0.472);
    shape.quadraticCurveTo(-0.32, -0.518, -0.38, -0.518);
    shape.lineTo(1.23, -0.518);
    shape.quadraticCurveTo(1.338, -0.518, 1.338, -0.41);
    shape.lineTo(1.338, 0.41);
    shape.quadraticCurveTo(1.338, 0.518, 1.23, 0.518);

    // Abertura circular para el ventilador axial de 116mm centrado en x = 0.74
    const fanHole = new THREE.Path();
    fanHole.absarc(0.74, 0, 0.48, 0, Math.PI * 2, false);
    shape.holes.push(fanHole);

    return shape;
  }, []);

  const hourglassExtrudeSettings = useMemo(
    () => ({
      depth: 0.024,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.004,
      bevelThickness: 0.004,
    }),
    []
  );

  // Animación continua de giro opuesto de los ventiladores
  useFrame((_, delta) => {
    const spinSpeed = 16;
    if (fan1Ref.current) fan1Ref.current.rotation.z -= delta * spinSpeed;
    if (fan2Ref.current) fan2Ref.current.rotation.z += delta * spinSpeed;
  });

  const isThermal = viewMode === 'thermal';

  // Color metálico champán/titanio del armazón de la RTX 4090 FE e iluminaciones emisivas
  const frameColor = isThermal
    ? '#ef4444'
    : isSelected
    ? '#ffffff'
    : hovered
    ? '#e2e8f0'
    : '#cbd5e1'; // Plata champán premium / metal anodizado en titanio

  const shroudColor = isThermal
    ? '#dc2626'
    : isSelected
    ? '#1e293b'
    : hovered
    ? '#27272a'
    : '#0f141a'; // Negro grafito intenso en acabado mate

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
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        onPointerOut();
      }}
    >
      {/* ========================================================================= */}
      {/* 1. CUERPO PRINCIPAL DEL DISIPADOR Y CUBIERTA DE 3.5 SLOTS DE LA RTX 4090 */}
      {/* ========================================================================= */}
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[2.80, 1.12, 0.48]} />
        <meshStandardMaterial
          color={shroudColor}
          metalness={0.82}
          roughness={0.3}
          emissive={isThermal ? '#dc2626' : isSelected ? '#ffffff' : hovered ? '#94a3b8' : '#000000'}
          emissiveIntensity={isThermal ? 0.75 : isSelected ? 0.35 : hovered ? 0.15 : 0}
        />
      </mesh>

      {/* Arreglo interno de aletas de refrigeración de alta densidad (visible a través de los huecos de la cubierta) */}
      <group position={[0, 0, 0]}>
        {Array.from({ length: 42 }).map((_, i) => (
          <mesh key={`fin-${i}`} position={[-1.32 + i * 0.063, 0, 0]}>
            <boxGeometry args={[0.012, 1.04, 0.42]} />
            <meshStandardMaterial
              color={isThermal ? (i > 12 && i < 30 ? '#ef4444' : '#3b82f6') : '#334155'}
              metalness={0.92}
              roughness={0.18}
            />
          </mesh>
        ))}

        {/* 6 heatpipes de cobre niquelado atravesando el núcleo del disipador */}
        {[-0.38, -0.22, -0.07, 0.07, 0.22, 0.38].map((yOff, idx) => (
          <mesh key={`hp-${idx}`} position={[0, yOff, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.024, 0.024, 2.70, 16]} />
            <meshStandardMaterial color="#f1f5f9" metalness={0.98} roughness={0.05} />
          </mesh>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* 2. ARMAZÓN EXTERIOR ICÓNICO TIPO RELOJ DE ARENA / INFINITO ("X") CON BISELES */}
      {/* ========================================================================= */}
      <group position={[0, 0, 0]}>
        {/* Borde superior plateado del armazón exterior */}
        <mesh position={[0, 0.575, 0]} castShadow>
          <boxGeometry args={[2.84, 0.06, 0.50]} />
          <meshStandardMaterial color={frameColor} metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Detalles biselados con corte diamante superiores */}
        <mesh position={[0, 0.60, 0.25]} rotation={[Math.PI / 4, 0, 0]}>
          <boxGeometry args={[2.82, 0.02, 0.02]} />
          <meshStandardMaterial color="#ffffff" metalness={0.98} roughness={0.02} />
        </mesh>
        <mesh position={[0, 0.60, -0.25]} rotation={[Math.PI / 4, 0, 0]}>
          <boxGeometry args={[2.82, 0.02, 0.02]} />
          <meshStandardMaterial color="#ffffff" metalness={0.98} roughness={0.02} />
        </mesh>

        {/* Borde inferior plateado del armazón exterior */}
        <mesh position={[0, -0.575, 0]} castShadow>
          <boxGeometry args={[2.84, 0.06, 0.50]} />
          <meshStandardMaterial color={frameColor} metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Detalles biselados con corte diamante inferiores */}
        <mesh position={[0, -0.60, 0.25]} rotation={[Math.PI / 4, 0, 0]}>
          <boxGeometry args={[2.82, 0.02, 0.02]} />
          <meshStandardMaterial color="#ffffff" metalness={0.98} roughness={0.02} />
        </mesh>

        {/* Tapa lateral izquierda curva plateada (-X) */}
        <mesh position={[-1.415, 0, 0]} castShadow>
          <boxGeometry args={[0.06, 1.15, 0.47]} />
          <meshStandardMaterial color={frameColor} metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Tapa lateral derecha curva plateada (+X) */}
        <mesh position={[1.415, 0, 0]} castShadow>
          <boxGeometry args={[0.06, 1.20, 0.50]} />
          <meshStandardMaterial color={frameColor} metalness={0.95} roughness={0.1} />
        </mesh>

        {/* ARMAZÓN FRONTAL AUTÉNTICO INFINITO TIPO RELOJ DE ARENA FE (+Z) */}
        <mesh position={[0, 0, 0.236]} castShadow receiveShadow>
          <extrudeGeometry args={[hourglassShape, hourglassExtrudeSettings]} />
          <meshStandardMaterial color={frameColor} metalness={0.96} roughness={0.08} />
        </mesh>

        {/* ARMAZÓN TRASERO AUTÉNTICO INFINITO TIPO RELOJ DE ARENA FE (-Z) */}
        <mesh position={[0, 0, -0.236]} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
          <extrudeGeometry args={[hourglassShape, hourglassExtrudeSettings]} />
          <meshStandardMaterial color={frameColor} metalness={0.96} roughness={0.08} />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 3. DETALLES DE LA CARA FRONTAL (+Z = 0.236) */}
      {/* ========================================================================= */}
      {/* Placa de cubierta en grafito mate de la sección izquierda */}
      <mesh position={[0, 0, 0.235]} receiveShadow>
        <shapeGeometry args={[leftPanelShape]} />
        <meshStandardMaterial color={shroudColor} roughness={0.75} metalness={0.3} />
      </mesh>

      {/* Emblema metálico auténtico "RTX 4090" ("RTX" en negrita + "4090" regular) */}
      <mesh position={[-0.76, 0.0, 0.242]}>
        <planeGeometry args={[1.04, 0.26]} />
        <meshStandardMaterial
          map={rtxLogoTexture}
          emissiveMap={rtxLogoTexture}
          emissive="#ffffff"
          emissiveIntensity={isSelected ? 1.05 : hovered ? 0.95 : 0.9}
          transparent
          alphaTest={0.05}
          roughness={0.15}
          metalness={0.15}
          depthWrite={true}
        />
      </mesh>

      {/* Placa de cubierta en grafito mate de la sección derecha con abertura circular para el ventilador */}
      <mesh position={[0, 0, 0.235]} receiveShadow>
        <shapeGeometry args={[rightPanelShape]} />
        <meshStandardMaterial color={shroudColor} roughness={0.75} metalness={0.3} />
      </mesh>

      {/* Ventilador 1 de la sección derecha (ventilador axial de 116mm) centrado en x = 0.74 */}
      <group position={[0.74, 0, 0.236]}>
        {/* Cavidad circular oscura hundida del alojamiento */}
        <mesh position={[0, 0, -0.005]}>
          <circleGeometry args={[0.48, 48]} />
          <meshStandardMaterial color="#080c10" roughness={0.8} />
        </mesh>

        {/* Ventilador 1 (ventilador axial frontal derecho) */}
        <group ref={fan1Ref} position={[0, 0, 0.008]}>
          {/* Tapa central metálica de aluminio anodizado */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.015, 32]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0, 0.009]}>
            <circleGeometry args={[0.12, 32]} />
            <meshStandardMaterial color="#020617" roughness={0.4} />
          </mesh>

          {/* 7 aspas aerodinámicas curvas */}
          {Array.from({ length: 7 }).map((_, bIdx) => {
            const angle = (bIdx * 2 * Math.PI) / 7;
            return (
              <group key={`f1-b-${bIdx}`} rotation={[0, 0, angle]}>
                <mesh position={[0.26, 0, 0]} rotation={[0.40, 0, 0]} castShadow>
                  <boxGeometry args={[0.28, 0.11, 0.01]} />
                  <meshStandardMaterial color="#18202a" roughness={0.25} metalness={0.6} />
                </mesh>
              </group>
            );
          })}

          {/* Anillo estabilizador exterior en el borde de las aspas */}
          <mesh>
            <ringGeometry args={[0.45, 0.478, 48]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 4. DETALLES DE LA CARA TRASERA (-Z = -0.236) */}
      {/* ========================================================================= */}
      {/* Placa de cubierta trasera izquierda con abertura de flujo pasante para ventilador */}
      <mesh position={[0, 0, -0.235]} rotation={[0, Math.PI, 0]} receiveShadow>
        <shapeGeometry args={[rightPanelShape]} />
        <meshStandardMaterial color={shroudColor} roughness={0.75} metalness={0.3} />
      </mesh>

      {/* Placa de cubierta trasera derecha alrededor de las aletas del disipador */}
      <mesh position={[0, 0, -0.235]} rotation={[0, Math.PI, 0]} receiveShadow>
        <shapeGeometry args={[leftPanelShape]} />
        <meshStandardMaterial color={shroudColor} roughness={0.75} metalness={0.3} />
      </mesh>

      {/* Sección izquierda (alojamiento del ventilador 2 de flujo pasante) centrada en x = -0.74 */}
      <group position={[-0.74, 0, -0.236]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0, -0.005]}>
          <circleGeometry args={[0.48, 48]} />
          <meshStandardMaterial color="#080c10" roughness={0.8} />
        </mesh>

        {/* Ventilador 2 (ventilador axial trasero izquierdo de flujo inverso) */}
        <group ref={fan2Ref} position={[0, 0, 0.008]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.015, 32]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0, 0.009]}>
            <circleGeometry args={[0.12, 32]} />
            <meshStandardMaterial color="#020617" roughness={0.4} />
          </mesh>

          {/* 7 aspas aerodinámicas de curvatura opuesta */}
          {Array.from({ length: 7 }).map((_, bIdx) => {
            const angle = (bIdx * 2 * Math.PI) / 7;
            return (
              <group key={`f2-b-${bIdx}`} rotation={[0, 0, angle]}>
                <mesh position={[0.26, 0, 0]} rotation={[-0.40, 0, 0]} castShadow>
                  <boxGeometry args={[0.28, 0.11, 0.01]} />
                  <meshStandardMaterial color="#18202a" roughness={0.25} metalness={0.6} />
                </mesh>
              </group>
            );
          })}

          {/* Anillo en el borde de las aspas */}
          <mesh>
            <ringGeometry args={[0.45, 0.478, 48]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>

      {/* Arreglo de aletas del disipador de flujo pasante en la sección derecha */}
      <group position={[0.74, 0, -0.236]}>
        {Array.from({ length: 26 }).map((_, idx) => (
          <mesh key={`flow-fin-${idx}`} position={[-0.46 + idx * 0.037, 0, 0]} rotation={[0, 0, 0.48]}>
            <boxGeometry args={[0.012, 0.94, 0.025]} />
            <meshStandardMaterial color="#334155" metalness={0.92} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* 5. PUERTO DE ALIMENTACIÓN 12VHPWR Y BORDES SUPERIOR/INFERIOR DE LA CUBIERTA */}
      {/* ========================================================================= */}
      {/* Conector de alimentación en ángulo 12VHPWR (PCIe 5.0 de 16 pines) */}
      <group position={[0.15, -0.585, 0.03]}>
        {/* Carcasa del conector */}
        <mesh castShadow>
          <boxGeometry args={[0.26, 0.09, 0.14]} />
          <meshStandardMaterial color="#020617" roughness={0.5} />
        </mesh>

        {/* Conectores de 12 pines de energía + 4 pines de señal */}
        <mesh position={[0, 0.046, 0]}>
          <boxGeometry args={[0.22, 0.005, 0.11]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.98} />
        </mesh>

        {/* Pestaña de traba de seguridad */}
        <mesh position={[0, 0.03, 0.075]}>
          <boxGeometry args={[0.10, 0.04, 0.02]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 6. PESTAÑA CONECTORA DORADA PCIE 4.0/5.0 X16 (ACOPLAMIENTO A MOTHERBOARD) */}
      {/* ========================================================================= */}
      <group position={[0, 0.62, 0]}>
        {/* Borde negro del sustrato del circuito */}
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[2.10, 0.12, 0.028]} />
          <meshStandardMaterial color="#0b0f14" roughness={0.4} metalness={0.8} />
        </mesh>

        {/* Arreglo brillante de pines de contacto dorados */}
        <mesh position={[0, 0.015, 0.003]}>
          <boxGeometry args={[2.04, 0.09, 0.025]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.98} roughness={0.05} />
        </mesh>

        {/* Muesca clave de retención en la ranura PCIe */}
        <mesh position={[0.82, 0.015, 0]}>
          <boxGeometry args={[0.12, 0.125, 0.035]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 7. SOPORTE TRASERO DE E/S (I/O) DE ACERO INOXIDABLE DE TRIPLE SLOT (-X = -1.42) */}
      {/* ========================================================================= */}
      <group position={[-1.42, 0, 0]}>
        {/* Placa del soporte de acero inoxidable */}
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.02, 1.25, 0.52]} />
          <meshStandardMaterial color="#1e293b" metalness={0.96} roughness={0.08} />
        </mesh>

        {/* Pestañas superiores e inferiores de fijación con tornillos al chasis */}
        <mesh position={[0, 0.66, 0]}>
          <boxGeometry args={[0.07, 0.09, 0.22]} />
          <meshStandardMaterial color="#334155" metalness={0.96} />
        </mesh>
        <mesh position={[0, -0.66, 0]}>
          <boxGeometry args={[0.07, 0.09, 0.22]} />
          <meshStandardMaterial color="#334155" metalness={0.96} />
        </mesh>

        {/* 3 puertos de video DisplayPort 1.4a */}
        {[-0.32, -0.12, 0.08].map((yPos, idx) => (
          <group key={`dp-port-${idx}`} position={[-0.011, yPos, 0.08]}>
            <mesh>
              <boxGeometry args={[0.018, 0.09, 0.09]} />
              <meshStandardMaterial color="#020617" />
            </mesh>
            <mesh position={[-0.002, 0, 0]}>
              <boxGeometry args={[0.012, 0.06, 0.06]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.95} />
            </mesh>
          </group>
        ))}

        {/* 1 puerto de video HDMI 2.1a */}
        <group position={[-0.011, 0.28, 0.08]}>
          <mesh>
            <boxGeometry args={[0.018, 0.09, 0.12]} />
            <meshStandardMaterial color="#020617" />
          </mesh>
          <mesh position={[-0.002, 0, 0]}>
            <boxGeometry args={[0.012, 0.06, 0.08]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.95} />
          </mesh>
        </group>

        {/* Ranuras de ventilación para salida de aire */}
        {Array.from({ length: 12 }).map((_, vIdx) => (
          <mesh key={`vent-${vIdx}`} position={[-0.011, -0.52 + vIdx * 0.09, -0.14]}>
            <boxGeometry args={[0.015, 0.04, 0.18]} />
            <meshStandardMaterial color="#020617" />
          </mesh>
        ))}
      </group>
    </group>
  );
};