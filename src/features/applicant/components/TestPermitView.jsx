import React from "react";
import { Printer, X } from "lucide-react";

export default function TestPermitView({ application, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  const formattedDOB = application.dateOfBirth
    ? new Date(application.dateOfBirth).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const getExamTime = (batchTime) => {
    if (!batchTime) return "";
    const parts = batchTime.split(":");
    if (parts.length > 1) {
      return parts.slice(1).join(":").trim();
    }
    return batchTime;
  };

  const seatNo = (parseInt((application.id || "").replace(/\D/g, "")) || 0) % 30 + 1;

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 print:bg-white print:p-0">
      <div className="max-w-3xl mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded border border-slate-200 shadow-sm print:hidden">
        <div>
          <h2 className="text-sm font-bold text-slate-900 font-sans">CBSUA - College Admission Test (CAT) Permit</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Download or print your official entrance examination ticket</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded font-bold text-xs hover:bg-emerald-700 transition shadow-sm cursor-pointer"
          >
            <Printer size={15} />
            <span>Print Permit</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded font-bold text-xs hover:bg-slate-200 transition border border-slate-200 cursor-pointer"
            >
              <X size={15} />
              <span>Close</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-[760px] mx-auto bg-white p-8 border border-slate-300 shadow-sm font-sans text-xs text-slate-900 print:border-0 print:p-0 print:shadow-none">
        
        <div className="flex justify-between items-start border-b border-slate-300 pb-4 mb-4">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-full border-2 border-emerald-600 flex flex-col items-center justify-center bg-emerald-50 text-center relative overflow-hidden shrink-0">
              <span className="font-extrabold text-[10px] text-emerald-800 leading-none">CBSUA</span>
              <span className="text-[6px] text-amber-600 font-bold uppercase tracking-tighter">1918</span>
              <div className="absolute inset-1 rounded-full border border-dashed border-emerald-400 pointer-events-none"></div>
            </div>

            <div>
              <p className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">Republic of the Philippines</p>
              <h1 className="text-sm font-black text-emerald-800 tracking-tight leading-tight uppercase">Central Bicol State University of Agriculture</h1>
              <p className="text-[9px] text-gray-500 font-medium">San Jose, Pili, Camarines Sur 4418</p>
              <p className="text-[9px] text-gray-500">
                Website: <span className="underline">www.cbsua.edu.ph</span> | Email: <span className="underline">admission.pili@cbsua.edu.ph</span>
              </p>
              <p className="text-[9px] text-gray-500 font-mono">Trunkline: (054) 871-5531 to 33 Local 178</p>
            </div>
          </div>

          <div className="border border-slate-400 p-1.5 rounded text-center w-24 text-[8px] flex flex-col items-center shrink-0">
            <span className="font-black text-emerald-700 block text-[7px] tracking-widest">ISO 9001</span>
            <span className="text-gray-500 block leading-tight">CERTIFIED</span>
            <span className="font-semibold block text-slate-400 text-[6px]">LEVEL IV</span>
          </div>
        </div>

        <div className="border border-black">
          <div className="grid grid-cols-12 divide-x divide-black border-b border-black">
            <div className="col-span-8 p-3 bg-slate-50/50 flex items-center">
              <span className="font-black text-xs uppercase tracking-wide font-sans text-slate-800">
                CBSUA - COLLEGE ADMISSION TEST (CAT) PERMIT
              </span>
            </div>
            <div className="col-span-4 p-3 bg-slate-50/20 flex flex-col justify-center">
              <span className="text-[8px] font-extrabold uppercase text-gray-500">APPLICATION NO.</span>
              <span className="font-mono font-black text-sm text-blue-900 tracking-wide mt-0.5">
                {application.id}
              </span>
            </div>
          </div>

          <div className="flex divide-x divide-black">
            <div className="flex-1 divide-y divide-black">
              <div className="p-2.5">
                <span className="text-[8px] font-extrabold uppercase text-gray-500 block tracking-wider">PRINTED NAME (last, First, MI)</span>
                <span className="text-xs font-black text-slate-900 uppercase tracking-wide mt-1 block">
                  {application.lastName}, {application.firstName} {application.middleName || ""}
                </span>
              </div>

              <div className="grid grid-cols-12 divide-x divide-black">
                <div className="col-span-5 p-2.5">
                  <span className="text-[8px] font-extrabold uppercase text-gray-500 block tracking-wider">DATE OF BIRTH</span>
                  <span className="text-xs font-bold text-slate-800 uppercase mt-0.5 block">{formattedDOB}</span>
                </div>
                <div className="col-span-2 p-2.5">
                  <span className="text-[8px] font-extrabold uppercase text-gray-500 block tracking-wider">AGE</span>
                  <span className="text-xs font-bold text-slate-800 uppercase mt-0.5 block">{application.age}</span>
                </div>
                <div className="col-span-5 p-2.5">
                  <span className="text-[8px] font-extrabold uppercase text-gray-500 block tracking-wider">Contact No.</span>
                  <span className="text-xs font-mono font-bold text-slate-800 mt-0.5 block">{application.mobileNumber}</span>
                </div>
              </div>

              <div className="p-2.5">
                <span className="text-[8px] font-extrabold uppercase text-gray-500 block tracking-wider">ADDRESS</span>
                <span className="text-xs font-bold text-slate-800 uppercase mt-0.5 block">
                  {application.presentAddress}
                </span>
              </div>

              <div className="p-1.5 bg-slate-100/70 border-b border-black font-extrabold text-[9px] uppercase text-slate-800 tracking-wider">
                TEST SCHEDULE:
              </div>

              <div className="p-2.5">
                <span className="text-[8px] font-extrabold uppercase text-gray-500 block tracking-wider">VENUE</span>
                <span className="text-xs font-black text-emerald-800 uppercase mt-0.5 block">
                  {application.examAssignment?.venue || "Main Campus - Pili"}
                </span>
              </div>

              <div className="p-2.5">
                <span className="text-[8px] font-extrabold uppercase text-gray-500 block tracking-wider">ROOM & SEAT#</span>
                <span className="text-xs font-black text-slate-900 uppercase mt-0.5 block">
                  {application.examAssignment?.room || "Classroom 1"} / Seat #{seatNo}
                </span>
              </div>
            </div>

            <div className="w-[180px] p-3 flex flex-col items-center justify-center bg-slate-50/20 text-center relative shrink-0">
              {application.photoUrl ? (
                <div className="w-full h-full min-h-[160px] border border-slate-300 flex items-center justify-center overflow-hidden bg-white">
                  <img
                    src={application.photoUrl}
                    alt="Applicant biometric photo"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="w-full h-full min-h-[160px] border border-dashed border-slate-300 bg-white flex flex-col items-center justify-center p-2">
                  <div className="w-12 h-12 border border-slate-200 text-slate-300 text-xs font-bold flex items-center justify-center bg-slate-50 mb-2">
                    2X2
                  </div>
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-wide leading-tight">PASTE 1.5 X 1.5 PHOTO HERE</span>
                  <span className="text-[6px] text-slate-400 mt-1 leading-snug">White background with Applicant Name Tag</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-12 divide-x divide-black border-t border-black">
            <div className="col-span-4 p-2.5">
              <span className="text-[8px] font-extrabold uppercase text-gray-500 block tracking-wider">DATE OF TEST</span>
              <span className="text-xs font-black text-slate-900 mt-0.5 block">
                {application.examAssignment?.examDate
                  ? new Date(application.examAssignment.examDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric"
                    })
                  : "N/A"
                }
              </span>
            </div>
            <div className="col-span-3 p-2.5">
              <span className="text-[8px] font-extrabold uppercase text-gray-500 block tracking-wider">TIME</span>
              <span className="text-xs font-black text-slate-900 mt-0.5 block">
                {getExamTime(application.examAssignment?.batchTime || "")}
              </span>
            </div>
            <div className="col-span-5 p-2.5">
              <span className="text-[8px] font-extrabold uppercase text-gray-500 block tracking-wider">BATCH</span>
              <span className="text-xs font-black text-slate-900 mt-0.5 block">
                {application.examAssignment?.batchTime || "N/A"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-12 divide-x divide-black border-t border-black h-20">
            <div className="col-span-6 p-2.5 flex flex-col justify-between">
              <span className="text-[8px] font-extrabold uppercase text-slate-500 tracking-wider">Admission Officer:</span>
              <div className="border-b border-slate-300 w-11/12 pb-0.5">
                <span className="text-[9px] font-black text-slate-400 tracking-widest block">CBSUA ADMISSIONS</span>
              </div>
            </div>
            <div className="col-span-6 p-2.5 flex flex-col justify-between">
              <span className="text-[8px] font-extrabold uppercase text-slate-500 tracking-wider">Applicant Signature</span>
              <div className="border-b border-slate-300 w-11/12 pb-0.5">
                <span className="text-[9px] font-black text-slate-400 tracking-widest block">SIGNATURE REQUIRED</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-[9px] text-slate-600 leading-relaxed space-y-1">
          <p className="italic text-slate-500 font-medium">This is a system generated print-out.</p>
          <p>
            <strong>NOTE:</strong> Late examinees will not be allowed to take the test. Please come 30 minutes before your scheduled time.
          </p>
        </div>

        <div className="border-t border-slate-300 mt-12 pt-2.5 flex justify-between text-[8px] font-mono font-semibold text-slate-400">
          <span>ADM-FR-005</span>
          <span>Rev.: 1</span>
          <span>Effectivity Date: May 2, 2022</span>
          <span>Page 1 of 1</span>
        </div>

      </div>
    </div>
  );
}
