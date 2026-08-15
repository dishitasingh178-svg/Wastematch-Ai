import React, { useState } from 'react';
import { 
  SellerListingPayload, 
  BuyerSearchPayload, 
  MatchItem, 
  MatchHistoryEntry, 
  UserSession,
  ContaminationLevel
} from './types';
import { 
  DEFAULT_SELLER_LISTING, 
  DEFAULT_BUYER_SEARCH, 
  DEMO_BUYER_MATCHES, 
  DEMO_SELLER_MATCHES, 
  INITIAL_MATCH_HISTORY 
} from './data/mockData';
import { findTopMatches, getFacilityById, resolveCoordinates } from './matching/matchingEngine';
import { calculateImpact } from './matching/impactCalculator';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { HomeScreen } from './components/HomeScreen';
import { SellerFlow } from './components/SellerFlow';
import { BuyerFlow } from './components/BuyerFlow';
import { MatchingExperience } from './components/MatchingExperience';
import { DetailsView } from './components/DetailsView';
import { MatchesPage } from './components/MatchesPage';
import { LocationModal } from './components/LocationModal';

export type AppView = 
  | 'landing' 
  | 'login' 
  | 'home' 
  | 'sell' 
  | 'buy' 
  | 'matching' 
  | 'details' 
  | 'matches';

