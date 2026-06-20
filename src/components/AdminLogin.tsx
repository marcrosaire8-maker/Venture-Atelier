import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Shield, Lock, Mail, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onClose: () => void;
}

export default function AdminLogin({ onLoginSuccess, onClose }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else {
        onLoginSuccess();
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950 px-6">
      <div 
        className="w-full max-w-md bg-[#0d0d0d] border-2 border-[#D4AF37] p-8 rounded-2xl relative shadow-2xl shadow-[#D4AF37]/5"
        id="admin-login-modal"
      >
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]/50 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]/50 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]/50 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]/50 rounded-br-lg" />

        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex p-3 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/35 text-[#D4AF37] mb-2">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-serif text-white tracking-widest uppercase">
            Cabinet Space
          </h3>
          <p className="text-xs text-zinc-500 font-mono tracking-wider uppercase">
            Venture Atelier Admin Auth
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2.5 text-xs text-red-200 mb-6 font-sans">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <div>
              <p className="font-semibold">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">
              User ID (Email)
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                placeholder="associat@ventureatelier.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111] border border-zinc-900 focus:border-[#D4AF37] outline-none text-zinc-200 text-sm py-3 px-11 rounded-xl transition-all font-sans"
              />
            </div>
          </div>

          <div className="space-y-1.5 font-sans">
            <label className="block text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">
              Secure Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#111] border border-zinc-900 focus:border-[#D4AF37] outline-none text-zinc-200 text-sm py-3 px-11 rounded-xl transition-all font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 bg-zinc-900 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-semibold rounded-xl text-xs uppercase font-mono tracking-widest border border-[#D4AF37]/50 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Authenticate'
            )}
          </button>
        </form>

        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="text-[10px] font-mono tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors uppercase underline"
          >
            Close console
          </button>
        </div>
      </div>
    </div>
  );
}
