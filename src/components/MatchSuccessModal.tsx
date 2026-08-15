import React from 'react';
import { motion } from 'motion/react';
import { Recycle, ArrowRight, CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import { MatchItem } from '../types';

interface MatchSuccessModalProps {
  isOpen: boolean;
  matchItem: MatchItem | null;
  flowType: 'seller' | 'buyer';
  onViewDetails: (item: MatchItem) => void;
  onContinueBrowsing: () => void;
}

export const MatchSuccessModal: React.FC<MatchSuccessModalProps> = ({
  isOpen,
  matchItem,
  flowType,
  onViewDetails,
  onContinueBrowsing
}) => {
  if (!isOpen || !matchItem) return null;

  const isSeller = flowType === 'seller';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10231A]/80 backdrop-blur-md animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-lg bg-[#0B3D2E] text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#35A66F]/40 text-center relative overflow-hidden"
        id="match-success-modal"
      >
        {/* Subtle background circular pulse */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#238B5A]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#35A66F]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Central Glowing Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-[#146B4A] to-[#238B5A] text-white flex items-center justify-center mb-6 shadow-xl shadow-[#238B5A]/40 border-2 border-[#35A66F]">
          <Recycle className="w-10 h-10 animate-spin-slow" />
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white text-[#0B3D2E] flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-[#238B5A]" />
          </div>
        </div>

        {/* Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#146B4A]/70 text-[#C8EBD5] text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#35A66F]" />
          <span>{matchItem.matchScore}% Compatibility</span>
        </div>

        <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-2">
          IT'S A MATCH
        </h2>

        <p className="text-sm sm:text-base text-[#C8EBD5] max-w-sm mx-auto mb-8">
          {isSeller ? (
            <span><strong className="text-white">{matchItem.companyName}</strong> is interested in acquiring your waste stream.</span>
          ) : (
            <span>You found a verified supplier for your secondary raw material needs.</span>
          )}
        </p>

        {/* Match Snapshot Card */}
        <div className="bg-[#146B4A]/40 rounded-2xl p-5 border border-[#35A66F]/30 text-left mb-8 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                {matchItem.companyName}
              </h3>
              <p className="text-xs text-[#C8EBD5] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-[#35A66F]" />
                <span>{matchItem.location}</span>
                <span>•</span>
                <span className="text-[#35A66F] font-bold">{matchItem.distanceKm} km away</span>
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-[#238B5A] text-white font-heading font-bold text-xs">
              {matchItem.materialName}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#35A66F]/20 text-xs">
            <div>
              <span className="text-[#C8EBD5] text-[10px] block uppercase">Quantity</span>
              <span className="font-bold text-white">{matchItem.quantityStr}</span>
            </div>
            <div>
              <span className="text-[#C8EBD5] text-[10px] block uppercase">{isSeller ? 'Offer Price' : 'Price'}</span>
              <span className="font-bold text-[#35A66F]">{matchItem.offerPriceStr}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => onViewDetails(matchItem)}
            className="w-full py-4 px-6 rounded-xl bg-white hover:bg-[#EFF9F2] text-[#0B3D2E] font-heading font-bold text-base shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
            id="modal-view-details-btn"
          >
            <span>{isSeller ? 'View buyer details' : 'View supplier details'}</span>
            <ArrowRight className="w-5 h-5 text-[#238B5A]" />
          </button>

          <button
            onClick={onContinueBrowsing}
            className="w-full py-3 px-6 rounded-xl text-sm font-semibold text-[#C8EBD5] hover:text-white transition-colors cursor-pointer"
            id="modal-continue-browsing-btn"
          >
            Continue browsing other matches
          </button>
        </div>

      </motion.div>
    </div>
  );
};
