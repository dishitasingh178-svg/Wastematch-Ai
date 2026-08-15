/**
 * AI Engine Types
 * ---------------
 * Owner: Person 3 (AI)
 * Purpose: Strict typed contract between the AI engine and the rest of the app
 *          (backend endpoints + frontend UI). Everyone on the team should
 *          import from here so nobody accidentally sends the wrong shape.
 */

/** Input the AI receives */
export interface AIAnalyzeRequest {
  /** Base64 data URL of the waste image, e.g. "data:image/jpeg;base64,...."
   *  OR a plain http(s) URL. The service handles both. */
  image: string;

  /** User-supplied context (all optional but improves accuracy). */
  userProvided?: {
    wasteName?: string;
    quantity?: number;
    unit?: string;
    location?: string;
    materialComposition?: string;
    chemicals?: string;
    contaminationLevel?: 'none' | 'low' | 'medium' | 'high';
  };
}

/** Structured, judge-friendly response from the AI engine. */
export interface AIAnalyzeResponse {
  /** Primary predicted material, e.g. "PET Plastic" */
  material: string;

  /** Broader family, e.g. "Thermoplastic Polymer" */
  materialType: string;

  /** Waste category bucket used for routing/matching, e.g. "Post-Industrial Polymers" */
  category: string;

  /** Model confidence 0-100 */
  confidence: number;

  /** Best-guess elemental / polymer composition */
  composition: string;

  /** Possible contaminants seen in the image / declared by user */
  contaminants: string[];

  /** Overall contamination level */
  contaminationLevel: 'none' | 'low' | 'medium' | 'high';

  /** Overall recyclability rating */
  recyclability: 'High' | 'Medium' | 'Low' | 'Specialized';

  /** Concrete reuse pathways this material can feed into */
  potentialReuses: string[];

  /** Safety / hazard flags. Empty array = safe. */
  hazards: string[];

  /** How the receiving facility would need to process this */
  processingRequirements: string[];

  /** AI-assisted (NOT legal) compliance guidance */
  compliance: {
    riskLevel: 'LOW RISK' | 'MODERATE RISK' | 'HIGH RISK';
    classification: string;
    notes: string;
    /** Documents the shipper will likely need */
    requiredDocuments: string[];
    /** IMPORTANT disclaimer we always show to the user */
    disclaimer: string;
  };

  /** Human-readable summary the UI can drop straight onto a card */
  summary: string;

  /** Which engine produced this — helps demo debugging */
  source: 'gemini-vision' | 'mock-fallback';

  /** Milliseconds the analysis took (nice for the "AI Pipeline" UI) */
  latencyMs: number;
}

/** Standard error shape */
export interface AIError {
  ok: false;
  error: string;
  code:
    | 'NO_IMAGE'
    | 'BAD_IMAGE'
    | 'API_KEY_MISSING'
    | 'API_CALL_FAILED'
    | 'PARSE_FAILED'
    | 'UNKNOWN';
}
