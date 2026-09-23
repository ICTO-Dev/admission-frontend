import { useState, useEffect } from "react";
import { StudentType, HousingCondition, BirthOrder } from '../../../../config/types.js';
import { CBSUA_COURSES } from '../../../../config/courses.js';
import { submitApplication } from '../../../../services/mockDb.js';
import { Upload, Plus, Trash2, ArrowLeft, ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";

export default function WizardForm({ onSubmitSuccess }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [studentType, setStudentType] = useState(StudentType.FRESHMAN);
  const [lrn, setLrn] = useState("");
  const [course1, setCourse1] = useState(CBSUA_COURSES[0]);
  const [course2, setCourse2] = useState(CBSUA_COURSES[1]);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [presentAddress, setPresentAddress] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [age, setAge] = useState(18);
  const [sex, setSex] = useState("Male");
  const [civilStatus, setCivilStatus] = useState("Single");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [religion, setReligion] = useState("Roman Catholic");
  const [nationality, setNationality] = useState("Filipino");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [photoBase64, setPhotoBase64] = useState(null);
  const [campus, setCampus] = useState("Pili");

  useEffect(() => {
    if (dateOfBirth) {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge > 0 ? calculatedAge : 18);
    }
  }, [dateOfBirth]);

  const [fatherName, setFatherName] = useState("");
  const [fatherAge, setFatherAge] = useState("");
  const [fatherBirthplace, setFatherBirthplace] = useState("");
  const [fatherEducation, setFatherEducation] = useState("");
  const [fatherContact, setFatherContact] = useState("");
  const [fatherOccupation, setFatherOccupation] = useState("");
  const [fatherWorkplace, setFatherWorkplace] = useState("");
  const [fatherLiving, setFatherLiving] = useState("Living");
  const [fatherCauseOfDeath, setFatherCauseOfDeath] = useState("");
  const [fatherLivingWithFamily, setFatherLivingWithFamily] = useState("Yes");

  const [motherName, setMotherName] = useState("");
  const [motherAge, setMotherAge] = useState("");
  const [motherBirthplace, setMotherBirthplace] = useState("");
  const [motherEducation, setMotherEducation] = useState("");
  const [motherContact, setMotherContact] = useState("");
  const [motherOccupation, setMotherOccupation] = useState("");
  const [motherWorkplace, setMotherWorkplace] = useState("");
  const [motherLiving, setMotherLiving] = useState("Living");
  const [motherCauseOfDeath, setMotherCauseOfDeath] = useState("");
  const [motherLivingWithFamily, setMotherLivingWithFamily] = useState("Yes");

  const [spouseName, setSpouseName] = useState("");
  const [spouseAge, setSpouseAge] = useState("");
  const [spouseBirthplace, setSpouseBirthplace] = useState("");
  const [spouseEducation, setSpouseEducation] = useState("");
  const [spouseContact, setSpouseContact] = useState("");
  const [spouseOccupation, setSpouseOccupation] = useState("");
  const [spouseWorkplace, setSpouseWorkplace] = useState("");
  const [spouseLiving, setSpouseLiving] = useState("Living");
  const [spouseLivingWithFamily, setSpouseLivingWithFamily] = useState("Yes");
  const [spouseDependents, setSpouseDependents] = useState("0");

  const [birthOrder, setBirthOrder] = useState(BirthOrder.ELDEST);
  const [birthOrderOther, setBirthOrderOther] = useState("");
  const [siblings, setSiblings] = useState([]);
  const [housingCondition, setHousingCondition] = useState(HousingCondition.OWNED);
  const [familyMonthlyIncome, setFamilyMonthlyIncome] = useState("15,000 PHP");
  const [languageSpoken, setLanguageSpoken] = useState("Bicolano, Tagalog, English");

  const [elemName, setElemName] = useState("");
  const [elemGradYear, setElemGradYear] = useState("");
  const [elemAddress, setElemAddress] = useState("");
  const [elemAwards, setElemAwards] = useState("");

  const [jhsName, setJhsName] = useState("");
  const [jhsGradYear, setJhsGradYear] = useState("");
  const [jhsAddress, setJhsAddress] = useState("");
  const [jhsAwards, setJhsAwards] = useState("");

  const [shsName, setShsName] = useState("");
  const [shsGradYear, setShsGradYear] = useState("");
  const [shsAddress, setShsAddress] = useState("");
  const [shsTrack, setShsTrack] = useState("STEM (Science, Technology, Engineering, and Mathematics)");
  const [shsAwards, setShsAwards] = useState("");
  const [shsAvgG11, setShsAvgG11] = useState("");
  const [shsAvgG12, setShsAvgG12] = useState("");

  const [collName, setCollName] = useState("");
  const [collYears, setCollYears] = useState("");
  const [collAddress, setCollAddress] = useState("");
  const [collCourse, setCollCourse] = useState("");
  const [collAwards, setCollAwards] = useState("");
  const [collGWA, setCollGWA] = useState("");

  const [firstGenStudent, setFirstGenStudent] = useState(true);
  const [familyCollegeCount, setFamilyCollegeCount] = useState("0");
  const [futureOutlook, setFutureOutlook] = useState("");

  const [pwdStatus, setPwdStatus] = useState(false);
  const [pwdSpecs, setPwdSpecs] = useState("");
  const [hospitalizedStatus, setHospitalizedStatus] = useState(false);
  const [hospitalizedReasons, setHospitalizedReasons] = useState("");

  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState("");
  const [emergencyAddress, setEmergencyAddress] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  const handleAddSibling = () => {
    const newSib = {
      id: `sib-${Date.now()}-${Math.random()}`,
      name: "",
      age: "",
      sex: "F",
      civilStatus: "Single",
      educationalAttainment: ""
    };
    setSiblings([...siblings, newSib]);
  };

  const handleSiblingChange = (id, field, value) => {
    setSiblings(
      siblings.map((sib) => {
        if (sib.id === id) {
          return { ...sib, [field]: value };
        }
        return sib;
      })
    );
  };

  const handleRemoveSibling = (id) => {
    setSiblings(siblings.filter((sib) => sib.id !== id));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be smaller than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (currentStep) => {
    setErrorMsg("");
    if (currentStep === 1) {
      if (!lastName.trim() || !firstName.trim()) {
        setErrorMsg("Please fill out your Last Name and Given Name.");
        return false;
      }
      if (!dateOfBirth) {
        setErrorMsg("Please specify your Date of Birth.");
        return false;
      }
      if (!lrn || lrn.trim().length !== 12 || isNaN(Number(lrn))) {
        setErrorMsg("LRN must be a valid 12-digit number.");
        return false;
      }
      if (!emailAddress.trim() || !emailAddress.includes("@")) {
        setErrorMsg("Please provide a valid email address.");
        return false;
      }
      if (!mobileNumber.trim()) {
        setErrorMsg("Please enter your Mobile Number.");
        return false;
      }
      if (!presentAddress.trim() || !permanentAddress.trim()) {
        setErrorMsg("Both Present and Permanent Addresses are required.");
        return false;
      }
      if (course1 === course2) {
        setErrorMsg("Your 1st and 2nd course choices must be different.");
        return false;
      }
    }
    if (currentStep === 2) {
      if (!fatherName.trim() || !motherName.trim()) {
        setErrorMsg("Father's Name and Mother's Name are required.");
        return false;
      }
    }
    if (currentStep === 3) {
      if (!elemName.trim() || !elemGradYear.trim()) {
        setErrorMsg("Elementary School Name and Year of Graduation are required.");
        return false;
      }
      if (!jhsName.trim() || !jhsGradYear.trim()) {
        setErrorMsg("Junior High School Name and Year of Graduation are required.");
        return false;
      }
      if (!shsName.trim() || !shsGradYear.trim()) {
        setErrorMsg("Senior High School Name and Year of Graduation are required.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;
    if (!emergencyName.trim() || !emergencyRelation.trim() || !emergencyContact.trim() || !emergencyAddress.trim()) {
      setErrorMsg("Please fill out all Emergency Contact details.");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg("");

    const payload = {
      courseApplied1st: course1,
      courseApplied2nd: course2,
      schoolYear: "2026-2027",
      studentType,
      campus,
      lrn,
      lastName,
      firstName,
      middleName,
      presentAddress,
      permanentAddress,
      photoUrl: photoBase64,
      dateOfBirth,
      age,
      sex,
      civilStatus,
      placeOfBirth,
      religion,
      nationality,
      mobileNumber,
      emailAddress,
      fatherProfile: {
        fullName: fatherName,
        age: fatherAge,
        birthplace: fatherBirthplace,
        educationalAttainment: fatherEducation,
        contactNumber: fatherContact,
        occupation: fatherOccupation,
        placeOfWork: fatherWorkplace,
        livingStatus: fatherLiving,
        causeOfDeath: fatherCauseOfDeath,
        livingWithFamily: fatherLivingWithFamily
      },
      motherProfile: {
        fullName: motherName,
        age: motherAge,
        birthplace: motherBirthplace,
        educationalAttainment: motherEducation,
        contactNumber: motherContact,
        occupation: motherOccupation,
        placeOfWork: motherWorkplace,
        livingStatus: motherLiving,
        causeOfDeath: motherCauseOfDeath,
        livingWithFamily: motherLivingWithFamily
      },
      spouseProfile: civilStatus === "Married" ? {
        fullName: spouseName,
        age: spouseAge,
        birthplace: spouseBirthplace,
        educationalAttainment: spouseEducation,
        contactNumber: spouseContact,
        occupation: spouseOccupation,
        placeOfWork: spouseWorkplace,
        livingStatus: spouseLiving,
        livingWithFamily: spouseLivingWithFamily
      } : undefined,
      numberOfDependents: civilStatus === "Married" ? spouseDependents : undefined,
      birthOrder,
      birthOrderOther,
      siblings,
      housingCondition,
      familyMonthlyIncome,
      languageSpoken,
      elementary: {
        schoolName: elemName,
        address: elemAddress,
        yearGraduated: elemGradYear,
        awardsHonors: elemAwards
      },
      juniorHigh: {
        schoolName: jhsName,
        address: jhsAddress,
        yearGraduated: jhsGradYear,
        awardsHonors: jhsAwards
      },
      seniorHigh: {
        schoolName: shsName,
        address: shsAddress,
        trackStrand: shsTrack,
        yearGraduated: shsGradYear,
        awardsHonors: shsAwards,
        gwaG11: shsAvgG11,
        gwaG12: shsAvgG12
      },
      college: (studentType === StudentType.TRANSFEREE || studentType === StudentType.SECOND_COURSER) ? {
        schoolName: collName,
        address: collAddress,
        inclusiveYears: collYears,
        course: collCourse,
        gwa: collGWA,
        awardsHonors: collAwards
      } : undefined,
      firstGenerationStudent: firstGenStudent,
      familyCollegeGraduatesCount: familyCollegeCount,
      futureOutlook,
      pwdStatus,
      pwdSpecs: pwdStatus ? pwdSpecs : undefined,
      hospitalizedStatus,
      hospitalizedReasons: hospitalizedStatus ? hospitalizedReasons : undefined,
      emergencyContact: {
        name: emergencyName,
        relation: emergencyRelation,
        address: emergencyAddress,
        contactNo: emergencyContact
      }
    };

    try {
      const result = await submitApplication(payload);
      if (onSubmitSuccess) {
        onSubmitSuccess(result.id);
      }
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please check your inputs and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 p-6 relative">
        <div className="flex justify-between items-center relative z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-sans">CBSUA Student Application</h2>
            <p className="text-xs text-slate-500 mt-1">Digital Student Directory Form (ADM-FR-002) - Rev.: 3</p>
          </div>
          <div className="hidden sm:flex bg-emerald-50 p-2 rounded border border-emerald-100 items-center gap-1 text-[11px] font-bold text-emerald-700">
            <Sparkles size={12} className="text-emerald-600" />
            <span>Pre-filled PDF Ready</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-4 gap-2 relative z-10 text-center text-xs">
          {[
            { s: 1, name: "Personal" },
            { s: 2, name: "Family" },
            { s: 3, name: "Education" },
            { s: 4, name: "Health" }
          ].map((item) => (
            <div key={item.s} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border transition-all duration-300 ${
                  step === item.s
                    ? "bg-emerald-600 text-white border-emerald-600 scale-105 shadow-sm"
                    : step > item.s
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-100 text-slate-400 border-slate-200"
                }`}
              >
                {item.s}
              </div>
              <span
                className={`mt-1 text-[11px] font-semibold hidden md:inline ${
                  step === item.s ? "text-emerald-700 font-bold" : "text-slate-400"
                }`}
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 m-6 text-sm text-rose-800 rounded-r-lg flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg("")} className="text-rose-500 hover:text-rose-700 font-bold ml-2">×</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
        {step === 1 && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider">Step 1: Student Type & Personal details</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Campus Choice</label>
                <select
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  className="w-full border border-emerald-100 rounded-lg p-2.5 bg-emerald-50/30 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm font-semibold"
                >
                  <option value="Pili">Pili (Main)</option>
                  <option value="Pasacao">Pasacao</option>
                  <option value="Calabanga">Calabanga</option>
                  <option value="Sipocot">Sipocot</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Student Admission Type</label>
                <select
                  value={studentType}
                  onChange={(e) => setStudentType(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm font-medium"
                >
                  <option value={StudentType.FRESHMAN}>Freshman</option>
                  <option value={StudentType.TRANSFEREE}>Transferee</option>
                  <option value={StudentType.SECOND_COURSER}>Second Courser</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">LRN (Learner Reference No.)</label>
                <input
                  type="text"
                  maxLength={12}
                  placeholder="12-digit number"
                  value={lrn}
                  onChange={(e) => setLrn(e.target.value.replace(/\D/g, ""))}
                  className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm font-mono tracking-widest"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">School Year (SY)</label>
                <input
                  type="text"
                  value="2026-2027"
                  disabled
                  className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-100 text-gray-500 text-sm font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-emerald-50/40 p-4 rounded-xl border border-emerald-100">
              <div>
                <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">1st Choice Course Applied For</label>
                <select
                  value={course1}
                  onChange={(e) => setCourse1(e.target.value)}
                  className="w-full border border-emerald-200 rounded-lg p-2.5 bg-white text-emerald-950 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                >
                  {CBSUA_COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">2nd Choice Course Applied For</label>
                <select
                  value={course2}
                  onChange={(e) => setCourse2(e.target.value)}
                  className="w-full border border-emerald-200 rounded-lg p-2.5 bg-white text-emerald-950 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                >
                  {CBSUA_COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-full md:w-44 flex flex-col items-center">
                <span className="block text-xs font-semibold text-gray-500 uppercase mb-1 text-center">Applicant Photo</span>
                <div className="w-[130px] h-[130px] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center relative overflow-hidden bg-gray-50/50 group hover:border-emerald-700 transition-colors">
                  {photoBase64 ? (
                    <>
                      <img src={photoBase64} alt="Applicant preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPhotoBase64(null)}
                        className="absolute inset-0 bg-black/60 text-white text-[10px] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      >
                        Change Photo
                      </button>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center p-2 text-center h-full w-full">
                      <Upload size={20} className="text-gray-400 group-hover:text-emerald-700 transition-colors" />
                      <span className="text-[9px] text-gray-400 uppercase font-bold mt-2">1.5 x 1.5 Photo</span>
                      <span className="text-[7px] text-gray-300 mt-0.5">Click to browse</span>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Santos"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Given Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Clara"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Middle Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Delgado"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Age</label>
                  <input
                    type="text"
                    disabled
                    value={age ? `${age} yrs old` : ""}
                    className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-100 text-gray-500 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Sex</label>
                  <div className="flex gap-4 p-2">
                    <label className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700">
                      <input type="radio" value="Male" checked={sex === "Male"} onChange={() => setSex("Male")} className="text-emerald-700 focus:ring-emerald-700" />
                      <span>Male</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700">
                      <input type="radio" value="Female" checked={sex === "Female"} onChange={() => setSex("Female")} className="text-emerald-700 focus:ring-emerald-700" />
                      <span>Female</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Present Address</label>
                <textarea
                  rows={2}
                  required
                  placeholder="House No, Zone, Barangay, Municipality, Province"
                  value={presentAddress}
                  onChange={(e) => setPresentAddress(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Permanent Address</label>
                <textarea
                  rows={2}
                  required
                  placeholder="House No, Zone, Barangay, Municipality, Province"
                  value={permanentAddress}
                  onChange={(e) => setPermanentAddress(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Mobile Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 09171234567"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                  className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="applicant@gmail.com"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider">Step 2: Family Background & Socio-demographics</h3>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
              <h4 className="text-sm font-bold text-gray-700 uppercase border-b border-gray-200 pb-1.5">Father's Profile</h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-5">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Age</label>
                  <input
                    type="text"
                    value={fatherAge}
                    onChange={(e) => setFatherAge(e.target.value.replace(/\D/g, ""))}
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-5">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Occupation</label>
                  <input
                    type="text"
                    value={fatherOccupation}
                    onChange={(e) => setFatherOccupation(e.target.value)}
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
              <h4 className="text-sm font-bold text-gray-700 uppercase border-b border-gray-200 pb-1.5">Mother's Profile (Maiden Name)</h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-5">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Age</label>
                  <input
                    type="text"
                    value={motherAge}
                    onChange={(e) => setMotherAge(e.target.value.replace(/\D/g, ""))}
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-5">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Occupation</label>
                  <input
                    type="text"
                    value={motherOccupation}
                    onChange={(e) => setMotherOccupation(e.target.value)}
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider">Step 3: Educational Background</h3>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/20 space-y-4">
              <h4 className="text-sm font-bold text-emerald-800 uppercase border-b border-emerald-100 pb-1.5">Senior High School Records</h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Name of School</label>
                  <input
                    type="text"
                    required
                    value={shsName}
                    onChange={(e) => setShsName(e.target.value)}
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Year Graduated</label>
                  <input
                    type="text"
                    required
                    placeholder="YYYY"
                    value={shsGradYear}
                    onChange={(e) => setShsGradYear(e.target.value.replace(/\D/g, ""))}
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Future Outlook: How do you see yourself five years after graduation?</label>
              <textarea
                rows={4}
                required
                placeholder="State your long-term plans, career aspirations..."
                value={futureOutlook}
                onChange={(e) => setFutureOutlook(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm italic"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider">Step 4: Health & Emergency Details</h3>
            </div>

            <div className="border border-emerald-100 rounded-xl p-4 bg-emerald-50/10 space-y-4">
              <h4 className="text-sm font-bold text-emerald-800 uppercase border-b border-emerald-100 pb-1.5">Emergency Contact Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-5">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Contact Full Name</label>
                  <input
                    type="text"
                    required
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    className="w-full border border-emerald-100 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Relation</label>
                  <input
                    type="text"
                    required
                    value={emergencyRelation}
                    onChange={(e) => setEmergencyRelation(e.target.value)}
                    className="w-full border border-emerald-100 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Contact Number</label>
                  <input
                    type="text"
                    required
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value.replace(/\D/g, ""))}
                    className="w-full border border-emerald-100 bg-white rounded-lg p-2 text-sm font-mono"
                  />
                </div>
                <div className="md:col-span-12">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Complete Address</label>
                  <input
                    type="text"
                    required
                    value={emergencyAddress}
                    onChange={(e) => setEmergencyAddress(e.target.value)}
                    className="w-full border border-emerald-100 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="rounded text-emerald-700 focus:ring-emerald-700 mt-1"
                />
                <span className="text-xs text-gray-600 font-medium leading-relaxed">
                  I hereby certify that all information supplied in this Student Directory Form is true and correct.
                </span>
              </label>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center border-t border-slate-200 pt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-bold transition uppercase tracking-wider cursor-pointer"
            >
              <span>Next Section</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition uppercase tracking-wider disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} className="text-emerald-100" />
                  <span>Submit Digital ADM-FR-002</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
