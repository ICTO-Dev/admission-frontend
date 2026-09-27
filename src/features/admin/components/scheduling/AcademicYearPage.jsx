import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  useSchoolYears,
  useCreateSchoolYear,
  useUpdateSchoolYear,
  useDeleteSchoolYear,
} from "../../../../hooks/index.js";
import AdminSchedulingNav from "./AdminSchedulingNav.jsx";

export default function AcademicYearPage() {
  const [showSchoolYearModal, setShowSchoolYearModal] = useState(false);
  const [editingSchoolYear, setEditingSchoolYear] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: schoolYears = [], isLoading: loadingSY } = useSchoolYears();

  const createSYMutation = useCreateSchoolYear();
  const updateSYMutation = useUpdateSchoolYear();
  const deleteSYMutation = useDeleteSchoolYear();

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <AdminSchedulingNav />

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Academic School Years</h3>
            <p className="text-xs text-slate-500">Configure academic years and set active admission cycle</p>
          </div>
          <button
            onClick={() => {
              setEditingSchoolYear(null);
              setShowSchoolYearModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <Plus size={14} />
            <span>Add School Year</span>
          </button>
        </div>

        {loadingSY ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-2">
            <RefreshCw className="animate-spin text-emerald-600" size={24} />
            <span className="text-xs">Loading academic years...</span>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200">
                <tr>
                  <th className="p-4">Academic Year</th>
                  <th className="p-4">Active Cycle</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Batches</th>
                  <th className="p-4">Created By</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {schoolYears.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                      No academic years configured yet. Click &quot;Add School Year&quot; to create one.
                    </td>
                  </tr>
                ) : (
                  schoolYears.map((sy) => (
                    <tr key={sy.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 font-bold font-mono text-slate-900">{sy.name}</td>
                      <td className="p-4">
                        {sy.is_active ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Active Current
                          </span>
                        ) : (
                          <button
                            disabled={deletingId === `sy-active-${sy.id}`}
                            onClick={async () => {
                              try {
                                setDeletingId(`sy-active-${sy.id}`);
                                await updateSYMutation.mutateAsync({ id: sy.id, data: { is_active: true } });
                              } finally {
                                setDeletingId(null);
                              }
                            }}
                            className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition cursor-pointer disabled:opacity-50"
                          >
                            {deletingId === `sy-active-${sy.id}` ? "Activating..." : "Set as Active"}
                          </button>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {sy.status}
                        </span>
                      </td>
                      <td className="p-4 font-mono">{sy.batches_count ?? 0} batches</td>
                      <td className="p-4 text-slate-500">{sy.creator?.name || "System"}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingSchoolYear(sy);
                              setShowSchoolYearModal(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition cursor-pointer"
                            title="Edit school year"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            disabled={deletingId === `sy-${sy.id}`}
                            onClick={async () => {
                              if ((sy.batches_count || 0) > 0 || (sy.exam_schedules_count || 0) > 0) {
                                alert("Cannot delete school year with existing batches or schedules!");
                                return;
                              }
                              if (confirm("Delete this school year?")) {
                                try {
                                  setDeletingId(`sy-${sy.id}`);
                                  await deleteSYMutation.mutateAsync(sy.id);
                                } finally {
                                  setDeletingId(null);
                                }
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer disabled:opacity-50"
                            title="Delete school year"
                          >
                            {deletingId === `sy-${sy.id}` ? (
                              <Loader2 size={13} className="animate-spin text-rose-600" />
                            ) : (
                              <Trash2 size={13} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showSchoolYearModal && (
        <SchoolYearModal
          schoolYear={editingSchoolYear}
          onClose={() => setShowSchoolYearModal(false)}
          onSubmit={async (formData) => {
            if (editingSchoolYear) {
              await updateSYMutation.mutateAsync({ id: editingSchoolYear.id, data: formData });
            } else {
              await createSYMutation.mutateAsync(formData);
            }
          }}
        />
      )}
    </div>
  );
}

function SchoolYearModal({ schoolYear, onClose, onSubmit }) {
  const [name, setName] = useState(schoolYear?.name || "2026-2027");
  const [isActive, setIsActive] = useState(schoolYear ? schoolYear.is_active : true);
  const [status, setStatus] = useState(schoolYear?.status || "Open");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      await onSubmit({
        name,
        is_active: isActive,
        status,
      });
      onClose();
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message || err?.message || "Failed to save school year."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-scale-in">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-sm font-bold text-slate-900">{schoolYear ? "Edit School Year" : "Add School Year"}</h3>
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
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Academic Year</label>
            <input
              type="text"
              required
              disabled={isSubmitting}
              placeholder="e.g. 2026-2027"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_active_checkbox"
              disabled={isSubmitting}
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 disabled:opacity-50 cursor-pointer"
            />
            <label htmlFor="is_active_checkbox" className="text-slate-700 font-semibold cursor-pointer select-none">
              Set as current active school year
            </label>
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
              <span>{isSubmitting ? "Saving..." : "Save School Year"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
