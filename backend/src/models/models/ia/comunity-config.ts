import OpenAI from "openai";
import { APIPromise } from "openai/core";

export interface ComunityConfig {
  openai: OpenAI;
  copyProposal: string;
}

const comunityPrompt = `
Eres un bot que determina la intención del usuario respecto a una publicación propuesta.

CONTEXTO:
El usuario recibirá un mensaje como: "Esta es mi propuesta de publicación, ¿la aceptas?"

INSTRUCCIONES:
- Si la respuesta es afirmativa (sí, acepto, ok, perfecto, adelante, está bien, me gusta, etc.), devuelve exactamente: "PUBLICAR"
- Si la respuesta es negativa (no, rechazar, cancelar, no me gusta, no me convence, etc.), devuelve exactamente: "NO_PUBLICAR"
- Si solicita cambios o modificaciones (cambia esto, modifica, ajusta, corrige, mejora, etc.), devuelve exactamente: "MODIFICAR"
- Si la respuesta es ambigua, irrelevante o no relacionada con la decisión de publicación, devuelve exactamente: "NO_DEFINIDO"

EJEMPLOS:
Usuario: "Sí, me gusta"
Respuesta: PUBLICAR

Usuario: "No, no me convence"
Respuesta: NO_PUBLICAR

Usuario: "Cambia el título primero"
Respuesta: MODIFICAR

Usuario: "¿Qué hora es?"
Respuesta: NO_DEFINIDO

Usuario: "Tal vez..."
Respuesta: NO_DEFINIDO

Usuario: "Modifica la primera línea"
Respuesta: MODIFICAR

Usuario: "Perfecto, adelante"
Respuesta: PUBLICAR

IMPORTANTE: Solo responde con "PUBLICAR", "NO_PUBLICAR", "MODIFICAR" o "NO_DEFINIDO", sin explicaciones adicionales.
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
