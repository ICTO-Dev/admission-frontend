import { ApplicationStatus, StudentType, HousingCondition, BirthOrder } from "../config/types.js";

const STORAGE_KEY = "cbsua_admission_db_v1";

export const DEFAULT_SLOTS = [
  {
    id: "slot-1",
    examDate: "2026-08-10",
    batchTime: "Batch 1: 8:00 AM - 10:00 AM",
    venue: "Main Campus - Pili",
    room: "Room 302 (Library Bldg)",
    maxCapacity: 3,
    currentEnrolledCount: 1,
  },
  {
    id: "slot-2",
    examDate: "2026-08-10",
    batchTime: "Batch 2: 10:30 AM - 12:30 PM",
    venue: "Main Campus - Pili",
    room: "Room 302 (Library Bldg)",
    maxCapacity: 15,
    currentEnrolledCount: 0,
  },
  {
    id: "slot-3",
    examDate: "2026-08-11",
    batchTime: "Batch 1: 8:00 AM - 10:00 AM",
    venue: "College of Agriculture Hall",
    room: "AVR Room A",
    maxCapacity: 20,
    currentEnrolledCount: 1,
  },
  {
    id: "slot-4",
    examDate: "2026-08-12",
    batchTime: "Batch 2: 1:30 PM - 3:30 PM",
    venue: "Pasacao Campus",
    room: "IT Lab 1",
    maxCapacity: 25,
    currentEnrolledCount: 0,
  }
];

export const DEFAULT_DAYS = [
  { id: "day-1", schoolYear: "2025-2026", dayName: "Day 1 - March 1, 2026", userId: "olano.mark01" },
  { id: "day-2", schoolYear: "2025-2026", dayName: "Day 2 - March 2, 2026", userId: "olano.mark01" },
  { id: "day-3", schoolYear: "2026-2027", dayName: "Day 1 - July 10, 2026", userId: "olano.mark01" }
];

export const DEFAULT_BATCHES = [
  { id: "batch-1", batchName: "Batch 1 (8:00 AM - 10:00 AM)", days: ["Day 1 - March 1, 2026", "Day 1 - July 10, 2026"], year: "Present", schoolYear: "2025-2026", userId: "olano.mark01" },
  { id: "batch-2", batchName: "Batch 2 (10:30 AM - 12:30 PM)", days: ["Day 1 - March 1, 2026", "Day 2 - March 2, 2026"], year: "2025", schoolYear: "2025-2026", userId: "olano.mark01" }
];

export const DEFAULT_VENUES = [
  { id: "venue-1", venueName: "Main Campus - Pili", userId: "olano.mark01" },
  { id: "venue-2", venueName: "Pasacao Campus", userId: "olano.mark01" },
  { id: "venue-3", venueName: "Calabanga Campus", userId: "olano.mark01" }
];

export const DEFAULT_ROOMS = [
  { id: "room-1", roomName: "Room 302 (Library Bldg)", venueName: "Main Campus - Pili", totalSeat: 30, status: "Not Full", userId: "olano.mark01", schoolYear: "2025-2026" },
  { id: "room-2", roomName: "AVR Room A", venueName: "Main Campus - Pili", totalSeat: 40, status: "Not Full", userId: "olano.mark01", schoolYear: "2025-2026" },
  { id: "room-3", roomName: "IT Lab 1", venueName: "Pasacao Campus", totalSeat: 25, status: "Not Full", userId: "olano.mark01", schoolYear: "2025-2026" }
];

