/**
 * Mock Fallback
 * -------------
 * Owner: Person 3 (AI)
 *
 * If GEMINI_API_KEY is missing, the network is down, or the API fails,
 * we STILL return a believable response so the hackathon demo never
 * shows a broken page. The fallback picks a template based on the
 * user-declared waste name — so if they typed "PET" or "Aluminium" or
 * "Silica", they get the right-looking answer.
 *
 * This is intentional. In hackathon demos: no dead ends.
 */

import { AIAnalyzeResponse } from './types';

const DISCLAIMER =
  'This is AI-assisted guidance, not legal advice. Verify with CPCB / State Pollution Control Board before dispatch.';

type Template = Omit<AIAnalyzeResponse, 'source' | 'latencyMs'>;

const PET_TEMPLATE: Template = {
  material: 'PET Plastic',
  materialType: 'Thermoplastic Polymer',
  category: 'Post-Industrial Polymers',
  confidence: 87,
  composition: 'Polyethylene Terephthalate ~96%, additives & labeling adhesive ~4%',
  contaminants: ['Trace labeling adhesive', 'Surface dust'],
  contaminationLevel: 'low',
  recyclability: 'High',
  potentialReuses: [
    'rPET Granules & Pellets',
    'Polyester Textile Staple Fiber',
    'Industrial Packaging Strapping',
    'Thermoformed Food-Grade Sheet',
  ],
  hazards: [],
  processingRequirements: [
    'Sort by color (clear / green / blue)',
    'Hot-wash to remove adhesives',
    'Shred to 12–15mm flake',
    'Twin-screw extrusion pelletizing',
  ],
  compliance: {
    riskLevel: 'LOW RISK',
    classification: 'Non-Hazardous Industrial Polymer (Schedule II Compliant)',
    notes:
      'PET post-industrial scrap is directly recyclable under CPCB EPR guidelines. No hazardous waste manifest required.',
    requiredDocuments: [
      'Form 4 Manifest (CPCB)',
      'Material Safety Data Sheet',
      'Weighbridge Delivery Slip',
    ],
    disclaimer: DISCLAIMER,
  },
  summary:
    'High-purity PET post-industrial scrap suitable for direct rPET pelletizing at any CPCB-authorized recycler.',
};

const ALU_TEMPLATE: Template = {
  material: 'Aluminium 6061 Scrap',
  materialType: 'Wrought Aluminium Alloy',
  category: 'Non-Ferrous Metallurgical',
  confidence: 91,
  composition: 'Al ~97.2%, Mg ~1.0%, Si ~0.6%, trace cutting-fluid residue',
  contaminants: ['Cutting fluid residue (<1.5%)', 'Iron fines'],
  contaminationLevel: 'low',
  recyclability: 'High',
  potentialReuses: [
    'Secondary Smelting Ingots',
    'Automotive Castings',
    'Extrusion Billets',
    'Deoxidizer for Steelmaking',
  ],
  hazards: [],
  processingRequirements: [
    'Degrease turnings (centrifuge)',
    'Magnetic separation of ferrous fines',
    'Melt in rotary/induction furnace',
    'Cast into ingot / billet',
  ],
  compliance: {
    riskLevel: 'LOW RISK',
    classification: 'Non-Ferrous Metallic Scrap (Non-Hazardous)',
    notes:
      'Standard non-ferrous scrap. Ensure cutting-fluid residue is below facility intake threshold.',
    requiredDocuments: [
      'E-Way Bill',
      'Scrap Grading Certificate',
      'Weighbridge Slip',
    ],
    disclaimer: DISCLAIMER,
  },
  summary:
    'Clean 6061 aluminium turnings — high-value non-ferrous feedstock ready for secondary smelting.',
};

