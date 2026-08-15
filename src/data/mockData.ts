import { MatchItem, SellerListingPayload, BuyerSearchPayload, MatchHistoryEntry } from '../types';

export const DEFAULT_SELLER_LISTING: SellerListingPayload = {
  materialName: 'Silica Waste',
  materialCategory: 'Silica / mineral waste',
  quantityTonnes: 15,
  unit: 'tonnes',
  expectedPricePerUnit: 7000,
  location: 'Pune, Maharashtra',
  availability: 'Available now',
  composition: 'SiO2 content > 88%, moisture < 4%',
  contamination: 'Low',
  additionalNotes: 'Generated from precision foundry casting operations. Clean dry storage in covered industrial bay.',
  imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
  aiIdentifiedConfidence: 92,
  potentialUses: [
    'Cement production & pozzolanic binder',
    'Precast concrete & construction materials',
    'Industrial abrasive & foundry sand reprocessing'
  ]
};

export const DEFAULT_BUYER_SEARCH: BuyerSearchPayload = {
  materialName: 'Silica Waste',
  quantityRequiredTonnes: 15,
  preferredLocation: 'Pune, Maharashtra',
  maxDistanceKm: 100,
  budgetPerTonne: 7500,
  qualityRequirement: 'Low contamination',
  additionalRequirements: 'Requires moisture level under 5% and particle size < 2mm for clinker substitution.'
};

export const POPULAR_MATERIALS = [
  'Silica',
  'PET',
  'HDPE',
  'Aluminium',
  'Steel',
  'Textile waste',
  'Glass',
  'Paper'
];

