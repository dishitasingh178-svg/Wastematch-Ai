/**
 * Standalone test harness for the AI engine
 * -----------------------------------------
 * Owner: Person 3 (AI)
 *
 * Run it independently of the frontend/backend to prove the AI works:
 *   npx tsx src/ai/testAI.ts
 * or
 *   npm run ai:test
 *
 * It exercises 3 cases so you can screenshot the output for the judges:
 *   1. Mock fallback (no image, no key)      — should always pass
 *   2. Fallback template match (PET wording) — deterministic result
 *   3. Real Gemini call using a public URL   — only if GEMINI_API_KEY is set
 */

import 'dotenv/config';
import { analyzeWaste } from './analyzeWaste';
import { getApiKey } from './geminiClient';

const PET_IMAGE_URL =
  'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80';

function banner(title: string) {
  console.log('\n' + '='.repeat(60));
  console.log('  ' + title);
  console.log('='.repeat(60));
}

async function run() {
  banner('TEST 1 — mock fallback (empty request)');
  const r1 = await analyzeWaste({ image: '' });
  console.log(JSON.stringify(r1, null, 2));

  banner('TEST 2 — mock template match ("PET Plastic Scrap")');
  const r2 = await analyzeWaste({
    image: '',
    userProvided: {
      wasteName: 'PET Plastic Scrap',
      quantity: 500,
      unit: 'kg',
      location: 'Gurgaon, India',
      contaminationLevel: 'low',
    },
  });
  console.log(JSON.stringify(r2, null, 2));

  if (!getApiKey()) {
    console.log(
      '\nℹ️  GEMINI_API_KEY not set — skipping live Gemini test.\n' +
        '    Set it in .env.local and re-run to see a real call.'
    );
    return;
  }

  banner('TEST 3 — real Gemini Vision call (PET bottle photo)');
  const r3 = await analyzeWaste({
    image: PET_IMAGE_URL,
    userProvided: {
      wasteName: 'PET Plastic Scrap',
      quantity: 500,
      unit: 'kg',
      location: 'Gurgaon, India',
      contaminationLevel: 'low',
    },
  });
  console.log(JSON.stringify(r3, null, 2));

  banner('TEST 4 — plastic bottle image without user name hint');
  const r4 = await analyzeWaste({
    image: PET_IMAGE_URL,
    userProvided: {
      quantity: 10,
      unit: 'tonnes',
      location: 'Pune, Maharashtra'
    }
  });
  console.log(JSON.stringify(r4, null, 2));
}

run().catch((err) => {
  console.error('AI test crashed:', err);
  process.exit(1);
});
