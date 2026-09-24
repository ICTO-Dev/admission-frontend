import React from "react";
import { BirthOrder, HousingCondition, StudentType } from "../../../config/types.js";
import { Printer, X } from "lucide-react";

export default function OfficialFormView({ application, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  const formattedDOB = application?.dateOfBirth
    ? new Date(application.dateOfBirth).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "";

  const submissionDateFormatted = application?.submissionDate
    ? new Date(application.submissionDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

  const father = application?.fatherProfile || {};
  const mother = application?.motherProfile || {};
  const spouse = application?.spouseProfile || {};
  const elementary = application?.elementary || {};
  const juniorHigh = application?.juniorHigh || {};
  const seniorHigh = application?.seniorHigh || {};
  const college = application?.college || {};
  const emergency = application?.emergencyContact || {};

  const siblings = application?.siblings || [];
  // PDF splits siblings across page 1 and page 2 (or shows up to 5 on page 1, 5 on page 2)
  const page1Siblings = siblings.slice(0, 5);
  const page2Siblings = siblings.slice(5, 10);

  // Pad to ensure clean table lines like the PDF
  const page1Rows = [...page1Siblings];
  while (page1Rows.length < 5) {
    page1Rows.push(null);
  }

  const page2Rows = [...page2Siblings];
  while (page2Rows.length < 5) {
    page2Rows.push(null);
  }

  return (
    <div className="bg-slate-100 min-h-screen py-8 px-4 print:bg-white print:p-0">
      {/* Action Bar (Hidden during print) */}
      <div className="max-w-[850px] mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:hidden">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-sans">CBSUA ADM-FR-002 Student Directory Form</h2>
          <p className="text-xs text-slate-500 mt-0.5">Official Document matching application_form.pdf (Rev.: 3, June 3, 2024)</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-lg font-bold text-xs hover:bg-emerald-800 transition shadow-sm cursor-pointer"
          >
            <Printer size={15} />
            <span>Print / Save as PDF</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold text-xs hover:bg-slate-200 transition border border-slate-200 cursor-pointer"
            >
              <X size={15} />
              <span>Close View</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Form Document */}
      <div className="max-w-[850px] mx-auto bg-white p-8 border border-slate-300 shadow-md font-sans text-xs text-black print:border-0 print:p-0 print:shadow-none print:max-w-none">
        
        {/* ======================================================== */}
        {/* ======================= PAGE 1 ========================= */}
        {/* ======================================================== */}
        <div className="relative print:break-after-page mb-16 print:mb-0 pb-10 min-h-[1100px] flex flex-col justify-between">
          <div>
            {/* Header Area */}
            <div className="flex justify-between items-center border-b border-black pb-2 mb-2">
              <div className="flex gap-3 items-center">
                <div className="w-14 h-14 rounded-full border-2 border-emerald-800 flex items-center justify-center bg-emerald-50 text-center font-bold text-emerald-900 text-[9px] leading-tight">
                  CBSUA
                </div>
                <div>
                  <p className="text-[10px] text-gray-700">Republic of the Philippines</p>
                  <h1 className="text-sm font-bold tracking-tight text-black leading-tight">
                    CENTRAL BICOL STATE UNIVERSITY OF AGRICULTURE
                  </h1>
                  <p className="text-[9px] text-gray-700">San Jose, Pili, Camarines Sur 4418</p>
                  <p className="text-[9px] text-gray-700">
                    Website: <span className="underline">www.cbsua.edu.ph</span> | Email Address: <span className="underline">op@cbsua.edu.ph</span>
                  </p>
                  <p className="text-[9px] text-gray-700">Trunkline: (054) 871-5531, 871-5533</p>
                </div>
              </div>

              <div className="border border-blue-900 p-1.5 rounded text-center w-28 text-[8px] flex flex-col items-center">
                <span className="font-bold text-blue-950 block border-b border-blue-900 pb-0.5 mb-0.5 w-full">TÜVRheinland</span>
                <span className="text-gray-600 block">Management System</span>
                <span className="font-semibold block text-[7px]">ISO 9001:2015</span>
                <span className="font-semibold block text-[7px]">ISO 14001:2015</span>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center py-1 font-bold text-sm tracking-wider uppercase mb-1">
              STUDENT DIRECTORY FORM
            </div>

            {/* Processor & Header Table */}
            <div className="border border-black mb-2 text-[10px]">
              <div className="flex justify-between border-b border-black bg-gray-50 px-2 py-0.5">
                <span className="italic font-bold">For Admission Processor Only</span>
                <div className="flex gap-1">
                  <span>Application No.:</span>
                  <span className="font-bold font-mono text-blue-900">{application?.id || "__________"}</span>
                </div>
              </div>

              <div className="grid grid-cols-12 divide-x divide-black border-b border-black">
                <div className="col-span-6 p-1 flex items-center gap-2">
                  <span>Student ID No.:</span>
                  <span className="font-semibold">{application?.studentIdNo || "________________"}</span>
                </div>
                <div className="col-span-6 p-1 flex items-center gap-2">
                  <span>Course Admitted to:</span>
                  <span className="font-semibold">{application?.courseAdmitted || "________________"}</span>
                </div>
              </div>

              <div className="grid grid-cols-12 divide-x divide-black">
                <div className="col-span-7 p-1">
                  <div className="flex gap-2">
                    <span className="w-32 shrink-0">Course Applied For: 1st Choice</span>
                    <span className="font-semibold underline truncate">{application?.courseApplied1st || "N/A"}</span>
                  </div>
                  <div className="flex gap-2 pl-32 mt-0.5">
                    <span className="shrink-0 -ml-32 w-32">2nd Choice</span>
                    <span className="font-semibold underline truncate">{application?.courseApplied2nd || "N/A"}</span>
                  </div>
                </div>
                <div className="col-span-5 p-1 flex flex-col justify-between">
                  <div className="flex gap-1">
                    <span>Student Type:</span>
                    <span className="font-semibold">{application?.studentType || "Freshman"}</span>
                  </div>
                  <div className="flex gap-1">
                    <span>LRN:</span>
                    <span className="font-semibold font-mono tracking-wider">{application?.lrn || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="border border-black mb-2 relative">
              <div className="bg-gray-100 px-2 py-0.5 font-bold text-[10px] border-b border-black">
                Personal Information:
              </div>

              {/* Photo Box */}
              <div className="absolute right-1 top-6 w-[110px] h-[110px] border border-black flex flex-col items-center justify-center bg-gray-50 text-center p-1 z-10">
                {application?.photoUrl ? (
                  <img
                    src={application.photoUrl}
                    alt="Applicant Photo"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className="text-[8px] font-bold uppercase text-gray-500">PHOTO 1.5 X 1.5</span>
                    <span className="text-[7px] text-gray-500 mt-1">White background,</span>
                    <span className="text-[7px] text-gray-500">with NAME TAG</span>
                  </div>
                )}
              </div>

              <div className="p-2 space-y-1 text-[10px] pr-[120px]">
                <div className="flex items-baseline gap-1">
                  <span className="w-16 shrink-0">Name:</span>
                  <span className="font-bold border-b border-black flex-1">
                    {application?.lastName}, {application?.firstName} {application?.middleName}
                  </span>
                  <span className="text-[8px] text-gray-500 italic shrink-0">(Last Name, Given Name Middle Name)</span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="w-24 shrink-0">Present Address:</span>
                  <span className="font-semibold border-b border-black flex-1 truncate">
                    {application?.presentAddress || ""}
                  </span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="w-28 shrink-0">Permanent Address:</span>
                  <span className="font-semibold border-b border-black flex-1 truncate">
                    {application?.permanentAddress || ""}
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-1 pt-1">
                  <div className="col-span-4 flex items-baseline gap-1">
                    <span className="shrink-0">Date of Birth:</span>
                    <span className="font-semibold border-b border-black flex-1">{formattedDOB}</span>
                  </div>
                  <div className="col-span-2 flex items-baseline gap-1">
                    <span className="shrink-0">Age:</span>
                    <span className="font-semibold border-b border-black flex-1 text-center">{application?.age}</span>
                  </div>
                  <div className="col-span-3 flex items-baseline gap-1">
                    <span className="shrink-0">Sex:</span>
                    <span className="font-semibold border-b border-black flex-1 text-center">{application?.sex}</span>
                  </div>
                  <div className="col-span-3 flex items-baseline gap-1">
                    <span className="shrink-0">Civil Status:</span>
                    <span className="font-semibold border-b border-black flex-1 text-center">{application?.civilStatus}</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-1 pt-0.5">
                  <span className="shrink-0">Place of Birth:</span>
                  <span className="font-semibold border-b border-black flex-1">{application?.placeOfBirth || ""}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <div className="flex items-baseline gap-1">
                    <span className="shrink-0">Religion:</span>
                    <span className="font-semibold border-b border-black flex-1">{application?.religion || ""}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="shrink-0">Nationality:</span>
                    <span className="font-semibold border-b border-black flex-1">{application?.nationality || "Filipino"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <div className="flex items-baseline gap-1">
                    <span className="shrink-0">Mobile Numbers:</span>
                    <span className="font-semibold font-mono border-b border-black flex-1">{application?.mobileNumber || ""}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="shrink-0">Email Add:</span>
                    <span className="font-semibold border-b border-black flex-1 truncate">{application?.emailAddress || ""}</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-1 pt-0.5">
                  <span className="shrink-0 text-[10px]">
                    Are you a member of an ethnic/indigenous group? if yes, kindly specify.
                  </span>
                  <span className="font-semibold border-b border-black flex-1 truncate text-[10px]">
                    {application?.indigenousGroup || (application?.isIndigenous ? "Yes" : "")}
                  </span>
                </div>

                <div className="flex items-center gap-4 pt-0.5 text-[10px]">
                  <span>Are you a solo parents?</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1">
                      <span>Yes</span>
                      <input
                        type="checkbox"
                        checked={Boolean(application?.isSoloParent)}
                        readOnly
                        className="h-3 w-3"
                      />
                    </label>
                    <label className="flex items-center gap-1">
                      <span>No</span>
                      <input
                        type="checkbox"
                        checked={application?.isSoloParent === false}
                        readOnly
                        className="h-3 w-3"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Family Background */}
            <div className="border border-black mb-2 text-[10px]">
              <div className="bg-gray-100 px-2 py-0.5 font-bold border-b border-black">
                Family Background:
              </div>

              {/* Father Profile */}
              <div className="p-2 border-b border-black space-y-1">
                <div className="grid grid-cols-12 gap-1">
                  <div className="col-span-6 flex items-baseline gap-1">
                    <span className="shrink-0">Father's Name:</span>
                    <span className="font-semibold border-b border-black flex-1">{father.fullName || ""}</span>
                  </div>
                  <div className="col-span-2 flex items-baseline gap-1">
                    <span className="shrink-0">Age:</span>
                    <span className="font-semibold border-b border-black flex-1 text-center">{father.age || ""}</span>
                  </div>
                  <div className="col-span-4 flex items-baseline gap-1">
                    <span className="shrink-0">Birthplace:</span>
                    <span className="font-semibold border-b border-black flex-1 truncate">{father.birthplace || ""}</span>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-1">
                  <div className="col-span-7 flex items-baseline gap-1">
                    <span className="shrink-0">Educational Attainment:</span>
                    <span className="font-semibold border-b border-black flex-1 truncate">{father.educationalAttainment || ""}</span>
                  </div>
                  <div className="col-span-5 flex items-baseline gap-1">
                    <span className="shrink-0">Contact Number:</span>
                    <span className="font-semibold border-b border-black flex-1">{father.contactNumber || ""}</span>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-1">
                  <div className="col-span-6 flex items-baseline gap-1">
                    <span className="shrink-0">Occupation:</span>
                    <span className="font-semibold border-b border-black flex-1">{father.occupation || ""}</span>
                  </div>
                  <div className="col-span-6 flex items-baseline gap-1">
                    <span className="shrink-0">Place of Work:</span>
                    <span className="font-semibold border-b border-black flex-1">{father.placeOfWork || ""}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-0.5">
                  <label className="flex items-center gap-1">
                    <input type="checkbox" checked={father.livingStatus === "Living"} readOnly className="h-3 w-3" />
                    <span>Living</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" checked={father.livingStatus === "Deceased"} readOnly className="h-3 w-3" />
                    <span>Deceased</span>
                  </label>
                  <div className="flex items-baseline gap-1 flex-1">
                    <span className="shrink-0">Cause of Death:</span>
                    <span className="border-b border-black flex-1">{father.causeOfDeath || ""}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-0.5">
                  <span className="font-medium">Living with the Family?</span>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" checked={father.livingWithFamily === "Yes"} readOnly className="h-3 w-3" />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" checked={father.livingWithFamily === "No"} readOnly className="h-3 w-3" />
                    <span>No</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" checked={father.livingWithFamily === "Abroad"} readOnly className="h-3 w-3" />
                    <span>Abroad</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" checked={father.livingWithFamily === "Separated"} readOnly className="h-3 w-3" />
                    <span>Separated</span>
                  </label>
                </div>
              </div>

              {/* Mother Profile */}
              <div className="p-2 border-b border-black space-y-1">
                <div className="grid grid-cols-12 gap-1">
                  <div className="col-span-6 flex items-baseline gap-1">
                    <span className="shrink-0">Mother's Name:</span>
                    <span className="font-semibold border-b border-black flex-1">{mother.fullName || ""}</span>
                  </div>
                  <div className="col-span-2 flex items-baseline gap-1">
                    <span className="shrink-0">Age:</span>
                    <span className="font-semibold border-b border-black flex-1 text-center">{mother.age || ""}</span>
                  </div>
                  <div className="col-span-4 flex items-baseline gap-1">
                    <span className="shrink-0">Birthplace:</span>
                    <span className="font-semibold border-b border-black flex-1 truncate">{mother.birthplace || ""}</span>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-1">
                  <div className="col-span-7 flex items-baseline gap-1">
                    <span className="shrink-0">Educational Attainment:</span>
                    <span className="font-semibold border-b border-black flex-1 truncate">{mother.educationalAttainment || ""}</span>
                  </div>
                  <div className="col-span-5 flex items-baseline gap-1">
                    <span className="shrink-0">Contact Number:</span>
                    <span className="font-semibold border-b border-black flex-1">{mother.contactNumber || ""}</span>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-1">
                  <div className="col-span-6 flex items-baseline gap-1">
                    <span className="shrink-0">Occupation:</span>
                    <span className="font-semibold border-b border-black flex-1">{mother.occupation || ""}</span>
                  </div>
                  <div className="col-span-6 flex items-baseline gap-1">
                    <span className="shrink-0">Place of Work:</span>
                    <span className="font-semibold border-b border-black flex-1">{mother.placeOfWork || ""}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-0.5">
                  <label className="flex items-center gap-1">
                    <input type="checkbox" checked={mother.livingStatus === "Living"} readOnly className="h-3 w-3" />
                    <span>Living</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" checked={mother.livingStatus === "Deceased"} readOnly className="h-3 w-3" />
                    <span>Deceased</span>
                  </label>
                  <div className="flex items-baseline gap-1 flex-1">
                    <span className="shrink-0">Cause of Death:</span>
                    <span className="border-b border-black flex-1">{mother.causeOfDeath || ""}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-0.5">
                  <span className="font-medium">Living with the Family?</span>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" checked={mother.livingWithFamily === "Yes"} readOnly className="h-3 w-3" />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" checked={mother.livingWithFamily === "No"} readOnly className="h-3 w-3" />
                    <span>No</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" checked={mother.livingWithFamily === "Abroad"} readOnly className="h-3 w-3" />
                    <span>Abroad</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" checked={mother.livingWithFamily === "Separated"} readOnly className="h-3 w-3" />
                    <span>Separated</span>
                  </label>
                </div>
              </div>

              {/* For Married Applicant Only */}
              <div className="p-2 border-b border-black space-y-1">
                <div className="font-bold italic text-[9px] text-gray-700">For Married Applicant Only</div>
                <div className="grid grid-cols-12 gap-1">
                  <div className="col-span-6 flex items-baseline gap-1">
                    <span className="shrink-0">Spouse's Name:</span>
                    <span className="font-semibold border-b border-black flex-1">{spouse.fullName || ""}</span>
                  </div>
                  <div className="col-span-2 flex items-baseline gap-1">
                    <span className="shrink-0">Age:</span>
                    <span className="font-semibold border-b border-black flex-1 text-center">{spouse.age || ""}</span>
                  </div>
                  <div className="col-span-4 flex items-baseline gap-1">
                    <span className="shrink-0">Birthplace:</span>
                    <span className="font-semibold border-b border-black flex-1 truncate">{spouse.birthplace || ""}</span>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-1">
                  <div className="col-span-7 flex items-baseline gap-1">
                    <span className="shrink-0">Educational Attainment:</span>
                    <span className="font-semibold border-b border-black flex-1 truncate">{spouse.educationalAttainment || ""}</span>
                  </div>
                  <div className="col-span-5 flex items-baseline gap-1">
                    <span className="shrink-0">Contact Number:</span>
                    <span className="font-semibold border-b border-black flex-1">{spouse.contactNumber || ""}</span>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-1">
                  <div className="col-span-6 flex items-baseline gap-1">
                    <span className="shrink-0">Occupation:</span>
                    <span className="font-semibold border-b border-black flex-1">{spouse.occupation || ""}</span>
                  </div>
                  <div className="col-span-6 flex items-baseline gap-1">
                    <span className="shrink-0">Place of Work:</span>
                    <span className="font-semibold border-b border-black flex-1">{spouse.placeOfWork || ""}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-0.5">
                  <label className="flex items-center gap-1">
                    <input type="checkbox" checked={spouse.livingStatus === "Living"} readOnly className="h-3 w-3" />
                    <span>Living</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" checked={spouse.livingStatus === "Deceased"} readOnly className="h-3 w-3" />
                    <span>Deceased</span>
                  </label>
                  <div className="flex items-baseline gap-1 flex-1">
                    <span className="shrink-0">Cause of Death:</span>
                    <span className="border-b border-black flex-1">{spouse.causeOfDeath || ""}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">Living with the Family?</span>
                    <label className="flex items-center gap-1">
                      <input type="checkbox" checked={spouse.livingWithFamily === "Yes"} readOnly className="h-3 w-3" />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="checkbox" checked={spouse.livingWithFamily === "No"} readOnly className="h-3 w-3" />
                      <span>No</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="checkbox" checked={spouse.livingWithFamily === "Abroad"} readOnly className="h-3 w-3" />
                      <span>Abroad</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="checkbox" checked={spouse.livingWithFamily === "Separated"} readOnly className="h-3 w-3" />
                      <span>Separated</span>
                    </label>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="shrink-0">Number of Dependents/Children:</span>
                    <span className="font-semibold border-b border-black px-2">{application?.numberOfDependents || spouse.dependents || "0"}</span>
                  </div>
                </div>
              </div>

              {/* Birth Order */}
              <div className="p-2">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="font-bold">Birth Order:</span>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" checked={application?.birthOrder === BirthOrder.ONLY_CHILD} readOnly className="h-3 w-3" />
                    <span>Only Child</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" checked={application?.birthOrder === BirthOrder.ELDEST} readOnly className="h-3 w-3" />
                    <span>Eldest</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" checked={application?.birthOrder === BirthOrder.MIDDLE} readOnly className="h-3 w-3" />
                    <span>Middle</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" checked={application?.birthOrder === BirthOrder.YOUNGEST} readOnly className="h-3 w-3" />
                    <span>Youngest</span>
                  </label>
                  <div className="flex items-baseline gap-1">
                    <span>Others:</span>
                    <span className="border-b border-black w-24">
                      {application?.birthOrder === BirthOrder.OTHERS ? application?.birthOrderOther || "Yes" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Siblings Table (Page 1) */}
            <div className="mb-2">
              <table className="w-full border-collapse border border-black text-center text-[9px]">
                <thead>
                  <tr className="border-b border-black bg-gray-50">
                    <th className="border-r border-black p-1 text-left w-2/5">
                      Name of Siblings (Eldest to Youngest)
                      <span className="block text-[8px] font-normal italic">Note: Siblings means your brother/s or sister/s</span>
                    </th>
                    <th className="border-r border-black p-1 w-12">Age</th>
                    <th className="border-r border-black p-1 w-14">Sex (M/F)</th>
                    <th className="border-r border-black p-1 w-24">Civil Status</th>
                    <th className="p-1 text-left">
                      Educational Attainment
                      <span className="block text-[8px] font-normal italic">(Elem, HS, SHS, Vocational, College, Masters etc)</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {page1Rows.map((sib, sIdx) => (
                    <tr key={`p1-${sIdx}`} className="border-b border-black h-5">
                      <td className="border-r border-black px-1 text-left font-medium">{sib ? sib.name : ""}</td>
                      <td className="border-r border-black px-1">{sib ? sib.age : ""}</td>
                      <td className="border-r border-black px-1">{sib ? sib.sex : ""}</td>
                      <td className="border-r border-black px-1">{sib ? sib.civilStatus : ""}</td>
                      <td className="px-1 text-left">{sib ? sib.educationalAttainment : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Page 1 Footer */}
          <div className="border-t border-black pt-1 text-[8px] font-mono flex justify-between items-end">
            <div>
              <p className="italic font-sans mb-1 text-[9px]">Continued on page 2</p>
              <p className="font-bold">ADM-FR-002</p>
              <p>Effectivity Date: June 3, 2024</p>
            </div>
            <div className="text-right">
              <p className="font-bold">Rev.:3</p>
              <p>Page 1 of 2</p>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* ======================= PAGE 2 ========================= */}
        {/* ======================================================== */}
        <div className="relative pt-6 print:pt-0 min-h-[1100px] flex flex-col justify-between">
          <div>
            {/* Page 2 Title */}
            <div className="text-center py-1 font-bold text-sm tracking-wider uppercase mb-2">
              STUDENT DIRECTORY FORM
            </div>

            {/* Siblings Table Continued */}
            <div className="mb-3">
              <table className="w-full border-collapse border border-black text-center text-[9px]">
                <thead>
                  <tr className="border-b border-black bg-gray-50">
                    <th className="border-r border-black p-1 text-left w-2/5">
                      Name of Siblings (Eldest to Youngest)
                      <span className="block text-[8px] font-normal italic">Note: Siblings means your brother/s or sister/s</span>
                    </th>
                    <th className="border-r border-black p-1 w-12">Age</th>
                    <th className="border-r border-black p-1 w-14">Sex (M/F)</th>
                    <th className="border-r border-black p-1 w-24">Civil Status</th>
                    <th className="p-1 text-left">
                      Educational Attainment
                      <span className="block text-[8px] font-normal italic">(Elem, HS, SHS, Vocational, College, Masters etc)</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {page2Rows.map((sib, sIdx) => (
                    <tr key={`p2-${sIdx}`} className="border-b border-black h-5">
                      <td className="border-r border-black px-1 text-left font-medium">{sib ? sib.name : ""}</td>
                      <td className="border-r border-black px-1">{sib ? sib.age : ""}</td>
                      <td className="border-r border-black px-1">{sib ? sib.sex : ""}</td>
                      <td className="border-r border-black px-1">{sib ? sib.civilStatus : ""}</td>
                      <td className="px-1 text-left">{sib ? sib.educationalAttainment : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Housing Condition & Monthly Income */}
            <div className="border border-black p-2 mb-2 text-[10px] space-y-1.5">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-3 font-semibold">Housing Condition:</div>
                <div className="col-span-9 grid grid-cols-2 gap-y-1">
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" checked={application?.housingCondition === HousingCondition.OWNED} readOnly className="h-3 w-3" />
                    <span>Owned</span>
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" checked={application?.housingCondition === HousingCondition.SHARED} readOnly className="h-3 w-3" />
                    <span>Shared with grandparents or relatives</span>
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" checked={application?.housingCondition === HousingCondition.RENTED} readOnly className="h-3 w-3" />
                    <span>Rented</span>
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" checked={application?.housingCondition === HousingCondition.RENT_TO_OWN} readOnly className="h-3 w-3" />
                    <span>Rent to Own</span>
                  </label>
                </div>
              </div>

              <div className="flex items-baseline gap-2 pt-1 border-t border-gray-200">
                <span className="font-semibold shrink-0">Family's Monthly Income:</span>
                <span className="border-b border-black flex-1 font-semibold">{application?.familyMonthlyIncome || ""}</span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-semibold shrink-0">Language / Dialect spoken at home:</span>
                <span className="border-b border-black flex-1 font-semibold">{application?.languageSpoken || ""}</span>
              </div>
            </div>

            {/* Educational Background */}
            <div className="border border-black mb-2 text-[10px]">
              <div className="bg-gray-100 px-2 py-0.5 font-bold border-b border-black">
                Educational Background:
              </div>

              <div className="p-2 space-y-2">
                {/* Elementary */}
                <div>
                  <div className="font-bold underline mb-0.5">Elementary</div>
                  <div className="grid grid-cols-12 gap-1">
                    <div className="col-span-8 flex items-baseline gap-1">
                      <span className="shrink-0">Name of School</span>
                      <span className="border-b border-black flex-1 font-semibold truncate">{elementary.schoolName || ""}</span>
                    </div>
                    <div className="col-span-4 flex items-baseline gap-1">
                      <span className="shrink-0">Year Graduated:</span>
                      <span className="border-b border-black flex-1 font-semibold text-center">{elementary.yearGraduated || ""}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-1 mt-0.5">
                    <div className="col-span-7 flex items-baseline gap-1">
                      <span className="shrink-0">Address</span>
                      <span className="border-b border-black flex-1 font-semibold truncate">{elementary.address || ""}</span>
                    </div>
                    <div className="col-span-5 flex items-baseline gap-1">
                      <span className="shrink-0">Awards / Honor:</span>
                      <span className="border-b border-black flex-1 font-semibold truncate">{elementary.awardsHonors || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Junior High */}
                <div>
                  <div className="font-bold underline mb-0.5">Junior High School</div>
                  <div className="grid grid-cols-12 gap-1">
                    <div className="col-span-8 flex items-baseline gap-1">
                      <span className="shrink-0">Name of School</span>
                      <span className="border-b border-black flex-1 font-semibold truncate">{juniorHigh.schoolName || ""}</span>
                    </div>
                    <div className="col-span-4 flex items-baseline gap-1">
                      <span className="shrink-0">Year Graduated:</span>
                      <span className="border-b border-black flex-1 font-semibold text-center">{juniorHigh.yearGraduated || ""}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-1 mt-0.5">
                    <div className="col-span-7 flex items-baseline gap-1">
                      <span className="shrink-0">Address</span>
                      <span className="border-b border-black flex-1 font-semibold truncate">{juniorHigh.address || ""}</span>
                    </div>
                    <div className="col-span-5 flex items-baseline gap-1">
                      <span className="shrink-0">Awards / Honor:</span>
                      <span className="border-b border-black flex-1 font-semibold truncate">{juniorHigh.awardsHonors || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Senior High */}
                <div>
                  <div className="font-bold underline mb-0.5">Senior High School</div>
                  <div className="grid grid-cols-12 gap-1">
                    <div className="col-span-8 flex items-baseline gap-1">
                      <span className="shrink-0">Name of School</span>
                      <span className="border-b border-black flex-1 font-semibold truncate">{seniorHigh.schoolName || ""}</span>
                    </div>
                    <div className="col-span-4 flex items-baseline gap-1">
                      <span className="shrink-0">Year Graduated:</span>
                      <span className="border-b border-black flex-1 font-semibold text-center">{seniorHigh.yearGraduated || ""}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-1 mt-0.5">
                    <div className="col-span-7 flex items-baseline gap-1">
                      <span className="shrink-0">Address</span>
                      <span className="border-b border-black flex-1 font-semibold truncate">{seniorHigh.address || ""}</span>
                    </div>
                    <div className="col-span-5 flex items-baseline gap-1">
                      <span className="shrink-0">Awards / Honor:</span>
                      <span className="border-b border-black flex-1 font-semibold truncate">{seniorHigh.awardsHonors || "N/A"}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-1 mt-0.5">
                    <div className="col-span-7 flex items-baseline gap-1">
                      <span className="shrink-0">Track and Strand</span>
                      <span className="border-b border-black flex-1 font-semibold truncate">{seniorHigh.trackStrand || ""}</span>
                    </div>
                    <div className="col-span-5 flex items-baseline gap-1">
                      <span className="shrink-0 text-[9px]">General Weighted Average (GWA)-G11:</span>
                      <span className="border-b border-black flex-1 font-semibold text-center">{seniorHigh.gwaG11 || ""}</span>
                    </div>
                  </div>
                  <div className="flex justify-end mt-0.5">
                    <div className="w-5/12 flex items-baseline gap-1">
                      <span className="shrink-0 text-[9px]">General Weighted Average (GWA)-G12:</span>
                      <span className="border-b border-black flex-1 font-semibold text-center">{seniorHigh.gwaG12 || ""}</span>
                    </div>
                  </div>
                </div>

                {/* College (For Transferee / Second Courser) */}
                <div>
                  <div className="font-bold underline mb-0.5">College (For Transferee / Second Courser)</div>
                  <div className="grid grid-cols-12 gap-1">
                    <div className="col-span-8 flex items-baseline gap-1">
                      <span className="shrink-0">Name of School</span>
                      <span className="border-b border-black flex-1 font-semibold truncate">{college.schoolName || ""}</span>
                    </div>
                    <div className="col-span-4 flex items-baseline gap-1">
                      <span className="shrink-0">Inclusive Year/s:</span>
                      <span className="border-b border-black flex-1 font-semibold text-center">{college.inclusiveYears || ""}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-1 mt-0.5">
                    <div className="col-span-7 flex items-baseline gap-1">
                      <span className="shrink-0">Address</span>
                      <span className="border-b border-black flex-1 font-semibold truncate">{college.address || ""}</span>
                    </div>
                    <div className="col-span-5 flex items-baseline gap-1">
                      <span className="shrink-0">Awards / Honor:</span>
                      <span className="border-b border-black flex-1 font-semibold truncate">{college.awardsHonors || "N/A"}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-1 mt-0.5">
                    <div className="col-span-7 flex items-baseline gap-1">
                      <span className="shrink-0">Course</span>
                      <span className="border-b border-black flex-1 font-semibold truncate">{college.course || ""}</span>
                    </div>
                    <div className="col-span-5 flex items-baseline gap-1">
                      <span className="shrink-0 text-[9px]">General Weighted Average (GWA):</span>
                      <span className="border-b border-black flex-1 font-semibold text-center">{college.gwa || ""}</span>
                    </div>
                  </div>
                </div>

                {/* College Questions */}
                <div className="pt-1 space-y-1 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <span>Are you the first person in your family to attend college?</span>
                    <label className="flex items-center gap-1">
                      <input type="checkbox" checked={application?.firstGenerationStudent === false} readOnly className="h-3 w-3" />
                      <span>No</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="checkbox" checked={application?.firstGenerationStudent === true} readOnly className="h-3 w-3" />
                      <span>Yes</span>
                    </label>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="shrink-0">How many members in your family had attended college?</span>
                    <span className="border-b border-black flex-1 font-semibold">{application?.familyCollegeGraduatesCount ?? "0"}</span>
                  </div>

                  <div className="space-y-0.5">
                    <div>How do you see yourself five years after graduation?</div>
                    <div className="border-b border-black pb-0.5 font-semibold italic text-[9px] min-h-[16px]">
                      {application?.futureOutlook || ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Conditions */}
            <div className="border border-black mb-2 text-[10px]">
              <div className="bg-gray-100 px-2 py-0.5 font-bold border-b border-black">
                Health Conditions:
              </div>
              <div className="p-2 space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="shrink-0">Are you a Person With Disability (PWD) ? If yes, kindly specify.</span>
                  <label className="flex items-center gap-1 shrink-0">
                    <input type="checkbox" checked={!application?.pwdStatus} readOnly className="h-3 w-3" />
                    <span>No</span>
                  </label>
                  <label className="flex items-center gap-1 shrink-0">
                    <input type="checkbox" checked={Boolean(application?.pwdStatus)} readOnly className="h-3 w-3" />
                    <span>Yes</span>
                  </label>
                  <span className="border-b border-black flex-1 font-semibold truncate">
                    {application?.pwdStatus ? application?.pwdSpecs || "Yes" : ""}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="shrink-0">Have you ever been hospitalized? If yes, for what reason?</span>
                  <label className="flex items-center gap-1 shrink-0">
                    <input type="checkbox" checked={!application?.hospitalizedStatus} readOnly className="h-3 w-3" />
                    <span>No</span>
                  </label>
                  <label className="flex items-center gap-1 shrink-0">
                    <input type="checkbox" checked={Boolean(application?.hospitalizedStatus)} readOnly className="h-3 w-3" />
                    <span>Yes</span>
                  </label>
                  <span className="border-b border-black flex-1 font-semibold truncate">
                    {application?.hospitalizedStatus ? application?.hospitalizedReasons || "Yes" : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="border border-black mb-3 text-[10px] p-2 space-y-1">
              <div className="grid grid-cols-12 gap-1">
                <div className="col-span-8 flex items-baseline gap-1">
                  <span className="shrink-0">In case of emergency, please contact</span>
                  <span className="border-b border-black flex-1 font-semibold">{emergency.name || ""}</span>
                  <span className="text-[8px] text-gray-500 italic shrink-0">(Name of Contact Person)</span>
                </div>
                <div className="col-span-4 flex items-baseline gap-1">
                  <span className="shrink-0">Relation:</span>
                  <span className="border-b border-black flex-1 font-semibold">{emergency.relation || ""}</span>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-1">
                <div className="col-span-8 flex items-baseline gap-1">
                  <span className="shrink-0">Address:</span>
                  <span className="border-b border-black flex-1 font-semibold truncate">{emergency.address || ""}</span>
                </div>
                <div className="col-span-4 flex items-baseline gap-1">
                  <span className="shrink-0">Contact No.:</span>
                  <span className="border-b border-black flex-1 font-semibold">{emergency.contactNo || ""}</span>
                </div>
              </div>
            </div>

            {/* Certification & Signatures */}
            <div className="text-[10px] space-y-4 pt-1">
              <p className="font-semibold">I hereby certify that the above information is true and correct.</p>

              <div className="grid grid-cols-2 gap-12 pt-4">
                <div className="flex items-baseline gap-2">
                  <span className="shrink-0">Signature:</span>
                  <span className="border-b border-black flex-1 font-serif italic text-blue-900 font-bold text-center">
                    {application?.firstName} {application?.lastName}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="shrink-0">Date:</span>
                  <span className="border-b border-black flex-1 font-mono font-semibold text-center">
                    {submissionDateFormatted}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Page 2 Footer */}
          <div className="border-t border-black pt-1 text-[8px] font-mono flex justify-between items-end mt-4">
            <div>
              <p className="font-bold">ADM-FR-002</p>
              <p>Effectivity Date: June 3, 2024</p>
            </div>
            <div className="text-right">
              <p className="font-bold">Rev.: 3</p>
              <p>Page 2 of 2</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
