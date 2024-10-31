import { useFormContext } from "react-hook-form";
import { Input } from "../../../../../components/ui/input";

const ApplicantComponent = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4 text-start">
      <div className="flex gap-10">
        {/* Enrollment Type */}
        <div className="w-full space-y-2">
          <label
            htmlFor="enrollmentType"
            className="block text-sm font-medium text-primary"
          >
            Enrollment Type
          </label>
          <select
            id="enrollmentType"
            {...register("enrollmentType")}
            className="block w-full rounded-md border p-2"
          >
            <option value="">Select Enrollment Type</option>
            <option value="online">Online</option>
            <option value="on-site">On-site</option>
          </select>
          {errors.enrollmentType && (
            <span className="text-sm font-medium text-red-600">
              {errors.enrollmentType.message}
            </span>
          )}
        </div>
        {/* Campus ID */}
        <div className="w-full space-y-2">
          <label
            htmlFor="campus_id"
            className="block text-sm font-medium text-primary"
          >
            Campus
          </label>
          <select
            id="campus_id"
            {...register("campus_id", { valueAsNumber: true })}
            className="block w-full rounded-md border p-2"
          >
            {/* Options should be populated dynamically */}
            <option value="">Select Campus</option>
            <option value="1">Main Campus</option>
            <option value="2">City Campus</option>
          </select>
          {errors.campus_id && (
            <span className="text-sm font-medium text-red-600">
              {errors.campus_id.message}
            </span>
          )}
        </div>
        {/* Program ID */}
        <div className="w-full space-y-2">
          <label
            htmlFor="program_id"
            className="block text-sm font-medium text-primary"
          >
            Program
          </label>
          <select
            id="program_id"
            {...register("program_id", { valueAsNumber: true })}
            className="block w-full rounded-md border p-2"
          >
            {/* Options should be populated dynamically */}
            <option value="">Select Program</option>
            <option value="101">Computer Science</option>
            <option value="102">Information Technology</option>
          </select>
          {errors.program_id && (
            <span className="text-sm font-medium text-red-600">
              {errors.program_id.message}
            </span>
          )}
        </div>

        {/* Year Level */}
        <div className="w-full space-y-2">
          <label
            htmlFor="yearLevel"
            className="block text-sm font-medium text-primary"
          >
            Year Level
          </label>
          <select
            id="yearLevel"
            {...register("yearLevel")}
            className="block w-full rounded-md border p-2"
          >
            <option value="">Select Year Level</option>
            <option value="First Year">First Year</option>
            <option value="Second Year">Second Year</option>
            <option value="Third Year">Third Year</option>
            <option value="Fourth Year">Fourth Year</option>
            <option value="Fifth Year">Fifth Year</option>
          </select>
          {errors.yearLevel && (
            <span className="text-sm font-medium text-red-600">
              {errors.yearLevel.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-10">
        {/* First Name */}
        <div className="w-full space-y-2">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-primary"
          >
            First Name
          </label>
          <Input id="firstName" {...register("firstName")} />
          {errors.firstName && (
            <span className="text-sm font-medium text-red-600">
              {errors.firstName.message}
            </span>
          )}
        </div>
        {/* Middle Name */}
        <div className="w-full space-y-2">
          <label
            htmlFor="middleName"
            className="block text-sm font-medium text-primary"
          >
            Middle Name
          </label>
          <Input id="middleName" {...register("middleName")} />
          {errors.middleName && (
            <span className="text-sm font-medium text-red-600">
              {errors.middleName.message}
            </span>
          )}
        </div>
        {/* Last Name */}
        <div className="w-full space-y-2">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-primary"
          >
            Last Name
          </label>
          <Input id="lastName" {...register("lastName")} />
          {errors.lastName && (
            <span className="text-sm font-medium text-red-600">
              {errors.lastName.message}
            </span>
          )}
        </div>
        {/* Suffix */}
        <div className="w-full space-y-2">
          <label
            htmlFor="suffix"
            className="block text-sm font-medium text-primary"
          >
            Suffix
          </label>
          <Input id="suffix" {...register("suffix")} />
          {errors.suffix && (
            <span className="text-sm font-medium text-red-600">
              {errors.suffix.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-10">
        {/* Gender */}
        <div className="w-full space-y-2">
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-primary"
          >
            Gender
          </label>
          <select
            id="gender"
            {...register("gender")}
            className="block w-full rounded-md border p-2"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender && (
            <span className="text-sm font-medium text-red-600">
              {errors.gender.message}
            </span>
          )}
        </div>
        {/* Email */}
        <div className="w-full space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-primary"
          >
            Email
          </label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <span className="text-sm font-medium text-red-600">
              {errors.email.message}
            </span>
          )}
        </div>
        {/* Contact Number */}
        <div className="w-full space-y-2">
          <label
            htmlFor="contactNumber"
            className="block text-sm font-medium text-primary"
          >
            Contact Number
          </label>
          <Input id="contactNumber" {...register("contactNumber")} />
          {errors.contactNumber && (
            <span className="text-sm font-medium text-red-600">
              {errors.contactNumber.message}
            </span>
          )}
        </div>
        {/* Birth Date */}
        <div className="w-full space-y-2">
          <label
            htmlFor="birthDate"
            className="block text-sm font-medium text-primary"
          >
            Birth Date
          </label>
          <Input id="birthDate" type="date" {...register("birthDate")} />
          {errors.birthDate && (
            <span className="text-sm font-medium text-red-600">
              {errors.birthDate.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-10">
        {/* Address */}
        <div className="w-full space-y-2">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-primary"
          >
            Address
          </label>
          <Input id="address" {...register("address")} />
          {errors.address && (
            <span className="text-sm font-medium text-red-600">
              {errors.address.message}
            </span>
          )}
        </div>
      </div>

      {/* Is Transferee */}
      <div className="w-full space-y-2">
        <label
          htmlFor="isTransferee"
          className="block text-sm font-medium text-primary"
        >
          Is Transferee
        </label>
        <input
          type="checkbox"
          id="isTransferee"
          {...register("isTransferee")}
        />
        {errors.isTransferee && (
          <span className="text-sm font-medium text-red-600">
            {errors.isTransferee.message}
          </span>
        )}
      </div>
    </div>
  );
};

export default ApplicantComponent;
