import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Recycle, Factory, Heart, X, CheckCircle2, Sparkles, ShieldCheck, Zap, TrendingUp } from 'lucide-react';
import { Logo } from './Logo';

interface LandingPageProps {
  onGetStarted: () => void;
  onSelectSell: () => void;
  onSelectBuy: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onSelectSell,
  onSelectBuy
}) => {
  // Mini interactive demo for the hero card
  const [heroCardState, setHeroCardState] = useState<'idle' | 'matched' | 'passed'>('idle');

  const handleHeroPass = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHeroCardState('passed');
    setTimeout(() => setHeroCardState('idle'), 1800);
  };

  const handleHeroMatch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHeroCardState('matched');
    setTimeout(() => setHeroCardState('idle'), 2200);
  };

  return (
    <div className="w-full min-h-screen bg-white text-[#10231A] flex flex-col justify-between" id="landing-page-root">
      
      {/* 1. HERO SECTION (Soft Mint Wash + Emerald Atmosphere) */}
      <section className="relative w-full bg-gradient-to-b from-[#EDF7F1] via-[#F8FCF9] to-white pt-10 sm:pt-14 pb-20 sm:pb-28 overflow-hidden border-b border-[#D4EFE0]">
        {/* Subtle decorative radial gradients */}
        <div className="absolute -top-24 right-0 w-[500px] h-[500px] bg-[#D4EFE0]/60 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/2 left-[-100px] w-96 h-96 bg-[#A8DEBF]/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 flex flex-col items-start"
            >
              {/* Pill Badge in Mint Sage */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E1F4E8] border border-[#A8DEBF] text-[#0B3D2E] text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#238B5A]" />
                <span>AI-Powered Industrial Resource Marketplace</span>
              </div>

              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#0B3D2E] tracking-tight leading-[1.1] mb-6">
                Turn industrial waste <br className="hidden sm:block" />
                <span className="text-[#238B5A]">into your next resource.</span>
              </h1>

              <p className="font-body text-base sm:text-lg lg:text-xl text-[#3B5446] max-w-xl leading-relaxed mb-8">
                WasteMatch connects industrial facilities that generate byproducts with verified companies ready to purchase secondary materials using intelligent AI matching.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
                <button
                  onClick={onGetStarted}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#0B3D2E] hover:bg-[#146B4A] text-white font-heading font-bold text-base shadow-lg shadow-[#0B3D2E]/25 transition-all duration-150 hover:translate-y-[-1px] active:translate-y-[0px] cursor-pointer"
                  id="hero-find-match-btn"
                >
                  <span>Find a Match</span>
                  <ArrowRight className="w-5 h-5 text-[#35A66F]" />
                </button>

                <button
                  onClick={onSelectBuy}
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-[#A8DEBF] bg-white hover:bg-[#E1F4E8] text-[#0B3D2E] font-heading font-bold text-base transition-all duration-150 cursor-pointer shadow-2xs"
                  id="hero-explore-btn"
                >
                  Explore marketplace
                </button>
              </div>

              {/* Trust Indicators in Soft Mint Box */}
              <div className="mt-10 p-4 rounded-2xl bg-white/80 border border-[#C8EBD5] flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-bold text-[#0B3D2E] shadow-2xs backdrop-blur-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#238B5A]" />
                  <span>Verified B2B Facilities</span>
                </div>
                <div className="flex items-center gap-2">
                  <Recycle className="w-4 h-4 text-[#238B5A]" />
                  <span>Circular Economy Standard</span>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#238B5A]" />
                  <span>AI Compliance Guidance</span>
                </div>
              </div>
            </motion.div>

            {/* Right Visual: Signature Tinder Card Stack Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5 flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-sm sm:max-w-md">
                
                {/* 3rd Card in stack (lowest) */}
                <div className="absolute inset-0 translate-y-6 scale-90 bg-[#D4EFE0] rounded-3xl border border-[#A8DEBF] transform -rotate-3" />
                
                {/* 2nd Card in stack (middle) */}
                <div className="absolute inset-0 translate-y-3 scale-95 bg-[#EBF7F0] rounded-3xl shadow-md transform rotate-2 border border-[#C2E7D1]" />

                {/* Top Interactive Hero Card */}
                <motion.div
                  animate={{
                    x: heroCardState === 'passed' ? -80 : heroCardState === 'matched' ? 80 : 0,
                    rotate: heroCardState === 'passed' ? -7 : heroCardState === 'matched' ? 7 : 0,
                    opacity: heroCardState !== 'idle' ? 0.7 : 1
                  }}
                  transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                  className="relative bg-white text-[#10231A] rounded-3xl p-5 shadow-xl shadow-[#0B3D2E]/12 border-2 border-[#A8DEBF] overflow-hidden"
                  id="hero-floating-match-card"
                >
                  {/* Top Match Badge */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E1F4E8] border border-[#238B5A] text-[#0B3D2E] font-heading font-extrabold text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-[#238B5A]" />
                      <span>94% MATCH</span>
                    </div>
                    <span className="text-[11px] font-extrabold text-[#146B4A] bg-[#EFF9F2] px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                      Industrial Buyer
                    </span>
                  </div>

                  {/* Image container */}
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 bg-[#EFF9F2]">
                    <img
                      src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                      alt="EcoCement Industrial Facility"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D2E]/85 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-3 text-white">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#A8DEBF]">Target Material</span>
                      <p className="font-heading font-bold text-sm leading-tight">Silica Waste / Pozzolan</p>
                    </div>
                  </div>

                  {/* Company Details */}
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-heading font-extrabold text-lg text-[#0B3D2E] leading-tight">
                          EcoCement Industries
                        </h3>
                        <p className="text-xs text-[#4A6054] flex items-center gap-1 mt-0.5 font-semibold">
                          <span>Pune, Maharashtra</span>
                          <span>•</span>
                          <span className="text-[#238B5A] font-bold">24 km away</span>
                        </p>
                      </div>
                      <div className="text-right bg-[#E1F4E8] px-2.5 py-1 rounded-xl border border-[#A8DEBF]">
                        <span className="text-[10px] font-extrabold uppercase text-[#146B4A] tracking-wider block">Est. Value</span>
                        <p className="font-heading font-extrabold text-base text-[#0B3D2E]">₹1,05,000</p>
                      </div>
                    </div>

                    {/* Spec grid in distinct soft green boxes */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#D4EFE0] text-xs">
                      <div className="bg-[#EBF7F0] p-2.5 rounded-xl border border-[#C2E7D1]">
                        <span className="text-[#146B4A] block text-[10px] uppercase font-extrabold tracking-wider">Capacity</span>
                        <span className="font-bold text-[#0B3D2E]">15 tonnes</span>
                      </div>
                      <div className="bg-[#EBF7F0] p-2.5 rounded-xl border border-[#C2E7D1]">
                        <span className="text-[#146B4A] block text-[10px] uppercase font-extrabold tracking-wider">Offer Price</span>
                        <span className="font-bold text-[#0B3D2E]">₹7,000 / t</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#0B3D2E] text-[#C8EBD5] text-[10px] font-extrabold tracking-wide uppercase">
                        MATERIAL COMPATIBLE
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#E1F4E8] text-[#146B4A] text-[10px] font-extrabold tracking-wide uppercase border border-[#A8DEBF]">
                        NEARBY
                      </span>
                    </div>
                  </div>

                  {/* Swipe Action Buttons */}
                  <div className="flex items-center justify-center gap-5 mt-4 pt-3 border-t border-[#D4EFE0]">
                    <button
                      onClick={handleHeroPass}
                      className="w-12 h-12 rounded-full border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 hover:scale-105 active:scale-95 shadow-sm flex items-center justify-center transition-all cursor-pointer"
                      title="Pass"
                      id="hero-pass-btn"
                    >
                      <X className="w-5 h-5 stroke-[2.5]" />
                    </button>

                    <button
                      onClick={handleHeroMatch}
                      className="w-14 h-14 rounded-full bg-[#0B3D2E] hover:bg-[#146B4A] text-white hover:scale-105 active:scale-95 shadow-lg shadow-[#0B3D2E]/30 flex items-center justify-center transition-all cursor-pointer"
                      title="Match"
                      id="hero-match-btn"
                    >
                      <Heart className="w-6 h-6 fill-[#35A66F] text-[#35A66F]" />
                    </button>
                  </div>

                  {/* Live Mini Match Notification */}
                  <AnimatePresence>
                    {heroCardState === 'matched' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[#0B3D2E]/95 text-white flex flex-col items-center justify-center p-6 text-center z-20 backdrop-blur-xs"
                      >
                        <div className="w-12 h-12 rounded-full bg-[#238B5A] text-white flex items-center justify-center mb-3">
                          <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <h4 className="font-heading font-extrabold text-xl mb-1 text-white">It's a Match!</h4>
                        <p className="text-xs text-[#C8EBD5] mb-4">EcoCement is ready to acquire your 15 tonnes of Silica Waste.</p>
                        <button
                          onClick={onGetStarted}
                          className="px-4 py-2 rounded-xl bg-white text-[#0B3D2E] font-heading font-bold text-xs shadow-md hover:bg-[#EFF9F2] transition-colors cursor-pointer"
                        >
                          Continue to Marketplace
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. SHORT PRODUCT EXPLANATION ("One marketplace. Two sides.") */}
      <section className="w-full py-16 sm:py-24 bg-[#F2FAF5] border-b border-[#D4EFE0]" id="two-sides-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#0B3D2E] tracking-tight leading-tight">
              One marketplace. <br />
              <span className="text-[#238B5A]">Two sides.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#3B5446] font-medium mt-3">
              Whether you generate industrial byproducts or consume secondary raw materials, WasteMatch simplifies discovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Card 1: SELL (Deep Pine Box) */}
            <div
              className="bg-[#0B3D2E] text-white rounded-3xl p-8 sm:p-10 border border-[#146B4A] shadow-xl shadow-[#0B3D2E]/15 flex flex-col justify-between hover:border-[#238B5A] transition-all duration-200 group relative overflow-hidden"
              id="card-have-waste-sell"
            >
              <div className="relative z-10">
                <div className="w-13 h-13 rounded-2xl bg-[#146B4A] text-[#A8DEBF] flex items-center justify-center mb-6 group-hover:bg-[#238B5A] group-hover:text-white transition-colors duration-200">
                  <Recycle className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#35A66F] block mb-1">
                  Generators
                </span>
                <h3 className="font-heading font-extrabold text-2xl text-white mb-3">
                  I HAVE WASTE TO SELL
                </h3>
                <p className="text-[#C8EBD5] text-sm sm:text-base leading-relaxed mb-8">
                  List your industrial waste and let AI find verified companies that can use it as secondary raw material.
                </p>
              </div>

              <div className="relative z-10">
                <button
                  onClick={onSelectSell}
                  className="inline-flex items-center justify-between w-full px-5 py-3.5 rounded-xl bg-[#238B5A] hover:bg-[#35A66F] text-white font-heading font-bold text-sm transition-all duration-150 cursor-pointer shadow-md shadow-[#238B5A]/30"
                  id="btn-sell-my-waste"
                >
                  <span>Sell my waste</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Card 2: BUY (Soft Celadon Box) */}
            <div
              className="bg-[#EBF7F0] rounded-3xl p-8 sm:p-10 border-2 border-[#C2E7D1] shadow-lg shadow-[#0B3D2E]/5 flex flex-col justify-between hover:border-[#238B5A] transition-all duration-200 group relative overflow-hidden"
              id="card-need-waste-buy"
            >
              <div className="relative z-10">
                <div className="w-13 h-13 rounded-2xl bg-[#D4EFE0] text-[#0B3D2E] flex items-center justify-center mb-6 group-hover:bg-[#0B3D2E] group-hover:text-white transition-colors duration-200 border border-[#A8DEBF]">
                  <Factory className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#146B4A] block mb-1">
                  Processors & Sourcing
                </span>
                <h3 className="font-heading font-extrabold text-2xl text-[#0B3D2E] mb-3">
                  I NEED WASTE TO BUY
                </h3>
                <p className="text-[#3B5446] text-sm sm:text-base leading-relaxed mb-8">
                  Find industrial secondary materials available from nearby manufacturers at competitive circular rates.
                </p>
              </div>

              <div className="relative z-10">
                <button
                  onClick={onSelectBuy}
                  className="inline-flex items-center justify-between w-full px-5 py-3.5 rounded-xl bg-[#0B3D2E] hover:bg-[#146B4A] text-white font-heading font-bold text-sm transition-all duration-150 cursor-pointer shadow-md"
                  id="btn-find-waste"
                >
                  <span>Find waste</span>
                  <ArrowRight className="w-4 h-4 text-[#35A66F]" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FINAL LANDING CTA (Rich Deep Forest Green Card) */}
      <section className="w-full py-16 sm:py-20 bg-gradient-to-b from-white to-[#F2FAF5]" id="final-landing-cta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-[#0B3D2E] text-white rounded-3xl p-8 sm:p-12 border border-[#146B4A] text-center shadow-xl shadow-[#0B3D2E]/20 relative overflow-hidden">
            {/* Glow effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#238B5A]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-[#35A66F] mb-2">
                Accelerate Industrial Circularity
              </span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-3">
                Your waste has another destination.
              </h2>
              <p className="text-sm sm:text-base text-[#C8EBD5] max-w-xl mx-auto mb-8">
                Join forward-thinking manufacturing clusters turning disposal costs into profitable circular revenue.
              </p>

              <button
                onClick={onGetStarted}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[#238B5A] hover:bg-[#35A66F] text-white font-heading font-bold text-base shadow-lg shadow-[#238B5A]/40 transition-all duration-150 hover:translate-y-[-1px] active:translate-y-[0px] cursor-pointer"
                id="cta-get-started-btn"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPACT FOOTER */}
      <footer className="w-full py-8 bg-white text-[#60756A] border-t border-[#E8F3ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo variant="dark" size="sm" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-semibold text-[#4A6054]">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-[#0B3D2E] transition-colors cursor-pointer">
              How it works
            </button>
            <button onClick={onSelectBuy} className="hover:text-[#0B3D2E] transition-colors cursor-pointer">
              About
            </button>
            <button onClick={onGetStarted} className="hover:text-[#0B3D2E] transition-colors cursor-pointer">
              Contact
            </button>
            <span className="hover:text-[#0B3D2E] cursor-pointer">Privacy & Terms</span>
          </div>

          <p className="text-xs text-[#60756A]">
            © {new Date().getFullYear()} WasteMatch Inc. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
};
