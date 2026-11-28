import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Sparkles, Environment, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { ComponentId, InventoryComponent, ViewMode } from '../../types';
import { COMPONENTS_DATA } from '../../data/componentsData';
import { Motherboard3D } from './Motherboard3D';
import { CPU3D } from './CPU3D';
import { GPU3D } from './GPU3D';
import { RAM3D } from './RAM3D';
import { PSU3D } from './PSU3D';
import { Storage3D } from './Storage3D';
import { Cooler3D } from './Cooler3D';
import { PCCase3D } from './PCCase3D';
import { Component3DLabel } from './Component3DLabel';
import { CanvasLoader } from './CanvasLoader';

interface PCSceneProps {
  selectedComponentId: ComponentId | null;
  onSelectComponent: (id: ComponentId) => void;
  explodedFactor: number;
  viewMode: ViewMode;
  showCase?: boolean;
  hoveredComponentId: ComponentId | null;
  onHoverComponent: (id: ComponentId | null) => void;
  hideLabels?: boolean;
  // Productos elegidos por el usuario, indexados por el tipo de componente.
  selectedProducts: Record<ComponentId, InventoryComponent | null>;
}

// Abreviaturas usadas exclusivamente en las etiquetas del canvas para mantener los nombres de las secciones explicativas sin cambios.
const COMPONENT_SHORT_NAMES: Record<ComponentId, string> = {
  cpu: 'CPU',
  gpu: 'GPU',
  ram: 'RAM',
  motherboard: 'MOBO',
  psu: 'PSU',
  storage: 'SSD',
  cooler: 'AIO',
};

// Cálculo de transformación espacial para cada componente en modo explosionado
const getComponentTransform = (
  id: ComponentId,
  showCase: boolean,
  explodedFactor: number,
  _baseComp: typeof COMPONENTS_DATA[0]
): { position: [number, number, number]; rotation: [number, number, number] } => {
  if (showCase) {
    const moboX = -0.78 - 0.8 * explodedFactor;
    const moboY = 0.25;
    const moboZ = -0.60;

    switch (id) {
      case 'motherboard':
        return {
          position: [moboX, moboY, moboZ],
          rotation: [0, 0, -Math.PI / 2],
        };
      case 'cpu': {
        const lx = -0.40;
        const ly = 0.05 + 1.2 * explodedFactor;
        const lz = 0.45;
        return {
          position: [moboX + ly, moboY - lx, moboZ + lz],
          rotation: [0, 0, -Math.PI / 2],
        };
      }
      case 'cooler': {
        const lx = -0.40;
        const ly = 0.12 + 2.4 * explodedFactor;
        const lz = 0.45;
        return {
          position: [moboX + ly, moboY - lx, moboZ + lz],
          rotation: [0, 0, -Math.PI / 2],
        };
      }
      case 'ram': {
        const lx = -0.40;
        const ly = 0.24 + 1.4 * explodedFactor;
        const lz = -0.48;
        return {
          position: [moboX + ly, moboY - lx, moboZ + lz],
          rotation: [-Math.PI / 2, 0, -Math.PI / 2],
        };
      }
      case 'storage': {
        const lx = 0.20;
        const ly = 0.05 + 1.0 * explodedFactor;
        const lz = 0.45;
        return {
          position: [moboX + ly, moboY - lx, moboZ + lz],
          rotation: [0, 0, -Math.PI / 2],
        };
      }
      case 'gpu': {
        return {
          position: [-0.09 + 1.8 * explodedFactor, -0.48 - 0.4 * explodedFactor, moboZ + 0.42 + 0.8 * explodedFactor],
          rotation: [-Math.PI / 2, 0, Math.PI / 2],
        };
      }
      case 'psu':
        return {
          position: [
            -1.15 - 1.5 * explodedFactor,
            -0.80 - 0.4 * explodedFactor,
            moboZ - 0.20 - 1.0 * explodedFactor
          ],
          rotation: [0, 0, 0],
        };
      default:
        return { position: [0, 0, 0], rotation: [0, 0, 0] };
    }
  }

  const moboX = 0;
  const moboY = 0 - 0.8 * explodedFactor;
  const moboZ = -0.1;

  switch (id) {
    case 'motherboard':
      return {
        position: [moboX, moboY, moboZ],
        rotation: [0, 0, 0],
      };
    case 'cpu':
      return {
        position: [moboX - 0.40, moboY + 0.05 + 1.2 * explodedFactor, moboZ + 0.45],
        rotation: [0, Math.PI / 2, 0],
      };
    case 'cooler':
      return {
        position: [moboX - 0.40, moboY + 0.12 + 2.4 * explodedFactor, moboZ + 0.45],
        rotation: [0, Math.PI / 2, 0],
      };
    case 'ram':
      return {
        position: [moboX - 0.40, moboY + 0.24 + 1.4 * explodedFactor, moboZ - 0.48],
        rotation: [0, Math.PI / 2, 0],
      };
    case 'storage':
      return {
        position: [moboX + 0.20, moboY + 0.05 + 1.0 * explodedFactor, moboZ + 0.45],
        rotation: [0, 0, 0],
      };
    case 'gpu':
      return {
        position: [moboX + 2.5, moboY - 0.2, moboZ + 0.0],
        rotation: [-Math.PI / 2, 0, Math.PI / 2],
      };
    case 'psu':
      return {
        position: [moboX - 2.0, moboY, moboZ],
        rotation: [0, 0, 0],
      };
    default:
      return { position: [0, 0, 0], rotation: [0, 0, 0] };
  }
};