export const DEMO_BUYER_MATCHES: MatchItem[] = [
  {
    id: 'buyer-match-1',
    type: 'buyer',
    companyName: 'EcoCement Industries',
    location: 'Pune, Maharashtra',
    distanceKm: 24,
    matchScore: 94,
    materialName: 'Silica Waste',
    materialTypeCategory: 'Industrial Mineral Byproduct',
    quantityStr: '10–20 tonnes',
    quantityTonnes: 15,
    offerPriceStr: '₹7,000 / tonne',
    pricePerTonne: 7000,
    capacityOrFrequency: '15 tonnes/day processing capacity',
    contaminationLevel: 'Low',
    tags: ['MATERIAL COMPATIBLE', 'CAPACITY AVAILABLE', 'NEARBY'],
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    metrics: {
      materialCompatibility: 98,
      distanceScore: 91,
      quantityFit: 96,
      priceScore: 88,
      environmentalBenefit: 95
    },
    aiRecommendation: 'This buyer is a strong match because they can process your material locally and their required quantity closely matches your available supply.',
    compliance: {
      materialClassification: 'Non-hazardous industrial secondary raw material (CPCB Cat. IV)',
      documentationGuidance: 'Form 10 manifest & standard manifest under Solid Waste Rules 2016',
      facilityCompatibility: 'Certified Co-processing Kiln with continuous emissions monitoring',
      riskStatus: 'LOW RISK',
      hazardCategory: 'Inert Mineral Matrix',
      disclaimer: 'AI-assisted guidance only. Verify applicable regulations and documentation with the relevant authority before transportation or processing.'
    },
    impact: {
      co2AvoidedKg: 420,
      landfillDivertedKg: 500,
      recoveredValueInr: 105000,
      energySavedKwh: 1250
    },
    description: 'EcoCement Industries operates state-of-the-art green cement kilns in Chakan industrial corridor, actively sourcing pozzolanic mineral waste for clinker replacement.',
    verifiedStatus: true,
    contactPerson: {
      name: 'Dr. Rajesh Deshmukh',
      role: 'Head of Circular Procurement',
      phone: '+91 98230 45892',
      email: 'r.deshmukh@ecocement.in'
    }
  },
  {
    id: 'buyer-match-2',
    type: 'buyer',
    companyName: 'BuildCore Materials',
    location: 'Mumbai, Maharashtra',
    distanceKm: 146,
    matchScore: 89,
    materialName: 'Silica Waste',
    materialTypeCategory: 'Aggregates & Mineral Binders',
    quantityStr: '5–25 tonnes',
    quantityTonnes: 20,
    offerPriceStr: '₹6,500 / tonne',
    pricePerTonne: 6500,
    capacityOrFrequency: '20 tonnes/day capacity',
    contaminationLevel: 'Low',
    tags: ['HIGH VOLUME', 'FAST PAYOUT', 'EXPANDING CAPACITY'],
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    metrics: {
      materialCompatibility: 94,
      distanceScore: 78,
      quantityFit: 94,
      priceScore: 84,
      environmentalBenefit: 91
    },
    aiRecommendation: 'High regular volume capability with streamlined logistics transit via Mumbai-Pune Expressway.',
    compliance: {
      materialClassification: 'Approved secondary aggregate for structural fill',
      documentationGuidance: 'Requires green transit dispatch pass & batch QA report',
      facilityCompatibility: 'ISO 14001 certified precast facility',
      riskStatus: 'LOW RISK',
      hazardCategory: 'Non-Hazardous Silicate',
      disclaimer: 'AI-assisted guidance only. Verify applicable regulations and documentation with the relevant authority before transportation or processing.'
    },
    impact: {
      co2AvoidedKg: 380,
      landfillDivertedKg: 480,
      recoveredValueInr: 97500,
      energySavedKwh: 1100
    },
    description: 'Leading manufacturer of eco-pavers, AAC blocks, and modular precast building units with dedicated receiving docks in Navi Mumbai.',
    verifiedStatus: true,
    contactPerson: {
      name: 'Pooja Mehta',
      role: 'Sustainable Supply Chain Manager',
      phone: '+91 97110 32984',
      email: 'p.mehta@buildcore.com'
    }
  },
  {
    id: 'buyer-match-3',
    type: 'buyer',
    companyName: 'GreenStone Processing',
    location: 'Nashik, Maharashtra',
    distanceKm: 180,
    matchScore: 84,
    materialName: 'Silica Waste',
    materialTypeCategory: 'Ceramics & Refractory Filler',
    quantityStr: '10–15 tonnes',
    quantityTonnes: 12,
    offerPriceStr: '₹6,200 / tonne',
    pricePerTonne: 6200,
    capacityOrFrequency: '12 tonnes/day batching',
    contaminationLevel: 'Low',
    tags: ['SPECIALIZED PROCESSOR', 'STEADY OFFTAKE'],
    imageUrl: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80',
    metrics: {
      materialCompatibility: 92,
      distanceScore: 71,
      quantityFit: 91,
      priceScore: 80,
      environmentalBenefit: 88
    },
    aiRecommendation: 'Consistent offtake partner with flexible delivery windows and specialized ceramic slip processing.',
    compliance: {
      materialClassification: 'Raw material feedstock grade silica',
      documentationGuidance: 'Standard commercial invoice + e-Way bill',
      facilityCompatibility: 'State Pollution Board authorized recycling unit',
      riskStatus: 'LOW RISK',
      hazardCategory: 'Inert Mineral Matrix',
      disclaimer: 'AI-assisted guidance only. Verify applicable regulations and documentation with the relevant authority before transportation or processing.'
    },
    impact: {
      co2AvoidedKg: 340,
      landfillDivertedKg: 450,
      recoveredValueInr: 93000,
      energySavedKwh: 980
    },
    description: 'Specializes in high-temperature refractory linings, foundry sand reconditioning, and ceramic tile glazes.',
    verifiedStatus: true,
    contactPerson: {
      name: 'Vikram Joshi',
      role: 'Operations Director',
      phone: '+91 99300 81293',
      email: 'v.joshi@greenstone.in'
    }
  },
  {
    id: 'buyer-match-4',
    type: 'buyer',
    companyName: 'Maharashtra Refractories Ltd',
    location: 'Aurangabad, Maharashtra',
    distanceKm: 220,
    matchScore: 81,
    materialName: 'Silica Waste',
    materialTypeCategory: 'High Alumina & Silica Refractory',
    quantityStr: '15–30 tonnes',
    quantityTonnes: 25,
    offerPriceStr: '₹6,000 / tonne',
    pricePerTonne: 6000,
    capacityOrFrequency: '25 tonnes/day',
    contaminationLevel: 'Medium',
    tags: ['HIGH CAPACITY', 'RECURRING CONTRACT'],
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    metrics: {
      materialCompatibility: 91,
      distanceScore: 68,
      quantityFit: 88,
      priceScore: 76,
      environmentalBenefit: 86
    },
    aiRecommendation: 'Large-scale industrial manufacturer capable of handling high annual volume commitments.',
    compliance: {
      materialClassification: 'High grade silica additive for kiln insulation',
      documentationGuidance: 'Consignment tracking & MPCB Consent to Operate valid',
      facilityCompatibility: 'Automated thermal blending plant',
      riskStatus: 'LOW RISK',
      hazardCategory: 'Inert Material',
      disclaimer: 'AI-assisted guidance only. Verify applicable regulations and documentation with the relevant authority before transportation or processing.'
    },
    impact: {
      co2AvoidedKg: 310,
      landfillDivertedKg: 420,
      recoveredValueInr: 90000,
      energySavedKwh: 890
    },
    description: 'Industrial supplier to steel and glass melt facilities across Western India.',
    verifiedStatus: true
  },
  {
    id: 'buyer-match-5',
    type: 'buyer',
    companyName: 'Apex Precast Elements',
    location: 'Pune, Maharashtra',
    distanceKm: 38,
    matchScore: 79,
    materialName: 'Silica Waste',
    materialTypeCategory: 'Concrete Matrix Modifiers',
    quantityStr: '8–12 tonnes',
    quantityTonnes: 10,
    offerPriceStr: '₹6,100 / tonne',
    pricePerTonne: 6100,
    capacityOrFrequency: '8 tonnes/day',
    contaminationLevel: 'None',
    tags: ['HYPER-LOCAL', 'ZERO EMISSIONS FREIGHT'],
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=800&q=80',
    metrics: {
      materialCompatibility: 86,
      distanceScore: 94,
      quantityFit: 78,
      priceScore: 74,
      environmentalBenefit: 94
    },
    aiRecommendation: 'Very close proximity minimizes transport freight emissions and turnaround time.',
    compliance: {
      materialClassification: 'Fine aggregate substitute',
      documentationGuidance: 'Standard local transfer manifest',
      facilityCompatibility: 'Precast manufacturing yard',
      riskStatus: 'LOW RISK',
      hazardCategory: 'Non-Hazardous',
      disclaimer: 'AI-assisted guidance only. Verify applicable regulations and documentation with the relevant authority before transportation or processing.'
    },
    impact: {
      co2AvoidedKg: 450,
      landfillDivertedKg: 490,
      recoveredValueInr: 91500,
      energySavedKwh: 1300
    },
    description: 'Produces architectural panels, drainage conduits, and civil engineering infrastructure for Pune metro area.',
    verifiedStatus: true
  },
  {
    id: 'buyer-match-6',
    type: 'buyer',
    companyName: 'EcoPave Infrastructure',
    location: 'Thane, Maharashtra',
    distanceKm: 130,
    matchScore: 76,
    materialName: 'Silica Waste',
    materialTypeCategory: 'Road Base & Permeable Pavements',
    quantityStr: '20 tonnes',
    quantityTonnes: 20,
    offerPriceStr: '₹5,900 / tonne',
    pricePerTonne: 5900,
    capacityOrFrequency: '30 tonnes/day',
    contaminationLevel: 'Medium',
    tags: ['MUNICIPAL PROJECTS', 'BULK DISPOSAL'],
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    metrics: {
      materialCompatibility: 83,
      distanceScore: 79,
      quantityFit: 81,
      priceScore: 70,
      environmentalBenefit: 87
    },
    aiRecommendation: 'Good for rapid bulk material offloading when local high-value processors have filled quotas.',
    compliance: {
      materialClassification: 'Civil works recycled mineral filler',
      documentationGuidance: 'PWD green specification compliance sheet',
      facilityCompatibility: 'Batch asphalt & pavement plant',
      riskStatus: 'LOW RISK',
      hazardCategory: 'Inert',
      disclaimer: 'AI-assisted guidance only. Verify applicable regulations and documentation with the relevant authority before transportation or processing.'
    },
    impact: {
      co2AvoidedKg: 290,
      landfillDivertedKg: 410,
      recoveredValueInr: 88500,
      energySavedKwh: 820
    },
    description: 'Infrastructure contractor executing green highway shoulder stabilization and interlocking pavement projects.',
    verifiedStatus: true
  }
];

