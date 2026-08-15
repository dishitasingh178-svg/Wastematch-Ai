import React from 'react';
import { Sparkles, MapPin, ArrowRight, ShieldCheck, Plus, CheckCircle2 } from 'lucide-react';
import { MatchHistoryEntry, MatchItem } from '../types';

interface MatchesPageProps {
  matches: MatchHistoryEntry[];
  onViewDetails: (item: MatchItem) => void;
  onNewSearch: () => void;
}

export const MatchesPage: React.FC<MatchesPageProps> = ({
  matches,
  onViewDetails,
  onNewSearch
}) => {
  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#F8FBF9] py-10 px-4 sm:px-6 lg:px-8" id="matches-page-root">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#238B5A] block mb-1">
              Active Trade Connections
            </span>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#10231A] tracking-tight">
              YOUR MATCHES
            </h1>
            <p className="text-sm text-[#60756A] mt-1">
              Industrial facilities and material streams you have connected with on WasteMatch.
            </p>
          </div>

          <button
            onClick={onNewSearch}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0B3D2E] hover:bg-[#146B4A] text-white font-heading font-bold text-xs shadow-md transition-all cursor-pointer self-start sm:self-center"
            id="new-match-search-btn"
          >
            <Plus className="w-4 h-4 text-[#35A66F]" />
            <span>Find New Matches</span>
          </button>
        </div>

        {/* Matches List */}
        {matches.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-[#D9F2E3] text-center shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-[#EFF9F2] text-[#238B5A] mx-auto flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-xl text-[#10231A] mb-2">
              No Matches Yet
            </h3>
            <p className="text-sm text-[#60756A] max-w-sm mx-auto mb-6">
              Start by creating a waste listing or searching for secondary materials to discover verified industrial matches.
            </p>
            <button
              onClick={onNewSearch}
              className="px-6 py-3 rounded-xl bg-[#238B5A] text-white font-heading font-bold text-sm shadow-md"
            >
              Start Matching Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="matches-grid">
            {matches.map((entry) => {
              const item = entry.matchItem;
              return (
                <div
                  key={entry.id}
                  onClick={() => onViewDetails(item)}
                  className="bg-white rounded-3xl p-6 border border-[#D9F2E3] shadow-md shadow-[#0B3D2E]/5 hover:shadow-xl hover:border-[#238B5A]/40 transition-all group cursor-pointer flex flex-col justify-between"
                  id={`match-entry-${entry.id}`}
                >
                  <div>
                    {/* Top Row: Match score & status */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EFF9F2] border border-[#238B5A]/30 text-[#0B3D2E] font-heading font-extrabold text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-[#238B5A]" />
                        <span>{item.matchScore}% MATCH</span>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full bg-[#D9F2E3] text-[#0B3D2E] text-[11px] font-bold">
                        {entry.status}
                      </span>
                    </div>

                    {/* Image & Company Info */}
                    <div className="flex items-start gap-3.5 mb-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#EFF9F2] border border-[#D9F2E3] shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.companyName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div>
                        <h3 className="font-heading font-bold text-lg text-[#10231A] group-hover:text-[#238B5A] transition-colors leading-tight">
                          {item.companyName}
                        </h3>
                        <p className="text-xs text-[#60756A] flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-[#238B5A]" />
                          <span>{item.location}</span>
                          <span>•</span>
                          <span className="text-[#238B5A] font-semibold">{item.distanceKm} km away</span>
                        </p>
                      </div>
                    </div>

                    {/* Material & Offer Specs */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-[#F8FBF9] p-3 rounded-2xl border border-[#EFF9F2] mb-4">
                      <div>
                        <span className="text-[#60756A] text-[10px] uppercase block">Material</span>
                        <span className="font-bold text-[#10231A] truncate block">{item.materialName}</span>
                      </div>
                      <div>
                        <span className="text-[#60756A] text-[10px] uppercase block">Volume / Rate</span>
                        <span className="font-heading font-bold text-[#146B4A]">{item.offerPriceStr}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-3 border-t border-[#EFF9F2] flex items-center justify-between text-xs font-heading font-bold text-[#0B3D2E]">
                    <span className="text-[#60756A] font-normal text-[11px]">Matched {entry.matchedAt}</span>
                    <div className="flex items-center gap-1 text-[#238B5A] group-hover:translate-x-1 transition-transform">
                      <span>View Specifications</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
