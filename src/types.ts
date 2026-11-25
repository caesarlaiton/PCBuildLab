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
  color: string; // Hexadecimal de Tailwind o nombre de color
  glowColor: string;
  position: [number, number, number]; // Posición 3D por defecto
  explodedOffset: [number, number, number]; // Vector de desplazamiento en vista explotada (despiece)
  rotation?: [number, number, number];
  scale?: [number, number, number];
  shortSummary: string;
  detailedSpecs: ComponentSpec[];
  performanceMetrics: MetricData[];
  defaultExplanation: string;
  thermalTemp: number; // En grados Celsius para la superposición térmica
  powerDrawWatts: number;
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