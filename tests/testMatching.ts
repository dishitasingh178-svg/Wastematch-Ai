/**
 * Matching Engine Test Suite
 * --------------------------
 * Tests:
 * 1. Weights verification (40% Material, 20% Quality, 15% Quantity, 10% Distance, 10% Price, 5% Environmental = 100%)
 * 2. Material compatibility & synonym resolution (PET, HDPE, LDPE, PP, PVC, Aluminium, Steel Slag, Glass, Paper, Textiles, Silica, E-Waste, Organics, Solvents)
 * 3. Contamination / Quality tolerance limits & penalties
 * 4. Quantity minimums & capacity thresholds
 * 5. Haversine distance accuracy & logistics radius scaling
 * 6. Price score & economic viability metrics
 * 7. Environmental CO2 avoidance scoring
 * 8. Hazardous material safety gating
 * 9. No-match & edge case handling
 * 10. Complete score breakdown & verified factual explanations
 */

import {
  WEIGHTS,
  calculateMaterialScore,
  calculateQualityScore,
  calculateQuantityScore,
  calculateDistanceScore,
  calculatePriceScore,
  calculateEnvironmentalScore,
  findTopMatches,
  haversineKm,
  getFacilityById,
  getAllFacilities,
  resolveCoordinates
} from '../src/matching/matchingEngine';
import { calculateImpact } from '../src/matching/impactCalculator';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`  ✓ ${message}`);
  }
}

