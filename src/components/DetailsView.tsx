import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Leaf, 
  Building2, 
  Phone, 
  Mail, 
  CheckCircle2, 
  FileText, 
  Share2, 
  Clock, 
  DollarSign, 
  PackageCheck,
  Send
} from 'lucide-react';
import { MatchItem } from '../types';

interface DetailsViewProps {
  matchItem: MatchItem;
  flowType: 'seller' | 'buyer';
  onBack: () => void;
  onInitiateContact?: (item: MatchItem) => void;
}

export const DetailsView: React.FC<DetailsViewProps> = ({
  matchItem,
  flowType,
  onBack,
  onInitiateContact
}) => {
  const [connectMessageSent, setConnectMessageSent] = useState(false);
  const isSeller = flowType === 'seller';

  const handleContactSubmit = () => {
    setConnectMessageSent(true);
    if (onInitiateContact) onInitiateContact(matchItem);
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#F2FAF5] via-[#F8FCF9] to-[#EDF7F1] py-8 sm:py-12 px-4 sm:px-6 lg:px-8" id="match-details-root">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E1F4E8] border border-[#A8DEBF] text-xs font-extrabold text-[#0B3D2E] hover:bg-[#D4EFE0] transition-colors cursor-pointer shadow-xs"
            id="details-back-btn"
          >
            <ArrowLeft className="w-4 h-4 text-[#146B4A]" />
            <span>Back to Matching</span>
          </button>

          <div className="flex items-center gap-2 bg-[#EBF7F0] px-3 py-1.5 rounded-xl border border-[#C2E7D1]">
            <span className="text-xs font-bold text-[#0B3D2E]">Verified Partner Match</span>
            <div className="w-2 h-2 rounded-full bg-[#238B5A] animate-pulse" />
          </div>
        </div>

        {/* Hero Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C2E7D1] shadow-xl shadow-[#0B3D2E]/5 mb-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#D4EFE0]">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#EBF7F0] border-2 border-[#A8DEBF] shrink-0 shadow-sm">
                <img
                  src={matchItem.imageUrl}
                  alt={matchItem.companyName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0B3D2E] leading-tight">
                    {matchItem.companyName}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E1F4E8] text-[#146B4A] font-heading font-bold text-xs border border-[#A8DEBF]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified B2B</span>
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#3B5446] flex items-center gap-2 mt-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-[#238B5A]" />
                  <span>{matchItem.location}</span>
                  <span>•</span>
                  <span className="text-[#0B3D2E] font-bold">{matchItem.distanceKm} km logistics distance</span>
                </p>
              </div>
            </div>

            {/* Match Score Badge */}
            <div className="flex md:flex-col items-center md:items-end justify-between bg-[#EBF7F0] md:bg-transparent p-3 md:p-0 rounded-2xl border border-[#C2E7D1] md:border-none">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#0B3D2E] text-white font-heading font-extrabold text-sm shadow-md">
                <Sparkles className="w-4 h-4 text-[#35A66F]" />
                <span>{matchItem.matchScore}% MATCH</span>
              </div>
              <span className="text-xs text-[#146B4A] mt-1 font-bold">AI Compatibility Score</span>
            </div>
          </div>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            <div className="bg-[#F8FCF9] p-4 rounded-2xl border border-[#C2E7D1]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#146B4A] block mb-1">
                Target Material
              </span>
              <span className="font-heading font-bold text-sm text-[#0B3D2E] block">
                {matchItem.materialName}
              </span>
              <span className="text-[11px] text-[#3B5446] font-medium">{matchItem.materialTypeCategory}</span>
            </div>

            <div className="bg-[#F8FCF9] p-4 rounded-2xl border border-[#C2E7D1]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#146B4A] block mb-1">
                {isSeller ? 'Required Quantity' : 'Available Quantity'}
              </span>
              <span className="font-heading font-bold text-sm text-[#0B3D2E] block">
                {matchItem.quantityStr}
              </span>
              <span className="text-[11px] text-[#3B5446] font-medium">Batch delivery</span>
            </div>

            <div className="bg-[#EBF7F0] p-4 rounded-2xl border border-[#A8DEBF]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0B3D2E] block mb-1">
                {isSeller ? 'Offer Price' : 'Listing Price'}
              </span>
              <span className="font-heading font-extrabold text-sm text-[#0B3D2E] block">
                {matchItem.offerPriceStr}
              </span>
              <span className="text-[11px] text-[#146B4A] font-semibold">Ex-works / Net</span>
            </div>

            <div className="bg-[#F8FCF9] p-4 rounded-2xl border border-[#C2E7D1]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#146B4A] block mb-1">
                Contamination
              </span>
              <span className="font-heading font-bold text-sm text-[#0B3D2E] block">
                {matchItem.contaminationLevel}
              </span>
              <span className="text-[11px] text-[#238B5A] font-bold">Feedstock Grade</span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 pt-6 border-t border-[#D4EFE0]">
            <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#146B4A] mb-2">
              Facility & Operations Profile
            </h3>
            <p className="text-sm text-[#0B3D2E] leading-relaxed font-medium">
              {matchItem.description}
            </p>
          </div>

        </div>

        {/* TWO IMPORTANT COMPACT SECTIONS: 1. COMPLIANCE & 2. ENVIRONMENTAL IMPACT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* 1. AI-ASSISTED COMPLIANCE */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#C2E7D1] shadow-lg shadow-[#0B3D2E]/5 flex flex-col justify-between" id="details-compliance-section">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#D4EFE0]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#E1F4E8] text-[#0B3D2E] flex items-center justify-center border border-[#A8DEBF]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-[#0B3D2E]">
                      AI-ASSISTED COMPLIANCE
                    </h3>
                    <span className="text-[10px] text-[#3B5446] font-medium">Regulatory Pre-Screen</span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-md bg-[#E1F4E8] text-[#0B3D2E] font-heading font-extrabold text-[11px] tracking-wider border border-[#A8DEBF]">
                  {matchItem.compliance.riskStatus}
                </span>
              </div>

              {/* Checklist */}
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#238B5A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#0B3D2E] block">Material Classification</span>
                    <span className="text-[#3B5446] font-medium">{matchItem.compliance.materialClassification}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#238B5A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#0B3D2E] block">Documentation Guidance</span>
                    <span className="text-[#3B5446] font-medium">{matchItem.compliance.documentationGuidance}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#238B5A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#0B3D2E] block">Facility Compatibility</span>
                    <span className="text-[#3B5446] font-medium">{matchItem.compliance.facilityCompatibility}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mandatory Disclaimer */}
            <div className="mt-6 p-3 rounded-xl bg-[#F8FCF9] border border-[#C2E7D1] text-[10px] text-[#3B5446] leading-relaxed">
              <strong className="text-[#0B3D2E]">Disclaimer:</strong> {matchItem.compliance.disclaimer}
            </div>
          </div>

          {/* 2. ENVIRONMENTAL IMPACT */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#C2E7D1] shadow-lg shadow-[#0B3D2E]/5 flex flex-col justify-between" id="details-impact-section">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#D4EFE0]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#E1F4E8] text-[#0B3D2E] flex items-center justify-center border border-[#A8DEBF]">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-[#0B3D2E]">
                      ENVIRONMENTAL IMPACT
                    </h3>
                    <span className="text-[10px] text-[#146B4A] font-bold">Circular Economy Contribution</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EBF7F0] text-[#0B3D2E] border border-[#C2E7D1]">
                  Scope 3 Savings
                </span>
              </div>

              {/* 3 Metric Blocks */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#EBF7F0] border border-[#C2E7D1]">
                  <span className="text-xs font-bold text-[#0B3D2E]">
                    CO₂ potentially avoided
                  </span>
                  <span className="font-heading font-extrabold text-base text-[#146B4A]">
                    {matchItem.impact.co2AvoidedKg} kg
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#EBF7F0] border border-[#C2E7D1]">
                  <span className="text-xs font-bold text-[#0B3D2E]">
                    Landfill diverted
                  </span>
                  <span className="font-heading font-extrabold text-base text-[#146B4A]">
                    {matchItem.impact.landfillDivertedKg} kg
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#EBF7F0] border border-[#C2E7D1]">
                  <span className="text-xs font-bold text-[#0B3D2E]">
                    Recovered material value
                  </span>
                  <span className="font-heading font-extrabold text-base text-[#0B3D2E]">
                    ₹{matchItem.impact.recoveredValueInr.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Mandatory Prototype Label */}
            <div className="mt-6 text-center bg-[#F8FCF9] py-2 px-3 rounded-xl border border-[#D4EFE0]">
              <span className="text-[11px] font-extrabold text-[#146B4A] uppercase tracking-wider">
                Prototype estimates
              </span>
              <p className="text-[10px] text-[#3B5446] mt-0.5 font-medium">
                Calculated based on standard CPCB pozzolan emission substitution factors.
              </p>
            </div>
          </div>

        </div>

        {/* Direct Connect / Trade Initiation Actions */}
        <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#146B4A]">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#35A66F] block mb-1">
                NEXT STEPS
              </span>
              <h3 className="font-heading font-extrabold text-2xl text-white">
                Initiate Trade Connection
              </h3>
              <p className="text-xs text-[#C8EBD5] mt-1 max-w-md">
                Directly contact {matchItem.companyName}'s procurement desk to request sample dispatch or trade agreement terms.
              </p>
            </div>

            {connectMessageSent ? (
              <div className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#238B5A] text-white font-heading font-bold text-sm shadow-md">
                <CheckCircle2 className="w-5 h-5" />
                <span>Trade Request Sent!</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleContactSubmit}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#238B5A] hover:bg-[#35A66F] text-white font-heading font-bold text-sm shadow-lg shadow-black/25 transition-all cursor-pointer hover:scale-105"
                  id="connect-with-company-btn"
                >
                  <Send className="w-4 h-4" />
                  <span>Connect with Company</span>
                </button>
              </div>
            )}
          </div>

          {/* Contact Details Card if provided */}
          {matchItem.contactPerson && (
            <div className="mt-6 pt-6 border-t border-[#146B4A] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#C8EBD5]">
              <div>
                <span className="text-[10px] text-[#35A66F] uppercase font-bold block">Designated Officer</span>
                <span className="font-semibold text-white">{matchItem.contactPerson.name}</span> ({matchItem.contactPerson.role})
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#35A66F]" />
                <span>{matchItem.contactPerson.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#35A66F]" />
                <span className="truncate">{matchItem.contactPerson.email}</span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
