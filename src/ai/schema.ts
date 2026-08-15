/**
 * AI Response Schema Validation
 * -----------------------------
 * Owner: Person 3 (AI)
 *
 * Gemini sometimes returns almost-JSON with markdown fences, trailing commas,
 * or missing fields. This module:
 *   1. Extracts a clean JSON object from raw model text
 *   2. Validates that every required field exists and has the right type
 *   3. Fills in safe defaults for missing optional fields
 *
 * Rule of thumb: NEVER let malformed AI output crash the demo.
 */

import { AIAnalyzeResponse } from './types';

const DISCLAIMER =
  'This is AI-assisted guidance, not legal advice. Verify with CPCB / State Pollution Control Board before dispatch.';

/** Strip ```json fences and grab the first {...} block from raw model text. */
export function extractJsonBlock(raw: string): string {
  if (!raw) return '';
  // Remove common markdown code fences
  let cleaned = raw
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  // Find the first '{' and matching last '}'
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    return '';
  }
  return cleaned.slice(firstBrace, lastBrace + 1);
}

/** Coerce anything into a string array of trimmed non-empty strings. */
function toStringArray(v: unknown): string[] {
  if (!v) return [];
  if (Array.isArray(v)) {
    return v
      .map((x) => (typeof x === 'string' ? x.trim() : String(x)))
      .filter((s) => s && s.length > 0);
  }
  if (typeof v === 'string') {
    return v
      .split(/[,;\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function clampConfidence(n: unknown): number {
  const num = typeof n === 'number' ? n : parseFloat(String(n));
  if (!Number.isFinite(num)) return 70;
  // Accept both 0-1 and 0-100 scales
  const scaled = num <= 1 ? num * 100 : num;
  return Math.max(0, Math.min(100, Math.round(scaled)));
}

function pickEnum<T extends string>(
  v: unknown,
  allowed: readonly T[],
  fallback: T
): T {
  const s = String(v || '').trim();
  const hit = allowed.find((a) => a.toLowerCase() === s.toLowerCase());
  return (hit as T) ?? fallback;
}

/**
 * Parse the raw string returned by Gemini and normalize it into a strict
 * AIAnalyzeResponse. Missing fields are filled with reasonable defaults so
 * the UI never receives `undefined`.
 */
export function normalizeAIResponse(
  raw: string,
  meta: { source: AIAnalyzeResponse['source']; latencyMs: number }
): AIAnalyzeResponse | null {
  const block = extractJsonBlock(raw);
  if (!block) return null;

  let parsed: any;
  try {
    parsed = JSON.parse(block);
  } catch {
    // Try one more time after stripping trailing commas
    try {
      parsed = JSON.parse(block.replace(/,\s*([}\]])/g, '$1'));
    } catch {
      return null;
    }
  }

  const c = parsed.compliance || {};

  const normalized: AIAnalyzeResponse = {
    material: String(parsed.material || 'Unidentified Industrial Waste').trim(),
    materialType: String(parsed.materialType || 'Mixed Industrial Stream').trim(),
    category: String(parsed.category || 'Other').trim(),
    confidence: clampConfidence(parsed.confidence),
    composition: String(parsed.composition || 'Composition not determined').trim(),
    contaminants: toStringArray(parsed.contaminants),
    contaminationLevel: pickEnum(
      parsed.contaminationLevel,
      ['none', 'low', 'medium', 'high'] as const,
      'low'
    ),
    recyclability: pickEnum(
      parsed.recyclability,
      ['High', 'Medium', 'Low', 'Specialized'] as const,
      'Medium'
    ),
    potentialReuses: toStringArray(parsed.potentialReuses).slice(0, 5),
    hazards: toStringArray(parsed.hazards),
    processingRequirements: toStringArray(parsed.processingRequirements).slice(0, 5),
    compliance: {
      riskLevel: pickEnum(
        c.riskLevel,
        ['LOW RISK', 'MODERATE RISK', 'HIGH RISK'] as const,
        'LOW RISK'
      ),
      classification: String(c.classification || 'Industrial Byproduct').trim(),
      notes: String(c.notes || 'Standard industrial handling procedures apply.').trim(),
      requiredDocuments: toStringArray(c.requiredDocuments),
      disclaimer: String(c.disclaimer || DISCLAIMER).trim(),
    },
    summary: String(parsed.summary || 'AI analysis completed.').trim(),
    source: meta.source,
    latencyMs: meta.latencyMs,
  };

  return normalized;
}
