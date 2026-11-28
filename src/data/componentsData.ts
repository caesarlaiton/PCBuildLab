import { PCComponentData, HardwarePreset } from '../types';

export const COMPONENTS_DATA: PCComponentData[] = [
  {
    id: 'cpu',
    name: 'Central Processing Unit (CPU)',
    category: 'Procesador',
    subtitle: 'Intel Core i9-14900KS / AMD Ryzen 9 7950X3D',
    icon: 'Cpu',
    color: '#3b82f6', // Azul
    glowColor: '#60a5fa',
    position: [-0.45, 0.05, -0.50],
    explodedOffset: [0, 1.2, 0],
    shortSummary: 'El cerebro de la computadora. Ejecuta instrucciones del sistema, cálculos de física, lógica de IA y orquesta los comandos de la GPU.',
    thermalTemp: 78,
    powerDrawWatts: 253,
    detailedSpecs: [
      { label: 'Núcleos / Threads', value: '24 Cores (8P + 16E) / 32 Threads', highlight: true },
      { label: 'Frecuencia Turbo Máxima', value: '6.20 GHz' },
      { label: 'Caché L3', value: '36 MB Smart Cache' },
      { label: 'Socket', value: 'LGA 1700 / AM5' },
      { label: 'TDP / Potencia Máxima', value: '125W Base / 253W Boost' },
      { label: 'Líneas PCIe', value: 'PCIe 5.0 (hasta 20 líneas)' },
      { label: 'Gráficos Integrados', value: 'UHD Graphics 770' }
    ],
    performanceMetrics: [
      { name: 'Velocidad Single-Core', value: 98 },
      { name: 'Cómputo Multi-Thread', value: 95 },
      { name: 'Rendimiento en Juegos (FPS)', value: 96 },
      { name: 'Eficiencia Térmica', value: 72 }
    ],
    defaultExplanation: `### Resumen Ejecutivo
La **Central Processing Unit (CPU)** es el motor de cómputo principal de la PC. Procesa algoritmos secuenciales, tareas del sistema operativo, lógica de videojuegos, simulaciones físicas y envía instrucciones de renderizado a la tarjeta gráfica.

### Responsabilidades Arquitectónicas Clave
* **Pipeline de Ejecución de Instrucciones**: Busca, decodifica y ejecuta miles de millones de instrucciones por segundo entre núcleos de rendimiento (P) y de eficiencia (E).
* **Orquestación del Bus Principal**: Coordina transacciones de memoria de alta velocidad entre el almacenamiento NVMe, los módulos de RAM y las ranuras de expansión PCIe.
* **Caché L1/L2/L3 de Baja Latencia**: Buffers ultrarrápidos integrados en el chip que mantienen alimentados los pipelines de la CPU sin esperar a la memoria RAM.

### Por Qué Importa en el Rendimiento del Sistema
Una CPU más rápida evita los "cuellos de botella" donde una GPU de gama alta se ve obligada a esperar la lógica del juego o la preparación de la escena. En creación de contenido como renderizado 3D, codificación de video y compilación de IA, contar con más núcleos escala la productividad exponencialmente.`
  },
  {
    id: 'gpu',
    name: 'Graphics Processing Unit (GPU)',
    category: 'Acelerador Paralelo de Gráficos e IA',
    subtitle: 'NVIDIA GeForce RTX 4090 / RX 7900 XTX',
    icon: 'Zap',
    color: '#10b981', // Verde esmeralda
    glowColor: '#34d399',
    position: [0, -0.45, 1.50],
    explodedOffset: [0, -0.8, 1.6],
    shortSummary: 'Acelerador masivamente paralelo dedicado a Ray Tracing 3D, rasterización, generación de fotogramas y cálculo matricial para redes neuronales.',
    thermalTemp: 68,
    powerDrawWatts: 450,
    detailedSpecs: [
      { label: 'Núcleos CUDA / Stream', value: '16,384 Cores', highlight: true },
      { label: 'Memoria de Video (VRAM)', value: '24 GB GDDR6X', highlight: true },
      { label: 'Ancho de Bus de Memoria', value: '384-bit (1,008 GB/s de ancho de banda)' },
      { label: 'Frecuencia Boost', value: '2520 MHz (2.8+ GHz OC)' },
      { label: 'Núcleos Ray Tracing / Tensor', value: '3ª Gen RT / 4ª Gen Tensor' },
      { label: 'Estándar de Interfaz', value: 'PCIe 4.0 x16' },
      { label: 'Entrada de Alimentación', value: '12VHPWR (450W - 600W)' }
    ],
    performanceMetrics: [
      { name: 'FPS en Juegos 4K', value: 99 },
      { name: 'Tecnología Ray Tracing', value: 98 },
      { name: 'Cómputo IA / Tensor', value: 97 },
      { name: 'Capacidad de VRAM', value: 95 }
    ],
    defaultExplanation: `### Resumen Ejecutivo
La **Graphics Processing Unit (GPU)** es un procesador especializado construido con miles de núcleos paralelos altamente eficientes, diseñados para resolver matemáticas matriciales complejas, transformaciones geométricas 3D, sombreado de píxeles e inferencia de IA.

### Responsabilidades Arquitectónicas Clave
* **Paralelismo Masivo**: Mientras que una CPU tiene entre 8 y 24 núcleos, una GPU insignia integra más de **16,000 núcleos CUDA/Stream** calculando millones de píxeles de forma simultánea.
* **VRAM Dedicada de Alta Velocidad**: 24 GB de memoria GDDR6X ultraancha con más de 1 TB/s de ancho de banda para cargar texturas 4K, estructuras BVH de Ray Tracing y pesos de modelos de IA (LLM).
* **Motores de Ray Tracing y Tensor IA**: Núcleos dedicados optimizados para rebotes de luz en tiempo real, reflejos, path tracing y generación de fotogramas por IA (DLSS 3.5 / FSR 3).

### Por Qué Importa en el Rendimiento del Sistema
La GPU determina directamente la fidelidad del renderizado 3D, los FPS en resoluciones altas (1440p, 4K, VR) y la velocidad de entrenamiento de modelos de IA. Sin una GPU capaz, los juegos 3D modernos y el software gráfico no pueden renderizar escenas complejas con fluidez.`
  },
  {
    id: 'ram',
    name: 'Random Access Memory (RAM)',
    category: 'Memoria del Sistema',
    subtitle: '32GB (2x16GB) DDR5 6400MHz CL32 RGB',
    icon: 'Layers',
    color: '#cyan-400',
    glowColor: '#22d3ee',
    position: [-0.40, 0.24, -0.48],
    explodedOffset: [1.6, 1.0, 0],
    shortSummary: 'Espacio de trabajo volátil ultrarrápido que almacena aplicaciones activas, recursos de juegos y datos temporales para el acceso inmediato de la CPU.',
    thermalTemp: 45,
    powerDrawWatts: 15,
    detailedSpecs: [
      { label: 'Capacidad', value: '32 GB (2x 16 GB Dual Channel)', highlight: true },
      { label: 'Tipo de Memoria', value: 'DDR5 (Double Data Rate 5)' },
      { label: 'Frecuencia de Reloj', value: '6400 MT/s (PC5-51200)', highlight: true },
      { label: 'Latencia CAS (TIMINGS)', value: 'CL32-39-39-102' },
      { label: 'Voltaje de Alimentación', value: '1.35V (XMP 3.0 / EXPO)' },
      { label: 'Soporte ECC', value: 'On-Die ECC' },
      { label: 'Control RGB', value: 'Difusor Direccionable de 16.8M Colores' }
    ],
    performanceMetrics: [
      { name: 'Tasa de Transferencia de Datos', value: 92 },
      { name: 'Tiempos de Latencia', value: 88 },
      { name: 'Capacidad Multitarea', value: 90 },
      { name: 'Eficiencia Energética', value: 95 }
    ],
    defaultExplanation: `### Resumen Ejecutivo
La **Random Access Memory (RAM)** actúa como un puente ultrarrápido entre el almacenamiento SSD de gran capacidad y la CPU. Mantiene en memoria viva los archivos del sistema operativo, pestañas del navegador, programas en segundo plano y recursos activos de juegos 3D.

### Responsabilidades Arquitectónicas Clave
* **Ancho de Banda Dual-Channel**: Usar dos o cuatro módulos DIMM duplica el ancho del bus del controlador de memoria a 128 bits, superando los 60–80 GB/s de rendimiento.
* **Latencia en Nanosegundos**: La RAM responde en ~10–14 nanosegundos, en comparación con los microsegundos de los SSD NVMe, evitando detenciones en la CPU.
* **Arquitectura Volátil**: Los datos en la RAM se almacenan mediante diminutas cargas capacitivas que requieren energía continua. Al apagar el equipo, se limpia para garantizar un estado limpio al reiniciar.

### Por Qué Importa en el Rendimiento del Sistema
Una cantidad insuficiente de RAM obliga a Windows a intercambiar memoria hacia el disco ("archivo de paginación"), causando tirones severos y caídas de FPS en juegos. Las altas frecuencias DDR5 y las latencias ajustadas mejoran los mínimos de FPS (1% lows) y la productividad multitarea.`
  },
  {
    id: 'motherboard',
    name: 'Motherboard (Placa Base)',
    category: 'Estructura e Interconexión del Sistema',
    subtitle: 'ASUS ROG Maximus Z790 / MSI MEG X670E',
    icon: 'Grid',
    color: '#a855f7', // Púrpura
    glowColor: '#c084fc',
    position: [0, 0, -0.1],
    explodedOffset: [0, 0, -1.8],
    shortSummary: 'El centro nervioso que conecta CPU, GPU, RAM, almacenamiento y periféricos mediante pistas PCIe de alta velocidad, VRMs y buses de chipset.',
    thermalTemp: 52,
    powerDrawWatts: 40,
    detailedSpecs: [
      { label: 'Factor de Forma', value: 'ATX (305mm x 244mm)' },
      { label: 'Chipset', value: 'Intel Z790 / AMD X670E', highlight: true },
      { label: 'Fases de Potencia VRM', value: '24+1+2 Fases (105A Smart Power)', highlight: true },
      { label: 'Ranuras PCIe', value: '2x PCIe 5.0 x16 + 1x PCIe 4.0 x4' },
      { label: 'Ranuras SSD M.2', value: '5x M.2 (1x PCIe 5.0 + 4x PCIe 4.0)' },
      { label: 'Conectividad I/O Trasera', value: 'Thunderbolt 4 (40Gbps), WiFi 6E, Ethernet 10Gb' },
      { label: 'Codec de Audio', value: 'ROG SupremeFX ALC4082 + ESS DAC' }
    ],
    performanceMetrics: [
      { name: 'Estabilidad de Fases de Potencia', value: 97 },
      { name: 'Velocidad del Bus PCIe 5.0', value: 98 },
      { name: 'Puertos de Expansión', value: 95 },
      { name: 'Disipación Térmica VRM', value: 90 }
    ],
    defaultExplanation: `### Resumen Ejecutivo
La **Motherboard** es la placa de circuito impreso (PCB) principal que aloja y conecta eléctricamente cada componente de la computadora. Enruta señales de datos de alta frecuencia, alimentación DC limpia y telemetría de hardware a través de múltiples capas de cobre.

### Responsabilidades Arquitectónicas Clave
* **Módulo Regulador de Voltaje (VRM)**: Convierte la corriente DC de 12V proveniente de la PSU en corriente ultracompensada de 1.1V - 1.4V que requieren las CPU modernas con precisión de submilisegundos.
* **Trazado de Bus PCIe**: Canales de cobre de alta frecuencia que operan hasta velocidades PCIe 5.0 (64 GB/s por dirección) conectando directamente la CPU con la GPU y los SSD NVMe.
* **Hub de Chipset PCH**: Gestiona unidades USB, unidades SATA, Ethernet, Wi-Fi 6E, cabezales de iluminación RGB e interfaces DAC de audio.

### Por Qué Importa en el Rendimiento del Sistema
Una motherboard económica con refrigeración VRM deficiente provocará *thermal throttling* en la CPU, limitando sus frecuencias turbo bajo cargas pesadas. Una motherboard de gama alta garantiza entrega de energía limpia, margen para overclocking y mayor capacidad de expansión futura.`
  },
  {
    id: 'psu',
    name: 'Power Supply Unit (PSU)',
    category: 'Entrega y Regulación de Energía',
    subtitle: '1000W 80+ Platinum Totalmente Modular ATX 3.0',
    icon: 'ShieldZap',
    color: '#eab308', // Dorado / Ámbar
    glowColor: '#fde047',
    position: [0, -1.25, 2.20],
    explodedOffset: [0, -1.4, 1.0],
    shortSummary: 'Convierte el voltaje AC de la pared en rieles de voltaje DC limpios y regulados (+12V, +5V, +3.3V) con protección contra sobretensiones y alta eficiencia.',
    thermalTemp: 42,
    powerDrawWatts: 15, // Consumo interno por conversión
    detailedSpecs: [
      { label: 'Capacidad de Potencia', value: '1000 Watts Continuos', highlight: true },
      { label: 'Certificación de Eficiencia', value: '80 PLUS Platinum (92%+ Eficiencia)', highlight: true },
      { label: 'Cableado Modular', value: '100% Totalmente Modular Mallado a Medida' },
      { label: 'Estándares Compatibles', value: 'ATX 3.0 y PCIe 5.0 12VHPWR Nativo' },
      { label: 'Capacitores', value: '100% Japoneses Electrolíticos de 105°C' },
      { label: 'Rodamiento del Ventilador', value: '135mm Fluid Dynamic Bearing (Modo Zero RPM)' },
      { label: 'Protecciones', value: 'Protección contra Sobretensión OVP, UVP, OCP, OPP, SCP, OTP' }
    ],
    performanceMetrics: [
      { name: 'Eficiencia de Conversión de Energía', value: 96 },
      { name: 'Regulación de Rizado de Voltaje', value: 98 },
      { name: 'Margen ante Picos Transitorios', value: 95 },
      { name: 'Silencio Acústico', value: 92 }
    ],
    defaultExplanation: `### Resumen Ejecutivo
La **Power Supply Unit (PSU)** toma la corriente alterna (AC) de 110V/220V desde el tomacorriente y la convierte en corriente continua (DC) segura y regulada (+12V, +5V, +3.3V) para los microchips sensibles.

### Responsabilidades Arquitectónicas Clave
* **Convertidores DC-a-DC y Transformadores de Alta Calidad**: Regulan la corriente para evitar caídas o picos de voltaje durante aumentos repentinos de consumo (picos transitorios) de la CPU o la GPU.
* **Eficiencia 80 PLUS Platinum**: Minimiza la electricidad desperdiciada en forma de calor, ahorrando energía y permitiendo que el ventilador opere de forma silenciosa.
* **Estándar ATX 3.0 y 12VHPWR**: Capaz de sostener excursiones de potencia de hasta el 200% (picos momentáneos de 2000W) exigidos por las GPU insignia RTX Serie 40.

### Por Qué Importa en el Rendimiento del Sistema
La PSU es la base de la estabilidad del sistema. Una fuente de baja calidad puede provocar reinicios o apagados inesperados, pantallas azules (BSOD), *coil whine* o incluso dañar permanentemente una CPU y GPU costosas ante una sobretensión.`
  },
  {
    id: 'storage',
    name: 'NVMe M.2 SSD Storage',
    category: 'Almacenamiento Persistente de Alta Velocidad',
    subtitle: '2TB PCIe Gen5 x4 M.2 NVMe SSD (12,400 MB/s)',
    icon: 'HardDrive',
    color: '#f97316', // Naranja
    glowColor: '#fb923c',
    position: [0.20, 0.05, 0.45],
    explodedOffset: [0, 0.8, 0.8],
    shortSummary: 'Unidad de memoria flash no volátil que ofrece arranques ultrarrápidos, carga instantánea de niveles en juegos y transmisión de recursos con DirectStorage.',
    thermalTemp: 58,
    powerDrawWatts: 9,
    detailedSpecs: [
      { label: 'Velocidad de Lectura Secuencial', value: '12,400 MB/s', highlight: true },
      { label: 'Velocidad de Escritura Secuencial', value: '11,800 MB/s', highlight: true },
      { label: 'Factor de Forma', value: 'M.2 2280 NVMe' },
      { label: 'Controlador de Interfaz', value: 'PCIe 5.0 x4 (Phison PS5026-E26)' },
      { label: 'Tipo de Memoria NAND Flash', value: 'Micron 232-Layer 3D TLC NAND' },
      { label: 'Caché DRAM', value: '4GB LPDDR4 Cache' },
      { label: 'Resistencia / Durabilidad', value: '1,200 TBW (Terabytes Escritos)' }
    ],
    performanceMetrics: [
      { name: 'Lectura / Escritura Secuencial', value: 99 },
      { name: 'Latencia IOPS Aleatoria', value: 95 },
      { name: 'Transmisión DirectStorage', value: 97 },
      { name: 'Refrigeración por Disipador Térmico', value: 85 }
    ],
    defaultExplanation: `### Resumen Ejecutivo
Las unidades **Non-Volatile Memory Express (NVMe) M.2 Solid State Drives (SSDs)** brindan almacenamiento persistente para el sistema operativo, juegos, proyectos y archivos multimedia. A diferencia de los antiguos discos duros mecánicos con cabezales, los SSD usan celdas de memoria flash 3D NAND sin partes móviles.

### Responsabilidades Arquitectónicas Clave
* **Canales de Datos PCIe Gen 5**: Mueven datos por 4 carriles PCIe directos a velocidades de hasta **12.4 GB por segundo**, permitiendo transferir un juego de 50 GB en menos de 5 segundos.
* **Microsoft DirectStorage**: Evita cuellos de botella de descompresión en la CPU transmitiendo texturas de juegos directamente desde el SSD NVMe hacia la VRAM de la GPU para reducir casi a cero los tiempos de carga.
* **Nivelación de Desgaste y TRIM**: Los controladores internos distribuyen los ciclos de escritura de manera uniforme entre miles de millones de celdas NAND para asegurar años de fiabilidad.

### Por Qué Importa en el Rendimiento del Sistema
Pasar de un SSD SATA tradicional o un HDD a un SSD NVMe PCIe 5.0 elimina las esperas al iniciar el sistema, reduce los tirones al cargar escenarios de mundo abierto y acelera el desplazamiento en líneas de tiempo de video 4K/8K.`
  },
  {
    id: 'cooler',
    name: 'CPU Liquid / Air Cooler',
    category: 'Motor de Gestión Térmica',
    subtitle: '360mm AIO Liquid Cooler con Pantalla LCD en Bomba',
    icon: 'Wind',
    color: '#06b6d4', // Cian
    glowColor: '#67e8f9',
    position: [0, 0.17, -0.60],
    explodedOffset: [0, 2.4, 0],
    shortSummary: 'Extrae el alto calor generado por el difusor de la CPU mediante placas frías de cobre, circuitos de refrigerante líquido y ventiladores de alta presión estática.',
    thermalTemp: 38,
    powerDrawWatts: 12,
    detailedSpecs: [
      { label: 'Tipo de Refrigeración', value: 'Circuito Líquido Todo-en-Uno (AIO) de 360mm', highlight: true },
      { label: 'Material del Radiador', value: 'Aluminio 394mm x 120mm x 27mm' },
      { label: 'Motor de la Bomba', value: 'Motor Asetek 8ª Gen (800 - 2800 RPM)' },
      { label: 'Placa Fría (Cold Plate)', value: 'Cobre de Alta Densidad con Microcanales' },
      { label: 'Ventiladores Instalados', value: '3x Ventiladores PWM de 120mm con Levitación Magnética' },
      { label: 'Presión Estática del Ventilador', value: '4.2 mmH2O / 78 CFM de Flujo de Aire' },
      { label: 'Pantalla Personalizada', value: 'Pantalla IPS LCD de 3.5" (60Hz / Telemetría)' }
    ],
    performanceMetrics: [
      { name: 'Disipación Térmica (Watts)', value: 98 },
      { name: 'Control de Ruido Acústico', value: 92 },
      { name: 'Velocidad de Flujo de Bomba', value: 95 },
      { name: 'Estética y Pantalla', value: 96 }
    ],
    defaultExplanation: `### Resumen Ejecutivo
El **CPU Cooler** es el sistema encargado de disipar el calor. Las CPU modernas generan una densidad térmica concentrada que supera los 250 Watts en una superficie menor que una estampilla. Sin refrigeración adecuada, una CPU se sobrecalentaría y se apagaría en segundos.

### Responsabilidades Arquitectónicas Clave
* **Placa Fría de Cobre con Microcanales**: Absorbe el calor directamente desde el *Integrated Heat Spreader* (IHS) de la CPU a través de pasta térmica de alta conductividad.
* **Circuito de Refrigerante Líquido**: Una bomba cerámica impulsa el líquido térmico a través de tubos mallados de baja permeabilidad hacia un radiador de aluminio.
* **Ventiladores de Alta Presión Estática**: Fuerzan el paso del aire frío a través de las aletas densas del radiador para expulsar el calor fuera del case.

### Por Qué Importa en el Rendimiento del Sistema
Las CPU ajustan dinámicamente sus frecuencias según el margen térmico disponible (*Precision Boost* / *Thermal Velocity Boost*). Mantener las temperaturas de la CPU por debajo de 70°C permite sostener frecuencias GHz más altas y lograr un funcionamiento más silencioso.`
  }
];

