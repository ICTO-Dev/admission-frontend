import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  Calendar,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Search,
  X,
  DoorOpen,
  AlertCircle,
  Loader2,
  Lock,
} from "lucide-react";
import {
  useAuth,
  useSchoolYears,
  useBatches,
  useVenues,
  useRooms,
  useExamSchedules,
  useCreateExamSchedule,
  useUpdateExamSchedule,
  useDeleteExamSchedule,
} from "../../../../hooks/index.js";
import AdminSchedulingNav from "./AdminSchedulingNav.jsx";
import PaginationControl from "./PaginationControl.jsx";

export default function ExamSchedulePage() {
  const { user } = useAuth();
  const campusId = user?.campus_id || 1;

  // Filter states
  const [filterBatch, setFilterBatch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [schedulePage, setSchedulePage] = useState(1);
  const SCHEDULES_PER_PAGE = 10;

  // Modal states
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Queries
  const { data: schoolYears = [] } = useSchoolYears();
  const { data: batches = [] } = useBatches({ campus_id: campusId });
  const { data: venues = [] } = useVenues({ campus_id: campusId, with_rooms: true });
  const { data: rooms = [] } = useRooms({ campus_id: campusId });
  const {
    data: schedules = [],
    isLoading: loadingSchedules,
  } = useExamSchedules({
    campus_id: campusId,
    batch_id: filterBatch || undefined,
    status: filterStatus !== "All" ? filterStatus : undefined,
  });

  // Mutations
  const createScheduleMutation = useCreateExamSchedule();
  const updateScheduleMutation = useUpdateExamSchedule();
  const deleteScheduleMutation = useDeleteExamSchedule();

  // Search filter
  const filteredSchedules = schedules.filter((s) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const roomName = s.room?.room_name?.toLowerCase() || "";
    const venueName = s.room?.venue?.venue_name?.toLowerCase() || "";
    const batchName = s.batch?.batch_name?.toLowerCase() || "";
    const dayLabel = s.day_label?.toLowerCase() || "";
    return (
      roomName.includes(term) ||
      venueName.includes(term) ||
      batchName.includes(term) ||
      dayLabel.includes(term)
    );
  });

  const paginatedSchedules = filteredSchedules.slice(
    (schedulePage - 1) * SCHEDULES_PER_PAGE,
    schedulePage * SCHEDULES_PER_PAGE
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <AdminSchedulingNav />

      <div className="space-y-4">
        {/* Controls & Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search venue, room, batch..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSchedulePage(1);
                }}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <select
              value={filterBatch}
              onChange={(e) => {
                setFilterBatch(e.target.value);
                setSchedulePage(1);
              }}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">All Batches</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.batch_name}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setSchedulePage(1);
              }}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Full">Full</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <button
            onClick={() => {
              setEditingSchedule(null);
              setShowScheduleModal(true);
            }}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition cursor-pointer"
          >
            <Plus size={14} />
            <span>Create Schedule Slot</span>
          </button>
        </div>

        {/* Schedule List or Table */}
        {loadingSchedules ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-2">
            <RefreshCw className="animate-spin text-emerald-600" size={24} />
            <span className="text-xs">Loading exam schedules...</span>
          </div>
        ) : schedules.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Calendar size={22} />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No Exam Schedule Slots Found</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No slots have been configured yet for this campus. Click the button below to start creating examination time slots.
            </p>
            <button
              onClick={() => {
                setEditingSchedule(null);
                setShowScheduleModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <Plus size={14} />
              <span>Create First Schedule Slot</span>
            </button>
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200 text-xs text-slate-500">
            No schedules match your search & filter criteria.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Batch</th>
                    <th className="p-4">Venue & Room</th>
                    <th className="p-4">Capacity / Slots</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Staff</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {paginatedSchedules.map((schedule) => {
                    const roomTotalSeats = schedule.total_seats ?? schedule.room?.total_seat ?? schedule.max_capacity ?? 30;
                    const enrolled = schedule.applications_count ?? schedule.total_applicants ?? 0;
                    const isFull = enrolled >= roomTotalSeats || schedule.status === "Full";
                    const percentFilled = Math.min(100, Math.round((enrolled / (roomTotalSeats || 1)) * 100));

                    return (
                      <tr key={schedule.id} className="hover:bg-slate-50 transition">
                        <td className="p-4">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <Calendar size={13} className="text-emerald-600" />
                            <span>{schedule.exam_date}</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 ml-1">
                              {schedule.day_label || "Day 1"}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 font-mono">
                            <span>{schedule.start_time?.slice(0, 5)} - {schedule.end_time?.slice(0, 5)}</span>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="font-bold text-slate-800 flex items-center gap-1">
                            <span className="text-emerald-700">≈</span>
                            <span>{schedule.batch?.batch_name || `Batch #${schedule.batch_id}`}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {schedule.school_year?.name || "A.Y."}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <DoorOpen size={13} className="text-slate-400" />
                            <span>{schedule.room?.room_name || `Room #${schedule.room_id}`}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <span>{schedule.room?.venue?.venue_name || "Campus Venue"}</span>
                          </div>
                        </td>

                        <td className="p-4 whitespace-nowrap min-w-[160px]">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-mono font-bold text-slate-800">
                              {enrolled} <span className="text-slate-400 font-normal">/ {roomTotalSeats} seats</span>
                            </span>
                            <span className={`text-[10px] font-mono font-bold ${isFull ? "text-rose-600" : "text-slate-400"}`}>
                              {percentFilled}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isFull ? "bg-rose-500" : percentFilled > 75 ? "bg-amber-500" : "bg-emerald-500"
                              }`}
                              style={{ width: `${percentFilled}%` }}
                            />
                          </div>
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              isFull
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : schedule.status === "Open"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : schedule.status === "Cancelled"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {isFull && schedule.status === "Open" ? "FULL" : schedule.status}
                          </span>
                        </td>

                        <td className="p-4 text-slate-500 text-[11px]">
                          {schedule.creator?.name || "System Admin"}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {enrolled > 0 ? (
                              <span
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 cursor-not-allowed select-none shadow-2xs"
                                title={`Locked: Cannot edit or delete this schedule because ${enrolled} applicant(s) are already assigned to this slot.`}
                              >
                                <Lock size={11} className="text-amber-600" />
                                <span>Locked</span>
                              </span>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingSchedule(schedule);
                                    setShowScheduleModal(true);
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition cursor-pointer"
                                  title="Edit schedule slot"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  type="button"
                                  disabled={deletingId === `schedule-${schedule.id}`}
                                  onClick={async () => {
                                    if (confirm("Are you sure you want to delete this exam schedule?")) {
                                      try {
                                        setDeletingId(`schedule-${schedule.id}`);
                                        await deleteScheduleMutation.mutateAsync(schedule.id);
                                      } catch (err) {
                                        alert(err?.response?.data?.message || err?.message || "Failed to delete schedule.");
                                      } finally {
                                        setDeletingId(null);
                                      }
                                    }
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer disabled:opacity-50"
                                  title="Delete schedule slot"
                                >
                                  {deletingId === `schedule-${schedule.id}` ? (
                                    <Loader2 size={13} className="animate-spin text-rose-600" />
                                  ) : (
                                    <Trash2 size={13} />
                                  )}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <PaginationControl
                currentPage={schedulePage}
                totalItems={filteredSchedules.length}
                pageSize={SCHEDULES_PER_PAGE}
                onPageChange={setSchedulePage}
                itemLabel="schedule slots"
              />
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showScheduleModal && (
        <ScheduleSlotModal
          campusId={campusId}
          schedule={editingSchedule}
          schoolYears={schoolYears}
          batches={batches}
          venues={venues}
          rooms={rooms}
          onClose={() => setShowScheduleModal(false)}
          onSubmit={async (formData) => {
            if (editingSchedule) {
              await updateScheduleMutation.mutateAsync({ id: editingSchedule.id, data: formData });
            } else {
              await createScheduleMutation.mutateAsync(formData);
            }
          }}
        />
      )}
    </div>
  );
}

function ScheduleSlotModal({ campusId, schedule, schoolYears, batches, venues, rooms, onClose, onSubmit }) {
  const [schoolYearId, setSchoolYearId] = useState(
    schedule?.school_year_id || schoolYears.find((sy) => sy.is_active)?.id || schoolYears[0]?.id || ""
  );
  const [batchId, setBatchId] = useState(schedule?.batch_id || batches[0]?.id || "");
  const [venueId, setVenueId] = useState(schedule?.room?.venue_id || venues[0]?.id || "");
  const [roomId, setRoomId] = useState(schedule?.room_id || "");
  const [dayLabel, setDayLabel] = useState(schedule?.day_label || "Day 1");
  const [examDate, setExamDate] = useState(schedule?.exam_date || "");
  const [startTime, setStartTime] = useState(schedule?.start_time?.slice(0, 5) || "08:00");
  const [endTime, setEndTime] = useState(schedule?.end_time?.slice(0, 5) || "10:00");
  const [status, setStatus] = useState(schedule?.status || "Open");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const availableRooms = rooms.filter((r) => !venueId || r.venue_id === Number(venueId));
  const selectedRoom = rooms.find((r) => r.id === Number(roomId)) || schedule?.room;
  const roomSeats = selectedRoom?.total_seat || schedule?.room?.total_seat || schedule?.total_seats || schedule?.max_capacity || 30;
  const currentApplicants = schedule?.applications_count ?? schedule?.total_applicants ?? 0;
  const isFull = currentApplicants >= roomSeats;

  const handleVenueChange = (newVenueId) => {
    setVenueId(newVenueId);
    const firstRoom = rooms.find((r) => r.venue_id === Number(newVenueId));
    if (firstRoom) {
      setRoomId(firstRoom.id);
    } else {
      setRoomId("");
    }
  };

  const enrolledApplicants = schedule?.applications_count ?? schedule?.total_applicants ?? 0;
  const isScheduleLocked = Boolean(schedule && enrolledApplicants > 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isScheduleLocked) {
      setErrorMessage(`Cannot modify this schedule because ${enrolledApplicants} applicant(s) are already assigned to it.`);
      return;
    }
    if (!roomId) {
      setErrorMessage("Please select a testing room.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const finalStatus = (isFull && status === "Open") ? "Full" : status;
      await onSubmit({
        campus_id: campusId,
        school_year_id: Number(schoolYearId),
        batch_id: Number(batchId),
        room_id: Number(roomId),
        day_label: dayLabel,
        exam_date: examDate,
        start_time: startTime,
        end_time: endTime,
        max_capacity: Number(roomSeats),
        status: finalStatus,
      });
      onClose();
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message || err?.message || "Failed to save examination schedule slot."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-scale-in">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">
            {schedule ? "Edit Examination Schedule Slot" : "Create New Schedule Slot"}
          </h3>
          <button onClick={onClose} disabled={isSubmitting} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X size={16} />
          </button>
        </div>

        {isScheduleLocked && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs flex items-start gap-2">
            <Lock size={15} className="shrink-0 mt-0.5 text-amber-700" />
            <span>
              <strong>Schedule Slot Locked:</strong> This examination slot cannot be edited or modified because <strong>{enrolledApplicants} applicant(s)</strong> are currently scheduled for this slot.
            </span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-start gap-2">
            <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Academic Year</label>
              <select
                required
                disabled={isSubmitting}
                value={schoolYearId}
                onChange={(e) => setSchoolYearId(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold disabled:opacity-50"
              >
                {schoolYears.map((sy) => (
                  <option key={sy.id} value={sy.id}>
                    {sy.name} {sy.is_active ? "(Active)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Exam Batch</label>
              <select
                required
                disabled={isSubmitting}
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold disabled:opacity-50"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.batch_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Venue / Building</label>
              <select
                required
                disabled={isSubmitting}
                value={venueId}
                onChange={(e) => handleVenueChange(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
              >
                <option value="">Select Venue</option>
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.venue_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Assigned Room</label>
              <select
                required
                disabled={isSubmitting}
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
              >
                <option value="">Select Room</option>
                {availableRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.room_name} ({r.total_seat} seats)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Exam Date</label>
              <input
                type="date"
                required
                disabled={isSubmitting}
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Start Time</label>
              <input
                type="time"
                required
                disabled={isSubmitting}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">End Time</label>
              <input
                type="time"
                required
                disabled={isSubmitting}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Day Label (e.g. Day 1)</label>
              <input
                type="text"
                placeholder="Day 1"
                disabled={isSubmitting}
                value={dayLabel}
                onChange={(e) => setDayLabel(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Slot Status</label>
              <select
                disabled={isSubmitting}
                value={isFull && status === "Open" ? "Full" : status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 font-semibold"
              >
                <option value="Open" disabled={isFull}>
                  Open {isFull ? "(Full Capacity)" : ""}
                </option>
                <option value="Full">Full</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Automatic Room Capacity & Applicant Seating Status */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100/70 text-emerald-800 rounded-lg">
                  <DoorOpen size={16} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Room Seating Capacity (Auto-Inherited)
                  </span>
                  <span className="font-bold text-slate-800 text-xs">
                    {selectedRoom ? (
                      <>
                        <strong className="text-emerald-700 font-mono text-sm">{roomSeats}</strong> seats in {selectedRoom.room_name}
                      </>
                    ) : (
                      <span className="text-slate-400 italic">Please select an assigned room</span>
                    )}
                  </span>
                </div>
              </div>

              {schedule && (
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Total Applicants Assigned
                  </span>
                  <span className={`font-mono font-bold text-xs ${isFull ? "text-rose-600" : "text-emerald-700"}`}>
                    {currentApplicants} / {roomSeats} {isFull ? "[FULL - NO SEATS]" : `(${roomSeats - currentApplicants} left)`}
                  </span>
                </div>
              )}
            </div>

            {isFull && (
              <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-[11px] flex items-center gap-1.5 font-semibold">
                <AlertCircle size={14} className="shrink-0 text-rose-600" />
                <span>This schedule is at FULL capacity because assigned applicants ({currentApplicants}) have reached the total room seats ({roomSeats}). No more applicants can be assigned.</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isScheduleLocked}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-bold shadow transition flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 className="animate-spin" size={14} />}
              <span>{isSubmitting ? "Saving..." : schedule ? "Save Changes" : "Create Slot"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
