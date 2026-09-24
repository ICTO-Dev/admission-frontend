import { useState, useEffect, useRef } from "react";
import { StudentType, HousingCondition, BirthOrder } from '../../../../config/types.js';
import { useCampuses, useCourses } from '../../../../hooks/index.js';
import { submitApplication } from '../../../../services/applicationService.js';
import { Upload, Plus, Trash2, ArrowLeft, ArrowRight, CheckCircle2, Loader2, Sparkles, AlertCircle } from "lucide-react";
import AddressSelector from "../../../../components/common/AddressSelector.jsx";
import { getStepValidationError, VALIDATION_MESSAGES } from "../../validation/index.js";

export default function WizardForm({ onSubmitSuccess }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [studentType, setStudentType] = useState(StudentType.FRESHMAN);
  const [lrn, setLrn] = useState("");
  const [selectedCampusId, setSelectedCampusId] = useState("");
  const [campus, setCampus] = useState("");
  const [course1, setCourse1] = useState("");
  const [course2, setCourse2] = useState("");

  const { data: campuses = [], isLoading: isLoadingCampuses } = useCampuses();
  const { data: courses = [], isLoading: isLoadingCourses } = useCourses(
    { campus_id: selectedCampusId, status: 1 },
    { enabled: Boolean(selectedCampusId) }
  );

  const handleCampusChange = (e) => {
    const val = e.target.value;
    setSelectedCampusId(val);
    const chosen = campuses.find((c) => String(c.id) === String(val));
    setCampus(chosen ? chosen.name : "");
    setCourse1("");
    setCourse2("");
  };

  const handleCourse1Change = (e) => {
    setCourse1(e.target.value);
    setCourse2("");
  };

  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [presentAddress, setPresentAddress] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [isSameAddress, setIsSameAddress] = useState(false);
  const [barangayId, setBarangayId] = useState(null);

  const handlePresentAddressChange = (formattedAddress, geoDetails) => {
    setPresentAddress(formattedAddress);
    if (geoDetails?.barangay?.id) {
      setBarangayId(geoDetails.barangay.id);
    }
    if (isSameAddress) {
      setPermanentAddress(formattedAddress);
    }
  };

  const handlePermanentAddressChange = (formattedAddress, geoDetails) => {
    setPermanentAddress(formattedAddress);
    if (!isSameAddress && geoDetails?.barangay?.id) {
      setBarangayId(geoDetails.barangay.id);
    }
  };

  const handleToggleSameAddress = (checked) => {
    setIsSameAddress(checked);
    if (checked) {
      setPermanentAddress(presentAddress);
    } else {
      setPermanentAddress("");
    }
  };
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [civilStatus, setCivilStatus] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [religion, setReligion] = useState("");
  const [nationality, setNationality] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [photoBase64, setPhotoBase64] = useState(null);
  const [isIndigenous, setIsIndigenous] = useState(null);
  const [indigenousGroup, setIndigenousGroup] = useState("");
  const [isSoloParent, setIsSoloParent] = useState(null);

  useEffect(() => {
    if (dateOfBirth) {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge > 0 ? calculatedAge : "");
    } else {
      setAge("");
    }
  }, [dateOfBirth]);

  const [fatherName, setFatherName] = useState("");
  const [fatherAge, setFatherAge] = useState("");
  const [fatherBirthplace, setFatherBirthplace] = useState("");
  const [fatherEducation, setFatherEducation] = useState("");
  const [fatherContact, setFatherContact] = useState("");
  const [fatherOccupation, setFatherOccupation] = useState("");
  const [fatherWorkplace, setFatherWorkplace] = useState("");
  const [fatherLiving, setFatherLiving] = useState("");
  const [fatherCauseOfDeath, setFatherCauseOfDeath] = useState("");
  const [fatherLivingWithFamily, setFatherLivingWithFamily] = useState("");

  const [motherName, setMotherName] = useState("");
  const [motherAge, setMotherAge] = useState("");
  const [motherBirthplace, setMotherBirthplace] = useState("");
  const [motherEducation, setMotherEducation] = useState("");
  const [motherContact, setMotherContact] = useState("");
  const [motherOccupation, setMotherOccupation] = useState("");
  const [motherWorkplace, setMotherWorkplace] = useState("");
  const [motherLiving, setMotherLiving] = useState("");
  const [motherCauseOfDeath, setMotherCauseOfDeath] = useState("");
  const [motherLivingWithFamily, setMotherLivingWithFamily] = useState("");

  const [spouseName, setSpouseName] = useState("");
  const [spouseAge, setSpouseAge] = useState("");
  const [spouseBirthplace, setSpouseBirthplace] = useState("");
  const [spouseEducation, setSpouseEducation] = useState("");
  const [spouseContact, setSpouseContact] = useState("");
  const [spouseOccupation, setSpouseOccupation] = useState("");
  const [spouseWorkplace, setSpouseWorkplace] = useState("");
  const [spouseLiving, setSpouseLiving] = useState("");
  const [spouseLivingWithFamily, setSpouseLivingWithFamily] = useState("");
  const [spouseDependents, setSpouseDependents] = useState("");

  const [birthOrder, setBirthOrder] = useState("");
  const [birthOrderOther, setBirthOrderOther] = useState("");
  const [siblings, setSiblings] = useState([]);
  const [housingCondition, setHousingCondition] = useState("");
  const [familyMonthlyIncome, setFamilyMonthlyIncome] = useState("");
  const [languageSpoken, setLanguageSpoken] = useState("");

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
  const [shsTrack, setShsTrack] = useState("");
  const [shsAwards, setShsAwards] = useState("");
  const [shsAvgG11, setShsAvgG11] = useState("");
  const [shsAvgG12, setShsAvgG12] = useState("");

  const [collName, setCollName] = useState("");
  const [collYears, setCollYears] = useState("");
  const [collAddress, setCollAddress] = useState("");
  const [collCourse, setCollCourse] = useState("");
  const [collAwards, setCollAwards] = useState("");
  const [collGWA, setCollGWA] = useState("");

  const [firstGenStudent, setFirstGenStudent] = useState(null);
  const [familyCollegeCount, setFamilyCollegeCount] = useState("");
  const [futureOutlook, setFutureOutlook] = useState("");

  const [pwdStatus, setPwdStatus] = useState(null);
  const [pwdSpecs, setPwdSpecs] = useState("");
  const [hospitalizedStatus, setHospitalizedStatus] = useState(null);
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
      sex: "",
      civilStatus: "",
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

  const formTopRef = useRef(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (formTopRef.current) {
      formTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const showError = (msg) => {
    setErrorMsg(msg);
    scrollToTop();
    return false;
  };

  useEffect(() => {
    if (errorMsg) {
      scrollToTop();
    }
  }, [errorMsg]);

  const validateStep = (currentStep) => {
    setErrorMsg("");
    const error = getStepValidationError(currentStep, {
      selectedCampusId,
      course1,
      course2,
      photoBase64,
      lastName,
      firstName,
      dateOfBirth,
      sex,
      civilStatus,
      placeOfBirth,
      religion,
      nationality,
      lrn,
      presentAddress,
      permanentAddress,
      mobileNumber,
      emailAddress,
      isIndigenous,
      indigenousGroup,
      isSoloParent,
      fatherName,
      motherName,
      fatherLiving,
      fatherCauseOfDeath,
      fatherLivingWithFamily,
      motherLiving,
      motherCauseOfDeath,
      motherLivingWithFamily,
      spouseName,
      birthOrder,
      birthOrderOther,
      housingCondition,
      familyMonthlyIncome,
      languageSpoken,
      elemName,
      elemGradYear,
      jhsName,
      jhsGradYear,
      shsName,
      shsGradYear,
      shsTrack,
      studentType,
      collName,
      collCourse,
      firstGenStudent,
      familyCollegeCount,
      futureOutlook,
      pwdStatus,
      pwdSpecs,
      hospitalizedStatus,
      hospitalizedReasons,
      emergencyName,
      emergencyRelation,
      emergencyContact,
      emergencyAddress
    });

    if (error) {
      return showError(error);
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;
    setIsSubmitting(true);
    setErrorMsg("");

    const foundCourse1 = courses.find((c) => c.courseName === course1 || String(c.id) === String(course1));
    const foundCourse2 = courses.find((c) => c.courseName === course2 || String(c.id) === String(course2));

    const payload = {
      campusId: selectedCampusId ? parseInt(selectedCampusId) : undefined,
      campus,
      course1Id: foundCourse1 ? foundCourse1.id : undefined,
      course2Id: foundCourse2 ? foundCourse2.id : undefined,
      courseApplied1st: course1,
      courseApplied2nd: course2,
      barangayId: barangayId ? parseInt(barangayId) : undefined,
      schoolYear: "2026-2027",
      studentType,
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
      isIndigenous,
      indigenousGroup: isIndigenous ? indigenousGroup : undefined,
      isSoloParent,
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
      showError(err.message || VALIDATION_MESSAGES.COMMON.GENERIC_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={formTopRef} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden scroll-mt-6">
      <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-6 relative">
        <div className="flex justify-between items-center relative z-10">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-sans">CBSUA Student Application</h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">Digital Student Directory Form (ADM-FR-002) - Rev.: 3</p>
          </div>
          <div className="hidden sm:flex bg-emerald-50 p-2 rounded border border-emerald-100 items-center gap-1 text-[11px] font-bold text-emerald-700 shrink-0">
            <Sparkles size={12} className="text-emerald-600" />
            <span>Pre-filled PDF Ready</span>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 grid grid-cols-4 gap-1.5 sm:gap-2 relative z-10 text-center text-xs">
          {[
            { s: 1, name: "Personal" },
            { s: 2, name: "Family" },
            { s: 3, name: "Education" },
            { s: 4, name: "Health" }
          ].map((item) => (
            <div key={item.s} className="flex flex-col items-center">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all duration-300 ${
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
                className={`mt-1 text-[10px] sm:text-[11px] font-semibold hidden sm:inline ${
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
        <div className="bg-rose-50 border-l-4 border-rose-500 p-3.5 sm:p-4 m-3 sm:m-6 text-xs sm:text-sm text-rose-800 rounded-r-lg flex items-center justify-between shadow-sm animate-pulse">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={18} className="text-rose-600 shrink-0" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg("")} className="text-rose-500 hover:text-rose-700 font-bold ml-2 cursor-pointer text-base">×</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
        {step === 1 && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider">Step 1: Student Type & Personal details</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Campus Choice {isLoadingCampuses && <span className="text-[10px] text-emerald-600 lowercase">(loading...)</span>}
                </label>
                <select
                  value={selectedCampusId}
                  onChange={handleCampusChange}
                  className="w-full border border-emerald-100 rounded-lg p-2.5 bg-emerald-50/30 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm font-semibold"
                  required
                >
                  <option value="">-- Please Select Campus --</option>
                  {campuses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.aname ? `(${c.aname})` : ""}
                    </option>
                  ))}
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
                <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">
                  1st Choice Course Applied For {isLoadingCourses && <span className="text-[10px] text-emerald-600 lowercase">(loading...)</span>}
                </label>
                <select
                  value={course1}
                  onChange={handleCourse1Change}
                  disabled={!selectedCampusId || isLoadingCourses}
                  className="w-full border border-emerald-200 rounded-lg p-2.5 bg-white text-emerald-950 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm disabled:opacity-60 disabled:bg-gray-100"
                  required
                >
                  <option value="">
                    {!selectedCampusId
                      ? "-- Please Select Campus First --"
                      : isLoadingCourses
                      ? "Loading courses..."
                      : courses.length === 0
                      ? "No courses available for this campus"
                      : "-- Please Select 1st Choice Course --"}
                  </option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.courseName}>
                      {c.courseName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">
                  2nd Choice Course Applied For {isLoadingCourses && <span className="text-[10px] text-emerald-600 lowercase">(loading...)</span>}
                </label>
                <select
                  value={course2}
                  onChange={(e) => setCourse2(e.target.value)}
                  disabled={!selectedCampusId || !course1 || isLoadingCourses}
                  className="w-full border border-emerald-200 rounded-lg p-2.5 bg-white text-emerald-950 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm disabled:opacity-60 disabled:bg-gray-100"
                  required
                >
                  <option value="">
                    {!selectedCampusId
                      ? "-- Please Select Campus First --"
                      : isLoadingCourses
                      ? "Loading courses..."
                      : !course1
                      ? "-- Please Select 1st Choice Course First --"
                      : courses.filter((c) => c.courseName !== course1).length === 0
                      ? "No other courses available"
                      : "-- Please Select 2nd Choice Course --"}
                  </option>
                  {courses
                    .filter((c) => c.courseName !== course1)
                    .map((c) => (
                      <option key={c.id} value={c.courseName}>
                        {c.courseName}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-full md:w-44 flex flex-col items-center">
                <span className="block text-xs font-semibold text-gray-700 uppercase mb-1 text-center">
                  Applicant Photo <span className="text-rose-500">*</span>
                </span>
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

              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
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
                    <label className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 cursor-pointer">
                      <input type="radio" value="Male" checked={sex === "Male"} onChange={() => setSex("Male")} className="text-emerald-700 focus:ring-emerald-700" />
                      <span>Male</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 cursor-pointer">
                      <input type="radio" value="Female" checked={sex === "Female"} onChange={() => setSex("Female")} className="text-emerald-700 focus:ring-emerald-700" />
                      <span>Female</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Civil Status *</label>
                  <select
                    value={civilStatus}
                    onChange={(e) => setCivilStatus(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm font-medium"
                  >
                    <option value="">-- Please Select Civil Status --</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Place of Birth</label>
                  <input
                    type="text"
                    required
                    placeholder="Municipality / City, Province"
                    value={placeOfBirth}
                    onChange={(e) => setPlaceOfBirth(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Religion</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Roman Catholic"
                    value={religion}
                    onChange={(e) => setReligion(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nationality</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Filipino"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm font-medium"
                  />
                </div>

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
              <AddressSelector
                title="Present Address"
                required
                value={presentAddress}
                onChange={handlePresentAddressChange}
              />
              <AddressSelector
                title="Permanent Address"
                required
                value={permanentAddress}
                onChange={handlePermanentAddressChange}
                showSameAsCheckbox
                isSameAsPresent={isSameAddress}
                onToggleSameAs={handleToggleSameAddress}
                syncedAddress={presentAddress}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Are you a member of an ethnic/indigenous group? if yes, kindly specify.
                </label>
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3">
                  <label className="inline-flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer shrink-0">
                    <input
                      type="radio"
                      name="indigenousStatus"
                      checked={isIndigenous === false}
                      onChange={() => {
                        setIsIndigenous(false);
                        setIndigenousGroup("");
                      }}
                      className="text-emerald-700 focus:ring-emerald-700"
                    />
                    <span>No</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer shrink-0">
                    <input
                      type="radio"
                      name="indigenousStatus"
                      checked={isIndigenous === true}
                      onChange={() => setIsIndigenous(true)}
                      className="text-emerald-700 focus:ring-emerald-700"
                    />
                    <span>Yes</span>
                  </label>
                  {isIndigenous ? (
                    <input
                      type="text"
                      placeholder="Kindly specify group (e.g. Agta, Aeta)"
                      value={indigenousGroup}
                      onChange={(e) => setIndigenousGroup(e.target.value)}
                      className="flex-1 border border-gray-200 rounded-lg p-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs font-medium"
                    />
                  ) : (
                    <span className="text-xs text-gray-400 italic">None / Not applicable</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Are you a solo parents?
                </label>
                <div className="flex items-center gap-4 h-auto sm:h-9 py-1 sm:py-0">
                  <label className="inline-flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="soloParentStatus"
                      checked={isSoloParent === true}
                      onChange={() => setIsSoloParent(true)}
                      className="text-emerald-700 focus:ring-emerald-700"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="soloParentStatus"
                      checked={isSoloParent === false}
                      onChange={() => setIsSoloParent(false)}
                      className="text-emerald-700 focus:ring-emerald-700"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider">Step 2: Family Background & Socio-demographics</h3>
            </div>

            {/* Father's Profile */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
              <h4 className="text-sm font-bold text-gray-700 uppercase border-b border-gray-200 pb-1.5">Father's Profile</h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
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
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Birthplace</label>
                  <input
                    type="text"
                    value={fatherBirthplace}
                    onChange={(e) => setFatherBirthplace(e.target.value)}
                    placeholder="e.g. Naga City"
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-6">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Educational Attainment</label>
                  <input
                    type="text"
                    value={fatherEducation}
                    onChange={(e) => setFatherEducation(e.target.value)}
                    placeholder="e.g. College Graduate, High School"
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-6">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Contact Number</label>
                  <input
                    type="text"
                    value={fatherContact}
                    onChange={(e) => setFatherContact(e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 09171234567"
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm font-mono"
                  />
                </div>
                <div className="md:col-span-6">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Occupation</label>
                  <input
                    type="text"
                    value={fatherOccupation}
                    onChange={(e) => setFatherOccupation(e.target.value)}
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-6">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Place of Work</label>
                  <input
                    type="text"
                    value={fatherWorkplace}
                    onChange={(e) => setFatherWorkplace(e.target.value)}
                    placeholder="e.g. Pili, Camarines Sur"
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-6 flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                  <span className="text-xs font-semibold text-gray-600">Status:</span>
                  <label className="inline-flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="fatherLiving"
                      value="Living"
                      checked={fatherLiving === "Living"}
                      onChange={() => setFatherLiving("Living")}
                      className="text-emerald-700 focus:ring-emerald-700"
                    />
                    <span>Living</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="fatherLiving"
                      value="Deceased"
                      checked={fatherLiving === "Deceased"}
                      onChange={() => setFatherLiving("Deceased")}
                      className="text-emerald-700 focus:ring-emerald-700"
                    />
                    <span>Deceased</span>
                  </label>
                  {fatherLiving === "Deceased" && (
                    <input
                      type="text"
                      placeholder="Cause of Death"
                      value={fatherCauseOfDeath}
                      onChange={(e) => setFatherCauseOfDeath(e.target.value)}
                      className="flex-1 border border-gray-200 bg-white rounded p-1 text-xs"
                    />
                  )}
                </div>
                <div className="md:col-span-6 flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
                  <span className="text-xs font-semibold text-gray-600">Living with Family?</span>
                  {["Yes", "No", "Abroad", "Separated"].map((opt) => (
                    <label key={opt} className="inline-flex items-center gap-1 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name="fatherLivingWithFamily"
                        value={opt}
                        checked={fatherLivingWithFamily === opt}
                        onChange={() => setFatherLivingWithFamily(opt)}
                        className="text-emerald-700 focus:ring-emerald-700"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Mother's Profile */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
              <h4 className="text-sm font-bold text-gray-700 uppercase border-b border-gray-200 pb-1.5">Mother's Profile (Maiden Name)</h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
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
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Birthplace</label>
                  <input
                    type="text"
                    value={motherBirthplace}
                    onChange={(e) => setMotherBirthplace(e.target.value)}
                    placeholder="e.g. Pili, Camarines Sur"
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-6">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Educational Attainment</label>
                  <input
                    type="text"
                    value={motherEducation}
                    onChange={(e) => setMotherEducation(e.target.value)}
                    placeholder="e.g. College Graduate, High School"
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-6">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Contact Number</label>
                  <input
                    type="text"
                    value={motherContact}
                    onChange={(e) => setMotherContact(e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 09181234567"
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm font-mono"
                  />
                </div>
                <div className="md:col-span-6">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Occupation</label>
                  <input
                    type="text"
                    value={motherOccupation}
                    onChange={(e) => setMotherOccupation(e.target.value)}
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-6">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Place of Work</label>
                  <input
                    type="text"
                    value={motherWorkplace}
                    onChange={(e) => setMotherWorkplace(e.target.value)}
                    placeholder="e.g. N/A or Company Name"
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-6 flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                  <span className="text-xs font-semibold text-gray-600">Status:</span>
                  <label className="inline-flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="motherLiving"
                      value="Living"
                      checked={motherLiving === "Living"}
                      onChange={() => setMotherLiving("Living")}
                      className="text-emerald-700 focus:ring-emerald-700"
                    />
                    <span>Living</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="motherLiving"
                      value="Deceased"
                      checked={motherLiving === "Deceased"}
                      onChange={() => setMotherLiving("Deceased")}
                      className="text-emerald-700 focus:ring-emerald-700"
                    />
                    <span>Deceased</span>
                  </label>
                  {motherLiving === "Deceased" && (
                    <input
                      type="text"
                      placeholder="Cause of Death"
                      value={motherCauseOfDeath}
                      onChange={(e) => setMotherCauseOfDeath(e.target.value)}
                      className="flex-1 border border-gray-200 bg-white rounded p-1 text-xs"
                    />
                  )}
                </div>
                <div className="md:col-span-6 flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
                  <span className="text-xs font-semibold text-gray-600">Living with Family?</span>
                  {["Yes", "No", "Abroad", "Separated"].map((opt) => (
                    <label key={opt} className="inline-flex items-center gap-1 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name="motherLivingWithFamily"
                        value={opt}
                        checked={motherLivingWithFamily === opt}
                        onChange={() => setMotherLivingWithFamily(opt)}
                        className="text-emerald-700 focus:ring-emerald-700"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Spouse's Profile (For Married Applicant Only) */}
            {civilStatus === "Married" && (
              <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/30 space-y-4">
                <div className="flex items-center justify-between border-b border-blue-200 pb-1.5">
                  <h4 className="text-sm font-bold text-blue-900 uppercase">Spouse's Profile (For Married Applicant)</h4>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">Married</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-5">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      value={spouseName}
                      onChange={(e) => setSpouseName(e.target.value)}
                      className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Age</label>
                    <input
                      type="text"
                      value={spouseAge}
                      onChange={(e) => setSpouseAge(e.target.value.replace(/\D/g, ""))}
                      className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-5">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Birthplace</label>
                    <input
                      type="text"
                      value={spouseBirthplace}
                      onChange={(e) => setSpouseBirthplace(e.target.value)}
                      className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-6">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Educational Attainment</label>
                    <input
                      type="text"
                      value={spouseEducation}
                      onChange={(e) => setSpouseEducation(e.target.value)}
                      className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-6">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Contact Number</label>
                    <input
                      type="text"
                      value={spouseContact}
                      onChange={(e) => setSpouseContact(e.target.value.replace(/\D/g, ""))}
                      className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm font-mono"
                    />
                  </div>
                  <div className="md:col-span-6">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Occupation</label>
                    <input
                      type="text"
                      value={spouseOccupation}
                      onChange={(e) => setSpouseOccupation(e.target.value)}
                      className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-6">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Place of Work</label>
                    <input
                      type="text"
                      value={spouseWorkplace}
                      onChange={(e) => setSpouseWorkplace(e.target.value)}
                      className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-6 flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                    <span className="text-xs font-semibold text-gray-600">Status:</span>
                    <label className="inline-flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name="spouseLiving"
                        value="Living"
                        checked={spouseLiving === "Living"}
                        onChange={() => setSpouseLiving("Living")}
                        className="text-emerald-700 focus:ring-emerald-700"
                      />
                      <span>Living</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name="spouseLiving"
                        value="Deceased"
                        checked={spouseLiving === "Deceased"}
                        onChange={() => setSpouseLiving("Deceased")}
                        className="text-emerald-700 focus:ring-emerald-700"
                      />
                      <span>Deceased</span>
                    </label>
                  </div>
                  <div className="md:col-span-6 flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
                    <span className="text-xs font-semibold text-gray-600">Living with Family?</span>
                    {["Yes", "No", "Abroad", "Separated"].map((opt) => (
                      <label key={opt} className="inline-flex items-center gap-1 text-xs text-gray-700 cursor-pointer">
                        <input
                          type="radio"
                          name="spouseLivingWithFamily"
                          value={opt}
                          checked={spouseLivingWithFamily === opt}
                          onChange={() => setSpouseLivingWithFamily(opt)}
                          className="text-emerald-700 focus:ring-emerald-700"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                  <div className="md:col-span-6">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Number of Dependents / Children</label>
                    <input
                      type="text"
                      value={spouseDependents}
                      onChange={(e) => setSpouseDependents(e.target.value.replace(/\D/g, ""))}
                      className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Birth Order & Siblings */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Birth Order</label>
                <div className="flex flex-wrap items-center gap-4">
                  {[BirthOrder.ONLY_CHILD, BirthOrder.ELDEST, BirthOrder.MIDDLE, BirthOrder.YOUNGEST, BirthOrder.OTHERS].map((bo) => (
                    <label key={bo} className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name="birthOrder"
                        value={bo}
                        checked={birthOrder === bo}
                        onChange={() => setBirthOrder(bo)}
                        className="text-emerald-700 focus:ring-emerald-700"
                      />
                      <span>{bo}</span>
                    </label>
                  ))}
                  {birthOrder === BirthOrder.OTHERS && (
                    <input
                      type="text"
                      placeholder="Please specify"
                      value={birthOrderOther}
                      onChange={(e) => setBirthOrderOther(e.target.value)}
                      className="border border-gray-200 bg-white rounded px-2 py-1 text-xs"
                    />
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-2">
                  <div>
                    <h5 className="text-xs font-bold text-gray-700 uppercase">Siblings (Eldest to Youngest)</h5>
                    <p className="text-[10px] text-gray-400 italic">Note: Siblings means your brother/s or sister/s</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSibling}
                    className="flex items-center gap-1 text-xs bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Sibling</span>
                  </button>
                </div>

                {siblings.length === 0 ? (
                  <p className="text-xs text-gray-400 italic text-center py-2 bg-white rounded border border-dashed border-gray-200">
                    No siblings added. Click "Add Sibling" if you have brothers or sisters.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {siblings.map((sib) => (
                      <div key={sib.id} className="grid grid-cols-12 gap-2 bg-white p-2.5 rounded-lg border border-gray-200 items-center">
                        <div className="col-span-12 md:col-span-3">
                          <input
                            type="text"
                            placeholder="Sibling Full Name"
                            value={sib.name}
                            onChange={(e) => handleSiblingChange(sib.id, "name", e.target.value)}
                            className="w-full border border-gray-200 rounded p-1.5 text-xs"
                          />
                        </div>
                        <div className="col-span-4 md:col-span-1">
                          <input
                            type="text"
                            placeholder="Age"
                            value={sib.age}
                            onChange={(e) => handleSiblingChange(sib.id, "age", e.target.value.replace(/\D/g, ""))}
                            className="w-full border border-gray-200 rounded p-1.5 text-xs text-center"
                          />
                        </div>
                        <div className="col-span-4 md:col-span-2">
                          <select
                            value={sib.sex}
                            onChange={(e) => handleSiblingChange(sib.id, "sex", e.target.value)}
                            className="w-full border border-gray-200 rounded p-1.5 text-xs"
                          >
                            <option value="">Sex</option>
                            <option value="M">Male (M)</option>
                            <option value="F">Female (F)</option>
                          </select>
                        </div>
                        <div className="col-span-4 md:col-span-2">
                          <select
                            value={sib.civilStatus}
                            onChange={(e) => handleSiblingChange(sib.id, "civilStatus", e.target.value)}
                            className="w-full border border-gray-200 rounded p-1.5 text-xs"
                          >
                            <option value="">Civil Status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Widowed">Widowed</option>
                            <option value="Separated">Separated</option>
                          </select>
                        </div>
                        <div className="col-span-10 md:col-span-3">
                          <input
                            type="text"
                            placeholder="Education (e.g. HS)"
                            value={sib.educationalAttainment}
                            onChange={(e) => handleSiblingChange(sib.id, "educationalAttainment", e.target.value)}
                            className="w-full border border-gray-200 rounded p-1.5 text-xs"
                          />
                        </div>
                        <div className="col-span-2 md:col-span-1 text-center flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveSibling(sib.id)}
                            className="text-red-500 hover:text-red-700 p-1.5 cursor-pointer rounded hover:bg-red-50 transition-colors"
                            title="Remove sibling"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Housing Condition, Income & Language */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Housing Condition</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { val: HousingCondition.OWNED, label: "Owned" },
                    { val: HousingCondition.SHARED, label: "Shared with grandparents or relatives" },
                    { val: HousingCondition.RENTED, label: "Rented" },
                    { val: HousingCondition.RENT_TO_OWN, label: "Rent to Own" },
                  ].map((hc) => (
                    <label key={hc.val} className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-gray-200 text-xs font-medium text-gray-700 cursor-pointer hover:border-emerald-500">
                      <input
                        type="radio"
                        name="housingCondition"
                        value={hc.val}
                        checked={housingCondition === hc.val}
                        onChange={() => setHousingCondition(hc.val)}
                        className="text-emerald-700 focus:ring-emerald-700"
                      />
                      <span>{hc.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Family's Monthly Income</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 15,000 PHP"
                    value={familyMonthlyIncome}
                    onChange={(e) => setFamilyMonthlyIncome(e.target.value)}
                    className="w-full border border-gray-200 bg-white rounded-lg p-2.5 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Language / Dialect Spoken at Home</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bicolano, Tagalog, English"
                    value={languageSpoken}
                    onChange={(e) => setLanguageSpoken(e.target.value)}
                    className="w-full border border-gray-200 bg-white rounded-lg p-2.5 text-sm font-medium"
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

            {/* Elementary */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/20 space-y-3">
              <h4 className="text-sm font-bold text-emerald-800 uppercase border-b border-emerald-100 pb-1">Elementary School</h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-8">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Name of School</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pili Central School"
                    value={elemName}
                    onChange={(e) => setElemName(e.target.value)}
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Year Graduated</label>
                  <input
                    type="text"
                    required
                    placeholder="YYYY"
                    value={elemGradYear}
                    onChange={(e) => setElemGradYear(e.target.value.replace(/\D/g, ""))}
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm font-mono"
                  />
                </div>
                <div className="md:col-span-7">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Address</label>
                  <input
                    type="text"
                    placeholder="e.g. Pili, Camarines Sur"
                    value={elemAddress}
                    onChange={(e) => setElemAddress(e.target.value)}
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-5">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Awards / Honor</label>
                  <input
                    type="text"
                    placeholder="e.g. With Honors, N/A"
                    value={elemAwards}
                    onChange={(e) => setElemAwards(e.target.value)}
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Junior High School */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/20 space-y-3">
              <h4 className="text-sm font-bold text-emerald-800 uppercase border-b border-emerald-100 pb-1">Junior High School</h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-8">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Name of School</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pili National High School"
                    value={jhsName}
                    onChange={(e) => setJhsName(e.target.value)}
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Year Graduated</label>
                  <input
                    type="text"
                    required
                    placeholder="YYYY"
                    value={jhsGradYear}
                    onChange={(e) => setJhsGradYear(e.target.value.replace(/\D/g, ""))}
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm font-mono"
                  />
                </div>
                <div className="md:col-span-7">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Address</label>
                  <input
                    type="text"
                    placeholder="e.g. Pili, Camarines Sur"
                    value={jhsAddress}
                    onChange={(e) => setJhsAddress(e.target.value)}
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-5">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Awards / Honor</label>
                  <input
                    type="text"
                    placeholder="e.g. With High Honors, N/A"
                    value={jhsAwards}
                    onChange={(e) => setJhsAwards(e.target.value)}
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Senior High School */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/20 space-y-3">
              <h4 className="text-sm font-bold text-emerald-800 uppercase border-b border-emerald-100 pb-1">Senior High School</h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-8">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Name of School</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Camarines Sur National High School"
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
                <div className="md:col-span-7">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Address</label>
                  <input
                    type="text"
                    placeholder="e.g. Naga City"
                    value={shsAddress}
                    onChange={(e) => setShsAddress(e.target.value)}
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-5">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Awards / Honor</label>
                  <input
                    type="text"
                    placeholder="e.g. With Honors, N/A"
                    value={shsAwards}
                    onChange={(e) => setShsAwards(e.target.value)}
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-6">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Track and Strand</label>
                  <input
                    type="text"
                    placeholder="e.g. STEM, HUMSS, ABM, TVL"
                    value={shsTrack}
                    onChange={(e) => setShsTrack(e.target.value)}
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">GWA - Grade 11</label>
                  <input
                    type="text"
                    placeholder="e.g. 92.5"
                    value={shsAvgG11}
                    onChange={(e) => setShsAvgG11(e.target.value)}
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm font-mono"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">GWA - Grade 12</label>
                  <input
                    type="text"
                    placeholder="e.g. 93.0"
                    value={shsAvgG12}
                    onChange={(e) => setShsAvgG12(e.target.value)}
                    className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            {/* College (For Transferee / Second Courser) */}
            {(studentType === StudentType.TRANSFEREE || studentType === StudentType.SECOND_COURSER) && (
              <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/20 space-y-3">
                <div className="flex items-center justify-between border-b border-blue-200 pb-1">
                  <h4 className="text-sm font-bold text-blue-900 uppercase">College (For Transferee / Second Courser)</h4>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">{studentType}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-8">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Name of School</label>
                    <input
                      type="text"
                      value={collName}
                      onChange={(e) => setCollName(e.target.value)}
                      className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Inclusive Year/s</label>
                    <input
                      type="text"
                      placeholder="e.g. 2022-2024"
                      value={collYears}
                      onChange={(e) => setCollYears(e.target.value)}
                      className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-7">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Address</label>
                    <input
                      type="text"
                      value={collAddress}
                      onChange={(e) => setCollAddress(e.target.value)}
                      className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-5">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Awards / Honor</label>
                    <input
                      type="text"
                      value={collAwards}
                      onChange={(e) => setCollAwards(e.target.value)}
                      className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-7">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Course</label>
                    <input
                      type="text"
                      placeholder="e.g. BS Information Technology"
                      value={collCourse}
                      onChange={(e) => setCollCourse(e.target.value)}
                      className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-5">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">General Weighted Average (GWA)</label>
                    <input
                      type="text"
                      placeholder="e.g. 1.75"
                      value={collGWA}
                      onChange={(e) => setCollGWA(e.target.value)}
                      className="w-full border border-gray-200 bg-white rounded-lg p-2 text-sm font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* College Survey Questions */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/40 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-semibold text-gray-700">Are you the first person in your family to attend college?</span>
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="firstGen"
                      checked={firstGenStudent === false}
                      onChange={() => setFirstGenStudent(false)}
                      className="text-emerald-700 focus:ring-emerald-700"
                    />
                    <span>No</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="firstGen"
                      checked={firstGenStudent === true}
                      onChange={() => setFirstGenStudent(true)}
                      className="text-emerald-700 focus:ring-emerald-700"
                    />
                    <span>Yes</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  How many members in your family had attended college?
                </label>
                <input
                  type="text"
                  placeholder="0"
                  value={familyCollegeCount}
                  onChange={(e) => setFamilyCollegeCount(e.target.value.replace(/\D/g, ""))}
                  className="w-full sm:w-48 border border-gray-200 bg-white rounded-lg p-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  How do you see yourself five years after graduation?
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="State your long-term plans, career aspirations..."
                  value={futureOutlook}
                  onChange={(e) => setFutureOutlook(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm italic"
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider">Step 4: Health & Emergency Details</h3>
            </div>

            {/* Health Conditions */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/40 space-y-4">
              <h4 className="text-sm font-bold text-gray-700 uppercase border-b border-gray-200 pb-1.5">Health Conditions</h4>
              
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3">
                  <span className="text-xs font-semibold text-gray-700 w-full sm:w-80 shrink-0">
                    Are you a Person With Disability (PWD)?
                  </span>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name="pwdStatus"
                        checked={pwdStatus === false}
                        onChange={() => setPwdStatus(false)}
                        className="text-emerald-700 focus:ring-emerald-700"
                      />
                      <span>No</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name="pwdStatus"
                        checked={pwdStatus === true}
                        onChange={() => setPwdStatus(true)}
                        className="text-emerald-700 focus:ring-emerald-700"
                      />
                      <span>Yes</span>
                    </label>
                  </div>
                  {pwdStatus && (
                    <input
                      type="text"
                      placeholder="If yes, kindly specify"
                      value={pwdSpecs}
                      onChange={(e) => setPwdSpecs(e.target.value)}
                      className="w-full sm:flex-1 border border-gray-200 bg-white rounded-lg p-2 text-xs"
                    />
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 pt-2 border-t border-gray-200">
                  <span className="text-xs font-semibold text-gray-700 w-full sm:w-80 shrink-0">
                    Have you ever been hospitalized?
                  </span>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name="hospStatus"
                        checked={hospitalizedStatus === false}
                        onChange={() => setHospitalizedStatus(false)}
                        className="text-emerald-700 focus:ring-emerald-700"
                      />
                      <span>No</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name="hospStatus"
                        checked={hospitalizedStatus === true}
                        onChange={() => setHospitalizedStatus(true)}
                        className="text-emerald-700 focus:ring-emerald-700"
                      />
                      <span>Yes</span>
                    </label>
                  </div>
                  {hospitalizedStatus && (
                    <input
                      type="text"
                      placeholder="If yes, for what reason?"
                      value={hospitalizedReasons}
                      onChange={(e) => setHospitalizedReasons(e.target.value)}
                      className="w-full sm:flex-1 border border-gray-200 bg-white rounded-lg p-2 text-xs"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="border border-emerald-100 rounded-xl p-4 bg-emerald-50/10 space-y-4">
              <h4 className="text-sm font-bold text-emerald-800 uppercase border-b border-emerald-100 pb-1.5">Emergency Contact Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-5">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Contact Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Name of Contact Person"
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
                    placeholder="e.g. Father, Mother, Guardian"
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
                    placeholder="e.g. 09171234567"
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
                    placeholder="House No., Barangay, Municipality, Province"
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
                  className="rounded text-emerald-700 focus:ring-emerald-700 mt-1 cursor-pointer"
                />
                <span className="text-xs text-gray-600 font-medium leading-relaxed">
                  I hereby certify that all information supplied in this Student Directory Form is true and correct.
                </span>
              </label>
            </div>
          </div>
        )}


        <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold transition cursor-pointer shrink-0"
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
              className="flex items-center justify-center gap-1.5 px-5 sm:px-6 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-bold transition uppercase tracking-wider cursor-pointer shadow-sm hover:shadow"
            >
              <span>Next Section</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-5 sm:px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition uppercase tracking-wider disabled:opacity-50 cursor-pointer shadow-sm hover:shadow"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} className="text-emerald-100" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