export const DEMO_SELLER_MATCHES: MatchItem[] = [
  {
    id: 'seller-match-1',
    type: 'seller',
    companyName: 'Company A (Precision Foundries)',
    location: 'Pune, Maharashtra',
    distanceKm: 24,
    matchScore: 94,
    materialName: 'Silica Waste',
    materialTypeCategory: 'High-purity Foundry Sand Residue',
    quantityStr: '15 tonnes available',
    quantityTonnes: 15,
    offerPriceStr: '₹6,800 / tonne',
    pricePerTonne: 6800,
    capacityOrFrequency: 'Ready for pickup (Bay 4)',
    contaminationLevel: 'Low',
    tags: ['GOOD QUALITY', 'WITHIN BUDGET', 'NEARBY'],
    imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
    metrics: {
      materialCompatibility: 98,
      distanceScore: 94,
      priceScore: 91,
      quantityFit: 96,
      qualityScore: 89
    },
    aiRecommendation: 'This listing closely matches your requested quantity, budget and location.',
    compliance: {
      materialClassification: 'Cleaned foundry casting silica fines',
      documentationGuidance: 'Ready with Form 10 & lab sieve analysis certificate',
      facilityCompatibility: 'Compatible with standard pneumatic bulkers',
      riskStatus: 'LOW RISK',
      hazardCategory: 'Inert Mineral Matrix',
      disclaimer: 'AI-assisted guidance only. Verify applicable regulations and documentation with the relevant authority before transportation or processing.'
    },
    impact: {
      co2AvoidedKg: 420,
      landfillDivertedKg: 500,
      recoveredValueInr: 102000,
      energySavedKwh: 1250
    },
    description: 'Automated automotive casting plant producing uniform, dry silica sand by-product. Batch tested for grain fineness number (GFN 55-60).',
    verifiedStatus: true,
    contactPerson: {
      name: 'Anil Kulkarni',
      role: 'Plant Operations Lead',
      phone: '+91 98221 00341',
      email: 'a.kulkarni@company-a.com'
    }
  },
  {
    id: 'seller-match-2',
    type: 'seller',
    companyName: 'Deccan Foundry Byproducts',
    location: 'Pune MIDC, Maharashtra',
    distanceKm: 31,
    matchScore: 91,
    materialName: 'Silica Waste',
    materialTypeCategory: 'Reconditioned Quartz & Silica',
    quantityStr: '20 tonnes available',
    quantityTonnes: 20,
    offerPriceStr: '₹6,600 / tonne',
    pricePerTonne: 6600,
    capacityOrFrequency: 'Weekly recurring batch',
    contaminationLevel: 'Low',
    tags: ['HIGH PURITY', 'CONSISTENT VOLUME', 'EXCELLENT PRICE'],
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    metrics: {
      materialCompatibility: 95,
      distanceScore: 92,
      priceScore: 95,
      quantityFit: 90,
      qualityScore: 88
    },
    aiRecommendation: 'Exceptional price-to-quality ratio located inside Bhosari MIDC with direct weighbridge access.',
    compliance: {
      materialClassification: 'Thermally treated foundry sand',
      documentationGuidance: 'Certified non-toxic residue testing sheet provided',
      facilityCompatibility: 'Standard tipper or jumbo bag transport',
      riskStatus: 'LOW RISK',
      hazardCategory: 'Inert Material',
      disclaimer: 'AI-assisted guidance only. Verify applicable regulations and documentation with the relevant authority before transportation or processing.'
    },
    impact: {
      co2AvoidedKg: 490,
      landfillDivertedKg: 620,
      recoveredValueInr: 132000,
      energySavedKwh: 1450
    },
    description: 'Specialized metallurgical cluster producing uniform silica waste with consistent thermal stability.',
    verifiedStatus: true,
    contactPerson: {
      name: 'Sunil Shinde',
      role: 'Materials Logistics Head',
      phone: '+91 98450 12890',
      email: 's.shinde@deccanfoundry.in'
    }
  },
  {
    id: 'seller-match-3',
    type: 'seller',
    companyName: 'Western Glass & Silica Works',
    location: 'Talegaon, Maharashtra',
    distanceKm: 42,
    matchScore: 88,
    materialName: 'Silica Waste',
    materialTypeCategory: 'Cullet & Crushed Silica Grain',
    quantityStr: '12 tonnes available',
    quantityTonnes: 12,
    offerPriceStr: '₹6,900 / tonne',
    pricePerTonne: 6900,
    capacityOrFrequency: 'Bagged & palletized',
    contaminationLevel: 'None',
    tags: ['VIRGIN SCRAP', 'ZERO CONTAMINATION', 'PRE-PACKAGED'],
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    metrics: {
      materialCompatibility: 96,
      distanceScore: 87,
      priceScore: 86,
      quantityFit: 84,
      qualityScore: 98
    },
    aiRecommendation: 'Ultra-low contamination suitable for sensitive industrial chemistry or high-grade white cement blends.',
    compliance: {
      materialClassification: 'Food-grade glass plant silica cutoff',
      documentationGuidance: 'Full XRF chemical spectroscopy certificate included',
      facilityCompatibility: 'Standard 1-tonne jumbo bag handling',
      riskStatus: 'LOW RISK',
      hazardCategory: 'Inert Mineral',
      disclaimer: 'AI-assisted guidance only. Verify applicable regulations and documentation with the relevant authority before transportation or processing.'
    },
    impact: {
      co2AvoidedKg: 390,
      landfillDivertedKg: 430,
      recoveredValueInr: 82800,
      energySavedKwh: 1150
    },
    description: 'Container glass manufacturing facility with rigorous magnetic separation and dedusting steps.',
    verifiedStatus: true,
    contactPerson: {
      name: 'Kavita Iyer',
      role: 'Quality & Byproducts Manager',
      phone: '+91 97630 55120',
      email: 'k.iyer@westernglass.com'
    }
  },
  {
    id: 'seller-match-4',
    type: 'seller',
    companyName: 'Zenith Industrial Minerals',
    location: 'Navi Mumbai, Maharashtra',
    distanceKm: 110,
    matchScore: 82,
    materialName: 'Silica Waste',
    materialTypeCategory: 'Washed Quarry Fines & Silica Silt',
    quantityStr: '25 tonnes available',
    quantityTonnes: 25,
    offerPriceStr: '₹6,400 / tonne',
    pricePerTonne: 6400,
    capacityOrFrequency: 'Bulk stockpiled',
    contaminationLevel: 'Medium',
    tags: ['HIGH VOLUME', 'BUDGET FRIENDLY'],
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    metrics: {
      materialCompatibility: 88,
      distanceScore: 74,
      priceScore: 94,
      quantityFit: 82,
      qualityScore: 78
    },
    aiRecommendation: 'Attractive volume pricing if your facility includes an in-line coarse screener.',
    compliance: {
      materialClassification: 'Secondary processed mineral fines',
      documentationGuidance: 'Mining department clearance & transport challan',
      facilityCompatibility: 'Heavy tipper trucks only',
      riskStatus: 'LOW RISK',
      hazardCategory: 'Inert Silt',
      disclaimer: 'AI-assisted guidance only. Verify applicable regulations and documentation with the relevant authority before transportation or processing.'
    },
    impact: {
      co2AvoidedKg: 520,
      landfillDivertedKg: 750,
      recoveredValueInr: 160000,
      energySavedKwh: 1520
    },
    description: 'Quarry operations washing plant producing fine silicate tailing fractions suitable for geopolymers and road base.',
    verifiedStatus: true
  }
];

