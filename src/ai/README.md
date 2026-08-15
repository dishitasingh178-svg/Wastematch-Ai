# 🤖 WasteMatch AI Engine — Person 3

> **This folder is my responsibility (Person 3 — AI Engineer).**
> It contains the entire "AI magic" of the project. Nothing outside this
> folder needs to know how Gemini works — everyone else just imports
> `analyzeWaste` and gets a clean JSON back.

---

## 1. What this engine does

Given **one image of industrial waste + a few user-declared details**, it
returns a rigorously structured JSON report:

```jsonc
{
  "material": "PET Plastic",
  "materialType": "Thermoplastic Polymer",
  "category": "Post-Industrial Polymers",
  "confidence": 87,
  "composition": "Polyethylene Terephthalate ~96% ...",
  "contaminants": ["Trace labeling adhesive", "Surface dust"],
  "contaminationLevel": "low",
  "recyclability": "High",
  "potentialReuses": ["rPET Granules & Pellets", "Polyester Fiber", ...],
  "hazards": [],
  "processingRequirements": ["Sort by color", "Hot-wash", ...],
  "compliance": {
    "riskLevel": "LOW RISK",
    "classification": "Non-Hazardous Industrial Polymer (Schedule II)",
    "notes": "Directly recyclable under CPCB EPR guidelines...",
    "requiredDocuments": ["Form 4 Manifest (CPCB)", ...],
    "disclaimer": "This is AI-assisted guidance, not legal advice..."
  },
  "summary": "High-purity PET post-industrial scrap...",
  "source": "gemini-vision",
  "latencyMs": 2431
}
```

Person 2 (Backend) feeds this into the matching algorithm.
Person 1 (Frontend) drops these fields straight onto the results screen.
Person 4 (Data) uses `category`, `contaminationLevel`, and `recyclability`
as inputs to the match-score formula.

---

## 2. File map

```
src/ai/
├── index.ts              ← barrel export (import from here)
├── analyzeWaste.ts       ← ⭐ public entrypoint (never throws)
├── types.ts              ← the shared TypeScript contract
├── prompt.ts             ← Gemini system + user prompts
├── geminiClient.ts       ← @google/genai wrapper (Gemini 2.5 Flash)
├── schema.ts             ← extracts + validates JSON from raw model text
├── mockFallback.ts       ← keyless / offline demo mode (never breaks)
├── useWasteAnalysis.ts   ← React hook for Person 1 (Frontend)
├── testAI.ts             ← standalone test harness
└── README.md             ← this file
```

Companion server files (for Person 2 — Backend):
```
src/server/
├── aiRoutes.ts   ← Express router: POST /api/analyze-waste
└── aiServer.ts   ← Standalone dev server on port 4000
```

---

## 3. How the flow works

```
User uploads photo + fills form (Person 1's UI)
                 │
                 ▼
      POST /api/analyze-waste  (Person 2's backend, or direct hook)
                 │
                 ▼
        analyzeWaste()                     ← MY entrypoint
                 │
     ┌───────────┴────────────┐
     ▼                        ▼
Gemini 2.5 Flash          Mock template
(if API key set)          (fallback — always works)
     │                        │
     └───────────┬────────────┘
                 ▼
        JSON extract + validate (schema.ts)
                 │
                 ▼
        Clean AIAnalyzeResponse
                 │
                 ▼
        Matching engine (Person 4)
                 │
                 ▼
        Results dashboard (Person 1)
```

Two things matter here:

- **The engine NEVER throws to its caller.** If Gemini is down, if the key
  is missing, if the network dies mid-request, if the model returns malformed
  JSON — it always returns a valid `AIAnalyzeResponse`. This is critical for
  a live hackathon demo.
- **Every response carries a `source` field** (`gemini-vision` or
  `mock-fallback`). The UI shows this so the judges know when the AI is
  actually live.

---

## 4. How to run

### Setup (one time)

```bash
npm install                # installs @google/genai etc.
cp .env.example .env.local
# then edit .env.local and set:
# GEMINI_API_KEY="your_real_key_here"
```

