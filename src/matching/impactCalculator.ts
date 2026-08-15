import type { Facility, ImpactResult } from "./types";

export interface ImpactInput {
  quantityTonnes: number;
  distanceKm: number;
  facility: Facility;
  avoidedDisposalCostPerTonne?: number;
  transportCostPerTonneKm?: number;
}

export function calculateImpact(input: ImpactInput): ImpactResult {
  const avoidedDisposalCostPerTonne =
    input.avoidedDisposalCostPerTonne ?? 4000;
  const transportCostPerTonneKm =
    input.transportCostPerTonneKm ?? 15;

  const avoidedDisposalCost =
    input.quantityTonnes * avoidedDisposalCostPerTonne;

  const processingCost =
    input.quantityTonnes * input.facility.estimated_processing_cost;

  const transportCost =
    input.quantityTonnes *
    input.distanceKm *
    transportCostPerTonneKm;

  const estimatedEconomicBenefit =
    input.quantityTonnes * input.facility.estimated_reuse_value +
    avoidedDisposalCost -
    processingCost -
    transportCost;

  const estimatedCo2AvoidedTonnes =
    input.quantityTonnes * input.facility.estimated_co2_factor;

  return {
    estimatedAvoidedDisposalCost: Math.round(avoidedDisposalCost),
    estimatedProcessingCost: Math.round(processingCost),
    estimatedTransportCost: Math.round(transportCost),
    estimatedEconomicBenefit: Math.round(estimatedEconomicBenefit),
    wasteDivertedTonnes: input.quantityTonnes,
    estimatedCo2AvoidedTonnes:
      Math.round(estimatedCo2AvoidedTonnes * 100) / 100,
  };
}