async function runMatchingTests() {
  console.log('\n======================================================');
  console.log('  WASTEMATCH AI — MATCHING ENGINE VERIFICATION SUITE  ');
  console.log('======================================================\n');

  // TEST 1: Weights verification
  console.log('▶ TEST 1: Matching Weights Allocation');
  assert(WEIGHTS.material === 0.40, 'Material weight is exactly 40% (0.40)');
  assert(WEIGHTS.quality === 0.20, 'Quality weight is exactly 20% (0.20)');
  assert(WEIGHTS.quantity === 0.15, 'Quantity weight is exactly 15% (0.15)');
  assert(WEIGHTS.distance === 0.10, 'Distance weight is exactly 10% (0.10)');
  assert(WEIGHTS.price === 0.10, 'Price weight is exactly 10% (0.10)');
  assert(WEIGHTS.environmental === 0.05, 'Environmental weight is exactly 5% (0.05)');
  const sumWeights = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);
  assert(Math.abs(sumWeights - 1.0) < 0.0001, `Sum of weights equals 100% (${sumWeights * 100}%)`);

  // TEST 2: Material compatibility & synonyms
  console.log('\n▶ TEST 2: Material Compatibility & Synonym Mapping');
  const petFacility = getFacilityById('FAC004')!; // EcoPlast (PET)
  const aluFacility = getFacilityById('FAC007')!; // PuneAlloy (Aluminium)
  const silicaFacility = getFacilityById('FAC023')!; // Deccan Silica
  const cottonFacility = getFacilityById('FAC011')!; // DeccanCellulose (Textiles)
  const hdpeFacility = getFacilityById('FAC016')!; // Gujarat Polymers (HDPE)
  const ldpeFacility = getFacilityById('FAC021')!; // PolymerFilm (LDPE/PP)
  const pvcFacility = getFacilityById('FAC022')!; // Vinyl & Rigid Polymer (PVC)

  assert(calculateMaterialScore('PET Plastic Bottles', petFacility) >= 95, 'PET synonym "PET Plastic Bottles" matches EcoPlast');
  assert(calculateMaterialScore('rPET Flakes', petFacility) >= 95, 'rPET Flakes matches PET facility');
  assert(calculateMaterialScore('Aluminium 6061 Scrap', aluFacility) >= 95, 'Aluminium 6061 Scrap matches PuneAlloy');
  assert(calculateMaterialScore('Cotton Ginning Lint', cottonFacility) >= 95, 'Cotton Lint matches Textile facility');
  assert(calculateMaterialScore('Silica Sand Slurry', silicaFacility) >= 95, 'Silica Sand Slurry matches Deccan Silica');
  assert(calculateMaterialScore('HDPE Regrind', hdpeFacility) >= 95, 'HDPE Regrind matches HDPE facility');
  assert(calculateMaterialScore('LDPE Packaging Film', ldpeFacility) >= 95, 'LDPE Packaging Film matches PolymerFilm facility');
  assert(calculateMaterialScore('Rigid PVC Pipe Scrap', pvcFacility) >= 95, 'PVC Pipe Scrap matches PVC facility');
  assert(calculateMaterialScore('Aluminium Scrap', petFacility) === 0, 'Incompatible material (Alu vs PET) returns 0');

  // TEST 3: Contamination / Quality Scoring
  console.log('\n▶ TEST 3: Contamination & Quality Tolerance Scoring');
  // Facility with limit 10%
  const cleanScore = calculateQualityScore(0, petFacility);
  const withinLimitScore = calculateQualityScore(4, petFacility);
  const atLimitScore = calculateQualityScore(petFacility.contamination_limit, petFacility);
  const excessScore = calculateQualityScore(20, petFacility);

  assert(cleanScore === 100, `0% contamination gives pristine score (100) -> got ${cleanScore}`);
  assert(withinLimitScore >= 80 && withinLimitScore < 100, `4% contamination within limit gives high score (80-99) -> got ${withinLimitScore}`);
  assert(atLimitScore === 80, `At limit contamination gives 80 -> got ${atLimitScore}`);
  assert(excessScore < 50, `Excessive contamination (20% vs limit) is heavily penalized -> got ${excessScore}`);

  // TEST 4: Quantity & Capacity Thresholds
  console.log('\n▶ TEST 4: Quantity & Minimum Batch Scoring');
  const belowMinScore = calculateQuantityScore(0.2, petFacility); // min is 1 tonne
  const idealScore = calculateQuantityScore(5, petFacility); // capacity is 10 tonnes
  const maxCapacityScore = calculateQuantityScore(petFacility.capacity_per_day, petFacility);
  const oversizedScore = calculateQuantityScore(50, petFacility);

  assert(belowMinScore <= 30, `Below minimum quantity is penalized -> got ${belowMinScore}`);
  assert(idealScore >= 80, `Within daily capacity gives high fit -> got ${idealScore}`);
  assert(maxCapacityScore === 100, `Exact daily capacity fit gives 100 -> got ${maxCapacityScore}`);
  assert(oversizedScore <= 70, `Batch significantly exceeding single-day capacity is scaled -> got ${oversizedScore}`);

  // TEST 5: Haversine Distance & Logistics Radius
  console.log('\n▶ TEST 5: Haversine Distance Accuracy & Logistics Radius');
  const pune = resolveCoordinates('Pune');
  const mumbai = resolveCoordinates('Mumbai');
  const distPuneMumbai = haversineKm(pune.lat, pune.lon, mumbai.lat, mumbai.lon);
  assert(distPuneMumbai > 110 && distPuneMumbai < 135, `Pune to Mumbai distance is ~120 km (got ${Math.round(distPuneMumbai)} km)`);

  assert(calculateDistanceScore(15) === 100, 'Under 25 km gets 100 distance score');
  assert(calculateDistanceScore(45) === 90, '25-50 km gets 90 distance score');
  assert(calculateDistanceScore(90) === 80, '50-100 km gets 80 distance score');
  assert(calculateDistanceScore(150) === 65, '100-200 km gets 65 distance score');
  assert(calculateDistanceScore(900) === 10, '>800 km gets 10 distance score');

  // TEST 6: Hazardous Material Safety Gating
  console.log('\n▶ TEST 6: Hazardous Material Safety Gating');
  const hazFacility = getFacilityById('FAC025')!; // HazTreat Environmental
  const nonHazFacility = getFacilityById('FAC001')!; // EcoCement

  const hazScoreSafe = calculateMaterialScore('Spent Chemical Solvents', hazFacility, true);
  const hazScoreUnsafe = calculateMaterialScore('Spent Chemical Solvents', nonHazFacility, true);

  assert(hazScoreSafe >= 95, `Hazardous chemical matches authorized hazardous facility -> got ${hazScoreSafe}`);
  assert(hazScoreUnsafe === 0, `Hazardous chemical is safely blocked (score 0) from standard non-hazardous facility -> got ${hazScoreUnsafe}`);

  // TEST 7: End-to-End Ranking & Score Breakdown
  console.log('\n▶ TEST 7: End-to-End Match Ranking & Breakdown');
  const matches = findTopMatches({
    wasteType: 'PET Plastic Bottles',
    quantityTonnes: 8,
    latitude: pune.lat,
    longitude: pune.lon,
    contaminationPercentage: 3
  }, 3);

  assert(matches.length > 0, `Found ${matches.length} matches for PET Plastic`);
  assert(matches[0].matchScore >= matches[1].matchScore, 'Matches are correctly sorted in descending order of matchScore');

  const top = matches[0];
  assert(top.breakdown.material >= 95, `Material breakdown score is present (${top.breakdown.material})`);
  assert(top.breakdown.quality > 0, `Quality breakdown score is present (${top.breakdown.quality})`);
  assert(top.breakdown.quantity > 0, `Quantity breakdown score is present (${top.breakdown.quantity})`);
  assert(top.breakdown.distance > 0, `Distance breakdown score is present (${top.breakdown.distance})`);
  assert(top.breakdown.price > 0, `Price breakdown score is present (${top.breakdown.price})`);
  assert(top.breakdown.environmental > 0, `Environmental breakdown score is present (${top.breakdown.environmental})`);

  // Verify weighted score calculation
  const calculatedScore = Math.round(
    top.breakdown.material * WEIGHTS.material +
    top.breakdown.quality * WEIGHTS.quality +
    top.breakdown.quantity * WEIGHTS.quantity +
    top.breakdown.distance * WEIGHTS.distance +
    top.breakdown.price * WEIGHTS.price +
    top.breakdown.environmental * WEIGHTS.environmental
  );
  assert(top.matchScore === calculatedScore, `Top match score (${top.matchScore}) matches mathematical weight formula (${calculatedScore})`);

  // TEST 8: Factual Explanations
  console.log('\n▶ TEST 8: Factual Explanation Generation');
  assert(top.whyMatched.length >= 4, `Generated ${top.whyMatched.length} factual reasons`);
  assert(top.whyMatched.some(r => r.includes('km')), 'Includes verified distance metric');
  assert(top.whyMatched.some(r => r.includes('contamination')), 'Includes contamination limit tolerance');
  assert(top.whyMatched.some(r => r.includes('tonnes/day')), 'Includes processing throughput');
  assert(top.whyMatched.some(r => r.includes('CO2e')), 'Includes CO2 avoidance estimate');

  // TEST 9: Impact Calculator
  console.log('\n▶ TEST 9: Economic & Environmental Impact Calculation');
  const impact = calculateImpact({
    quantityTonnes: 10,
    distanceKm: 20,
    facility: petFacility
  });
  assert(impact.wasteDivertedTonnes === 10, `Diverted waste is 10 tonnes (got ${impact.wasteDivertedTonnes})`);
  assert(impact.estimatedCo2AvoidedTonnes > 0, `CO2 avoided is positive (${impact.estimatedCo2AvoidedTonnes} tonnes)`);
  assert(impact.estimatedEconomicBenefit > 0, `Economic benefit is positive (₹${impact.estimatedEconomicBenefit})`);

  // TEST 10: No-Match Handling
  console.log('\n▶ TEST 10: No-Match Handling');
  const noMatches = findTopMatches({
    wasteType: 'Unobtainium Space Dust 9999',
    quantityTonnes: 5,
    latitude: pune.lat,
    longitude: pune.lon,
    contaminationPercentage: 0
  });
  assert(noMatches.length === 0, 'Non-existent waste stream returns empty array without crashing');

  console.log('\n======================================================');
  console.log('  ALL 10 MATCHING ENGINE TESTS PASSED SUCCESSFULLY!  ');
  console.log('======================================================\n');
}

runMatchingTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
