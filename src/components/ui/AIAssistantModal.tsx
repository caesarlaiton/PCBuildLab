import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, Loader2, Cpu, CheckCircle } from 'lucide-react';
import { ComponentId, BuildPreset } from '../../types';
import { playSelectSound } from '../../utils/audio';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeComponentId: ComponentId | null;
  activePreset: BuildPreset;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  activeComponentId,
  activePreset,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `¡Saludos! Soy NEXUS-AI, tu especialista interactivo en hardware de PC. Pregúntame lo que quieras sobre compatibilidad de componentes, cuellos de botella, cálculo de fuente de poder (PSU) o arquitectura 3D.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    playSelectSound();
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/hardware-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          activeComponent: activeComponentId,
          preset: activePreset,
        }),
      });
      const data = await res.json();
      if (data.success && data.reply) {
        setMessages((prev) => [...prev, { sender: 'ai', text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'ai', text: 'Se produjo una interrupción en la señal. Por favor, inténtalo de nuevo.' },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Modo sin conexión: asegúrate de que GEMINI_API_KEY esté configurada para obtener inteligencia de hardware en tiempo real.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    '¿Cómo calculo el wattage necesario para la PSU?',
    '¿La CPU hará cuello de botella a la RTX 4090 jugando en 1440p?',
    '¿Cuál es la diferencia entre memoria RAM DDR4 y DDR5?',
    '¿Por qué es tan importante la refrigeración del VRM en la motherboard?',
  ];

  return (
    <div 
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      onPointerDown={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md pointer-events-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className="w-full max-w-xl glass-panel rounded-2xl flex flex-col h-[600px] max-h-[85vh] overflow-hidden border border-slate-300 shadow-2xl"
      >
        {/* Encabezado */}
        <div className="p-4 px-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-950 text-white shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-950 font-mono tracking-widest uppercase flex items-center gap-2">
                NEXUS-AI <span className="text-slate-600">ASESOR DE HARDWARE</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                Inteligencia del núcleo del sistema v4.0.2
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playSelectSound();
              onClose();
            }}
            className="p-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Historial de mensajes del chat */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-white/95">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-slate-950 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`max-w-[82%] p-3.5 rounded-xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-slate-950 text-white font-semibold shadow-md'
                    : 'bg-slate-50 border border-slate-200 text-slate-900 font-normal'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-900 text-xs font-mono p-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analizando arquitectura de hardware...</span>
            </div>
          )}
        </div>

        {/* Sugerencias rápidas */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 overflow-x-auto flex gap-2 custom-scrollbar">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInput(q);
              }}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 border border-slate-300 text-[11px] text-slate-800 whitespace-nowrap cursor-pointer transition-all font-medium"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Barra de entrada */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-white flex gap-2">
          <input
            type="text"
            placeholder="Pregunta lo que quieras sobre armado de PC, especificaciones o componentes 3D..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black font-sans"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-2.5 rounded-xl bg-slate-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Enviar</span>
          </button>
        </form>
      </div>
    </div>
  );
};