export default function App() {
  // Navigation & Auth State
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [session, setSession] = useState<UserSession>({
    isLoggedIn: false,
    userEmail: 'operations@ecocement.in',
    companyName: 'EcoCement Industries',
    currentLocation: 'Gurgaon, Haryana'
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Workflow Data
  const [sellerListing, setSellerListing] = useState<SellerListingPayload>(DEFAULT_SELLER_LISTING);
  const [buyerSearch, setBuyerSearch] = useState<BuyerSearchPayload>(DEFAULT_BUYER_SEARCH);
  
  // Matching Engine State
  const [matchingFlowType, setMatchingFlowType] = useState<'seller' | 'buyer'>('seller');
  const [matchingCandidates, setMatchingCandidates] = useState<MatchItem[]>(DEMO_BUYER_MATCHES);
  const [activeDetailsItem, setActiveDetailsItem] = useState<MatchItem | null>(DEMO_BUYER_MATCHES[0]);
  
  // Matches List History
  const [matchesHistory, setMatchesHistory] = useState<MatchHistoryEntry[]>(INITIAL_MATCH_HISTORY);

  // Navigation handlers
  const handleLoginSuccess = (email: string) => {
    setSession((prev) => ({
      ...prev,
      isLoggedIn: true,
      userEmail: email
    }));
    setCurrentView('home');
  };

  const handleLogout = () => {
    setSession((prev) => ({
      ...prev,
      isLoggedIn: false
    }));
    setCurrentView('landing');
  };

  const handleStartSellerFlow = () => {
    setMatchingFlowType('seller');
    if (!session.isLoggedIn) {
      setSession((prev) => ({ ...prev, isLoggedIn: true }));
    }
    setCurrentView('sell');
  };

  const handleStartBuyerFlow = () => {
    setMatchingFlowType('buyer');
    if (!session.isLoggedIn) {
      setSession((prev) => ({ ...prev, isLoggedIn: true }));
    }
    setCurrentView('buy');
  };

  const handleSellerSubmit = (listing: SellerListingPayload) => {
    setSellerListing(listing);
    setMatchingFlowType('seller');

    const coords = resolveCoordinates(listing.location);
    const contaminationPct = 
      listing.contamination === 'None' ? 0 :
      listing.contamination === 'Medium' ? 12 :
      listing.contamination === 'High' ? 25 : 5;

    const facilityMatches = findTopMatches({
      wasteType: listing.materialName,
      quantityTonnes: listing.quantityTonnes,
      latitude: coords.lat,
      longitude: coords.lon,
      contaminationPercentage: contaminationPct
    }, 4);

    if (facilityMatches.length > 0) {
      const generatedItems: MatchItem[] = facilityMatches.map((m, idx) => {
        const fac = getFacilityById(m.facilityId);
        const impactCalc = fac ? calculateImpact({
          quantityTonnes: listing.quantityTonnes,
          distanceKm: m.distanceKm,
          facility: fac
        }) : null;

        return {
          id: `facility-match-${m.facilityId}-${idx}`,
          type: 'buyer',
          companyName: m.facilityName,
          location: m.location,
          distanceKm: m.distanceKm,
          matchScore: m.matchScore,
          materialName: listing.materialName,
          materialTypeCategory: fac?.processing_type || listing.materialCategory || 'Industrial Secondary Material',
          quantityStr: `${listing.quantityTonnes} tonnes`,
          quantityTonnes: listing.quantityTonnes,
          offerPriceStr: `₹${(fac?.estimated_reuse_value || listing.expectedPricePerUnit).toLocaleString('en-IN')} / tonne`,
          pricePerTonne: fac?.estimated_reuse_value || listing.expectedPricePerUnit,
          capacityOrFrequency: `${m.capacityPerDay} tonnes/day processing capacity`,
          contaminationLevel: listing.contamination as ContaminationLevel,
          tags: ['VERIFIED FACILITY', 'DIRECT MATCH', `${m.distanceKm} KM AWAY`],
          imageUrl: idx === 0 
            ? 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
            : idx === 1
            ? 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'
            : 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80',
          metrics: {
            materialCompatibility: m.materialScore,
            distanceScore: m.distanceScore,
            quantityFit: m.capacityScore,
            priceScore: 90,
            environmentalBenefit: m.environmentalScore
          },
          aiRecommendation: `Top ranked processing facility for ${listing.materialName}. Facility handles ${m.capacityPerDay} T/day with compliant ${fac?.processing_type || 'recycling'} capabilities.`,
          compliance: {
            materialClassification: 'Non-hazardous industrial secondary raw material (CPCB Cat. IV)',
            documentationGuidance: 'Form 10 manifest & standard manifest under Solid Waste Rules 2016',
            facilityCompatibility: `Authorized ${fac?.processing_type || 'secondary offtake'} facility`,
            riskStatus: 'LOW RISK',
            hazardCategory: 'Inert Matrix / Industrial Byproduct',
            disclaimer: 'AI-assisted guidance only. Verify applicable regulations and documentation with relevant state pollution control board.'
          },
          impact: {
            co2AvoidedKg: impactCalc ? Math.round(impactCalc.estimatedCo2AvoidedTonnes * 1000) : 420,
            landfillDivertedKg: impactCalc ? Math.round(impactCalc.wasteDivertedTonnes * 1000) : 500,
            recoveredValueInr: impactCalc ? impactCalc.estimatedEconomicBenefit : 105000,
            energySavedKwh: Math.round(listing.quantityTonnes * 85)
          },
          description: `${m.facilityName} is an active industrial offtaker in ${m.location} specializing in ${fac?.processing_type || 'material circularity'}.`,
          verifiedStatus: true,
          contactPerson: {
            name: 'Circularity Logistics Desk',
            role: 'Procurement & Waste Ingress Lead',
            phone: '+91 98200 12849',
            email: `operations@${m.facilityName.toLowerCase().replace(/[^a-z0-9]/g, '')}.in`
          }
        };
      });

      setMatchingCandidates(generatedItems);
    } else {
      setMatchingCandidates(DEMO_BUYER_MATCHES);
    }

    setCurrentView('matching');
  };

  const handleBuyerSubmit = (search: BuyerSearchPayload) => {
    setBuyerSearch(search);
    setMatchingFlowType('buyer');

    const coords = resolveCoordinates(search.preferredLocation);
    const contaminationPct = search.qualityRequirement === 'Low contamination' ? 5 : 12;

    const facilityMatches = findTopMatches({
      wasteType: search.materialName,
      quantityTonnes: search.quantityRequiredTonnes,
      latitude: coords.lat,
      longitude: coords.lon,
      contaminationPercentage: contaminationPct
    }, 4);

    if (facilityMatches.length > 0) {
      const generatedItems: MatchItem[] = facilityMatches.map((m, idx) => {
        const fac = getFacilityById(m.facilityId);
        const impactCalc = fac ? calculateImpact({
          quantityTonnes: search.quantityRequiredTonnes,
          distanceKm: m.distanceKm,
          facility: fac
        }) : null;

        return {
          id: `seller-match-${m.facilityId}-${idx}`,
          type: 'seller',
          companyName: m.facilityName,
          location: m.location,
          distanceKm: m.distanceKm,
          matchScore: m.matchScore,
          materialName: search.materialName,
          materialTypeCategory: fac?.processing_type || 'Industrial Stream',
          quantityStr: `${search.quantityRequiredTonnes} tonnes available`,
          quantityTonnes: search.quantityRequiredTonnes,
          offerPriceStr: `₹${(search.budgetPerTonne || 7000).toLocaleString('en-IN')} / tonne`,
          pricePerTonne: search.budgetPerTonne || 7000,
          capacityOrFrequency: `${m.capacityPerDay} tonnes/day available`,
          contaminationLevel: 'Low',
          tags: ['CERTIFIED GENERATOR', 'READY TO DISPATCH', 'BATCH TESTED'],
          imageUrl: idx === 0 
            ? 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'
            : 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
          metrics: {
            materialCompatibility: m.materialScore,
            distanceScore: m.distanceScore,
            quantityFit: m.capacityScore,
            priceScore: 92,
            environmentalBenefit: m.environmentalScore
          },
          aiRecommendation: `Direct generator located within ${m.distanceKm} km with quality tested ${search.materialName} matching your specification.`,
          compliance: {
            materialClassification: 'Classified Industrial Secondary Material',
            documentationGuidance: 'Form 10 manifest & material certificate of analysis',
            facilityCompatibility: 'Standard industrial off-loading bay',
            riskStatus: 'LOW RISK',
            hazardCategory: 'Inert Industrial Material',
            disclaimer: 'AI-assisted guidance only. Verify applicable regulations with state authorities.'
          },
          impact: {
            co2AvoidedKg: impactCalc ? Math.round(impactCalc.estimatedCo2AvoidedTonnes * 1000) : 380,
            landfillDivertedKg: impactCalc ? Math.round(impactCalc.wasteDivertedTonnes * 1000) : 500,
            recoveredValueInr: impactCalc ? impactCalc.estimatedEconomicBenefit : 98000,
            energySavedKwh: Math.round(search.quantityRequiredTonnes * 75)
          },
          description: `Industrial supply batch of ${search.materialName} stored in covered facility ready for immediate transport.`,
          verifiedStatus: true,
          contactPerson: {
            name: 'Dispatch Coordinator',
            role: 'Material Dispatch & Compliance',
            phone: '+91 98450 77123',
            email: `dispatch@${m.facilityName.toLowerCase().replace(/[^a-z0-9]/g, '')}.in`
          }
        };
      });

      setMatchingCandidates(generatedItems);
    } else {
      setMatchingCandidates(DEMO_SELLER_MATCHES);
    }

    setCurrentView('matching');
  };

  const handleMatchAccepted = (item: MatchItem) => {
    // Add to matches history if not already present
    setMatchesHistory((prev) => {
      if (prev.some((m) => m.matchItem.id === item.id)) return prev;
      return [
        {
          id: `match-${Date.now()}`,
          matchedAt: 'Just now',
          matchItem: item,
          flowOrigin: matchingFlowType,
          status: 'Connected'
        },
        ...prev
      ];
    });
  };

  const handleViewDetails = (item: MatchItem) => {
    setActiveDetailsItem(item);
    setCurrentView('details');
  };

  const handleLocationChange = (newLocation: string) => {
    setSession((prev) => ({
      ...prev,
      currentLocation: newLocation
    }));
    setSellerListing((prev) => ({ ...prev, location: newLocation }));
    setBuyerSearch((prev) => ({ ...prev, preferredLocation: newLocation }));
  };

  return (
    <div className="min-h-screen bg-[#F8FBF9] text-[#10231A] flex flex-col justify-between font-body antialiased">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        isLoggedIn={session.isLoggedIn}
        userEmail={session.userEmail}
        location={session.currentLocation}
        matchesCount={matchesHistory.length}
        onNavigate={(view) => setCurrentView(view as AppView)}
        onChangeLocation={() => setIsLocationModalOpen(true)}
        onLogout={handleLogout}
        onLoginClick={() => setCurrentView('login')}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full">
        {currentView === 'landing' && (
          <LandingPage
            onGetStarted={() => {
              if (session.isLoggedIn) {
                setCurrentView('home');
              } else {
                setCurrentView('login');
              }
            }}
            onSelectSell={handleStartSellerFlow}
            onSelectBuy={handleStartBuyerFlow}
          />
        )}

        {currentView === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onBackToLanding={() => setCurrentView('landing')}
          />
        )}

        {currentView === 'home' && (
          <HomeScreen
            location={session.currentLocation}
            onChangeLocation={() => setIsLocationModalOpen(true)}
            onSelectSell={handleStartSellerFlow}
            onSelectBuy={handleStartBuyerFlow}
          />
        )}

        {currentView === 'sell' && (
          <SellerFlow
            onStartMatching={handleSellerSubmit}
            onCancel={() => setCurrentView('home')}
          />
        )}

        {currentView === 'buy' && (
          <BuyerFlow
            onStartMatching={handleBuyerSubmit}
            onCancel={() => setCurrentView('home')}
          />
        )}

        {currentView === 'matching' && (
          <MatchingExperience
            flowType={matchingFlowType}
            currentListing={sellerListing}
            currentSearch={buyerSearch}
            matchCandidates={matchingCandidates}
            onBack={() => setCurrentView(matchingFlowType === 'seller' ? 'sell' : 'buy')}
            onViewDetails={handleViewDetails}
            onMatchAccepted={handleMatchAccepted}
          />
        )}

        {currentView === 'details' && activeDetailsItem && (
          <DetailsView
            matchItem={activeDetailsItem}
            flowType={matchingFlowType}
            onBack={() => setCurrentView('matching')}
            onInitiateContact={(item) => handleMatchAccepted(item)}
          />
        )}

        {currentView === 'matches' && (
          <MatchesPage
            matches={matchesHistory}
            onViewDetails={handleViewDetails}
            onNewSearch={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* Location Hub Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        currentLocation={session.currentLocation}
        onSelectLocation={handleLocationChange}
        onClose={() => setIsLocationModalOpen(false)}
      />

    </div>
  );
}
