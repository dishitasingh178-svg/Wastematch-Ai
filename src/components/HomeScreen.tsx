import React from 'react';
import { motion } from 'motion/react';
import { Recycle, Factory, MapPin, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface HomeScreenProps {
  location: string;
  onChangeLocation: () => void;
  onSelectSell: () => void;
  onSelectBuy: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  location,
  onChangeLocation,
  onSelectSell,
  onSelectBuy
}) => {
  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#F2FAF5] via-[#F8FCF9] to-[#EDF7F1] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" id="home-screen-root">
      <div className="w-full max-w-4xl mx-auto text-center">
        
        {/* Location pill in soft green */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E1F4E8] border border-[#A8DEBF] text-[#0B3D2E] text-xs font-bold shadow-2xs mb-6 cursor-pointer hover:bg-[#D4EFE0] transition-colors"
          onClick={onChangeLocation}
          id="home-location-badge"
        >
          <MapPin className="w-3.5 h-3.5 text-[#146B4A]" />
          <span>Active Hub: <strong className="text-[#0B3D2E]">{location}</strong></span>
          <span className="text-[#146B4A] text-[11px] font-bold underline underline-offset-2 ml-1">Switch</span>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 sm:mb-12"
        >
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0B3D2E] tracking-tight mb-3">
            WHAT ARE YOU LOOKING FOR TODAY?
          </h1>
          <p className="font-body text-base sm:text-lg text-[#3B5446] max-w-xl mx-auto">
            Select an objective to match with verified regional industrial partners.
          </p>
        </motion.div>

        {/* Two High-Craft Action Cards with Distinct Green Palette */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left">
          
          {/* Card 1: SELL - Deep Forest Green Theme */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-[#0B3D2E] text-white rounded-3xl p-8 sm:p-10 border border-[#146B4A] shadow-xl shadow-[#0B3D2E]/20 hover:shadow-2xl hover:border-[#238B5A] transition-all duration-200 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
            onClick={onSelectSell}
            id="home-card-sell"
          >
            {/* Subtle decorative glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#238B5A]/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              {/* Icon in Emerald Glow */}
              <div className="w-14 h-14 rounded-2xl bg-[#146B4A] text-[#A8DEBF] flex items-center justify-center mb-6 group-hover:bg-[#238B5A] group-hover:text-white transition-colors duration-200 shadow-md">
                <Recycle className="w-7 h-7" />
              </div>

              {/* Title & Tagline */}
              <div className="mb-4">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#35A66F] block mb-1">
                  Resource Generator
                </span>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                  I HAVE WASTE TO SELL
                </h2>
                <p className="font-heading font-medium text-sm text-[#A8DEBF] mt-1">
                  "Turn your byproduct streams into revenue."
                </p>
              </div>

              {/* Description */}
              <p className="text-[#C8EBD5] text-sm leading-relaxed mb-8">
                List your industrial waste and let AI find verified companies that can utilize it as secondary raw material.
              </p>
            </div>

            {/* Action button in Vibrant Emerald */}
            <div className="relative z-10">
              <button
                onClick={onSelectSell}
                className="w-full py-4 px-6 rounded-xl bg-[#238B5A] hover:bg-[#35A66F] text-white font-heading font-bold text-sm flex items-center justify-between shadow-md shadow-[#238B5A]/30 transition-all duration-150 group-hover:shadow-lg cursor-pointer"
                id="home-btn-sell-my-waste"
              >
                <span>Sell my waste</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Card 2: BUY - Soft Celadon Sage Theme with Deep Forest Accents */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            whileHover={{ y: -4 }}
            className="bg-[#EBF7F0] rounded-3xl p-8 sm:p-10 border-2 border-[#C2E7D1] shadow-lg shadow-[#0B3D2E]/5 hover:shadow-xl hover:border-[#238B5A] transition-all duration-200 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
            onClick={onSelectBuy}
            id="home-card-buy"
          >
            {/* Subtle decorative glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#238B5A]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-[#D4EFE0] text-[#0B3D2E] flex items-center justify-center mb-6 group-hover:bg-[#0B3D2E] group-hover:text-white transition-colors duration-200 shadow-2xs border border-[#A8DEBF]">
                <Factory className="w-7 h-7" />
              </div>

              {/* Title & Tagline */}
              <div className="mb-4">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#146B4A] block mb-1">
                  Secondary Material Sourcing
                </span>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0B3D2E] tracking-tight">
                  I NEED WASTE TO BUY
                </h2>
                <p className="font-heading font-semibold text-sm text-[#146B4A] mt-1">
                  "Find affordable secondary materials."
                </p>
              </div>

              {/* Description */}
              <p className="text-[#3B5446] text-sm leading-relaxed mb-8">
                Search available secondary materials and find compatible byproduct streams from nearby facilities.
              </p>
            </div>

            {/* Action button in Deep Forest Pine */}
            <div className="relative z-10">
              <button
                onClick={onSelectBuy}
                className="w-full py-4 px-6 rounded-xl bg-[#0B3D2E] hover:bg-[#146B4A] text-white font-heading font-bold text-sm flex items-center justify-between shadow-md transition-all duration-150 group-hover:shadow-lg cursor-pointer"
                id="home-btn-find-waste"
              >
                <span>Find waste</span>
                <ArrowRight className="w-4 h-4 text-[#35A66F] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

        </div>

        {/* Subtle AI Matching Guarantee */}
        <div className="mt-10 inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-[#E1F4E8] border border-[#A8DEBF] text-xs font-bold text-[#0B3D2E] shadow-2xs">
          <Sparkles className="w-4 h-4 text-[#238B5A]" />
          <span>Intelligent matching algorithms calculate chemical composition & logistics radius</span>
        </div>

      </div>
    </div>
  );
};
