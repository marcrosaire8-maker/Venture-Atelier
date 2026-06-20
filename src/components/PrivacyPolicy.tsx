import React from 'react';
import { ShieldCheck, Mail, ArrowLeft, Clock, Server, Eye, FileText } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="pt-32 pb-24 px-6 animate-fade-in" id="privacy-policy-view">
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-[10px] font-mono tracking-widest uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            Regulatory Framework & Security
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white tracking-wide">
            Privacy Charter
          </h1>
          <p className="text-xs text-zinc-400 font-light max-w-lg mx-auto leading-relaxed uppercase tracking-wider">
            Last updated: June 2026 • Venture Atelier Privacy Protection
          </p>
        </div>

        {/* Core Content */}
        <div className="luxury-card rounded-3xl p-8 md:p-12 border border-zinc-900 bg-zinc-950/80 space-y-10 text-zinc-350 leading-relaxed text-sm font-light">
          
          {/* Section 1: Introduction & Operation */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
              <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-serif text-white tracking-wide">
                1. Site Operations
              </h2>
            </div>
            <p>
              <strong>Venture Atelier</strong> is an elite digital creation laboratory and technology consultancy. This site offers an intelligent interactive diagnostic tool that analyzes founders' responses, technological models, and growth ambitions to guide and assign them to the appropriate division of experts (<strong>Moon Studio</strong> for identity, <strong>Light Studio</strong> for global visibility & growth, or <strong>Forge Studio</strong> for engineering and industrial code).
            </p>
            <p>
              Once the configurator is completed, the client generates a custom synthesis ("Atelier Brief") which can be stored with our administration and transmitted via secure email to initiate a detailed scoping conversation within 12 hours.
            </p>
          </section>

          {/* Section 2: Data Collected & Custom Usage */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
              <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                <Eye className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-serif text-white tracking-wide">
                2. Nature and Use of Information
              </h2>
            </div>
            <p>
              We exclusively collect information strictly required for the calibration of your project and the establishment of a professional relationship:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-400">
              <li><strong>Identification details:</strong> First name, last name, professional email address, and mobile phone number (optional).</li>
              <li><strong>Diagnostic inputs:</strong> Answers to the interactive configurator, targeted tech types, operational maturity level, and short-term milestones.</li>
              <li><strong>Text synthesis:</strong> Custom rephrasing and additional details about your development, design, and fundraising aims.</li>
            </ul>
            <p>
              This data is processed exclusively by our partners and consulting team to evaluate your logistical prerequisites, design your technical pre-roadmap, and facilitate our initial scoping contact. We absolutely do not engage in any commercial resale or third-party sharing.
            </p>
          </section>

          {/* Section 3: Secure Storage & Retention Policies */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
              <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                <Server className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-serif text-white tracking-wide">
                3. Security and Storage of File Information
              </h2>
            </div>
            <p>
              <strong>Secure Hosting:</strong> Applications, diagnostic details, and technical briefs submitted through our configurator are stored within highly secure database servers equipped with SSL/TLS encryption protocols.
            </p>
            <p className="bg-[#D4AF37]/5 border-l-2 border-[#D4AF37] p-4 rounded-xl text-zinc-300 text-xs">
              <strong>Limited Retention Rule:</strong> Your project data is actively retained in our review register <strong>only for the duration strictly necessary for administrative processing, expert analysis, and the initial strategic scoping of your file by an associate</strong>. As soon as the analysis is completed, your diagnostic dossier is either pseudonymized and archived, or permanently deleted from our systems upon simple request.
            </p>
          </section>

          {/* Section 4: Contact & Access */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
              <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-serif text-white tracking-wide">
                4. Reaching Administration & Exercising Your Rights
              </h2>
            </div>
            <p>
              In compliance with GDPR and high-standard data protection laws, you retain a full right of access, rectification, portability, or erasure of your information held within our lead registers at any time.
            </p>
            <p>
              For any questions regarding the usage of your data or to request the immediate erasure of your Atelier Brief, you can directly reach our partners through the official communication channel:
            </p>
            <div className="bg-[#050505] border border-zinc-900 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#D4AF37]" />
                <div className="text-left">
                  <div className="text-[10px] uppercase font-mono tracking-widest text-zinc-550">Official Mailbox</div>
                  <a href="mailto:ventureatelier@gmail.com" className="text-sm font-mono text-[#D4AF37] hover:text-[#FFE082] transition-colors underline">
                    ventureatelier@gmail.com
                  </a>
                </div>
              </div>
              <span className="text-[10px] font-mono tracking-wider text-zinc-500 bg-zinc-950 px-3 py-1.5 rounded border border-zinc-900">
                Atelier Response Time: &lt; 12 Hours
              </span>
            </div>
          </section>

        </div>

        {/* Back navigation action */}
        <div className="flex justify-center pt-4">
          <button
            onClick={onBack}
            className="px-8 py-3.5 rounded-full border border-zinc-850 hover:border-zinc-700 text-xs font-mono tracking-widest uppercase text-zinc-400 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Studio
          </button>
        </div>

      </div>
    </div>
  );
}
