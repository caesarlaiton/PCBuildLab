
import type {
  InventoryComponent,
  ComponentId,
  ComponentSpec,
  MetricData
} from '../types';

// ==========================================
// MÉTRICAS INDIVIDUALES POR PRODUCTO
// ==========================================

function getProductMetrics(id: string): MetricData[] {
  let hash = 0;

  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }

  const getValue = (offset: number, min: number, max: number) => {
    return min + ((hash + offset * 7919) % (max - min + 1));
  };

  return [
    { name: 'Rendimiento', value: getValue(1, 76, 99) },
    { name: 'Eficiencia', value: getValue(2, 72, 98) },
    { name: 'Calidad', value: getValue(3, 78, 99) },
    { name: 'Capacidad', value: getValue(4, 74, 98) }
  ];
}

// ==========================================
// FUNCIÓN PARA CREAR PRODUCTOS
// ==========================================

function createItem(
  id: string,
  componentId: ComponentId,
  name: string,
  subtitle: string,
  imageUrl: string,
  thermalTemp: number,
  powerDrawWatts: number,
  detailedSpecs: ComponentSpec[],
  shortSummary: string,
  compatibilityNotes: string[]
): InventoryComponent {
  return {
    id,
    componentId,
    name,
    subtitle,
    imageUrl,
    thermalTemp,
    powerDrawWatts,
    detailedSpecs,
    performanceMetrics: getProductMetrics(id),
    shortSummary,
    defaultExplanation: shortSummary,
    compatibilityNotes
  };
}

// ==========================================
// INVENTARIO GENERAL
// ==========================================

