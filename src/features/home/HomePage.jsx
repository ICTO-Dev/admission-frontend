import React from "react";
import { Link } from "react-router-dom";
import { FileText, Search, ShieldCheck, Star, ArrowRight, CheckCircle2, Award, Clock } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Banner */}
      <section className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xs">
        <div className="max-w-3xl mx-auto relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full border border-emerald-200">
            <Star size={12} className="fill-emerald-700 text-emerald-700" />
            <span>SY 2026-2027 Online Admission Cycle Open</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Central Bicol State University of Agriculture
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Skip the long queues. Secure your college application entirely online. Digitally file your official <strong>Student Directory Form (ADM-FR-002)</strong>, track officer reviews, and obtain your entrance examination permit.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/apply"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition flex items-center gap-2"
            >
              <FileText size={18} />
              <span>Start Application Form</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/status"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition flex items-center gap-2"
            >
              <Search size={18} />
              <span>Track Application / Permit</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center font-bold">
            <FileText size={20} />
          </div>
          <h3 className="text-base font-bold text-slate-900">1. Digital ADM-FR-002 Filing</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Fill out personal demographics, family profiles, academic records, and upload photo credentials step-by-step.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 bg-sky-50 text-sky-700 rounded-lg flex items-center justify-center font-bold">
            <Clock size={20} />
          </div>
          <h3 className="text-base font-bold text-slate-900">2. Real-Time Review Tracking</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Track your application status anytime using your unique Application Number (e.g. APP-2026-0001).
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center font-bold">
            <Award size={20} />
          </div>
          <h3 className="text-base font-bold text-slate-900">3. Exam Permit Generation</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Once approved and scheduled by admission officers, immediately download your pre-filled exam permit ticket.
          </p>
        </div>
      </section>
    </div>
  );
}
