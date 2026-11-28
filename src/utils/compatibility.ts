
import type { InventoryComponent } from '../types';

// ==========================================
// TIPOS DE RESULTADOS
// ==========================================

export type CompatibilityStatus =
  | 'compatible'
  | 'warning'
  | 'incompatible';

export interface CompatibilityResult {
  status: CompatibilityStatus;
  title: string;
  message: string;
  components: string[];
}

// ==========================================
// OBTENER UNA ESPECIFICACIÓN
// ==========================================

function getSpec(
  component: InventoryComponent | undefined,
  label: string
): string | undefined {
  return component?.detailedSpecs.find(
    (spec) => spec.label.toLowerCase() === label.toLowerCase()
  )?.value;
}

// ==========================================
// VALIDAR CPU Y PLACA BASE
// ==========================================

export function validateCpuMotherboard(
  cpu: InventoryComponent | undefined,
  motherboard: InventoryComponent | undefined
): CompatibilityResult[] {
  if (!cpu || !motherboard) {
    return [];
  }

  const cpuSocket = getSpec(cpu, 'Socket');
  const motherboardSocket = getSpec(motherboard, 'Socket');

  if (!cpuSocket || !motherboardSocket) {
    return [
      {
        status: 'warning',
        title: 'Compatibilidad no verificada',
        message:
          'No hay suficiente información para comprobar el socket de ambos componentes.',
        components: [cpu.name, motherboard.name]
      }
    ];
  }

  if (cpuSocket.toLowerCase() !== motherboardSocket.toLowerCase()) {
    return [
      {
        status: 'incompatible',
        title: 'Procesador y placa base incompatibles',
        message: `El procesador utiliza socket ${cpuSocket}, mientras que la placa base utiliza socket ${motherboardSocket}. Necesitas una placa base con socket ${cpuSocket}.`,
        components: [cpu.name, motherboard.name]
      }
    ];
  }

  return [
    {
      status: 'compatible',
      title: 'Socket compatible',
      message: `Ambos componentes utilizan socket ${cpuSocket}.`,
      components: [cpu.name, motherboard.name]
    }
  ];
}

// ==========================================
// VALIDAR RAM Y PLACA BASE
// ==========================================

export function validateRamMotherboard(
  ram: InventoryComponent | undefined,
  motherboard: InventoryComponent | undefined
): CompatibilityResult[] {
  if (!ram || !motherboard) {
    return [];
  }

  const ramType = getSpec(ram, 'Tipo');
  const motherboardMemory = getSpec(motherboard, 'Memoria');

  if (!ramType || !motherboardMemory) {
    return [
      {
        status: 'warning',
        title: 'Compatibilidad de memoria no verificada',
        message:
          'Falta información sobre el tipo de memoria RAM o el tipo de memoria admitido por la placa base.',
        components: [ram.name, motherboard.name]
      }
    ];
  }

  if (
    ramType.trim().toLowerCase() !==
    motherboardMemory.trim().toLowerCase()
  ) {
    return [
      {
        status: 'incompatible',
        title: 'Memoria RAM incompatible',
        message: `La memoria RAM utiliza ${ramType}, pero la placa base admite ${motherboardMemory}. Debes seleccionar una memoria del tipo ${motherboardMemory}.`,
        components: [ram.name, motherboard.name]
      }
    ];
  }

  return [
    {
      status: 'compatible',
      title: 'Tipo de memoria compatible',
      message: `La memoria RAM y la placa base utilizan ${ramType}. El tipo de memoria coincide. La frecuencia y la capacidad máxima todavía deben verificarse por separado.`,
      components: [ram.name, motherboard.name]
    }
  ];
}

// ==========================================
// OBTENER POTENCIA DE LA FUENTE
// ==========================================

function getPowerSupplyCapacity(
  psu: InventoryComponent
): number | undefined {
  const possibleLabels = [
    'Potencia',
    'Potencia nominal',
    'Potencia máxima',
    'Wattage',
    'Power'
  ];

  for (const label of possibleLabels) {
    const value = getSpec(psu, label);

    if (value) {
      const match = value.match(/(\d{3,4})\s*W/i);

      if (match) {
        return Number(match[1]);
      }
    }
  }

  return undefined;
}

// ==========================================
// VALIDAR COMPONENTES Y FUENTE DE ALIMENTACIÓN
// ==========================================

export function validatePowerSupply(
  selectedComponents: (
    InventoryComponent | null | undefined
  )[],
  psu: InventoryComponent | undefined
): CompatibilityResult[] {
  if (!psu) {
    return [];
  }

  const components = selectedComponents.filter(
    (component): component is InventoryComponent =>
      component !== null && component !== undefined
  );

  if (components.length === 0) {
    return [];
  }

  const psuCapacity = getPowerSupplyCapacity(psu);

  if (!psuCapacity || psuCapacity <= 0) {
    return [
      {
        status: 'warning',
        title: 'Potencia de la fuente no verificada',
        message:
          'No se pudo identificar la potencia nominal de la fuente de alimentación. Se necesita ese dato para comprobar si puede alimentar los componentes.',
        components: [psu.name]
      }
    ];
  }

  const invalidConsumption = components.some(
    (component) =>
      !Number.isFinite(component.powerDrawWatts) ||
      component.powerDrawWatts <= 0
  );

  if (invalidConsumption) {
    return [
      {
        status: 'warning',
        title: 'Consumo no verificado',
        message:
          'Uno o más componentes no tienen un consumo eléctrico válido. No se puede calcular la potencia total con suficiente información.',
        components: [...components.map((item) => item.name), psu.name]
      }
    ];
  }

  const totalConsumption = components.reduce(
    (total, component) => total + component.powerDrawWatts,
    0
  );

  // Se recomienda reservar un margen aproximado del 20%.
  const recommendedPower = totalConsumption * 1.2;

  const componentNames = [
    ...components.map((item) => item.name),
    psu.name
  ];

  if (totalConsumption > psuCapacity) {
    return [
      {
        status: 'incompatible',
        title: 'Potencia de la fuente insuficiente',
        message: `Los componentes seleccionados tienen un consumo estimado de ${Math.ceil(totalConsumption)} W, pero la fuente ofrece ${psuCapacity} W. Necesitas una fuente con mayor potencia.`,
        components: componentNames
      }
    ];
  }

  if (recommendedPower > psuCapacity) {
    return [
      {
        status: 'warning',
        title: 'Fuente de alimentación con poco margen',
        message: `El consumo estimado es de ${Math.ceil(totalConsumption)} W y la fuente ofrece ${psuCapacity} W. Puede alimentar la configuración según esta estimación, pero no alcanza el margen recomendado del 20%.`,
        components: componentNames
      }
    ];
  }

  return [
    {
      status: 'compatible',
      title: 'Potencia de la fuente suficiente',
      message: `El consumo estimado de los componentes es de ${Math.ceil(totalConsumption)} W. La fuente ofrece ${psuCapacity} W y mantiene un margen de potencia adecuado.`,
      components: componentNames
    }
  ];
}