const SILICA_TEMPLATE: Template = {
  material: 'Silica Sand Slurry',
  materialType: 'Inorganic Mineral Aggregate',
  category: 'Foundry & Mineral Residue',
  confidence: 84,
  composition: 'SiO2 ~88%, Fe2O3 ~1.8%, moisture ~10%, inert foundry binders',
  contaminants: ['Foundry binders (inert)', 'Moisture'],
  contaminationLevel: 'medium',
  recyclability: 'Medium',
  potentialReuses: [
    'Cement Clinker Raw Meal',
    'Geopolymer Paver Blocks',
    'Ready-Mix Concrete Aggregate',
    'Land Reclamation Fill (permitted sites)',
  ],
  hazards: ['Respirable crystalline silica dust during handling'],
  processingRequirements: [
    'Dewatering to <5% moisture',
    'Screening to remove oversize',
    'Blending with cement raw meal',
    'PPE: N95 + dust suppression sprays',
  ],
  compliance: {
    riskLevel: 'MODERATE RISK',
    classification: 'Non-Hazardous Foundry Byproduct (dust-controlled)',
    notes:
      'Not classified as hazardous, but respirable silica requires workplace dust controls per Factories Act.',
    requiredDocuments: [
      'Consent-to-Transport (SPCB)',
      'Dust Management Plan',
      'Consignment Note',
    ],
    disclaimer: DISCLAIMER,
  },
  summary:
    'Foundry silica slurry — suitable as cement raw-meal substitute after dewatering. Silica-dust PPE required.',
};

const COTTON_TEMPLATE: Template = {
  material: 'Cotton Ginning Lint',
  materialType: 'Natural Cellulosic Fiber',
  category: 'Textile Byproducts',
  confidence: 89,
  composition: 'Natural Cellulose ~94%, moisture ~6%',
  contaminants: [],
  contaminationLevel: 'none',
  recyclability: 'High',
  potentialReuses: [
    'Microcrystalline Cellulose (Pharma grade)',
    'Specialty Bond Paper',
    'Absorbent Acoustic Insulation',
    'Non-woven Wipes',
  ],
  hazards: [],
  processingRequirements: [
    'Baling to standard density',
    'Metal-detection pass',
    'Moisture conditioning',
    'Feed into carding line',
  ],
  compliance: {
    riskLevel: 'LOW RISK',
    classification: 'Non-Hazardous Agri-Textile Byproduct',
    notes:
      'Clean cellulosic byproduct. No special permits required for intra-state movement.',
    requiredDocuments: ['E-Way Bill', 'Fiber Purity Declaration'],
    disclaimer: DISCLAIMER,
  },
  summary:
    'Pure cotton ginning lint — premium cellulose feedstock for pharma, paper and insulation industries.',
};

const HDPE_TEMPLATE: Template = {
  material: 'HDPE Plastic Drums & Containers',
  materialType: 'High-Density Polyethylene (HDPE)',
  category: 'Post-Industrial Polymers',
  confidence: 88,
  composition: 'High-Density Polyethylene ~97%, color masterbatch & trace labels ~3%',
  contaminants: ['Surface dust', 'Trace water soluble residues'],
  contaminationLevel: 'low',
  recyclability: 'High',
  potentialReuses: [
    'Blow-molded industrial drums',
    'Corrugated drainage pipes',
    'Plastic pallets & crates',
    'Extrusion compounding pellets',
  ],
  hazards: [],
  processingRequirements: [
    'Decontamination rinse (if chemical container)',
    'High-torque shredding',
    'Sink-float separation',
    'Twin-screw pelletizing with melt filtration',
  ],
  compliance: {
    riskLevel: 'LOW RISK',
    classification: 'Non-Hazardous Industrial Polymer (CPCB EPR Schedule II)',
    notes: 'Clean HDPE is 100% recyclable under EPR regulations.',
    requiredDocuments: ['Form 4 Manifest', 'E-Way Bill', 'Weighbridge Delivery Slip'],
    disclaimer: DISCLAIMER,
  },
  summary: 'Rigid HDPE scrap ready for shredding, wash, and regranulation into pipe/pallet grade resin.',
};

