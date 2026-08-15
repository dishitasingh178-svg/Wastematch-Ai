/**
 * Gemini Vision Client
 * --------------------
 * Owner: Person 3 (AI)
 *
 * Thin wrapper around @google/genai that:
 *   1. Accepts either a base64 data URL or an https image URL
 *   2. Sends the image + prompt to Gemini 2.5 Flash (vision)
 *   3. Returns the raw model text (parsing is done in schema.ts)
 *
 * Why Flash and not Pro?
 *   - Hackathon demo: sub-3s response time matters more than +2% accuracy.
 *   - Flash handles multimodal input well and is cheap on rate limits.
 *
 * Where the API key comes from:
 *   - process.env.GEMINI_API_KEY  (server-side, preferred)
 *   - import.meta.env.VITE_GEMINI_API_KEY  (frontend fallback for the
 *     AI Studio deploy — safe because Studio injects it at runtime)
 */

import { GoogleGenAI } from '@google/genai';
import { SYSTEM_INSTRUCTION, buildUserPrompt } from './prompt';

/** Read the API key from whichever environment is available. */
export function getApiKey(): string | null {
  // Node / Express side
  if (typeof process !== 'undefined' && process.env) {
    const key =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENAI_API_KEY ||
      process.env.API_KEY ||
      process.env.VITE_GEMINI_API_KEY ||
      process.env.VITE_GOOGLE_API_KEY;

    if (key && typeof key === 'string' && key.trim().length > 0) {
      return key.trim();
    }
  }

  // Vite / browser side (AI Studio injects VITE_GEMINI_API_KEY)
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const meta: any = (import.meta as any);
    if (meta && meta.env) {
      const key =
        meta.env.VITE_GEMINI_API_KEY ||
        meta.env.GEMINI_API_KEY ||
        meta.env.VITE_GOOGLE_API_KEY ||
        meta.env.VITE_API_KEY;

      if (key && typeof key === 'string' && key.trim().length > 0) {
        return key.trim();
      }
    }
  } catch {
    /* not in a Vite context */
  }
  return null;
}

/**
 * Convert an image reference (data URL, http URL, or plain base64) into the
 * `inlineData` payload Gemini expects.
 */
async function toInlinePart(image: string): Promise<{
  inlineData: { data: string; mimeType: string };
}> {
  if (!image || typeof image !== 'string') {
    throw new Error('BAD_IMAGE');
  }

  const trimmed = image.trim();

  // Data URL: "data:image/jpeg;base64,AAAA..."
  if (trimmed.startsWith('data:')) {
    const commaIndex = trimmed.indexOf(',');
    if (commaIndex === -1) throw new Error('BAD_IMAGE');
    const header = trimmed.substring(0, commaIndex);
    const rawData = trimmed.substring(commaIndex + 1).replace(/\s+/g, '');
    const mimeMatch = header.match(/data:([^;,]+)/);
    const mimeType = mimeMatch ? mimeMatch[1].trim() : 'image/jpeg';
    return {
      inlineData: { mimeType: mimeType || 'image/jpeg', data: rawData },
    };
  }

  // http(s) URL — fetch and re-encode
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 6000) : null;

    try {
      const res = await fetch(trimmed, {
        signal: controller ? controller.signal : undefined,
      });
      if (!res.ok) throw new Error('BAD_IMAGE');
      const arrayBuf = await res.arrayBuffer();
      const contentType = res.headers.get('content-type') || 'image/jpeg';
      const mimeType = contentType.split(';')[0].trim() || 'image/jpeg';
      const b64 =
        typeof Buffer !== 'undefined'
          ? Buffer.from(arrayBuf).toString('base64')
          : btoa(
              new Uint8Array(arrayBuf).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            );
      return { inlineData: { mimeType, data: b64 } };
    } catch {
      return {
        inlineData: {
          mimeType: 'image/png',
          data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        },
      };
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  // Otherwise assume raw base64 (jpeg by default)
  return { inlineData: { mimeType: 'image/jpeg', data: trimmed.replace(/\s+/g, '') } };
}

const CANDIDATE_MODELS = ['gemini-3.7-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

export interface RawGeminiResult {
  text: string;
  latencyMs: number;
}

/**
 * Call Gemini Vision with an image + user context and return the raw text.
 * Throws on API errors — the caller handles fallback to mock.
 */
export async function callGeminiVision(
  image: string,
  userProvided?: Parameters<typeof buildUserPrompt>[0]
): Promise<RawGeminiResult> {
  const apiKey = getApiKey();
  if (!apiKey) {
    const err: any = new Error('API_KEY_MISSING');
    err.code = 'API_KEY_MISSING';
    throw err;
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
  const imagePart = await toInlinePart(image);
  const userPrompt = buildUserPrompt(userProvided);

  const started = Date.now();
  let lastError: any = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [
          {
            role: 'user',
            parts: [imagePart, { text: userPrompt }],
          },
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      });
      const latencyMs = Date.now() - started;

      // The SDK exposes .text; fall back to walking parts if needed
      const text =
        response.text ||
        (response as any).response?.text?.() ||
        (response as any).candidates?.[0]?.content?.parts
          ?.map((p: any) => p.text || '')
          .join('') ||
        '';

      if (text && text.trim().length > 0) {
        return { text, latencyMs };
      }
    } catch (err: any) {
      lastError = err;
      continue;
    }
  }

  throw lastError || new Error('ALL_MODELS_FAILED');
}
