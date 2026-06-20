import React, { useEffect, useState } from 'react';
import { Shield, LogOut, CheckCircle, Database } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminNavbarProps {
  onLogout: () => void;
  customLogo: string | null;
  totalLeads: number;
}

export default function AdminNavbar({ onLogout, customLogo, totalLeads }: AdminNavbarProps) {
  const [adminEmail, setAdminEmail] = useState<string>('cargaison@administration');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          setAdminEmail(user.email);
        }
      } catch (err) {
        console.error("Could not fetch user email:", err);
      }
    };
    fetchUser();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#060606] border-b border-[#D4AF37]/40 shadow-xl shadow-black/40">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Left Side: Brand Identity for the Cabinet */}
        <div className="flex items-center gap-3" id="admin-nav-brand">
          {customLogo && (
            <img 
              src={customLogo} 
              alt="Venture Cabinet Logo" 
              className="w-10 h-10 object-contain rounded-lg border border-[#D4AF37]/50 bg-black p-0.5" 
            />
          )}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-lg tracking-[0.2em] font-medium text-white uppercase">
                Venture Atelier
              </span>
              <span className="px-2 py-0.5 rounded text-[8px] font-mono uppercase bg-red-950/80 border border-red-500/30 text-red-400 tracking-wider font-semibold">
                Cabinet Space
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-0.5">
              Private Administration Console
            </span>
          </div>
        </div>

        {/* Center: Live Session Indicators Concerned ONLY with Administration */}
        <div className="hidden md:flex items-center gap-6 text-xs font-mono" id="admin-nav-telemetry">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950/85 border border-zinc-900">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-400">Active Administrator Session</span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111109] border border-[#D4AF37]/20 text-zinc-300">
            <Database className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Customer Briefs: <strong className="text-[#FFE082]">{totalLeads}</strong></span>
          </div>
        </div>

        {/* Right Side: Secure Actions only relevant to the Administrator */}
        <div className="flex items-center gap-4" id="admin-nav-actions">
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-xs font-serif text-zinc-300">Administrator Connected</span>
            <span className="text-[9px] font-mono text-yellow-400">{adminEmail}</span>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider font-semibold text-red-400 bg-red-950/20 hover:bg-red-950/55 border border-red-500/20 hover:border-red-500/50 rounded-full transition-all cursor-pointer shadow-sm active:scale-95"
            title="Exit console and close session"
            id="admin-nav-logout-btn"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>

      </div>
    </nav>
  );
}
