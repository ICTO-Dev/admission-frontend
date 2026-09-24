import { VALIDATION_MESSAGES } from "./messages.js";
import { StudentType, BirthOrder } from "../../../config/types.js";

/**
 * Validates the inputs of a specific step in the Admission Wizard.
 * @param {number} currentStep - The step number (1 to 4)
 * @param {Object} data - Form data values
 * @returns {string|null} - Error message if invalid, or null if valid
 */
export function getStepValidationError(currentStep, data) {
  const m1 = VALIDATION_MESSAGES.STEP_1;
  const m2 = VALIDATION_MESSAGES.STEP_2;
  const m3 = VALIDATION_MESSAGES.STEP_3;
  const m4 = VALIDATION_MESSAGES.STEP_4;

  if (currentStep === 1) {
    if (!data.selectedCampusId) return m1.CAMPUS_REQUIRED;
    if (!data.course1 || !data.course2) return m1.COURSES_REQUIRED;
    if (data.course1 === data.course2) return m1.COURSES_IDENTICAL;
    if (!data.photoBase64) return m1.PHOTO_REQUIRED;
    if (!data.lastName?.trim() || !data.firstName?.trim()) return m1.NAME_REQUIRED;
    if (!data.dateOfBirth) return m1.DOB_REQUIRED;
    if (!data.sex) return m1.SEX_REQUIRED;
    if (!data.civilStatus) return m1.CIVIL_STATUS_REQUIRED;
    if (!data.placeOfBirth?.trim()) return m1.POB_REQUIRED;
    if (!data.religion?.trim()) return m1.RELIGION_REQUIRED;
    if (!data.nationality?.trim()) return m1.NATIONALITY_REQUIRED;
    if (!data.lrn || data.lrn.trim().length !== 12 || isNaN(Number(data.lrn))) return m1.LRN_INVALID;
    if (!data.presentAddress?.trim() || !data.permanentAddress?.trim()) return m1.ADDRESS_REQUIRED;
    if (!data.mobileNumber?.trim()) return m1.MOBILE_REQUIRED;
    if (!data.emailAddress?.trim() || !data.emailAddress.includes("@")) return m1.EMAIL_INVALID;
    if (data.isIndigenous === null) return m1.INDIGENOUS_REQUIRED;
    if (data.isIndigenous === true && !data.indigenousGroup?.trim()) return m1.INDIGENOUS_SPECIFY;
    if (data.isSoloParent === null) return m1.SOLO_PARENT_REQUIRED;
  }

  if (currentStep === 2) {
    if (!data.fatherName?.trim() || !data.motherName?.trim()) return m2.PARENTS_NAME_REQUIRED;
    if (!data.fatherLiving) return m2.FATHER_STATUS_REQUIRED;
    if (data.fatherLiving === "Deceased" && !data.fatherCauseOfDeath?.trim()) return m2.FATHER_DEATH_CAUSE;
    if (!data.fatherLivingWithFamily) return m2.FATHER_LIVING_FAMILY;
    if (!data.motherLiving) return m2.MOTHER_STATUS_REQUIRED;
    if (data.motherLiving === "Deceased" && !data.motherCauseOfDeath?.trim()) return m2.MOTHER_DEATH_CAUSE;
    if (!data.motherLivingWithFamily) return m2.MOTHER_LIVING_FAMILY;
    if (data.civilStatus === "Married" && !data.spouseName?.trim()) return m2.SPOUSE_NAME_REQUIRED;
    if (!data.birthOrder) return m2.BIRTH_ORDER_REQUIRED;
    if (data.birthOrder === BirthOrder.OTHERS && !data.birthOrderOther?.trim()) return m2.BIRTH_ORDER_SPECIFY;
    if (!data.housingCondition) return m2.HOUSING_REQUIRED;
    if (!data.familyMonthlyIncome?.trim()) return m2.INCOME_REQUIRED;
    if (!data.languageSpoken?.trim()) return m2.LANGUAGE_REQUIRED;
  }

  if (currentStep === 3) {
    if (!data.elemName?.trim() || !data.elemGradYear?.trim()) return m3.ELEM_REQUIRED;
    if (!data.jhsName?.trim() || !data.jhsGradYear?.trim()) return m3.JHS_REQUIRED;
    if (!data.shsName?.trim() || !data.shsGradYear?.trim()) return m3.SHS_REQUIRED;
    if (!data.shsTrack?.trim()) return m3.SHS_TRACK_REQUIRED;
    if (
      (data.studentType === StudentType.TRANSFEREE || data.studentType === StudentType.SECOND_COURSER) &&
      (!data.collName?.trim() || !data.collCourse?.trim())
    ) {
      return m3.COLLEGE_REQUIRED;
    }
    if (data.firstGenStudent === null) return m3.FIRST_GEN_REQUIRED;
    if (!data.familyCollegeCount?.trim()) return m3.FAMILY_COLLEGE_COUNT_REQUIRED;
    if (!data.futureOutlook?.trim()) return m3.FUTURE_OUTLOOK_REQUIRED;
  }

  if (currentStep === 4) {
    if (data.pwdStatus === null) return m4.PWD_STATUS_REQUIRED;
    if (data.pwdStatus === true && !data.pwdSpecs?.trim()) return m4.PWD_SPECIFY;
    if (data.hospitalizedStatus === null) return m4.HOSPITALIZED_STATUS_REQUIRED;
    if (data.hospitalizedStatus === true && !data.hospitalizedReasons?.trim()) return m4.HOSPITALIZED_REASON_SPECIFY;
    if (
      !data.emergencyName?.trim() ||
      !data.emergencyRelation?.trim() ||
      !data.emergencyContact?.trim() ||
      !data.emergencyAddress?.trim()
    ) {
      return m4.EMERGENCY_CONTACT_REQUIRED;
    }
  }

  return null;
}
