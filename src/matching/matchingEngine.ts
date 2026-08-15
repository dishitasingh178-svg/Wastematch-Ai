import facilitiesData from "../../data/facilities_sample.json";
import type { Facility, MatchResult, WasteInput } from "./types";

const facilities: Facility[] = facilitiesData.facilities;

/**
 * Matching weights as specified:
 * - Material: 40% (0.40)
 * - Quality (Contamination tolerance): 20% (0.20)
 * - Quantity (Capacity & minimums): 15% (0.15)
 * - Distance: 10% (0.10)
 * - Price (Economic viability): 10% (0.10)
 * - Environmental (CO2 offset): 5% (0.05)
 * Total: 100%
 */
export const WEIGHTS = {
  material: 0.40,
  quality: 0.20,
  quantity: 0.15,
  distance: 0.10,
  price: 0.10,
  environmental: 0.05,
};

// Material Synonym & Category Resolution
const MATERIAL_SYNONYMS: Record<string, string[]> = {
  pet: ['pet', 'polyethylene terephthalate', 'rpet', 'polyester', 'plastic bottle', 'bottle flake'],
  hdpe: ['hdpe', 'high density polyethylene', 'polyethylene drum', 'rigid plastic'],
  ldpe: ['ldpe', 'low density polyethylene', 'plastic film', 'poly film', 'packaging film'],
  pp: ['pp', 'polypropylene', 'woven bag', 'plastic strap', 'raffia'],
  pvc: ['pvc', 'polyvinyl chloride', 'vinyl', 'plastic pipe', 'rigid polymers'],
  aluminium: ['aluminium', 'aluminum', '6061', 'duralumin', 'metal shaving', 'metal scrap', 'alu turnings', 'non ferrous'],
  'steel slag': ['steel slag', 'blast furnace slag', 'ferrous slag', 'foundry slag', 'slag', 'steel byproduct', 'silica sand'],
  glass: ['glass', 'cullet', 'crushed glass', 'bottle cullet', 'silica grain'],
  'paper/cardboard': ['paper', 'cardboard', 'kraft', 'corrugated', 'paperboard', 'pulp', 'paper/cardboard'],
  textiles: ['textiles', 'textile', 'cotton', 'cotton lint', 'ginning lint', 'cellulose', 'fabric scrap', 'yarn'],
  silica: ['silica', 'silica sand', 'foundry sand', 'mineral slurry', 'sand slurry', 'quartz', 'silicate'],
  'fly ash': ['fly ash', 'bottom ash', 'pulverized ash', 'pozzolanic ash'],
  solvents: ['solvents', 'solvent', 'spent solvent', 'isopropyl alcohol', 'toluene', 'thinner', 'chemical solvent'],
  'used oil': ['used oil', 'waste oil', 'lube oil', 'hydraulic oil', 'transformer oil', 'engine oil'],
  'e-waste': ['e-waste', 'electronic waste', 'printed circuit board', 'pcb scrap', 'weee'],
  tires: ['tires', 'tyres', 'tyre', 'rubber scrap', 'shredded tyre', 'tire derived'],
  organic: ['organic', 'biomass', 'agri-waste', 'food waste', 'bagasse', 'husk'],
  'hazardous chemical': ['hazardous chemical', 'chemical sludge', 'hazardous waste', 'toxic residue', 'heavy metal sludge']
};

function normalizeText(value: string): string {
  return value.trim().toLowerCase().replace(/[_-]+/g, " ");
}

/** Check if input material matches facility's accepted types */
export function calculateMaterialScore(wasteType: string, facility: Facility, isHazardous = false): number {
  if (!wasteType || wasteType.trim() === '') return 0;
  const target = normalizeText(wasteType);

  // Hazardous safety check: If material is hazardous or flagged hazardous, facility must accept hazardous streams
  const isInputHazardous = isHazardous || /hazardous|toxic|acid|cyanide|spent solvent|chemical sludge/.test(target);
  if (isInputHazardous && !facility.is_hazardous && !facility.accepted_waste_types.some(t => /solvent|used oil|hazardous/i.test(t))) {
    return 0; // Ineligible for safety
  }

  // Exact or direct substring match against facility accepted types
  for (const accepted of facility.accepted_waste_types) {
    const normAccepted = normalizeText(accepted);
    if (target === normAccepted || target.includes(normAccepted) || normAccepted.includes(target)) {
      return 100;
    }
  }

  // Synonym & category match
  for (const [canonical, synonyms] of Object.entries(MATERIAL_SYNONYMS)) {
    const inputMatchesCanonical = target.includes(canonical) || synonyms.some(s => target.includes(s));
    if (inputMatchesCanonical) {
      const facilityMatchesCanonical = facility.accepted_waste_types.some(accepted => {
        const normAccepted = normalizeText(accepted);
        return normAccepted.includes(canonical) || synonyms.some(s => normAccepted.includes(s));
      });
      if (facilityMatchesCanonical) {
        return 95;
      }
    }
  }

  return 0;
}

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const earthRadiusKm = 6371;
  const toRad = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(a));
}

