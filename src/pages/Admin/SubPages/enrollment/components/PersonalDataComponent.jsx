import { useFormContext } from "react-hook-form";
import { Input } from "../../../../../components/ui/input";

const PersonalDataComponent = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4 text-start">
      <div className="flex gap-10">
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

      <hr />

      <div className="flex gap-10">
        {/* Civil Status */}
        <div className="w-full space-y-2">
          <label
            htmlFor="civilStatus"
            className="block text-sm font-medium text-primary"
          >
            Civil Status
          </label>
          <select
            id="civilStatus"
            {...register("civilStatus")}
            className="block w-full rounded-md border p-2"
          >
            <option value="">Select Civil Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Widowed">Widowed</option>
            <option value="Separated">Separated</option>
            <option value="Divorced">Divorced</option>
          </select>
          {errors.civilStatus && (
            <span className="text-sm font-medium text-red-600">
              {errors.civilStatus.message}
            </span>
          )}
        </div>
        {/* Birth Place */}
        <div className="w-full space-y-2">
          <label
            htmlFor="birthPlace"
            className="block text-sm font-medium text-primary"
          >
            Birth Place
          </label>
          <Input id="birthPlace" {...register("birthPlace")} />
          {errors.birthPlace && (
            <span className="text-sm font-medium text-red-600">
              {errors.birthPlace.message}
            </span>
          )}
        </div>
        {/* Religion */}
        <div className="w-full space-y-2">
          <label
            htmlFor="religion"
            className="block text-sm font-medium text-primary"
          >
            Religion
          </label>
          <Input id="religion" {...register("religion")} />
          {errors.religion && (
            <span className="text-sm font-medium text-red-600">
              {errors.religion.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-10">
        {/* Citizenship */}
        <div className="w-full space-y-2">
          <label
            htmlFor="citizenship"
            className="block text-sm font-medium text-primary"
          >
            Citizenship
          </label>
          <Input id="citizenship" {...register("citizenship")} />
          {errors.citizenship && (
            <span className="text-sm font-medium text-red-600">
              {errors.citizenship.message}
            </span>
          )}
        </div>
        {/* Country */}
        <div className="w-full space-y-2">
          <label
            htmlFor="country"
            className="block text-sm font-medium text-primary"
          >
            Country
          </label>
          <Input id="country" {...register("country")} />
          {errors.country && (
            <span className="text-sm font-medium text-red-600">
              {errors.country.message}
            </span>
          )}
        </div>
        {/* ACR */}
        <div className="w-full space-y-2">
          <label
            htmlFor="ACR"
            className="block text-sm font-medium text-primary"
          >
            ACR (For foreign students)
          </label>
          <Input id="ACR" {...register("ACR")} />
          {errors.ACR && (
            <span className="text-sm font-medium text-red-600">
              {errors.ACR.message}
            </span>
          )}
        </div>
      </div>

      {/* Additional Personal Data Fields */}
      <hr />
      <h3 className="text-lg font-medium">Additional Personal Data</h3>
      <div className="flex gap-10">
        {/* City Address */}
        <div className="w-full space-y-2">
          <label
            htmlFor="cityAddress"
            className="block text-sm font-medium text-primary"
          >
            City Address
          </label>
          <Input id="cityAddress" {...register("cityAddress")} />
          {errors.cityAddress && (
            <span className="text-sm font-medium text-red-600">
              {errors.cityAddress.message}
            </span>
          )}
        </div>
        {/* City Telephone Number */}
        <div className="w-full space-y-2">
          <label
            htmlFor="cityTelNumber"
            className="block text-sm font-medium text-primary"
          >
            City Telephone Number
          </label>
          <Input id="cityTelNumber" {...register("cityTelNumber")} />
          {errors.cityTelNumber && (
            <span className="text-sm font-medium text-red-600">
              {errors.cityTelNumber.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-10">
        {/* Province Address */}
        <div className="w-full space-y-2">
          <label
            htmlFor="provinceAddress"
            className="block text-sm font-medium text-primary"
          >
            Province Address
          </label>
          <Input id="provinceAddress" {...register("provinceAddress")} />
          {errors.provinceAddress && (
            <span className="text-sm font-medium text-red-600">
              {errors.provinceAddress.message}
            </span>
          )}
        </div>
        {/* Province Telephone Number */}
        <div className="w-full space-y-2">
          <label
            htmlFor="provinceTelNumber"
            className="block text-sm font-medium text-primary"
          >
            Province Telephone Number
          </label>
          <Input id="provinceTelNumber" {...register("provinceTelNumber")} />
          {errors.provinceTelNumber && (
            <span className="text-sm font-medium text-red-600">
              {errors.provinceTelNumber.message}
            </span>
          )}
        </div>
      </div>

      {/* ! End */}
    </div>
  );
};

export default PersonalDataComponent;
