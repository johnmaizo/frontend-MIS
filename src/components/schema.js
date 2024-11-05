import { z } from "zod";

// Applicant Schema
export const applicantSchema = z.object({
  applicant_id_for_online: z.number().optional().nullable(),

  isTransferee: z.boolean(),
});

// Personal Data Schema
export const personalDataSchema = z.object({
  campus_id: z.number().min(1, "Campus is required"),
  enrollmentType: z.string().min(1, "Enrollment Type is required"),
  firstName: z.string().min(1, "First Name is required"),
  middleName: z.string().optional().nullable(), // Allow null
  lastName: z.string().min(1, "Last Name is required"),
  suffix: z.string().optional().nullable(), // Allow null
  gender: z.string().min(1, "Gender is required"),
  email: z.string().email("Invalid email address"),
  contactNumber: z.string().min(1, "Contact Number is required"),
  birthDate: z.string().min(1, "Birth Date is required"),
  address: z.string().min(1, "Address is required"),
  civilStatus: z.string().min(1, "Civil Status is required"),
  birthPlace: z.string().min(1, "Birth Place is required"),
  religion: z.string().min(1, "Religion is required"),
  citizenship: z.string().min(1, "Citizenship is required"),
  country: z.string().min(1, "Country is required"),
  ACR: z.string().optional().nullable(), // Allow null
});

export const addPersonalDataSchema = z.object({
  cityAddress: z.string().min(1, "City Address is required").nullable(),
  cityTelNumber: z
    .string()
    .min(1, "City Telephone Number is required")
    .nullable(),
  provinceAddress: z.string().min(1, "Province Address is required").nullable(),
  provinceTelNumber: z
    .string()
    .min(1, "Province Telephone Number is required")
    .nullable(),
});

// Combined Personal Data Schema
export const combinedPersonalDataSchema = personalDataSchema.extend(
  addPersonalDataSchema.shape,
);

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
  yearLevel: z.enum([
    "First Year",
    "Second Year",
    "Third Year",
    "Fourth Year",
    "Fifth Year",
  ]),
  program_id: z.number().int(),
  prospectus_id: z.number().int(),
  semester_id: z.number().int(),
  yearEntry: z.number().int(),
  yearGraduate: z.number().int(),
});

// Academic History Schema
export const academicHistorySchema = z.object({
  elementarySchool: z.string().min(1, "Elementary School is required"),
  elementaryAddress: z.string().min(1, "Elementary Address is required"),
  elementaryHonors: z.string().optional().nullable(),
  elementaryGraduate: z.string().optional().nullable(),

  secondarySchool: z.string().min(1, "Secondary School is required"),
  secondaryAddress: z.string().min(1, "Secondary School Address is required"),
  secondaryHonors: z.string().optional().nullable(),
  secondaryGraduate: z.string().optional().nullable(),

  seniorHighSchool: z.string().optional().nullable(),
  seniorHighAddress: z.string().optional().nullable(),
  seniorHighHonors: z.string().optional().nullable(),
  seniorHighSchoolGraduate: z.string().optional().nullable(),

  ncae_grade: z.string().optional().nullable(),
  ncae_year_taken: z.string().optional().nullable(),
  latest_college: z.string().optional().nullable(),
  college_address: z.string().optional().nullable(),
  college_honors: z.string().optional().nullable(),
  program: z.string().optional().nullable(),
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
