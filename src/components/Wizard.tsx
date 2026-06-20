import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Layers, 
  Wallet, 
  Crown, 
  Cpu, 
  Lightbulb, 
  CheckCircle2, 
  Phone, 
  Mail, 
  User, 
  Loader2,
  ShieldCheck,
  Server
} from 'lucide-react';
import { WizardAnswers, BranchType, Lead } from '../types';
import { leadService } from '../lib/supabase';

interface WizardProps {
  onSuccess: (lead: Lead) => void;
  onClose: () => void;
}

const QUESTIONS = [
  {
    id: 'projectType',
    title: 'What would you like to build today?',
    subtitle: 'Define the nature of your idea or emerging enterprise.',
    options: [
      { value: 'SaaS or Large-Scale Web Platform', icon: Layers, desc: 'Trading platforms, collaborative portals, or complex business workflow portals.' },
      { value: 'Fintech or Web3 Mobile App', icon: Wallet, desc: 'DApp, neobacking, crypto wallets, or fluid, customer-facing mobile interfaces.' },
      { value: 'Luxury Brand or Premium E-commerce', icon: Crown, desc: 'Bespoke experiences, immersive D2C buyer journeys, and high-end aesthetics.' },
      { value: 'Generative AI or Deep Tech Solution', icon: Cpu, desc: 'Autonomous agents, enterprise LLMs, or intelligent data pipeline connectives.' },
      { value: 'Other Disruptive Venture Idea', icon: Lightbulb, desc: 'A hybrid, uncurated concept conceived in your internal research labs.' }
    ]
  },
  {
    id: 'maturity',
    title: 'At what stage of development is your concept?',
    subtitle: 'Honestly evaluate the technical and narrative advancement of your project.',
    options: [
      { value: 'Intuition & Pure Vision (Structured from scratch)', desc: 'Clear idea on paper, but no digital assets or codebase have been produced yet.' },
      { value: 'Specifications Drafted, Wireframes Created', desc: 'The overall structure and features are defined. Ready for visual exploration.' },
      { value: 'Existing Prototype or MVP (Need scaling)', desc: 'A first technical mock-up exists, but requires a high-premium rebuild.' },
      { value: 'Live with Active Users (Accelerating growth)', desc: 'The product is on the market; ready for elite growth marketing implementation.' }
    ]
  },
  {
    id: 'ambition',
    title: 'What is your primary short-term goal?',
    subtitle: 'Identify the most crucial strategic milestone for your team to cross.',
    options: [
      { value: 'Design an extraordinary visual identity and UX', desc: 'Generate immediate desire among your premium clients and partners.' },
      { value: 'Develop a modern, highly secure, and scalable product', desc: 'Ensure a highly resilient infrastructure for heavy transaction volumes.' },
      { value: 'Acquire prospects at scale and grow visibility', desc: 'Establish viral distribution and high-performance acquisition tunnels.' },
      { value: 'Prepare a fundraising round with top VCs or Angels', desc: 'Deliver a sophisticated pitch supported by an exceptional MVP implementation.' }
    ]
  },
  {
    id: 'criticalNeed',
    title: 'What kind of support do you primarily expect from our studio?',
    subtitle: 'Identify the core expertise your team is currently missing.',
    options: [
      { value: 'Artistic direction, pixel-perfect designs & storytelling', branch: 'Moon', desc: 'Memorable experience design establishing you as your sector’s prime reference.' },
      { value: 'Acquisition strategy, elite SEO, Growth Hacking & Traffic', branch: 'Light', desc: 'Amplifying your brand signal to dominate search engine index rankings.' },
      { value: 'State-of-the-art engineering, TypeScript/Rust, DB & Cloud', branch: 'Forge', desc: 'Indestructible backend infrastructure built to premium market standards.' }
    ]
  }
];