export const COMPONENT_INVENTORY: InventoryComponent[] = [

  // ==========================================
  // 1. PROCESADORES (CPU)
  // ==========================================

  createItem(
    'cpu-intel-i9-14900ks', 'cpu',
    'Intel Core i9-14900KS',
    'Intel Core i9 / Raptor Lake Refresh',
    '/images/components/intel-i9-14900ks.png',
    78, 253,
    [
      { label: 'Núcleos / Hilos', value: '24 / 32', highlight: true },
      { label: 'Frecuencia máxima', value: '6.20 GHz' },
      { label: 'Caché L3', value: '36 MB' },
      { label: 'Socket', value: 'LGA 1700' },
      { label: 'Potencia turbo', value: '253 W' }
    ],
    'Procesador Intel de gama entusiasta para gaming y productividad.',
    ['Socket LGA 1700.', 'Memoria DDR4 o DDR5 según placa base.', 'Refrigeración de alto rendimiento recomendada.']
  ),

  createItem(
    'cpu-intel-i7-14700k', 'cpu',
    'Intel Core i7-14700K',
    'Intel Core i7 / Raptor Lake Refresh',
    '/images/components/intel-i7-14700k.png',
    72, 253,
    [
      { label: 'Núcleos / Hilos', value: '20 / 28', highlight: true },
      { label: 'Frecuencia máxima', value: '5.60 GHz' },
      { label: 'Caché L3', value: '33 MB' },
      { label: 'Socket', value: 'LGA 1700' },
      { label: 'Potencia turbo', value: '253 W' }
    ],
    'Procesador de alto rendimiento para gaming y aplicaciones exigentes.',
    ['Socket LGA 1700.', 'Memoria DDR4 o DDR5 según placa base.', 'Refrigeración adecuada para cargas intensivas.']
  ),

  createItem(
    'cpu-intel-i5-14600k', 'cpu',
    'Intel Core i5-14600K',
    'Intel Core i5 / Raptor Lake Refresh',
    '/images/components/intel-i5-14600k.png',
    68, 181,
    [
      { label: 'Núcleos / Hilos', value: '14 / 20', highlight: true },
      { label: 'Frecuencia máxima', value: '5.30 GHz' },
      { label: 'Caché L3', value: '24 MB' },
      { label: 'Socket', value: 'LGA 1700' },
      { label: 'Potencia turbo', value: '181 W' }
    ],
    'Procesador equilibrado para gaming y productividad.',
    ['Socket LGA 1700.', 'Memoria DDR4 o DDR5 según placa base.', 'Verificar BIOS de la placa base.']
  ),

  createItem(
    'cpu-amd-ryzen-9-7950x3d', 'cpu',
    'AMD Ryzen 9 7950X3D',
    'AMD Ryzen 9 / Zen 4',
    '/images/components/amd-ryzen-9-7950x3d.png',
    75, 162,
    [
      { label: 'Núcleos / Hilos', value: '16 / 32', highlight: true },
      { label: 'Frecuencia máxima', value: '5.70 GHz' },
      { label: 'Caché L3', value: '128 MB' },
      { label: 'Socket', value: 'AM5' },
      { label: 'TDP', value: '120 W' }
    ],
    'Procesador AMD de gama alta con tecnología 3D V-Cache.',
    ['Socket AM5.', 'Memoria DDR5.', 'Refrigeración de buena capacidad.']
  ),

  createItem(
    'cpu-amd-ryzen-7-7800x3d', 'cpu',
    'AMD Ryzen 7 7800X3D',
    'AMD Ryzen 7 / Zen 4',
    '/images/components/amd-ryzen-7-7800x3d.png',
    70, 120,
    [
      { label: 'Núcleos / Hilos', value: '8 / 16', highlight: true },
      { label: 'Frecuencia máxima', value: '5.00 GHz' },
      { label: 'Caché L3', value: '96 MB' },
      { label: 'Socket', value: 'AM5' },
      { label: 'TDP', value: '120 W' }
    ],
    'Procesador especialmente orientado a videojuegos de alto rendimiento.',
    ['Socket AM5.', 'Memoria DDR5.', 'Refrigeración compatible con AM5.']
  ),

  // ==========================================
  // 2. TARJETAS GRÁFICAS (GPU)
  // ==========================================

  createItem(
    'gpu-rtx-4090', 'gpu',
    'NVIDIA GeForce RTX 4090',
    'GeForce RTX 40 / Ada Lovelace',
    '/images/components/rtx-4090.png',
    68, 450,
    [
      { label: 'Núcleos CUDA', value: '16,384', highlight: true },
      { label: 'Memoria', value: '24 GB GDDR6X' },
      { label: 'Bus', value: '384-bit' },
      { label: 'Interfaz', value: 'PCIe 4.0 x16' },
      { label: 'Consumo', value: '450 W' }
    ],
    'Tarjeta gráfica de gama entusiasta para gaming 4K y creación de contenido.',
    ['Fuente recomendada de alta capacidad.', 'Verificar dimensiones del case.', 'Revisar conector de alimentación.']
  ),

  createItem(
    'gpu-rtx-4080-super', 'gpu',
    'NVIDIA GeForce RTX 4080 SUPER',
    'GeForce RTX 40 / Ada Lovelace',
    '/images/components/rtx-4080-super.png',
    65, 320,
    [
      { label: 'Núcleos CUDA', value: '10,240', highlight: true },
      { label: 'Memoria', value: '16 GB GDDR6X' },
      { label: 'Bus', value: '256-bit' },
      { label: 'Interfaz', value: 'PCIe 4.0 x16' },
      { label: 'Consumo', value: '320 W' }
    ],
    'Tarjeta gráfica de alto rendimiento para gaming avanzado.',
    ['Verificar espacio del case.', 'Fuente adecuada para la GPU.', 'Comprobar alimentación.']
  ),

  createItem(
    'gpu-rtx-4070-super', 'gpu',
    'NVIDIA GeForce RTX 4070 SUPER',
    'GeForce RTX 40 / Ada Lovelace',
    '/images/components/rtx-4070-super.png',
    64, 220,
    [
      { label: 'Núcleos CUDA', value: '7,168', highlight: true },
      { label: 'Memoria', value: '12 GB GDDR6X' },
      { label: 'Bus', value: '192-bit' },
      { label: 'Interfaz', value: 'PCIe 4.0 x16' },
      { label: 'Consumo', value: '220 W' }
    ],
    'GPU equilibrada para gaming en altas resoluciones.',
    ['Verificar espacio disponible.', 'Comprobar capacidad de la fuente.', 'Revisar conectores.']
  ),

  createItem(
    'gpu-rx-7900-xtx', 'gpu',
    'AMD Radeon RX 7900 XTX',
    'Radeon RX 7000 / RDNA 3',
    '/images/components/rx-7900-xtx.png',
    70, 355,
    [
      { label: 'Unidades de cómputo', value: '96', highlight: true },
      { label: 'Memoria', value: '24 GB GDDR6' },
      { label: 'Bus', value: '384-bit' },
      { label: 'Interfaz', value: 'PCIe 4.0 x16' },
      { label: 'Consumo', value: '355 W' }
    ],
    'Tarjeta gráfica AMD de alto rendimiento para videojuegos y creación de contenido.',
    ['Verificar dimensiones.', 'Fuente de alimentación adecuada.', 'Comprobar conectores PCIe.']
  ),

  createItem(
    'gpu-rx-7800-xt', 'gpu',
    'AMD Radeon RX 7800 XT',
    'Radeon RX 7000 / RDNA 3',
    '/images/components/rx-7800-xt.png',
    66, 263,
    [
      { label: 'Unidades de cómputo', value: '60', highlight: true },
      { label: 'Memoria', value: '16 GB GDDR6' },
      { label: 'Bus', value: '256-bit' },
      { label: 'Interfaz', value: 'PCIe 4.0 x16' },
      { label: 'Consumo', value: '263 W' }
    ],
    'GPU orientada al gaming de alto rendimiento en 1440p.',
    ['Verificar espacio del case.', 'Comprobar potencia de la fuente.', 'Revisar conectores PCIe.']
  ),

  // ==========================================
  // 3. MEMORIAS RAM
  // ==========================================

  createItem(
    'ram-corsair-vengeance-32gb', 'ram',
    'Corsair Vengeance DDR5 32GB',
    '2 x 16 GB / 6000 MT/s',
    '/images/components/corsair-vengeance.png',
    42, 10,
    [
      { label: 'Capacidad', value: '32 GB', highlight: true },
      { label: 'Configuración', value: '2 x 16 GB' },
      { label: 'Tipo', value: 'DDR5' },
      { label: 'Frecuencia', value: '6000 MT/s' },
      { label: 'Formato', value: 'DIMM' }
    ],
    'Memoria DDR5 para equipos gaming y estaciones de trabajo.',
    ['La placa debe admitir DDR5.', 'Verificar frecuencia admitida.', 'Comprobar capacidad máxima.']
  ),

  createItem(
    'ram-gskill-trident-64gb', 'ram',
    'G.Skill Trident Z5 RGB 64GB',
    '2 x 32 GB / DDR5',
    '/images/components/gskill-trident-z5.png',
    43, 12,
    [
      { label: 'Capacidad', value: '64 GB', highlight: true },
      { label: 'Configuración', value: '2 x 32 GB' },
      { label: 'Tipo', value: 'DDR5' },
      { label: 'Frecuencia', value: '6000 MT/s' },
      { label: 'Iluminación', value: 'RGB' }
    ],
    'Memoria de gran capacidad para gaming y productividad.',
    ['Requiere placa DDR5.', 'Verificar perfiles XMP o EXPO.', 'Comprobar compatibilidad del kit.']
  ),

  createItem(
    'ram-kingston-fury-32gb', 'ram',
    'Kingston Fury Beast 32GB',
    '2 x 16 GB / DDR5',
    '/images/components/kingston-fury.png',
    41, 10,
    [
      { label: 'Capacidad', value: '32 GB', highlight: true },
      { label: 'Configuración', value: '2 x 16 GB' },
      { label: 'Tipo', value: 'DDR5' },
      { label: 'Frecuencia', value: '5600 MT/s' },
      { label: 'Formato', value: 'DIMM' }
    ],
    'Memoria DDR5 para configuraciones modernas.',
    ['Compatible con placas DDR5.', 'Verificar frecuencia admitida.', 'Revisar perfiles de memoria.']
  ),

  createItem(
    'ram-corsair-dominator-64gb', 'ram',
    'Corsair Dominator Titanium 64GB',
    '2 x 32 GB / DDR5',
    '/images/components/corsair-dominator.png',
    44, 14,
    [
      { label: 'Capacidad', value: '64 GB', highlight: true },
      { label: 'Configuración', value: '2 x 32 GB' },
      { label: 'Tipo', value: 'DDR5' },
      { label: 'Frecuencia', value: '6600 MT/s' },
      { label: 'Iluminación', value: 'RGB' }
    ],
    'Memoria premium para equipos de alto rendimiento.',
    ['Requiere placa DDR5.', 'Verificar compatibilidad del controlador.', 'Comprobar altura del módulo.']
  ),

  createItem(
    'ram-gskill-ripjaws-32gb', 'ram',
    'G.Skill Ripjaws S5 32GB',
    '2 x 16 GB / DDR5',
    '/images/components/gskill-ripjaws.png',
    40, 10,
    [
      { label: 'Capacidad', value: '32 GB', highlight: true },
      { label: 'Configuración', value: '2 x 16 GB' },
      { label: 'Tipo', value: 'DDR5' },
      { label: 'Frecuencia', value: '6000 MT/s' },
      { label: 'Formato', value: 'DIMM' }
    ],
    'Memoria DDR5 de perfil discreto para equipos modernos.',
    ['Requiere placa DDR5.', 'Verificar frecuencia compatible.', 'Comprobar perfiles de memoria.']
  ),

  // ==========================================
  // 4. PLACAS BASE
  // ==========================================

  createItem(
    'mb-asus-rog-maximus-z790', 'motherboard',
    'ASUS ROG Maximus Z790 Hero',
    'Intel Z790 / ATX',
    '/images/components/asus-z790-hero.png',
    45, 60,
    [
      { label: 'Socket', value: 'LGA 1700', highlight: true },
      { label: 'Chipset', value: 'Intel Z790' },
      { label: 'Formato', value: 'ATX' },
      { label: 'Memoria', value: 'DDR5' },
      { label: 'Conectividad', value: 'Wi-Fi 6E' }
    ],
    'Placa base de gama alta para procesadores Intel compatibles.',
    ['Socket LGA 1700.', 'Memoria DDR5.', 'Verificar dimensiones ATX.']
  ),

  createItem(
    'mb-msi-z790-carbon', 'motherboard',
    'MSI MPG Z790 Carbon WiFi',
    'Intel Z790 / ATX',
    '/images/components/msi-z790-carbon.png',
    44, 55,
    [
      { label: 'Socket', value: 'LGA 1700', highlight: true },
      { label: 'Chipset', value: 'Intel Z790' },
      { label: 'Formato', value: 'ATX' },
      { label: 'Memoria', value: 'DDR5' },
      { label: 'Conectividad', value: 'Wi-Fi 6E' }
    ],
    'Placa base Intel con opciones avanzadas de conectividad.',
    ['Socket LGA 1700.', 'Memoria DDR5.', 'Verificar BIOS y dimensiones.']
  ),

  createItem(
    'mb-gigabyte-z790-aorus', 'motherboard',
    'Gigabyte Z790 AORUS Elite AX',
    'Intel Z790 / ATX',
    '/images/components/gigabyte-z790-aorus.png',
    43, 50,
    [
      { label: 'Socket', value: 'LGA 1700', highlight: true },
      { label: 'Chipset', value: 'Intel Z790' },
      { label: 'Formato', value: 'ATX' },
      { label: 'Memoria', value: 'DDR5' },
      { label: 'Conectividad', value: 'Wi-Fi 6E' }
    ],
    'Placa base para equipos Intel de alto rendimiento.',
    ['Socket LGA 1700.', 'Memoria DDR5.', 'Verificar dimensiones.']
  ),

  createItem(
    'mb-asus-x670e-hero', 'motherboard',
    'ASUS ROG Crosshair X670E Hero',
    'AMD X670E / ATX',
    '/images/components/asus-x670e-hero.png',
    46, 65,
    [
      { label: 'Socket', value: 'AM5', highlight: true },
      { label: 'Chipset', value: 'AMD X670E' },
      { label: 'Formato', value: 'ATX' },
      { label: 'Memoria', value: 'DDR5' },
      { label: 'Interfaz', value: 'PCIe 5.0' }
    ],
    'Placa base premium para procesadores AMD Ryzen AM5.',
    ['Socket AM5.', 'Memoria DDR5.', 'Verificar compatibilidad del procesador.']
  ),

  createItem(
    'mb-msi-b650-tomahawk', 'motherboard',
    'MSI MAG B650 Tomahawk WiFi',
    'AMD B650 / ATX',
    '/images/components/msi-b650-tomahawk.png',
    44, 50,
    [
      { label: 'Socket', value: 'AM5', highlight: true },
      { label: 'Chipset', value: 'AMD B650' },
      { label: 'Formato', value: 'ATX' },
      { label: 'Memoria', value: 'DDR5' },
      { label: 'Conectividad', value: 'Wi-Fi 6E' }
    ],
    'Placa base AMD equilibrada para gaming y productividad.',
    ['Socket AM5.', 'Memoria DDR5.', 'Verificar versión de BIOS.']
  ),

  createItem(
    'mb-asus-tuf-b760-plus-d4', 'motherboard',
    'ASUS TUF Gaming B760-PLUS WIFI D4',
    'Intel B760 / ATX / DDR4',
    '/images/components/asus-tuf-b760-d4.png',
    43, 50,
    [
      { label: 'Socket', value: 'LGA 1700', highlight: true },
      { label: 'Chipset', value: 'Intel B760' },
      { label: 'Formato', value: 'ATX' },
      { label: 'Memoria', value: 'DDR4' },
      { label: 'Conectividad', value: 'Wi-Fi 6' }
    ],
    'Placa base Intel compatible con procesadores LGA 1700 y memoria DDR4.',
    [
      'Socket LGA 1700.',
      'Memoria DDR4.',
      'Verificar compatibilidad del procesador.'
    ]
  ),

  // ==========================================
  // 5. FUENTES DE PODER
  // ==========================================

  createItem(
    'psu-corsair-rm1000x', 'psu',
    'Corsair RM1000x',
    '1000W / 80 PLUS Gold',
    '/images/components/corsair-rm1000x.png',
    40, 0,
    [
      { label: 'Potencia', value: '1000 W', highlight: true },
      { label: 'Certificación', value: '80 PLUS Gold' },
      { label: 'Formato', value: 'ATX' },
      { label: 'Cableado', value: 'Modular' },
      { label: 'Refrigeración', value: 'Ventilador' }
    ],
    'Fuente de alimentación para equipos de alto rendimiento.',
    ['Verificar consumo total.', 'Comprobar dimensiones.', 'Revisar conectores necesarios.']
  ),

  createItem(
    'psu-seasonic-prime-1300', 'psu',
    'Seasonic PRIME TX-1300',
    '1300W / 80 PLUS Titanium',
    '/images/components/seasonic-prime-tx.png',
    38, 0,
    [
      { label: 'Potencia', value: '1300 W', highlight: true },
      { label: 'Certificación', value: '80 PLUS Titanium' },
      { label: 'Formato', value: 'ATX' },
      { label: 'Cableado', value: 'Modular' },
      { label: 'Ventilador', value: '135 mm' }
    ],
    'Fuente de alimentación premium para configuraciones exigentes.',
    ['Verificar consumo total.', 'Comprobar espacio del case.', 'Revisar conectores.']
  ),

  createItem(
    'psu-corsair-rm850x', 'psu',
    'Corsair RM850x',
    '850W / 80 PLUS Gold',
    '/images/components/corsair-rm850x.png',
    40, 0,
    [
      { label: 'Potencia', value: '850 W', highlight: true },
      { label: 'Certificación', value: '80 PLUS Gold' },
      { label: 'Formato', value: 'ATX' },
      { label: 'Cableado', value: 'Modular' },
      { label: 'Ventilador', value: '135 mm' }
    ],
    'Fuente modular para equipos gaming de alto rendimiento.',
    ['Verificar consumo del equipo.', 'Revisar dimensiones.', 'Comprobar conectores.']
  ),

  createItem(
    'psu-msi-mpg-a1000g', 'psu',
    'MSI MPG A1000G',
    '1000W / 80 PLUS Gold',
    '/images/components/msi-a1000g.png',
    41, 0,
    [
      { label: 'Potencia', value: '1000 W', highlight: true },
      { label: 'Certificación', value: '80 PLUS Gold' },
      { label: 'Formato', value: 'ATX' },
      { label: 'Cableado', value: 'Modular' },
      { label: 'Conectividad', value: 'PCIe 5.0 según versión' }
    ],
    'Fuente de alimentación modular para configuraciones avanzadas.',
    ['Verificar versión exacta.', 'Comprobar consumo total.', 'Revisar conectores.']
  ),

  createItem(
    'psu-bequiet-dark-power-13', 'psu',
    'be quiet! Dark Power 13',
    '1000W / 80 PLUS Titanium',
    '/images/components/bequiet-dark-power-13.png',
    39, 0,
    [
      { label: 'Potencia', value: '1000 W', highlight: true },
      { label: 'Certificación', value: '80 PLUS Titanium' },
      { label: 'Formato', value: 'ATX 3.0' },
      { label: 'Cableado', value: 'Modular' },
      { label: 'Ventilador', value: '135 mm' }
    ],
    'Fuente premium orientada a equipos de alto rendimiento.',
    ['Verificar consumo total.', 'Comprobar dimensiones.', 'Revisar conectores PCIe 5.0.']
  ),

  // NUEVA FUENTE: CORSAIR RM650x

  createItem(
    'psu-corsair-rm650x', 'psu',
    'Corsair RM650x',
    '650W / 80 PLUS Gold',
    '/images/components/corsair-rm650x.png',
    40, 0,
    [
      { label: 'Potencia', value: '650 W', highlight: true },
      { label: 'Certificación', value: '80 PLUS Gold' },
      { label: 'Formato', value: 'ATX' },
      { label: 'Cableado', value: 'Modular' },
      { label: 'Ventilador', value: '135 mm' }
    ],
    'Fuente de alimentación de 650 W para configuraciones gaming y equipos de rendimiento medio-alto.',
    ['Verificar consumo total.', 'Comprobar dimensiones.', 'Revisar conectores necesarios.']
  ),

  // ==========================================
  // 6. ALMACENAMIENTO
  // ==========================================

  createItem(
    'storage-samsung-990-pro', 'storage',
    'Samsung 990 PRO 2TB',
    'NVMe SSD / PCIe 4.0',
    '/images/components/samsung-990-pro.png',
    48, 8,
    [
      { label: 'Capacidad', value: '2 TB', highlight: true },
      { label: 'Interfaz', value: 'PCIe 4.0 x4' },
      { label: 'Formato', value: 'M.2 2280' },
      { label: 'Lectura', value: 'Hasta 7450 MB/s' },
      { label: 'Escritura', value: 'Hasta 6900 MB/s' }
    ],
    'SSD NVMe de alto rendimiento para aplicaciones y videojuegos.',
    ['Ranura M.2 compatible.', 'Verificar soporte NVMe.', 'Disipación térmica recomendada.']
  ),

  createItem(
    'storage-wd-black-sn850x', 'storage',
    'WD Black SN850X 2TB',
    'NVMe SSD / PCIe 4.0',
    '/images/components/wd-black-sn850x.png',
    49, 8,
    [
      { label: 'Capacidad', value: '2 TB', highlight: true },
      { label: 'Interfaz', value: 'PCIe 4.0 x4' },
      { label: 'Formato', value: 'M.2 2280' },
      { label: 'Lectura', value: 'Hasta 7300 MB/s' },
      { label: 'Escritura', value: 'Hasta 6600 MB/s' }
    ],
    'Unidad SSD rápida orientada a gaming y productividad.',
    ['Ranura M.2 compatible.', 'Verificar soporte NVMe.', 'Revisar disipador.']
  ),

  createItem(
    'storage-crucial-t500', 'storage',
    'Crucial T500 2TB',
    'NVMe SSD / PCIe 4.0',
    '/images/components/crucial-t500.png',
    47, 8,
    [
      { label: 'Capacidad', value: '2 TB', highlight: true },
      { label: 'Interfaz', value: 'PCIe 4.0 x4' },
      { label: 'Formato', value: 'M.2 2280' },
      { label: 'Lectura', value: 'Hasta 7400 MB/s' },
      { label: 'Escritura', value: 'Hasta 7000 MB/s' }
    ],
    'SSD de alta velocidad para sistemas modernos.',
    ['Ranura M.2 compatible.', 'Verificar soporte NVMe.', 'Revisar disipación.']
  ),

  createItem(
    'storage-kingston-kc3000', 'storage',
    'Kingston KC3000 2TB',
    'NVMe SSD / PCIe 4.0',
    '/images/components/kingston-kc3000.png',
    50, 8,
    [
      { label: 'Capacidad', value: '2 TB', highlight: true },
      { label: 'Interfaz', value: 'PCIe 4.0 x4' },
      { label: 'Formato', value: 'M.2 2280' },
      { label: 'Lectura', value: 'Hasta 7000 MB/s' },
      { label: 'Escritura', value: 'Hasta 7000 MB/s' }
    ],
    'SSD NVMe para almacenamiento de alto rendimiento.',
    ['Ranura M.2 compatible.', 'Verificar soporte NVMe.', 'Comprobar disipación térmica.']
  ),

  createItem(
    'storage-samsung-870-evo', 'storage',
    'Samsung 870 EVO 2TB',
    'SSD SATA III / 2.5 pulgadas',
    '/images/components/samsung-870-evo.png',
    42, 4,
    [
      { label: 'Capacidad', value: '2 TB', highlight: true },
      { label: 'Interfaz', value: 'SATA III 6 Gb/s' },
      { label: 'Formato', value: '2.5 pulgadas' },
      { label: 'Lectura', value: 'Hasta 560 MB/s' },
      { label: 'Escritura', value: 'Hasta 530 MB/s' }
    ],
    'SSD SATA para almacenamiento y actualización de equipos.',
    ['Requiere conexión SATA.', 'Verificar espacio de 2.5 pulgadas.', 'Comprobar cable de alimentación.']
  ),

  // ==========================================
  // 7. REFRIGERACIÓN
  // ==========================================

  createItem(
    'cooler-corsair-h150i', 'cooler',
    'Corsair iCUE H150i ELITE',
    'Refrigeración líquida AIO / 360 mm',
    '/images/components/corsair-h150i.png',
    35, 15,
    [
      { label: 'Tipo', value: 'Líquida AIO', highlight: true },
      { label: 'Radiador', value: '360 mm' },
      { label: 'Ventiladores', value: '3 x 120 mm' },
      { label: 'Iluminación', value: 'RGB' },
      { label: 'Compatibilidad', value: 'Intel / AMD según versión' }
    ],
    'Sistema de refrigeración líquida para procesadores de alto rendimiento.',
    ['Verificar espacio para radiador.', 'Comprobar socket compatible.', 'Revisar ubicación de montaje.']
  ),

  createItem(
    'cooler-nzxt-kraken-360', 'cooler',
    'NZXT Kraken 360',
    'Refrigeración líquida AIO / 360 mm',
    '/images/components/nzxt-kraken-360.png',
    36, 15,
    [
      { label: 'Tipo', value: 'Líquida AIO', highlight: true },
      { label: 'Radiador', value: '360 mm' },
      { label: 'Ventiladores', value: '3 x 120 mm' },
      { label: 'Pantalla', value: 'LCD según versión' },
      { label: 'Compatibilidad', value: 'Intel / AMD según versión' }
    ],
    'Refrigeración líquida con diseño orientado a equipos de alto rendimiento.',
    ['Verificar espacio para radiador.', 'Comprobar socket.', 'Revisar conexiones disponibles.']
  ),

  createItem(
    'cooler-noctua-nh-d15', 'cooler',
    'Noctua NH-D15',
    'Refrigeración por aire / Doble torre',
    '/images/components/noctua-nh-d15.png',
    40, 3,
    [
      { label: 'Tipo', value: 'Aire', highlight: true },
      { label: 'Ventiladores', value: '2 x 140 mm' },
      { label: 'Disipador', value: 'Doble torre' },
      { label: 'Altura', value: '165 mm' },
      { label: 'Compatibilidad', value: 'Intel / AMD según montaje' }
    ],
    'Disipador de aire de alto rendimiento para procesadores exigentes.',
    ['Verificar altura del case.', 'Comprobar socket.', 'Revisar espacio para módulos RAM.']
  ),

  createItem(
    'cooler-deepcool-ak620', 'cooler',
    'DeepCool AK620',
    'Refrigeración por aire / Doble torre',
    '/images/components/deepcool-ak620.png',
    42, 3,
    [
      { label: 'Tipo', value: 'Aire', highlight: true },
      { label: 'Ventiladores', value: '2 x 120 mm' },
      { label: 'Disipador', value: 'Doble torre' },
      { label: 'Altura', value: '160 mm' },
      { label: 'Compatibilidad', value: 'Intel / AMD según montaje' }
    ],
    'Disipador de aire de doble torre para equipos de alto rendimiento.',
    ['Verificar altura del case.', 'Comprobar socket.', 'Revisar espacio de RAM.']
  ),

  createItem(
    'cooler-arctic-liquid-freezer-iii', 'cooler',
    'Arctic Liquid Freezer III 360',
    'Refrigeración líquida AIO / 360 mm',
    '/images/components/arctic-liquid-freezer-iii.png',
    34, 15,
    [
      { label: 'Tipo', value: 'Líquida AIO', highlight: true },
      { label: 'Radiador', value: '360 mm' },
      { label: 'Ventiladores', value: '3 x 120 mm' },
      { label: 'Bomba', value: 'Integrada' },
      { label: 'Compatibilidad', value: 'Intel / AMD según versión' }
    ],
    'Refrigeración líquida diseñada para ofrecer una elevada capacidad de disipación.',
    ['Verificar espacio para radiador.', 'Comprobar socket.', 'Revisar dimensiones del conjunto.']
  )

];
