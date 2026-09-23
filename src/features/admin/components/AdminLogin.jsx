import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, AlertCircle, Sparkles, LogIn, ArrowRight } from "lucide-react";

export default function AdminLogin({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const demoEmail = "admin@cbsua.edu.ph";
  const demoPassword = "adminpassword";

  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      if (email.toLowerCase() === demoEmail && password === demoPassword) {
        onLoginSuccess();
        navigate("/admin/dashboard");
      } else {
        setError("Invalid email address or passcode. Please check the sample credentials provided.");
        setIsLoading(false);
      }
    }, 600);
  };

  const handleQuickLogin = () => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      onLoginSuccess();
      navigate("/admin/dashboard");
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
      
      {/* Brand & Stats info column (Left) */}
      <div className="md:col-span-5 bg-gradient-to-b from-slate-900 to-slate-800 text-white p-8 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="space-y-6 relative z-10">
          <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center font-black text-white text-lg shadow-md">
            C
          </div>
          <div>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest font-mono">Staff Gate</span>
            <h3 className="text-xl font-bold tracking-tight mt-1">CBSUA Admissions Management Console</h3>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Authorized access only. Use this terminal to approve candidate submissions, manage examination slots, allocate rooms, and issue exam permits.
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-8 relative z-10 border-t border-slate-700/50">
          <div className="flex gap-3 text-xs items-center text-slate-300">
            <Shield className="text-emerald-500 shrink-0" size={14} />
            <span>Secure 256-bit encrypted session</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            <p>ISO 9001:2015 Quality Standard</p>
            <p>System Version 2.1.0-prod</p>
          </div>
        </div>
      </div>

      {/* Login fields column (Right) */}
      <div className="md:col-span-7 p-8 flex flex-col justify-center space-y-6">
        <div>
          <h4 className="text-lg font-bold text-slate-900">Administrator Sign In</h4>
          <p className="text-xs text-slate-500 mt-1">Provide your staff credentials to enter the board workspace.</p>
        </div>

        {/* Demo Credentials Alert Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded border border-emerald-200">
              <Sparkles size={10} />
              <span>Developer Demo Account</span>
            </span>
            <button 
              onClick={handleQuickLogin}
              type="button"
              className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition flex items-center gap-0.5 cursor-pointer"
            >
              <span>⚡ Quick Login</span>
              <ArrowRight size={10} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 text-[11px] font-mono text-slate-600">
            <div className="bg-white border border-slate-200 rounded p-2">
              <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Email</span>
              <span className="font-bold select-all text-slate-800">{demoEmail}</span>
            </div>
            <div className="bg-white border border-slate-200 rounded p-2">
              <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Passcode</span>
              <span className="font-bold select-all text-slate-800">{demoPassword}</span>
            </div>
          </div>
        </div>

        {/* Real credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-100 rounded-lg p-3 text-rose-800 text-xs flex gap-2.5 items-start">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-slate-400" size={14} />
              <input
                type="email"
                required
                placeholder="officer@cbsua.edu.ph"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 bg-slate-50/50 rounded text-xs focus:ring-1 focus:ring-emerald-600 focus:bg-white focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Passcode</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-slate-400" size={14} />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 bg-slate-50/50 rounded text-xs focus:ring-1 focus:ring-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded font-bold text-xs shadow-sm transition cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Verifying credentials...</span>
              </span>
            ) : (
              <>
                <LogIn size={13} />
                <span>Enter Board Workspace</span>
              </>
            )}
          </button>
        </form>
      </div>

    </div>
  );
}