export const DEFAULT_APPLICATIONS = [
  {
    id: "APP-2026-0001",
    courseApplied1st: "Bachelor of Science in Agriculture (BSA)",
    courseApplied2nd: "Bachelor of Science in Agricultural and Biosystems Engineering (BSABE)",
    schoolYear: "2026-2027",
    status: ApplicationStatus.PENDING,
    submissionDate: "2026-07-15T09:30:00Z",
    studentType: StudentType.FRESHMAN,
    campus: "Pili",
    lrn: "123456789012",
    lastName: "Santos",
    firstName: "Maria Clara",
    middleName: "Delgado",
    presentAddress: "Zone 3, San Jose, Pili, Camarines Sur",
    permanentAddress: "Zone 3, San Jose, Pili, Camarines Sur",
    dateOfBirth: "2008-05-12",
    age: 18,
    sex: "Female",
    civilStatus: "Single",
    placeOfBirth: "Pili, Camarines Sur",
    religion: "Roman Catholic",
    nationality: "Filipino",
    mobileNumber: "09171234567",
    emailAddress: "maria.santos@gmail.com",
    fatherProfile: {
      fullName: "Juan Delgado Santos",
      age: 48,
      birthplace: "Naga City",
      educationalAttainment: "College Graduate",
      contactNumber: "09179876543",
      occupation: "Farmer",
      placeOfWork: "Pili, Camarines Sur",
      livingStatus: "Living",
      livingWithFamily: "Yes",
    },
    motherProfile: {
      fullName: "Elena Delgado Santos",
      age: 45,
      birthplace: "Pili, Camarines Sur",
      educationalAttainment: "High School Graduate",
      contactNumber: "09181234567",
      occupation: "Housewife",
      placeOfWork: "N/A",
      livingStatus: "Living",
      livingWithFamily: "Yes",
    },
    birthOrder: BirthOrder.ELDEST,
    siblings: [
      {
        id: "sib-1",
        name: "Jose Santos",
        age: 14,
        sex: "M",
        civilStatus: "Single",
        educationalAttainment: "Junior High School",
      }
    ],
    housingCondition: HousingCondition.OWNED,
    familyMonthlyIncome: "15,000 PHP",
    languageSpoken: "Bicolano, Tagalog, English",
    elementary: {
      schoolName: "Pili Central School",
      address: "Pili, Camarines Sur",
      yearGraduated: "2020",
      awardsHonors: "With Honors",
    },
    juniorHigh: {
      schoolName: "Pili National High School",
      address: "Pili, Camarines Sur",
      yearGraduated: "2024",
      awardsHonors: "With High Honors",
    },
    seniorHigh: {
      schoolName: "Camarines Sur National High School",
      address: "Naga City",
      trackStrand: "STEM (Science, Technology, Engineering, and Mathematics)",
      yearGraduated: "2026",
      awardsHonors: "With Honors",
      gwaG11: "92.5",
      gwaG12: "93.0",
    },
    firstGenerationStudent: true,
    familyCollegeGraduatesCount: 0,
    futureOutlook: "Five years from now, I envision myself as a licensed Agriculturist working with CBSUA research laboratories or the Department of Agriculture to innovate sustainable farming in the Bicol Region.",
    pwdStatus: false,
    hospitalizedStatus: false,
    emergencyContact: {
      name: "Juan Delgado Santos",
      relation: "Father",
      address: "Zone 3, San Jose, Pili, Camarines Sur",
      contactNo: "09179876543",
    },
    notificationsSent: [],
  },
  {
    id: "APP-2026-0002",
    courseApplied1st: "Bachelor of Science in Information Technology (BSIT)",
    courseApplied2nd: "Bachelor of Science in Computer Science (BSCS)",
    schoolYear: "2026-2027",
    status: ApplicationStatus.PENDING,
    submissionDate: "2026-07-16T14:15:00Z",
    studentType: StudentType.FRESHMAN,
    campus: "Pili",
    lrn: "987654321098",
    lastName: "Alvarez",
    firstName: "Gabriel",
    middleName: "Bautista",
    presentAddress: "Brgy. San Agustin, Iriga City, Camarines Sur",
    permanentAddress: "Brgy. San Agustin, Iriga City, Camarines Sur",
    dateOfBirth: "2007-10-22",
    age: 18,
    sex: "Male",
    civilStatus: "Single",
    placeOfBirth: "Iriga City",
    religion: "Protestant",
    nationality: "Filipino",
    mobileNumber: "09187654321",
    emailAddress: "gabriel.alvarez@yahoo.com",
    fatherProfile: {
      fullName: "Roberto Bautista Alvarez",
      age: 52,
      birthplace: "Iriga City",
      educationalAttainment: "High School Graduate",
      contactNumber: "09182345678",
      occupation: "Carpenter",
      placeOfWork: "Iriga City",
      livingStatus: "Living",
      livingWithFamily: "Yes",
    },
    motherProfile: {
      fullName: "Alicia Bautista Alvarez",
      age: 49,
      birthplace: "Nabua, Camarines Sur",
      educationalAttainment: "Elementary Graduate",
      contactNumber: "09192345678",
      occupation: "Vendor",
      placeOfWork: "Iriga Public Market",
      livingStatus: "Living",
      livingWithFamily: "Yes",
    },
    birthOrder: BirthOrder.MIDDLE,
    siblings: [
      {
        id: "sib-2",
        name: "Sarah Alvarez",
        age: 22,
        sex: "F",
        civilStatus: "Single",
        educationalAttainment: "College Graduate",
      }
    ],
    housingCondition: HousingCondition.RENTED,
    familyMonthlyIncome: "12,000 PHP",
    languageSpoken: "Rinconada, Tagalog, English",
    elementary: {
      schoolName: "Iriga Central School",
      address: "Iriga City",
      yearGraduated: "2019",
      awardsHonors: "N/A",
    },
    juniorHigh: {
      schoolName: "Iriga National High School",
      address: "Iriga City",
      yearGraduated: "2023",
      awardsHonors: "With Honors",
    },
    seniorHigh: {
      schoolName: "Zeferino Arroyo High School",
      address: "Iriga City",
      trackStrand: "TVL - ICT",
      yearGraduated: "2025",
      awardsHonors: "With High Honors",
      gwaG11: "94.2",
      gwaG12: "95.1",
    },
    firstGenerationStudent: false,
    familyCollegeGraduatesCount: 1,
    futureOutlook: "I see myself as a proficient software engineer and database administrator creating educational software.",
    pwdStatus: false,
    hospitalizedStatus: true,
    hospitalizedReasons: "Appendectomy in January 2024",
    emergencyContact: {
      name: "Alicia Bautista Alvarez",
      relation: "Mother",
      address: "Brgy. San Agustin, Iriga City, Camarines Sur",
      contactNo: "09192345678",
    },
    notificationsSent: [],
  },
  {
    id: "APP-2026-0003",
    courseApplied1st: "Bachelor of Science in Food Technology (BSFT)",
    courseApplied2nd: "Bachelor of Science in Hospitality Management (BSHM)",
    schoolYear: "2026-2027",
    status: ApplicationStatus.APPROVED_FOR_EXAM,
    submissionDate: "2026-07-16T11:00:00Z",
    studentType: StudentType.FRESHMAN,
    campus: "Calabanga",
    lrn: "555111222333",
    lastName: "Bello",
    firstName: "Christine Joy",
    middleName: "Macaraig",
    presentAddress: "San Isidro, Calabanga, Camarines Sur",
    permanentAddress: "San Isidro, Calabanga, Camarines Sur",
    dateOfBirth: "2008-01-05",
    age: 18,
    sex: "Female",
    civilStatus: "Single",
    placeOfBirth: "Calabanga",
    religion: "Roman Catholic",
    nationality: "Filipino",
    mobileNumber: "09095551234",
    emailAddress: "christine.bello@gmail.com",
    fatherProfile: {
      fullName: "Antonio Bello",
      age: 50,
      birthplace: "Calabanga",
      educationalAttainment: "High School Graduate",
      contactNumber: "09093214567",
      occupation: "Fisherman",
      placeOfWork: "Calabanga Bay",
      livingStatus: "Living",
      livingWithFamily: "Yes",
    },
    motherProfile: {
      fullName: "Teresa Macaraig Bello",
      age: 47,
      birthplace: "Tinambac",
      educationalAttainment: "High School Graduate",
      contactNumber: "09094321234",
      occupation: "Fish Vendor",
      placeOfWork: "Calabanga Market",
      livingStatus: "Living",
      livingWithFamily: "Yes",
    },
    birthOrder: BirthOrder.YOUNGEST,
    siblings: [],
    housingCondition: HousingCondition.OWNED,
    familyMonthlyIncome: "10,000 PHP",
    languageSpoken: "Bicolano, Tagalog",
    elementary: { schoolName: "Calabanga Central School", address: "Calabanga", yearGraduated: "2020", awardsHonors: "N/A" },
    juniorHigh: { schoolName: "Calabanga National High School", address: "Calabanga", yearGraduated: "2024", awardsHonors: "With Honors" },
    seniorHigh: { schoolName: "Calabanga National High School", address: "Calabanga", trackStrand: "TVL - HE", yearGraduated: "2026", awardsHonors: "With Honors", gwaG11: "91.0", gwaG12: "92.4" },
    firstGenerationStudent: true,
    familyCollegeGraduatesCount: 0,
    futureOutlook: "To become a Food Technologist establishing local food processing guidelines in Bicol.",
    pwdStatus: false,
    hospitalizedStatus: false,
    emergencyContact: { name: "Teresa Macaraig Bello", relation: "Mother", address: "San Isidro, Calabanga", contactNo: "09094321234" },
    notificationsSent: [],
  },
  {
    id: "APP-2026-0004",
    courseApplied1st: "Bachelor of Science in Veterinary Medicine (DVM)",
    courseApplied2nd: "Bachelor of Science in Agriculture (BSA)",
    schoolYear: "2026-2027",
    status: ApplicationStatus.SCHEDULED,
    submissionDate: "2026-07-14T08:15:00Z",
    studentType: StudentType.FRESHMAN,
    campus: "Pili",
    lrn: "888999000111",
    lastName: "Olaso",
    firstName: "Ramon",
    middleName: "Cea",
    presentAddress: "Magsaysay District, Tinambac, Camarines Sur",
    permanentAddress: "Magsaysay District, Tinambac, Camarines Sur",
    dateOfBirth: "2007-09-30",
    age: 18,
    sex: "Male",
    civilStatus: "Single",
    placeOfBirth: "Tinambac",
    religion: "Roman Catholic",
    nationality: "Filipino",
    mobileNumber: "09214443333",
    emailAddress: "ramon.olaso@gmail.com",
    fatherProfile: {
      fullName: "Bernardo Olaso",
      age: 54,
      birthplace: "Tinambac",
      educationalAttainment: "High School Graduate",
      contactNumber: "09214441111",
      occupation: "Livestock Farmer",
      placeOfWork: "Tinambac",
      livingStatus: "Living",
      livingWithFamily: "Yes",
    },
    motherProfile: {
      fullName: "Liza Cea Olaso",
      age: 51,
      birthplace: "Tinambac",
      educationalAttainment: "High School Graduate",
      contactNumber: "09214442222",
      occupation: "Housewife",
      placeOfWork: "N/A",
      livingStatus: "Living",
      livingWithFamily: "Yes",
    },
    birthOrder: BirthOrder.ONLY_CHILD,
    siblings: [],
    housingCondition: HousingCondition.OWNED,
    familyMonthlyIncome: "8,000 PHP",
    languageSpoken: "Bicolano, Tagalog",
    elementary: { schoolName: "Tinambac Central School", address: "Tinambac", yearGraduated: "2019", awardsHonors: "With Honors" },
    juniorHigh: { schoolName: "Tinambac National High School", address: "Tinambac", yearGraduated: "2023", awardsHonors: "N/A" },
    seniorHigh: { schoolName: "Tinambac National High School", address: "Tinambac", trackStrand: "Academic - STEM", yearGraduated: "2025", awardsHonors: "With High Honors", gwaG11: "95.6", gwaG12: "96.2" },
    firstGenerationStudent: true,
    familyCollegeGraduatesCount: 0,
    futureOutlook: "To be a Doctor of Veterinary Medicine caring for livestock and domestic animals.",
    pwdStatus: false,
    hospitalizedStatus: false,
    emergencyContact: { name: "Liza Cea Olaso", relation: "Mother", address: "Tinambac", contactNo: "09214442222" },
    examAssignment: {
      course: "Bachelor of Science in Veterinary Medicine (DVM)",
      examDate: "2026-08-10",
      batchTime: "Batch 1: 8:00 AM - 10:00 AM",
      venue: "Main Campus - Pili",
      room: "Room 302 (Library Bldg)",
      schoolYear: "2026-2027",
    },
    notificationsSent: [
      {
        type: "SCHEDULED",
        timestamp: "2026-07-14T11:30:00Z",
        recipient: "ramon.olaso@gmail.com",
        subject: "CBSUA Exam Schedule Scheduled: APP-2026-0004",
        messageBody: "Your exam schedule is confirmed on 2026-08-10 Batch 1: 8:00 AM - 10:00 AM at Main Campus - Pili Room 302.",
        success: true
      }
    ],
  }
];

