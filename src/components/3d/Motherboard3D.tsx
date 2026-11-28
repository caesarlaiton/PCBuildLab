import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Motherboard3DProps {
  isSelected: boolean;
  viewMode: string;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}

export const Motherboard3D: React.FC<Motherboard3DProps> = ({
  isSelected,
  viewMode,
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current && isSelected) {
      const t = state.clock.getElapsedTime();
      const scalePulse = 1 + Math.sin(t * 3) * 0.006;
      groupRef.current.scale.set(scalePulse, scalePulse, scalePulse);
    } else if (groupRef.current) {
      groupRef.current.scale.set(1, 1, 1);
    }
  });

  const isThermal = viewMode === 'thermal';

  // Arreglos auxiliares para bancos realistas de componentes
  const vrmCapacitors = [
    [-0.75, -0.75], [-0.63, -0.75], [-0.51, -0.75], [-0.39, -0.75], [-0.27, -0.75],
    [-0.95, -0.55], [-0.95, -0.43], [-0.95, -0.31], [-0.95, -0.19],
  ];

  const audioCapacitors = [
    [-1.15, 0.45], [-1.15, 0.58], [-1.15, 0.71], [-1.15, 0.84], [-1.15, 0.97]
  ];

  const pciCapacitors = [
    [-0.70, 0.05], [-0.45, 0.05], [-0.20, 0.05],
    [-0.70, 0.35], [-0.45, 0.35],
    [-0.85, 0.65], [-0.60, 0.65], [-0.35, 0.65]
  ];

  const ramCapacitors = [
    [0.18, 0.22], [0.30, 0.22], [0.42, 0.22], [0.54, 0.22],
    [0.18, -0.98], [0.30, -0.98], [0.42, -0.98]
  ];

  const vrmInductors = [
    [-0.75, -0.88], [-0.63, -0.88], [-0.51, -0.88], [-0.39, -0.88],
    [-1.08, -0.55], [-1.08, -0.43], [-1.08, -0.31]
  ];

  return (
    <group
      ref={groupRef}
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
      <group rotation={[0, Math.PI / 2, 0]}>
        {/* 1. PCB PRINCIPAL ATX (placa estilizada en negro mate / azul marino oscuro de 2.7 x 2.7) */}
      <mesh position={[0, -0.05, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.7, 0.1, 2.7]} />
        <meshStandardMaterial
          color={isThermal ? '#ef4444' : isSelected ? '#18181b' : hovered ? '#27272a' : '#080c14'}
          roughness={0.22}
          metalness={0.88}
          emissive={isSelected ? '#ffffff' : hovered ? '#94a3b8' : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : hovered ? 0.15 : 0}
        />
      </mesh>

      {/* Pistas del circuito del PCB y líneas de serigrafía doradas/plateadas */}
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.65, 2.65]} />
        <meshBasicMaterial
          color="#94a3b8"
          wireframe
          transparent
          opacity={isSelected ? 0.38 : 0.15}
        />
      </mesh>

      {/* Orificios de montaje del PCB con anillos separadores de latón (9 orificios ATX) */}
      {[
        [-1.2, -1.2], [0, -1.2], [1.2, -1.2],
        [-1.2, 0], [0, 0], [1.2, 0],
        [-1.2, 1.2], [0, 1.2], [1.2, 1.2],
      ].map(([x, z], idx) => (
        <group key={`standoff-${idx}`} position={[x, 0.001, z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.04, 0.08, 16]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0, -0.01, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.04, 12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* 2. SOCKET DE CPU LGA 1700 / AM5 Y MARCO METÁLICO DE RETENCIÓN */}
      <group position={[-0.45, 0.05, -0.40]}>
        {/* Base plástica del socket */}
        <mesh castShadow position={[0, 0.005, 0]}>
          <boxGeometry args={[0.78, 0.02, 0.78]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>

        {/* Marco exterior de retención de acero inoxidable */}
        <mesh castShadow position={[0, 0.02, 0]}>
          <boxGeometry args={[0.76, 0.025, 0.76]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.98} roughness={0.05} />
        </mesh>

        {/* Ventana interior recortada del socket */}
        <mesh position={[0, 0.028, 0]}>
          <boxGeometry args={[0.52, 0.01, 0.52]} />
          <meshStandardMaterial color="#020617" roughness={0.9} />
        </mesh>

        {/* Matriz dorada de pines LGA */}
        <mesh position={[0, 0.025, 0]}>
          <boxGeometry args={[0.50, 0.01, 0.50]} />
          <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Palanca metálica tensora y pestaña */}
        <mesh position={[0.39, 0.038, 0]} rotation={[0, 0, Math.PI / 16]}>
          <cylinderGeometry args={[0.015, 0.015, 0.76, 12]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.98} roughness={0.05} />
        </mesh>
        <mesh position={[0.42, 0.04, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.08, 12]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.95} />
        </mesh>
      </group>



      {/* 4. TORRES DISIPADORAS DOBLES DEL VRM Y HEATPIPE */}
      {/* Disipador superior en torre del VRM */}
      <group position={[-0.45, 0.09, -0.88]}>
        <mesh castShadow>
          <boxGeometry args={[0.65, 0.12, 0.14]} />
          <meshStandardMaterial
            color={isThermal ? '#f97316' : '#1e293b'}
            metalness={0.92}
            roughness={0.15}
            emissive={isThermal ? '#ea580c' : '#000000'}
            emissiveIntensity={isThermal ? 0.6 : 0}
          />
        </mesh>
        {/* Ranuras de refrigeración */}
        {[-0.24, -0.12, 0, 0.12, 0.24].map((x, idx) => (
          <mesh key={`vrm1-slit-${idx}`} position={[x, 0.05, 0]}>
            <boxGeometry args={[0.025, 0.03, 0.15]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
          </mesh>
        ))}
      </group>

      {/* Disipador izquierdo en torre del VRM */}
      <group position={[-0.92, 0.09, -0.40]}>
        <mesh castShadow>
          <boxGeometry args={[0.14, 0.12, 0.65]} />
          <meshStandardMaterial
            color={isThermal ? '#ef4444' : '#1e293b'}
            metalness={0.92}
            roughness={0.15}
            emissive={isThermal ? '#dc2626' : '#000000'}
            emissiveIntensity={isThermal ? 0.6 : 0}
          />
        </mesh>
        {/* Ranuras de refrigeración */}
        {[-0.24, -0.12, 0, 0.12, 0.24].map((z, idx) => (
          <mesh key={`vrm2-slit-${idx}`} position={[0, 0.05, z]}>
            <boxGeometry args={[0.15, 0.03, 0.025]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
          </mesh>
        ))}
      </group>

      {/* Heatpipe de cobre */}
      <mesh position={[-0.86, 0.12, -0.82]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.18, 16]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.98} roughness={0.05} />
      </mesh>



      {/* 6. BANCOS REALISTAS DE CAPACITORES (capacitores metálicos cilíndricos) */}
      {/* Capacitores de alimentación del VRM */}
      {vrmCapacitors.map(([x, z], i) => (
        <group key={`vrm-cap-${i}`} position={[x, 0.08, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.038, 0.038, 0.12, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.061, 0]}>
            <cylinderGeometry args={[0.036, 0.036, 0.005, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Capacitores del circuito de audio */}
      {audioCapacitors.map(([x, z], i) => (
        <group key={`audio-cap-${i}`} position={[x, 0.08, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.12, 16]} />
            <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.061, 0]}>
            <cylinderGeometry args={[0.033, 0.033, 0.005, 16]} />
            <meshStandardMaterial color="#fef08a" metalness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Capacitores de PCI y chipset */}
      {pciCapacitors.map(([x, z], i) => (
        <group key={`pci-cap-${i}`} position={[x, 0.08, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.12, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.061, 0]}>
            <cylinderGeometry args={[0.033, 0.033, 0.005, 16]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Capacitores de la sección de RAM */}
      {ramCapacitors.map(([x, z], i) => (
        <group key={`ram-cap-${i}`} position={[x, 0.08, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.032, 0.032, 0.10, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.85} />
          </mesh>
          <mesh position={[0, 0.051, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.005, 16]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} />
          </mesh>
        </group>
      ))}

      {/* 7. INDUCTORES CUADRADOS DE POTENCIA / CHOKES DE FERRITA */}
      {vrmInductors.map(([x, z], i) => (
        <group key={`inductor-${i}`} position={[x, 0.08, z]}>
          <mesh castShadow>
            <boxGeometry args={[0.09, 0.10, 0.09]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.051, 0]}>
            <boxGeometry args={[0.08, 0.005, 0.08]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.95} />
          </mesh>
        </group>
      ))}

      {/* 8. RANURAS DIMM DE MEMORIA RAM DDR5 EN DOBLE CANAL (4 ranuras con pestañas de sujeción) */}
      {[0.30, 0.42, 0.54, 0.66].map((x, idx) => (
        <group key={`dimm-${idx}`} position={[x, 0.05, -0.40]}>
          {/* Canal principal de la ranura */}
          <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[0.05, 0.08, 1.18]} />
            <meshStandardMaterial color={idx % 2 === 1 ? '#020617' : '#0f172a'} metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Placas laterales de refuerzo metálico */}
          <mesh position={[-0.026, 0, 0]}>
            <boxGeometry args={[0.003, 0.075, 1.15]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0.026, 0, 0]}>
            <boxGeometry args={[0.003, 0.075, 1.15]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* Canal guía interior de contactos */}
          <mesh position={[0, 0.041, 0]}>
            <boxGeometry args={[0.02, 0.004, 1.12]} />
            <meshStandardMaterial color="#020617" />
          </mesh>
          {/* Muesca clave central */}
          <mesh position={[0, 0.042, 0.08]}>
            <boxGeometry args={[0.048, 0.01, 0.04]} />
            <meshStandardMaterial color="#020617" />
          </mesh>
          {/* Pestañas de bloqueo en ambos extremos */}
          <mesh position={[0, 0.045, 0.59]}>
            <boxGeometry args={[0.052, 0.045, 0.04]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.3} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.045, -0.59]}>
            <boxGeometry args={[0.052, 0.045, 0.04]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.3} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* 9. RANURAS DE EXPANSIÓN */}
      {/* Mini ranura PCIe x1 (ranura superior por encima de la GPU) */}
      <group position={[0.45, 0.06, 0.58]}>
        <mesh castShadow>
          <boxGeometry args={[0.45, 0.08, 0.10]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>
      </group>

      {/* Ranura de socket SSD M.2 NVMe y soporte de montaje (horizontal debajo del socket de CPU) */}
      <group position={[0.20, 0.05, 0.45]}>
        {/* Conector M.2 Key-M */}
        <mesh position={[0, 0, 0.43]} castShadow>
          <boxGeometry args={[0.30, 0.06, 0.08]} />
          <meshStandardMaterial color="#020617" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Contactos dorados dentro del socket M.2 */}
        <mesh position={[0, 0.01, 0.43]}>
          <boxGeometry args={[0.26, 0.01, 0.06]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.95} />
        </mesh>
        {/* Soporte trasero con tornillo separador de latón */}
        <mesh position={[0, -0.01, -0.41]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.04, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* 10. PILA DE BOTÓN CMOS CR2032 EN SU PORTAPILA */}
      <group position={[-0.60, 0.06, 0.88]}>
        {/* Anillo exterior del portapila */}
        <mesh castShadow>
          <cylinderGeometry args={[0.13, 0.13, 0.06, 24]} />
          <meshStandardMaterial color="#020617" roughness={0.8} />
        </mesh>
        {/* Pila de botón de litio metálica brillante */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.04, 24]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.98} roughness={0.05} />
        </mesh>
        {/* Resorte clip de retención */}
        <mesh position={[0.10, 0.03, 0]}>
          <boxGeometry args={[0.03, 0.02, 0.08]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
        </mesh>
      </group>

      {/* 11. CHIPS CONTROLADORES DE CIRCUITO INTEGRADO (IC de audio, Super I/O, LAN, BIOS) */}
      {/* Chip microcontrolador Super I/O (abajo a la derecha) */}
      <group position={[0.98, 0.05, 0.95]}>
        <mesh castShadow>
          <boxGeometry args={[0.24, 0.04, 0.24]} />
          <meshStandardMaterial color="#090d16" roughness={0.4} />
        </mesh>
        {/* Pines de conexión */}
        <mesh position={[0, -0.01, 0]}>
          <boxGeometry args={[0.27, 0.01, 0.27]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
        </mesh>
      </group>

      {/* Circuito integrado de audio (abajo a la izquierda) */}
      <group position={[-1.08, 0.05, 0.25]}>
        <mesh castShadow>
          <boxGeometry args={[0.18, 0.035, 0.18]} />
          <meshStandardMaterial color="#090d16" roughness={0.4} />
        </mesh>
      </group>

      {/* Chip controlador LAN Gigabit */}
      <group position={[-0.82, 0.05, -0.72]}>
        <mesh castShadow>
          <boxGeometry args={[0.16, 0.035, 0.16]} />
          <meshStandardMaterial color="#090d16" roughness={0.4} />
        </mesh>
      </group>

      {/* Chip dual de BIOS (socket DIP de 8 pines) */}
      <group position={[-0.42, 0.05, 0.98]}>
        <mesh castShadow>
          <boxGeometry args={[0.12, 0.05, 0.16]} />
          <meshStandardMaterial color="#090d16" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.026, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.005, 12]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* 12. CONECTORES Y CABEZALES */}
      {/* Bloque conector principal de alimentación ATX de 24 pines */}
      <group position={[1.12, 0.14, 0.35]}>
        <mesh castShadow>
          <boxGeometry args={[0.18, 0.20, 0.95]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.3} roughness={0.3} />
        </mesh>
        {/* Cuadrícula de pines del conector */}
        <mesh position={[0.091, 0, 0]}>
          <planeGeometry args={[0.01, 0.90]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
      </group>

      {/* Conector para cable plano ATA / IDE (ATA RAID principal - estilo de referencia) */}
      <group position={[1.12, 0.12, 0.90]}>
        <mesh castShadow>
          <boxGeometry args={[0.18, 0.18, 0.70]} />
          <meshStandardMaterial color="#020617" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[0.12, 0.03, 0.64]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Conector para unidad de disquete */}
      <group position={[0.82, 0.10, 1.15]}>
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.16, 0.16]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.4} />
        </mesh>
      </group>

      {/* Arreglo de 4 puertos SATA III */}
      <group position={[1.12, 0.10, -0.25]}>
        {[-0.20, -0.06, 0.08, 0.22].map((z, idx) => (
          <group key={`sata-port-${idx}`} position={[0, 0, z]}>
            <mesh castShadow>
              <boxGeometry args={[0.18, 0.12, 0.11]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
            <mesh position={[0.091, 0, 0]}>
              <boxGeometry args={[0.01, 0.08, 0.07]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.9} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Arreglo de jumpers del panel frontal y cabezales USB (borde inferior) */}
      <group position={[0, 0.05, 1.20]}>
        {[-0.8, -0.5, -0.2, 0.1, 0.4].map((x, idx) => (
          <group key={`header-${idx}`} position={[x, 0, 0]}>
            <mesh>
              <boxGeometry args={[0.18, 0.04, 0.08]} />
              <meshStandardMaterial color={idx % 2 === 0 ? '#3b82f6' : '#64748b'} />
            </mesh>
            {/* Pines dorados expuestos */}
            {[-0.06, 0, 0.06].map((px, pi) => (
              <mesh key={`pin-${idx}-${pi}`} position={[px, 0.03, 0]}>
                <cylinderGeometry args={[0.008, 0.008, 0.04, 8]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.95} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* 13. TORRES DE CONECTORES DEL PANEL TRASERO DE E/S (arreglo de puertos metálicos apilados a lo largo del borde superior) */}
      <group position={[-0.85, 0.25, -1.20]}>
        {/* Puerto doble PS/2 para teclado/ratón */}
        <mesh position={[-0.30, 0, 0]} castShadow>
          <boxGeometry args={[0.18, 0.35, 0.22]} />
          <meshStandardMaterial color="#a855f7" roughness={0.3} />
        </mesh>

        {/* Torre apilada 1 de doble USB + RJ45 LAN */}
        <mesh position={[-0.05, 0, 0]} castShadow>
          <boxGeometry args={[0.22, 0.42, 0.24]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Torre apilada 2 de doble USB + RJ45 LAN */}
        <mesh position={[0.20, 0, 0]} castShadow>
          <boxGeometry args={[0.22, 0.42, 0.24]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Bloque apilado de conectores de audio */}
        <group position={[0.45, -0.05, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.20, 0.30, 0.22]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          {[-0.08, 0.08].map((y, yi) => (
            <mesh key={`audio-jack-${yi}`} position={[0, y, -0.11]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
              <meshStandardMaterial color={yi === 0 ? '#22c55e' : '#f59e0b'} metalness={0.9} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Cabezal de alimentación EPS de 8 pines para CPU (borde superior derecho) */}
      <group position={[0.95, 0.12, -1.20]}>
        <mesh castShadow>
          <boxGeometry args={[0.32, 0.16, 0.16]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
        </mesh>
      </group>

      {/* 14. LÍNEA DE AISLAMIENTO DEL CIRCUITO DE AUDIO */}
      <mesh position={[-1.02, 0.003, 0.55]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.02, 1.25]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>
      </group>
    </group>
  );
};