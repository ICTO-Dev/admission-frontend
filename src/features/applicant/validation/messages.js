/**
 * Centralized Validation Messages for CBSUA Student Admission Application
 */
export const VALIDATION_MESSAGES = {
  STEP_1: {
    CAMPUS_REQUIRED: "Please select your preferred Campus.",
    COURSES_REQUIRED: "Please select both 1st and 2nd choice courses.",
    COURSES_IDENTICAL: "Your 1st and 2nd course choices must be different.",
    PHOTO_REQUIRED: "Please upload your applicant photo (1.5 x 1.5 or 2 x 2).",
    NAME_REQUIRED: "Please fill out your Last Name and Given Name.",
    DOB_REQUIRED: "Please specify your Date of Birth.",
    SEX_REQUIRED: "Please select your Sex (Male or Female).",
    CIVIL_STATUS_REQUIRED: "Please select your Civil Status.",
    POB_REQUIRED: "Please enter your Place of Birth.",
    RELIGION_REQUIRED: "Please enter your Religion.",
    NATIONALITY_REQUIRED: "Please enter your Nationality.",
    LRN_INVALID: "LRN must be a valid 12-digit number.",
    ADDRESS_REQUIRED: "Both Present and Permanent Addresses are required.",
    MOBILE_REQUIRED: "Please enter your Mobile Number.",
    EMAIL_INVALID: "Please provide a valid email address.",
    INDIGENOUS_REQUIRED: "Please answer if you are a member of an ethnic/indigenous group.",
    INDIGENOUS_SPECIFY: "Please specify your ethnic/indigenous group.",
    SOLO_PARENT_REQUIRED: "Please answer if you are a solo parent."
  },
  STEP_2: {
    PARENTS_NAME_REQUIRED: "Father's Name and Mother's Name are required.",
    FATHER_STATUS_REQUIRED: "Please indicate Father's status (Living or Deceased).",
    FATHER_DEATH_CAUSE: "Please specify Father's cause of death.",
    FATHER_LIVING_FAMILY: "Please indicate if Father is living with the family.",
    MOTHER_STATUS_REQUIRED: "Please indicate Mother's status (Living or Deceased).",
    MOTHER_DEATH_CAUSE: "Please specify Mother's cause of death.",
    MOTHER_LIVING_FAMILY: "Please indicate if Mother is living with the family.",
    SPOUSE_NAME_REQUIRED: "Spouse's Full Name is required for married applicants.",
    BIRTH_ORDER_REQUIRED: "Please select your Birth Order.",
    BIRTH_ORDER_SPECIFY: "Please specify your Birth Order.",
    HOUSING_REQUIRED: "Please select your Housing Condition.",
    INCOME_REQUIRED: "Family's Monthly Income is required.",
    LANGUAGE_REQUIRED: "Language / Dialect spoken at home is required."
  },
  STEP_3: {
    ELEM_REQUIRED: "Elementary School Name and Year of Graduation are required.",
    JHS_REQUIRED: "Junior High School Name and Year of Graduation are required.",
    SHS_REQUIRED: "Senior High School Name and Year of Graduation are required.",
    SHS_TRACK_REQUIRED: "Senior High School Track and Strand is required.",
    COLLEGE_REQUIRED: "College School Name and Course are required for Transferee / Second Courser.",
    FIRST_GEN_REQUIRED: "Please indicate if you are the first person in your family to attend college.",
    FAMILY_COLLEGE_COUNT_REQUIRED: "Please specify how many members in your family attended college.",
    FUTURE_OUTLOOK_REQUIRED: "Future Outlook (five years after graduation) is required."
  },
  STEP_4: {
    PWD_STATUS_REQUIRED: "Please answer if you are a Person With Disability (PWD).",
    PWD_SPECIFY: "Please specify your disability (PWD).",
    HOSPITALIZED_STATUS_REQUIRED: "Please answer if you have ever been hospitalized.",
    HOSPITALIZED_REASON_SPECIFY: "Please specify the reason for hospitalization.",
    EMERGENCY_CONTACT_REQUIRED: "Please fill out all Emergency Contact details."
  },
  COMMON: {
    GENERIC_ERROR: "Something went wrong. Please check your inputs and try again."
  }
};
