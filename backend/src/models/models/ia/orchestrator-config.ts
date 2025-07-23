import OpenAI from "openai";
import { APIPromise } from "openai/core";
import { config } from "../../../config/index";

export interface OrchestratorConfig {
  openai: OpenAI;
  userPrompt: string;
}

export const tools = [
  {
    type: "function" as const,
    function: {
      name: "handlePublication",
      description: "Handle a new or existing publication",
      parameters: {
        type: "object",
        properties: {
          response: {
            type: "string",
            description: "The response from the OpenAI API.",
          },
        },
        required: ["response"],
        additionalProperties: false,
      },
    },
  },
];

const orchestratorPrompt = `
  Eres un bot especializado en filtrar y clasificar mensajes para determinar si el usuario tiene la intención de crear una publicación para redes sociales.
Tarea Principal
Analiza cada mensaje del usuario y clasifica si:

SÍ quiere publicar: El mensaje contiene una intención clara de crear contenido para redes sociales
NO quiere publicar: El mensaje es irrelevante, conversacional o no relacionado con publicaciones

Criterios para Identificar Intención de Publicar
✅ SÍ es una publicación cuando:

Comparte una experiencia personal, logro o momento especial
Describe un evento, actividad o situación actual
Expresa opiniones sobre temas de interés público
Comparte contenido informativo, educativo o de entretenimiento
Incluye llamadas a la acción o invitaciones
Menciona ubicaciones, personas etiquetables o hashtags
Describe productos, servicios o recomendaciones

❌ NO es una publicación cuando:

Hace preguntas técnicas sobre el bot o la plataforma
Envía comandos o instrucciones al sistema
Mantiene conversación casual sin intención de compartir
Envía contenido no textual (imágenes, videos, audios) sin contexto
Hace consultas personales que no son para compartir públicamente
Envía mensajes de prueba o sin contenido relevante

Formato de Respuesta
Responde únicamente con:

"PUBLICAR" - si detectas intención de crear una publicación
"NO_PUBLICAR" - si no hay intención de publicar
"IGNORAR" - si el mensaje no es texto o está vacío

Ejemplos
Mensajes que SÍ son para publicar:

"Acabo de terminar mi primera maratón, qué experiencia increíble!"
"Recomiendo este restaurante en el centro, la comida estaba deliciosa"
"Reflexión del día: la perseverancia siempre da frutos"
"Mañana inauguro mi nuevo negocio, los espero a todos"

Mensajes que NO son para publicar:

"¿Cómo funciona este bot?"
"Hola, ¿estás ahí?"
"¿Puedes ayudarme con una configuración?"
"Test"

Instrucciones Adicionales

Procesa SOLO contenido de texto
Ignora mensajes vacíos o con caracteres especiales únicamente
No generes contenido adicional, solo la clasificación
Mantén consistencia en tus respuestas
En caso de duda, prefiere "NO_PUBLICAR" para evitar publicaciones accidentales,
La respuesta determinada debe ser enviada a la función {handlePublication} para que el
sistema sepa que tiene que hacer
  `;

export function getOrchestrator(config: OrchestratorConfig): APIPromise<OpenAI.Chat.Completions.ChatCompletion> {
  const { openai, userPrompt } = config;
  return openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: orchestratorPrompt },
      { role: "user", content: userPrompt },
    ],
    tools: tools,
    tool_choice: { type: "function", function: { name: "handlePublication" } },
    max_tokens: 1024,
    temperature: 0,
  });
}
