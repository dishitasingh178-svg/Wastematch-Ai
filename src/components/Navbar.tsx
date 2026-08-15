import React, { useState } from 'react';
import { MapPin, ArrowRight, User, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  currentView: string;
  isLoggedIn: boolean;
  userEmail?: string;
  location: string;
  matchesCount: number;
  onNavigate: (view: string) => void;
  onChangeLocation: () => void;
  onLogout: () => void;
  onLoginClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  isLoggedIn,
  userEmail = 'company@ecocement.in',
  location,
  matchesCount,
  onNavigate,
  onChangeLocation,
  onLogout,
  onLoginClick
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isLanding = currentView === 'landing';

  return (
    <header
      className="w-full z-40 bg-white/95 backdrop-blur-md text-[#10231A] border-b border-[#E8F3ED] sticky top-0 transition-all duration-200"
      id="main-navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate(isLoggedIn ? 'home' : 'landing')}
              className="flex items-center gap-2 cursor-pointer text-left focus:outline-hidden transition-transform active:scale-95"
              id="nav-brand-button"
            >
              <Logo variant="dark" size="md" />
            </button>

            <span className="hidden xl:inline-flex items-center gap-1.5 text-[11px] tracking-wider uppercase text-[#4A6054] font-semibold border-l border-[#D9F2E3] pl-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#238B5A]" />
              AI Industrial Resource Marketplace
            </span>
          </div>

          {/* Landing Navigation */}
          {isLanding ? (
            <div className="hidden md:flex items-center gap-8">
              <nav className="flex items-center gap-7 text-sm font-semibold text-[#4A6054]">
                <button
                  onClick={() => onNavigate('landing')}
                  className="hover:text-[#0B3D2E] transition-colors cursor-pointer"
                  id="nav-how-it-works"
                >
                  How it works
                </button>
                <button
                  onClick={() => {
                    if (isLoggedIn) onNavigate('home');
                    else onLoginClick();
                  }}
                  className="hover:text-[#0B3D2E] transition-colors cursor-pointer"
                  id="nav-marketplace"
                >
                  Marketplace
                </button>
                <button
                  onClick={() => onNavigate('landing')}
                  className="hover:text-[#0B3D2E] transition-colors cursor-pointer"
                  id="nav-about"
                >
                  About
                </button>
              </nav>

              <div className="flex items-center gap-3">
                <button
                  onClick={onLoginClick}
                  className="text-sm font-semibold text-[#0B3D2E] hover:text-[#238B5A] px-4 py-2 rounded-xl transition-colors cursor-pointer hover:bg-[#F4F9F6]"
                  id="nav-login-btn"
                >
                  Log in
                </button>
                <button
                  onClick={onLoginClick}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B3D2E] hover:bg-[#146B4A] text-white font-heading font-bold text-sm shadow-sm transition-all duration-150 cursor-pointer hover:translate-y-[-1px] active:translate-y-[0px]"
                  id="nav-get-started-btn"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 text-[#35A66F]" />
                </button>
              </div>
            </div>
          ) : (
            /* Logged-in / App Navigation */
            <div className="hidden md:flex items-center gap-6">
              <nav className="flex items-center gap-1 bg-[#F4F9F6] p-1 rounded-xl border border-[#E8F3ED]">
                <button
                  onClick={() => onNavigate('home')}
                  className={`px-4 py-2 rounded-lg text-sm font-heading font-bold transition-all cursor-pointer ${
                    currentView === 'home'
                      ? 'bg-white text-[#0B3D2E] shadow-2xs border border-[#E8F3ED]'
                      : 'text-[#60756A] hover:text-[#0B3D2E]'
                  }`}
                  id="nav-app-home"
                >
                  Home
                </button>
                <button
                  onClick={() => onNavigate('buy')}
                  className={`px-4 py-2 rounded-lg text-sm font-heading font-bold transition-all cursor-pointer ${
                    currentView === 'buy'
                      ? 'bg-white text-[#0B3D2E] shadow-2xs border border-[#E8F3ED]'
                      : 'text-[#60756A] hover:text-[#0B3D2E]'
                  }`}
                  id="nav-app-buy"
                >
                  Buy
                </button>
                <button
                  onClick={() => onNavigate('sell')}
                  className={`px-4 py-2 rounded-lg text-sm font-heading font-bold transition-all cursor-pointer ${
                    currentView === 'sell'
                      ? 'bg-white text-[#0B3D2E] shadow-2xs border border-[#E8F3ED]'
                      : 'text-[#60756A] hover:text-[#0B3D2E]'
                  }`}
                  id="nav-app-sell"
                >
                  Sell
                </button>
                <button
                  onClick={() => onNavigate('matches')}
                  className={`relative px-4 py-2 rounded-lg text-sm font-heading font-bold transition-all cursor-pointer ${
                    currentView === 'matches'
                      ? 'bg-white text-[#0B3D2E] shadow-2xs border border-[#E8F3ED]'
                      : 'text-[#60756A] hover:text-[#0B3D2E]'
                  }`}
                  id="nav-app-matches"
                >
                  <span>Matches</span>
                  {matchesCount > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-extrabold rounded-full bg-[#238B5A] text-white">
                      {matchesCount}
                    </span>
                  )}
                </button>
              </nav>

              <div className="flex items-center gap-3">
                {/* Location selector */}
                <button
                  onClick={onChangeLocation}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F4F9F6] hover:bg-[#E8F3ED] text-[#0B3D2E] text-xs font-bold border border-[#E8F3ED] transition-colors cursor-pointer"
                  id="nav-location-pill"
                  title="Click to switch industrial hub"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#238B5A]" />
                  <span>{location.split(',')[0]}</span>
                </button>

                {/* Profile menu */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="w-9 h-9 rounded-xl bg-[#0B3D2E] text-white flex items-center justify-center font-heading font-bold text-xs hover:bg-[#146B4A] transition-colors cursor-pointer border border-[#238B5A]/30 shadow-2xs"
                    id="nav-user-profile-btn"
                  >
                    <User className="w-4 h-4" />
                  </button>

                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E8F3ED] p-2 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                      id="profile-dropdown-menu"
                    >
                      <div className="px-3 py-2 border-b border-[#F4F9F6] mb-1">
                        <p className="text-[11px] font-semibold text-[#60756A] uppercase tracking-wider">Signed in as</p>
                        <p className="text-xs font-bold text-[#0B3D2E] truncate">{userEmail}</p>
                      </div>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onNavigate('matches');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#10231A] hover:bg-[#F4F9F6] transition-colors flex items-center justify-between"
                      >
                        <span>Active Matches</span>
                        <span className="px-1.5 py-0.5 rounded-md bg-[#EFF9F2] text-[#0B3D2E] font-bold text-[10px]">
                          {matchesCount}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onChangeLocation();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#10231A] hover:bg-[#F4F9F6] transition-colors flex items-center gap-2"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#238B5A]" />
                        <span>Change Hub ({location.split(',')[0]})</span>
                      </button>

                      <div className="my-1 border-t border-[#F4F9F6]"></div>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 cursor-pointer"
                        id="nav-signout-btn"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            {!isLanding && (
              <button
                onClick={onChangeLocation}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F4F9F6] text-[#0B3D2E] text-xs font-bold"
              >
                <MapPin className="w-3 h-3 text-[#238B5A]" />
                <span>{location.split(',')[0]}</span>
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#0B3D2E] hover:bg-[#F4F9F6]"
              id="mobile-nav-toggle"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div
            className="md:hidden py-4 border-t border-[#E8F3ED] bg-white"
            id="mobile-nav-menu"
          >
            {isLanding ? (
              <div className="flex flex-col space-y-2 px-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLoginClick();
                  }}
                  className="w-full text-left px-4 py-2.5 text-[#0B3D2E] font-semibold hover:bg-[#F4F9F6] rounded-xl"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLoginClick();
                  }}
                  className="w-full text-center py-3 bg-[#0B3D2E] text-white font-heading font-bold rounded-xl shadow-xs"
                >
                  Get Started
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-1.5 px-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('home');
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold ${
                    currentView === 'home' ? 'bg-[#EFF9F2] text-[#0B3D2E]' : 'text-[#10231A]'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('buy');
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold ${
                    currentView === 'buy' ? 'bg-[#EFF9F2] text-[#0B3D2E]' : 'text-[#10231A]'
                  }`}
                >
                  Buy Waste Materials
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('sell');
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold ${
                    currentView === 'sell' ? 'bg-[#EFF9F2] text-[#0B3D2E]' : 'text-[#10231A]'
                  }`}
                >
                  Sell Waste Materials
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('matches');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold ${
                    currentView === 'matches' ? 'bg-[#EFF9F2] text-[#0B3D2E]' : 'text-[#10231A]'
                  }`}
                >
                  <span>Your Matches</span>
                  {matchesCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#238B5A] text-white text-xs">
                      {matchesCount}
                    </span>
                  )}
                </button>
                <div className="pt-2 border-t border-[#F4F9F6]">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3.5 py-2 text-sm text-rose-600 font-semibold"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
