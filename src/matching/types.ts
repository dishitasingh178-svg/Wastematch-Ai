export interface WasteInput {
  wasteType: string;
  quantityTonnes: number;
  latitude: number;
  longitude: number;
  contaminationPercentage: number;
  isHazardous?: boolean;
  budgetOrExpectedPrice?: number;
}

export interface Facility {
  facility_id: string;
  facility_name: string;
  accepted_waste_types: string[];
  location: string;
  latitude: number;
  longitude: number;
  capacity_per_day: number;
  minimum_quantity: number;
  contamination_limit: number;
  processing_type: string;
  estimated_processing_cost: number;
  estimated_reuse_value: number;
  estimated_co2_factor: number;
  is_hazardous?: boolean;
}

export interface MatchScoreBreakdown {
  material: number;
  quality: number;
  quantity: number;
  distance: number;
  price: number;
  environmental: number;
}

export interface MatchResult {
  facilityId: string;
  facilityName: string;
  location: string;
  matchScore: number;
  materialScore: number;
  qualityScore: number;
  quantityScore: number;
  capacityScore: number;
  contaminationScore: number;
  distanceScore: number;
  priceScore: number;
  environmentalScore: number;
  distanceKm: number;
  capacityPerDay: number;
  processingType: string;
  breakdown: MatchScoreBreakdown;
  whyMatched: string[];
  estimatedAvoidedCo2Tonnes: number;
  estimatedEconomicBenefitInr: number;
}

export interface ImpactResult {
  estimatedAvoidedDisposalCost: number;
  estimatedProcessingCost: number;
  estimatedTransportCost: number;
  estimatedEconomicBenefit: number;
  wasteDivertedTonnes: number;
  estimatedCo2AvoidedTonnes: number;
}