export const HARDWARE_PRESETS: HardwarePreset[] = [
  {
    id: 'gaming',
    name: 'Cyberpunk Gaming Ultra',
    tagline: 'Máximo Ray Tracing 4K y Dominio Competitivo a 240Hz',
    totalPowerWatts: 850,
    estPrice: '$3,899',
    components: {
      cpu: {
        name: 'Intel Core i9-14900KS',
        subtitle: '24 Cores / 3.2GHz - 6.2GHz Turbo',
        specs: [
          { label: 'Núcleos', value: '24 (8P + 16E)' },
          { label: 'Frecuencia Máx.', value: '6.2 GHz' }
        ]
      },
      gpu: {
        name: 'NVIDIA RTX 4090 24GB',
        subtitle: 'Ada Lovelace / 16,384 CUDA / DLSS 3.5',
        specs: [
          { label: 'VRAM', value: '24GB GDDR6X' },
          { label: 'Frecuencia', value: '2520 MHz' }
        ]
      },
      ram: {
        name: '32GB DDR5 6400MHz RGB',
        subtitle: 'Baja Latencia CL32 Dual Channel',
        specs: [
          { label: 'Capacidad', value: '32GB' },
          { label: 'Velocidad', value: '6400 MT/s' }
        ]
      },
      motherboard: {
        name: 'ASUS ROG Z790 Hero',
        subtitle: 'PCIe 5.0 / WiFi 6E / VRM de 20+1 Fases',
        specs: [
          { label: 'Chipset', value: 'Z790' },
          { label: 'Factor de Forma', value: 'ATX' }
        ]
      },
      psu: {
        name: '1000W 80+ Platinum ATX 3.0',
        subtitle: 'Cable Nativo 12VHPWR PCIe 5.0',
        specs: [
          { label: 'Potencia', value: '1000W' },
          { label: 'Eficiencia', value: '92%+' }
        ]
      },
      storage: {
        name: '2TB PCIe Gen5 NVMe SSD',
        subtitle: '12,400 MB/s de Lectura Secuencial',
        specs: [
          { label: 'Lectura', value: '12.4 GB/s' },
          { label: 'Tipo', value: 'M.2 Gen5' }
        ]
      },
      cooler: {
        name: '360mm AIO Liquid Cooler LCD',
        subtitle: '3x Ventiladores PWM RGB 120mm MagLev',
        specs: [
          { label: 'Radiador', value: '360mm' },
          { label: 'Pantalla', value: 'IPS LCD' }
        ]
      }
    }
  },
  {
    id: 'workstation',
    name: 'Estación de Trabajo IA y Renderizado 3D',
    tagline: 'Machine Learning Pesado, Edición de Video 8K y Cómputo CAD',
    totalPowerWatts: 1100,
    estPrice: '$5,299',
    components: {
      cpu: {
        name: 'AMD Ryzen Threadripper / 7950X',
        subtitle: '16 Cores / 32 Threads con 80MB de Caché',
        specs: [
          { label: 'Núcleos', value: '16 Cores / 32 Threads' },
          { label: 'Caché', value: '144MB L3' }
        ]
      },
      gpu: {
        name: 'NVIDIA RTX 4090 Studio Edition',
        subtitle: 'Doble Codificador AV1 / VRAM de 24GB de Alto Ancho de Banda',
        specs: [
          { label: 'VRAM', value: '24GB GDDR6X' },
          { label: 'Núcleos Tensor', value: '512 Cores' }
        ]
      },
      ram: {
        name: '64GB (2x32GB) DDR5 6000MHz ECC',
        subtitle: 'Código de Corrección de Errores / Baja Latencia',
        specs: [
          { label: 'Capacidad', value: '64GB' },
          { label: 'ECC', value: 'On-Die Soportado' }
        ]
      },
      motherboard: {
        name: 'MSI MEG X670E ACE',
        subtitle: 'Cuádruple Ranura PCIe 5.0 / LAN 10G / Doble USB4',
        specs: [
          { label: 'Chipset', value: 'X670E' },
          { label: 'Ranuras M.2', value: '6x NVMe' }
        ]
      },
      psu: {
        name: '1200W 80+ Titanium Modular',
        subtitle: 'Capacitores 100% Japoneses / Ventilador Silencioso',
        specs: [
          { label: 'Potencia', value: '1200W' },
          { label: 'Certificación', value: 'Titanium' }
        ]
      },
      storage: {
        name: '4TB PCIe 4.0 Pro NVMe SSD',
        subtitle: '7450 MB/s Lectura / 6900 MB/s Escritura',
        specs: [
          { label: 'Capacidad', value: '4TB' },
          { label: 'Velocidad', value: '7.4 GB/s' }
        ]
      },
      cooler: {
        name: 'Custom High-Flow 420mm AIO',
        subtitle: 'Ventiladores Industriales de 140mm de Alta Presión Estática',
        specs: [
          { label: 'Radiador', value: '420mm' },
          { label: 'Flujo de Aire', value: '98 CFM' }
        ]
      }
    }
  },
  {
    id: 'compact',
    name: 'Sci-Fi Minimalist SFF',
    tagline: 'Potencia en Factor de Forma Pequeño con Acústica Silenciosa',
    totalPowerWatts: 650,
    estPrice: '$2,199',
    components: {
      cpu: {
        name: 'AMD Ryzen 7 7800X3D',
        subtitle: '8 Cores / 3D V-Cache para Juegos',
        specs: [
          { label: 'Núcleos', value: '8 Cores / 16 Threads' },
          { label: 'Caché', value: '96MB 3D Cache' }
        ]
      },
      gpu: {
        name: 'NVIDIA RTX 4070 Ti Super 16GB',
        subtitle: 'Formato Compacto de 2.5 Ranuras / Alta Eficiencia',
        specs: [
          { label: 'VRAM', value: '16GB GDDR6X' },
          { label: 'Consumo', value: '285W' }
        ]
      },
      ram: {
        name: '32GB DDR5 6000MHz Perfil Bajo',
        subtitle: 'Altura Ultrabaja para cases SFF',
        specs: [
          { label: 'Capacidad', value: '32GB' },
          { label: 'Altura', value: '31mm' }
        ]
      },
      motherboard: {
        name: 'ASUS ROG Strix B650E-I Mini-ITX',
        subtitle: 'Placa ITX Compacta con Ranura PCIe 5.0',
        specs: [
          { label: 'Factor de Forma', value: 'Mini-ITX' },
          { label: 'WiFi', value: 'WiFi 6E' }
        ]
      },
      psu: {
        name: '750W SFX 80+ Gold Modular',
        subtitle: 'Factor de Forma SFX Compacto / Cables Mallados',
        specs: [
          { label: 'Potencia', value: '750W' },
          { label: 'Tipo', value: 'SFX' }
        ]
      },
      storage: {
        name: '2TB Gen4 M.2 SSD',
        subtitle: 'Almacenamiento NVMe Compacto de 7000 MB/s',
        specs: [
          { label: 'Lectura', value: '7000 MB/s' },
          { label: 'Tamaño', value: 'M.2 2280' }
        ]
      },
      cooler: {
        name: '240mm AIO Liquid Cooler',
        subtitle: 'Radiador Delgado de 240mm con Ventiladores de Bajo Ruido',
        specs: [
          { label: 'Tamaño', value: '240mm' },
          { label: 'Ruido', value: '<22 dBA' }
        ]
      }
    }
  }
];