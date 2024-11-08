/* eslint-disable react/prop-types */
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "../../../../../components/ui/input";
import { useSchool } from "../../../../../components/context/SchoolContext";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectLabel,
} from "../../../../../components/ui/select";
import { HasRole } from "../../../../../components/reuseable/HasRole";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../../components/context/AuthContext";
import { SelectValue } from "@radix-ui/react-select";

const PersonalDataComponent = ({ isUpdate }) => {
  // Destructure necessary methods from useFormContext
  const {
    control,
    register,
    formState: { errors },
    setValue,
    clearErrors,
    watch, // Add watch to retrieve field values
  } = useFormContext();

  const { campusActive, loading } = useSchool();
  const { user } = useContext(AuthContext);

  const [selectedCampus, setSelectedCampus] = useState("");

  // Set the initial campus based on the user's role
  useEffect(() => {
    if (HasRole(user.role, "SuperAdmin")) {
      // SuperAdmin can select any campus
      setSelectedCampus("");
    } else {
      // Other users are assigned to a specific campus
      const campusId = user.campus_id ? user.campus_id.toString() : "";
      setSelectedCampus(campusId);
      setValue("campus_id", parseInt(campusId));
    }
  }, [user, setValue]);

  // Retrieve student_id using watch
  const studentId = isUpdate ? watch("student_id") : null;

  return (
    <div className="space-y-4 text-start">
      {isUpdate && (
        <div className="mb-4 rounded border border-blue-200 bg-blue-100 p-4">
          <h3 className="text-lg font-medium text-blue-800">
            Update Student Information
          </h3>
        </div>
      )}

      {isUpdate && (
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
          {/* Student ID */}
          <div className="w-full space-y-2">
            <label
              htmlFor="student_id"
              className="block text-sm font-medium text-primary"
            >
              Student ID
            </label>
            <Input
              id="student_id"
              type="text"
              {...register("student_id")}
              readOnly
              disabled
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
        {/* Campus ID */}
        <div className="w-full space-y-2">
          <label
            htmlFor="campus_id"
            className="block text-sm font-medium text-primary"
          >
            Campus
          </label>

          {HasRole(user.role, "SuperAdmin") ? (
            <Select
              onValueChange={(value) => {
                setSelectedCampus(value);
                setValue("campus_id", parseInt(value));
                clearErrors("campus_id");
              }}
              value={selectedCampus}
              disabled={loading}
            >
              <SelectTrigger className="h-[2.5em] w-full text-xl text-black dark:bg-form-input dark:text-white">
                <SelectValue placeholder="Select Campus" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Campuses</SelectLabel>
                  {campusActive.map((campus) => (
                    <SelectItem
                      key={campus.campus_id}
                      value={campus.campus_id.toString()}
                    >
                      {campus.campusName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="dept_campus"
              type="text"
              className="disabled:bg-gray-100 w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              value={
                campusActive.find(
                  (campus) => campus.campus_id.toString() === selectedCampus,
                )?.campusName || ""
              }
              disabled
            />
          )}

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

          <Controller
            name="enrollmentType"
            control={control}
            defaultValue="on-site"
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value || "on-site"}
              >
                <SelectTrigger className="h-[3em] w-full text-[1rem] text-black dark:bg-form-input dark:text-white">
                  <SelectValue placeholder={field.value || "On-site"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select Enrollment Type</SelectLabel>
                    <SelectItem value="online" disabled>
                      Online
                    </SelectItem>
                    <SelectItem value="on-site">On-site</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          {errors.enrollmentType && (
            <span className="text-sm font-medium text-red-600">
              {errors.enrollmentType.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
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

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
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

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
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

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
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

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
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
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
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

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
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
