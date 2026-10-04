import React, { useState } from "react";
import {
  Building,
  DoorOpen,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  X,
  ChevronRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  useAuth,
  useVenues,
  useCreateVenue,
  useUpdateVenue,
  useDeleteVenue,
  useRooms,
  useCreateRoom,
  useUpdateRoom,
  useDeleteRoom,
} from "../../../../hooks/index.js";
import AdminSchedulingNav from "./AdminSchedulingNav.jsx";
import PaginationControl from "./PaginationControl.jsx";

export default function VenueRoomPage() {
  const { user } = useAuth();
  const campusId = user?.campus_id || 1;

  const [venuePage, setVenuePage] = useState(1);
  const VENUES_PER_PAGE = 10;
  const [collapsedVenueIds, setCollapsedVenueIds] = useState([]);

  // Modal states
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);

  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [selectedVenueForRoom, setSelectedVenueForRoom] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  // Data queries
  const { data: venues = [], isLoading: loadingVenues } = useVenues({ campus_id: campusId, with_rooms: true });
  const { data: rooms = [], isLoading: loadingRooms } = useRooms({ campus_id: campusId });

  // Mutations
  const createVenueMutation = useCreateVenue();
  const updateVenueMutation = useUpdateVenue();
  const deleteVenueMutation = useDeleteVenue();

  const createRoomMutation = useCreateRoom();
  const updateRoomMutation = useUpdateRoom();
  const deleteRoomMutation = useDeleteRoom();

  const toggleVenueCollapse = (id) => {
    setCollapsedVenueIds((prev) =>
      prev.includes(id) ? prev.filter((vId) => vId !== id) : [...prev, id]
    );
  };

  const paginatedVenues = venues.slice(
    (venuePage - 1) * VENUES_PER_PAGE,
    venuePage * VENUES_PER_PAGE
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <AdminSchedulingNav />

      <div className="space-y-4">
        {/* Header Controls */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Campus Venues & Testing Rooms</h3>
            <p className="text-xs text-slate-500">Buildings, laboratories, and classrooms for examination</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedVenueForRoom(venues[0] || null);
                setEditingRoom(null);
                setShowRoomModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
              title="Add a new testing room"
            >
              <Plus size={13} className="text-emerald-600" />
              <span>Add Room</span>
            </button>
            <button
              onClick={() => {
                setEditingVenue(null);
                setShowVenueModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Venue / Building</span>
            </button>
          </div>
        </div>

        {/* Venues Table */}
        {loadingVenues || loadingRooms ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-2">
            <RefreshCw className="animate-spin text-emerald-600" size={24} />
            <span className="text-xs">Loading venues and testing rooms...</span>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="p-4 w-10"></th>
                    <th className="p-4">Venue / Building</th>
                    <th className="p-4">Rooms</th>
                    <th className="p-4">Total Seating Capacity</th>
                    <th className="p-4">Staff</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {venues.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                        No venues registered yet. Click &quot;Add Venue / Building&quot; to get started.
                      </td>
                    </tr>
                  ) : (
                    paginatedVenues.map((venue) => {
                      const venueRooms = rooms.filter((r) => r.venue_id === venue.id);
                      const totalSeats = venueRooms.reduce((sum, r) => sum + (parseInt(r.total_seat) || 0), 0);
                      const isCollapsed = collapsedVenueIds.includes(venue.id);

                      return (
                        <React.Fragment key={venue.id}>
                          <tr
                            className="hover:bg-slate-50 transition cursor-pointer select-none"
                            onClick={() => toggleVenueCollapse(venue.id)}
                          >
                            <td className="p-4 text-slate-400 text-center">
                              <ChevronRight
                                size={14}
                                className={`transition-transform duration-200 ${
                                  !isCollapsed ? "rotate-90 text-emerald-600" : ""
                                }`}
                              />
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <Building size={14} className="text-emerald-600 shrink-0" />
                                <span>{venue.venue_name}</span>
                              </div>
                              {venue.description && (
                                <div className="text-[11px] text-slate-400 mt-0.5">
                                  {venue.description}
                                </div>
                              )}
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 font-mono">
                                {venueRooms.length} {venueRooms.length === 1 ? "room" : "rooms"}
                              </span>
                            </td>
                            <td className="p-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                              {totalSeats} seats
                            </td>
                            <td className="p-4 text-slate-500 text-[11px] whitespace-nowrap">
                              {venue.creator?.name || "System"}
                            </td>
                            <td className="p-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => {
                                    setSelectedVenueForRoom(venue);
                                    setEditingRoom(null);
                                    setShowRoomModal(true);
                                  }}
                                  className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[11px] font-bold transition cursor-pointer mr-1"
                                  title="Add Room to this Venue"
                                >
                                  <Plus size={12} />
                                  <span>Add Room</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingVenue(venue);
                                    setShowVenueModal(true);
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition cursor-pointer"
                                  title="Edit Venue"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  disabled={deletingId === `venue-${venue.id}`}
                                  onClick={async () => {
                                    if (venueRooms.length > 0) {
                                      alert("Cannot delete venue that has rooms!");
                                      return;
                                    }
                                    if (confirm("Delete this venue?")) {
                                      try {
                                        setDeletingId(`venue-${venue.id}`);
                                        await deleteVenueMutation.mutateAsync(venue.id);
                                      } finally {
                                        setDeletingId(null);
                                      }
                                    }
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer disabled:opacity-50"
                                  title="Delete Venue"
                                >
                                  {deletingId === `venue-${venue.id}` ? (
                                    <Loader2 size={13} className="animate-spin text-rose-600" />
                                  ) : (
                                    <Trash2 size={13} />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Nested Rooms Sub-Table when expanded */}
                          {!isCollapsed && (
                            <tr className="bg-slate-50/70">
                              <td colSpan={6} className="p-3 pl-10 pr-4">
                                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
                                  <div className="px-3 py-2 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                                      <DoorOpen size={12} className="text-emerald-600" />
                                      <span>Rooms in {venue.venue_name} ({venueRooms.length})</span>
                                    </span>
                                    <button
                                      onClick={() => {
                                        setSelectedVenueForRoom(venue);
                                        setEditingRoom(null);
                                        setShowRoomModal(true);
                                      }}
                                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                                    >
                                      <Plus size={11} />
                                      <span>Add Room</span>
                                    </button>
                                  </div>

                                  {venueRooms.length === 0 ? (
                                    <div className="p-4 text-center text-slate-400 italic text-xs">
                                      No testing rooms registered in this venue yet. Click &quot;Add Room&quot; to create one.
                                    </div>
                                  ) : (
                                    <table className="w-full text-xs text-left">
                                      <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                                        <tr>
                                          <th className="px-3 py-2">Room Name</th>
                                          <th className="px-3 py-2">Capacity</th>
                                          <th className="px-3 py-2">Status</th>
                                          <th className="px-3 py-2 text-right">Actions</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100">
                                        {venueRooms.map((room) => (
                                          <tr key={room.id} className="hover:bg-slate-50/80">
                                            <td className="px-3 py-2 font-medium text-slate-800 flex items-center gap-1.5">
                                              <DoorOpen size={12} className="text-slate-400" />
                                              <span>{room.room_name}</span>
                                            </td>
                                            <td className="px-3 py-2 font-mono font-bold text-slate-700">
                                              {room.total_seat} seats
                                            </td>
                                            <td className="px-3 py-2">
                                              <span
                                                className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                                  room.status === "Available"
                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                    : "bg-slate-100 text-slate-600"
                                                }`}
                                              >
                                                {room.status}
                                              </span>
                                            </td>
                                            <td className="px-3 py-2 text-right">
                                              <div className="flex items-center justify-end gap-1">
                                                <button
                                                  onClick={() => {
                                                    setSelectedVenueForRoom(venue);
                                                    setEditingRoom(room);
                                                    setShowRoomModal(true);
                                                  }}
                                                  className="p-1 text-slate-400 hover:text-emerald-700 rounded transition cursor-pointer"
                                                  title="Edit Room"
                                                >
                                                  <Edit2 size={12} />
                                                </button>
                                                <button
                                                  disabled={deletingId === `room-${room.id}`}
                                                  onClick={async () => {
                                                    if ((room.exam_schedules_count || 0) > 0) {
                                                      alert("Cannot delete room with existing scheduled exams!");
                                                      return;
                                                    }
                                                    if (confirm("Delete this room?")) {
                                                      try {
                                                        setDeletingId(`room-${room.id}`);
                                                        await deleteRoomMutation.mutateAsync(room.id);
                                                      } finally {
                                                        setDeletingId(null);
                                                      }
                                                    }
                                                  }}
                                                  className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer disabled:opacity-50"
                                                  title="Delete Room"
                                                >
                                                  {deletingId === `room-${room.id}` ? (
                                                    <Loader2 size={12} className="animate-spin text-rose-600" />
                                                  ) : (
                                                    <Trash2 size={12} />
                                                  )}
                                                </button>
                                              </div>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {venues.length > VENUES_PER_PAGE && (
              <div className="p-4 bg-slate-50 border-t border-slate-200">
                <PaginationControl
                  currentPage={venuePage}
                  totalItems={venues.length}
                  pageSize={VENUES_PER_PAGE}
                  onPageChange={setVenuePage}
                  itemLabel="venues"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Venue Modal */}
      {showVenueModal && (
        <VenueModal
          campusId={campusId}
          venue={editingVenue}
          onClose={() => setShowVenueModal(false)}
          onSubmit={async (formData) => {
            if (editingVenue) {
              await updateVenueMutation.mutateAsync({ id: editingVenue.id, data: formData });
            } else {
              await createVenueMutation.mutateAsync(formData);
            }
          }}
        />
      )}

      {/* Room Modal */}
      {showRoomModal && (
        <RoomModal
          room={editingRoom}
          venue={selectedVenueForRoom}
          venues={venues}
          onClose={() => setShowRoomModal(false)}
          onSubmit={async (formData) => {
            if (editingRoom) {
              await updateRoomMutation.mutateAsync({ id: editingRoom.id, data: formData });
            } else {
              await createRoomMutation.mutateAsync(formData);
            }
          }}
        />
      )}
    </div>
  );
}

function VenueModal({ campusId, venue, onClose, onSubmit }) {
  const [venueName, setVenueName] = useState(venue?.venue_name || "");
  const [description, setDescription] = useState(venue?.description || "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      await onSubmit({
        campus_id: campusId,
        venue_name: venueName,
        description,
      });
      onClose();
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message || err?.message || "Failed to save venue."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-scale-in">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-sm font-bold text-slate-900">{venue ? "Edit Venue" : "Add Venue / Building"}</h3>
          <button onClick={onClose} disabled={isSubmitting} className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {errorMessage && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-start gap-1.5">
            <AlertCircle size={14} className="shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Venue / Building Name</label>
            <input
              type="text"
              required
              disabled={isSubmitting}
              placeholder="e.g. IT Building / Library"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description / Location</label>
            <textarea
              rows={2}
              disabled={isSubmitting}
              placeholder="e.g. 2nd Floor Near Registrar"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-bold shadow flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 className="animate-spin" size={13} />}
              <span>{isSubmitting ? "Saving..." : "Save Venue"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RoomModal({ room, venue, venues, onClose, onSubmit }) {
  const [venueId, setVenueId] = useState(room?.venue_id || venue?.id || venues[0]?.id || "");
  const [roomName, setRoomName] = useState(room?.room_name || "");
  const [totalSeat, setTotalSeat] = useState(room?.total_seat || 30);
  const [status, setStatus] = useState(room?.status || "Available");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      await onSubmit({
        venue_id: Number(venueId),
        room_name: roomName,
        total_seat: Number(totalSeat),
        status,
      });
      onClose();
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message || err?.message || "Failed to save room."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-scale-in">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-sm font-bold text-slate-900">{room ? "Edit Testing Room" : "Add Testing Room"}</h3>
          <button onClick={onClose} disabled={isSubmitting} className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {errorMessage && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-start gap-1.5">
            <AlertCircle size={14} className="shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Venue / Building</label>
            <select
              required
              disabled={isSubmitting}
              value={venueId}
              onChange={(e) => setVenueId(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
            >
              {venues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.venue_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Room Name / Number</label>
            <input
              type="text"
              required
              disabled={isSubmitting}
              placeholder="e.g. Room 101, Computer Lab 2"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Seating Capacity</label>
              <input
                type="number"
                min="1"
                required
                disabled={isSubmitting}
                value={totalSeat}
                onChange={(e) => setTotalSeat(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Status</label>
              <select
                disabled={isSubmitting}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
              >
                <option value="Available">Available</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-bold shadow flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 className="animate-spin" size={13} />}
              <span>{isSubmitting ? "Saving..." : "Save Room"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