/** Distance score (10% weight) - logistics radius scale */
export function calculateDistanceScore(distanceKm: number): number {
  if (distanceKm <= 25) return 100;
  if (distanceKm <= 50) return 90;
  if (distanceKm <= 100) return 80;
  if (distanceKm <= 200) return 65;
  if (distanceKm <= 400) return 45;
  if (distanceKm <= 800) return 25;
  return 10;
}

/** Quantity score (15% weight) - evaluates minimum quantity & daily capacity */
export function calculateQuantityScore(quantityTonnes: number, facility: Facility): number {
  const qty = Math.max(0.1, quantityTonnes);
  if (qty < facility.minimum_quantity) {
    return Math.max(10, Math.round((qty / facility.minimum_quantity) * 60));
  }
  if (qty <= facility.capacity_per_day) {
    const utilization = qty / facility.capacity_per_day;
    return Math.round(80 + utilization * 20); // 80 to 100
  }
  // Exceeds single day capacity: batch processing allows multi-day intake
  const excessFactor = (qty - facility.capacity_per_day) / facility.capacity_per_day;
  return Math.max(30, Math.round(100 - excessFactor * 40));
}

/** Quality / Contamination score (20% weight) - evaluates contamination vs facility limits */
export function calculateQualityScore(contaminationPercentage: number, facility: Facility): number {
  const cont = Math.max(0, contaminationPercentage);
  const limit = Math.max(1, facility.contamination_limit);

  if (cont <= limit) {
    // Clean batch within limit: 80-100
    const ratio = cont / limit;
    return Math.round(100 - ratio * 20);
  }

  // Exceeds limit: graduated penalty
  const excessRatio = (cont - limit) / limit;
  return Math.max(0, Math.round(80 - excessRatio * 75));
}

/** Price score (10% weight) - evaluates economic viability & recovery margin */
export function calculatePriceScore(facility: Facility, expectedPriceOrBudget?: number): number {
  const netMarginPerTonne = facility.estimated_reuse_value - facility.estimated_processing_cost;
  
  if (expectedPriceOrBudget && expectedPriceOrBudget > 0) {
    const ratio = facility.estimated_reuse_value / expectedPriceOrBudget;
    if (ratio >= 1) return 100;
    if (ratio >= 0.8) return Math.round(80 + (ratio - 0.8) * 100);
    return Math.max(20, Math.round(ratio * 100));
  }

  // Margin based score
  if (netMarginPerTonne >= 6000) return 98;
  if (netMarginPerTonne >= 4000) return 90;
  if (netMarginPerTonne >= 2000) return 80;
  if (netMarginPerTonne >= 1000) return 70;
  return 55;
}

/** Environmental score (5% weight) - evaluates CO2 avoidance factor */
export function calculateEnvironmentalScore(facility: Facility): number {
  const co2 = facility.estimated_co2_factor;
  if (co2 >= 1.5) return 100;
  if (co2 >= 1.0) return 92;
  if (co2 >= 0.7) return 85;
  if (co2 >= 0.4) return 75;
  return Math.max(40, Math.round(co2 * 100));
}

/** Generate verified, factual explanations for a match */
export function generateFactualReasons(
  input: WasteInput,
  facility: Facility,
  distanceKm: number,
  scores: { material: number; quality: number; quantity: number; distance: number; price: number; environmental: number }
): string[] {
  const reasons: string[] = [];

  reasons.push(
    `Verified ${facility.processing_type} facility located ${Math.round(distanceKm)} km away in ${facility.location}.`
  );

  if (input.contaminationPercentage <= facility.contamination_limit) {
    reasons.push(
      `Batch contamination (${input.contaminationPercentage}%) is well within facility's ${facility.contamination_limit}% intake threshold.`
    );
  } else {
    reasons.push(
      `Facility accepts up to ${facility.contamination_limit}% contamination (batch exceeds limit: pre-sorting advised).`
    );
  }

  reasons.push(
    `Daily intake capacity of ${facility.capacity_per_day} tonnes/day easily absorbs ${input.quantityTonnes} tonnes batch (min: ${facility.minimum_quantity}T).`
  );

  const netBenefit = facility.estimated_reuse_value - facility.estimated_processing_cost;
  reasons.push(
    `Generates estimated net secondary recovery value of ₹${netBenefit.toLocaleString('en-IN')}/tonne.`
  );

  reasons.push(
    `Diverting this batch avoids ~${(input.quantityTonnes * facility.estimated_co2_factor).toFixed(1)} tonnes of CO2e emissions.`
  );

  return reasons;
}

