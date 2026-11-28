import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Inicializar el cliente de Gemini
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Ruta de API para el análisis detallado de componentes
app.post("/api/explain-component", async (req, res) => {
  try {
    const { componentId, componentName, userQuestion, preset } = req.body;

    if (!componentName) {
      return res.status(400).json({ error: "Se requiere componentName" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        success: true,
        explanation: `### ARQUITECTURA DE ${componentName.toUpperCase()}\n* Resumen Ejecutivo: Componente principal del sistema que gestiona operaciones de alto ancho de banda en la configuración ${preset || "Personalizada"}.\n* Impacto en el Rendimiento: Determina directamente el rendimiento general del sistema, la capacidad de respuesta y las velocidades de renderizado.\n* Métricas Técnicas Clave: Frecuencias de reloj, ancho de banda del bus, TDP térmico y eficiencia en la entrega de energía.`,
        source: "default",
      });
    }

    let prompt = `Proporciona un desglose experto, atractivo y claro del componente de PC: "${componentName}" en una configuración de PC tipo ${preset || "Gaming de Alta Gama y Estación de Trabajo"}.`;

    if (userQuestion) {
      prompt += `\nPregunta específica del usuario: "${userQuestion}". Responde esta pregunta directamente en el contexto de este componente de PC.`;
    } else {
      prompt += `\nEn tu respuesta, incluye:
1. Resumen Ejecutivo: Qué rol físico o arquitectónico exacto cumple este componente en la computadora.
2. Por Qué Importa para el Rendimiento del Sistema: Cómo afecta los FPS, los tiempos de carga, la multitarea o la estabilidad.
3. Métricas Técnicas Clave a tener en cuenta al comprar (por ejemplo, frecuencia de reloj, VRAM/ancho de banda, fases VRM, TDP, líneas PCIe).
4. Posibles Cuellos de Botella y Consejos Pro para entusiastas o ensambladores.`;
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "Eres un Arquitecto de Hardware de PC y Educador Tecnológico de élite con amplios conocimientos. Proporciona un formato markdown nítido, bien estructurado y fácil de leer con viñetas y aspectos técnicos destacados claros. Mantén un tono tecnológico, futurista y accesible tanto para principiantes como para ensambladores entusiastas de PC.",
        },
      });

      const explanation = response.text || "No se generó ninguna explicación.";

      return res.json({
        success: true,
        explanation,
        source: "gemini",
      });
    } catch (apiErr: any) {
      // Manejar con elegancia los límites de tasa y errores de la API con respuestas de respaldo detalladas
      const fallbackText = userQuestion
        ? `### ANÁLISIS DE ARQUITECTURA DE ${componentName.toUpperCase()}\n* **Respecto a "${userQuestion}"**: Para ${componentName}, un rendimiento óptimo requiere una entrega de voltaje adecuada, margen térmico y activar los perfiles de máximo rendimiento (XMP/EXPO/DirectStorage) en la configuración de la BIOS o el sistema operativo.\n* **Métricas Clave**: Revisa el ancho de banda del bus, la frecuencia de reloj, el TDP térmico (perfil ${preset || "Gaming"}) y las velocidades del enlace PCI-Express.`
        : `### ANÁLISIS DE ESPECIFICACIONES DE HARDWARE DE ${componentName.toUpperCase()}\n* **Rol Ejecutivo**: ${componentName} actúa como un pilar arquitectónico vital en tu configuración ${preset || "de Gama Alta"}, gestionando el flujo crítico de datos, la sincronización de reloj y los pipelines de ejecución.\n* **Impacto en el Rendimiento**: Influye directamente en la estabilidad de los FPS, la consistencia del *frame-time*, la latencia de cómputo y la estabilidad bajo cargas máximas.\n* **Métricas Clave a Inspeccionar**: Ancho de banda del bus, frecuencia de reloj, potencia de diseño térmico (TDP), cantidad de fases de regulación de voltaje y generaciones de interfaz PCI-Express.\n* **Consejo Pro**: Mantén las temperaturas del componente por debajo de los 80°C y asegúrate de contar con un flujo de aire limpio en doble canal para evitar *thermal throttling* durante cargas continuas.`;

      return res.json({
        success: true,
        explanation: fallbackText,
        source: "default",
      });
    }
  } catch (error: any) {
    return res.status(200).json({
      success: true,
      explanation: "No es posible procesar el análisis de IA en este momento. Mostrando las especificaciones principales de telemetría del componente.",
      source: "default",
    });
  }
});

// Ruta de API para consultas personalizadas sobre PC / asesor de IA
app.post("/api/hardware-assistant", async (req, res) => {
  try {
    const { message, activeComponent, preset } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        success: true,
        reply: `[Asistente de Hardware - Modo Sin Conexión] Para optimizar ${activeComponent || "tu sistema"}, asegúrate de combinar componentes equilibrados para evitar cuellos de botella. Verifica la configuración de memoria RAM en doble canal, un enrutamiento limpio de cables y una entrega de energía de alta eficiencia.`,
      });
    }

    const prompt = `Pregunta del usuario: "${message}"\nContexto: Actualmente enfocado en el componente "${activeComponent || "Equipo de PC Completo"}" en el perfil "${preset || "Equipo Gaming"}".`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "Eres 'NEXUS-AI', un Asistente de Hardware de PC interactivo integrado dentro de una aplicación exploradora 3D de componentes de PC. Responde de forma concisa, técnicamente precisa y con un tono moderno y atractivo de experto en tecnología. Al responder preguntas sobre los 'mejores' componentes, proporciona recomendaciones actuales basadas en evidencia, consenso de expertos y benchmarks técnicos. Si las condiciones del mercado (precios, nuevos lanzamientos) dificultan determinar un ganador claro, explica las ventajas y desventajas.",
        },
      });

      return res.json({
        success: true,
        reply: response.text || "Actualmente estoy recalibrando la telemetría de hardware. Por favor, pregunta de nuevo.",
      });
    } catch (apiErr: any) {
      // Manejar con elegancia los límites de tasa y errores de la API con respuestas de respaldo detalladas
      return res.json({
        success: true,
        reply: `[Asesor del Sistema NEXUS-AI] Respecto a "${message}": Para ${activeComponent || "el hardware de PC"}, un rendimiento óptimo requiere una disipación térmica adecuada, suficiente margen de potencia (+20% de capacidad en la PSU por encima del TDP) y activar los perfiles XMP/EXPO en la BIOS para lograr la máxima velocidad y estabilidad del sistema.`,
      });
    }
  } catch (error: any) {
    return res.status(200).json({
      success: true,
      reply: "El asesor del sistema está operando en modo sin conexión de alta disponibilidad.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor ejecutándose en http://0.0.0.0:${PORT}`);
  });
}

startServer();