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
  useAuth,
  useSchoolYears,
  useBatches,
  useCreateBatch,
  useUpdateBatch,
  useDeleteBatch,
} from "../../../../hooks/index.js";
import AdminSchedulingNav from "./AdminSchedulingNav.jsx";
import PaginationControl from "./PaginationControl.jsx";

export default function BatchPage() {
  const { user } = useAuth();
  const campusId = user?.campus_id || 1;

  const [batchPage, setBatchPage] = useState(1);
  const BATCHES_PER_PAGE = 8;

  const [showBatchModal, setShowBatchModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: schoolYears = [] } = useSchoolYears();
  const { data: batches = [], isLoading: loadingBatches } = useBatches({ campus_id: campusId });

  const createBatchMutation = useCreateBatch();
  const updateBatchMutation = useUpdateBatch();
  const deleteBatchMutation = useDeleteBatch();

  const paginatedBatches = batches.slice(
    (batchPage - 1) * BATCHES_PER_PAGE,
    batchPage * BATCHES_PER_PAGE
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <AdminSchedulingNav />

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Exam Batches</h3>
            <p className="text-xs text-slate-500">Groupings of admission examinees per academic period</p>
          </div>
          <button
            onClick={() => {
              setEditingBatch(null);
              setShowBatchModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Batch</span>
          </button>
        </div>

        {loadingBatches ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-2">
            <RefreshCw className="animate-spin text-emerald-600" size={24} />
            <span className="text-xs">Loading batches...</span>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200">
                <tr>
                  <th className="p-4">Batch Name</th>
                  <th className="p-4">School Year</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Scheduled Slots</th>
                  <th className="p-4">Created By</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {batches.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                      No batches created yet. Click &quot;Add Batch&quot; to configure one.
                    </td>
                  </tr>
                ) : (
                  paginatedBatches.map((batch) => (
                    <tr key={batch.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 font-bold text-slate-900">{batch.batch_name}</td>
                      <td className="p-4 font-mono text-slate-600">{batch.school_year?.name || "—"}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            batch.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {batch.status}
                        </span>
                      </td>
                      <td className="p-4 font-mono">{batch.exam_schedules_count ?? 0} slots</td>
                      <td className="p-4 text-slate-500">{batch.creator?.name || "System"}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingBatch(batch);
                              setShowBatchModal(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition cursor-pointer"
                            title="Edit batch"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            disabled={deletingId === `batch-${batch.id}`}
                            onClick={async () => {
                              if ((batch.exam_schedules_count || 0) > 0) {
                                alert("Cannot delete batch with existing exam slots!");
                                return;
                              }
                              if (confirm("Delete this batch?")) {
                                try {
                                  setDeletingId(`batch-${batch.id}`);
                                  await deleteBatchMutation.mutateAsync(batch.id);
                                } finally {
                                  setDeletingId(null);
                                }
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer disabled:opacity-50"
                            title="Delete batch"
                          >
                            {deletingId === `batch-${batch.id}` ? (
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

            {batches.length > BATCHES_PER_PAGE && (
              <div className="p-4 bg-slate-50 border-t border-slate-200">
                <PaginationControl
                  currentPage={batchPage}
                  totalItems={batches.length}
                  pageSize={BATCHES_PER_PAGE}
                  onPageChange={setBatchPage}
                  itemLabel="batches"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showBatchModal && (
        <BatchModal
          campusId={campusId}
          batch={editingBatch}
          schoolYears={schoolYears}
          onClose={() => setShowBatchModal(false)}
          onSubmit={async (formData) => {
            if (editingBatch) {
              await updateBatchMutation.mutateAsync({ id: editingBatch.id, data: formData });
            } else {
              await createBatchMutation.mutateAsync(formData);
            }
          }}
        />
      )}
    </div>
  );
}

function BatchModal({ campusId, batch, schoolYears, onClose, onSubmit }) {
  const [batchName, setBatchName] = useState(batch?.batch_name || "");
  const [schoolYearId, setSchoolYearId] = useState(
    batch?.school_year_id || schoolYears.find((sy) => sy.is_active)?.id || schoolYears[0]?.id || ""
  );
  const [status, setStatus] = useState(batch?.status || "Active");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      await onSubmit({
        campus_id: campusId,
        batch_name: batchName,
        school_year_id: Number(schoolYearId),
        status,
      });
      onClose();
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message || err?.message || "Failed to save batch."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-scale-in">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-sm font-bold text-slate-900">{batch ? "Edit Batch" : "Add Exam Batch"}</h3>
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
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Batch Name</label>
            <input
              type="text"
              required
              disabled={isSubmitting}
              placeholder="e.g. Batch 1"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">School Year</label>
            <select
              required
              disabled={isSubmitting}
              value={schoolYearId}
              onChange={(e) => setSchoolYearId(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
            >
              {schoolYears.map((sy) => (
                <option key={sy.id} value={sy.id}>
                  {sy.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Status</label>
            <select
              disabled={isSubmitting}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
            >
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>
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
              <span>{isSubmitting ? "Saving..." : "Save Batch"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
