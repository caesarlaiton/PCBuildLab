
export type ComponentId = 'cpu' | 'gpu' | 'ram' | 'motherboard' | 'psu' | 'storage' | 'cooler';

export interface ComponentSpec {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface MetricData {
  name: string;
  value: number; // 0-100
  unit?: string;
}

export interface PCComponentData {
  id: ComponentId;
  name: string;
  category: string;
  subtitle: string;
  icon: string;
  color: string;
  glowColor: string;
  position: [number, number, number];
  explodedOffset: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  shortSummary: string;
  detailedSpecs: ComponentSpec[];
  performanceMetrics: MetricData[];
  defaultExplanation: string;
  thermalTemp: number;
  powerDrawWatts: number;
}

// ==========================================
// INVENTARIO DE COMPONENTES
// ==========================================

export interface InventoryComponent {
  id: string;
  componentId: ComponentId;
  name: string;
  subtitle: string;
  imageUrl: string;
  thermalTemp: number;
  powerDrawWatts: number;
  detailedSpecs: ComponentSpec[];
  performanceMetrics: MetricData[];
  shortSummary: string;
  defaultExplanation: string;
  compatibilityNotes: string[];
}

export type ViewMode = 'standard' | 'exploded' | 'signal_flow' | 'thermal';

export type BuildPreset = 'gaming' | 'workstation' | 'compact';

export interface HardwarePreset {
  id: BuildPreset;
  name: string;
  tagline: string;
  totalPowerWatts: number;
  estPrice: string;
  components: Record<ComponentId, {
    name: string;
    subtitle: string;
    specs: ComponentSpec[];
  }>;
}
