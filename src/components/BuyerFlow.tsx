import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowRight, ArrowLeft, Sparkles, CheckCircle2, Sliders, MapPin } from 'lucide-react';
import { BuyerSearchPayload, QualityRequirement } from '../types';
import { DEFAULT_BUYER_SEARCH, POPULAR_MATERIALS } from '../data/mockData';

interface BuyerFlowProps {
  onStartMatching: (searchData: BuyerSearchPayload) => void;
  onCancel: () => void;
}

export const BuyerFlow: React.FC<BuyerFlowProps> = ({
  onStartMatching,
  onCancel
}) => {
  const [formData, setFormData] = useState<BuyerSearchPayload>({
    ...DEFAULT_BUYER_SEARCH
  });

  const [isAiSearching, setIsAiSearching] = useState(false);

  const handleSelectPopular = (mat: string) => {
    setFormData((prev) => ({
      ...prev,
      materialName: mat.includes('Waste') ? mat : `${mat} Waste`
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAiSearching(true);

    setTimeout(() => {
      setIsAiSearching(false);
      onStartMatching(formData);
    }, 1800);
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#F2FAF5] via-[#F8FCF9] to-[#EDF7F1] py-10 px-4 sm:px-6 lg:px-8" id="buyer-flow-root">
      <div className="max-w-3xl mx-auto">
        
        {/* Top Header */}
        <div className="mb-8">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#146B4A] hover:text-[#0B3D2E] transition-colors mb-4 cursor-pointer bg-[#E1F4E8] px-3 py-1.5 rounded-lg border border-[#A8DEBF]"
            id="buyer-back-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel and return to home</span>
          </button>

          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#C2E7D1] shadow-xl shadow-[#0B3D2E]/5">
            
            <div className="mb-6">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#238B5A] block mb-1">
                Secondary Material Sourcing
              </span>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0B3D2E] tracking-tight">
                WHAT MATERIAL ARE YOU LOOKING FOR?
              </h1>
              <p className="text-sm text-[#3B5446] mt-1 font-medium">
                Tell us your raw material specifications and let AI locate verified industrial supplies nearby.
              </p>
            </div>

            {/* Material Search Field */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#238B5A]">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={formData.materialName}
                onChange={(e) => setFormData({ ...formData, materialName: e.target.value })}
                placeholder="Search materials (e.g. Silica Waste, HDPE Flakes, Foundry Slag...)"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-[#C2E7D1] bg-[#F8FCF9] text-[#0B3D2E] text-base font-semibold focus:outline-hidden focus:border-[#238B5A] focus:bg-white focus:ring-2 focus:ring-[#D4EFE0]"
                id="buyer-search-material-input"
              />
            </div>

            {/* Popular Materials Quick Pills */}
            <div className="mb-8 pb-6 border-b border-[#D4EFE0]">
              <span className="text-xs font-extrabold text-[#146B4A] uppercase tracking-wider block mb-2.5">
                Popular Industrial Streams:
              </span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_MATERIALS.map((mat) => {
                  const isCurrent = formData.materialName.toLowerCase().includes(mat.toLowerCase());
                  return (
                    <button
                      key={mat}
                      type="button"
                      onClick={() => handleSelectPopular(mat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#0B3D2E] text-[#C8EBD5] shadow-xs'
                          : 'bg-[#EBF7F0] text-[#0B3D2E] hover:bg-[#D4EFE0] border border-[#C2E7D1]'
                      }`}
                    >
                      {mat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Requirement Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="font-heading font-extrabold text-lg text-[#0B3D2E]">
                Tell us what you need.
              </h3>

              {/* Quantity & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0B3D2E] mb-1.5" htmlFor="buyer-qty">
                    Quantity Required
                  </label>
                  <div className="flex">
                    <input
                      id="buyer-qty"
                      type="number"
                      min="1"
                      value={formData.quantityRequiredTonnes}
                      onChange={(e) => setFormData({ ...formData, quantityRequiredTonnes: Number(e.target.value) })}
                      required
                      className="w-full px-4 py-3 rounded-l-xl border border-r-0 border-[#C2E7D1] bg-[#F8FCF9] text-[#0B3D2E] text-sm font-semibold focus:outline-hidden focus:border-[#238B5A] focus:bg-white"
                    />
                    <span className="px-3.5 py-3 rounded-r-xl border border-[#C2E7D1] bg-[#E1F4E8] text-[#0B3D2E] font-bold text-xs flex items-center">
                      tonnes
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0B3D2E] mb-1.5" htmlFor="buyer-loc">
                    Preferred Location
                  </label>
                  <div className="relative">
                    <input
                      id="buyer-loc"
                      type="text"
                      value={formData.preferredLocation}
                      onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#C2E7D1] bg-[#F8FCF9] text-[#0B3D2E] text-sm font-semibold focus:outline-hidden focus:border-[#238B5A] focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Max Distance & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#EBF7F0] p-3.5 rounded-2xl border border-[#C2E7D1]">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0B3D2E]">
                      Maximum Logistics Distance
                    </label>
                    <span className="text-xs font-extrabold text-[#146B4A] bg-white px-2 py-0.5 rounded-md border border-[#A8DEBF]">
                      {formData.maxDistanceKm} km
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={formData.maxDistanceKm}
                    onChange={(e) => setFormData({ ...formData, maxDistanceKm: Number(e.target.value) })}
                    className="w-full accent-[#0B3D2E] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#3B5446] font-semibold mt-1">
                    <span>10 km (Local)</span>
                    <span>250 km</span>
                    <span>500 km (Regional)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0B3D2E] mb-1.5" htmlFor="buyer-budget">
                    Target Budget
                  </label>
                  <div className="flex">
                    <span className="px-3.5 py-3 rounded-l-xl border border-[#C2E7D1] bg-[#E1F4E8] text-[#0B3D2E] font-bold text-xs flex items-center">
                      ₹
                    </span>
                    <input
                      id="buyer-budget"
                      type="number"
                      step="100"
                      value={formData.budgetPerTonne}
                      onChange={(e) => setFormData({ ...formData, budgetPerTonne: Number(e.target.value) })}
                      required
                      className="w-full px-4 py-3 rounded-r-xl border border-l-0 border-[#C2E7D1] bg-[#F8FCF9] text-[#0B3D2E] text-sm font-semibold focus:outline-hidden focus:border-[#238B5A] focus:bg-white"
                    />
                    <span className="ml-2 text-xs text-[#3B5446] font-semibold self-center">/ tonne</span>
                  </div>
                </div>
              </div>

              {/* Quality Requirement */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0B3D2E] mb-2">
                  Quality Requirement
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Low contamination', 'Medium', 'Flexible'] as QualityRequirement[]).map((qual) => {
                    const isSelected = formData.qualityRequirement === qual;
                    return (
                      <button
                        key={qual}
                        type="button"
                        onClick={() => setFormData({ ...formData, qualityRequirement: qual })}
                        className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                          isSelected
                            ? 'bg-[#0B3D2E] text-[#C8EBD5] border-[#0B3D2E] shadow-sm'
                            : 'bg-[#EBF7F0] text-[#0B3D2E] border-[#C2E7D1] hover:border-[#238B5A]'
                        }`}
                      >
                        {qual}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Additional Requirements */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0B3D2E] mb-1.5" htmlFor="buyer-notes">
                  Additional Requirements & Technical Specs
                </label>
                <textarea
                  id="buyer-notes"
                  rows={2}
                  value={formData.additionalRequirements}
                  onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                  placeholder="e.g. Grain size < 2mm, bulk transport loading bay requirement..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#C2E7D1] bg-[#F8FCF9] text-[#0B3D2E] text-sm font-medium focus:outline-hidden focus:border-[#238B5A] focus:bg-white"
                />
              </div>

              {/* Submit Action */}
              <div className="pt-4 border-t border-[#D4EFE0] flex items-center justify-between">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-[#146B4A] hover:text-[#0B3D2E] transition-colors cursor-pointer bg-[#E1F4E8] border border-[#A8DEBF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[#0B3D2E] hover:bg-[#146B4A] text-white font-heading font-bold text-base shadow-xl shadow-[#0B3D2E]/25 transition-all cursor-pointer hover:scale-[1.01]"
                  id="buyer-submit-btn"
                >
                  <span>Find available waste</span>
                  <ArrowRight className="w-5 h-5 text-[#35A66F]" />
                </button>
              </div>
            </form>

          </div>
        </div>

      </div>

      {/* AI LOADING OVERLAY */}
      <AnimatePresence>
        {isAiSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0B3D2E]/90 backdrop-blur-md flex items-center justify-center p-4 text-white text-center"
            id="buyer-ai-searching-screen"
          >
            <div className="max-w-md w-full bg-[#146B4A]/60 rounded-3xl p-8 border border-[#35A66F]/40 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-[#238B5A] mx-auto flex items-center justify-center mb-6 shadow-lg">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>

              <h3 className="font-heading font-extrabold text-2xl text-white mb-2">
                Matching industrial waste suppliers...
              </h3>
              <p className="text-xs text-[#C8EBD5] mb-6">
                Filtering secondary material generators within {formData.maxDistanceKm} km of {formData.preferredLocation}.
              </p>

              <div className="space-y-2.5 text-left text-xs bg-[#0B3D2E]/70 p-4 rounded-xl border border-[#35A66F]/30">
                <div className="flex items-center gap-2 text-[#35A66F]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Cross-matching material specifications</span>
                </div>
                <div className="flex items-center gap-2 text-[#35A66F]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Evaluating quality and contamination thresholds</span>
                </div>
                <div className="flex items-center gap-2 text-[#35A66F]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Filtering within budget ₹{formData.budgetPerTonne.toLocaleString('en-IN')}/T</span>
                </div>
                <div className="flex items-center gap-2 text-[#C8EBD5]">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Ranking match score & carbon savings</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
