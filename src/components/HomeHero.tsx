import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ArrowRight, Check, Copy, ChevronRight, Zap, X, 
  ArrowLeft, Calendar, ShieldCheck, Mail, Linkedin, Clock, 
  CheckCircle2, Laptop, Palette, Megaphone, PenTool, BarChart3,
  Search, Users, Landmark, Phone
} from 'lucide-react';
import { leadService } from '../lib/supabase';

interface HomeHeroProps {
  onStartWizard: () => void;
  onNavigateToPrivacy: () => void;
  onBookCall?: () => void; // Optional if handled externally, or embedded locally
  customLogo?: string | null;
}

export default function HomeHero({ onStartWizard, onNavigateToPrivacy, customLogo }: HomeHeroProps) {
  // Local Booking Modal state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingTime, setBookingTime] = useState<string>('');
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Founders Narrative modal
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  // Email Copy feedback
  const [copied, setCopied] = useState(false);

  // Global event listener to activate booking flow from other components
  React.useEffect(() => {
    const handleOpenBooking = () => setIsBookingOpen(true);
    window.addEventListener('open-booking', handleOpenBooking);
    return () => window.removeEventListener('open-booking', handleOpenBooking);
  }, []);

  React.useEffect(() => {
    if (isBookingOpen) {
      setBookingError(null);
    }
  }, [isBookingOpen]);

  // Date lists for booking calendar
  const getNext7Days = () => {
    const dates = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push({
        dayName: days[d.getDay()],
        dayNum: d.getDate(),
        month: months[d.getMonth()],
        fullString: `${months[d.getMonth()]} ${d.getDate()}`
      });
    }
    return dates;
  };

  const bookingSlots = [
    '09:00 AM', '10:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:30 PM'
  ];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('ventureatelier@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingPhone.trim()) {
      setBookingError('WhatsApp Phone number is required.');
      return;
    }
    if (bookingPhone.trim().length < 6) {
      setBookingError('Please enter a valid WhatsApp Phone number.');
      return;
    }
    if (!bookingDate || !bookingTime || !bookingName || !bookingEmail) {
      setBookingError('Please select both date and time slot.');
      return;
    }

    setIsBookingSubmitting(true);
    setBookingError(null);

    const nameParts = bookingName.trim().split(/\s+/);
    const firstName = nameParts[0] || 'Discovery';
    const lastName = nameParts.slice(1).join(' ') || 'Client';

    const newLead: any = {
      first_name: firstName,
      last_name: lastName,
      email: bookingEmail,
      phone: bookingPhone,
      branch: 'Booking',
      status: 'Nouveau',
      summary: bookingNotes || `Enquiry for booking discovery call on ${bookingDate} at ${bookingTime}`,
      booking_date: bookingDate,
      booking_time: bookingTime,
      booking_notes: bookingNotes
    };

    try {
      const response = await leadService.submitLead(newLead);
      
      setIsBookingSubmitting(false);
      if (response.success) {
        setIsBookingSuccess(true);
        // Reset after brief display
        setTimeout(() => {
          setIsBookingOpen(false);
          setIsBookingSuccess(false);
          setBookingDate('');
          setBookingTime('');
          setBookingName('');
          setBookingEmail('');
          setBookingPhone('');
          setBookingNotes('');
        }, 3500);
      } else {
        setBookingError(response.error || "Une erreur est survenue lors de la réservation.");
      }
    } catch (err: any) {
      setIsBookingSubmitting(false);
      setBookingError(err?.message || "Une erreur réseau est survenue.");
    }
  };

  return (
    <div className="relative min-h-screen text-[#f3f4f6] font-sans bg-[#030303] overflow-x-hidden selection:bg-[#D4AF37] selection:text-black" id="home">
      
      {/* 1. ATMOSPHERIC BACKGROUND LAYER */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#D4AF37]/5 to-[#B88E2F]/10 blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-zinc-900 to-[#D4AF37]/5 blur-[150px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />
      </div>

      {/* 2. MAIN SCROLL CONTAINER */}
      <main className="relative z-10 pt-24 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24 sm:space-y-36">
        
        {/* HERO SECTION */}
        <section className="space-y-12 sm:space-y-20 max-w-7xl mx-auto" id="hero">
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Split Grid for Desktop, Centered for Mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Content */}
              <div className="lg:col-span-7 text-center lg:text-left space-y-6 sm:space-y-8">
                {/* Small Elegant Title Emblem */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 shadow-[0_0_15px_rgba(212,175,55,0.05)] justify-center lg:justify-start">
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                    Creative Strategy Studio for Founders
                  </span>
                </div>

                {/* Giant Display Header */}
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif leading-[0.95] tracking-tighter text-white">
                  Scaling Dreams <br />
                  <span className="italic text-[#D4AF37] font-light">Into Dollars.</span>
                </h1>

                {/* Premium Business Description */}
                <p className="text-zinc-400 text-sm sm:text-base md:text-lg font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed border-t border-zinc-900/60 pt-6">
                  We help entrepreneurs, creators, and growing businesses build brands that attract attention, build trust, and drive revenue.
                </p>

                {/* Integrated Quick Action Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <button 
                    onClick={() => setIsBookingOpen(true)}
                    className="w-full sm:w-auto px-8 py-4 bg-[#D4AF37] hover:bg-[#FFE082] text-black font-semibold uppercase text-xs tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(212,175,55,0.15)] flex items-center justify-center gap-2.5 cursor-pointer border-none"
                  >
                    Book Discovery Call <ArrowRight size={14} />
                  </button>
                  
                  <button 
                    onClick={() => {
                      const element = document.getElementById('portfolio');
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto px-8 py-4 bg-zinc-950/60 hover:bg-zinc-900/80 text-white rounded-none border border-zinc-800 hover:border-[#D4AF37]/45 transition-all flex items-center justify-center text-xs font-mono uppercase tracking-widest cursor-pointer"
                  >
                    View Our Work
                  </button>
                </div>
              </div>

              {/* Right Column: Premium Orbital Image Mask */}
              <div className="lg:col-span-5 relative flex justify-center items-center py-6 sm:py-12">
                <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-[380px] lg:h-[380px]">
                  {/* Subtle pulsing background glow */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D4AF37]/10 to-transparent blur-2xl animate-pulse" />

                  {/* Wireframe Gold Orbit 1 */}
                  <div className="absolute inset-[-20px] rounded-full border border-[#D4AF37]/20 border-dashed animate-[spin_50s_linear_infinite]" />
                  
                  {/* Wireframe Gold Orbit 2 (Tilted) */}
                  <div className="absolute inset-[-10px] sm:inset-[-15px] rounded-full border border-zinc-805 border-t-[#D4AF37]/40 rotate-12 animate-[spin_35s_linear_infinite]" />

                  {/* Decorative orbital thin gold ring */}
                  <div className="absolute inset-4 rounded-full border border-[#D4AF37]/35 rotate-45 pointer-events-none" />

                  {/* Secondary eccentric orbit ring */}
                  <div className="absolute w-[110%] h-[80%] -top-[10%] -left-[5%] rounded-full border border-[#D4AF37]/15 -rotate-12 pointer-events-none" />

                  {/* Main Circle Image Frame */}
                  <div className="absolute inset-8 rounded-full overflow-hidden border border-zinc-900 bg-zinc-950 shadow-2xl relative z-10 group">
                    <img 
                      src="/src/assets/images/m3.png" 
                      alt="Brand Oracle"
                      className="w-full h-full object-cover grayscale opacity-90 transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                  </div>
                  
                  {/* Small gold orbital nodes */}
                  <div className="absolute top-[10%] right-[10%] w-2.5 h-2.5 rounded-full bg-[#D4AF37]/40 border border-[#D4AF37] animate-ping" />
                  <div className="absolute bottom-[20%] left-[5%] w-2 h-2 rounded-full bg-zinc-700 border border-[#D4AF37]/50" />
                </div>
              </div>
              
            </div>
          </motion.div>


        </section>

        {/* LOGO BAR "TRUSTED BY" */}
        <section className="pt-4 pb-8 border-y border-zinc-900 text-center space-y-8" id="trusted">
          <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">
            Trusted by Ambitious Founders & Brands
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 sm:gap-x-20 gap-y-6 opacity-45 grayscale hover:grayscale-0 transition-all duration-700">
            {['KAPHIO', 'LUXEHAIR', 'BIJOUX', 'TRAILBLAZE', 'HUE'].map((logo, index) => (
              <span 
                key={index} 
                className="text-lg sm:text-2xl font-serif tracking-[0.25em] text-zinc-200 hover:text-[#D4AF37] hover:opacity-100 transition-colors cursor-default"
              >
                {logo}
              </span>
            ))}
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section className="space-y-12 sm:space-y-16" id="services">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#D4AF37] font-bold">
              Strategy. Design. Content. Growth.
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
              Everything You Need to Build a Powerful Brand
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
              We design and execute custom strategies that bridge elite visual style with robust business scaling mechanics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Service 1: Brand Identity Design */}
            <div className="luxury-card rounded-2xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20 text-[#D4AF37]">
                  <Palette size={20} />
                </div>
                <h3 className="text-lg font-serif font-semibold text-white">Brand Identity Design</h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  We create distinctive identities that position your brand for growth and recognition.
                </p>
              </div>
              <ul className="space-y-2 pt-4 border-t border-zinc-900 flex-grow text-xs font-light text-zinc-350">
                {['Logo Design', 'Brand Systems', 'Style Guides', 'Visual Identity'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-[#D4AF37] text-xs">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Service 2: Graphic Design */}
            <div className="luxury-card rounded-2xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20 text-[#D4AF37]">
                  <PenTool size={20} />
                </div>
                <h3 className="text-lg font-serif font-semibold text-white">Graphic Design</h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  High-impact designs that communicate your message and elevate your brand.
                </p>
              </div>
              <ul className="space-y-2 pt-4 border-t border-zinc-900 flex-grow text-xs font-light text-zinc-350">
                {['Marketing Materials', 'Social Media Graphics', 'Presentation Design', 'Packaging Design'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-[#D4AF37] text-xs">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Service 3: Social Media Management */}
            <div className="luxury-card rounded-2xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20 text-[#D4AF37]">
                  <Megaphone size={20} />
                </div>
                <h3 className="text-lg font-serif font-semibold text-white">Social Media Management</h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  We grow your presence, engage your audience, and turn followers into loyal customers.
                </p>
              </div>
              <ul className="space-y-2 pt-4 border-t border-zinc-900 flex-grow text-xs font-light text-zinc-350">
                {['Content Planning', 'Posting & Scheduling', 'Community Engagement', 'Performance Tracking'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-[#D4AF37] text-xs">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Service 4: Ghostwriting & Content Creation */}
            <div className="luxury-card rounded-2xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20 text-[#D4AF37]">
                  <Laptop size={20} />
                </div>
                <h3 className="text-lg font-serif font-semibold text-white">Ghostwriting & Content</h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Words that connect, convince, and convert. From posts to content systems.
                </p>
              </div>
              <ul className="space-y-2 pt-4 border-t border-zinc-900 flex-grow text-xs font-light text-zinc-350">
                {['LinkedIn Content', 'Blog Writing', 'Website Copy', 'Thought Leadership'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-[#D4AF37] text-xs">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Service 5: Digital Brand Strategy */}
            <div className="luxury-card rounded-2xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20 text-[#D4AF37]">
                  <BarChart3 size={20} />
                </div>
                <h3 className="text-lg font-serif font-semibold text-white">Digital Brand Strategy</h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Data-driven strategies that clarify your positioning and accelerate your brand growth.
                </p>
              </div>
              <ul className="space-y-2 pt-4 border-t border-zinc-900 flex-grow text-xs font-light text-zinc-350">
                {['Brand Positioning', 'Audience Research', 'Content Strategy', 'Growth Roadmap'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-[#D4AF37] text-xs">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>

        {/* FEATURED PROJECTS (PORTFOLIO) */}
        <section className="space-y-12 sm:space-y-16" id="portfolio">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-zinc-900 pb-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#D4AF37] font-bold">
                Our Work Speaks
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
                Featured Projects
              </h2>
            </div>
            <button 
              onClick={() => setIsBookingOpen(true)}
              className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] hover:text-[#FFE082] transition-colors border-none bg-transparent cursor-pointer flex items-center gap-1.5"
            >
              Start Your Project →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Project 1: Luxe Hair Collection */}
            <div className="group space-y-4">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-zinc-900 bg-zinc-950">
                <img 
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600" 
                  alt="Luxe Hair Collection"
                  className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-100 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/80 backdrop-blur-sm border border-[#D4AF37]/20 text-[10px] font-mono font-medium text-[#D4AF37]">
                  +300% Recognition
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-serif text-white group-hover:text-[#D4AF37] transition-colors">Luxe Hair Collection</h3>
                <p className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider">Brand Identity, Packaging, Social Media</p>
                <p className="text-xs text-zinc-400 font-light leading-relaxed pt-1">
                  Helped an elite personal brand reorganize physical packaging and social alignment to scale direct revenues.
                </p>
              </div>
            </div>

            {/* Project 2: Trailblaze Coaching */}
            <div className="group space-y-4">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-zinc-900 bg-zinc-950">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600" 
                  alt="Trailblaze Coaching"
                  className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-100 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/80 backdrop-blur-sm border border-[#D4AF37]/20 text-[10px] font-mono font-medium text-[#D4AF37]">
                  +250% Audience
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-serif text-white group-hover:text-[#D4AF37] transition-colors">Trailblaze Coaching</h3>
                <p className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider">Brand Identity, Website Copy, Content Strategy</p>
                <p className="text-xs text-zinc-400 font-light leading-relaxed pt-1">
                  Repositioned digital footprint for structured high-ticket advisory programs, tripling organic reach in 90 days.
                </p>
              </div>
            </div>

            {/* Project 3: Kaphio */}
            <div className="group space-y-4">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-zinc-900 bg-zinc-950">
                <img 
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=600" 
                  alt="Kaphio"
                  className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-100 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/80 backdrop-blur-sm border border-[#D4AF37]/20 text-[10px] font-mono font-medium text-[#D4AF37]">
                  +180% Engagement
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-serif text-white group-hover:text-[#D4AF37] transition-colors">Kaphio</h3>
                <p className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider">Social Media Management, Content Creation</p>
                <p className="text-xs text-zinc-400 font-light leading-relaxed pt-1">
                  Structured an authoritative LinkedIn ghostwriting and content schedule that attracted VC investments.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* PERFORMANCE STATS COUNTERS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 sm:p-12 rounded-3xl bg-zinc-950/50 border border-zinc-900 text-center" id="stats">
          <div className="space-y-1.5 py-4 border-r border-zinc-900/40">
            <h3 className="text-3xl sm:text-5xl font-serif font-bold text-[#D4AF37]">50+</h3>
            <p className="text-[10px] sm:text-xs text-zinc-400 font-mono uppercase tracking-widest font-light">Brands Transformed</p>
          </div>
          <div className="space-y-1.5 py-4 md:border-r border-zinc-900/40">
            <h3 className="text-3xl sm:text-5xl font-serif font-bold text-[#D4AF37]">120+</h3>
            <p className="text-[10px] sm:text-xs text-zinc-400 font-mono uppercase tracking-widest font-light">Projects Delivered</p>
          </div>
          <div className="space-y-1.5 py-4 border-r border-zinc-900/40">
            <h3 className="text-3xl sm:text-5xl font-serif font-bold text-[#D4AF37]">8+</h3>
            <p className="text-[10px] sm:text-xs text-zinc-400 font-mono uppercase tracking-widest font-light">Industries Served</p>
          </div>
          <div className="space-y-1.5 py-4">
            <h3 className="text-3xl sm:text-5xl font-serif font-bold text-[#D4AF37]">100%</h3>
            <p className="text-[10px] sm:text-xs text-zinc-400 font-mono uppercase tracking-widest font-light">Client Satisfaction</p>
          </div>
        </section>

        {/* BRONZE-ERA TRUSTED PACKAGES / SHOWCASE */}
        <section className="space-y-12 sm:space-y-16" id="packages">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#D4AF37] font-bold">
              Transparent Execution
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
              Selected Working Packages
            </h2>
            <p className="text-xs text-zinc-400 font-light">
              Clear structures engineered to deliver immediate premium value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="luxury-card rounded-2xl p-8 flex flex-col justify-between space-y-8 relative overflow-hidden">
              <div className="space-y-4">
                <span className="text-[9px] uppercase font-mono tracking-[0.2em] text-[#D4AF37]">01 • Architecture</span>
                <h3 className="text-2xl font-serif text-white">Atelier Identity</h3>
                <p className="text-xs text-zinc-400 font-light">
                  Complete design infrastructure and guidelines to establish your authority.
                </p>
                <div className="pt-4 border-t border-zinc-900 space-y-3">
                  {['Full Logo Identity Pack', 'Typography & Color Systems', 'Brand Presentation Template', 'Full Visual Guidelines PDF'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-zinc-350">
                      <span className="text-emerald-500">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => setIsBookingOpen(true)}
                className="w-full py-3 border border-zinc-800 hover:border-[#D4AF37]/50 text-white text-[10px] font-mono uppercase tracking-widest bg-zinc-950 hover:bg-zinc-900 transition-all cursor-pointer"
              >
                Inquire Pack
              </button>
            </div>

            <div className="luxury-card rounded-2xl p-8 flex flex-col justify-between space-y-8 relative bg-gradient-to-b from-[#D4AF37]/5 via-zinc-950 to-zinc-950 border-[#D4AF37]/25">
              <div className="absolute top-4 right-4 px-2 py-0.5 roundedbg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 text-[8px] font-mono font-medium uppercase tracking-wider">
                Audience Driver
              </div>
              <div className="space-y-4">
                <span className="text-[9px] uppercase font-mono tracking-[0.2em] text-[#D4AF37]">02 • Authority</span>
                <h3 className="text-2xl font-serif text-white">Atelier Growth</h3>
                <p className="text-xs text-zinc-400 font-light">
                  Active content creation and audience development across platforms.
                </p>
                <div className="pt-4 border-t border-zinc-900 space-y-3">
                  {['Complete LinkedIn & Social Calendar', 'Professional Audience Ghostwriting', 'Custom Content System design', 'Performance Metric Diagnostics'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-zinc-350">
                      <span className="text-emerald-500">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => setIsBookingOpen(true)}
                className="w-full py-3 bg-[#D4AF37] hover:bg-[#FFE082] text-black text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer border-none"
              >
                Inquire Pack
              </button>
            </div>

            <div className="luxury-card rounded-2xl p-8 flex flex-col justify-between space-y-8 relative overflow-hidden">
              <div className="space-y-4">
                <span className="text-[9px] uppercase font-mono tracking-[0.2em] text-[#D4AF37]">03 • Complete</span>
                <h3 className="text-2xl font-serif text-white">Signature Suite</h3>
                <p className="text-xs text-zinc-400 font-light">
                  Total brand strategy, identity transformation, and audience architecture.
                </p>
                <div className="pt-4 border-t border-zinc-900 space-y-3">
                  {['Custom Strategy Calibration Brief', 'Premium Brand and Assets design', 'Full SMM and Content Orchestration', 'Weekly Scoping Scaffolding Calls'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-zinc-350">
                      <span className="text-emerald-500">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => setIsBookingOpen(true)}
                className="w-full py-3 border border-zinc-800 hover:border-[#D4AF37]/50 text-white text-[10px] font-mono uppercase tracking-widest bg-zinc-950 hover:bg-zinc-900 transition-all cursor-pointer"
              >
                Inquire Pack
              </button>
            </div>

          </div>
        </section>

        {/* MEET THE FOUNDERS SECTION */}
        <section className="space-y-12 sm:space-y-16" id="about">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8">
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#D4AF37] block font-bold">
                  Meet the Founders
                </span>
                <h2 className="text-3.5xl sm:text-5xl font-serif text-white tracking-tight leading-none">
                  Vision. Creativity. Strategy. Execution.
                </h2>
              </div>
              <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
                We are Ciara Mensah and Christ-Meira Guidibi, two strategic creatives passionate about helping founders build brands that leave a legacy.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => setIsStoryOpen(true)}
                  className="px-6 py-3.5 border border-[#D4AF37]/35 hover:border-[#FFE082] text-[#D4AF37] hover:text-white text-xs font-mono uppercase tracking-widest transition-all cursor-pointer bg-transparent"
                >
                  Learn Our Story →
                </button>
              </div>
            </div>

            {/* Right Images Column */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Founder 1 */}
              <div className="relative rounded-3xl overflow-hidden border border-zinc-900 bg-zinc-950 team-profile group">
                <div className="aspect-[4/5] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600" 
                    alt="Ciara Mensah"
                    className="w-full h-full object-cover grayscale opacity-85 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <div>
                    <h3 className="text-white font-serif text-lg font-semibold leading-tight">Ciara Mensah</h3>
                    <p className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase">Co-Founder & Brand Strategist</p>
                  </div>
                  <a 
                    href="https://linkedin.com/in/ciaramensah" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  >
                    <Linkedin size={12} />
                  </a>
                </div>
              </div>

              {/* Founder 2 */}
              <div className="relative rounded-3xl overflow-hidden border border-zinc-900 bg-zinc-950 team-profile group">
                <div className="aspect-[4/5] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600" 
                    alt="Christ-Meira Guidibi"
                    className="w-full h-full object-cover grayscale opacity-85 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <div>
                    <h3 className="text-white font-serif text-lg font-semibold leading-tight">Christ-Meira Guidibi</h3>
                    <p className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase">Co-Founder & Creative Director</p>
                  </div>
                  <a 
                    href="https://linkedin.com/in/christmeira" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  >
                    <Linkedin size={12} />
                  </a>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* OUR PROCESS SECTION */}
        <section className="space-y-12 sm:space-y-16" id="process">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#D4AF37] font-bold">
              Our Simple Process
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
              From Vision to Lasting Impact
            </h2>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              We leverage an efficient, transparent iterative pipeline to turn premium definitions into live digital platforms.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-5 gap-6 sm:gap-8 timeline-track">
            
            {/* Step 1 */}
            <div className="space-y-4">
              <div className="text-3xl sm:text-4xl font-mono text-[#D4AF37] font-light italic">01</div>
              <h3 className="text-lg font-serif font-semibold text-white">Discovery</h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                We listen closely to map your brand framework, milestones, and customer opportunities.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <div className="text-3xl sm:text-4xl font-mono text-[#D4AF37] font-light italic">02</div>
              <h3 className="text-lg font-serif font-semibold text-white">Strategy</h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                We craft a customized development and design roadmap outlining precise execution steps.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4">
              <div className="text-3xl sm:text-4xl font-mono text-[#D4AF37] font-light italic">03</div>
              <h3 className="text-lg font-serif font-semibold text-white">Creation</h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                We code, design, and script with pristine technical accuracy and gorgeous art direction.
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-4">
              <div className="text-3xl sm:text-4xl font-mono text-[#D4AF37] font-light italic">04</div>
              <h3 className="text-lg font-serif font-semibold text-white">Launch</h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                We bring your new assets live with complete optimization, secure staging, and performance audits.
              </p>
            </div>

            {/* Step 5 */}
            <div className="space-y-4">
              <div className="text-3xl sm:text-4xl font-mono text-[#D4AF37] font-light italic">05</div>
              <h3 className="text-lg font-serif font-semibold text-white">Growth</h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                We monitor reach, optimize conversion patterns, and continue scaling operations iteratively.
              </p>
            </div>

          </div>
        </section>

        {/* BOTTOM CTA (CONTACT GATE) */}
        <section className="text-center p-12 sm:p-24 rounded-3xl bg-gradient-to-tr from-zinc-950 via-zinc-950 to-[#D4AF37]/5 border border-zinc-900/40 relative overflow-hidden" id="contact">
          <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
            <h2 className="text-4xl sm:text-7xl font-serif text-white tracking-tight leading-none text-glow-subtle">
              Ready to Scale Your Brand?
            </h2>
            <p className="text-xs sm:text-base text-zinc-400 font-light leading-relaxed"> Let's build something iconic together. </p>
            
            <div className="pt-2">
              <button 
                onClick={() => setIsBookingOpen(true)}
                className="px-10 py-4 bg-[#D4AF37] hover:bg-[#FFE082] text-black font-semibold uppercase text-xs tracking-widest transition-all cursor-pointer border-none shadow-lg active:scale-95 flex items-center gap-2 mx-auto"
              >
                Book Discovery Call <ArrowRight size={14} />
              </button>
            </div>
          </div>
          <div className="absolute -left-10 -bottom-10 opacity-5 pointer-events-none select-none">
            <Sparkles size={300} className="text-white" />
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="relative z-10 py-8 px-6 border-t border-zinc-900 bg-[#020202]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-zinc-500 text-xs">
          <div className="flex items-center gap-4">
            {customLogo ? (
              <img src={customLogo} className="w-6 h-6 object-contain" alt="" />
            ) : (
              <span className="font-serif text-[#D4AF37] font-bold">VA</span>
            )}
            <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-550">Venture Atelier &copy; 2026</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] font-mono tracking-wider">
            <button onClick={() => {
              const el = document.getElementById('services');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }} className="hover:text-white transition-colors uppercase bg-transparent border-none cursor-pointer">Services</button>
            <button onClick={() => {
              const el = document.getElementById('portfolio');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }} className="hover:text-white transition-colors uppercase bg-transparent border-none cursor-pointer">Portfolio</button>
            <button onClick={() => {
              const el = document.getElementById('packages');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }} className="hover:text-white transition-colors uppercase bg-transparent border-none cursor-pointer">Packages</button>
            <button onClick={onNavigateToPrivacy} className="hover:text-white text-[#D4AF37] uppercase tracking-widest transition-colors bg-transparent border-none cursor-pointer">Privacy Charter</button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono pr-2">London • Paris • Dubai</span>
          </div>
        </div>
      </footer>

      {/* 4. MODAL: DISCOVERY BOOKING FLOW */}
      <AnimatePresence>
        {isBookingOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gold light accent decoration */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-[#D4AF37]" />

              {/* Close Button */}
              <button 
                onClick={() => setIsBookingOpen(false)}
                className="absolute top-5 right-5 p-1 text-zinc-500 hover:text-white bg-transparent border-none cursor-pointer"
              >
                <X size={20} />
              </button>

              {isBookingSuccess ? (
                <div className="text-center py-12 space-y-4 animate-fade-in">
                  <div className="inline-flex w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-2xl font-serif text-white">Discovery Booked!</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
                    Thank you, <span className="text-zinc-200 font-medium">{bookingName}</span>. Your scoping call is locked for <strong>{bookingDate} at {bookingTime}</strong>. A partner from general administration will reach out with details shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#D4AF37] block font-semibold flex items-center gap-1">
                      <Clock size={11} /> 15 Min Discovery Call
                    </span>
                    <h3 className="text-2xl font-serif text-white tracking-wide">Select Your Scoping Slot</h3>
                    <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
                      Choose your preferred date and time to map resources directly with a Venture Atelier associate.
                    </p>
                  </div>

                  {/* Date Grid */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 block">1. Select Date</span>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                      {getNext7Days().map((date, idx) => {
                        const isSelected = bookingDate === date.fullString;
                        return (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => setBookingDate(date.fullString)}
                            className={`p-2 rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer text-xs border ${
                              isSelected 
                                ? 'bg-[#D4AF37] border-none text-black font-bold' 
                                : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800/80 text-zinc-350'
                            }`}
                          >
                            <span className="text-[9px] uppercase tracking-wider block opacity-75">{date.dayName}</span>
                            <span className="text-sm font-semibold">{date.dayNum}</span>
                            <span className="text-[8px] uppercase">{date.month}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time slots */}
                  {bookingDate && (
                    <div className="space-y-2 animate-fade-in">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 block">2. Select Hour (UTC-7)</span>
                      <div className="grid grid-cols-3 gap-2">
                        {bookingSlots.map((slot, idx) => {
                          const isSelected = bookingTime === slot;
                          return (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => setBookingTime(slot)}
                              className={`py-2 px-3 rounded-xl transition-all cursor-pointer text-xs font-mono border ${
                                isSelected 
                                  ? 'bg-zinc-100 border-none text-zinc-950 font-bold' 
                                  : 'bg-zinc-900/60 hover:bg-zinc-930 border-zinc-850 text-zinc-350'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Personal Inputs */}
                  {bookingDate && bookingTime && (
                    <div className="space-y-3 pt-2 border-t border-zinc-900/60 animate-fade-in">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 block">3. Personal Coordinates</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-zinc-450 uppercase block pl-1">Name <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            placeholder="Ciara"
                            value={bookingName}
                            onChange={(e) => setBookingName(e.target.value)}
                            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 focus:border-[#D4AF37]/50 rounded-lg text-xs outline-none text-zinc-100"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-zinc-450 uppercase block pl-1">Professional Email <span className="text-red-500">*</span></label>
                          <input 
                            type="email" 
                            required
                            placeholder="ciara@firm.com"
                            value={bookingEmail}
                            onChange={(e) => setBookingEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 focus:border-[#D4AF37]/50 rounded-lg text-xs outline-none text-zinc-100"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-[#D4AF37] uppercase block pl-1 font-semibold">WhatsApp Phone Number <span className="text-red-500">*</span></label>
                          <input 
                            type="tel" 
                            required
                            placeholder="e.g., +33 6 12 34 56 78"
                            value={bookingPhone}
                            onChange={(e) => setBookingPhone(e.target.value)}
                            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 focus:border-[#D4AF37]/50 rounded-lg text-xs outline-none text-[#FFE082]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-zinc-450 uppercase block pl-1 font-light">Brief Project Overview (Optional)</label>
                          <textarea 
                            rows={2}
                            placeholder="Repositioning our high-ticket identity strategy..."
                            value={bookingNotes}
                            onChange={(e) => setBookingNotes(e.target.value)}
                            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 focus:border-[#D4AF37]/50 rounded-lg text-xs outline-none text-zinc-100 resize-none"
                          />
                        </div>
                      </div>

                      {bookingError && (
                        <div className="p-3 bg-red-400/10 border border-red-400/20 text-red-400 rounded-lg text-center text-xs font-mono font-light leading-snug">
                          {bookingError}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isBookingSubmitting}
                        className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#FFE082] text-black font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer border-none shadow-md mt-4"
                      >
                        {isBookingSubmitting ? 'Securing Slot...' : 'Confirm Discovery Appointment'}
                      </button>
                    </div>
                  )}

                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. MODAL: LEARN OUR STORY */}
      <AnimatePresence>
        {isStoryOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setIsStoryOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl rounded-3xl bg-zinc-950 border border-zinc-900 p-6 sm:p-10 space-y-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Icon */}
              <button 
                onClick={() => setIsStoryOpen(false)}
                className="absolute top-5 right-5 p-1 text-zinc-500 hover:text-white bg-transparent border-none cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
                  Venture Atelier • Founders Journey
                </span>
                <h3 className="text-3xl font-serif text-white tracking-wide">Born to Scale Legacies</h3>
                
                <div className="space-y-4 text-xs sm:text-sm text-zinc-450 leading-relaxed font-light font-sans max-h-[350px] overflow-y-auto pr-2">
                  <p>
                    <strong>Venture Atelier</strong> was founded in London by Ciara Mensah and Christ-Meira Guidibi as a specialized reaction against abstract agency models that look pretty but don’t convert users.
                  </p>
                  <p>
                    Ciara Mensah, a rigorous business analyst and brand strategist with a background in digital products and investor backing, noticed that entrepreneurs and creators consistently lacked the tools and narrative structure to turn their ideas into high-ticket systems.
                  </p>
                  <p>
                    Christ-Meira Guidibi, an award-winning creative director with deep expertise in elite aesthetics and luxury layouts, knew that beautiful typography, precise grids, and gorgeous micro-animations are the ultimate mechanism for building instantaneous consumer trust.
                  </p>
                  <p>
                    By merging high-performance strategic engineering with high-end designer aesthetics, Venture Atelier was built as a hybrid laboratory where digital design directly drives real revenue.
                  </p>
                  <p className="bg-[#D4AF37]/5 border-l border-[#D4AF37]/30 p-4 rounded-xl text-zinc-300">
                    "We don't just design templates. We architecture client acquisition machines that help founders turn their greatest visions into high-ticket reality."
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150" 
                      className="w-8 h-8 rounded-full object-cover" 
                      alt="" 
                      referrerPolicy="no-referrer"
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" 
                      className="w-8 h-8 rounded-full object-cover" 
                      alt="" 
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[11px] font-mono text-zinc-400">Ciara & Christ-Meira</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsStoryOpen(false);
                      setIsBookingOpen(true);
                    }}
                    className="px-6 py-3 bg-[#D4AF37] hover:bg-[#FFE082] text-black text-xs font-mono uppercase tracking-widest font-semibold cursor-pointer border-none"
                  >
                    Partner With Us
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
