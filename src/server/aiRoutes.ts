/**
 * Express Routes — AI Engine
 * --------------------------
 * Owner: Person 3 (AI)  — hand this to Person 2 (Backend)
 *
 * Person 2 just mounts this router on their Express app:
 *
 *   import express from 'express';
 *   import { aiRouter } from './src/server/aiRoutes';
 *
 *   const app = express();
 *   app.use(express.json({ limit: '15mb' })); // images arrive as base64
 *   app.use('/api', aiRouter);
 *   app.listen(4000);
 *
 * That gives them:
 *   POST /api/analyze-waste     → main AI classification endpoint
 *   GET  /api/ai/health         → simple health probe for the demo
 */

import express, { Request, Response, Router } from 'express';
import { analyzeWaste } from '../ai/analyzeWaste';
import { getApiKey } from '../ai/geminiClient';
import { findTopMatches, getFacilityById, resolveCoordinates } from '../matching/matchingEngine';
import { calculateImpact } from '../matching/impactCalculator';

export const aiRouter: Router = express.Router();

/**
 * POST /analyze-waste
 * Body: {
 *   image: "data:image/jpeg;base64,....",   // required
 *   userProvided: {                          // optional context
 *     wasteName?, quantity?, unit?, location?,
 *     materialComposition?, chemicals?, contaminationLevel?
 *   }
 * }
 */
aiRouter.post('/analyze-waste', async (req: Request, res: Response) => {
  try {
    const { image, userProvided } = req.body || {};

    if (!image || typeof image !== 'string') {
      return res.status(400).json({
        ok: false,
        error: 'Missing `image` (base64 data URL or https URL) in request body.',
        code: 'NO_IMAGE',
      });
    }

    const result = await analyzeWaste({ image, userProvided });

    return res.json({
      ok: true,
      success: true,
      message: 'Image analyzed successfully',
      data: {
        ...result,
        wasteType: result.material,
        composition: [result.composition],
        confidenceScore: result.confidence / 100
      },
    });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('[POST /analyze-waste] unexpected error:', err);
    return res.status(500).json({
      ok: false,
      error: err?.message || 'Unexpected server error',
      code: 'UNKNOWN',
    });
  }
});

/**
 * POST /match-waste
 * Body: { composition?, wasteType?, quantityTonnes?, location? }
 */
aiRouter.post('/match-waste', (req: Request, res: Response) => {
  const { composition, wasteType, quantityTonnes, location } = req.body || {};
  const queryWaste = wasteType || (Array.isArray(composition) ? composition.join(' ') : 'PET Plastic');
  const qty = Number(quantityTonnes) || 15;
  const coords = resolveCoordinates(location || 'Pune, Maharashtra');

  const matches = findTopMatches({
    wasteType: queryWaste,
    quantityTonnes: qty,
    latitude: coords.lat,
    longitude: coords.lon,
    contaminationPercentage: 5
  }, 5);

  const formattedMatches = matches.map((m, idx) => ({
    id: idx + 1,
    facilityId: m.facilityId,
    reuser: m.facilityName,
    facilityName: m.facilityName,
    location: m.location,
    distanceKm: m.distanceKm,
    matchScore: m.matchScore,
    method: `${m.capacityPerDay} T/day processing capacity for circular reuse`,
    demandLevel: m.matchScore > 85 ? 'High' : 'Medium',
    breakdown: m.breakdown,
    whyMatched: m.whyMatched,
    processingType: m.processingType,
    estimatedAvoidedCo2Tonnes: m.estimatedAvoidedCo2Tonnes,
    estimatedEconomicBenefitInr: m.estimatedEconomicBenefitInr,
  }));

  return res.json({
    ok: true,
    success: true,
    message: 'Matches found',
    data: formattedMatches
  });
});

/**
 * POST /calculate-impact
 * Body: { matchId?, wasteVolume?, quantityTonnes?, distanceKm?, facilityId? }
 */
aiRouter.post('/calculate-impact', (req: Request, res: Response) => {
  const { matchId, wasteVolume, quantityTonnes, distanceKm, facilityId } = req.body || {};
  const qty = Number(wasteVolume || quantityTonnes || 10);
  const dist = Number(distanceKm || 25);
  
  const facility = facilityId ? getFacilityById(facilityId) : null;
  const impact = facility 
    ? calculateImpact({ quantityTonnes: qty, distanceKm: dist, facility })
    : {
        wasteDivertedTonnes: qty,
        estimatedCo2AvoidedTonnes: qty * 0.42,
        estimatedEconomicBenefit: qty * 6500,
        energySavedKwh: qty * 85
      };

  return res.json({
    ok: true,
    success: true,
    message: 'Impact calculated',
    data: {
      ...impact,
      co2SavedKg: Math.round(impact.estimatedCo2AvoidedTonnes * 1000),
      waterSavedLiters: Math.round(qty * 120),
      landfillSpaceSavedCubicMeters: Math.round(qty * 0.75 * 10) / 10
    }
  });
});

/** GET /ai/health — quick check for the demo dashboard */
aiRouter.get('/ai/health', (_req: Request, res: Response) => {
  const hasKey = Boolean(getApiKey());
  res.json({
    ok: true,
    aiEngine: 'waste-match-ai',
    model: 'gemini-2.5-flash',
    geminiConfigured: hasKey,
    mode: hasKey ? 'live' : 'mock-fallback',
    timestamp: new Date().toISOString(),
  });
});
