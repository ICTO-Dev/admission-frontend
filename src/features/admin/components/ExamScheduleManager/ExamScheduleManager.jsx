import React from "react";
import ExamSchedulePage from "../scheduling/ExamSchedulePage.jsx";

/**
 * Backward compatibility wrapper.
 * The scheduling functionality has been separated into modular pages:
 * - ExamSchedulePage (/admin/schedules)
 * - BatchPage (/admin/batches)
 * - VenueRoomPage (/admin/venues)
 * - AcademicYearPage (/admin/academic-years)
 */
export default function ExamScheduleManager() {
  return <ExamSchedulePage />;
}