function getInitialDB() {
  return {
    applications: DEFAULT_APPLICATIONS,
    slots: DEFAULT_SLOTS,
    days: DEFAULT_DAYS,
    batches: DEFAULT_BATCHES,
    venues: DEFAULT_VENUES,
    rooms: DEFAULT_ROOMS,
  };
}

export function readDB() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialDB();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const db = JSON.parse(raw);
    let modified = false;
    if (!db.applications) { db.applications = DEFAULT_APPLICATIONS; modified = true; }
    if (!db.slots) { db.slots = DEFAULT_SLOTS; modified = true; }
    if (!db.days) { db.days = DEFAULT_DAYS; modified = true; }
    if (!db.batches) { db.batches = DEFAULT_BATCHES; modified = true; }
    if (!db.venues) { db.venues = DEFAULT_VENUES; modified = true; }
    if (!db.rooms) { db.rooms = DEFAULT_ROOMS; modified = true; }
    if (modified) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    }
    return db;
  } catch (err) {
    console.error("Error reading localStorage DB:", err);
    const initial = getInitialDB();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}

export function writeDB(db) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (err) {
    console.error("Error writing localStorage DB:", err);
  }
}

function generateApplicationNo(latestId) {
  const currentYear = new Date().getFullYear();
  if (!latestId) {
    return `APP-${currentYear}-0001`;
  }
  const parts = latestId.split("-");
  if (parts.length === 3) {
    const sequence = parseInt(parts[2]) + 1;
    const paddedSeq = sequence.toString().padStart(4, "0");
    return `APP-${currentYear}-${paddedSeq}`;
  }
  return `APP-${currentYear}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function fetchStats() {
  const db = readDB();
  const stats = {
    total: db.applications.length,
    pending: db.applications.filter(a => a.status === ApplicationStatus.PENDING).length,
    approvedForExam: db.applications.filter(a => a.status === ApplicationStatus.APPROVED_FOR_EXAM).length,
    scheduled: db.applications.filter(a => a.status === ApplicationStatus.SCHEDULED).length,
    rejected: db.applications.filter(a => a.status === ApplicationStatus.REJECTED).length,
    byCourse: {},
    byStudentType: {},
  };

  db.applications.forEach(app => {
    const course = app.courseApplied1st || "Unspecified";
    stats.byCourse[course] = (stats.byCourse[course] || 0) + 1;

    const type = app.studentType || "Unspecified";
    stats.byStudentType[type] = (stats.byStudentType[type] || 0) + 1;
  });

  return stats;
}

export async function fetchApplications() {
  const db = readDB();
  return db.applications;
}

export async function fetchApplicationByNo(appNo) {
  const db = readDB();
  return db.applications.find(a => a.id.toLowerCase() === appNo.toLowerCase()) || null;
}

export async function submitApplication(formData) {
  const db = readDB();
  const latestId = db.applications.length > 0 ? db.applications[0].id : null;
  const newId = generateApplicationNo(latestId);

  const newApp = {
    ...formData,
    id: newId,
    submissionDate: new Date().toISOString(),
    status: ApplicationStatus.PENDING,
    notificationsSent: [
      {
        type: "APPLIED",
        timestamp: new Date().toISOString(),
        recipient: formData.emailAddress,
        subject: `CBSUA Online Admission Application Logged - ${newId}`,
        messageBody: `Dear ${formData.firstName}, your Student Directory Form ADM-FR-002 has been received under Application No: ${newId}.`,
        success: true
      }
    ]
  };

  db.applications.unshift(newApp);
  writeDB(db);
  return newApp;
}

export async function updateApplicationStatus(appId, status, rejectionReason) {
  const db = readDB();
  const index = db.applications.findIndex(a => a.id === appId);
  if (index === -1) throw new Error("Application not found");

  const app = db.applications[index];
  app.status = status;
  if (rejectionReason) app.rejectionReason = rejectionReason;

  if (!app.notificationsSent) app.notificationsSent = [];

  app.notificationsSent.push({
    type: status === ApplicationStatus.APPROVED_FOR_EXAM ? "APPROVED" : "REJECTED",
    timestamp: new Date().toISOString(),
    recipient: app.emailAddress,
    subject: `CBSUA Application Status Update: ${status}`,
    messageBody: status === ApplicationStatus.APPROVED_FOR_EXAM
      ? `Dear ${app.firstName}, your application ${app.id} has been APPROVED FOR ENTRANCE EXAM.`
      : `Dear ${app.firstName}, your application status: REJECTED. Reason: ${rejectionReason || "Requirements incomplete"}`,
    success: true
  });

  db.applications[index] = app;
  writeDB(db);
  return app;
}

export async function scheduleApplication(appId, { slotId, course }) {
  const db = readDB();
  const appIndex = db.applications.findIndex(a => a.id === appId);
  if (appIndex === -1) throw new Error("Application not found");

  const slotIndex = db.slots.findIndex(s => s.id === slotId);
  if (slotIndex === -1) throw new Error("Selected exam slot not found");

  const slot = db.slots[slotIndex];
  if (slot.currentEnrolledCount >= slot.maxCapacity) {
    throw new Error("Selected room & batch slot is already at full capacity");
  }

  slot.currentEnrolledCount += 1;
  db.slots[slotIndex] = slot;

  const app = db.applications[appIndex];
  app.status = ApplicationStatus.SCHEDULED;
  app.examAssignment = {
    course: course || app.courseApplied1st,
    examDate: slot.examDate,
    batchTime: slot.batchTime,
    venue: slot.venue,
    room: slot.room,
    schoolYear: app.schoolYear || "2026-2027",
  };

  if (!app.notificationsSent) app.notificationsSent = [];
  app.notificationsSent.push({
    type: "SCHEDULED",
    timestamp: new Date().toISOString(),
    recipient: app.emailAddress,
    subject: `CBSUA Exam Permit Schedule Confirmed: ${app.id}`,
    messageBody: `Dear ${app.firstName} ${app.lastName}, your entrance exam is scheduled on ${slot.examDate} (${slot.batchTime}) at ${slot.venue} - ${slot.room}.`,
    success: true
  });

  db.applications[appIndex] = app;
  writeDB(db);
  return app;
}

export async function fetchSlots() {
  const db = readDB();
  return db.slots;
}

export async function createSlot(slotData) {
  const db = readDB();
  const newSlot = {
    id: `slot-${Date.now()}`,
    examDate: slotData.examDate,
    batchTime: slotData.batchTime,
    venue: slotData.venue,
    room: slotData.room,
    maxCapacity: parseInt(slotData.maxCapacity) || 30,
    currentEnrolledCount: 0,
  };
  db.slots.push(newSlot);
  writeDB(db);
  return newSlot;
}

export async function deleteSlot(slotId) {
  const db = readDB();
  db.slots = db.slots.filter(s => s.id !== slotId);
  writeDB(db);
  return true;
}

export async function fetchDays() {
  const db = readDB();
  return db.days || DEFAULT_DAYS;
}

export async function createDay(dayData) {
  const db = readDB();
  const newDay = {
    id: `day-${Date.now()}`,
    schoolYear: dayData.schoolYear || "2026-2027",
    dayName: dayData.dayName,
    userId: "admin"
  };
  db.days = db.days || [];
  db.days.push(newDay);
  writeDB(db);
  return newDay;
}

export async function deleteDay(id) {
  const db = readDB();
  db.days = (db.days || []).filter(d => d.id !== id);
  writeDB(db);
  return true;
}

export async function fetchBatches() {
  const db = readDB();
  return db.batches || DEFAULT_BATCHES;
}

export async function createBatch(batchData) {
  const db = readDB();
  const newBatch = {
    id: `batch-${Date.now()}`,
    batchName: batchData.batchName,
    days: batchData.days || [],
    year: batchData.year || "Present",
    schoolYear: batchData.schoolYear || "2026-2027",
    userId: "admin"
  };
  db.batches = db.batches || [];
  db.batches.push(newBatch);
  writeDB(db);
  return newBatch;
}

export async function deleteBatch(id) {
  const db = readDB();
  db.batches = (db.batches || []).filter(b => b.id !== id);
  writeDB(db);
  return true;
}

export async function fetchVenues() {
  const db = readDB();
  return db.venues || DEFAULT_VENUES;
}

export async function createVenue(venueData) {
  const db = readDB();
  const newVenue = {
    id: `venue-${Date.now()}`,
    venueName: venueData.venueName,
    userId: "admin"
  };
  db.venues = db.venues || [];
  db.venues.push(newVenue);
  writeDB(db);
  return newVenue;
}

export async function deleteVenue(id) {
  const db = readDB();
  db.venues = (db.venues || []).filter(v => v.id !== id);
  writeDB(db);
  return true;
}

export async function fetchRooms() {
  const db = readDB();
  return db.rooms || DEFAULT_ROOMS;
}

export async function createRoom(roomData) {
  const db = readDB();
  const newRoom = {
    id: `room-${Date.now()}`,
    roomName: roomData.roomName,
    venueName: roomData.venueName,
    totalSeat: parseInt(roomData.totalSeat) || 30,
    status: roomData.status || "Not Full",
    userId: "admin",
    schoolYear: roomData.schoolYear || "2026-2027"
  };
  db.rooms = db.rooms || [];
  db.rooms.push(newRoom);
  writeDB(db);
  return newRoom;
}

export async function deleteRoom(id) {
  const db = readDB();
  db.rooms = (db.rooms || []).filter(r => r.id !== id);
  writeDB(db);
  return true;
}

export async function resetDB() {
  const initial = getInitialDB();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}
