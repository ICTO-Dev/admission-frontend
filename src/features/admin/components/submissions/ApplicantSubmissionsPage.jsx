import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import {
  Users,
  Search,
  Eye,
  X,
  Calendar,
  Loader2,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  LayoutDashboard,
  CalendarDays,
  UserCheck,
} from "lucide-react";
import { ApplicationStatus } from "../../../../config/types.js";
import {
  fetchApplications,
  updateApplicationStatus,
  scheduleApplication,
} from "../../../../services/applicationService.js";
import examScheduleService from "../../../../services/examScheduleService.js";
import OfficialFormView from "../../../applicant/components/OfficialFormView.jsx";
import PaginationControl from "../scheduling/PaginationControl.jsx";
import ApplicantEvaluationModal from "./ApplicantEvaluationModal.jsx";
import { useAuth, useSchoolYears } from "../../../../hooks/index.js";

export default function ApplicantSubmissionsPage() {
  const { user } = useAuth();
  const campusName = user?.campus?.name || "Main Campus (Pili)";
  const { data: schoolYears = [], isLoading: isSYLoading } = useSchoolYears();
  const defaultSY = schoolYears.find((sy) => sy.status === "Open" && sy.is_active)
                 || schoolYears.find((sy) => sy.status === "Open")
                 || schoolYears.find((sy) => sy.is_active)
                 || schoolYears[0];
  const [selectedSchoolYearId, setSelectedSchoolYearId] = useState("");

  const activeSchoolYear = (selectedSchoolYearId
    ? schoolYears.find((sy) => String(sy.id) === String(selectedSchoolYearId))
    : null) || defaultSY;

  useEffect(() => {
    if (!selectedSchoolYearId && defaultSY?.id) {
      setSelectedSchoolYearId(String(defaultSY.id));
    }
  }, [defaultSY?.id, selectedSchoolYearId]);

  const [applications, setApplications] = useState([]);
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination & Server Status Meta
  const [paginationMeta, setPaginationMeta] = useState({
    total: 0,
    current_page: 1,
    last_page: 1,
    per_page: 10,
    from: 0,
    to: 0,
  });

  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    pending: 0,
    approved: 0,
    scheduled: 0,
    rejected: 0,
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selected applicant & modals
  const [selectedApp, setSelectedApp] = useState(null);
  const [showFormPrint, setShowFormPrint] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showFullReviewModal, setShowFullReviewModal] = useState(false);

  // Action loading states
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  // Debounce search query input (350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadData = async (
    page = currentPage,
    query = debouncedSearch,
    status = statusFilter,
    perPage = pageSize
  ) => {
    setIsLoading(true);
    try {
      const params = {
        page,
        per_page: perPage,
      };

      if (query && query.trim()) {
        params.search = query.trim();
      }

      if (status && status !== "All") {
        params.status = status;
      }

      if (user?.campus_id) {
        params.campus_id = user.campus_id;
      }

      const effectiveSyId = selectedSchoolYearId || activeSchoolYear?.id;
      if (effectiveSyId) {
        params.school_year_id = effectiveSyId;
      }
      if (activeSchoolYear?.name) {
        params.school_year = activeSchoolYear.name;
      }

      const res = await fetchApplications(params);
      const appData = res?.data || (Array.isArray(res) ? res : []);
      setApplications(appData);

      if (res?.meta) {
        setPaginationMeta(res.meta);
      } else {
        setPaginationMeta({
          total: appData.length,
          current_page: page,
          last_page: Math.ceil(appData.length / perPage) || 1,
          per_page: perPage,
          from: appData.length > 0 ? (page - 1) * perPage + 1 : 0,
          to: appData.length > 0 ? Math.min(page * perPage, appData.length) : 0,
        });
      }

      if (res?.counts) {
        setStatusCounts(res.counts);
      }

      // Fetch real exam schedule slots for allocation
      try {
        const realSlots = await examScheduleService.getExamSchedules({
          campus_id: user?.campus_id || undefined,
          school_year_id: effectiveSyId || undefined,
        });
        setSlots(realSlots || []);
      } catch (slotErr) {
        console.warn("Could not load exam slots from API:", slotErr);
        setSlots([]);
      }
    } catch (err) {
      console.error("Error fetching applicant submissions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch when page, search query, status filter, page size, or campus/school year changes
  useEffect(() => {
    // Huwag mag-fetch habang naglo-load pa ang school years list o habang hinihintay pa ang default school year
    if (isSYLoading) return;
    if (schoolYears.length > 0 && !selectedSchoolYearId && defaultSY?.id) return;

    loadData(currentPage, debouncedSearch, statusFilter, pageSize);
  }, [
    currentPage,
    debouncedSearch,
    statusFilter,
    pageSize,
    selectedSchoolYearId,
    activeSchoolYear?.id,
    user?.campus_id,
    isSYLoading
  ]);

  const handleApproveForExam = async (appId) => {
    setIsApproving(true);
    try {
      const updatedApp = await updateApplicationStatus(appId, ApplicationStatus.APPROVED_FOR_EXAM);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId || a.applicationNo === appId ? updatedApp : a))
      );
      setSelectedApp(null);
      setShowFullReviewModal(false);
      // Refresh count summary & current page
      loadData(currentPage, debouncedSearch, statusFilter, pageSize);
    } catch (err) {
      alert("Error approving application: " + (err.message || "Failed to approve"));
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp || isRejecting) return;
    setIsRejecting(true);
    try {
      const updatedApp = await updateApplicationStatus(
        selectedApp.id || selectedApp.applicationNo,
        ApplicationStatus.REJECTED,
        rejectionReason
      );
      setApplications((prev) =>
        prev.map((a) => (a.id === selectedApp.id || a.applicationNo === selectedApp.applicationNo ? updatedApp : a))
      );
      setSelectedApp(null);
      setShowRejectModal(false);
      setShowFullReviewModal(false);
      setRejectionReason("");
      loadData(currentPage, debouncedSearch, statusFilter, pageSize);
    } catch (err) {
      alert("Error rejecting application: " + (err.message || "Failed to reject"));
    } finally {
      setIsRejecting(false);
    }
  };

  const handleAssignSchedule = async (appId, { slotId, course }) => {
    setIsAssigning(true);
    try {
      const updatedApp = await scheduleApplication(appId, {
        slotId,
        course,
      });
      setApplications((prev) =>
        prev.map((a) => (a.id === appId || a.applicationNo === appId ? updatedApp : a))
      );
      setSelectedApp(null);
      setShowFullReviewModal(false);
      loadData(currentPage, debouncedSearch, statusFilter, pageSize);
      return updatedApp;
    } catch (err) {
      throw err;
    } finally {
      setIsAssigning(false);
    }
  };

  // Metrics for Submission Cards (Dynamic from Database)
  const totalCount = statusCounts.all ?? 0;
  const pendingCount = statusCounts.pending ?? 0;
  const approvedCount = statusCounts.approved ?? 0;
  const scheduledCount = statusCounts.scheduled ?? 0;
  const rejectedCount = statusCounts.rejected ?? 0;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. DEDICATED APPLICANT SUBMISSIONS BANNER */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Campus Scoped Center
            </span>
            {activeSchoolYear && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                A.Y. {activeSchoolYear.name}
              </span>
            )}
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <UserCheck className="text-emerald-400" size={24} />
            Applicant Submissions & Evaluation Control
          </h2>
          <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
            <MapPin size={13} className="text-emerald-400" />
            <span>Assigned Campus: <strong className="text-white">{campusName}</strong></span>
            <span className="text-slate-400">•</span>
            <span>Managed by: <strong className="text-white">{user?.name || "Admission Officer"}</strong></span>
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <NavLink
            to="/admin/dashboard"
            className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur transition cursor-pointer"
          >
            <LayoutDashboard size={13} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/admin/schedules"
            className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur transition cursor-pointer"
          >
            <CalendarDays size={13} />
            <span>Exam Scheduling</span>
          </NavLink>
          <button
            type="button"
            onClick={() => loadData(currentPage, debouncedSearch, statusFilter, pageSize)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-xl text-xs font-semibold backdrop-blur transition cursor-pointer disabled:cursor-not-allowed"
            title="Refresh applicant submissions"
          >
            <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
            <span>{isLoading ? "Syncing..." : "Sync"}</span>
          </button>
        </div>
      </div>

      {/* 2. DEDICATED APPLICANT SUBMISSION METRIC CARDS (DYNAMIC FROM DB) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Filed */}
        <div
          onClick={() => {
            setStatusFilter("All");
            setCurrentPage(1);
          }}
          className={`bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3.5 cursor-pointer hover:border-slate-300 transition ${
            statusFilter === "All" ? "ring-2 ring-emerald-600/40" : ""
          }`}
        >
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600">
            <Users size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Filed</span>
            <span className="text-xl font-bold font-mono text-slate-900">{totalCount}</span>
          </div>
        </div>

        {/* Pending Review */}
        <div
          onClick={() => {
            setStatusFilter(ApplicationStatus.PENDING);
            setCurrentPage(1);
          }}
          className={`bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm border-l-4 border-l-amber-500 flex items-center gap-3.5 cursor-pointer hover:border-slate-300 transition ${
            statusFilter === ApplicationStatus.PENDING ? "ring-2 ring-amber-500/40" : ""
          }`}
        >
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-700">
            <Clock size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Pending Review</span>
            <span className="text-xl font-bold font-mono text-slate-900">{pendingCount}</span>
          </div>
        </div>

        {/* Approved for Exam */}
        <div
          onClick={() => {
            setStatusFilter(ApplicationStatus.APPROVED_FOR_EXAM);
            setCurrentPage(1);
          }}
          className={`bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm border-l-4 border-l-emerald-500 flex items-center gap-3.5 cursor-pointer hover:border-slate-300 transition ${
            statusFilter === ApplicationStatus.APPROVED_FOR_EXAM ? "ring-2 ring-emerald-500/40" : ""
          }`}
        >
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Approved for Exam</span>
            <span className="text-xl font-bold font-mono text-slate-900">{approvedCount}</span>
          </div>
        </div>

        {/* Scheduled */}
        <div
          onClick={() => {
            setStatusFilter(ApplicationStatus.SCHEDULED);
            setCurrentPage(1);
          }}
          className={`bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm border-l-4 border-l-sky-500 flex items-center gap-3.5 cursor-pointer hover:border-slate-300 transition ${
            statusFilter === ApplicationStatus.SCHEDULED ? "ring-2 ring-sky-500/40" : ""
          }`}
        >
          <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl text-sky-700">
            <Calendar size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Scheduled</span>
            <span className="text-xl font-bold font-mono text-slate-900">{scheduledCount}</span>
          </div>
        </div>

        {/* Rejected */}
        <div
          onClick={() => {
            setStatusFilter(ApplicationStatus.REJECTED);
            setCurrentPage(1);
          }}
          className={`bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm border-l-4 border-l-rose-500 flex items-center gap-3.5 col-span-2 lg:col-span-1 cursor-pointer hover:border-slate-300 transition ${
            statusFilter === ApplicationStatus.REJECTED ? "ring-2 ring-rose-500/40" : ""
          }`}
        >
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700">
            <XCircle size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Rejected Files</span>
            <span className="text-xl font-bold font-mono text-slate-900">{rejectedCount}</span>
          </div>
        </div>
      </div>

      {/* 3. SUBMISSIONS TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-sans">Applicant Submissions Board</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review applicant documents, evaluate credentials, approve examinations, and assign test rooms
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex bg-slate-100 rounded-lg p-0.5 text-[11px] font-bold text-slate-500 border border-slate-200 flex-wrap">
                {[
                  { label: "All", value: "All", count: totalCount },
                  { label: "Pending", value: ApplicationStatus.PENDING, count: pendingCount },
                  { label: "Approved", value: ApplicationStatus.APPROVED_FOR_EXAM, count: approvedCount },
                  { label: "Scheduled", value: ApplicationStatus.SCHEDULED, count: scheduledCount },
                  { label: "Rejected", value: ApplicationStatus.REJECTED, count: rejectedCount },
                ].map((tab) => (
                  <button
                    key={tab.label}
                    onClick={() => {
                      setStatusFilter(tab.value);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                      statusFilter === tab.value
                        ? "bg-white text-emerald-800 shadow-sm font-bold border border-slate-200/50"
                        : "hover:text-slate-900"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                        statusFilter === tab.value
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search size={14} />
                </div>
                <input
                  type="text"
                  placeholder="Search by Applicant Name, App No., or LRN..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-8 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setCurrentPage(1);
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <select
                  value={selectedSchoolYearId}
                  onChange={(e) => {
                    setSelectedSchoolYearId(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
                  title="Filter applicants by Academic Year"
                >
                  <option value="">All Academic Years</option>
                  {schoolYears.map((sy) => (
                    <option key={sy.id} value={sy.id}>
                      A.Y. {sy.name} {sy.status === "Open" ? "● Open" : "○ Closed"}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => loadData(currentPage, debouncedSearch, statusFilter, pageSize)}
                  disabled={isLoading}
                  className="p-2 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition cursor-pointer disabled:opacity-50"
                  title="Refresh submissions"
                >
                  <RefreshCw size={14} className={isLoading ? "animate-spin text-emerald-600" : ""} />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                <Loader2 size={24} className="animate-spin text-emerald-600" />
                <span className="text-xs">Loading submissions from database...</span>
              </div>
            ) : applications.length > 0 ? (
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="p-4">App No.</th>
                    <th className="p-4">Full Name</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Course Applied</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                  {applications.map((app) => (
                      <tr
                        key={app.id || app.applicationNo}
                        onClick={() => {
                          setSelectedApp(app);
                          setShowFullReviewModal(true);
                        }}
                        className="hover:bg-slate-50/70 cursor-pointer transition"
                      >
                        <td className="p-4 font-mono font-bold text-slate-900">{app.id || app.applicationNo}</td>
                        <td className="p-4">
                          <p className="font-bold text-slate-800">
                            {app.lastName}, {app.firstName} {app.middleName ? `${app.middleName.charAt(0)}.` : ""}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                            <span>LRN: {app.lrn}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-100">
                              {typeof app.campus === "string" ? app.campus : (app.campus?.name || "Pili")}
                            </span>
                          </p>
                        </td>
                        <td className="p-4 text-slate-500">{app.studentType}</td>
                        <td className="p-4 text-slate-600 max-w-[150px] truncate">{app.courseApplied1st}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-mono rounded font-bold ${
                              app.status === ApplicationStatus.PENDING
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : app.status === ApplicationStatus.APPROVED_FOR_EXAM
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : app.status === ApplicationStatus.SCHEDULED
                                ? "bg-sky-50 text-sky-800 border border-sky-200"
                                : "bg-rose-50 text-rose-800 border border-rose-200"
                            }`}
                          >
                            {app.status === "Approved for Exam" ? "Approved" : app.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {app.status === ApplicationStatus.APPROVED_FOR_EXAM || app.status === "Approved" ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedApp(app);
                                setShowFullReviewModal(true);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200"
                              title="Assign examination schedule slot"
                            >
                              <Calendar size={12} />
                              <span>Schedule</span>
                            </button>
                          ) : app.status === ApplicationStatus.SCHEDULED ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedApp(app);
                                setShowFullReviewModal(true);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                              title="View scheduled details and permit"
                            >
                              <Eye size={12} />
                              <span>Details</span>
                            </button>
                          ) : app.status === ApplicationStatus.REJECTED ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedApp(app);
                                setShowFullReviewModal(true);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200"
                              title="View rejection reason"
                            >
                              <Eye size={12} />
                              <span>Review</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedApp(app);
                                setShowFullReviewModal(true);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                              title="Evaluate applicant dossier"
                            >
                              <Eye size={12} />
                              <span>Evaluate</span>
                            </button>
                          )}
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-12 text-center text-slate-400 italic text-xs">
                No submissions match the search query or filters.
              </div>
            )}
          </div>

          {/* DYNAMIC DATABASE PAGINATION CONTROLS */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-medium">Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-xs"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex-1 w-full sm:w-auto">
              <PaginationControl
                currentPage={currentPage}
                totalItems={paginationMeta.total || 0}
                pageSize={pageSize}
                onPageChange={(p) => setCurrentPage(p)}
                itemLabel="applicants"
              />
            </div>
          </div>
        </div>

        {/* FULL COMPREHENSIVE EVALUATION MODAL (ALL 5 SECTIONS) */}
      <ApplicantEvaluationModal
        application={selectedApp}
        isOpen={Boolean(showFullReviewModal && selectedApp)}
        onClose={() => {
          setShowFullReviewModal(false);
          setSelectedApp(null);
        }}
        onApprove={handleApproveForExam}
        onReject={() => setShowRejectModal(true)}
        onAssignSchedule={handleAssignSchedule}
        onOpenPrint={(app) => setShowFormPrint(app)}
        slots={slots}
        isApproving={isApproving}
        isRejecting={isRejecting}
        isAssigning={isAssigning}
      />

      {/* Reject Modal */}
      {showRejectModal &&
        createPortal(
          <div className="fixed inset-0 z-[110] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Reject Application File</h3>
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  disabled={isRejecting}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded disabled:opacity-50 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleRejectSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Reason for Rejection / Deficiency
                  </label>
                  <textarea
                    required
                    rows={3}
                    disabled={isRejecting}
                    placeholder="e.g. Incomplete Form 138 / Blurred Good Moral Certificate"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 disabled:opacity-50"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    disabled={isRejecting}
                    onClick={() => setShowRejectModal(false)}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isRejecting}
                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-lg font-bold shadow flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isRejecting && <Loader2 className="animate-spin" size={13} />}
                    <span>{isRejecting ? "Rejecting..." : "Confirm Rejection"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* Official Printable ADM-FR-002 Modal */}
      {showFormPrint &&
        createPortal(
          <div className="fixed inset-0 z-[120] bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
            <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto relative">
              <div className="p-3 bg-slate-900 text-white flex items-center justify-between px-4 shrink-0">
                <span className="text-xs font-bold font-mono">CBSUA ADM-FR-002 Document Preview</span>
                <button
                  type="button"
                  onClick={() => setShowFormPrint(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <OfficialFormView application={showFormPrint} onClose={() => setShowFormPrint(null)} />
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
