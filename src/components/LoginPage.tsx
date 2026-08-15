import React, { useState } from 'react';
import { ArrowRight, Factory, Recycle, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import { Logo } from './Logo';

interface LoginPageProps {
  onLoginSuccess: (email: string) => void;
  onBackToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onBackToLanding
}) => {
  const [email, setEmail] = useState('operations@ecocement.in');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(email || 'company@ecocement.in');
    }, 600);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess('company.admin@google.com');
    }, 600);
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex items-stretch bg-white" id="login-screen-root">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-80px)]">
        
        {/* LEFT SIDE (Deep Forest Green) */}
        <div className="hidden lg:flex lg:col-span-6 bg-[#0B3D2E] text-white p-12 xl:p-16 flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-10 right-10 w-80 h-80 bg-[#35A66F]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-60 h-60 bg-[#146B4A]/30 rounded-full blur-2xl pointer-events-none" />

          {/* Top Brand */}
          <div className="relative z-10">
            <button
              onClick={onBackToLanding}
              className="inline-block text-left cursor-pointer focus:outline-hidden"
              id="login-brand-back-btn"
            >
              <Logo variant="light" size="md" />
            </button>
          </div>

          {/* Center Content & Visual Flow */}
          <div className="relative z-10 my-auto py-8">
            <h1 className="font-heading font-extrabold text-4xl xl:text-5xl text-white tracking-tight leading-tight mb-4">
              Give waste <br />
              <span className="text-[#35A66F]">a second life.</span>
            </h1>
            <p className="text-[#C8EBD5] text-base leading-relaxed max-w-md mb-10">
              AI-powered resource matching for modern industry. Connecting generators with secondary processors.
            </p>

            {/* Visual Flow: FACTORY -> WASTE -> MATCH -> RESOURCE */}
            <div className="bg-[#146B4A]/40 rounded-2xl p-6 border border-[#35A66F]/30 backdrop-blur-xs max-w-lg">
              <div className="text-[11px] font-extrabold tracking-wider uppercase text-[#C8EBD5] mb-4">
                Circular Value Architecture
              </div>

              <div className="grid grid-cols-4 gap-2 items-center text-center">
                {/* 1. FACTORY */}
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-xl bg-[#0B3D2E] border border-[#35A66F]/40 flex items-center justify-center text-[#EFF9F2] mb-2 shadow-xs">
                    <Factory className="w-5 h-5" />
                  </div>
                  <span className="font-heading font-bold text-xs text-white">FACTORY</span>
                  <span className="text-[9px] text-[#C8EBD5]">Generation</span>
                </div>

                {/* Arrow */}
                <div className="flex justify-center text-[#35A66F]">
                  <ArrowRight className="w-4 h-4" />
                </div>

                {/* 2. WASTE */}
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-xl bg-[#0B3D2E] border border-[#35A66F]/40 flex items-center justify-center text-[#EFF9F2] mb-2 shadow-xs">
                    <Recycle className="w-5 h-5" />
                  </div>
                  <span className="font-heading font-bold text-xs text-white">WASTE</span>
                  <span className="text-[9px] text-[#C8EBD5]">Specification</span>
                </div>

                {/* Arrow */}
                <div className="flex justify-center text-[#35A66F]">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 items-center text-center mt-4 pt-4 border-t border-[#35A66F]/20">
                <div className="col-span-2 flex items-center justify-center gap-2 bg-[#0B3D2E]/70 p-2 rounded-xl border border-[#35A66F]/30">
                  <Sparkles className="w-4 h-4 text-[#35A66F]" />
                  <span className="font-heading font-bold text-xs text-white">AI MATCH</span>
                </div>

                <div className="flex justify-center text-[#35A66F]">
                  <ArrowRight className="w-4 h-4" />
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-xl bg-[#238B5A] text-white flex items-center justify-center mb-1 shadow-md shadow-[#0B3D2E]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="font-heading font-bold text-xs text-white">RESOURCE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="relative z-10 flex items-center gap-2 text-xs text-[#C8EBD5]/80">
            <Shield className="w-4 h-4 text-[#35A66F]" />
            <span>Industrial grade encryption & verified corporate identities</span>
          </div>
        </div>

        {/* RIGHT SIDE (Clean White Form) */}
        <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center max-w-md mx-auto w-full">
          
          <div className="mb-8">
            <h2 className="font-heading font-extrabold text-3xl text-[#0B3D2E] tracking-tight">
              Welcome to WasteMatch
            </h2>
            <p className="text-sm text-[#4A6054] mt-1.5 font-medium">
              Sign in to access your industrial waste matching workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" id="login-form">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0B3D2E] mb-1.5" htmlFor="work-email">
                Work Email
              </label>
              <input
                id="work-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="company@email.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-[#D9F2E3] bg-[#F8FBF9] text-[#0B3D2E] text-sm focus:outline-hidden focus:border-[#238B5A] focus:ring-2 focus:ring-[#EFF9F2] transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B3D2E]" htmlFor="password">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-xs text-[#238B5A] hover:underline font-semibold">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-[#D9F2E3] bg-[#F8FBF9] text-[#0B3D2E] text-sm focus:outline-hidden focus:border-[#238B5A] focus:ring-2 focus:ring-[#EFF9F2] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#0B3D2E] hover:bg-[#146B4A] text-white font-heading font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              id="submit-signin-btn"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4 text-[#35A66F]" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E8F3ED]" />
            </div>
            <div className="relative inline-block px-3 bg-white text-[11px] text-[#60756A] font-bold uppercase tracking-wider">
              OR
            </div>
          </div>

          {/* Google SSO */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 px-4 rounded-xl border border-[#D9F2E3] hover:bg-[#F8FBF9] text-[#0B3D2E] font-semibold text-sm transition-all flex items-center justify-center gap-3 cursor-pointer shadow-2xs"
            id="google-signin-btn"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Sign up link */}
          <p className="text-center text-xs text-[#60756A] mt-6">
            Don't have an account?{' '}
            <button
              onClick={() => onLoginSuccess('new.company@waste.com')}
              className="text-[#238B5A] font-bold hover:underline cursor-pointer"
            >
              Create account
            </button>
          </p>

          <div className="mt-8 pt-6 border-t border-[#E8F3ED] text-center">
            <button
              onClick={onBackToLanding}
              className="text-xs font-semibold text-[#60756A] hover:text-[#0B3D2E] transition-colors"
            >
              ← Back to public homepage
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
