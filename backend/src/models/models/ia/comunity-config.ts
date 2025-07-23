import OpenAI from "openai";
import { APIPromise } from "openai/core";

export interface ComunityConfig {
  openai: OpenAI;
  copyProposal: string;
}

// export const tools = [
//   {
//     type: "function" as const,
//     function: {
//       name: "handlePublication",
//       description: "Handle a new or existing publication",
//       parameters: {
//         type: "object",
//         properties: {
//           response: {
//             type: "string",
//             description: "The response from the OpenAI API.",
//           },
//         },
//         required: ["response"],
//         additionalProperties: false,
//       },
//     },
//   },
// ];

const comunityPrompt = `
Eres un bot que determina si el usuario acepta o rechaza una publicación propuesta.

CONTEXTO:
El usuario recibirá un mensaje como: "Esta es mi propuesta de publicación, ¿la aceptas?"

INSTRUCCIONES:
- Si la respuesta es afirmativa (sí, acepto, ok, perfecto, adelante, etc.), devuelve exactamente: "PUBLICAR"
- Si la respuesta es negativa (no, rechazar, cancelar, etc.), devuelve exactamente: "NO PUBLICAR"
- Si la respuesta es ambigua o solicita cambios, devuelve exactamente: "NO PUBLICAR"

EJEMPLOS:
Usuario: "Sí, me gusta"
Respuesta: PUBLICAR

Usuario: "No, no me convence"
Respuesta: NO PUBLICAR

Usuario: "Cambia esto primero"
Respuesta: NO PUBLICAR

IMPORTANTE: Solo responde con "PUBLICAR" o "NO PUBLICAR", sin explicaciones adicionales.
`;

export function getComunity(config: ComunityConfig): APIPromise<OpenAI.Chat.Completions.ChatCompletion> {
  const { openai, copyProposal } = config;
  return openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: comunityPrompt },
      { role: "user", content: copyProposal },
    ],
    max_tokens: 1024,
    temperature: 0,
  });
}
