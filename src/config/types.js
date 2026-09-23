/**
 * CBSUA Online Admission & Exam Scheduling System
 * Constants and enums for ADM-FR-002 Student Directory Form & System Workflow
 */

export const ApplicationStatus = {
  PENDING: "Pending",
  APPROVED_FOR_EXAM: "Approved for Exam",
  SCHEDULED: "Scheduled",
  REJECTED: "Rejected"
};

export const StudentType = {
  FRESHMAN: "Freshman",
  TRANSFEREE: "Transferee",
  SECOND_COURSER: "Second Courser"
};

export const HousingCondition = {
  OWNED: "Owned",
  RENTED: "Rented",
  SHARED: "Shared with grandparents or relatives",
  RENT_TO_OWN: "Rent to Own"
};

export const BirthOrder = {
  ONLY_CHILD: "Only Child",
  ELDEST: "Eldest",
  MIDDLE: "Middle",
  YOUNGEST: "Youngest",
  OTHERS: "Others"
};
