import React from 'react';
import { MapPin, X, Check } from 'lucide-react';
import { CITIES_LIST } from '../data/mockData';

interface LocationModalProps {
  isOpen: boolean;
  currentLocation: string;
  onSelectLocation: (loc: string) => void;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  currentLocation,
  onSelectLocation,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10231A]/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-[#D9F2E3] animate-in fade-in zoom-in-95 duration-200"
        id="location-selector-modal"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#EFF9F2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EFF9F2] text-[#146B4A] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-[#10231A]">Select Industrial Hub</h3>
              <p className="text-xs text-[#60756A]">Matches will prioritize suppliers within your logistics radius</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#60756A] hover:bg-[#EFF9F2] hover:text-[#10231A] transition-colors"
            id="close-location-modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-1.5 max-h-72 overflow-y-auto pr-1">
          {CITIES_LIST.map((city) => {
            const isSelected = city === currentLocation;
            return (
              <button
                key={city}
                onClick={() => {
                  onSelectLocation(city);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  isSelected
                    ? 'bg-[#EFF9F2] text-[#0B3D2E] border border-[#35A66F]/40'
                    : 'text-[#10231A] hover:bg-[#F8FBF9] hover:text-[#146B4A] border border-transparent'
                }`}
                id={`city-option-${city.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#238B5A]' : 'text-[#60756A]'}`} />
                  <span>{city}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#238B5A]" />}
              </button>
            );
          })}
        </div>

        <div className="mt-5 pt-3 border-t border-[#EFF9F2] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-[#60756A] hover:text-[#10231A] transition-colors"
            id="cancel-location-btn"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
