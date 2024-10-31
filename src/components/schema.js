import { z } from "zod";

// Applicant Schema
export const applicantSchema = z.object({
  enrollmentType: z.enum(["online", "on-site"]),
  applicant_id_for_online: z.number().optional().nullable(),
  campus_id: z.number().int(),
  program_id: z.number().int(),
  firstName: z.string().nonempty(),
  middleName: z.string().optional().nullable(),
  lastName: z.string().nonempty(),
  suffix: z.string().optional().nullable(),
  gender: z.string().nonempty(),
  email: z.string().email(),
  contactNumber: z.string().nonempty(),
  birthDate: z.string().nonempty(),
  address: z.string().nonempty(),
  yearLevel: z.enum([
    "First Year",
    "Second Year",
    "Third Year",
    "Fourth Year",
    "Fifth Year",
  ]),
  isTransferee: z.boolean(),
});

// Personal Data Schema
export const personalDataSchema = z.object({
  civilStatus: z.string().nonempty(),
  birthPlace: z.string().nonempty(),
  religion: z.string().nonempty(),
  citizenship: z.string().nonempty(),
  country: z.string().nonempty(),
  ACR: z.string().optional().nullable(),
});

export const addPersonalDataSchema = z.object({
  cityAddress: z.string().nonempty(),
  cityTelNumber: z.string().optional().nullable(),
  provinceAddress: z.string().optional().nullable(),
  provinceTelNumber: z.string().optional().nullable(),
});

// Family Details Schema
export const familyDetailsSchema = z.object({
  fatherFirstName: z.string().optional().nullable(),
  fatherMiddleName: z.string().optional().nullable(),
  fatherLastName: z.string().optional().nullable(),
  fatherAddress: z.string().optional().nullable(),
  fatherOccupation: z.string().optional().nullable(),
  fatherContactNumber: z.string().optional().nullable(),
  fatherCompanyName: z.string().optional().nullable(),
  fatherCompanyAddress: z.string().optional().nullable(),
  fatherEmail: z.string().optional().nullable(),
  fatherIncome: z.string().optional().nullable(),

  motherFirstName: z.string().optional().nullable(),
  motherMiddleName: z.string().optional().nullable(),
  motherLastName: z.string().optional().nullable(),
  motherAddress: z.string().optional().nullable(),
  motherOccupation: z.string().optional().nullable(),
  motherContactNumber: z.string().optional().nullable(),
  motherCompanyName: z.string().optional().nullable(),
  motherCompanyAddress: z.string().optional().nullable(),
  motherEmail: z.string().optional().nullable(),
  motherIncome: z.string().optional().nullable(),

  guardianFirstName: z.string().optional().nullable(),
  guardianMiddleName: z.string().optional().nullable(),
  guardianLastName: z.string().optional().nullable(),
  guardianRelation: z.string().optional().nullable(),
  guardianContactNumber: z.string().optional().nullable(),
});

// Academic Background Schema
export const academicBackgroundSchema = z.object({
  majorIn: z.string().optional().nullable(),
  studentType: z.enum(["Regular", "Irregular"]),
  applicationType: z.enum(["Freshmen", "Transferee", "Cross Enrollee"]),
  semester_id: z.number().int(),
  yearEntry: z.number().int(),
  yearGraduate: z.number().int(),
});

// Academic History Schema
export const academicHistorySchema = z.object({
  elementarySchool: z.string().nonempty(),
  elementaryAddress: z.string().nonempty(),
  elementaryHonors: z.string().optional().nullable(),
  elementaryGraduate: z.string().optional().nullable(),

  secondarySchool: z.string().nonempty(),
  secondaryAddress: z.string().nonempty(),
  secondaryHonors: z.string().optional().nullable(),
  secondaryGraduate: z.string().optional().nullable(),

  seniorHighSchool: z.string().optional().nullable(),
  seniorHighAddress: z.string().optional().nullable(),
  seniorHighHonors: z.string().optional().nullable(),
  seniorHighSchoolGraduate: z.string().optional().nullable(),
});

// Documents Schema
export const documentsSchema = z.object({
  form_167: z.boolean(),
  certificate_of_good_moral: z.boolean(),
  transcript_of_records: z.boolean(),
  nso_birth_certificate: z.boolean(),
  two_by_two_id_photo: z.boolean(),
  certificate_of_transfer_credential: z.boolean(),
});
