/**
 * React Hook — useWasteAnalysis
 * -----------------------------
 * Owner: Person 3 (AI)  — hand this to Person 1 (Frontend)
 *
 * Drop-in hook that Person 1 can call from UploadWastePage / AIAnalysisPage:
 *
 *   const { analyze, loading, result, error } = useWasteAnalysis();
 *   await analyze({ image: dataUrl, userProvided: { wasteName, quantity, ... } });
 *
 * By default it calls the BACKEND endpoint (Person 2's Express server):
 *   POST {VITE_AI_API_URL || 'http://localhost:4000'}/api/analyze-waste
 *
 * If the backend is unreachable, it transparently falls back to the
 * in-browser AI engine — so the demo still works even if the server dies.
 */

import { useState, useCallback } from 'react';
import type { AIAnalyzeRequest, AIAnalyzeResponse } from './types';

const API_BASE =
  (typeof import.meta !== 'undefined' &&
    (import.meta as any).env?.VITE_AI_API_URL) ||
  'http://localhost:4000';

interface HookState {
  loading: boolean;
  result: AIAnalyzeResponse | null;
  error: string | null;
}

export function useWasteAnalysis() {
  const [state, setState] = useState<HookState>({
    loading: false,
    result: null,
    error: null,
  });

  const analyze = useCallback(async (req: AIAnalyzeRequest) => {
    setState({ loading: true, result: null, error: null });

    // 1. Try backend endpoint first
    try {
      const res = await fetch(`${API_BASE}/api/analyze-waste`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.ok && json.data) {
          setState({ loading: false, result: json.data, error: null });
          return json.data as AIAnalyzeResponse;
        }
      }
      throw new Error(`Backend responded ${res.status}`);
    } catch (backendErr) {
      // 2. Fallback: call the AI engine directly in-browser (works because
      // GoogleGenAI SDK is browser-friendly and AI Studio injects the key).
      try {
        const { analyzeWaste } = await import('./analyzeWaste');
        const result = await analyzeWaste(req);
        setState({ loading: false, result, error: null });
        return result;
      } catch (err: any) {
        const msg = err?.message || 'AI analysis failed';
        setState({ loading: false, result: null, error: msg });
        throw err;
      }
    }
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, result: null, error: null });
  }, []);

  return {
    analyze,
    reset,
    loading: state.loading,
    result: state.result,
    error: state.error,
  };
}