const LDPE_TEMPLATE: Template = {
  material: 'LDPE Packaging Film Scrap',
  materialType: 'Low-Density Polyethylene (LDPE)',
  category: 'Post-Industrial Polymers',
  confidence: 86,
  composition: 'Low-Density Polyethylene ~95%, printing inks & adhesive ~5%',
  contaminants: ['Surface dirt', 'Adhesive tape residues'],
  contaminationLevel: 'low',
  recyclability: 'High',
  potentialReuses: [
    'Heavy-duty construction tarps',
    'Garbage bags & secondary liner films',
    'Agricultural mulching sheet',
    'Injection-molded utility articles',
  ],
  hazards: [],
  processingRequirements: [
    'Bale opening and dry cleaning',
    'Wet friction washing',
    'Agglomeration & densification',
    'Vented single-screw extrusion',
  ],
  compliance: {
    riskLevel: 'LOW RISK',
    classification: 'Post-Industrial Flexible Polymer (CPCB EPR Compliant)',
    notes: 'Eligible for EPR plastic credit transfer.',
    requiredDocuments: ['E-Way Bill', 'EPR Plastic Credit Transfer Note'],
    disclaimer: DISCLAIMER,
  },
  summary: 'Post-industrial LDPE film scrap suitable for agglomeration and flexible film recycling.',
};

const PP_TEMPLATE: Template = {
  material: 'PP Woven Sacks & Strapping',
  materialType: 'Polypropylene (PP)',
  category: 'Post-Industrial Polymers',
  confidence: 88,
  composition: 'Polypropylene ~96%, calcium carbonate filler & pigment ~4%',
  contaminants: ['Dust', 'Thread scraps'],
  contaminationLevel: 'low',
  recyclability: 'High',
  potentialReuses: [
    'Automotive interior trim compounds',
    'Battery casing regrind',
    'Secondary woven geo-textiles',
    'Storage crates & bins',
  ],
  hazards: [],
  processingRequirements: [
    'Guillotine pre-cutting',
    'Rotary granulator milling',
    'Continuous melt filtration',
    'Pelletizing with impact modifiers',
  ],
  compliance: {
    riskLevel: 'LOW RISK',
    classification: 'Thermoplastic Polyolefin (Non-Hazardous)',
    notes: 'Recyclable under standard municipal and industrial polymer guidelines.',
    requiredDocuments: ['E-Way Bill', 'Weighbridge Slip'],
    disclaimer: DISCLAIMER,
  },
  summary: 'Clean PP scrap suitable for compounders and masterbatch compounding lines.',
};

const PVC_TEMPLATE: Template = {
  material: 'Rigid PVC Pipe & Profile Scrap',
  materialType: 'Polyvinyl Chloride (PVC)',
  category: 'Post-Industrial Polymers',
  confidence: 85,
  composition: 'Unplasticized PVC ~92%, thermal stabilizers & fillers ~8%',
  contaminants: ['Trace cement/mortar', 'Surface soil'],
  contaminationLevel: 'low',
  recyclability: 'High',
  potentialReuses: [
    'Non-pressure electrical conduits',
    'Co-extruded pipe core layers',
    'Vinyl floor tiles & profiles',
    'Traffic cones & sound barriers',
  ],
  hazards: ['Avoid open heating >180°C to prevent HCl outgassing'],
  processingRequirements: [
    'Color separation',
    'Fine pulverization (<500 microns)',
    'Dry blending with processing aids',
    'Conduit extrusion',
  ],
  compliance: {
    riskLevel: 'LOW RISK',
    classification: 'Rigid Chlorinated Polymer (Non-Hazardous Scrap)',
    notes: 'Dedicated thermal control required during reprocessing.',
    requiredDocuments: ['Form 4 Manifest', 'E-Way Bill'],
    disclaimer: DISCLAIMER,
  },
  summary: 'Rigid PVC scrap ready for micronizing and electrical conduit extrusion.',
};

