import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ApplicationStatus } from '../../../../config/types.js';
import { getStorageUrl } from "../../../../utils/imageUrl.js";
import {
  fetchApplications,
  updateApplicationStatus,
  scheduleApplication
} from '../../../../services/applicationService.js';
import examScheduleService from '../../../../services/examScheduleService.js';
import {
  Users,
  CheckCircle2,
  Clock,
  Calendar,
  AlertTriangle,
  Search,
  Eye,
  Check,
  X,
  MapPin,
  RefreshCw,
  Layers,
  Sparkles,
  Loader2,
  Printer,
  LogOut,
  MailCheck,
} from "lucide-react";
import OfficialFormView from '../../../applicant/components/OfficialFormView.jsx';

export default function ProcessorDashboard({ onLogout }) {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [slots, setSlots] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approvedForExam: 0,
    scheduled: 0,
    rejected: 0,
    byCourse: {},
    byStudentType: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedApp, setSelectedApp] = useState(null);
  const [showFormPrint, setShowFormPrint] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [scheduleCourseAdmitted, setScheduleCourseAdmitted] = useState("");
  const [scheduleError, setScheduleError] = useState("");
  const [adminSubTab, setAdminSubTab] = useState("dashboard");

  // Action loading states
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchApplications({ per_page: 100 });
      const appData = response?.data || [];
      setApplications(appData);

      const counts = response?.counts || {};
      const byCourse = appData.reduce((acc, a) => {
        const c = a.courseApplied1st || 'General';
        acc[c] = (acc[c] || 0) + 1;
        return acc;
      }, {});
      const byStudentType = appData.reduce((acc, a) => {
        const t = a.studentType || 'Freshman';
        acc[t] = (acc[t] || 0) + 1;
        return acc;
      }, {});

      setStats({
        total: counts.all ?? appData.length,
        pending: counts.pending ?? appData.filter(a => a.status === ApplicationStatus.PENDING).length,
        approvedForExam: counts.approved ?? appData.filter(a => a.status === ApplicationStatus.APPROVED_FOR_EXAM).length,
        scheduled: counts.scheduled ?? appData.filter(a => a.status === ApplicationStatus.SCHEDULED).length,
        rejected: counts.rejected ?? appData.filter(a => a.status === ApplicationStatus.REJECTED).length,
        byCourse,
        byStudentType,
      });

      try {
        const realSlots = await examScheduleService.getExamSchedules();
        setSlots(realSlots || []);
      } catch (slotErr) {
        console.warn("Could not load exam slots from API:", slotErr);
        setSlots([]);
      }
    } catch (err) {
      console.error("Error fetching data from API:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveForExam = async (appId) => {
    setIsApproving(true);
    try {
      const updatedApp = await updateApplicationStatus(appId, ApplicationStatus.APPROVED_FOR_EXAM);
      setApplications((prev) => prev.map((a) => (a.id === appId ? updatedApp : a)));
      if (selectedApp?.id === appId) {
        setSelectedApp(updatedApp);
      }
      fetchData();
    } catch (err) {
      alert("Error approving application: " + (err.message || "Request failed"));
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp || isRejecting) return;
    setIsRejecting(true);
    try {
      const updatedApp = await updateApplicationStatus(selectedApp.id, ApplicationStatus.REJECTED, rejectionReason);
      setApplications((prev) => prev.map((a) => (a.id === selectedApp.id ? updatedApp : a)));
      setSelectedApp(updatedApp);
      setShowRejectModal(false);
      setRejectionReason("");
      fetchData();
    } catch (err) {
      alert("Error rejecting application: " + (err.message || "Request failed"));
    } finally {
      setIsRejecting(false);
    }
  };

  const handleAssignSchedule = async (e) => {
    e.preventDefault();
    if (!selectedApp || !selectedSlotId || isAssigning) return;
    setScheduleError("");
    const chosenSlot = slots.find((s) => String(s.id) === String(selectedSlotId));
    const enrolled = chosenSlot?.applications_count ?? chosenSlot?.currentEnrolledCount ?? chosenSlot?.total_applicants ?? 0;
    const totalSeats = chosenSlot?.total_seats ?? chosenSlot?.room?.total_seat ?? chosenSlot?.max_capacity ?? 30;
    if (chosenSlot && (enrolled >= totalSeats || chosenSlot.status === "Full")) {
      setScheduleError(`Automated Conflict Blocked: Room '${chosenSlot.room?.room_name || chosenSlot.room || "Room"}' is at full capacity (${enrolled}/${totalSeats} seats). No more applicants can be assigned to this schedule.`);
      return;
    }
    setIsAssigning(true);
    try {
      const updatedApp = await scheduleApplication(selectedApp.id, {
        slot_id: Number(selectedSlotId),
        exam_schedule_id: Number(selectedSlotId),
        course: scheduleCourseAdmitted || selectedApp.courseApplied1st
      });
      setApplications((prev) => prev.map((a) => (a.id === selectedApp.id ? updatedApp : a)));
      setSelectedApp(updatedApp);
      setSelectedSlotId("");
      fetchData();
    } catch (err) {
      setScheduleError(err.message || "Conflict checking caught an issue.");
    } finally {
      setIsAssigning(false);
    }
  };

  const filteredApps = applications.filter((app) => {
    const appId = String(app.id || app.applicationNo || "");
    const fullName = `${app.firstName || ""} ${app.lastName || ""}`.toLowerCase();
    const lrn = String(app.lrn || "");
    const q = searchQuery.toLowerCase();
    const matchesSearch = appId.toLowerCase().includes(q) || fullName.includes(q) || lrn.includes(q);
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  if (showFormPrint) {
    return <OfficialFormView application={showFormPrint} onClose={() => setShowFormPrint(null)} />;
  }

  const systemEmailsLog = applications
    .flatMap((app) => (app.notificationsSent || []).map((n) => ({ ...n, applicantName: `${app.firstName} ${app.lastName}`, appId: app.id })))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const statsByCampus = applications.reduce((acc, app) => {
    const campusName = app.campus || "Pili";
    acc[campusName] = (acc[campusName] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-950 font-sans">Admission Officer Management Terminal</h2>
          <p className="text-xs text-slate-500 mt-0.5">Validate student files, manage slots, run room density conflict checks, and trigger permits.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Refresh Logs</span>
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row flex-wrap gap-1">
          <button
            onClick={() => setAdminSubTab("dashboard")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${adminSubTab === "dashboard" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
          >
            <Layers size={13} />
            <span>Dashboard Analytics</span>
          </button>

          <button
            onClick={() => navigate("/admin/submissions")}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition relative cursor-pointer"
          >
            <Users size={13} />
            <span>Applicant Submissions Board</span>
            {stats.pending > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold leading-none text-rose-100 bg-rose-600 rounded-full animate-pulse ml-1">
                {stats.pending}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate("/admin/schedules")}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
          >
            <Calendar size={13} />
            <span>CBSUA Entrance Examination Slots Manager</span>
          </button>

          <button
            onClick={() => setAdminSubTab("emails")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition relative cursor-pointer ${adminSubTab === "emails" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
          >
            <MailCheck size={13} />
            <span>Sent System Permit Logs</span>
            {systemEmailsLog.length > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold leading-none text-emerald-100 bg-emerald-700 rounded-full ml-1">
                {systemEmailsLog.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {adminSubTab === "emails" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sent Notification Logs</h3>
              <p className="text-xs text-slate-500">Live feed of SMTP permits and official validation dispatches.</p>
            </div>
            <span className="text-xs font-bold text-slate-500 font-mono">Count: {systemEmailsLog.length}</span>
          </div>

          {systemEmailsLog.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No outgoing notifications recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {systemEmailsLog.map((log, idx) => (
                <div key={idx} className="py-3 flex items-start justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <MailCheck size={16} className="text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">{log.applicantName} <span className="font-mono text-slate-400 font-normal">({log.appId})</span></p>
                      <p className="text-[11px] text-slate-500">{log.subject}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {adminSubTab === "dashboard" && (
        <div className="space-y-6 animate-fade-in">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-slate-900 flex items-center gap-4">
              <div className="p-2.5 bg-slate-100 rounded-lg text-slate-700"><Users size={16} /></div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Filed</span>
                <span className="text-xl font-bold text-slate-900 font-mono">{stats.total}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-amber-500 flex items-center gap-4">
              <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-lg text-amber-700"><Clock size={16} /></div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pending</span>
                <span className="text-xl font-bold text-slate-900 font-mono">{stats.pending}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500 flex items-center gap-4">
              <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-700"><CheckCircle2 size={16} /></div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Approved</span>
                <span className="text-xl font-bold text-slate-900 font-mono">{stats.approvedForExam}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-sky-500 flex items-center gap-4">
              <div className="p-2.5 bg-sky-50 border border-sky-100 rounded-lg text-sky-700"><Calendar size={16} /></div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Scheduled</span>
                <span className="text-xl font-bold text-slate-900 font-mono">{stats.scheduled}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-rose-500 flex items-center gap-4 col-span-2 lg:col-span-1">
              <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-lg text-rose-700"><X size={16} /></div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Rejected</span>
                <span className="text-xl font-bold text-slate-900 font-mono">{stats.rejected}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Layers size={14} className="text-emerald-600" />
                <span>Applications by Primary Course Choice</span>
              </h4>
              <div className="space-y-3.5">
                {Object.keys(stats.byCourse).length > 0 ? (
                  Object.entries(stats.byCourse).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([course, count]) => (
                    <div key={course} className="space-y-1 text-xs">
                      <div className="flex justify-between items-center text-slate-700">
                        <span className="font-medium truncate max-w-[200px]">{course}</span>
                        <span className="font-bold font-mono">{count} ({getPercentage(count, stats.total)}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${getPercentage(count, stats.total)}%` }} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-4 text-center">No applications filed yet.</p>
                )}
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Users size={14} className="text-emerald-600" />
                <span>Applications by Student Admission Type</span>
              </h4>
              <div className="space-y-3.5">
                {Object.keys(stats.byStudentType).length > 0 ? (
                  Object.entries(stats.byStudentType).map(([type, count]) => (
                    <div key={type} className="space-y-1 text-xs">
                      <div className="flex justify-between items-center text-slate-700">
                        <span className="font-medium">{type}</span>
                        <span className="font-bold font-mono">{count} ({getPercentage(count, stats.total)}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600/70 rounded-full" style={{ width: `${getPercentage(count, stats.total)}%` }} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-4 text-center">No applications filed yet.</p>
                )}
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <MapPin size={14} className="text-emerald-600" />
                <span>Applications by Campus Choice</span>
              </h4>
              <div className="space-y-3.5">
                {["Pili", "Pasacao", "Calabanga", "Sipocot"].map((camp) => {
                  const count = statsByCampus[camp] || 0;
                  return (
                    <div key={camp} className="space-y-1 text-xs">
                      <div className="flex justify-between items-center text-slate-700">
                        <span className="font-medium">{camp} Campus</span>
                        <span className="font-bold font-mono">{count} ({getPercentage(count, stats.total)}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-700 rounded-full" style={{ width: `${getPercentage(count, stats.total)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Reject Application File</h3>
              <button
                onClick={() => setShowRejectModal(false)}
                disabled={isRejecting}
                className="p-1 text-slate-400 hover:text-slate-600 rounded disabled:opacity-50"
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
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold disabled:opacity-50"
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
        </div>
      )}
    </div>
  );
}
