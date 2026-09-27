import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Printer,
  Check,
  AlertTriangle,
  Loader2,
  GraduationCap,
  User,
  Users,
  Heart,
  Home,
  BookOpen,
  Calendar,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  AlertCircle,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { ApplicationStatus } from "../../../../config/types.js";

export default function ApplicantEvaluationModal({
  application,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onAssignSchedule,
  onOpenPrint,
  slots = [],
  isApproving = false,
  isRejecting = false,
  isAssigning = false,
}) {
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'personal' | 'education' | 'family' | 'siblings' | 'health'
  // Slot allocation state
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [scheduleCourseAdmitted, setScheduleCourseAdmitted] = useState("");
  const [scheduleError, setScheduleError] = useState("");
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);

  // Lock body scroll when modal is active & reset allocation states
  useEffect(() => {
    if (isOpen) {
      setShowRescheduleForm(false);
      setSelectedSlotId("");
      setScheduleError("");
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, application?.id]);

  if (!isOpen || !application) return null;

  const app = application;
  const father = app.fatherProfile || {};
  const mother = app.motherProfile || {};
  const spouse = app.spouseProfile || {};
  const elem = app.elementary || {};
  const jhs = app.juniorHigh || {};
  const shs = app.seniorHigh || {};
  const college = app.college || {};
  const emergency = app.emergencyContact || {};
  const siblings = Array.isArray(app.siblings) ? app.siblings : [];

  const isPending = app.status === ApplicationStatus.PENDING;
  const isApproved =
    app.status === ApplicationStatus.APPROVED_FOR_EXAM ||
    app.status === "Approved";
  const isScheduled = app.status === ApplicationStatus.SCHEDULED;
  const isRejected = app.status === ApplicationStatus.REJECTED;

  const handleApproveClick = () => {
    onApprove(app.id || app.applicationNo);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlotId || isAssigning) return;
    setScheduleError("");

    const chosenSlot = slots.find((s) => String(s.id) === String(selectedSlotId));
    const enrolled =
      chosenSlot?.applications_count ??
      chosenSlot?.currentEnrolledCount ??
      chosenSlot?.total_applicants ??
      0;
    const totalSeats =
      chosenSlot?.total_seats ??
      chosenSlot?.room?.total_seat ??
      chosenSlot?.max_capacity ??
      30;

    if (chosenSlot && (enrolled >= totalSeats || chosenSlot.status === "Full")) {
      setScheduleError(
        `Automated Conflict Blocked: Room '${
          chosenSlot.room?.room_name || chosenSlot.room || "Room"
        }' is at full capacity (${enrolled}/${totalSeats} seats). No more applicants can be assigned to this schedule.`
      );
      return;
    }

    try {
      await onAssignSchedule(app.id || app.applicationNo, {
        slotId: selectedSlotId,
        course: scheduleCourseAdmitted || app.courseApplied1st,
      });
      onClose();
    } catch (err) {
      setScheduleError(err?.message || "Failed to assign examination slot.");
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto relative shrink-0">
        
        {/* ======================================================== */}
        {/* MODAL HEADER: APPLICANT HERO BANNER                     */}
        {/* ======================================================== */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-900/40 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white border-2 border-emerald-400/40 overflow-hidden flex flex-col items-center justify-center shrink-0 shadow-md">
              {app.photoUrl ? (
                <img src={app.photoUrl} alt="Applicant 2x2" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[9px] font-bold text-slate-400 text-center leading-tight">
                  NO<br />PHOTO
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {app.id || app.applicationNo}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white">
                  LRN: {app.lrn || "N/A"}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isPending
                      ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                      : isApproved
                      ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/40"
                      : "bg-rose-400/20 text-rose-300 border border-rose-400/40"
                  }`}
                >
                  {app.status === "Approved for Exam" ? "Approved" : app.status}
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-black tracking-tight text-white mt-1">
                {app.lastName}, {app.firstName} {app.middleName || ""}
              </h3>
              <p className="text-xs text-emerald-300 font-medium flex items-center gap-2 mt-0.5 flex-wrap">
                <span>1st Choice: <strong className="text-white">{app.courseApplied1st}</strong></span>
                <span className="text-slate-400">•</span>
                <span>Campus: <strong className="text-white">{typeof app.campus === "string" ? app.campus : (app.campus?.name || "Pili")}</strong></span>
                <span className="text-slate-400">•</span>
                <span>Type: <strong className="text-white">{app.studentType}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={() => onOpenPrint(app)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition border border-white/20 cursor-pointer shadow-xs"
            >
              <Printer size={14} />
              <span>Print Form (ADM-FR-002)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition cursor-pointer"
              title="Close Evaluator"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* NAVIGATION TABS FOR APPLICANT SECTIONS                   */}
        {/* ======================================================== */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-200 bg-slate-50 overflow-x-auto text-xs">
          {[
            { id: "all", label: "Overview & All Sections", icon: BookOpen },
            { id: "personal", label: "1. Personal Details", icon: User },
            { id: "education", label: "2. Educations & GWA", icon: GraduationCap },
            { id: "family", label: "3. Family Profiles", icon: Home },
            { id: "siblings", label: `4. Siblings (${siblings.length})`, icon: Users },
            { id: "health", label: "5. Health & Emergency", icon: Heart },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 py-2.5 px-3 font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? "border-emerald-600 text-emerald-800 bg-white rounded-t-lg shadow-2xs"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* SCROLLABLE DOSSIER CONTENT                               */}
        {/* ======================================================== */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/50">

          {/* SECTION 1: PERSONAL DETAILS */}
          {(activeTab === "all" || activeTab === "personal") && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200 flex items-center gap-2">
                <User size={15} className="text-emerald-700" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  1. Complete Personal & Civil Information
                </h4>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Full Legal Name</span>
                  <span className="font-bold text-slate-900">{app.lastName}, {app.firstName} {app.middleName || ""}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Learner Reference No. (LRN)</span>
                  <span className="font-mono font-bold text-emerald-800">{app.lrn || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Date of Birth & Age</span>
                  <span className="font-semibold text-slate-800">
                    {app.dateOfBirth ? String(app.dateOfBirth).slice(0, 10) : "N/A"} ({app.age || "N/A"} years old)
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Sex & Civil Status</span>
                  <span className="font-semibold text-slate-800">{app.sex || "N/A"} • {app.civilStatus || "Single"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Place of Birth</span>
                  <span className="font-medium text-slate-800">{app.placeOfBirth || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Religion & Nationality</span>
                  <span className="font-medium text-slate-800">{app.religion || "Roman Catholic"} • {app.nationality || "Filipino"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Mobile Number</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <Phone size={11} className="text-slate-400" />
                    <span>{app.mobileNumber || "N/A"}</span>
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Email Address</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 truncate">
                    <Mail size={11} className="text-slate-400 shrink-0" />
                    <span className="truncate">{app.emailAddress || "N/A"}</span>
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Present Residential Address</span>
                  <span className="font-medium text-slate-800">{app.presentAddress || "N/A"}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Permanent Residential Address</span>
                  <span className="font-medium text-slate-800">{app.permanentAddress || "Same as present address"}</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Indigenous Group:</span>
                  <span className="font-bold text-slate-800">
                    {app.isIndigenous ? app.indigenousGroup || "Yes" : "No"}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Solo Parent Dependent:</span>
                  <span className="font-bold text-slate-800">{app.isSoloParent ? "Yes" : "No"}</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between sm:col-span-2">
                  <span className="text-slate-500 font-medium">Program Choices:</span>
                  <span className="font-bold text-slate-800 truncate">
                    1st: {app.courseApplied1st} {app.courseApplied2nd ? `| 2nd: ${app.courseApplied2nd}` : ""}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: EDUCATIONAL BACKGROUND & GRADES */}
          {(activeTab === "all" || activeTab === "education") && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap size={15} className="text-emerald-700" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                    2. Educational Background & Academic Qualifications
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded">
                  Evaluation Priority
                </span>
              </div>

              <div className="p-4 space-y-4 text-xs">
                {/* Highlighted GWA Grade Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block">Grade 11 General Average</span>
                    <span className="text-2xl font-black font-mono text-emerald-950 mt-1 block">
                      {shs.gwaG11 ? `${shs.gwaG11}%` : "Not Stated"}
                    </span>
                    <span className="text-[10px] text-emerald-600 mt-0.5 block">Official Form 138 Record</span>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block">Grade 12 General Average</span>
                    <span className="text-2xl font-black font-mono text-emerald-950 mt-1 block">
                      {shs.gwaG12 ? `${shs.gwaG12}%` : "Not Stated"}
                    </span>
                    <span className="text-[10px] text-emerald-600 mt-0.5 block">Certificate of Grades / Current Average</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Senior High Track & Strand</span>
                      <span className="font-bold text-slate-800 text-sm mt-0.5 block">{shs.trackStrand || "General Strand"}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">Applied to: {app.courseApplied1st}</span>
                  </div>
                </div>

                {/* Senior High School Card */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Senior High School (SHS) Name</span>
                    <span className="font-bold text-slate-900 text-sm">{shs.schoolName || "N/A"}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">{shs.address || "Address not provided"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Graduation Year / Awards</span>
                    <span className="font-semibold text-slate-800 block">Year: {shs.yearGraduated || "2025/2026"}</span>
                    <span className="font-semibold text-emerald-700 block mt-0.5">{shs.awardsHonors ? `Honors: ${shs.awardsHonors}` : "No Honors Listed"}</span>
                  </div>
                </div>

                {/* Junior High & Elementary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Junior High School (JHS)</span>
                    <p className="font-bold text-slate-800 mt-0.5">{jhs.schoolName || "N/A"}</p>
                    <p className="text-[11px] text-slate-500">{jhs.address || "Address N/A"}</p>
                    <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between text-[11px]">
                      <span>Graduated: <strong>{jhs.yearGraduated || "N/A"}</strong></span>
                      <span>Honors: <strong>{jhs.awardsHonors || "None"}</strong></span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Elementary School</span>
                    <p className="font-bold text-slate-800 mt-0.5">{elem.schoolName || "N/A"}</p>
                    <p className="text-[11px] text-slate-500">{elem.address || "Address N/A"}</p>
                    <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between text-[11px]">
                      <span>Graduated: <strong>{elem.yearGraduated || "N/A"}</strong></span>
                      <span>Honors: <strong>{elem.awardsHonors || "None"}</strong></span>
                    </div>
                  </div>
                </div>

                {/* College (If Transferee / Second Courser) */}
                {college.schoolName && (
                  <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl">
                    <span className="text-[10px] font-bold text-blue-900 uppercase block">Tertiary / College Record (For Transferees)</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                      <div>
                        <span className="text-slate-500">School:</span> <strong>{college.schoolName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Course:</span> <strong>{college.course || "N/A"}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">College GWA:</span> <strong>{college.gwa || "N/A"}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Socio-Academic Indicators */}
                <div className="p-3 bg-slate-100/70 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">First-Gen College Student:</span>
                    <span className="font-bold text-slate-900">{app.firstGenerationStudent ? "Yes (1st in Family)" : "No"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">College Grads in Family:</span>
                    <span className="font-bold text-slate-900">{app.familyCollegeGraduatesCount || "0"} members</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Future Career Outlook:</span>
                    <span className="font-medium text-slate-800 italic truncate block">{app.futureOutlook || "Not specified"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: FAMILY PROFILES & SOCIO-ECONOMIC */}
          {(activeTab === "all" || activeTab === "family") && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200 flex items-center gap-2">
                <Home size={15} className="text-emerald-700" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  3. Family Background & Socio-Economic Profiles
                </h4>
              </div>

              <div className="p-4 space-y-4 text-xs">
                {/* Parents Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Father Profile */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                      <span className="font-bold text-xs text-slate-800 uppercase">Father's Profile</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${father.livingStatus === "Deceased" ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"}`}>
                        {father.livingStatus || "Living"}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <p><span className="text-slate-400">Full Name:</span> <strong className="text-slate-900">{father.fullName || "N/A"}</strong></p>
                      <p><span className="text-slate-400">Age & Birthplace:</span> <span className="font-medium">{father.age ? `${father.age} y/o` : "N/A"} • {father.birthplace || "N/A"}</span></p>
                      <p><span className="text-slate-400">Attainment:</span> <span className="font-medium">{father.educationalAttainment || "N/A"}</span></p>
                      <p><span className="text-slate-400">Occupation:</span> <strong className="text-slate-800">{father.occupation || "N/A"}</strong> ({father.placeOfWork || "Workplace N/A"})</p>
                      <p><span className="text-slate-400">Contact Number:</span> <strong className="text-slate-800">{father.contactNumber || "N/A"}</strong></p>
                      <p><span className="text-slate-400">Living with Family:</span> <span className="font-medium">{father.livingWithFamily || "Yes"}</span></p>
                      {father.causeOfDeath && <p><span className="text-rose-500">Cause of Death:</span> <strong className="text-rose-800">{father.causeOfDeath}</strong></p>}
                    </div>
                  </div>

                  {/* Mother Profile */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                      <span className="font-bold text-xs text-slate-800 uppercase">Mother's Profile</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${mother.livingStatus === "Deceased" ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"}`}>
                        {mother.livingStatus || "Living"}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <p><span className="text-slate-400">Full Name:</span> <strong className="text-slate-900">{mother.fullName || "N/A"}</strong></p>
                      <p><span className="text-slate-400">Age & Birthplace:</span> <span className="font-medium">{mother.age ? `${mother.age} y/o` : "N/A"} • {mother.birthplace || "N/A"}</span></p>
                      <p><span className="text-slate-400">Attainment:</span> <span className="font-medium">{mother.educationalAttainment || "N/A"}</span></p>
                      <p><span className="text-slate-400">Occupation:</span> <strong className="text-slate-800">{mother.occupation || "N/A"}</strong> ({mother.placeOfWork || "Workplace N/A"})</p>
                      <p><span className="text-slate-400">Contact Number:</span> <strong className="text-slate-800">{mother.contactNumber || "N/A"}</strong></p>
                      <p><span className="text-slate-400">Living with Family:</span> <span className="font-medium">{mother.livingWithFamily || "Yes"}</span></p>
                      {mother.causeOfDeath && <p><span className="text-rose-500">Cause of Death:</span> <strong className="text-rose-800">{mother.causeOfDeath}</strong></p>}
                    </div>
                  </div>
                </div>

                {/* Spouse Profile (If Married / With Spouse) */}
                {spouse.fullName && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <span className="font-bold text-xs text-slate-800 uppercase block">Spouse Profile</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <p><span className="text-slate-400">Spouse Name:</span> <strong>{spouse.fullName}</strong></p>
                      <p><span className="text-slate-400">Occupation:</span> <strong>{spouse.occupation || "N/A"}</strong></p>
                      <p><span className="text-slate-400">Dependents:</span> <strong>{app.numberOfDependents || "0"}</strong></p>
                    </div>
                  </div>
                )}

                {/* Socio-Economic Living Indicators */}
                <div className="p-3.5 bg-slate-100/70 border border-slate-200 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Family Monthly Income</span>
                    <span className="font-bold text-emerald-900">{app.familyMonthlyIncome || "Not Stated"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Housing Condition</span>
                    <span className="font-bold text-slate-800">{app.housingCondition || "Owned"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Birth Order</span>
                    <span className="font-bold text-slate-800">{app.birthOrder || app.birthOrderOther || "Middle"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Languages Spoken</span>
                    <span className="font-bold text-slate-800 truncate block">{app.languageSpoken || "Bikol, Tagalog, English"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: SIBLINGS ROSTER */}
          {(activeTab === "all" || activeTab === "siblings") && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={15} className="text-emerald-700" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                    4. Siblings Roster ({siblings.length} Total Listed)
                  </h4>
                </div>
              </div>

              <div className="p-4">
                {siblings.length > 0 ? (
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">#</th>
                          <th className="p-2.5">Sibling Full Name</th>
                          <th className="p-2.5">Age</th>
                          <th className="p-2.5">Sex</th>
                          <th className="p-2.5">Civil Status</th>
                          <th className="p-2.5">Educational Attainment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {siblings.map((sib, idx) => (
                          <tr key={sib.id || idx} className="hover:bg-slate-50">
                            <td className="p-2.5 font-bold font-mono text-slate-400">{idx + 1}</td>
                            <td className="p-2.5 font-bold text-slate-900">{sib.name}</td>
                            <td className="p-2.5 font-medium">{sib.age ? `${sib.age} y/o` : "N/A"}</td>
                            <td className="p-2.5 font-medium">{sib.sex || "N/A"}</td>
                            <td className="p-2.5 font-medium">{sib.civilStatus || "Single"}</td>
                            <td className="p-2.5 font-semibold text-emerald-800">{sib.educationalAttainment || "N/A"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-6 text-center text-slate-400 italic text-xs border border-dashed border-slate-200 rounded-xl">
                    No siblings listed (Only child or applicant declared no siblings).
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 5: HEALTH & EMERGENCY DETAILS */}
          {(activeTab === "all" || activeTab === "health") && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200 flex items-center gap-2">
                <Heart size={15} className="text-emerald-700" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  5. Health, Special Needs & Emergency Contact Person
                </h4>
              </div>

              <div className="p-4 space-y-4 text-xs">
                {/* Emergency Contact Person (Important) */}
                <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl">
                  <span className="text-[10px] font-bold text-amber-900 uppercase block mb-1">
                    Designated Emergency Contact Person (In Case of Accidents / Emergency)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs text-amber-950 mt-1">
                    <div>
                      <span className="text-[10px] text-amber-800 block">Contact Full Name</span>
                      <strong className="text-sm">{emergency.name || "N/A"}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-800 block">Relationship</span>
                      <strong>{emergency.relation || "Parent / Guardian"}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-800 block">Mobile / Contact No.</span>
                      <strong className="font-mono text-emerald-900">{emergency.contactNo || app.mobileNumber || "N/A"}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-800 block">Contact Address</span>
                      <span className="truncate block font-medium">{emergency.address || app.presentAddress || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Health & Special Needs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Person With Disability (PWD) Status</span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      {app.pwdStatus ? "Yes (PWD Registered)" : "No (Non-PWD)"}
                    </span>
                    {app.pwdSpecs && (
                      <p className="text-[11px] text-emerald-800 font-semibold mt-1">
                        Specification: {app.pwdSpecs}
                      </p>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Recent Hospitalization / Chronic Condition</span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      {app.hospitalizedStatus ? "Yes (Has Medical History)" : "No"}
                    </span>
                    {app.hospitalizedReasons && (
                      <p className="text-[11px] text-rose-700 font-semibold mt-1">
                        Condition: {app.hospitalizedReasons}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}



          {/* REJECTION REASON DISPLAY IF REJECTED */}
          {isRejected && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-xs">
              <span className="font-bold text-rose-900 block text-xs">Official Rejection Reason / Deficiency:</span>
              <p className="text-rose-800 italic">
                {app.rejectionReason || app.rejection_reason || "Incomplete requirements / non-compliant credentials."}
              </p>
            </div>
          )}

          {/* CONFIRMED SCHEDULE SUMMARY IF ALREADY SCHEDULED */}
          {isScheduled && !showRescheduleForm && (
            <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sky-200/80 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-sky-600 text-white rounded-xl shadow-xs">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 block">
                      Confirmed Examination Schedule
                    </span>
                    <h5 className="text-xs sm:text-sm font-bold text-sky-950">
                      Applicant is Officially Scheduled for Entrance Exam
                    </h5>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-sky-200/80 text-sky-900 border border-sky-300">
                    Slot Assigned
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowRescheduleForm(true)}
                    className="px-2.5 py-1 text-[11px] font-semibold text-sky-700 hover:text-sky-900 bg-white hover:bg-sky-100 rounded-lg border border-sky-200 transition cursor-pointer shadow-2xs"
                  >
                    Change Slot
                  </button>
                </div>
              </div>

              {/* Schedule Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-sky-100 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Exam Date</span>
                  <span className="font-bold text-slate-800 text-xs">
                    {app.examSchedule?.exam_date || "Assigned"}
                  </span>
                  {app.examSchedule?.day_label && (
                    <span className="text-[10px] text-sky-600 block mt-0.5">{app.examSchedule.day_label}</span>
                  )}
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-sky-100 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Time Slot</span>
                  <span className="font-bold text-slate-800 text-xs">
                    {app.examSchedule?.start_time
                      ? `${app.examSchedule.start_time.slice(0, 5)} - ${app.examSchedule.end_time?.slice(0, 5)}`
                      : "Assigned Time"}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-sky-100 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Testing Room</span>
                  <span className="font-bold text-slate-800 text-xs">
                    {app.examSchedule?.room || "Assigned Room"}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-sky-100 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Testing Venue</span>
                  <span className="font-bold text-slate-800 text-xs truncate block">
                    {typeof app.campus === "string" ? app.campus : (app.campus?.name || "Campus Center")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* EXAM SLOT ALLOCATOR: For Approved Applicants (not yet scheduled) OR when Admin chooses to Change Slot */}
          {(isApproved || (isScheduled && showRescheduleForm)) && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} className="text-emerald-700" />
                  <span>
                    {isScheduled ? "Re-allocate Examination Slot" : "Examination Room & Schedule Slot Allocator"}
                  </span>
                </span>
                {isScheduled && (
                  <button
                    type="button"
                    onClick={() => setShowRescheduleForm(false)}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  >
                    Cancel Re-allocation
                  </button>
                )}
              </div>

              <form onSubmit={handleAssignSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Select Available Examination Slot
                  </label>
                  <select
                    required
                    disabled={isAssigning}
                    value={selectedSlotId}
                    onChange={(e) => setSelectedSlotId(e.target.value)}
                    className="w-full border border-emerald-300 bg-white rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none disabled:opacity-50"
                  >
                    <option value="">-- Choose Exam Date & Room --</option>
                    {slots.map((s) => {
                      const enrolled =
                        s.applications_count ?? s.currentEnrolledCount ?? s.total_applicants ?? 0;
                      const totalSeats = s.total_seats ?? s.room?.total_seat ?? s.max_capacity ?? 30;
                      const isFull = enrolled >= totalSeats || s.status === "Full";
                      const date = s.exam_date || s.examDate;
                      const time = s.start_time
                        ? `${s.start_time.slice(0, 5)} - ${s.end_time?.slice(0, 5)}`
                        : s.batchTime;
                      const roomName = s.room?.room_name || s.room || "Room";
                      const venueName = s.room?.venue?.venue_name ? ` (${s.room.venue.venue_name})` : "";
                      return (
                        <option
                          key={s.id}
                          value={s.id}
                          disabled={isFull}
                          className={isFull ? "text-rose-500 font-semibold" : ""}
                        >
                          {date} | {time} [{roomName}
                          {venueName}] ({enrolled}/{totalSeats} seats){" "}
                          {isFull ? "[FULL - NO SEATS]" : `(${totalSeats - enrolled} available seats)`}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {scheduleError && (
                  <div className="p-2.5 bg-rose-50 text-rose-800 rounded-lg border border-rose-200 flex items-start gap-1.5 font-semibold text-xs">
                    <AlertTriangle size={14} className="text-rose-600 shrink-0 mt-0.5" />
                    <span>{scheduleError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!selectedSlotId || isAssigning}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs transition shadow-sm cursor-pointer disabled:cursor-not-allowed"
                >
                  {isAssigning ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>{isScheduled ? "Updating Schedule..." : "Allocating & Sending Permit..."}</span>
                    </>
                  ) : (
                    <>
                      <Calendar size={13} />
                      <span>{isScheduled ? "Confirm & Update Schedule" : "Confirm & Send Examination Permit"}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* EVALUATION DECISION ACTIONS FOOTER                       */}
        {/* ======================================================== */}
        <div className="p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onOpenPrint(app)}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 border border-slate-200"
          >
            <Printer size={14} />
            <span>Open Printable ADM-FR-002 Document</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2.5 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition cursor-pointer"
            >
              Close
            </button>

            {isPending && (
              <>
                <button
                  type="button"
                  onClick={() => onReject(app)}
                  disabled={isApproving || isRejecting}
                  className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-xs border border-rose-200 transition cursor-pointer disabled:opacity-50"
                >
                  Reject File
                </button>
                <button
                  type="button"
                  onClick={handleApproveClick}
                  disabled={isApproving || isRejecting}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30"
                >
                  {isApproving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Approving Application...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>Approve For Exam</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