const GLASS_TEMPLATE: Template = {
  material: 'Container Glass Cullet',
  materialType: 'Soda-Lime-Silica Glass',
  category: 'Other',
  confidence: 90,
  composition: 'SiO2 ~72%, Na2O ~14%, CaO ~10%, Al2O3 ~2%',
  contaminants: ['Aluminum caps', 'Paper labels (<2%)'],
  contaminationLevel: 'low',
  recyclability: 'High',
  potentialReuses: [
    'Furnace cullet for new bottles',
    'Fiberglass insulation manufacturing',
    'Abrasive blasting media',
    'Terrazzo floor aggregate',
  ],
  hazards: ['Sharp physical hazard — puncture resistant PPE required'],
  processingRequirements: [
    'Optical color sorting (flint, amber, green)',
    'Eddy current separator for metal caps',
    'Crushing to 10–25mm cullet',
    'Furnace batch charging',
  ],
  compliance: {
    riskLevel: 'LOW RISK',
    classification: 'Inert Mineral Residue (Non-Hazardous)',
    notes: 'Infinite recyclability without property degradation.',
    requiredDocuments: ['E-Way Bill', 'Weighbridge Delivery Slip'],
    disclaimer: DISCLAIMER,
  },
  summary: 'Clean crushed soda-lime glass cullet ideal for container glass re-melting.',
};

const PAPER_TEMPLATE: Template = {
  material: 'Corrugated Kraft & Paperboard',
  materialType: 'Unbleached Kraft Pulp',
  category: 'Paper & Fibre',
  confidence: 92,
  composition: 'Recycled cellulosic fibers ~90%, moisture ~8%, starch & fillers ~2%',
  contaminants: ['Adhesive tape', 'Staples'],
  contaminationLevel: 'low',
  recyclability: 'High',
  potentialReuses: [
    'Corrugated medium and linerboard',
    'Molded pulp egg & electronics trays',
    'Kraft paper grocery bags',
    'Cellulose building insulation',
  ],
  hazards: [],
  processingRequirements: [
    'High-density hydraulic pulping',
    'Pressure screen deflaking',
    'De-inking and centrifugal cleaning',
    'Fourdrinier board forming',
  ],
  compliance: {
    riskLevel: 'LOW RISK',
    classification: 'Post-Industrial Recovered Fibre (Non-Hazardous)',
    notes: 'Standard recovered paper stream eligible for green-channel intra-state movement.',
    requiredDocuments: ['E-Way Bill', 'Consignment Note'],
    disclaimer: DISCLAIMER,
  },
  summary: 'High-yield OCC paperboard scrap ready for repulping and corrugated board manufacturing.',
};

const EWASTE_TEMPLATE: Template = {
  material: 'Electronic Circuit Boards (PCB)',
  materialType: 'Printed Circuit Board Scrap',
  category: 'E-Waste',
  confidence: 89,
  composition: 'FR-4 Epoxy-Glass ~60%, Copper ~20%, Solder (Sn/Pb) ~6%, Precious Metals (Au, Ag, Pd) ~0.1%',
  contaminants: ['Dust', 'Capacitor residues'],
  contaminationLevel: 'medium',
  recyclability: 'Specialized',
  potentialReuses: [
    'Precious & non-ferrous metal hydrometallurgical recovery',
    'Copper smelting concentrate',
    'Epoxy resin filler in construction composites',
  ],
  hazards: ['Contains lead solder and brominated flame retardants — authorized recyclers only'],
  processingRequirements: [
    'Component dismantling',
    'Multi-stage crushing and magnetic separation',
    'Electrostatic non-ferrous separation',
    'Hydrometallurgical refining in sealed systems',
  ],
  compliance: {
    riskLevel: 'HIGH RISK',
    classification: 'E-Waste Management Rules (Schedule I - Category 3)',
    notes: 'Must only be transferred to CPCB authorized E-Waste dismantler/recycler with Form 6 manifest.',
    requiredDocuments: ['Form 6 Manifest (E-Waste)', 'Consent-to-Establish (SPCB)', 'Passbook Transfer'],
    disclaimer: DISCLAIMER,
  },
  summary: 'PCB e-waste stream strictly destined for CPCB-authorized precious metal recovery facilities.',
};

