import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ApplicationStatus } from "../../../../config/types.js";
import { fetchApplicationByNo } from "../../../../services/mockDb.js";
import { Search, Loader2, Calendar, MapPin, AlertCircle, CheckCircle2, XCircle, Clock, FileDown } from "lucide-react";
import OfficialFormView from "../OfficialFormView.jsx";
import TestPermitView from "../TestPermitView.jsx";

export default function ApplicantSearch() {
  const { appNo: routeAppNo } = useParams();
  const navigate = useNavigate();

  const [appNo, setAppNo] = useState(routeAppNo || "");
  const [isLoading, setIsLoading] = useState(false);
  const [application, setApplication] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPrintView, setShowPrintView] = useState(false);
  const [showTestPermitView, setShowTestPermitView] = useState(false);

  useEffect(() => {
    if (routeAppNo) {
      setAppNo(routeAppNo);
      performSearch(routeAppNo);
    }
  }, [routeAppNo]);

  const performSearch = async (targetAppNo) => {
    if (!targetAppNo.trim()) return;

    setIsLoading(true);
    setErrorMsg("");
    setApplication(null);

    try {
      const data = await fetchApplicationByNo(targetAppNo.trim());
      if (!data) {
        throw new Error("Application Number not found. Please verify the number and try again.");
      }
      setApplication(data);
    } catch (err) {
      setErrorMsg(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!appNo.trim()) return;
    navigate(`/status/${appNo.trim()}`);
    performSearch(appNo.trim());
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case ApplicationStatus.PENDING:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200 text-xs font-semibold uppercase">
            <Clock size={12} className="animate-pulse" />
            <span>Pending Review</span>
          </span>
        );
      case ApplicationStatus.APPROVED_FOR_EXAM:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 text-xs font-semibold uppercase">
            <CheckCircle2 size={12} />
            <span>Approved for Exam</span>
          </span>
        );
      case ApplicationStatus.SCHEDULED:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 rounded-full border border-blue-200 text-xs font-semibold uppercase">
            <Calendar size={12} />
            <span>Exam Scheduled</span>
          </span>
        );
      case ApplicationStatus.REJECTED:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-800 rounded-full border border-rose-200 text-xs font-semibold uppercase">
            <XCircle size={12} />
            <span>Disapproved</span>
          </span>
        );
      default:
        return null;
    }
  };

  if (showPrintView && application) {
    return (
      <OfficialFormView 
        application={application} 
        onClose={() => setShowPrintView(false)} 
      />
    );
  }

  if (showTestPermitView && application) {
    return (
      <TestPermitView 
        application={application} 
        onClose={() => setShowTestPermitView(false)} 
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Search Bar Block */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-950 mb-2 font-sans">Applicant Admission Portal</h3>
        <p className="text-xs text-slate-500 mb-6">Enter your Application Number to check your schedule status, view exam slots, and download pre-filled forms.</p>

        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={appNo}
              onChange={(e) => setAppNo(e.target.value)}
              placeholder="e.g. APP-2026-0001"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono uppercase tracking-wider text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !appNo.trim()}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <span>Track Application</span>
            )}
          </button>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Result Display Card */}
      {application && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
          <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Application Tracking Record</span>
              <h4 className="text-xl font-mono font-bold text-slate-900 mt-0.5">{application.id}</h4>
            </div>
            <div>{getStatusBadge(application.status)}</div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Applicant Name</span>
                <p className="text-sm font-bold text-slate-800">
                  {application.lastName}, {application.firstName} {application.middleName || ""}
                </p>
                <p className="text-xs text-slate-500 font-mono">LRN: {application.lrn}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">First Choice Program</span>
                <p className="text-sm font-bold text-emerald-800">{application.courseApplied1st}</p>
                <p className="text-xs text-slate-500">2nd: {application.courseApplied2nd || "N/A"}</p>
              </div>
            </div>

            {/* Examination Permit Callout (if scheduled) */}
            {application.status === ApplicationStatus.SCHEDULED && application.examAssignment && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                  <Calendar size={18} className="text-blue-600" />
                  <span>Entrance Examination Assigned Slot</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Exam Date</span>
                    <span className="font-bold text-slate-900">{application.examAssignment.examDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Time & Batch</span>
                    <span className="font-bold text-slate-900">{application.examAssignment.batchTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Venue & Room</span>
                    <span className="font-bold text-slate-900">{application.examAssignment.venue} - {application.examAssignment.room}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowTestPermitView(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <FileDown size={14} />
                    <span>View Entrance Exam Permit (CAT)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Document Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-slate-500">Official ADM-FR-002 Student Directory Form digital copy is ready.</p>
              <button
                onClick={() => setShowPrintView(true)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <FileDown size={14} />
                <span>Download Form (ADM-FR-002)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