// Rig de cámara para enfoque fluido hacia el componente seleccionado
const CameraRig: React.FC<{
  selectedId: ComponentId | null;
  showCase: boolean;
  explodedFactor: number;
  controlsRef: React.RefObject<any>;
}> = ({ selectedId, showCase, explodedFactor, controlsRef }) => {
  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    let targetPos = new THREE.Vector3(0, 0, 0);
    if (selectedId) {
      const comp = COMPONENTS_DATA.find((c) => c.id === selectedId);
      if (comp) {
        const { position } = getComponentTransform(selectedId, showCase, explodedFactor, comp);
        targetPos.set(...position);
      }
    }

    controlsRef.current.target.lerp(targetPos, delta * 3.5);
    controlsRef.current.update();
  });

  return null;
};

// Rastrea cuando el contenido dentro de Suspense ha montado y renderizado al menos dos frames
const SceneReadyTracker: React.FC<{ onSceneMounted: () => void }> = ({ onSceneMounted }) => {
  const framesRenderedRef = useRef<number>(0);
  const notifiedRef = useRef<boolean>(false);

  useFrame(() => {
    framesRenderedRef.current += 1;
    // Esperar al menos 2 frames para asegurar que geometrías y materiales se hayan compilado
    if (framesRenderedRef.current >= 2 && !notifiedRef.current) {
      notifiedRef.current = true;
      onSceneMounted();
    }
  });

  return null;
};

// Escucha el DefaultLoadingManager dentro del tree de la escena
const LoadingBridge: React.FC<{
  onProgressUpdate: (active: boolean, progress: number) => void;
}> = ({ onProgressUpdate }) => {
  const { active, progress } = useProgress();

  useEffect(() => {
    onProgressUpdate(active, progress);
  }, [active, progress, onProgressUpdate]);

  return null;
};

