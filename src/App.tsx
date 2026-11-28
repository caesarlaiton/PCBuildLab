import React, { useState } from 'react';
import {
  ComponentId,
  ViewMode,
  BuildPreset,
  InventoryComponent
} from './types';
import { COMPONENTS_DATA } from './data/componentsData';
import { PCScene } from './components/3d/PCScene';
import { Header } from './components/ui/Header';
import { ComponentSidePanel } from './components/ui/ComponentSidePanel';
import { ControlBar } from './components/ui/ControlBar';
import { AIAssistantModal } from './components/ui/AIAssistantModal';
import { playExplodedSound, playSelectSound } from './utils/audio';
import {
  validateCpuMotherboard,
  validateRamMotherboard,
  validatePowerSupply
} from './utils/compatibility';

export default function App() {
  const [selectedComponentId, setSelectedComponentId] = useState<ComponentId | null>(null);
  const [hoveredComponentId, setHoveredComponentId] = useState<ComponentId | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('standard');
  const [activePreset] = useState<BuildPreset>('gaming');
  const [showCase, setShowCase] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [explodedFactor, setExplodedFactor] = useState<number>(0);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState<boolean>(false);

  // Registro global de los productos seleccionados para cada componente
  const [selectedProducts, setSelectedProducts] = useState<
    Record<ComponentId, InventoryComponent | null>
  >({
    cpu: null,
    gpu: null,
    ram: null,
    motherboard: null,
    psu: null,
    storage: null,
    cooler: null
  });

  // Guardar el producto elegido por el usuario
  const handleProductSelect = (product: InventoryComponent) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [product.componentId]: product
    }));
  };

  // Majear cambio de modo de vista
  const handleSetViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === 'exploded' && explodedFactor === 0) {
      setExplodedFactor(0.85);
      playExplodedSound(true);
    } else if (mode === 'standard') {
      setExplodedFactor(0);
      playExplodedSound(false);
    }
  };

  // Control deslizante de vista explosionada
  const handleExplodedFactorChange = (val: number) => {
    setExplodedFactor(val);
    if (val > 0.1 && viewMode !== 'exploded') {
      setViewMode('exploded');
    } else if (val <= 0.02 && viewMode === 'exploded') {
      setViewMode('standard');
    }
  };

  // Navegación entre componentes
  const activeComponentIndex = COMPONENTS_DATA.findIndex(
    (c) => c.id === selectedComponentId
  );

  const handleNavigateNext = () => {
    const nextIdx = (activeComponentIndex + 1) % COMPONENTS_DATA.length;
    setSelectedComponentId(COMPONENTS_DATA[nextIdx].id);
  };

  const handleNavigatePrev = () => {
    const prevIdx =
      (activeComponentIndex - 1 + COMPONENTS_DATA.length) %
      COMPONENTS_DATA.length;

    setSelectedComponentId(COMPONENTS_DATA[prevIdx].id);
  };

  const activeComponentData =
    COMPONENTS_DATA.find((c) => c.id === selectedComponentId) || null;

  // Cálculo de compatibilidad global
  const compatibilityResults = [
    ...validateCpuMotherboard(selectedProducts.cpu ?? undefined, selectedProducts.motherboard ?? undefined),
    ...validateRamMotherboard(selectedProducts.ram ?? undefined, selectedProducts.motherboard ?? undefined),
    ...validatePowerSupply(
      [
        selectedProducts.cpu,
        selectedProducts.gpu,
        selectedProducts.ram,
        selectedProducts.motherboard,
        selectedProducts.storage,
        selectedProducts.cooler
      ],
      selectedProducts.psu ?? undefined
    )
  ];

  return (
    <div className="w-screen h-screen overflow-hidden cyber-grid font-sans relative select-none">
      <Header
        viewMode={viewMode}
        onSetViewMode={handleSetViewMode}
        showCase={showCase}
        onToggleCase={() => setShowCase((prev) => !prev)}
        showLabels={showLabels}
        onToggleLabels={() => setShowLabels((prev) => !prev)}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        onResetView={() => {
          setSelectedComponentId(null);
          setSelectedProducts({
            cpu: null,
            gpu: null,
            ram: null,
            motherboard: null,
            psu: null,
            storage: null,
            cooler: null
          });
          setExplodedFactor(0);
          setViewMode('standard');
        }}
      />

      {/* Comparte con el canvas el estado de productos seleccionados para actualizar las etiquetas en tiempo real. */}
      <PCScene
        selectedComponentId={selectedComponentId}
        onSelectComponent={(id) => {
          setSelectedComponentId(id);
          if (id) playSelectSound();
        }}
        explodedFactor={explodedFactor}
        viewMode={viewMode}
        showCase={showCase}
        hoveredComponentId={hoveredComponentId}
        onHoverComponent={setHoveredComponentId}
        hideLabels={!showLabels || isAIAssistantOpen}
        selectedProducts={selectedProducts}
      />

      <ComponentSidePanel
        component={activeComponentData}
        activePreset={activePreset}
        selectedProducts={selectedProducts}
        onProductSelect={handleProductSelect}
        onClose={() => setSelectedComponentId(null)}
        onNavigateNext={handleNavigateNext}
        onNavigatePrev={handleNavigatePrev}
      />

      <ControlBar
        selectedComponentId={selectedComponentId}
        onSelectComponent={(id) => {
          setSelectedComponentId(id);
          playSelectSound();
        }}
        explodedFactor={explodedFactor}
        onChangeExplodedFactor={handleExplodedFactorChange}
        selectedProducts={selectedProducts}
        compatibilityResults={compatibilityResults}
      />

      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        activeComponentId={selectedComponentId}
        activePreset={activePreset}
      />
    </div>
  );
}
