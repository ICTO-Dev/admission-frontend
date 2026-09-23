import React from "react";
import { BirthOrder, HousingCondition, StudentType } from "../../../config/types.js";
import { Printer, X } from "lucide-react";

export default function OfficialFormView({ application, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  const formattedDOB = application.dateOfBirth
    ? new Date(application.dateOfBirth).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 print:bg-white print:p-0">
      {/* Action Bar (Hidden during print) */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded border border-slate-200 shadow-sm print:hidden">
        <div>
          <h2 className="text-sm font-bold text-slate-900 font-sans">CBSUA ADM-FR-002 Student Directory Form</h2>
          <p className="text-xs text-slate-500 mt-0.5">Official Pre-filled Document ready for printing or saving as PDF</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded font-bold text-xs hover:bg-emerald-700 transition shadow-sm cursor-pointer"
          >
            <Printer size={15} />
            <span>Print / Save as PDF</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded font-bold text-xs hover:bg-slate-200 transition border border-slate-200 cursor-pointer"
            >
              <X size={15} />
              <span>Close View</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Form Document (Standard A4 layout container) */}
      <div className="max-w-[800px] mx-auto bg-white p-8 border border-slate-300 shadow-sm font-sans text-xs text-slate-900 print:border-0 print:p-0 print:shadow-none">
        
        {/* ================= PAGE 1 ================= */}
        <div className="relative print:break-after-page mb-16 print:mb-0">
          
          {/* Header Area */}
          <div className="flex justify-between items-start border-b border-gray-300 pb-2 mb-2">
            <div className="flex gap-3 items-center">
              <div className="w-16 h-16 rounded-full border border-emerald-700 flex items-center justify-center bg-emerald-50 text-center font-bold text-emerald-800 text-[10px] leading-tight">
                CBSUA LOGO
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-gray-600 tracking-wider">Republic of the Philippines</p>
                <h1 className="text-sm font-bold text-emerald-800 leading-tight">CENTRAL BICOL STATE UNIVERSITY OF AGRICULTURE</h1>
                <p className="text-[9px] text-gray-500">San Jose, Pili, Camarines Sur 4418</p>
                <p className="text-[9px] text-gray-500">Website: <span className="underline">www.cbsua.edu.ph</span> | Email: <span className="underline">op@cbsua.edu.ph</span></p>
                <p className="text-[9px] text-gray-500">Trunkline: (054) 871-5531, 871-5533</p>
              </div>
            </div>
            
            <div className="border border-blue-800 p-1 rounded text-center w-28 text-[8px] flex flex-col items-center">
              <span className="font-bold text-blue-900 block border-b border-blue-800 pb-0.5 mb-0.5">TÜVRheinland</span>
              <span className="text-gray-500 block">Management System</span>
              <span className="font-semibold block text-[7px]">ISO 9001:2015</span>
              <span className="font-semibold block text-[7px]">ISO 14001:2015</span>
            </div>
          </div>

          <div className="border border-black text-center py-1.5 bg-gray-50 mb-3 font-bold text-sm tracking-widest uppercase">
            STUDENT DIRECTORY FORM
          </div>

          <div className="border border-black mb-4 divide-y divide-black">
            <div className="grid grid-cols-12 divide-x divide-black">
              <div className="col-span-8 p-1 bg-gray-50 font-bold uppercase text-[10px] text-emerald-800">
                For Admission Processor Only
              </div>
              <div className="col-span-4 p-1 flex items-center gap-1">
                <span className="font-semibold">Application No.:</span>
                <span className="font-mono font-bold text-sm text-blue-800">{application.id}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-12 divide-x divide-black">
              <div className="col-span-4 p-1 flex flex-col justify-between h-9">
                <span className="text-[9px] text-gray-500">Student ID No.:</span>
                <span className="font-bold text-gray-800">{application.studentIdNo || "(Pending Enrollment)"}</span>
              </div>
              <div className="col-span-4 p-1 flex flex-col justify-between h-9">
                <span className="text-[9px] text-gray-500">Preferred Campus:</span>
                <span className="font-bold text-emerald-800 uppercase">{application.campus || "Pili"}</span>
              </div>
              <div className="col-span-4 p-1 flex flex-col justify-between h-9">
                <span className="text-[9px] text-gray-500">Course Admitted to:</span>
                <span className="font-bold text-emerald-800">{application.courseAdmitted || "(Assigned Post-Exam)"}</span>
              </div>
            </div>

            <div className="grid grid-cols-12 divide-x divide-black">
              <div className="col-span-8 p-1 flex flex-col gap-1">
                <div className="flex gap-2">
                  <span className="text-[9px] text-gray-500 w-28">Course Applied For:</span>
                  <div>
                    <p className="font-semibold text-gray-800">1st: {application.courseApplied1st}</p>
                    <p className="text-gray-600">2nd: {application.courseApplied2nd || "N/A"}</p>
                  </div>
                </div>
              </div>
              <div className="col-span-4 p-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-gray-500">Student Type:</span>
                  <p className="font-semibold text-gray-800">{application.studentType}</p>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500">LRN:</span>
                  <p className="font-mono text-gray-800 tracking-wider">{application.lrn}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mb-4">
            <div className="bg-gray-200 px-2 py-1 font-bold text-[10px] uppercase border-l-4 border-emerald-700 mb-2">
              Personal Information:
            </div>
            
            <div className="absolute right-0 top-8 w-[120px] h-[120px] border border-black flex flex-col items-center justify-center bg-gray-50 text-center p-1 z-10">
              {application.photoUrl ? (
                <img
                  src={application.photoUrl}
                  alt="Applicant Photo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-[8px] font-bold uppercase text-gray-400">PHOTO 1.5 X 1.5</span>
                  <span className="text-[7px] text-gray-400 mt-1">White background</span>
                  <span className="text-[7px] text-gray-400">with NAME TAG</span>
                </div>
              )}
            </div>

            <div className="w-[calc(100%-135px)] space-y-2">
              <div>
                <span className="text-gray-500 block text-[9px]">Full Name: (Last, Given, Middle)</span>
                <span className="font-bold text-sm text-gray-900 border-b border-gray-300 pb-0.5 block">
                  {application.lastName}, {application.firstName} {application.middleName}
                </span>
              </div>
              
              <div>
                <span className="text-gray-500 block text-[9px]">Present Address:</span>
                <span className="font-medium text-gray-800 border-b border-gray-300 pb-0.5 block">
                  {application.presentAddress}
                </span>
              </div>

              <div>
                <span className="text-gray-500 block text-[9px]">Permanent Address:</span>
                <span className="font-medium text-gray-800 border-b border-gray-300 pb-0.5 block">
                  {application.permanentAddress}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-2 pt-1 border-t border-gray-100">
              <div>
                <span className="text-gray-500 block text-[9px]">Date of Birth:</span>
                <span className="font-medium text-gray-800">{formattedDOB}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[9px]">Age:</span>
                <span className="font-medium text-gray-800">{application.age} yrs old</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[9px]">Sex:</span>
                <span className="font-medium text-gray-800">{application.sex}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[9px]">Civil Status:</span>
                <span className="font-medium text-gray-800">{application.civilStatus}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2 pt-1 border-t border-gray-100">
              <div>
                <span className="text-gray-500 block text-[9px]">Place of Birth:</span>
                <span className="font-medium text-gray-800">{application.placeOfBirth}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[9px]">Religion:</span>
                <span className="font-medium text-gray-800">{application.religion}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[9px]">Nationality:</span>
                <span className="font-medium text-gray-800">{application.nationality}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 pt-1 border-t border-gray-100">
              <div>
                <span className="text-gray-500 block text-[9px]">Mobile Number:</span>
                <span className="font-mono text-gray-800 font-semibold">{application.mobileNumber}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[9px]">Email Address:</span>
                <span className="font-medium text-gray-800">{application.emailAddress}</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="bg-gray-200 px-2 py-1 font-bold text-[10px] uppercase border-l-4 border-emerald-700 mb-2">
              Family Background:
            </div>

            <div className="border border-gray-200 rounded p-2 bg-gray-50/50 mb-2">
              <p className="font-bold text-gray-700 text-[9px] border-b border-gray-200 pb-1 mb-1.5 uppercase">Father's Profile</p>
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-5">
                  <span className="text-gray-500 text-[8px] block">Name:</span>
                  <span className="font-semibold text-gray-800">{application.fatherProfile.fullName}</span>
                </div>
                <div className="col-span-1">
                  <span className="text-gray-500 text-[8px] block">Age:</span>
                  <span className="font-semibold text-gray-800">{application.fatherProfile.age}</span>
                </div>
                <div className="col-span-3">
                  <span className="text-gray-500 text-[8px] block">Birthplace:</span>
                  <span className="font-semibold text-gray-800">{application.fatherProfile.birthplace}</span>
                </div>
                <div className="col-span-3">
                  <span className="text-gray-500 text-[8px] block">Contact No:</span>
                  <span className="font-semibold text-gray-800">{application.fatherProfile.contactNumber}</span>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-2 mt-1.5">
                <div className="col-span-4">
                  <span className="text-gray-500 text-[8px] block">Educational Attainment:</span>
                  <span className="font-semibold text-gray-800">{application.fatherProfile.educationalAttainment}</span>
                </div>
                <div className="col-span-4">
                  <span className="text-gray-500 text-[8px] block">Occupation:</span>
                  <span className="font-semibold text-gray-800">{application.fatherProfile.occupation}</span>
                </div>
                <div className="col-span-4">
                  <span className="text-gray-500 text-[8px] block">Place of Work:</span>
                  <span className="font-semibold text-gray-800">{application.fatherProfile.placeOfWork || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded p-2 bg-gray-50/50 mb-2">
              <p className="font-bold text-gray-700 text-[9px] border-b border-gray-200 pb-1 mb-1.5 uppercase">Mother's Profile (Maiden Name)</p>
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-5">
                  <span className="text-gray-500 text-[8px] block">Name:</span>
                  <span className="font-semibold text-gray-800">{application.motherProfile.fullName}</span>
                </div>
                <div className="col-span-1">
                  <span className="text-gray-500 text-[8px] block">Age:</span>
                  <span className="font-semibold text-gray-800">{application.motherProfile.age}</span>
                </div>
                <div className="col-span-3">
                  <span className="text-gray-500 text-[8px] block">Birthplace:</span>
                  <span className="font-semibold text-gray-800">{application.motherProfile.birthplace}</span>
                </div>
                <div className="col-span-3">
                  <span className="text-gray-500 text-[8px] block">Contact No:</span>
                  <span className="font-semibold text-gray-800">{application.motherProfile.contactNumber}</span>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-2 mt-1.5">
                <div className="col-span-4">
                  <span className="text-gray-500 text-[8px] block">Educational Attainment:</span>
                  <span className="font-semibold text-gray-800">{application.motherProfile.educationalAttainment}</span>
                </div>
                <div className="col-span-4">
                  <span className="text-gray-500 text-[8px] block">Occupation:</span>
                  <span className="font-semibold text-gray-800">{application.motherProfile.occupation}</span>
                </div>
                <div className="col-span-4">
                  <span className="text-gray-500 text-[8px] block">Place of Work:</span>
                  <span className="font-semibold text-gray-800">{application.motherProfile.placeOfWork || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2 pt-1.5 border-t border-gray-100">
              <div className="col-span-3">
                <span className="text-gray-500 text-[9px]">Birth Order:</span>
                <div className="flex gap-4 mt-1 font-semibold text-gray-800">
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" checked={application.birthOrder === BirthOrder.ONLY_CHILD} readOnly className="rounded text-emerald-700" />
                    <span>Only Child</span>
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" checked={application.birthOrder === BirthOrder.ELDEST} readOnly className="rounded text-emerald-700" />
                    <span>Eldest</span>
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" checked={application.birthOrder === BirthOrder.MIDDLE} readOnly className="rounded text-emerald-700" />
                    <span>Middle</span>
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" checked={application.birthOrder === BirthOrder.YOUNGEST} readOnly className="rounded text-emerald-700" />
                    <span>Youngest</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-2">
            <span className="text-gray-500 text-[9px] block mb-1 font-medium">Name of Siblings (Eldest to Youngest)</span>
            <table className="w-full border-collapse border border-black text-center text-[9px]">
              <thead>
                <tr className="bg-gray-100 border-b border-black">
                  <th className="border-r border-black p-1 w-2/5">Name of Sibling</th>
                  <th className="border-r border-black p-1 w-[10%]">Age</th>
                  <th className="border-r border-black p-1 w-[10%]">Sex (M/F)</th>
                  <th className="border-r border-black p-1 w-[15%]">Civil Status</th>
                  <th className="p-1 w-1/4">Educational Attainment</th>
                </tr>
              </thead>
              <tbody>
                {application.siblings && application.siblings.length > 0 ? (
                  application.siblings.map((sib, sIdx) => (
                    <tr key={sib.id || sIdx} className="border-b border-gray-300">
                      <td className="border-r border-black p-1 text-left font-medium">{sib.name}</td>
                      <td className="border-r border-black p-1">{sib.age}</td>
                      <td className="border-r border-black p-1">{sib.sex}</td>
                      <td className="border-r border-black p-1">{sib.civilStatus}</td>
                      <td className="p-1 text-left text-[8px]">{sib.educationalAttainment}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-2 text-center text-gray-400 italic">No siblings listed / Only Child</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="absolute bottom-0 left-0 right-0 border-t border-black pt-1 flex justify-between text-[8px] font-mono text-gray-500">
            <span>ADM-FR-002</span>
            <span>Rev.:3</span>
            <span>Effectivity Date: June 3, 2024</span>
            <span>Page 1 of 2</span>
          </div>

        </div>

        {/* ================= PAGE 2 ================= */}
        <div className="relative pt-6 print:pt-0">
          <div className="border-b border-gray-300 pb-2 mb-4 text-center">
            <h2 className="text-xs font-bold text-gray-700">STUDENT DIRECTORY FORM (ADM-FR-002)</h2>
            <p className="text-[8px] text-gray-400">Central Bicol State University of Agriculture</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 bg-gray-50 p-2 rounded border border-gray-200">
            <div>
              <span className="text-gray-500 text-[9px] block">Housing Condition:</span>
              <div className="flex flex-col gap-1 mt-1 font-semibold text-gray-800">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={application.housingCondition === HousingCondition.OWNED} readOnly className="rounded text-emerald-700" />
                  <span>Owned</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={application.housingCondition === HousingCondition.RENTED} readOnly className="rounded text-emerald-700" />
                  <span>Rented</span>
                </label>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-gray-500 text-[9px] block">Family's Monthly Income:</span>
                <span className="font-semibold text-emerald-800 text-sm border-b border-gray-300 block pb-1">{application.familyMonthlyIncome}</span>
              </div>
              <div>
                <span className="text-gray-500 text-[9px] block">Language / Dialect Spoken at Home:</span>
                <span className="font-semibold text-gray-800 border-b border-gray-300 block pb-1">{application.languageSpoken}</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="bg-gray-200 px-2 py-1 font-bold text-[10px] uppercase border-l-4 border-emerald-700 mb-2">
              Educational Background:
            </div>

            <div className="space-y-3">
              <div className="border border-gray-100 p-2 rounded">
                <span className="font-bold text-[9px] text-emerald-800 block uppercase mb-1">Senior High School</span>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-8">
                    <span className="text-[8px] text-gray-400 block">Name of School:</span>
                    <span className="font-semibold text-gray-800">{application.seniorHigh?.schoolName}</span>
                  </div>
                  <div className="col-span-4">
                    <span className="text-[8px] text-gray-400 block">Year Graduated:</span>
                    <span className="font-semibold text-gray-800">{application.seniorHigh?.yearGraduated}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-300">
            <p className="text-center font-medium italic text-[10px] text-gray-600 mb-6">
              "I hereby certify that the above information is true and correct."
            </p>

            <div className="grid grid-cols-2 gap-12 mt-10">
              <div className="text-center">
                <div className="border-b border-black h-8 flex items-end justify-center">
                  <span className="font-serif italic text-sm text-blue-800 font-bold mb-0.5">
                    {application.firstName} {application.lastName}
                  </span>
                </div>
                <p className="text-[8px] text-gray-500 uppercase font-semibold mt-1">Signature of Applicant</p>
              </div>
              <div className="text-center">
                <div className="border-b border-black h-8 flex items-end justify-center">
                  <span className="font-mono text-[10px] font-semibold mb-0.5">
                    {new Date(application.submissionDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-[8px] text-gray-500 uppercase font-semibold mt-1">Date</p>
              </div>
            </div>
          </div>

          <div className="mt-20 border-t border-black pt-1 flex justify-between text-[8px] font-mono text-gray-500">
            <span>ADM-FR-002</span>
            <span>Rev.: 3</span>
            <span>Effectivity Date: June 3, 2024</span>
            <span>Page 2 of 2</span>
          </div>
        </div>

      </div>
    </div>
  );
}
