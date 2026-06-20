import React, { useState } from 'react';
import { Sparkles, Shield, LogOut, Menu, X, Calendar } from 'lucide-react';

interface NavbarProps {
  onAdminTrigger: () => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
  onNavigateHome: () => void;
  onNavigateToWizard: () => void;
  onBookCall: () => void;
  customLogo: string | null;
}

export default function Navbar({
  onAdminTrigger,
  isAdminLoggedIn,
  onLogout,
  onNavigateHome,
  onNavigateToWizard,
  onBookCall,
  customLogo
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Packages', id: 'packages' },
    { name: 'Portfolio', id: 'portfolio' },
    { name: 'Process', id: 'process' },
    { name: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    onNavigateHome();
    
    // Allow state transition to complete before smooth scrolling
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 120);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-900/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* BRAND / LOGO */}
          <div
            onDoubleClick={onAdminTrigger}
            onClick={() => handleNavClick('home')}
            className="cursor-pointer select-none group flex items-center gap-2 sm:gap-3 transition-transform active:scale-95"
          >
            {customLogo ? (
              <img 
                src={customLogo} 
                alt="Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-xl border border-[#D4AF37]/30 bg-black/50 p-1" 
              />
            ) : (
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-zinc-900 to-black border border-[#D4AF37]/30 flex items-center justify-center">
                 <span className="text-xs font-serif text-[#D4AF37] font-semibold">VA</span>
              </div>
            )}
            
            <div className="flex flex-col">
              <span className="text-[11px] sm:text-[13px] font-serif tracking-[0.2em] sm:tracking-[0.3em] uppercase font-bold text-white">
                Venture <span className="text-[#D4AF37] italic">Atelier</span>
              </span>
              <span className="text-[7px] tracking-[0.15em] text-zinc-500 uppercase font-mono hidden xs:block">
                Creative Strategy Studio
              </span>
            </div>
          </div>

          {/* DESKTOP LINKS */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="text-[10px] tracking-[0.15em] uppercase font-mono text-zinc-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Book Discovery Call Button - Desktop */}
            <button
              onClick={onBookCall}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4AF37] hover:bg-[#FFE082] text-black font-semibold uppercase text-[9px] font-mono tracking-widest transition-all active:scale-95 cursor-pointer border-none shadow-[0_0_20px_rgba(212,175,55,0.1)]"
            >
              Book Discovery Call
            </button>

            {/* Diagnostic Project Starter Icon - Small/Mobile */}
            <button
              onClick={onNavigateToWizard}
              className="sm:hidden p-2 rounded-full border border-zinc-800 bg-zinc-950 text-[#D4AF37]"
              title="Start Project Diagnostic"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer lg:hidden"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* ADMIN STATUS */}
            {isAdminLoggedIn && (
              <div className="flex items-center gap-2 pl-3 border-l border-zinc-900">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  <Shield className="w-3 h-3 text-[#D4AF37]" />
                  <span className="text-[8px] font-mono text-[#D4AF37] uppercase font-bold hidden md:inline">Admin</span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-zinc-500 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={14} />
                </button>
              </div>
            )}
            
          </div>
        </div>
      </nav>

      {/* MOBILE NAV DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl pt-20 px-6 block lg:hidden">
          <div className="flex flex-col gap-5 py-8 border-t border-zinc-900">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="text-left py-2.5 text-lg font-serif tracking-wider text-zinc-300 hover:text-[#D4AF37] transition-colors border-b border-zinc-950 block w-full bg-transparent"
              >
                {link.name}
              </button>
            ))}
            
            <div className="pt-8">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onBookCall();
                }}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#D4AF37] hover:bg-[#FFE082] text-black font-bold uppercase text-xs tracking-widest transition-all cursor-pointer border-none shadow-lg"
              >
                <Calendar className="w-4 h-4" />
                Book Discovery Call
              </button>
              
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigateToWizard();
                }}
                className="w-full mt-3 flex items-center justify-center gap-2 py-4 rounded-xl border border-zinc-800 bg-zinc-950 text-white font-mono text-[10px] uppercase tracking-widest cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Start Interactive Diagnostic
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