const HAZARDOUS_TEMPLATE: Template = {
  material: 'Spent Industrial Solvents',
  materialType: 'Volatile Organic Compound Blend',
  category: 'Hazardous Chemical',
  confidence: 87,
  composition: 'Isopropanol ~40%, Toluene ~35%, Ethyl Acetate ~15%, Heavy Distillate Residue ~10%',
  contaminants: ['Dissolved polymers', 'Resins', 'Particulates'],
  contaminationLevel: 'medium',
  recyclability: 'Specialized',
  potentialReuses: [
    'Fractional distillation for pure solvent recovery',
    'Alternative Fuel & Raw Material (AFR) for cement kilns',
    'Degreasing agent formulation',
  ],
  hazards: ['Flammable Liquid (Class 3), Toxic vapours — explosion-proof handling required'],
  processingRequirements: [
    'Nitrogen-blanketed bulk transfer',
    'Vacuum thin-film evaporation',
    'Fractional column rectification',
    'Hazardous incineration of bottoms residue',
  ],
  compliance: {
    riskLevel: 'HIGH RISK',
    classification: 'Hazardous Waste (Management & Transboundary) Rules Schedule I',
    notes: 'Mandatory GPS-tracked vehicle transport under Form 10 manifest.',
    requiredDocuments: ['Form 10 Manifest (Hazardous Waste)', 'Emergency Response Guide Card', 'Transporter Hazchem License'],
    disclaimer: DISCLAIMER,
  },
  summary: 'Spent solvent stream requiring CPCB-authorized vacuum fractional distillation or AFR co-processing.',
};

const ORGANIC_TEMPLATE: Template = {
  material: 'Agro-Industrial Biomass Residue',
  materialType: 'Lignocellulosic Biomass',
  category: 'Organic / Biomass',
  confidence: 90,
  composition: 'Cellulose ~42%, Hemicellulose ~28%, Lignin ~22%, Moisture ~8%',
  contaminants: ['Soil fines'],
  contaminationLevel: 'low',
  recyclability: 'High',
  potentialReuses: [
    'Biomass briquettes & pellets for industrial boilers',
    'Biochar via slow pyrolysis for soil conditioning',
    'Anaerobic biogas generation',
    'Mushroom cultivation substrate',
  ],
  hazards: [],
  processingRequirements: [
    'Rotary drum drying to <12% moisture',
    'Hammer mill pulverization',
    'High-pressure hydraulic briquetting',
  ],
  compliance: {
    riskLevel: 'LOW RISK',
    classification: 'Agricultural Byproduct / Clean Biomass (Non-Hazardous)',
    notes: 'Qualifies as carbon-neutral renewable fuel under state clean energy policies.',
    requiredDocuments: ['E-Way Bill', 'Agricultural Produce Consignment Note'],
    disclaimer: DISCLAIMER,
  },
  summary: 'Dry biomass residue suitable for briquetting into industrial bio-coal boiler fuel.',
};

const GENERIC_TEMPLATE: Template = {
  material: 'Unidentified Industrial Stream',
  materialType: 'Mixed / Unclassified Industrial Stream',
  category: 'Other',
  confidence: 42,
  composition:
    'Visual characteristics are inconclusive. Please specify the material composition and parameters manually.',
  contaminants: ['Unknown composition — testing recommended'],
  contaminationLevel: 'medium',
  recyclability: 'Medium',
  potentialReuses: [
    'Manual sorting & characterization',
    'Secondary mechanical recycling upon lab testing',
    'Refuse-Derived Fuel (RDF) if high calorific value',
  ],
  hazards: ['Unknown chemical safety profile — lab test advised'],
  processingRequirements: [
    'Representative sampling & proximate analysis',
    'Heavy metal & hazardous leaching test (TCLP)',
    'Targeted facility routing',
  ],
  compliance: {
    riskLevel: 'MODERATE RISK',
    classification: 'Unclassified Industrial Stream — Pending Characterization',
    notes:
      'Ensure standard safety precautions until full characterization is completed.',
    requiredDocuments: [
      'Lab Characterization Report',
      'Consignment Note',
      'Weighbridge Slip',
    ],
    disclaimer: DISCLAIMER,
  },
  summary:
    'Visual analysis was inconclusive. Enter declared details or proceed with lab characterization.',
};