export const INITIAL_MATCH_HISTORY: MatchHistoryEntry[] = [
  {
    id: 'hist-1',
    matchedAt: '2 hours ago',
    matchItem: DEMO_BUYER_MATCHES[0], // EcoCement Industries
    flowOrigin: 'seller',
    status: 'Connected'
  },
  {
    id: 'hist-2',
    matchedAt: 'Yesterday',
    matchItem: {
      id: 'hist-item-2',
      type: 'buyer',
      companyName: 'GreenPoly Reprocessors',
      location: 'Chakan, Maharashtra',
      distanceKm: 48,
      matchScore: 89,
      materialName: 'PET Plastic Flakes',
      materialTypeCategory: 'Post-industrial Polymers',
      quantityStr: '8 tonnes',
      quantityTonnes: 8,
      offerPriceStr: '₹92 / kg',
      pricePerTonne: 92000,
      capacityOrFrequency: 'Monthly requirement: 25T',
      contaminationLevel: 'Low',
      tags: ['CIRCULAR TEXTILE', 'RECURRING CONTRACT'],
      imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
      metrics: {
        materialCompatibility: 96,
        distanceScore: 88,
        quantityFit: 92,
        priceScore: 86,
        environmentalBenefit: 96
      },
      aiRecommendation: 'High value secondary polymer processing facility producing recycled polyester yarn.',
      compliance: {
        materialClassification: 'EPR Plastic Waste Management Rules 2022 compliant',
        documentationGuidance: 'EPR credit transfer certificate & CPCB registered recyclers ID',
        facilityCompatibility: 'Optical sorting & pelletizing line',
        riskStatus: 'LOW RISK',
        hazardCategory: 'Polymer Non-Hazardous',
        disclaimer: 'AI-assisted guidance only. Verify applicable regulations and documentation with the relevant authority before transportation or processing.'
      },
      impact: {
        co2AvoidedKg: 1280,
        landfillDivertedKg: 8000,
        recoveredValueInr: 736000,
        energySavedKwh: 4800
      },
      description: 'Zero-discharge recycling facility manufacturing food-grade rPET granules and staple fiber.',
      verifiedStatus: true
    },
    flowOrigin: 'seller',
    status: 'In Discussion'
  }
];

export const CITIES_LIST = [
  'Gurgaon, Haryana',
  'Pune, Maharashtra',
  'Mumbai, Maharashtra',
  'Bengaluru, Karnataka',
  'Ahmedabad, Gujarat',
  'Chennai, Tamil Nadu',
  'Hyderabad, Telangana',
  'Delhi NCR',
  'Kolkata, West Bengal',
  'Surat, Gujarat'
];
