import { findTopMatches, getFacilityById } from "../src/matching/matchingEngine";
import { calculateImpact } from "../src/matching/impactCalculator";

const input = {
  wasteType: "Steel Slag",
  quantityTonnes: 20,
  latitude: 18.5204,
  longitude: 73.8567,
  contaminationPercentage: 5,
};

const matches = findTopMatches(input);

console.log("\nWasteMatch AI — Person 4 Demo");
console.log("Input:", input);
console.table(matches);

if (matches.length > 0) {
  const selected = matches[0];
  const facility = getFacilityById(selected.facilityId);

  if (facility) {
    const impact = calculateImpact({
      quantityTonnes: input.quantityTonnes,
      distanceKm: selected.distanceKm,
      facility,
    });

    console.log("\nSelected match:", selected.facilityName);
    console.log("Impact:", impact);
  }
}