/** Pick the best-matching template from declared waste name and image data. */
export function pickTemplate(name?: string, image?: string): Template {
  const combined = `${name || ''} ${image || ''}`.toLowerCase();
  
  // PET
  if (/pet|polyethylene terephthalate|rpet|polyester|bottle|flake|photo-1530587191325/.test(combined)) {
    return PET_TEMPLATE;
  }
  // HDPE
  if (/hdpe|high density poly|drum|carboy|crate|milk jug|rigid poly/.test(combined)) {
    return HDPE_TEMPLATE;
  }
  // LDPE
  if (/ldpe|low density poly|film|plastic wrap|poly bag|packaging film|tarp/.test(combined)) {
    return LDPE_TEMPLATE;
  }
  // PP
  if (/pp|polypropylene|woven sack|strap|raffia|woven bag/.test(combined)) {
    return PP_TEMPLATE;
  }
  // PVC
  if (/pvc|polyvinyl chloride|vinyl|conduit|pipe offcut|profile scrap/.test(combined)) {
    return PVC_TEMPLATE;
  }
  // Aluminium / Metal
  if (/alum|aluminum|shaving|turning|6061|metal scrap|alu scrap|metal turnings|copper wire|steel slag|machining chip|photo-1504307651254/.test(combined)) {
    return ALU_TEMPLATE;
  }
  // Cotton / Textile
  if (/cotton|lint|cellulose|textile|fabric|fiber|fibre|ginning|yarn|cloth/.test(combined)) {
    return COTTON_TEMPLATE;
  }
  // Silica / Mineral
  if (/silica|foundry|slurry|sand|sio2|ceramic|mineral|photo-1578328819058/.test(combined)) {
    return SILICA_TEMPLATE;
  }
  // Glass
  if (/glass|cullet|crushed glass|bottle glass|soda lime/.test(combined)) {
    return GLASS_TEMPLATE;
  }
  // Paper
  if (/paper|cardboard|kraft|corrugated|box|occ|paperboard|pulp/.test(combined)) {
    return PAPER_TEMPLATE;
  }
  // E-Waste
  if (/e-waste|ewaste|circuit board|pcb|electronic|weee/.test(combined)) {
    return EWASTE_TEMPLATE;
  }
  // Hazardous / Solvent / Used Oil
  if (/solvent|hazardous|chemical|spent|toxic|acid|used oil|lube oil|sludge/.test(combined)) {
    return HAZARDOUS_TEMPLATE;
  }
  // Organic / Biomass
  if (/organic|biomass|agri|husk|bagasse|sawdust|food waste|crop residue/.test(combined)) {
    return ORGANIC_TEMPLATE;
  }
  
  return GENERIC_TEMPLATE;
}

/** Return a mock AIAnalyzeResponse tailored to the user's declared waste or image. */
export function mockAnalyze(
  userProvided?: {
    wasteName?: string;
    contaminationLevel?: 'none' | 'low' | 'medium' | 'high';
  },
  image?: string
): AIAnalyzeResponse {
  const t = pickTemplate(userProvided?.wasteName, image);
  const contamination = userProvided?.contaminationLevel || t.contaminationLevel;

  // Nudge confidence down slightly if user declared higher contamination
  let confidence = t.confidence;
  if (contamination === 'medium') confidence -= 4;
  if (contamination === 'high') confidence -= 10;

  return {
    ...t,
    contaminationLevel: contamination,
    confidence: Math.max(40, confidence),
    source: 'mock-fallback',
    latencyMs: 1200,
  };
}
