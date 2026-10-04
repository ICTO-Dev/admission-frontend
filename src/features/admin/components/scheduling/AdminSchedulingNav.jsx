import React from "react";
import { NavLink } from "react-router-dom";
import {
  Calendar,
  Layers,
  Building,
  Clock,
  MapPin,
  RefreshCw,
  CalendarCheck,
  Users,
  LayoutDashboard,
} from "lucide-react";
import {
  useAuth,
  useSchoolYears,
  useVenues,
  useRooms,
  useBatches,
  useExamSchedules,
} from "../../../../hooks/index.js";

export default function AdminSchedulingNav() {
  const { user } = useAuth();
  const campusId = user?.campus_id || 1;
  const campusName = user?.campus?.name || "Main Campus (Pili)";

  const { data: schoolYears = [], isLoading: loadingSY, refetch: refetchSY } = useSchoolYears();
  const { data: venues = [], isLoading: loadingVenues, refetch: refetchVenues } = useVenues({ campus_id: campusId, with_rooms: true });
  const { data: rooms = [], isLoading: loadingRooms, refetch: refetchRooms } = useRooms({ campus_id: campusId });
  const { data: batches = [], isLoading: loadingBatches, refetch: refetchBatches } = useBatches({ campus_id: campusId });
  const { data: schedules = [], isLoading: loadingSchedules, refetch: refetchSchedules } = useExamSchedules({ campus_id: campusId });

  const activeSchoolYear = schoolYears.find((sy) => sy.is_active) || schoolYears[0];
  const isRefreshing = loadingSY || loadingVenues || loadingRooms || loadingBatches || loadingSchedules;

  const handleRefreshAll = () => {
    refetchSY();
    refetchVenues();
    refetchRooms();
    refetchBatches();
    refetchSchedules();
  };

  const totalSeats = rooms.reduce((acc, r) => acc + (parseInt(r.total_seat) || 0), 0);

  const navTabClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
      isActive
        ? "bg-emerald-600 text-white shadow-sm"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
    }`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
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
            <CalendarCheck className="text-emerald-400" size={24} />
            Entrance Examination Schedule Control
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
            to="/admin/submissions"
            className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur transition cursor-pointer"
          >
            <Users size={13} />
            <span>Submissions</span>
          </NavLink>
          <button
            type="button"
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-xl text-xs font-semibold backdrop-blur transition cursor-pointer disabled:cursor-not-allowed"
            title="Refresh exam configurations"
          >
            <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} />
            <span>{isRefreshing ? "Syncing..." : "Sync"}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600">
            <Calendar size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Exam Slots</span>
            <span className="text-xl font-bold font-mono text-slate-900">{schedules.length}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl text-sky-600">
            <Layers size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Exam Batches</span>
            <span className="text-xl font-bold font-mono text-slate-900">{batches.length}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
            <Building size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Venues / Rooms</span>
            <span className="text-xl font-bold font-mono text-slate-900">{venues.length} / {rooms.length}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-600">
            <Users size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Seats Configured</span>
            <span className="text-xl font-bold font-mono text-slate-900">{totalSeats}</span>
          </div>
        </div>
      </div>

      {/* Route Navigation Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm flex flex-wrap gap-1">
        <NavLink to="/admin/schedules" className={navTabClass}>
          <Calendar size={14} />
          <span>Examination Schedules & Slots ({schedules.length})</span>
        </NavLink>

        <NavLink to="/admin/batches" className={navTabClass}>
          <Layers size={14} />
          <span>Batches ({batches.length})</span>
        </NavLink>

        <NavLink to="/admin/venues" className={navTabClass}>
          <Building size={14} />
          <span>Venues & Rooms ({venues.length})</span>
        </NavLink>

        <NavLink to="/admin/academic-years" className={navTabClass}>
          <Clock size={14} />
          <span>Academic Years ({schoolYears.length})</span>
        </NavLink>
      </div>
    </div>
  );
}
