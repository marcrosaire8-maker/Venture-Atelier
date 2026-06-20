import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ArrowRight, Check, Copy, ChevronRight, Zap, X, 
  ArrowLeft, Calendar, ShieldCheck, Mail, Linkedin, Clock, 
  CheckCircle2, Laptop, Palette, Megaphone, PenTool, BarChart3,
  Search, Users, Landmark, Phone
} from 'lucide-react';
import { leadService } from '../lib/supabase';

// SOLUTION : Importation de l'image pour que Vite puisse la compiler
import m3Image from '../assets/images/m3.png';

interface HomeHeroProps {
  onStartWizard: () => void;
  onNavigateToPrivacy: () => void;
  onBookCall?: () => void;
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

  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const bookingSlots = ['09:00 AM', '10:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:30 PM'];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingPhone.trim() || bookingPhone.trim().length < 6) {
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

    try {
      const response = await leadService.submitLead({
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
      });
      
      setIsBookingSubmitting(false);
      if (response.success) {
        setIsBookingSuccess(true);
        setTimeout(() => {
          setIsBookingOpen(false);
          setIsBookingSuccess(false);
          setBookingDate(''); setBookingTime(''); setBookingName('');
          setBookingEmail(''); setBookingPhone(''); setBookingNotes('');
        }, 3500);
      } else {
        setBookingError(response.error || "Une erreur est survenue.");
      }
    } catch (err: any) {
      setIsBookingSubmitting(false);
      setBookingError("Une erreur réseau est survenue.");
    }
  };

  return (
    <div className="relative min-h-screen text-[#f3f4f6] font-sans bg-[#030303] overflow-x-hidden selection:bg-[#D4AF37] selection:text-black" id="home">
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#D4AF37]/5 to-[#B88E2F]/10 blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-zinc-900 to-[#D4AF37]/5 blur-[150px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />
      </div>

      <main className="relative z-10 pt-24 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24 sm:space-y-36">
        
        <section className="space-y-12 sm:space-y-20 max-w-7xl mx-auto" id="hero">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              <div className="lg:col-span-7 text-center lg:text-left space-y-6 sm:space-y-8">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 shadow-[0_0_15px_rgba(212,175,55,0.05)]">
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                    Creative Strategy Studio for Founders
                  </span>
                </div>

                <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif leading-[0.95] tracking-tighter text-white">
                  Scaling Dreams <br />
                  <span className="italic text-[#D4AF37] font-light">Into Dollars.</span>
                </h1>

                <p className="text-zinc-400 text-sm sm:text-base md:text-lg font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed border-t border-zinc-900/60 pt-6">
                  We help entrepreneurs, creators, and growing businesses build brands that attract attention, build trust, and drive revenue.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <button onClick={() => setIsBookingOpen(true)} className="w-full sm:w-auto px-8 py-4 bg-[#D4AF37] hover:bg-[#FFE082] text-black font-semibold uppercase text-xs tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer border-none shadow-lg">
                    Book Discovery Call <ArrowRight size={14} />
                  </button>
                  <button onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto px-8 py-4 bg-zinc-950/60 hover:bg-zinc-900/80 text-white border border-zinc-800 hover:border-[#D4AF37]/45 transition-all text-xs font-mono uppercase tracking-widest cursor-pointer">
                    View Our Work
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 relative flex justify-center items-center py-6 sm:py-12">
                <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-[380px] lg:h-[380px]">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D4AF37]/10 to-transparent blur-2xl animate-pulse" />
                  <div className="absolute inset-[-20px] rounded-full border border-[#D4AF37]/20 border-dashed animate-[spin_50s_linear_infinite]" />
                  <div className="absolute inset-[-10px] sm:inset-[-15px] rounded-full border border-zinc-805 border-t-[#D4AF37]/40 rotate-12 animate-[spin_35s_linear_infinite]" />

                  {/* IMAGE CORRIGÉE : Utilisation de m3Image importé */}
                  <div className="absolute inset-8 rounded-full overflow-hidden border border-zinc-900 bg-zinc-950 shadow-2xl relative z-10 group">
                    <img 
                      src={m3Image} 
                      alt="Brand Oracle"
                      className="w-full h-full object-cover grayscale opacity-90 transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                  </div>
                  
                  <div className="absolute top-[10%] right-[10%] w-2.5 h-2.5 rounded-full bg-[#D4AF37]/40 border border-[#D4AF37] animate-ping" />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ... RESTE DU CODE (Services, Portfolio, etc.) ... */}
        {/* Les autres sections restent inchangées */}

      </main>

      <footer className="relative z-10 py-8 px-6 border-t border-zinc-900 bg-[#020202]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-zinc-500 text-xs">
          <div className="flex items-center gap-4">
            {customLogo ? <img src={customLogo} className="w-6 h-6 object-contain" alt="" /> : <span className="font-serif text-[#D4AF37] font-bold">VA</span>}
            <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-550">Venture Atelier &copy; 2026</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono pr-2">London • Paris • Dubai</span>
          </div>
        </div>
      </footer>

      {/* MODAL DE RÉSERVATION (Booking Modal) */}
      <AnimatePresence>
        {isBookingOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-2xl">
              <button onClick={() => setIsBookingOpen(false)} className="absolute top-5 right-5 text-zinc-500 hover:text-white bg-transparent border-none cursor-pointer"><X size={20} /></button>

              {isBookingSuccess ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto"><CheckCircle2 size={24} /></div>
                  <h3 className="text-2xl font-serif text-white">Discovery Booked!</h3>
                  <p className="text-xs text-zinc-400">Thank you {bookingName}. Call set for {bookingDate} at {bookingTime}.</p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-5">
                   <h3 className="text-2xl font-serif text-white">Book Your Scoping Call</h3>
                   <input type="text" placeholder="Name" value={bookingName} onChange={(e) => setBookingName(e.target.value)} className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded text-white" required />
                   <input type="email" placeholder="Email" value={bookingEmail} onChange={(e) => setBookingEmail(e.target.value)} className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded text-white" required />
                   <input type="tel" placeholder="WhatsApp Phone" value={bookingPhone} onChange={(e) => setBookingPhone(e.target.value)} className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded text-white" required />
                   <button type="submit" className="w-full py-3 bg-[#D4AF37] text-black font-bold uppercase text-xs cursor-pointer">Confirm Booking</button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
