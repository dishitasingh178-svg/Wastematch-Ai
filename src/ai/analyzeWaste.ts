/**
 * analyzeWaste — the single public entrypoint of the AI engine
 * ------------------------------------------------------------
 * Owner: Person 3 (AI)
 *
 * Person 2 (backend) and Person 1 (frontend) should ONLY need this one
 * function. Everything else in /src/ai is internal.
 *
 *   import { analyzeWaste } from '@/src/ai/analyzeWaste';
 *   const result = await analyzeWaste({ image, userProvided });
 *
 * Flow:
 *   1. Validate the image exists
 *   2. Try Gemini Vision (real AI)
 *   3. On any failure (no key, network, malformed JSON) → mock fallback
 *   4. Always return a valid AIAnalyzeResponse (never throws to caller)
 */

import { AIAnalyzeRequest, AIAnalyzeResponse } from './types';
import { callGeminiVision } from './geminiClient';
import { normalizeAIResponse } from './schema';
import { mockAnalyze } from './mockFallback';

export async function analyzeWaste(
  req: AIAnalyzeRequest
): Promise<AIAnalyzeResponse> {
  const started = Date.now();

  // 1. Basic input guard — if no valid image is provided, use structured fallback
  if (!req || !req.image || req.image.trim() === '') {
    const mock = mockAnalyze(req?.userProvided);
    mock.latencyMs = Date.now() - started;
    return mock;
  }

  // 2. If in browser environment, proxy request to Express server-side route
  if (typeof window !== 'undefined') {
    try {
      const response = await fetch('/api/analyze-waste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: req.image,
          userProvided: req.userProvided
        })
      });

      if (response.ok) {
        const json = await response.json();
        if (json && json.data) {
          const rawData = json.data;
          const result: AIAnalyzeResponse = {
            material: rawData.material || rawData.wasteType || 'PET Plastic Bottles',
            materialType: rawData.materialType || 'Industrial Stream',
            category: rawData.category || 'Post-Industrial Polymers',
            confidence: rawData.confidence || Math.round((rawData.confidenceScore || 0.9) * 100),
            composition: Array.isArray(rawData.composition) ? rawData.composition.join(', ') : (rawData.composition || 'Identified material'),
            contaminants: rawData.contaminants || [],
            contaminationLevel: rawData.contaminationLevel || 'low',
            recyclability: rawData.recyclability || 'High',
            potentialReuses: rawData.potentialReuses || rawData.suggestedReuses || [],
            hazards: rawData.hazards || [],
            processingRequirements: rawData.processingRequirements || [],
            compliance: rawData.compliance || {
              riskLevel: 'LOW RISK',
              classification: 'Classified Industrial Secondary Material',
              notes: 'Recyclable under standard industrial circularity frameworks.',
              requiredDocuments: ['Form 4 Manifest', 'E-Way Bill'],
              disclaimer: 'AI-assisted guidance only.'
            },
            summary: rawData.summary || 'Material visually analyzed and ready for matching.',
            source: rawData.source || 'gemini-vision',
            latencyMs: Date.now() - started
          };
          return result;
        }
      }
    } catch (browserFetchErr) {
      // eslint-disable-next-line no-console
      console.warn('[AI] Client fetch to /api/analyze-waste failed, falling back to local vision/mock.', browserFetchErr);
    }
  }

  // 3. Try real Gemini Vision (runs on server or direct Node runtime).
  try {
    const { text, latencyMs } = await callGeminiVision(
      req.image,
      req.userProvided
    );
    const normalized = normalizeAIResponse(text, {
      source: 'gemini-vision',
      latencyMs,
    });

    if (normalized) {
      return normalized;
    }

    // eslint-disable-next-line no-console
    console.warn('[AI] Gemini returned unparseable JSON — using fallback.');
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.warn(
      `[AI] Gemini call failed (${err?.code || err?.message || 'unknown'}) — using fallback.`
    );
  }

  // 4. Fallback — never break the demo.
  const mock = mockAnalyze(req.userProvided, req.image);
  mock.latencyMs = Date.now() - started;
  return mock;
}

// Re-export types for convenient one-line imports
export type { AIAnalyzeRequest, AIAnalyzeResponse } from './types';
