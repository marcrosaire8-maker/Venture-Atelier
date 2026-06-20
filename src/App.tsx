import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeHero from './components/HomeHero';
import Wizard from './components/Wizard';
import PrivacyPolicy from './components/PrivacyPolicy';
import LuminaChatbot from './components/LuminaChatbot';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import { Lead } from './types';
import { settingsService } from './lib/supabase';
import { Sparkles, CheckCircle, FileText, ArrowLeft, Send, ShieldAlert, Laptop, Mail, Phone, Calendar, Copy, Check } from 'lucide-react';

type MainViewType = 'home' | 'wizard' | 'success' | 'admin' | 'privacy';

export default function App() {
  const [currentView, setCurrentView] = useState<MainViewType>('home');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  
  // Use in-memory fallback and safe try-catch wrapper for sandboxed security context
  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    try {
      return localStorage.getItem('venture_atelier_custom_logo');
    } catch (e) {
      console.warn("Storage access restricted in preview iframe. Falling back to session/runtime storage.", e);
      try {
        return sessionStorage.getItem('venture_atelier_custom_logo');
      } catch (sessErr) {
        return (window as any).__venture_atelier_custom_logo_fallback || null;
      }
    }
  });

  // Pull logo dynamically from Supabase database on app initialization and listen to workspace level view triggers
  useEffect(() => {
    async function fetchLogo() {
      try {
        const dbLogo = await settingsService.getSetting('custom_logo');
        if (dbLogo !== null) {
          setCustomLogo(dbLogo);
          // Sync cache for instant UI rendering on reloading
          try { localStorage.setItem('venture_atelier_custom_logo', dbLogo); } catch (e) {}
        }
      } catch (err) {
        console.warn("Database logo fetch failed:", err);
      }
    }
    fetchLogo();

    const handleOpenWizard = () => setCurrentView('wizard');
    const handleOpenHome = () => setCurrentView('home');
    const handleOpenPrivacy = () => setCurrentView('privacy');

    window.addEventListener('open-wizard', handleOpenWizard);
    window.addEventListener('open-home', handleOpenHome);
    window.addEventListener('open-privacy', handleOpenPrivacy);

    return () => {
      window.removeEventListener('open-wizard', handleOpenWizard);
      window.removeEventListener('open-home', handleOpenHome);
      window.removeEventListener('open-privacy', handleOpenPrivacy);
    };
  }, []);

  const handleLogoUpdate = async (logoUrl: string | null) => {
    setCustomLogo(logoUrl);
    
    // Save to window variable as direct in-memory fallback
    (window as any).__venture_atelier_custom_logo_fallback = logoUrl;
    
    try {
      if (logoUrl) {
        localStorage.setItem('venture_atelier_custom_logo', logoUrl);
      } else {
        localStorage.removeItem('venture_atelier_custom_logo');
      }
    } catch (e) {
      console.warn("Could not save custom logo to localStorage:", e);
    }

    try {
      if (logoUrl) {
        sessionStorage.setItem('venture_atelier_custom_logo', logoUrl);
      } else {
        sessionStorage.removeItem('venture_atelier_custom_logo');
      }
    } catch (e) {
      // Ignore sessionStorage blockages
    }

    // Persist/Synchronise to Supabase Table settings
    try {
      if (logoUrl) {
        await settingsService.setSetting('custom_logo', logoUrl);
      } else {
        await settingsService.deleteSetting('custom_logo');
      }
    } catch (dbErr) {
      console.error("Database persistence for logo failed:", dbErr);
    }
  };

  const handleAdminTrigger = () => {
    if (isAdminLoggedIn) {
      setCurrentView('admin');
    } else {
      setIsAdminModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsAdminModalOpen(false);
    setCurrentView('admin');
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentView('home');
  };

  const handleWizardSuccess = (lead: Lead) => {
    setSubmittedLead(lead);
    setCurrentView('success');
  };

  const getEmailSubjectAndBody = () => {
    if (!submittedLead) return { subject: '', body: '' };
    
    const subject = `Venture Support Application - ${submittedLead.first_name} ${submittedLead.last_name}`;
    const body = `Hello Venture Atelier Team,

I have just finalized my online diagnosis on your website and would like to submit my support file for your review.

Here is a summary of my requirements:
- Recommended Division: Studio ${submittedLead.branch}
- Full Name: ${submittedLead.first_name} ${submittedLead.last_name}
- Email Address: ${submittedLead.email}
- Phone Number: ${submittedLead.phone || 'Not specified'}

--- Brief Synthesis ---
"${submittedLead.summary}"

Thank you in advance for your guidance and for scheduling our scoping interview within 12 hours.

Best regards,
${submittedLead.first_name} ${submittedLead.last_name}`;

    return { subject, body };
  };

  const handleSendToAdmin = (e: React.MouseEvent) => {
    e.preventDefault();
    const { subject, body } = getEmailSubjectAndBody();
    if (!subject) return;

    const mailtoUrl = `mailto:ventureatelier@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // We attempt top location or direct open to prevent iframe sandbox block issues
    try {
      const link = document.createElement('a');
      link.href = mailtoUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      window.location.href = mailtoUrl;
    }
  };

  const handleCopyMessage = () => {
    const { body } = getEmailSubjectAndBody();
    if (!body) return;

    navigator.clipboard.writeText(body);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  const getGmailLink = () => {
    const { subject, body } = getEmailSubjectAndBody();
    if (!subject) return '#';
    return `https://mail.google.com/mail/?view=cm&fs=1&to=ventureatelier@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const [bgSrc, setBgSrc] = useState<string>('/src/assets/images/m1.png');
  const [hasBgError, setHasBgError] = useState(false);

  // Initialize background image source checking on view switch
  useEffect(() => {
    if (currentView === 'home') {
      setHasBgError(false);
      setBgSrc('/src/assets/images/m1.png');
    }
  }, [currentView]);

  const getOutlookLink = () => {
    const { subject, body } = getEmailSubjectAndBody();
    if (!subject) return '#';
    return `https://outlook.live.com/default.aspx?rru=compose&to=ventureatelier@gmail.com&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 flex flex-col font-sans selection:bg-[#D4AF37] selection:text-black relative">
      {/* Premium Atmospheric Background Image Only on Home */}
      {currentView === 'home' && !hasBgError && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.15] mix-blend-screen transition-opacity duration-1000">
          <img 
            src={bgSrc} 
            alt="Atmospheric Luxury Premium Grid and gold lines" 
            className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.05]"
            referrerPolicy="no-referrer"
            onError={() => {
              if (bgSrc === '/src/assets/images/m1.png') {
                // Try alternate location at root / public
                setBgSrc('/m1.png');
              } else {
                // Both failed, hide image gracefully instead of showing broken icon
                setHasBgError(true);
              }
            }}
          />
        </div>
      )}

      {/* Navigation Header */}
      {!(currentView === 'admin' && isAdminLoggedIn) && (
        <Navbar
          onAdminTrigger={handleAdminTrigger}
          isAdminLoggedIn={isAdminLoggedIn}
          onLogout={handleLogout}
          onNavigateHome={() => setCurrentView('home')}
          onNavigateToWizard={() => setCurrentView('wizard')}
          onBookCall={() => {
            setCurrentView('home');
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('open-booking'));
            }, 100);
          }}
          customLogo={customLogo}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <HomeHero 
            onStartWizard={() => setCurrentView('wizard')} 
            onNavigateToPrivacy={() => setCurrentView('privacy')}
            customLogo={customLogo} 
          />
        )}

        {currentView === 'privacy' && (
          <PrivacyPolicy onBack={() => setCurrentView('home')} />
        )}

        {currentView === 'wizard' && (
          <div className="pt-32 pb-24 px-6">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center space-y-3 mb-8">
                <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#D4AF37]">
                  Venture Diagnostics
                </span>
                <h1 className="text-4xl font-serif text-white tracking-wide">
                  Configure Your Atelier
                </h1>
                <p className="text-xs text-zinc-400 font-light max-w-lg mx-auto leading-relaxed">
                  Our diagnostic tool analyzes your technological constraints and operational ambitions to direct you toward the ideal division of experts.
                </p>
              </div>

              <div className="luxury-card rounded-3xl p-8 border border-zinc-900 bg-zinc-950/80">
                <Wizard
                  onSuccess={handleWizardSuccess}
                  onClose={() => setCurrentView('home')}
                />
              </div>
            </div>
          </div>
        )}

        {currentView === 'success' && submittedLead && (
          <div className="pt-32 pb-24 px-6 flex items-center justify-center animate-fade-in">
            <div className="max-w-2xl w-full text-center space-y-10" id="submission-success-view">
              
              {/* Minimal Sophisticated Seal */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/[0.06] border border-emerald-500/20 text-[#A7F3D0] shadow-md shadow-emerald-500/[0.02]">
                <Check className="w-6 h-6 stroke-[2]" />
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
                  Application Submitted
                </span>
                <h2 className="text-3xl md:text-4xl font-serif text-white tracking-wide">
                  Application Filed Successfully
                </h2>
                <p className="text-xs text-zinc-400 max-w-lg mx-auto font-light leading-relaxed">
                  Thank you <span className="text-zinc-100 font-medium">{submittedLead.first_name}</span>. Your Atelier application has been placed in our prioritized review queue. A partner from our firm will contact you within 12 hours.
                </p>
              </div>

              {/* High-End Consulting Synthesis Card */}
              <div className="luxury-card rounded-2xl p-8 text-left space-y-6 border border-zinc-900 bg-zinc-950/40 relative">
                
                <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest pb-3.5 border-b border-zinc-900 flex justify-between items-center">
                  <span>Elite Venture Diagnostic</span>
                  <span className="text-[#D4AF37] font-semibold">Division {submittedLead.branch}</span>
                </div>

                {/* Candidate & Project Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-sans">
                  <div className="space-y-1">
                    <span className="text-zinc-500 font-mono uppercase tracking-wider text-[9px]">Founder / Submitter</span>
                    <span className="text-zinc-200 mt-0.5 block font-medium">{submittedLead.first_name} {submittedLead.last_name}</span>
                    <span className="text-zinc-400 block font-light">{submittedLead.email}</span>
                    {submittedLead.phone && <span className="text-zinc-550 block font-light">{submittedLead.phone}</span>}
                  </div>
                  <div className="space-y-1">
                    <span className="text-zinc-550 font-mono uppercase tracking-wider text-[9px]">Recommended Orientation</span>
                    <span className="text-[#D4AF37] mt-0.5 block font-serif text-sm">Venture Atelier — {submittedLead.branch}</span>
                    <span className="text-zinc-500 block font-light leading-relaxed">
                      {submittedLead.branch === 'Moon' && 'Focus on premium brand expression and exceptional UX.'}
                      {submittedLead.branch === 'Light' && 'Focus on acquisition engineering and surgical growth.'}
                      {submittedLead.branch === 'Forge' && 'Focus on robust architecture, AI, and industrial code.'}
                    </span>
                  </div>
                </div>

                {/* Need Summary */}
                <div className="space-y-2 pt-2 border-t border-zinc-900/45">
                  <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider block">Atelier Brief Synthesis:</span>
                  <div className="p-4 bg-zinc-950/90 rounded-xl text-xs leading-relaxed text-zinc-300 font-sans border border-zinc-900">
                    "{submittedLead.summary}"
                  </div>
                </div>

                {/* Process Timeline */}
                <div className="pt-4 border-t border-zinc-900/60">
                  <span className="text-zinc-550 font-mono text-[9px] uppercase tracking-widest block mb-4">Your Application Review Protocol:</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-zinc-950/30 rounded-xl border border-zinc-900 space-y-1.5">
                      <div className="text-[10px] uppercase font-mono tracking-wider text-[#D4AF37] font-semibold">1. Diagnostic</div>
                      <p className="text-[11px] text-zinc-400 font-light leading-snug">Submission registered and securely saved.</p>
                    </div>

                    <div className="p-3 bg-zinc-950/30 rounded-xl border border-gold-bright/20 space-y-1.5 relative">
                      <div className="text-[10px] uppercase font-mono tracking-wider text-[#FFE082] font-semibold flex items-center gap-1.5">
                        <span>2. Analysis</span>
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      </div>
                      <p className="text-[11px] text-zinc-350 font-light leading-snug">Technical roadmapping and resource calculation.</p>
                    </div>

                    <div className="p-3 bg-zinc-950/30 rounded-xl border border-zinc-900 space-y-1.5">
                      <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">3. Interview</div>
                      <p className="text-[11px] text-zinc-500 font-light leading-snug">Direct contact by a partner to state recommendations.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Mail Box Contact Card */}
              <div className="p-6 rounded-2xl bg-zinc-950/50 border border-[#D4AF37]/15 max-w-lg mx-auto space-y-4">
                <div className="text-center space-y-1.5">
                  <span className="text-[9px] font-mono tracking-widest uppercase text-[#D4AF37]">File Transmission</span>
                  <h4 className="text-md font-serif text-white tracking-wide">Submit to Administrator</h4>
                  <p className="text-[11px] text-zinc-400 font-light">
                    Open your pre-filled email client with your compiled diagnostic brief or copy the formatted text below to attach additional materials.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {/* Standard "Send to admin" button */}
                  <button
                    onClick={handleSendToAdmin}
                    className="flex items-center justify-center gap-2 py-3 px-5 bg-gradient-to-r from-amber-500 to-[#D4AF37] hover:brightness-110 text-black text-xs font-mono tracking-wider font-bold rounded-xl transition-all uppercase w-full cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send to admin</span>
                  </button>

                  {/* Secondary choices if mailto doesn't work */}
                  <div className="p-3 bg-black/60 rounded-xl border border-zinc-900 space-y-3">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 text-center">
                      If your e-mail client did not open automatically:
                    </div>
                    
                    <div className="flex items-center justify-between gap-3 p-2 bg-zinc-950 rounded-lg border border-zinc-900 text-xs">
                      <span className="font-mono text-zinc-400">ventureatelier@gmail.com</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText('ventureatelier@gmail.com');
                          setCopiedEmail(true);
                          setTimeout(() => setCopiedEmail(false), 2500);
                        }}
                        className="text-gold-subtle hover:text-[#FFE082] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                        title="Copy email address"
                      >
                        {copiedEmail ? 'Copied!' : 'Copy Address'}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <a
                        href={getGmailLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg text-center font-mono border border-zinc-800 transition-all ml-0"
                      >
                        Gmail Web
                      </a>
                      <a
                        href={getOutlookLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg text-center font-mono border border-zinc-800 transition-all mr-0"
                      >
                        Outlook Web
                      </a>
                    </div>

                    <button
                      onClick={handleCopyMessage}
                      className="flex items-center justify-center gap-2 py-2 px-4 bg-zinc-950 hover:bg-[#D4AF37]/5 text-[#D4AF37] border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 text-xs font-mono rounded-lg transition-all w-full cursor-pointer"
                    >
                      {copiedMessage ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied Successfully!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Entire Email Body</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentView('home')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-zinc-850 hover:border-zinc-700 text-xs font-mono tracking-widest uppercase text-zinc-400 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Studio
                </button>
                
                <button
                  onClick={() => {
                    setCurrentView('wizard');
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-zinc-950 border border-zinc-850 hover:border-zinc-700 text-[#D4AF37] hover:text-[#FFE082] text-xs font-mono tracking-widest uppercase transition-all cursor-pointer"
                >
                  Submit Another Project
                </button>
              </div>

            </div>
          </div>
        )}

        {currentView === 'admin' && isAdminLoggedIn && (
          <AdminPanel onLogout={handleLogout} customLogo={customLogo} onLogoUpdate={handleLogoUpdate} />
        )}
      </main>

      {/* Footer Elements */}
      {currentView !== 'home' && !(currentView === 'admin' && isAdminLoggedIn) && (
        <footer className="border-t border-zinc-950 py-6 px-6 bg-[#010101]/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center md:items-start gap-1">
              <span className="font-serif text-sm tracking-widest text-[#D4AF37]/85 uppercase">
                Venture Atelier
              </span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-600 uppercase">
                &copy; 2026 Venture Atelier. All rights reserved.
              </span>
            </div>

            {/* Direct Official Contact Email coordinates */}
            <div className="flex flex-col items-center md:items-center gap-1.5 text-center">
              <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-500">Business Office</span>
              <a 
                href="mailto:ventureatelier@gmail.com" 
                className="text-xs font-mono font-medium text-[#D4AF37] hover:text-[#FFE082] transition-colors flex items-center gap-1.5 hover:underline underline-offset-4"
              >
                <Mail className="w-3.5 h-3.5 text-[#D4AF37]/80" />
                ventureatelier@gmail.com
              </a>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase">
              <a href="#branches" className="text-zinc-550 hover:text-amber-400 transition-colors">Moon Studio</a>
              <a href="#branches" className="text-zinc-550 hover:text-amber-400 transition-colors">Light Studio</a>
              <a href="#branches" className="text-zinc-550 hover:text-amber-400 transition-colors">Forge Studio</a>
              <button 
                onClick={() => setCurrentView('privacy')} 
                className="text-zinc-550 hover:text-[#D4AF37] hover:underline transition-all bg-transparent border-none cursor-pointer uppercase tracking-widest text-[10px] font-mono pl-1"
              >
                Privacy Charter
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* ADMIN SECURE AUTHENTICATION MODAL */}
      {isAdminModalOpen && (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setIsAdminModalOpen(false)}
        />
      )}

      {/* Lumina Chatbot Widget */}
      <LuminaChatbot />
    </div>
  );
}
