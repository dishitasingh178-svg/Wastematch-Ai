export type ContaminationLevel = 'None' | 'Low' | 'Medium' | 'High';
export type AvailabilityStatus = 'Available now' | 'Within 7 days' | 'Recurring monthly' | 'Custom schedule';
export type QualityRequirement = 'Low contamination' | 'Medium' | 'Flexible';

export interface EnvironmentalImpactEstimate {
  co2AvoidedKg: number;
  landfillDivertedKg: number;
  recoveredValueInr: number;
  energySavedKwh?: number;
}

export interface ComplianceInfo {
  materialClassification: string;
  documentationGuidance: string;
  facilityCompatibility: string;
  riskStatus: 'LOW RISK' | 'MODERATE RISK' | 'HIGH REGULATORY';
  hazardCategory: string;
  disclaimer: string;
}

export interface MatchMetrics {
  materialCompatibility: number; // percentage (e.g. 98)
  distanceScore: number;         // percentage (e.g. 91)
  quantityFit: number;           // percentage (e.g. 96)
  priceScore: number;            // percentage (e.g. 88)
  environmentalBenefit?: number; // percentage (e.g. 95)
  qualityScore?: number;         // percentage (e.g. 89)
}

export interface MatchItem {
  id: string;
  type: 'buyer' | 'seller';
  companyName: string;
  location: string;
  distanceKm: number;
  matchScore: number; // e.g. 94%
  materialName: string;
  materialTypeCategory: string;
  quantityStr: string;
  quantityTonnes: number;
  offerPriceStr: string;
  pricePerTonne: number;
  capacityOrFrequency: string;
  contaminationLevel: ContaminationLevel;
  tags: string[];
  imageUrl: string;
  metrics: MatchMetrics;
  aiRecommendation: string;
  compliance: ComplianceInfo;
  impact: EnvironmentalImpactEstimate;
  description: string;
  verifiedStatus: boolean;
  contactPerson?: {
    name: string;
    role: string;
    phone: string;
    email: string;
  };
}

export interface SellerListingPayload {
  materialName: string;
  materialCategory: string;
  quantityTonnes: number;
  unit: string;
  expectedPricePerUnit: number;
  location: string;
  availability: AvailabilityStatus;
  composition: string;
  contamination: ContaminationLevel;
  additionalNotes: string;
  imageUrl?: string;
  aiIdentifiedConfidence?: number;
  potentialUses?: string[];
}

export interface BuyerSearchPayload {
  materialName: string;
  quantityRequiredTonnes: number;
  preferredLocation: string;
  maxDistanceKm: number;
  budgetPerTonne: number;
  qualityRequirement: QualityRequirement;
  additionalRequirements: string;
}

export interface UserSession {
  isLoggedIn: boolean;
  userEmail: string;
  companyName: string;
  currentLocation: string;
}

export interface MatchHistoryEntry {
  id: string;
  matchedAt: string;
  matchItem: MatchItem;
  flowOrigin: 'seller' | 'buyer';
  status: 'Connected' | 'In Discussion' | 'Agreement Drafted' | 'Completed';
}
