import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Star, UserCheck, FileText, Search, ShieldCheck } from "lucide-react";

export default function Header({ isAdminLoggedIn, currentUser, onAdminLogout }) {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-emerald-600 rounded flex items-center justify-center text-center font-black text-white text-sm shadow-sm group-hover:bg-emerald-700 transition">
              C
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wider uppercase text-slate-900 leading-tight">
                CENTRAL BICOL STATE UNIVERSITY
              </h1>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">
                Online Admission & Exam Scheduling System
              </p>
            </div>
          </NavLink>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <NavLink
              to="/apply"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`
              }
            >
              <FileText size={14} />
              <span className="hidden sm:inline">Apply Online</span>
            </NavLink>

            <NavLink
              to="/status"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`
              }
            >
              <Search size={14} />
              <span className="hidden sm:inline">Check Status</span>
            </NavLink>

            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`
              }
            >
              <ShieldCheck size={14} />
              <span>Admin Board</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Admin Session Strip */}
      {isAdminLoggedIn && (
        <div className="bg-slate-900 text-white py-1.5 px-4 text-xs font-mono border-t border-slate-800">
          <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-emerald-400 text-[11px]">ADMINISTRATIVE SESSION ACTIVE</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-300">
              <span className="text-emerald-300 font-semibold">{currentUser?.name || currentUser?.email || "Admin User"}</span>
              <span>|</span>
              <button
                onClick={() => {
                  onAdminLogout();
                  navigate("/admin/login");
                }}
                className="hover:text-white text-rose-400 underline font-bold transition flex items-center gap-1"
              >
                <LogOut size={12} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
