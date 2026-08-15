import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { 
  Heart, 
  X, 
  RotateCcw, 
  Sparkles, 
  MapPin, 
  ArrowLeft, 
  Building2, 
  ShieldCheck, 
  Info, 
  ChevronRight,
  TrendingUp,
  Leaf,
  SlidersHorizontal
} from 'lucide-react';
import { MatchItem, SellerListingPayload, BuyerSearchPayload } from '../types';
import { MatchSuccessModal } from './MatchSuccessModal';

interface MatchingExperienceProps {
  flowType: 'seller' | 'buyer';
  currentListing?: SellerListingPayload;
  currentSearch?: BuyerSearchPayload;
  matchCandidates: MatchItem[];
  onBack: () => void;
  onViewDetails: (item: MatchItem) => void;
  onMatchAccepted: (item: MatchItem) => void;
}

export const MatchingExperience: React.FC<MatchingExperienceProps> = ({
  flowType,
  currentListing,
  currentSearch,
  matchCandidates,
  onBack,
  onViewDetails,
  onMatchAccepted
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeHistory, setSwipeHistory] = useState<{ item: MatchItem; direction: 'left' | 'right' }[]>([]);
  const [activeSuccessItem, setActiveSuccessItem] = useState<MatchItem | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const isSeller = flowType === 'seller';
  const currentCard = matchCandidates[currentIndex];
  const nextCard = matchCandidates[currentIndex + 1];
  const thirdCard = matchCandidates[currentIndex + 2];

  // Motion values for swipe drag physics
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-16, 16]);
  const opacity = useTransform(x, [-200, -120, 0, 120, 200], [0.6, 0.95, 1, 0.95, 0.6]);

  // Overlay stamps
  const matchOpacity = useTransform(x, [20, 100], [0, 1]);
  const passOpacity = useTransform(x, [-20, -100], [0, 1]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentCard) return;

    if (direction === 'right') {
      onMatchAccepted(currentCard);
      setActiveSuccessItem(currentCard);
      setIsSuccessModalOpen(true);
    }

    setSwipeHistory((prev) => [...prev, { item: currentCard, direction }]);
    setCurrentIndex((prev) => prev + 1);
    x.set(0);
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSwipeHistory((prev) => prev.slice(0, -1));
      x.set(0);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSwipeHistory([]);
    x.set(0);
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSuccessModalOpen) return;
      if (e.key === 'ArrowLeft') {
        handleSwipe('left');
      } else if (e.key === 'ArrowRight') {
        handleSwipe('right');
      } else if (e.key === 'ArrowUp' && currentCard) {
        onViewDetails(currentCard);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentCard, isSuccessModalOpen]);

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#F2FAF5] via-[#F8FCF9] to-[#EDF7F1] py-6 sm:py-8 px-4 sm:px-6 lg:px-8" id="matching-experience-root">
      
      {/* Top Banner / Listing Context in Soft Green Box */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#EBF7F0] p-4 sm:px-6 sm:py-3.5 rounded-2xl border border-[#C2E7D1] shadow-2xs">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl text-[#0B3D2E] hover:bg-[#D4EFE0] transition-colors cursor-pointer bg-white/70 border border-[#A8DEBF]"
              id="matching-back-btn"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#146B4A] bg-[#D4EFE0] px-2 py-0.5 rounded-md">
                  {isSeller ? 'SELLER MATCHING' : 'BUYER SOURCING'}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#A8DEBF]" />
                <span className="text-xs font-bold text-[#3B5446]">
                  AI ranked {matchCandidates.length} compatible candidates
                </span>
              </div>

              <p className="font-heading font-bold text-sm text-[#0B3D2E] mt-1">
                {isSeller ? (
                  <span>
                    {currentListing?.quantityTonnes || 15} tonnes {currentListing?.materialName || 'Silica Waste'} • {currentListing?.location || 'Pune, Maharashtra'}
                  </span>
                ) : (
                  <span>
                    {currentSearch?.quantityRequiredTonnes || 15} tonnes {currentSearch?.materialName || 'Silica Waste'} • {currentSearch?.preferredLocation || 'Pune, Maharashtra'}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-3 self-end sm:self-center">
            <span className="text-xs font-extrabold text-[#0B3D2E] bg-white px-3 py-1 rounded-lg border border-[#A8DEBF] shadow-2xs">
              {Math.min(currentIndex + 1, matchCandidates.length)} / {matchCandidates.length}
            </span>
            {currentIndex > 0 && (
              <button
                onClick={handleUndo}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#A8DEBF] text-[#0B3D2E] text-xs font-bold hover:bg-[#D4EFE0] transition-colors cursor-pointer shadow-2xs"
                title="Undo last swipe"
                id="matching-undo-btn"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#238B5A]" />
                <span>Undo</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Main Grid: Card Stack (Left) + Match Explanation (Right) */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT / CENTER: Tinder-Style Card Stack */}
        <div className="lg:col-span-7 flex flex-col items-center">
          
          <div className="relative w-full max-w-md h-[550px] flex items-center justify-center">
            
            {currentCard ? (
              <div className="relative w-full h-full">
                
                {/* 3rd Card in Background Stack */}
                {thirdCard && (
                  <div className="absolute inset-0 translate-y-5 scale-[0.92] bg-white rounded-3xl border border-[#E8F3ED] shadow-sm opacity-40 pointer-events-none transform -rotate-2" />
                )}

                {/* 2nd Card in Background Stack */}
                {nextCard && (
                  <div className="absolute inset-0 translate-y-2.5 scale-[0.96] bg-white rounded-3xl border border-[#D9F2E3] shadow-md opacity-90 pointer-events-none transform rotate-1 overflow-hidden">
                    <div className="p-6 h-full flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-[#238B5A]">{nextCard.matchScore}% MATCH</span>
                        <span className="text-xs font-bold text-[#0B3D2E]">{nextCard.companyName}</span>
                      </div>
                      <div className="w-full h-48 bg-[#EFF9F2] rounded-2xl opacity-60" />
                      <div className="h-10 bg-[#F8FBF9] rounded-xl" />
                    </div>
                  </div>
                )}

                {/* Top Active Interactive Card */}
                <motion.div
                  style={{ x, rotate, opacity }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 90) {
                      handleSwipe('right');
                    } else if (info.offset.x < -90) {
                      handleSwipe('left');
                    }
                  }}
                  className="absolute inset-0 bg-white rounded-3xl p-5 sm:p-6 border border-[#D9F2E3] shadow-xl shadow-[#0B3D2E]/8 flex flex-col justify-between cursor-grab active:cursor-grabbing select-none overflow-hidden"
                  id={`match-card-${currentCard.id}`}
                >
                  {/* Stamp Overlay: MATCH (Right Drag) */}
                  <motion.div
                    style={{ opacity: matchOpacity }}
                    className="absolute top-8 left-8 z-30 pointer-events-none border-[3.5px] border-[#238B5A] text-[#238B5A] px-4 py-1.5 rounded-xl font-heading font-black text-2xl tracking-wider uppercase transform -rotate-12 bg-white/95 shadow-lg backdrop-blur-xs"
                  >
                    MATCH ♥
                  </motion.div>

                  {/* Stamp Overlay: PASS (Left Drag) */}
                  <motion.div
                    style={{ opacity: passOpacity }}
                    className="absolute top-8 right-8 z-30 pointer-events-none border-[3.5px] border-rose-500 text-rose-500 px-4 py-1.5 rounded-xl font-heading font-black text-2xl tracking-wider uppercase transform rotate-12 bg-white/95 shadow-lg backdrop-blur-xs"
                  >
                    PASS ✕
                  </motion.div>

                  {/* Card Header */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF9F2] border border-[#238B5A]/30 text-[#0B3D2E] font-heading font-extrabold text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-[#238B5A]" />
                        <span>{currentCard.matchScore}% MATCH</span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#146B4A] bg-[#EFF9F2] border border-[#D9F2E3] px-2.5 py-0.5 rounded-lg">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#238B5A]" />
                        <span>VERIFIED CORPORATE</span>
                      </div>
                    </div>

                    {/* Image Container */}
                    <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden bg-[#EFF9F2] group shadow-inner">
                      <img
                        src={currentCard.imageUrl}
                        alt={currentCard.companyName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D2E]/80 via-transparent to-transparent" />
                      
                      <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between">
                        <div>
                          <span className="text-[10px] font-bold tracking-wider uppercase text-[#C8EBD5]">
                            {isSeller ? 'TARGET APPLICATION' : 'MATERIAL SPECS'}
                          </span>
                          <p className="font-heading font-extrabold text-base sm:text-lg leading-tight">
                            {currentCard.materialName}
                          </p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-[#0B3D2E]/70 backdrop-blur-xs text-[#C8EBD5] border border-white/20">
                          {currentCard.materialTypeCategory}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Company & Offer Specs */}
                  <div className="space-y-3 my-auto pt-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-heading font-extrabold text-xl text-[#0B3D2E] leading-tight">
                          {currentCard.companyName}
                        </h3>
                        <p className="text-xs text-[#3B5446] flex items-center gap-1.5 mt-0.5 font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-[#238B5A]" />
                          <span>{currentCard.location}</span>
                          <span>•</span>
                          <span className="text-[#238B5A] font-bold">{currentCard.distanceKm} km away</span>
                        </p>
                      </div>
                      
                      <div className="text-right bg-[#E1F4E8] px-3 py-1.5 rounded-xl border border-[#A8DEBF]">
                        <span className="text-[10px] uppercase font-extrabold text-[#146B4A] block">
                          {isSeller ? 'OFFER' : 'PRICE'}
                        </span>
                        <span className="font-heading font-extrabold text-lg text-[#0B3D2E]">
                          {currentCard.offerPriceStr}
                        </span>
                      </div>
                    </div>

                    {/* Spec Grid in Soft Mint Boxes */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-[#EBF7F0] p-2.5 rounded-xl border border-[#C2E7D1]">
                        <span className="text-[#146B4A] block text-[10px] uppercase font-extrabold tracking-wider">
                          {isSeller ? 'Required Quantity' : 'Available Volume'}
                        </span>
                        <span className="font-bold text-[#0B3D2E]">{currentCard.quantityStr}</span>
                      </div>
                      <div className="bg-[#EBF7F0] p-2.5 rounded-xl border border-[#C2E7D1]">
                        <span className="text-[#146B4A] block text-[10px] uppercase font-extrabold tracking-wider">
                          Frequency
                        </span>
                        <span className="font-bold text-[#0B3D2E]">{currentCard.capacityOrFrequency}</span>
                      </div>
                    </div>

                    {/* Tags in Distinct Green Shades */}
                    <div className="flex flex-wrap gap-1.5">
                      {currentCard.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold tracking-wider uppercase ${
                            idx === 0 
                              ? 'bg-[#0B3D2E] text-[#C8EBD5]' 
                              : idx === 1 
                              ? 'bg-[#E1F4E8] text-[#146B4A] border border-[#A8DEBF]' 
                              : 'bg-[#D4EFE0] text-[#0B3D2E] border border-[#A8DEBF]'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Micro Helper Note */}
                  <div className="text-center pt-2 border-t border-[#D4EFE0]">
                    <span className="text-[11px] font-semibold text-[#4A6054]">
                      Swipe left or press ← to Pass • Swipe right or press → to Match
                    </span>
                  </div>
                </motion.div>

              </div>
            ) : (
              /* All Cards Finished View */
              <div className="w-full bg-white rounded-3xl p-8 border border-[#D9F2E3] text-center shadow-lg flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#E1F4E8] text-[#238B5A] flex items-center justify-center shadow-2xs border border-[#A8DEBF]">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-extrabold text-2xl text-[#0B3D2E]">
                  All Matches Reviewed
                </h3>
                <p className="text-xs text-[#3B5446] max-w-xs leading-relaxed font-medium">
                  You have reviewed all current AI-ranked candidates for this listing.
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleReset}
                    className="px-5 py-2.5 rounded-xl bg-[#0B3D2E] text-white font-heading font-bold text-xs hover:bg-[#146B4A] transition-colors cursor-pointer shadow-xs"
                  >
                    Start Over
                  </button>
                  <button
                    onClick={onBack}
                    className="px-5 py-2.5 rounded-xl bg-[#E1F4E8] text-[#0B3D2E] font-heading font-bold text-xs hover:bg-[#D4EFE0] transition-colors cursor-pointer border border-[#A8DEBF]"
                  >
                    Modify Listing
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Floating Action Controls */}
          {currentCard && (
            <div className="flex items-center justify-center gap-6 mt-6">
              
              {/* PASS Button */}
              <button
                onClick={() => handleSwipe('left')}
                className="group flex flex-col items-center gap-1.5 cursor-pointer"
                id="swipe-pass-btn"
                title="Pass (Left arrow)"
              >
                <div className="w-14 h-14 rounded-full bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:scale-110 active:scale-95 shadow-md shadow-rose-600/5 flex items-center justify-center transition-all duration-150">
                  <X className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-bold text-[#60756A] uppercase tracking-wider group-hover:text-rose-600">
                  PASS (←)
                </span>
              </button>

              {/* DETAILS Button */}
              <button
                onClick={() => onViewDetails(currentCard)}
                className="group flex flex-col items-center gap-1.5 cursor-pointer"
                id="swipe-details-btn"
                title="View Full Specs (Up arrow)"
              >
                <div className="w-12 h-12 rounded-full bg-white border border-[#A8DEBF] text-[#0B3D2E] hover:bg-[#E1F4E8] hover:scale-105 active:scale-95 shadow-sm flex items-center justify-center transition-all duration-150">
                  <Info className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-[#0B3D2E] uppercase tracking-wider group-hover:text-[#238B5A]">
                  SPECS (↑)
                </span>
              </button>

              {/* MATCH Button */}
              <button
                onClick={() => handleSwipe('right')}
                className="group flex flex-col items-center gap-1.5 cursor-pointer"
                id="swipe-match-btn"
                title="Match (Right arrow)"
              >
                <div className="w-16 h-16 rounded-full bg-[#0B3D2E] hover:bg-[#146B4A] text-white hover:scale-110 active:scale-95 shadow-xl shadow-[#0B3D2E]/25 flex items-center justify-center transition-all duration-150 border-2 border-white">
                  <Heart className="w-8 h-8 fill-[#35A66F] text-[#35A66F]" />
                </div>
                <span className="text-[10px] font-bold text-[#0B3D2E] uppercase tracking-wider group-hover:text-[#238B5A]">
                  {isSeller ? 'MATCH (→)' : 'INTERESTED (→)'}
                </span>
              </button>

            </div>
          )}

        </div>

        {/* RIGHT PANEL: WHY THIS MATCH? (AI Logic Breakdown) */}
        <div className="lg:col-span-5 space-y-6">
          
          {currentCard ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C2E7D1] shadow-lg shadow-[#0B3D2E]/5" id="match-explanation-panel">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#D4EFE0]">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#238B5A] block">
                    TRANSPARENT ALGORITHM
                  </span>
                  <h3 className="font-heading font-extrabold text-xl text-[#0B3D2E]">
                    WHY THIS MATCH?
                  </h3>
                </div>

                <div className="text-right bg-[#E1F4E8] px-3 py-1.5 rounded-xl border border-[#A8DEBF]">
                  <span className="font-heading font-extrabold text-2xl text-[#0B3D2E]">
                    {currentCard.matchScore}%
                  </span>
                  <span className="block text-[10px] text-[#146B4A] font-extrabold uppercase tracking-wider">Overall Fit</span>
                </div>
              </div>

              {/* Progress Bars with Distinct Green Shades */}
              <div className="space-y-4 my-6">
                
                {/* 1. Material Compatibility */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#0B3D2E]">Material Compatibility</span>
                    <span className="text-[#238B5A] font-extrabold">{currentCard.metrics.materialCompatibility}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#EBF7F0] rounded-full overflow-hidden border border-[#D4EFE0]">
                    <div
                      className="h-full bg-[#238B5A] rounded-full transition-all duration-500"
                      style={{ width: `${currentCard.metrics.materialCompatibility}%` }}
                    />
                  </div>
                </div>

                {/* 2. Distance */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#0B3D2E]">Distance & Logistics ({currentCard.distanceKm} km)</span>
                    <span className="text-[#146B4A] font-extrabold">{currentCard.metrics.distanceScore}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#EBF7F0] rounded-full overflow-hidden border border-[#D4EFE0]">
                    <div
                      className="h-full bg-[#146B4A] rounded-full transition-all duration-500"
                      style={{ width: `${currentCard.metrics.distanceScore}%` }}
                    />
                  </div>
                </div>

                {/* 3. Quantity Fit */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#0B3D2E]">Quantity Fit</span>
                    <span className="text-[#35A66F] font-extrabold">{currentCard.metrics.quantityFit}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#EBF7F0] rounded-full overflow-hidden border border-[#D4EFE0]">
                    <div
                      className="h-full bg-[#35A66F] rounded-full transition-all duration-500"
                      style={{ width: `${currentCard.metrics.quantityFit}%` }}
                    />
                  </div>
                </div>

                {/* 4. Price Compatibility */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#0B3D2E]">Price Alignment</span>
                    <span className="text-[#238B5A] font-extrabold">{currentCard.metrics.priceScore}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#EBF7F0] rounded-full overflow-hidden border border-[#D4EFE0]">
                    <div
                      className="h-full bg-[#238B5A] rounded-full transition-all duration-500"
                      style={{ width: `${currentCard.metrics.priceScore}%` }}
                    />
                  </div>
                </div>

                {/* 5. Environmental Benefit / Quality */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#0B3D2E]">
                      {currentCard.metrics.environmentalBenefit ? 'Environmental Scope 3 Value' : 'Material Quality Rating'}
                    </span>
                    <span className="text-[#0B3D2E] font-extrabold">
                      {currentCard.metrics.environmentalBenefit || currentCard.metrics.qualityScore}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#EBF7F0] rounded-full overflow-hidden border border-[#D4EFE0]">
                    <div
                      className="h-full bg-[#0B3D2E] rounded-full transition-all duration-500"
                      style={{ width: `${currentCard.metrics.environmentalBenefit || currentCard.metrics.qualityScore}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* AI Recommendation Box in Deep Forest Green */}
              <div className="bg-[#0B3D2E] text-white rounded-2xl p-4 border border-[#146B4A] shadow-md relative overflow-hidden">
                <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#35A66F] mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#35A66F]" />
                  <span>AI RECOMMENDATION</span>
                </div>
                <p className="text-xs text-[#C8EBD5] leading-relaxed italic">
                  "{currentCard.aiRecommendation}"
                </p>
              </div>

              {/* Deep Dive Action */}
              <div className="mt-6 pt-4 border-t border-[#D4EFE0]">
                <button
                  onClick={() => onViewDetails(currentCard)}
                  className="w-full py-3 px-4 rounded-xl bg-[#E1F4E8] hover:bg-[#D4EFE0] border border-[#A8DEBF] text-[#0B3D2E] font-heading font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
                  id="view-compliance-impact-btn"
                >
                  <span>View compliance & impact estimates</span>
                  <ChevronRight className="w-4 h-4 text-[#146B4A]" />
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 border border-[#D9F2E3] text-center text-[#60756A] text-xs">
              Select or review listings to inspect AI matching scores.
            </div>
          )}

        </div>

      </div>

      {/* Match Success Modal Popup */}
      <MatchSuccessModal
        isOpen={isSuccessModalOpen}
        matchItem={activeSuccessItem}
        flowType={flowType}
        onViewDetails={(item) => {
          setIsSuccessModalOpen(false);
          onViewDetails(item);
        }}
        onContinueBrowsing={() => setIsSuccessModalOpen(false)}
      />

    </div>
  );
};
