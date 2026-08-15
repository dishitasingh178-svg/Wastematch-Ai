/**
 * AI Prompt Engineering
 * ---------------------
 * Owner: Person 3 (AI)
 *
 * The prompt is the single most important file in the AI engine.
 * We want Gemini to:
 *  1. Look at the image and describe what it sees
 *  2. Combine that with user-declared details
 *  3. Return ONLY valid JSON matching our schema (no prose, no markdown fences)
 *
 * If you change field names here, also update `src/ai/types.ts` and
 * `src/ai/schema.ts` so validation stays in sync.
 */

export const SYSTEM_INSTRUCTION = `
You are the WasteMatch AI — an advanced computer vision industrial waste classification and circular-economy routing assistant.
Your main job is to visually inspect the provided photo, accurately identify the waste material (for example: plastic bottles, PET flakes, aluminum turnings, copper wire, steel slag, cotton lint, silica sand slurry, cardboard), and return a structured JSON report.

CRITICAL VISUAL ACCURACY RULES:
- Visually examine the image first. If the photo contains plastic bottles (clear, colored, crushed, or whole), classify the material as "PET Plastic Bottles" or "PET Plastic" under the category "Post-Industrial Polymers".
- If the photo contains aluminum metal shavings/turnings, classify as "Aluminium 6061 Scrap" or "Aluminium Shavings".
- If the photo contains sandy slurry/mud from foundry, classify as "Silica Sand Slurry".
- If the photo contains fiber/textiles/lint, classify as "Cotton Ginning Lint" or "Textile Waste".
- Never default to "Silica" unless the photo actually shows silica sand or mineral slurry.
- Treat the visual evidence in the photo as the primary source of truth.
- Never mention that you are an AI model, never apologize, never add markdown code fences. Return ONE valid JSON object and nothing else.
`.trim();

/** Build the per-request user prompt from form data. */
export function buildUserPrompt(userProvided?: {
  wasteName?: string;
  quantity?: number;
  unit?: string;
  location?: string;
  materialComposition?: string;
  chemicals?: string;
  contaminationLevel?: string;
}): string {
  const u = userProvided || {};
  const lines: string[] = [
    'Analyze the attached waste photograph carefully.',
    'Primary Task: Visually identify the physical material in the image (e.g. plastic bottles -> "PET Plastic Bottles", aluminium scrap -> "Aluminium 6061 Scrap", cotton fiber -> "Cotton Ginning Lint", mineral sand -> "Silica Sand Slurry").',
    '',
    'OPTIONAL USER CONTEXT (use as secondary reference only if non-empty):',
    u.wasteName ? `- Declared Name: ${u.wasteName}` : '- Declared Name: (Not provided, identify solely from image)',
    `- Quantity: ${u.quantity ? `${u.quantity} ${u.unit || 'tonnes'}` : '(not specified)'}`,
    `- Location: ${u.location || '(not specified)'}`,
    `- Declared composition: ${u.materialComposition || '(not specified)'}`,
    `- Declared contamination: ${u.contaminationLevel || '(not specified)'}`,
    '',
    'Return ONLY the following JSON object (no markdown, no prose):',
    `{
  "material": "string - specific material name identified visually, e.g. 'PET Plastic Bottles'",
  "materialType": "string - family, e.g. 'Thermoplastic Polymer (Polyethylene Terephthalate)'",
  "category": "string - one of: Post-Industrial Polymers | Non-Ferrous Metallurgical | Ferrous Metals | Foundry & Mineral Residue | Textile Byproducts | Paper & Fibre | E-Waste | Hazardous Chemical | Organic / Biomass | Other",
  "confidence": 92,
  "composition": "string - compositional breakdown, e.g. 'Polyethylene Terephthalate (PET) ~96%, label/adhesive ~4%'",
  "contaminants": ["array of detected/likely contaminants, e.g. 'Trace label adhesive', 'Surface dust'"],
  "contaminationLevel": "one of: none | low | medium | high",
  "recyclability": "one of: High | Medium | Low | Specialized",
  "potentialReuses": ["3 to 5 concrete downstream reuse pathways, e.g. 'rPET Granules & Pellets', 'Polyester Textile Staple Fiber', 'Industrial Strapping'"],
  "hazards": ["array of hazard flags, empty if inert"],
  "processingRequirements": ["3 to 5 processing steps, e.g. 'Color sorting', 'Hot-wash to remove adhesives', 'Shredding & pelletization'"],
  "compliance": {
    "riskLevel": "one of: LOW RISK | MODERATE RISK | HIGH RISK",
    "classification": "regulatory classification, e.g. 'Non-Hazardous Industrial Polymer (Schedule II Compliant)'",
    "notes": "1-2 sentences of guidance on recycling under CPCB / EPR regulations",
    "requiredDocuments": ["Form 4 Manifest (CPCB)", "E-Way Bill", "Weighbridge Delivery Slip"],
    "disclaimer": "This is AI-assisted guidance, not legal advice. Verify with CPCB / State Pollution Control Board before dispatch."
  },
  "summary": "one-sentence summary of identified waste and best circular route"
}`,
  ];
  return lines.join('\n');
}