export default function Wizard({ onSuccess, onClose }: WizardProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<WizardAnswers>>({});
  const [suggestedBranch, setSuggestedBranch] = useState<BranchType | null>(null);
  
  // Final form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [customSummary, setCustomSummary] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [showConfirmationScreen, setShowConfirmationScreen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto generate need summary when entering final question/form step
  useEffect(() => {
    if (step === QUESTIONS.length) {
      // Determine the best branch
      const critical = answers.criticalNeed;
      let branch: BranchType = 'Forge'; // Default dynamic branch
      if (critical?.includes('Artistic direction') || critical?.includes('pixel-perfect') || critical?.includes('Direction artistique')) {
        branch = 'Moon';
      } else if (critical?.includes('Acquisition') || critical?.includes('SEO') || critical?.includes('Stratégie')) {
        branch = 'Light';
      } else {
        branch = 'Forge';
      }
      setSuggestedBranch(branch);

      // Render automatic high-end summary
      const branchText = 
        branch === 'Moon' ? 'Studio MOON (Creation, Exceptional Branding & Immersive Identity)' :
        branch === 'Light' ? 'Studio LIGHT (Hyper-targeted Growth, Elite SEO & Visibility)' :
        'Studio FORGE (Heavy Engineering, Robust Architecture & Cutting-edge Code)';

      const draftSummary = `Project for creating a 「${answers.projectType || 'Venture'}」 at the current stage 「${answers.maturity || 'Idea'}」.\nOur main ambition is to achieve the goal: 「${answers.ambition || 'Develop and launch'}」.\nTo do this, we seek the excellent support of Venture Atelier through the recommended branch: 「${branchText}」 to scale our infrastructure optimally.`;
      
      setCustomSummary(draftSummary);
    }
  }, [step, answers]);

  const handleSelectOption = (value: string) => {
    const currentQuestionKey = QUESTIONS[step].id;
    setAnswers(prev => ({ ...prev, [currentQuestionKey]: value }));
    
    // Auto-advance with clean animation timing
    setTimeout(() => {
      setStep(prev => prev + 1);
    }, 250);
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!firstName.trim()) errors.firstName = 'First name is required';
    if (!lastName.trim()) errors.lastName = 'Last name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errors.email = 'Valid email is required';
    if (!phone.trim()) {
      errors.phone = 'WhatsApp Phone is required';
    } else if (phone.trim().length < 6) {
      errors.phone = 'Please enter a valid phone number';
    }
    if (!customSummary.trim()) errors.summary = 'The brief synthesis is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowConfirmationScreen(true);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    const leadData: Lead = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
      branch: suggestedBranch || 'Forge',
      answers: answers as WizardAnswers,
      summary: customSummary,
      status: 'Nouveau'
    };

    const result = await leadService.submitLead(leadData);
    setIsSubmitting(false);

    if (result.success) {
      onSuccess({ ...leadData, ...result.data });
    } else {
      alert("An error occurred while transmitting your dossier. Rest assured, your information has been successfully compiled and saved locally.");
      onSuccess({ ...leadData });
    }
  };

  const progress = Math.min((step / QUESTIONS.length) * 100, 100);

  return (
    <div className="text-zinc-100 max-w-3xl mx-auto" id="interactive-wizard">
      {/* Wizard Header Progress Bar */}
      <div className="mb-10" id="wizard-progress">
        <div className="flex justify-between items-center text-[10px] sm:text-xs text-zinc-500 font-mono uppercase tracking-[0.2em] mb-3">
          <span>{showConfirmationScreen ? "Registration Validation" : "Atelier Diagnostic"}</span>
          <span>{showConfirmationScreen ? "Final Step" : `Step ${Math.min(step + 1, QUESTIONS.length + 1)} of ${QUESTIONS.length + 1}`}</span>
        </div>
        <div className="h-[1px] w-full bg-zinc-900 overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-[#AA7C11] to-[#FFE082] transition-all duration-500 ease-out"
            style={{ width: `${showConfirmationScreen ? 100 : progress}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showConfirmationScreen ? (
          /* CONFIRMATION SCREEN */
          <motion.div
            key="confirmation-step"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="space-y-8"
          >
            <div className="space-y-3">
              <span className="text-xs uppercase font-mono tracking-[0.3em] text-[#D4AF37] font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                Secure Transmission
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
                Confirm your parameters
              </h2>
              <p className="text-zinc-400 text-xs font-light leading-relaxed">
                Please verify the accuracy of your coordinates and summary below before submitting the Atelier Brief.
              </p>
            </div>

            {/* Storage disclaimer warning box requested explicitly by user */}
            <div className="p-6 rounded-2xl bg-[#D4AF37]/5 border border-[#D4AF37]/20 space-y-3 relative overflow-hidden" id="storage-disclaimer">
              <div className="flex items-center gap-2.5 text-[#D4AF37] font-sans font-medium text-xs uppercase tracking-wider">
                <Server className="w-4 h-4 text-[#D4AF37]/80" />
                <span>Mandatory Data Retention Policy</span>
              </div>
              <p className="text-xs leading-relaxed text-zinc-300 font-light">
                Your credentials and technical diagnostic records will be held securely in our digital registry <strong>solely for the duration necessary for administrative review, design scaffolding, and strategic scoping by an associate</strong>.
              </p>
              <p className="text-xs leading-relaxed text-zinc-400 font-light font-sans">
                Upon completion of this project scaffolding, your materials will be securely archived or fully expunged from our database registers in strict accordance with our Privacy Charter.
              </p>
            </div>

            {/* Recalculation block */}
            <div className="p-6 rounded-2xl bg-black/60 border border-zinc-900 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <span className="text-zinc-500 font-mono uppercase tracking-wider text-[9px] block">Candidate Name</span>
                  <span className="text-zinc-200 mt-1 block font-medium text-xs sm:text-sm">{firstName} {lastName}</span>
                </div>
                <div>
                  <span className="text-zinc-500 font-mono uppercase tracking-wider text-[9px] block">Suggested Studio</span>
                  <span className="text-[#D4AF37] mt-1 block font-serif font-semibold text-xs sm:text-sm">Studio {suggestedBranch}</span>
                </div>
                <div>
                  <span className="text-zinc-500 font-mono uppercase tracking-wider text-[9px] block">Email Address</span>
                  <span className="text-zinc-200 mt-1 block font-mono font-light break-all text-xs">{email}</span>
                </div>
                <div>
                  <span className="text-zinc-500 font-mono uppercase tracking-wider text-[9px] block">Telephone contact</span>
                  <span className="text-zinc-200 mt-1 block font-mono font-light text-xs">{phone || 'Not provided'}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-900 space-y-2">
                <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider block">Synthesis Text (Atelier Brief) :</span>
                <div className="p-4 bg-zinc-950 rounded-xl text-xs leading-relaxed text-zinc-350 font-sans border border-zinc-900">
                  "{customSummary}"
                </div>
              </div>
            </div>

            {/* Buttons action */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-zinc-900">
              <button
                type="button"
                onClick={() => setShowConfirmationScreen(false)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 border border-zinc-850 hover:border-zinc-700 rounded-full text-xs font-mono tracking-widest text-[#9c9c9c] hover:text-white transition-all uppercase cursor-pointer bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
                Back / Edit
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs font-mono tracking-[0.15em] uppercase font-bold bg-gradient-to-r from-amber-500 to-[#D4AF37] text-black hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-yellow-500/10 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Transmitting...
                  </>
                ) : (
                  <>
                    Confirm & Submit
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : step < QUESTIONS.length ? (
          /* QUESTION FLOW */
          <motion.div
            key={`question-${step}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="space-y-8"
          >
            <div className="space-y-3">
              <span className="text-xs uppercase font-mono tracking-[0.3em] text-[#D4AF37]">
                Question 0{step + 1}
              </span>
              <h2 className="text-3xl font-serif text-white tracking-tight leading-snug">
                {QUESTIONS[step].title}
              </h2>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                {QUESTIONS[step].subtitle}
              </p>
            </div>

            {/* Options list */}
            <div className="grid grid-cols-1 gap-4" id={`options-container`}>
              {QUESTIONS[step].options.map((option, idx) => {
                const IconComponent = (option as any).icon;
                const isSelected = answers[QUESTIONS[step].id as keyof WizardAnswers] === option.value;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(option.value)}
                    className={`text-left luxury-card p-5 min-h-[85px] rounded-xl flex items-center justify-between cursor-pointer border ${
                      isSelected 
                        ? 'border-[#D4AF37] bg-amber-500/[0.04] gold-glow' 
                        : 'border-zinc-900 bg-zinc-950/60'
                    }`}
                  >
                    <div className="flex items-center gap-4 pr-4">
                      {IconComponent && (
                        <div className={`p-2.5 rounded-lg border ${isSelected ? 'border-[#D4AF37]/40 bg-[#D4AF37]/10' : 'border-zinc-800 bg-zinc-900'} text-[#D4AF37]`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <div className={`text-sm font-medium transition-colors ${isSelected ? 'text-[#FFE082]' : 'text-zinc-200'}`}>
                          {option.value}
                        </div>
                        {option.desc && (
                          <div className="text-xs text-zinc-500 font-light mt-1">
                            {option.desc}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'border-[#D4AF37] bg-[#D4AF37] text-black' 
                        : 'border-zinc-800'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2 border border-zinc-800 rounded-full text-xs font-mono tracking-widest text-zinc-400 hover:text-white hover:border-[#D4AF37]/30 transition-all uppercase"
                >
                  <ArrowLeft className="w-4.5 h-4.5" />
                  Back
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={onClose}
                className="text-xs font-mono tracking-widest text-zinc-500 hover:text-zinc-300 transition-all uppercase underline"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        ) : (
          /* BRANCH ORIENTATION & FORMULAIRE DE COMMANDE DE SERVICE */
          <motion.div
            key="final-form-step"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.45 }}
            className="space-y-10"
          >
            {/* Dynamic Branch Recommendation banner */}
            <div className="p-8 rounded-2xl bg-[#090909] border border-zinc-900 relative overflow-hidden">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gold-bright bg-[#D4AF37]/5 text-[#D4AF37] text-[10px] font-mono tracking-widest uppercase">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Diagnostic accomplished successfully
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-mono tracking-wider text-zinc-400 uppercase">
                    Suggested Division for your Venture:
                  </div>
                  <div>
                    {suggestedBranch === 'Moon' && (
                      <h3 className="text-4xl font-serif text-gold-gradient tracking-tight">
                        Studio Moon <span className="font-sans font-light text-zinc-400 text-lg ml-2">— Creation & Design</span>
                      </h3>
                    )}
                    {suggestedBranch === 'Light' && (
                      <h3 className="text-4xl font-serif text-gold-gradient tracking-tight">
                        Studio Light <span className="font-sans font-light text-zinc-400 text-lg ml-2">— Growth & Visibility</span>
                      </h3>
                    )}
                    {suggestedBranch === 'Forge' && (
                      <h3 className="text-4xl font-serif text-gold-gradient tracking-tight">
                        Studio Forge <span className="font-sans font-light text-zinc-400 text-lg ml-2">— Structure & Code</span>
                      </h3>
                    )}
                  </div>
                </div>

                <p className="text-sm text-zinc-300 font-light leading-relaxed">
                  {suggestedBranch === 'Moon' && 'Your concept demands absolute aesthetic sophistication, memorable ergonomics, and premium storytelling to captivate selective clients and establish your brand authority.'}
                  {suggestedBranch === 'Light' && 'Your product deserves surgical exposure: we orchestrate elite acquisition, tailored conversion funnels, and the most aggressive search indexing in your field.'}
                  {suggestedBranch === 'Forge' && 'Your vision requires indestructible technological foundations: resilient databases, hyper-fast API architectures, and premium clean code ready to handle traffic peaks.'}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8" id="submission-form">
              <div className="space-y-4">
                <h4 className="text-lg font-serif text-white tracking-wide border-b border-zinc-900 pb-2">
                  Project Registration Brief
                </h4>
                <p className="text-xs text-zinc-400">
                  Please provide your contact details. A partner from Venture Atelier will contact you within 12 hours.
                </p>
              </div>

              {/* Grid Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs uppercase font-mono tracking-widest text-[#D4AF37]">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      required
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={`w-full bg-[#0a0a0a] border ${formErrors.firstName ? 'border-red-500' : 'border-zinc-800 hover:border-zinc-700'} focus:border-[#D4AF37] outline-none text-zinc-200 text-sm py-3.5 pl-11 pr-5 rounded-xl transition-all font-sans`}
                    />
                  </div>
                  {formErrors.firstName && <span className="text-xs text-red-400 font-mono">{formErrors.firstName}</span>}
                </div>

                <div className="space-y-2">
                  <label className="block text-xs uppercase font-mono tracking-widest text-[#D4AF37]">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      required
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={`w-full bg-[#0a0a0a] border ${formErrors.lastName ? 'border-red-500' : 'border-zinc-800 hover:border-zinc-700'} focus:border-[#D4AF37] outline-none text-zinc-200 text-sm py-3.5 pl-11 pr-5 rounded-xl transition-all font-sans`}
                    />
                  </div>
                  {formErrors.lastName && <span className="text-xs text-red-400 font-mono">{formErrors.lastName}</span>}
                </div>
              </div>

              {/* Grid Contacts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs uppercase font-mono tracking-widest text-[#D4AF37]">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="email"
                      required
                      placeholder="john.doe@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full bg-[#0a0a0a] border ${formErrors.email ? 'border-red-500' : 'border-zinc-800 hover:border-zinc-700'} focus:border-[#D4AF37] outline-none text-zinc-200 text-sm py-3.5 pl-11 pr-5 rounded-xl transition-all font-sans`}
                    />
                  </div>
                  {formErrors.email && <span className="text-xs text-red-400 font-mono">{formErrors.email}</span>}
                </div>

                <div className="space-y-2">
                  <label className="block text-xs uppercase font-mono tracking-widest text-[#D4AF37]">
                    WhatsApp Phone <span className="text-red-500">*</span> <span className="text-zinc-500 text-[9px] font-normal font-sans tracking-normal font-extralight">(International Format)</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g., +33 6 12 34 56 78"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full bg-[#0a0a0a] border ${formErrors.phone ? 'border-red-500' : 'border-zinc-800 hover:border-zinc-700'} focus:border-[#D4AF37] outline-none text-zinc-200 text-sm py-3.5 pl-11 pr-5 rounded-xl transition-all font-sans`}
                    />
                  </div>
                  {formErrors.phone && <span className="text-xs text-red-400 font-mono">{formErrors.phone}</span>}
                </div>
              </div>

              {/* Automatic Need Summary Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs uppercase font-mono tracking-widest text-[#D4AF37]">
                    Brief Synthesis of your Needs (Auto-Generated, Editable)
                  </label>
                  <span className="text-[10px] font-mono text-zinc-500 font-extralight">
                    {customSummary.length} characters
                  </span>
                </div>
                <textarea
                  rows={4}
                  required
                  value={customSummary}
                  onChange={(e) => setCustomSummary(e.target.value)}
                  className="w-full bg-[#070707] border border-zinc-800 hover:border-zinc-700 focus:border-[#D4AF37] outline-none text-zinc-300 text-sm p-5 rounded-xl transition-all font-sans leading-relaxed"
                  placeholder="Explain in your own words if you would like to elaborate..."
                />
                <p className="text-[10px] text-zinc-500 font-mono font-light italic">
                  * We pre-populated this brief based on your diagnostic answers. Feel free to rephrase or add extra context.
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setStep(QUESTIONS.length - 1)}
                  className="flex items-center gap-2 px-5 py-2.5 border border-zinc-850 hover:border-zinc-700 rounded-full text-xs font-mono tracking-widest text-[#9c9c9c] hover:text-white transition-all uppercase cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Edit my answers
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-xs font-mono tracking-[0.2em] uppercase font-bold bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#FFE082] text-black hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-yellow-500/10 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Brief
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Mini-Footer requested explicitly */}
      <div className="pt-8 mt-12 border-t border-zinc-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-zinc-500 text-center sm:text-left select-none">
        <div className="space-y-1">
          <span className="font-serif text-[#D4AF37] font-bold text-xs uppercase tracking-wider block">Venture Atelier</span>
          <p className="tracking-widest text-[#555] sm:text-zinc-600">© 2026 Venture Atelier. All rights reserved.</p>
        </div>
        <div className="space-y-1 text-center sm:text-right">
          <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">Business Office</span>
          <a href="mailto:ventureatelier@gmail.com" className="text-[#D4AF37] hover:text-[#FFE082] transition-colors font-mono tracking-wide">
            ventureatelier@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