Get a free Gemini API key at <https://aistudio.google.com/apikey>.

### Test the AI in isolation (no server, no UI)

```bash
npm run ai:test
```

Runs `src/ai/testAI.ts`. You'll see three test cases:
1. Mock fallback (empty request) — always passes.
2. Template match (PET) — deterministic output.
3. Real Gemini call — only runs if the API key is set.

Great for screenshots for the presentation.

### Run the standalone AI server (Person 2's backup)

```bash
npm run ai:server
```

This spins up an Express server on `http://localhost:4000` with:
- `POST /api/analyze-waste`
- `GET  /api/ai/health`

Person 2 can either:
- **(a) Mount** my router into their existing app:
  ```ts
  import { aiRouter } from './src/server/aiRoutes';
  app.use(express.json({ limit: '15mb' }));
  app.use('/api', aiRouter);
  ```
- **(b) Just run** my server on port 4000 and proxy through their own.

### Frontend integration (Person 1)

Person 1 doesn't need to know any of this. They call one hook:

```tsx
import { useWasteAnalysis } from '@/src/ai/useWasteAnalysis';

const { analyze, loading, result, error } = useWasteAnalysis();

// In your submit handler:
await analyze({
  image: dataUrlFromFileInput,
  userProvided: { wasteName, quantity, unit, location, contaminationLevel }
});
```

The hook first hits the backend (`http://localhost:4000/api/analyze-waste`),
and if that's unreachable, transparently falls back to calling Gemini
directly from the browser using `VITE_GEMINI_API_KEY`.

I already wired this hook into `AIAnalysisPage.tsx`, so the "Understanding
your waste..." screen now runs a real AI call on mount.

---

## 5. How I prompt the AI

Prompt engineering is in `src/ai/prompt.ts`. Two parts:

### System instruction (fixed)
Sets the persona: "You are the WasteMatch AI... you are NOT a legal
authority... return ONE JSON object and nothing else..."

Key hard rules embedded:
- Never invent details when the image is unclear — lower the confidence.
- Never use markdown fences.
- Confidence is 0–100 integer.
- Always include the compliance disclaimer.

### User prompt (built per request)
Injects the user-declared fields (name, quantity, location, contamination
level) as **context** so the AI cross-checks its visual guess against what
the human already knows. Then embeds the exact JSON schema the model must
follow.

I also set `responseMimeType: 'application/json'` on the API call — Gemini
2.5 Flash honours this and returns pure JSON ~95% of the time. The other
~5% is why `schema.ts` exists.

---

## 6. Why this design is defensible in the pitch

If a judge asks *"How does the AI determine the material?"* — here's the
one-minute answer:

> The user uploads a photo. We send it to **Google Gemini 2.5 Flash** — a
> multimodal vision model — together with a structured prompt and the
> user-declared context (name, quantity, contamination). Gemini returns a
> strict JSON payload with material identification, confidence, contaminants,
> reuse pathways, and AI-assisted compliance guidance. That payload flows
> into our matching engine which scores facilities on material compatibility,
> distance, capacity, and environmental benefit.
>
> We do NOT train our own model — that would take weeks and be worse than
> Gemini. We do NOT let the AI pretend to be a legal authority —
> compliance output is always labeled as "AI-assisted" and carries a
> mandatory disclaimer. And we always have a **deterministic fallback**
> so the demo cannot break live on stage.

That's the exact phrasing the workplan suggests. 👍

---

## 7. What I deliberately did NOT build

Per hackathon rules (16 hours, keep it minimal):

- ❌ Fine-tuning / training a custom model
- ❌ Multi-image analysis (one photo per waste stream is enough)
- ❌ Streaming responses (adds complexity, adds nothing visually)
- ❌ Rate limiting / caching layer (not needed at hackathon scale)
- ❌ OCR for MSDS document parsing (Tier-4, only if we finished everything)

If we win and want to keep building, those are natural follow-ups.
