import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Zap,
  Activity,
  Send,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Flame,
  Info,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Package
} from 'lucide-react';

import {
  PCComponentData,
  BuildPreset,
  InventoryComponent,
  ComponentId
} from '../../types';

import { useInventory } from '../../hooks/useInventory';
import { playSelectSound } from '../../utils/audio';

import {
  validateCpuMotherboard,
  validateRamMotherboard,
  validatePowerSupply
} from '../../utils/compatibility';

interface ComponentSidePanelProps {
  component: PCComponentData | null;
  onClose: () => void;
  activePreset: BuildPreset;
  onNavigateNext: () => void;
  onNavigatePrev: () => void;
  selectedProducts: Record<ComponentId, InventoryComponent | null>;
  onProductSelect: (product: InventoryComponent) => void;
}

export const ComponentSidePanel: React.FC<ComponentSidePanelProps> = ({
  component,
  onClose,
  activePreset,
  onNavigateNext,
  onNavigatePrev,
  selectedProducts,
  onProductSelect
}) => {
  const [explanation, setExplanation] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState<boolean>(false);
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [aiSource, setAiSource] = useState<'default' | 'gemini'>('default');
  const [imageError, setImageError] = useState<boolean>(false);
  const [selectorOpen, setSelectorOpen] = useState<boolean>(false);

  const { items: availableProducts, loading: loadingProducts } = useInventory(
    component?.id || null
  );

  const currentProduct = component
    ? selectedProducts[component.id]
    : null;

  const cpuCompatibilityResults = validateCpuMotherboard(
    selectedProducts.cpu ?? undefined,
    selectedProducts.motherboard ?? undefined
  );

  const ramCompatibilityResults = validateRamMotherboard(
    selectedProducts.ram ?? undefined,
    selectedProducts.motherboard ?? undefined
  );

  const powerSupplyCompatibilityResults = validatePowerSupply(
    [
      selectedProducts.cpu,
      selectedProducts.gpu,
      selectedProducts.ram,
      selectedProducts.motherboard,
      selectedProducts.storage,
      selectedProducts.cooler
    ],
    selectedProducts.psu ?? undefined
  );

  const compatibilityResults = [
    ...cpuCompatibilityResults,
    ...ramCompatibilityResults,
    ...powerSupplyCompatibilityResults
  ];

  useEffect(() => {
    setCustomQuestion('');
    setSelectorOpen(false);
    setImageError(false);
    setExplanation('');
    setAiSource('default');
  }, [component?.id]);

  const fetchGeminiExplanation = async (
    product: InventoryComponent,
    question?: string
  ) => {
    try {
      setLoadingAI(true);

      const res = await fetch('/api/explain-component', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          componentId: product.componentId,
          componentName: product.name,
          preset: activePreset,
          userQuestion: question,
          specifications: product.detailedSpecs
        })
      });

      const data = await res.json();

      if (data.success && data.explanation) {
        setExplanation(data.explanation);
        setAiSource(data.source || 'gemini');
      }
    } catch (error) {
      console.error('Error al obtener la explicación de Gemini:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  useEffect(() => {
    if (!currentProduct) {
      setExplanation('');
      setAiSource('default');
      return;
    }

    setExplanation(currentProduct.defaultExplanation);
    setAiSource('default');
    setCustomQuestion('');

    fetchGeminiExplanation(currentProduct);
  }, [currentProduct, activePreset]);

  const handleProductChange = (product: InventoryComponent) => {
    playSelectSound();
    onProductSelect(product);
    setImageError(false);
    setSelectorOpen(false);
  };

  const handleCustomQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim() || !currentProduct) return;

    playSelectSound();
    fetchGeminiExplanation(currentProduct, customQuestion);
    setCustomQuestion('');
  };

  const formatText = (txt: string) => {
    const parts = txt.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-extrabold text-slate-950">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  if (!component) return null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className="fixed inset-y-0 right-0 z-30 w-full sm:w-[380px] md:w-[420px] p-3 pointer-events-auto flex flex-col justify-between opacity-95 hover:opacity-100 transition-opacity duration-300"
    >
      <div className="h-full glass-panel rounded-2xl flex flex-col overflow-hidden transition-all duration-300 shadow-2xl border border-slate-300/80">
        <div className="p-3 px-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                playSelectSound();
                onNavigatePrev();
              }}
              className="p-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 transition-all cursor-pointer"
              title="Componente anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                playSelectSound();
                onNavigateNext();
              }}
              className="p-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 transition-all cursor-pointer"
              title="Siguiente componente"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <span className="text-[10px] uppercase tracking-widest text-slate-900 font-mono font-extrabold ml-1.5">
              {component.category}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              playSelectSound();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 hover:text-black transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white/95">
          {!currentProduct ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="p-4 bg-slate-100 rounded-2xl">
                <Package className="w-12 h-12 text-slate-500" />
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-950">
                  Selecciona un componente
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-[260px] mx-auto">
                  Todavía no has elegido un producto para esta categoría. Explora el inventario y selecciona el componente que deseas incorporar a tu PC.
                </p>
              </div>

              <div className="w-full space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-500 text-left">
                  Productos disponibles ({availableProducts.length})
                </p>

                {loadingProducts ? (
                  <div className="py-4 flex items-center justify-center gap-2 text-xs font-mono text-slate-500">
                    <Loader2 className="w-4 h-4 animate-spin" /> Cargando catálogo...
                  </div>
                ) : (
                  <div className="space-y-2">
                    {availableProducts.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleProductChange(product)}
                        className="w-full p-3 flex items-center gap-3 text-left bg-white border border-slate-200 hover:border-slate-500 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
                      >
                        <div className="p-2 bg-slate-100 rounded-lg">
                          <Package className="w-4 h-4 text-slate-700" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {product.subtitle}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-600">
                    Seleccionar componente
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {availableProducts.length} disponibles
                  </span>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSelectorOpen(!selectorOpen)}
                    className="w-full flex items-center justify-between gap-3 p-3 bg-white border border-slate-300 hover:border-slate-500 rounded-xl transition-all text-left cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Package className="w-5 h-5 text-slate-800" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-950 truncate">
                          {currentProduct.name}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {currentProduct.subtitle}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-600 transition-transform ${
                        selectorOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {selectorOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden max-h-64 overflow-y-auto">
                      <div className="px-3 py-2 bg-slate-50 border-b border-slate-200">
                        <p className="text-[10px] uppercase tracking-widest font-mono font-bold text-slate-500">
                          Inventario disponible
                        </p>
                      </div>
                      {availableProducts.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => handleProductChange(product)}
                          className={`w-full p-3 flex items-center justify-between gap-2 text-left transition-colors border-b border-slate-100 last:border-0 ${
                            currentProduct.id === product.id
                              ? 'bg-slate-100'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">
                              {product.subtitle}
                            </p>
                          </div>
                          {currentProduct.id === product.id && (
                            <CheckCircle2 className="w-4 h-4 text-slate-900 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="inline-block px-2.5 py-1 rounded bg-black text-white text-[10px] font-mono font-bold tracking-widest uppercase mb-3">
                  ESPECIFICACIÓN DE {component.category.toUpperCase()}
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
                  {!imageError ? (
                    <img
                      src={currentProduct.imageUrl}
                      alt={currentProduct.name}
                      onError={() => setImageError(true)}
                      className="w-full h-40 object-contain"
                    />
                  ) : (
                    <div className="w-full h-40 flex flex-col items-center justify-center gap-2 text-slate-400">
                      <Package className="w-12 h-12" />
                      <span className="text-[10px] font-mono">
                        Imagen no disponible
                      </span>
                    </div>
                  )}
                </div>

                <h2 className="text-2xl font-black tracking-tight text-slate-950 mb-1">
                  {currentProduct.name}
                </h2>
                <p className="text-xs text-slate-600 italic">
                  {currentProduct.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-950 text-white">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-mono font-bold">
                      Consumo máx.
                    </p>
                    <p className="text-base font-mono text-slate-950 font-black">
                      {currentProduct.powerDrawWatts}W
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-950 text-white">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-mono font-bold">
                      Temperatura
                    </p>
                    <p className="text-base font-mono text-slate-950 font-black">
                      {currentProduct.thermalTemp}°C
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h3 className="text-xs font-mono font-bold text-slate-950 uppercase mb-3 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-black" />
                  Especificaciones técnicas
                </h3>

                <div className="space-y-2">
                  {currentProduct.detailedSpecs.map((spec, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between gap-3 py-1.5 px-3 rounded-lg text-xs ${
                        spec.highlight
                          ? 'bg-slate-200 text-slate-950 font-semibold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-slate-600 font-medium">
                        {spec.label}
                      </span>
                      <span className="font-mono font-bold text-slate-950 text-right">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-950 uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Compatibilidad y recomendaciones
                </h3>

                {compatibilityResults.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600">
                      Resultado de compatibilidad del sistema
                    </h4>

                    {compatibilityResults.map((result, idx) => {
                      const statusStyles = {
                        compatible: {
                          container: 'bg-green-50 border-green-200',
                          icon: 'text-green-600',
                          title: 'text-green-800',
                          message: 'text-green-700'
                        },
                        warning: {
                          container: 'bg-amber-50 border-amber-200',
                          icon: 'text-amber-600',
                          title: 'text-amber-800',
                          message: 'text-amber-700'
                        },
                        incompatible: {
                          container: 'bg-red-50 border-red-200',
                          icon: 'text-red-600',
                          title: 'text-red-800',
                          message: 'text-red-700'
                        }
                      };

                      const styles = statusStyles[result.status];

                      return (
                        <div
                          key={idx}
                          className={`border rounded-xl p-3 space-y-2 ${styles.container}`}
                        >
                          <div className="flex items-center gap-2">
                            {result.status === 'compatible' ? (
                              <CheckCircle2 className={`w-4 h-4 shrink-0 ${styles.icon}`} />
                            ) : (
                              <AlertCircle className={`w-4 h-4 shrink-0 ${styles.icon}`} />
                            )}

                            <h4 className={`text-xs font-bold ${styles.title}`}>
                              {result.title}
                            </h4>
                          </div>

                          <p className={`text-xs leading-relaxed ${styles.message}`}>
                            {result.message}
                          </p>

                          <div className="flex flex-wrap gap-1">
                            {result.components.map((name, componentIdx) => (
                              <span
                                key={componentIdx}
                                className="text-[9px] px-2 py-1 rounded-md bg-white/70 border border-black/10 text-slate-700 font-medium"
                              >
                                {name}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="space-y-3">
                  {currentProduct.compatibilityNotes.map((note, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-slate-700"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 text-slate-500 mt-0.5" />
                      <span className="leading-relaxed">
                        {note}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-950 border-b border-slate-200 pb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-black" />
                  Métricas de análisis funcional
                </h3>

                {currentProduct.performanceMetrics.map((metric, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-700">
                        {metric.name}
                      </span>
                      <span className="text-slate-950 font-mono font-bold">
                        {metric.value}%
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-950 transition-all duration-700"
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <h3 className="text-xs font-mono font-bold text-slate-950 uppercase tracking-wider">
                      Análisis de arquitectura Gemini
                    </h3>
                  </div>

                  <span className="text-[10px] bg-slate-200 text-slate-800 font-mono px-2 py-0.5 rounded border border-slate-300 font-semibold">
                    {aiSource === 'gemini' ? 'IA en tiempo real' : 'Datos locales'}
                  </span>
                </div>

                {loadingAI ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-700 text-xs font-mono">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-950" />
                    <span>
                      Consultando red neuronal de hardware Gemini...
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-700 leading-relaxed space-y-2">
                    {explanation.split('\n').map((line, idx) => {
                      if (line.startsWith('### ')) {
                        return (
                          <h4
                            key={idx}
                            className="text-xs font-bold text-slate-950 mt-3 mb-1 uppercase font-mono"
                          >
                            {formatText(line.replace('### ', ''))}
                          </h4>
                        );
                      }

                      if (line.startsWith('* ')) {
                        return (
                          <li
                            key={idx}
                            className="ml-4 list-disc text-slate-700"
                          >
                            {formatText(line.replace('* ', ''))}
                          </li>
                        );
                      }

                      return line ? (
                        <p key={idx}>
                          {formatText(line)}
                        </p>
                      ) : null;
                    })}
                  </div>
                )}

                <form
                  onSubmit={handleCustomQuestionSubmit}
                  className="pt-2 flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder={`Pregunta a Gemini sobre ${currentProduct.name}...`}
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black font-sans"
                  />

                  <button
                    type="submit"
                    disabled={loadingAI || !customQuestion.trim()}
                    className="p-2.5 rounded-xl bg-slate-950 text-white font-bold hover:bg-slate-800 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                  </button>
                </form>
              </div>

              <button
                onClick={() => {
                  playSelectSound();
                  fetchGeminiExplanation(
                    currentProduct,
                    '¿Cómo optimizo este componente en el armado de mi sistema?'
                  );
                }}
                disabled={loadingAI}
                className="w-full py-3.5 bg-black text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-slate-800 transition-colors shadow-md cursor-pointer disabled:opacity-50"
              >
                Optimizar ajustes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};