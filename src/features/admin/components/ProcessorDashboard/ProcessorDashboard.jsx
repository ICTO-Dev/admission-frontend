import { useState, useEffect } from "react";
import { ApplicationStatus } from '../../../../config/types.js';
import {
  fetchStats,
  fetchApplications,
  updateApplicationStatus,
  scheduleApplication,
  fetchSlots,
  createSlot,
  deleteSlot,
  fetchDays,
  createDay,
  deleteDay,
  fetchBatches,
  createBatch,
  deleteBatch,
  fetchVenues,
  createVenue,
  deleteVenue,
  fetchRooms,
  createRoom,
  deleteRoom,
  resetDB
} from '../../../../services/mockDb.js';
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
  Plus,
  Trash2,
  MailCheck,
  Sparkles,
  Loader2,
  Printer,
  LogOut,
  Layers2,
  Box
} from "lucide-react";
import OfficialFormView from '../../../applicant/components/OfficialFormView.jsx';

export default function ProcessorDashboard({ onLogout }) {
  const [applications, setApplications] = useState([]);
  const [slots, setSlots] = useState([]);
  const [days, setDays] = useState([]);
  const [batches, setBatches] = useState([]);
  const [venues, setVenues] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [activeConfigTab, setActiveConfigTab] = useState("slots");
  const [daySchoolYear, setDaySchoolYear] = useState("2025-2026");
  const [dayName, setDayName] = useState("");
  const [batchName, setBatchName] = useState("");
  const [batchDays, setBatchDays] = useState([]);
  const [batchYear, setBatchYear] = useState("Present");
  const [batchSchoolYear, setBatchSchoolYear] = useState("2025-2026");
  const [venueName, setVenueName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomVenue, setRoomVenue] = useState("");
  const [roomTotalSeat, setRoomTotalSeat] = useState("30");
  const [roomStatus, setRoomStatus] = useState("Not Full");
  const [roomSchoolYear, setRoomSchoolYear] = useState("2025-2026");
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
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [newSlotDate, setNewSlotDate] = useState("2026-08-15");
  const [newSlotBatch, setNewSlotBatch] = useState("Batch 1: 8:00 AM - 10:00 AM");
  const [newSlotVenue, setNewSlotVenue] = useState("Main Campus - Pili");
  const [newSlotRoom, setNewSlotRoom] = useState("Room 302");
  const [newSlotCapacity, setNewSlotCapacity] = useState("30");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [scheduleCourseAdmitted, setScheduleCourseAdmitted] = useState("");
  const [scheduleSY, setScheduleSY] = useState("2026-2027");
  const [scheduleError, setScheduleError] = useState("");
  const [adminSubTab, setAdminSubTab] = useState("dashboard");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const appData = await fetchApplications();
      setApplications(appData);
      const slotsData = await fetchSlots();
      setSlots(slotsData);
      const statsData = await fetchStats();
      setStats(statsData);
      const daysData = await fetchDays();
      setDays(daysData);
      const batchesData = await fetchBatches();
      setBatches(batchesData);
      const venuesData = await fetchVenues();
      setVenues(venuesData);
      const roomsData = await fetchRooms();
      setRooms(roomsData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveForExam = async (appId) => {
    try {
      const updatedApp = await updateApplicationStatus(appId, ApplicationStatus.APPROVED_FOR_EXAM);
      setApplications(applications.map((a) => a.id === appId ? updatedApp : a));
      if (selectedApp?.id === appId) {
        setSelectedApp(updatedApp);
      }
      const statsData = await fetchStats();
      setStats(statsData);
    } catch (err) {
      alert("Error approving application");
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    try {
      const updatedApp = await updateApplicationStatus(selectedApp.id, ApplicationStatus.REJECTED, rejectionReason);
      setApplications(applications.map((a) => a.id === selectedApp.id ? updatedApp : a));
      setSelectedApp(updatedApp);
      setShowRejectModal(false);
      setRejectionReason("");
      const statsData = await fetchStats();
      setStats(statsData);
    } catch (err) {
      alert("Error rejecting application");
    }
  };

  const handleAssignSchedule = async (e) => {
    e.preventDefault();
    if (!selectedApp || !selectedSlotId) return;
    setScheduleError("");
    const chosenSlot = slots.find((s) => s.id === selectedSlotId);
    if (chosenSlot && chosenSlot.currentEnrolledCount >= chosenSlot.maxCapacity) {
      setScheduleError(`Automated Conflict Blocked: Room '${chosenSlot.room}' is fully booked for this batch. Select another slot.`);
      return;
    }
    try {
      const updatedApp = await scheduleApplication(selectedApp.id, {
        slotId: selectedSlotId,
        course: scheduleCourseAdmitted || selectedApp.courseApplied1st
      });
      setApplications(applications.map((a) => a.id === selectedApp.id ? updatedApp : a));
      setSelectedApp(updatedApp);
      setSelectedSlotId("");
      const slotsData = await fetchSlots();
      setSlots(slotsData);
      const statsData = await fetchStats();
      setStats(statsData);
    } catch (err) {
      setScheduleError(err.message || "Conflict checking caught an issue.");
    }
  };

  const handleAddSlotSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSlot({
        examDate: newSlotDate,
        batchTime: newSlotBatch,
        venue: newSlotVenue,
        room: newSlotRoom,
        maxCapacity: parseInt(newSlotCapacity)
      });
      const slotsData = await fetchSlots();
      setSlots(slotsData);
      setShowAddSlotModal(false);
    } catch (err) {
      alert("Error adding exam slot");
    }
  };

  const handleDeleteSlot = async (slotId) => {
    const slot = slots.find((s) => s.id === slotId);
    if (slot && slot.currentEnrolledCount > 0) {
      alert("Cannot delete a slot with students scheduled! Reschedule them first.");
      return;
    }
    if (!confirm("Are you sure you want to delete this examination slot?")) return;
    try {
      await deleteSlot(slotId);
      setSlots(slots.filter((s) => s.id !== slotId));
    } catch (err) {
      alert(err.message || "Error deleting slot");
    }
  };

  const handleAddDay = async (e) => {
    e.preventDefault();
    if (!dayName.trim()) {
      alert("Please provide a name or description for the day.");
      return;
    }
    try {
      const newDay = await createDay({
        schoolYear: daySchoolYear,
        dayName
      });
      setDays([...days, newDay]);
      setDayName("");
    } catch (err) {
      alert("Error adding day configuration");
    }
  };

  const handleDeleteDay = async (id) => {
    if (!confirm("Are you sure you want to delete this day config?")) return;
    try {
      await deleteDay(id);
      setDays(days.filter((d) => d.id !== id));
    } catch (err) {
      alert("Error deleting day");
    }
  };

  const handleAddBatch = async (e) => {
    e.preventDefault();
    if (!batchName.trim()) {
      alert("Please provide a batch name.");
      return;
    }
    if (batchDays.length === 0) {
      alert("Please select at least one day for this batch.");
      return;
    }
    try {
      const newBatch = await createBatch({
        batchName,
        days: batchDays,
        year: batchYear,
        schoolYear: batchSchoolYear
      });
      setBatches([...batches, newBatch]);
      setBatchName("");
      setBatchDays([]);
    } catch (err) {
      alert("Error adding batch configuration");
    }
  };

  const toggleBatchDaySelection = (dayNameSelected) => {
    if (batchDays.includes(dayNameSelected)) {
      setBatchDays(batchDays.filter((d) => d !== dayNameSelected));
    } else {
      setBatchDays([...batchDays, dayNameSelected]);
    }
  };

  const handleDeleteBatch = async (id) => {
    if (!confirm("Are you sure you want to delete this batch config?")) return;
    try {
      await deleteBatch(id);
      setBatches(batches.filter((b) => b.id !== id));
    } catch (err) {
      alert("Error deleting batch");
    }
  };

  const handleAddVenue = async (e) => {
    e.preventDefault();
    if (!venueName.trim()) {
      alert("Please provide a venue name.");
      return;
    }
    try {
      const newVenue = await createVenue({ venueName });
      setVenues([...venues, newVenue]);
      setVenueName("");
    } catch (err) {
      alert("Error adding venue configuration");
    }
  };

  const handleDeleteVenue = async (id) => {
    if (!confirm("Are you sure you want to delete this venue config?")) return;
    try {
      await deleteVenue(id);
      setVenues(venues.filter((v) => v.id !== id));
    } catch (err) {
      alert("Error deleting venue");
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) {
      alert("Please provide a room name.");
      return;
    }
    if (!roomVenue) {
      alert("Please select a venue for this room.");
      return;
    }
    try {
      const newRoom = await createRoom({
        roomName,
        venueName: roomVenue,
        totalSeat: parseInt(roomTotalSeat) || 30,
        status: roomStatus,
        schoolYear: roomSchoolYear
      });
      setRooms([...rooms, newRoom]);
      setRoomName("");
      setRoomTotalSeat("30");
    } catch (err) {
      alert("Error adding room configuration");
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!confirm("Are you sure you want to delete this room config?")) return;
    try {
      await deleteRoom(id);
      setRooms(rooms.filter((r) => r.id !== id));
    } catch (err) {
      alert("Error deleting room");
    }
  };

  const handleResetDB = async () => {
    if (!confirm("Reset database? This will revert all applications and slots back to seeds.")) return;
    setIsLoading(true);
    try {
      const newDb = await resetDB();
      setApplications(newDb.applications);
      setSlots(newDb.slots);
      setDays(newDb.days);
      setBatches(newDb.batches);
      setVenues(newDb.venues);
      setRooms(newDb.rooms);
      setSelectedApp(null);
      const statsData = await fetchStats();
      setStats(statsData);
    } catch (err) {
      alert("Database reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch = app.id.toLowerCase().includes(searchQuery.toLowerCase()) || `${app.firstName} ${app.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) || app.lrn.includes(searchQuery);
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

  const systemEmailsLog = applications.flatMap((app) => app.notificationsSent.map((n) => ({ ...n, applicantName: `${app.firstName} ${app.lastName}`, appId: app.id }))).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

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
          <button
            onClick={handleResetDB}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg hover:bg-rose-100 text-xs font-bold transition cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Re-seed System Data</span>
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
            onClick={() => setAdminSubTab("submissions")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition relative cursor-pointer ${adminSubTab === "submissions" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
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
            onClick={() => setAdminSubTab("slots")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${adminSubTab === "slots" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
          >
            <Calendar size={13} />
            <span>CBSUA Entrance Examination Slots Manager</span>
          </button>

          <button
            onClick={() => setAdminSubTab("emails")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition relative cursor-pointer ${adminSubTab === "emails" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
          >
            <MailCheck size={13} />
            <span>Email Inbox</span>
            {systemEmailsLog.length > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold leading-none text-slate-100 bg-slate-800 rounded ml-1 font-mono">
                {systemEmailsLog.length}
              </span>
            )}
          </button>
        </div>

        <div className="text-[10px] text-slate-400 font-mono text-right px-2 hidden xl:block">
          Workspace Focus: <span className="font-bold text-emerald-700 capitalize">{adminSubTab}</span>
        </div>
      </div>

      {adminSubTab === "dashboard" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-600"><Users size={16} /></div>
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

      {adminSubTab === "submissions" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start animate-fade-in">
          <div className={`${selectedApp ? "xl:col-span-7" : "xl:col-span-12"} bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300`}>
            <div className="p-5 border-b border-slate-100 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="text-sm font-bold text-slate-900 font-sans">Applicant Submissions Board</h3>
                
                <div className="flex bg-slate-100 rounded-lg p-0.5 text-[11px] font-bold text-slate-500 border border-slate-200">
                  {["All", "Pending", "Approved for Exam", "Scheduled", "Rejected"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setStatusFilter(tab)}
                      className={`px-3 py-1.5 rounded-md transition cursor-pointer ${statusFilter === tab ? "bg-white text-emerald-800 shadow-sm font-bold border border-slate-200/50" : "hover:text-slate-900"}`}
                    >
                      {tab === "Approved for Exam" ? "Approved" : tab === "Scheduled" ? "Scheduled" : tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search size={14} />
                </div>
                <input
                  type="text"
                  placeholder="Search by Applicant Name, App No., or LRN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                  <Loader2 size={24} className="animate-spin text-emerald-600" />
                  <span className="text-xs">Loading submissions...</span>
                </div>
              ) : filteredApps.length > 0 ? (
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
                    {filteredApps.map((app) => (
                      <tr
                        key={app.id}
                        onClick={() => {
                          setSelectedApp(app);
                          setScheduleError("");
                        }}
                        className={`hover:bg-slate-50/70 cursor-pointer transition ${selectedApp?.id === app.id ? "bg-emerald-50/30" : ""}`}
                      >
                        <td className="p-4 font-mono font-bold text-slate-900">{app.id}</td>
                        <td className="p-4">
                          <p className="font-bold text-slate-800">{app.lastName}, {app.firstName}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                            <span>LRN: {app.lrn}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-100">{app.campus || "Pili"}</span>
                          </p>
                        </td>
                        <td className="p-4 text-slate-500">{app.studentType}</td>
                        <td className="p-4 text-slate-600 max-w-[160px] truncate">{app.courseApplied1st}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-[10px] font-mono rounded ${app.status === ApplicationStatus.PENDING ? "bg-amber-50 text-amber-800 border border-amber-200" : app.status === ApplicationStatus.APPROVED_FOR_EXAM ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : app.status === ApplicationStatus.SCHEDULED ? "bg-sky-50 text-sky-800 border border-sky-200" : "bg-rose-50 text-rose-800 border border-rose-200"}`}>
                            {app.status === "Approved for Exam" ? "Approved" : app.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedApp(app);
                            }}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded transition cursor-pointer"
                          >
                            <Eye size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-12 text-center text-slate-400 italic">
                  No submissions match the search query or filters.
                </div>
              )}
            </div>
          </div>

          {selectedApp && (
            <div className="xl:col-span-5 space-y-6 animate-fade-in">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                <div className="p-5 flex gap-4 items-start bg-slate-50/50">
                  <div className="w-16 h-16 border border-slate-200 rounded bg-white overflow-hidden flex flex-col items-center justify-center shrink-0">
                    {selectedApp.photoUrl ? <img src={selectedApp.photoUrl} alt="Student bio" className="w-full h-full object-cover" /> : <span className="text-[8px] font-bold text-slate-300 text-center leading-tight">NO<br />PHOTO</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 font-mono">{selectedApp.id}</span>
                    <h4 className="text-base font-bold text-slate-900 truncate">{selectedApp.lastName}, {selectedApp.firstName} {selectedApp.middleName}</h4>
                    <p className="text-xs text-emerald-800 font-bold">{selectedApp.courseApplied1st}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Mobile: {selectedApp.mobileNumber} • {selectedApp.emailAddress}</p>
                  </div>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="p-1 text-slate-400 hover:text-slate-600 bg-white rounded border border-slate-200 shadow-sm cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="p-5 bg-white space-y-4">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Processor Actions</span>
                  
                  {selectedApp.status === ApplicationStatus.PENDING && (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleApproveForExam(selectedApp.id)}
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs shadow-sm transition cursor-pointer"
                      >
                        <Check size={14} />
                        <span>Approve For Exam</span>
                      </button>
                      <button
                        onClick={() => setShowRejectModal(true)}
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded font-bold text-xs border border-rose-200 transition cursor-pointer"
                      >
                        <X size={14} />
                        <span>Reject File</span>
                      </button>
                    </div>
                  )}

                  {(selectedApp.status === ApplicationStatus.APPROVED_FOR_EXAM || selectedApp.status === ApplicationStatus.SCHEDULED) && (
                    <div className="border border-emerald-100 rounded-xl p-4 bg-emerald-50/10 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                          <Sparkles size={12} />
                          <span>Examination Slot Allocator</span>
                        </span>
                      </div>

                      <form onSubmit={handleAssignSchedule} className="space-y-3">
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Select Available Schedule Slot</label>
                          <select
                            required
                            value={selectedSlotId}
                            onChange={(e) => setSelectedSlotId(e.target.value)}
                            className="w-full border border-emerald-200 bg-white rounded p-2 text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                          >
                            <option value="">-- Choose Exam Date & Room --</option>
                            {slots.map((s) => {
                              const isFull = s.currentEnrolledCount >= s.maxCapacity;
                              return (
                                <option
                                  key={s.id}
                                  value={s.id}
                                  disabled={isFull}
                                  className={isFull ? "text-rose-500 font-semibold" : ""}
                                >
                                  {s.examDate} | {s.batchTime} ({s.room} - {s.currentEnrolledCount}/{s.maxCapacity} full) {isFull ? "[FULL]" : ""}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        {scheduleError && (
                          <div className="p-2.5 bg-rose-50 text-[10px] text-rose-800 rounded border border-rose-200 flex items-start gap-1.5 font-semibold">
                            <AlertTriangle size={14} className="text-rose-600 shrink-0 mt-0.5" />
                            <span>{scheduleError}</span>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={!selectedSlotId}
                          className="w-full flex items-center justify-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs disabled:opacity-40 transition shadow-sm cursor-pointer"
                        >
                          <Calendar size={13} />
                          <span>Confirm & Send Exam Permit</span>
                        </button>
                      </form>
                    </div>
                  )}

                  <button
                    onClick={() => setShowFormPrint(selectedApp)}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded text-xs font-bold border border-slate-200 transition cursor-pointer"
                  >
                    <Printer size={13} />
                    <span>Open Printable ADM-FR-002 Document</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