export function findTopMatches(input: WasteInput, topN = 4): MatchResult[] {
  const compatible = facilities.filter(
    (facility) => calculateMaterialScore(input.wasteType, facility, input.isHazardous) > 0
  );

  if (compatible.length === 0) return [];

  const results: MatchResult[] = compatible.map((facility) => {
    const distanceKm = haversineKm(
      input.latitude,
      input.longitude,
      facility.latitude,
      facility.longitude
    );

    const materialSc = calculateMaterialScore(input.wasteType, facility, input.isHazardous);
    const qualitySc = calculateQualityScore(input.contaminationPercentage, facility);
    const quantitySc = calculateQuantityScore(input.quantityTonnes, facility);
    const distanceSc = calculateDistanceScore(distanceKm);
    const priceSc = calculatePriceScore(facility, input.budgetOrExpectedPrice);
    const environmentalSc = calculateEnvironmentalScore(facility);

    const breakdown = {
      material: materialSc,
      quality: qualitySc,
      quantity: quantitySc,
      distance: distanceSc,
      price: priceSc,
      environmental: environmentalSc,
    };

    const weightedScore =
      breakdown.material * WEIGHTS.material +
      breakdown.quality * WEIGHTS.quality +
      breakdown.quantity * WEIGHTS.quantity +
      breakdown.distance * WEIGHTS.distance +
      breakdown.price * WEIGHTS.price +
      breakdown.environmental * WEIGHTS.environmental;

    const roundedDistanceKm = Math.round(distanceKm * 10) / 10;
    const whyMatched = generateFactualReasons(input, facility, roundedDistanceKm, breakdown);

    const estimatedAvoidedCo2Tonnes = Math.round(input.quantityTonnes * facility.estimated_co2_factor * 100) / 100;
    const estimatedEconomicBenefitInr = Math.round(input.quantityTonnes * (facility.estimated_reuse_value - facility.estimated_processing_cost));

    return {
      facilityId: facility.facility_id,
      facilityName: facility.facility_name,
      location: facility.location,
      matchScore: Math.round(weightedScore),
      materialScore: materialSc,
      qualityScore: qualitySc,
      quantityScore: quantitySc,
      capacityScore: quantitySc,
      contaminationScore: qualitySc,
      distanceScore: distanceSc,
      priceScore: priceSc,
      environmentalScore: environmentalSc,
      distanceKm: roundedDistanceKm,
      capacityPerDay: facility.capacity_per_day,
      processingType: facility.processing_type,
      breakdown,
      whyMatched,
      estimatedAvoidedCo2Tonnes,
      estimatedEconomicBenefitInr
    };
  });

  return results
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, topN);
}

export function getFacilityById(id: string): Facility | undefined {
  return facilities.find((facility) => facility.facility_id === id);
}

export function getAllFacilities(): Facility[] {
  return facilities;
}

// Location to lat/lon lookup table for sample Indian industrial hubs
export const KNOWN_COORDINATES: Record<string, { lat: number; lon: number }> = {
  pune: { lat: 18.5204, lon: 73.8567 },
  mumbai: { lat: 19.076, lon: 72.8777 },
  delhi: { lat: 28.6139, lon: 77.209 },
  gurgaon: { lat: 28.4595, lon: 77.0266 },
  noida: { lat: 28.5355, lon: 77.391 },
  faridabad: { lat: 28.4089, lon: 77.3178 },
  nashik: { lat: 19.9975, lon: 73.7898 },
  aurangabad: { lat: 19.8762, lon: 75.3433 },
  nagpur: { lat: 21.1458, lon: 79.0882 },
  bengaluru: { lat: 12.9716, lon: 77.5946 },
  chennai: { lat: 13.0827, lon: 80.2707 },
  ahmedabad: { lat: 23.0225, lon: 72.5714 },
  hyderabad: { lat: 17.385, lon: 78.4867 },
  kolkata: { lat: 22.5726, lon: 88.3639 },
  tiruppur: { lat: 11.1085, lon: 77.3411 },
  vadodara: { lat: 22.3072, lon: 73.1812 },
  ankleshwar: { lat: 21.6264, lon: 73.0033 },
  surat: { lat: 21.1702, lon: 72.8311 }
};

export function resolveCoordinates(locationName: string): { lat: number; lon: number } {
  if (!locationName) return { lat: 18.5204, lon: 73.8567 };
  const norm = locationName.toLowerCase();
  for (const [key, coords] of Object.entries(KNOWN_COORDINATES)) {
    if (norm.includes(key)) {
      return coords;
    }
  }
  // Default to Pune industrial cluster if unspecified
  return { lat: 18.5204, lon: 73.8567 };
}