export const PCScene: React.FC<PCSceneProps> = (props) => {
  const controlsRef = useRef<any>(null);

  const [managerActive, setManagerActive] = useState<boolean>(true);
  const [managerProgress, setManagerProgress] = useState<number>(0);
  const [sceneMounted, setSceneMounted] = useState<boolean>(false);
  const [visualProgress, setVisualProgress] = useState<number>(5);
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  const handleProgressUpdate = React.useCallback((active: boolean, progress: number) => {
    setManagerActive(active);
    setManagerProgress(progress);
  }, []);

  const handleSceneMounted = React.useCallback(() => {
    setSceneMounted(true);
  }, []);

  // Avance progresivo del porcentaje visual
  useEffect(() => {
    if (!showLoader) return;

    const interval = setInterval(() => {
      setVisualProgress((prev) => {
        const targetFromManager = managerProgress > 0 ? managerProgress : 0;
        const targetFromMount = sceneMounted && !managerActive ? 100 : sceneMounted ? 85 : 65;
        const target = Math.max(prev, targetFromManager, targetFromMount);

        if (prev >= 100) return 100;

        // Avance suave hacia el objetivo actual
        const step = target > prev ? Math.max(2, (target - prev) * 0.25) : 1.5;
        return Math.min(target, prev + step);
      });
    }, 60);

    return () => clearInterval(interval);
  }, [showLoader, managerProgress, managerActive, sceneMounted]);

  // Cierra el loader solo cuando la escena está montada, no hay cargas activas y el progreso llego a 100%
  useEffect(() => {
    if (sceneMounted && !managerActive && visualProgress >= 99.5) {
      setVisualProgress(100);
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 120);

      const hideTimer = setTimeout(() => {
        setShowLoader(false);
      }, 420);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [sceneMounted, managerActive, visualProgress]);

  return (
    <div className="w-full h-full relative select-none">
      {showLoader && (
        <CanvasLoader
          isOverlay={true}
          displayProgress={visualProgress}
          isFadingOut={isFadingOut}
        />
      )}

      <Canvas
        camera={{ position: [4.8, 3.8, 5.5], fov: 42 }}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
        }}
        onPointerMissed={(e) => {
          if (e && (e.target as HTMLElement)?.tagName === 'CANVAS') {
            props.onSelectComponent(null as any);
          }
        }}
      >
        <LoadingBridge onProgressUpdate={handleProgressUpdate} />

        <Suspense fallback={null}>
          <SceneReadyTracker onSceneMounted={handleSceneMounted} />

          <color attach="background" args={['#f8fafc']} />
          <fog attach="fog" args={['#f8fafc', 12, 30]} />

          <Environment preset="studio" environmentIntensity={1.25} />

          <ambientLight intensity={1.5} />

          <directionalLight
            position={[10, 16, 12]}
            intensity={3.2}
            color="#ffffff"
            castShadow
            shadow-bias={-0.0001}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={32}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />

          <directionalLight
            position={[-10, 12, -8]}
            intensity={1.8}
            color="#e2e8f0"
          />
          <directionalLight
            position={[0, -10, 6]}
            intensity={0.6}
            color="#cbd5e1"
          />

          <spotLight
            position={[0, 12, 4]}
            intensity={2.4}
            color="#ffffff"
            angle={0.75}
            penumbra={0.8}
            castShadow
            shadow-bias={-0.0001}
          />

          <pointLight position={[-6, 5, 4]} intensity={1.5} color="#ffffff" />
          <pointLight position={[6, -1, -4]} intensity={1.2} color="#94a3b8" />

          <Sparkles count={50} scale={12} size={1.8} speed={0.25} opacity={0.3} color="#94a3b8" />

          <gridHelper args={[28, 28, '#cbd5e1', '#e2e8f0']} position={[0, -2, 0]} />

          <ContactShadows
            position={[0, -1.95, 0]}
            opacity={0.35}
            scale={16}
            blur={2.5}
            far={8}
            color="#000000"
          />

          <CameraRig
            selectedId={props.selectedComponentId}
            showCase={props.showCase ?? true}
            explodedFactor={props.explodedFactor}
            controlsRef={controlsRef}
          />

          <OrbitControls
            ref={controlsRef}
            makeDefault
            enableDamping
            dampingFactor={0.05}
            minDistance={2}
            maxDistance={12}
            maxPolarAngle={Math.PI / 2 + 0.1}
          />

          {props.showCase && <PCCase3D explodedFactor={props.explodedFactor} />}

          {COMPONENTS_DATA.map((comp) => {
            const { position, rotation } = getComponentTransform(
              comp.id,
              props.showCase ?? true,
              props.explodedFactor,
              comp
            );
            const isSelected = props.selectedComponentId === comp.id;
            const isHovered = props.hoveredComponentId === comp.id;
            // Obtiene el producto actualmente elegido para que cada etiqueta pueda mostrar su nombre e imagen.
            const selectedProduct = props.selectedProducts[comp.id];

            const labelPos: [number, number, number] = props.showCase
              ? comp.id === 'motherboard' ? [-0.8, 1.8, -0.6] :
                comp.id === 'cpu' ? [0.1, 0.5, 0.0] :
                comp.id === 'cooler' ? [0.3, 0.5, 0.0] :
                comp.id === 'gpu' ? [0.4, 0.3, 0.0] :
                comp.id === 'ram' ? [0.3, 0.3, 0.0] :
                comp.id === 'storage' ? [0.2, 0.3, 0.0] :
                [0.2, 0.4, 0.0]
              : comp.id === 'motherboard' ? [-1.2, 0.4, -0.1] :
                comp.id === 'cpu' ? [0.0, 0.35, 0.0] :
                comp.id === 'cooler' ? [0.0, 0.65, 0.0] :
                comp.id === 'gpu' ? [0.0, 0.65, 0.0] :
                comp.id === 'ram' ? [0.0, 0.55, 0.0] :
                comp.id === 'psu' ? [0.0, 0.60, 0.0] :
                [0.0, 0.35, 0.0];

            return (
              <group key={comp.id} position={position} rotation={rotation}>
                {comp.id === 'motherboard' && (
                  <Motherboard3D
                    isSelected={isSelected}
                    viewMode={props.viewMode}
                    onClick={() => props.onSelectComponent(comp.id)}
                    onPointerOver={() => props.onHoverComponent(comp.id)}
                    onPointerOut={() => props.onHoverComponent(null)}
                  />
                )}
                {comp.id === 'cpu' && (
                  <CPU3D
                    isSelected={isSelected}
                    viewMode={props.viewMode}
                    onClick={() => props.onSelectComponent(comp.id)}
                    onPointerOver={() => props.onHoverComponent(comp.id)}
                    onPointerOut={() => props.onHoverComponent(null)}
                  />
                )}
                {comp.id === 'gpu' && (
                  <GPU3D
                    isSelected={isSelected}
                    viewMode={props.viewMode}
                    onClick={() => props.onSelectComponent(comp.id)}
                    onPointerOver={() => props.onHoverComponent(comp.id)}
                    onPointerOut={() => props.onHoverComponent(null)}
                  />
                )}
                {comp.id === 'ram' && (
                  <RAM3D
                    isSelected={isSelected}
                    viewMode={props.viewMode}
                    onClick={() => props.onSelectComponent(comp.id)}
                    onPointerOver={() => props.onHoverComponent(comp.id)}
                    onPointerOut={() => props.onHoverComponent(null)}
                  />
                )}
                {comp.id === 'psu' && (
                  <PSU3D
                    isSelected={isSelected}
                    viewMode={props.viewMode}
                    onClick={() => props.onSelectComponent(comp.id)}
                    onPointerOver={() => props.onHoverComponent(comp.id)}
                    onPointerOut={() => props.onHoverComponent(null)}
                  />
                )}
                {comp.id === 'storage' && (
                  <Storage3D
                    isSelected={isSelected}
                    viewMode={props.viewMode}
                    onClick={() => props.onSelectComponent(comp.id)}
                    onPointerOver={() => props.onHoverComponent(comp.id)}
                    onPointerOut={() => props.onHoverComponent(null)}
                  />
                )}
                {comp.id === 'cooler' && (
                  <Cooler3D
                    isSelected={isSelected}
                    viewMode={props.viewMode}
                    showTubes={props.showCase}
                    showCase={props.showCase}
                    onClick={() => props.onSelectComponent(comp.id)}
                    onPointerOver={() => props.onHoverComponent(comp.id)}
                    onPointerOut={() => props.onHoverComponent(null)}
                  />
                )}

                <Component3DLabel
                  id={comp.id}
                  name={COMPONENT_SHORT_NAMES[comp.id]}
                  productName={selectedProduct?.name ?? null}
                  productImageUrl={selectedProduct?.imageUrl ?? null}
                  color={comp.color}
                  isSelected={isSelected}
                  isHovered={isHovered}
                  hidden={props.hideLabels}
                  position={labelPos}
                  onClick={() => props.onSelectComponent(comp.id)}
                  onPointerOver={() => props.onHoverComponent(comp.id)}
                  onPointerOut={() => props.onHoverComponent(null)}
                />
              </group>
            );
          })}
        </Suspense>
      </Canvas>
    </div>
  );
};
