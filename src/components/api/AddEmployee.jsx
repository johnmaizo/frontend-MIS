/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { AddDepartmentIcon } from "../Icons";
import { useSchool } from "../context/SchoolContext";
import { AuthContext } from "../context/AuthContext";
import { HasRole } from "../reuseable/HasRole";

import { ErrorMessage } from "../reuseable/ErrorMessage";
import SmallLoader from "../styles/SmallLoader";
import FormInput from "../reuseable/FormInput";
import MultipleSelector from "../ui/multiple-selector";
import { Input } from "../ui/input";

import DepartmentSelector from "../reuseable/DepartmentSelector";

import { useMediaQuery } from "../../hooks/use-media-query";
import ConfirmCloseDialog from "../reuseable/ConfirmCloseDialog";

const AddEmployee = () => {
  const { user } = useContext(AuthContext);

  const roles =
    HasRole(user.role, "SuperAdmin") || HasRole(user.role, "Admin")
      ? [
          {
            value: "Admin",
            label: "Admin",
          },
          {
            value: "MIS",
            label: "MIS",
          },
          {
            value: "Registrar",
            label: "Registrar",
          },
          {
            value: "DataCenter",
            label: "DataCenter",
          },
          {
            value: "Accounting",
            label: "Accounting",
          },
          {
            value: "Dean",
            label: "Dean",
          },
          {
            value: "Staff",
            label: "Staff",
          },
          {
            value: "Instructor",
            label: "Instructor",
          },
        ]
      : [
          {
            value: "MIS",
            label: "MIS",
          },
          {
            value: "Registrar",
            label: "Registrar",
          },
          {
            value: "DataCenter",
            label: "DataCenter",
          },
          {
            value: "Accounting",
            label: "Accounting",
          },
          {
            value: "Dean",
            label: "Dean",
          },
          {
            value: "Staff",
            label: "Staff",
          },
          {
            value: "Instructor",
            label: "Instructor",
          },
        ];

  const {
    fetchEmployees,
    campusActive,
    fetchCampusActive,
    deparmentsActive,
    fetchDepartmentsActive,
    loading,
  } = useSchool();
  const [open, setOpen] = useState(false);

  const [selectedCampus, setSelectedCampus] = useState("");
  const [selectedGender, setSelectedGender] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const [error, setGeneralError] = useState("");
  const [success, setSuccess] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedRoleObjects, setSelectedRoleObjects] = useState([]);

  const shouldShowDepartment = selectedRoles.some((role) =>
    ["Dean", "Teacher", "Instructor"].includes(role),
  );

  // List of disallowed roles (converted to lowercase for case-insensitive comparison)
  const disallowedRoles = HasRole(user.role, "SuperAdmin")
    ? []
    : HasRole(user.role, "Admin")
      ? ["SuperAdmin", "Oten"]
      : ["SuperAdmin", "Admin", "Oten"];

  // Convert disallowedRoles to lowercase for case-insensitive matching
  const disallowedRolesLowerCase = disallowedRoles.map((role) =>
    role.toLowerCase(),
  );

  // Updated handleRoleChange function
  const handleRoleChange = (selectedOptions) => {
    // Utility function to capitalize the first letter, remove spaces, and trim the string
    const capitalizeFirstLetter = (string) => {
      const trimmedString = string.trim().replace(/\s+/g, ""); // Remove spaces and trim
      return trimmedString.charAt(0).toUpperCase() + trimmedString.slice(1);
    };

    // Create an array of strings for selectedRoles with the first letter capitalized and spaces removed
    const updatedSelectedRoles = selectedOptions
      .map((option) => capitalizeFirstLetter(option.value))
      .filter((value, index, self) => {
        // Ensure uniqueness and check against disallowed roles (convert value to lowercase for comparison)
        return (
          self.indexOf(value) === index &&
          !disallowedRolesLowerCase.includes(value.toLowerCase())
        );
      });

    // Create an array of objects for selectedRoleObjects with first letter capitalized and spaces removed
    const updatedSelectedRoleObjects = selectedOptions
      .map((option) => ({
        value: capitalizeFirstLetter(option.value),
        label: capitalizeFirstLetter(option.label),
      }))
      .filter((obj, index, self) => {
        // Ensure uniqueness based on the value and check against disallowed roles (convert value to lowercase for comparison)
        return (
          self.map((o) => o.value).indexOf(obj.value) === index &&
          !disallowedRolesLowerCase.includes(obj.value.toLowerCase())
        );
      });

    // Update the states
    setSelectedRoles(updatedSelectedRoles);
    setSelectedRoleObjects(updatedSelectedRoleObjects);
    clearErrors("role");
  };

  useEffect(() => {
    fetchCampusActive();
    fetchDepartmentsActive();
    if (user && user.campus_id) {
      // Automatically set the campus if the user has a campus_id
      setSelectedCampus(user.campus_id.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [openComboBox, setOpenComboBox] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedDepartmentID, setSelectedDepartmentID] = useState("");
  const [selectedDepartmenName, setSelectedDepartmenName] = useState("");

  const [qualifications, setQualifications] = useState([
    { abbreviation: "", meaning: "" },
  ]);

  const handleQualificationChange = (index, event) => {
    const values = [...qualifications];
    values[index][event.target.name] = event.target.value;
    setQualifications(values);
  };

  const handleAddQualification = () => {
    setQualifications([...qualifications, { abbreviation: "", meaning: "" }]);
    clearErrors("qualifications");
  };

  const handleRemoveQualification = (index) => {
    const values = [...qualifications];
    values.splice(index, 1);
    setQualifications(values);
  };

  const onSubmit = async (data) => {
    if (HasRole(user.role, "SuperAdmin")) {
      if (!selectedCampus) {
        setError("campus_id", {
          type: "manual",
          message: "You must select a campus.",
        });
        return;
      }
    }
    if (!selectedRoles.length) {
      setError("role", {
        type: "manual",
        message: "You must select a Role.",
      });
      return;
    }
    if (!selectedGender) {
      setError("gender", {
        type: "manual",
        message: "You must select a Gender.",
      });
      return;
    }
    if (shouldShowDepartment) {
      if (!selectedDepartmentID || selectedDepartmentID === "blank") {
        setError("department_id", {
          type: "manual",
          message: "You must select a department.",
        });
        return;
      }
    }

    // Check qualifications for mismatches between abbreviation and meaning
    const incompleteQualifications = qualifications.some(
      (qual) =>
        (qual.abbreviation.trim() && !qual.meaning.trim()) ||
        (!qual.abbreviation.trim() && qual.meaning.trim()),
    );

    if (incompleteQualifications) {
      setError("qualifications", {
        type: "manual",
        message:
          "Each qualification must have both an abbreviation and a meaning.",
      });
      return;
    }

    setLocalLoading(true);
    const transformedData = {
      ...Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          typeof value === "string" && value.trim() === ""
            ? null
            : value.trim(),
        ]),
      ),
      campus_id: user.campus_id ? user.campus_id : parseInt(selectedCampus), // Add the selected campus to the form data
      role: selectedRoles,
      gender: selectedGender,
      qualifications:
        qualifications
          .filter(
            (qual) =>
              qual.abbreviation.trim() !== "" || qual.meaning.trim() !== "",
          )
          .map((qual) => ({
            abbreviation: qual.abbreviation.trim().toUpperCase(), // Convert abbreviation to uppercase
            meaning: qual.meaning.trim(),
          }))
          .filter((qual) => qual.abbreviation !== "" || qual.meaning !== "")
          .length === 0
          ? null // return null if no valid qualifications
          : qualifications
              .filter(
                (qual) =>
                  qual.abbreviation.trim() !== "" || qual.meaning.trim() !== "",
              )
              .map((qual) => ({
                abbreviation: qual.abbreviation.trim().toUpperCase(), // Convert abbreviation to uppercase
                meaning: qual.meaning.trim(),
              })),
      department_id:
        !shouldShowDepartment && selectedDepartmentID === "blank"
          ? null
          : parseInt(selectedDepartmentID),
    };

    setGeneralError("");
    try {
      const response = await toast.promise(
        axios.post("/employee/add-employee", transformedData),
        {
          loading: "Adding Employee...",
          success: "Employee Added successfully!",
          error: "Failed to add Employee.",
        },
        {
          position: "bottom-right",
          duration: 5000,
        },
      );

      if (response.data) {
        setSuccess(true);
        fetchEmployees();
        setOpen(false); // Close the dialog
      }
      setLocalLoading(false);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setGeneralError(err.response.data.message);
      } else {
        setGeneralError("An unexpected error occurred. Please try again.");
      }
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
        reset();
        if (HasRole(user.role, "SuperAdmin")) {
          setSelectedCampus(""); // Reset selected campus
        }
        setSelectedGender("");
        setSelectedRoles([]);
        setSelectedRoleObjects([]);
        setQualifications([{ abbreviation: "", meaning: "" }]);
        setSelectedDepartmentID("");
        setSelectedDepartmenName("");
      }, 5000);
    } else if (error) {
      setTimeout(() => {
        setGeneralError("");
      }, 6000);
    }
  }, [success, error, reset, user.role]);

  const [confirmClose, setConfirmClose] = useState(false); // State for confirmation dialog

  // Handle the close button of AddAccount dialog
  const handleDialogClose = (isOpen) => {
    if (!isOpen) {
      // If user is trying to close the dialog, show the confirmation dialog
      setConfirmClose(true);
    } else {
      // If dialog is opening, just open it normally
      setOpen(true);
    }
  };

  // Confirm closing both dialogs
  const confirmDialogClose = () => {
    setConfirmClose(false);
    setOpen(false);

    reset(); // Reset form fields when the dialog is closed
    setSelectedRoles([]);
    setSelectedRoleObjects([]);
    setSelectedGender("");
    setSelectedCampus(user.campus_id ? user.campus_id.toString() : ""); // Reset selected campus based on user role
    setQualifications([{ abbreviation: "", meaning: "" }]);
    setSelectedDepartmentID("");
    setSelectedDepartmenName("");
    clearErrors("campus_id");
    clearErrors("role");
    clearErrors("gender");
    clearErrors("qualifications");
    clearErrors("department_id");
  };

  return (
    <div className="w-full items-center justify-end gap-2 md:flex">
      <div>
        <Dialog open={open} onOpenChange={handleDialogClose}>
          <DialogTrigger
            className="flex w-full justify-center gap-1 rounded bg-blue-600 p-3 text-white hover:bg-blue-700 md:w-auto md:justify-normal"
            onClick={() => setOpen(true)}
          >
            <AddDepartmentIcon title={"Add Employee"} />
            <span className="max-w-[8em]">Add Employee </span>
          </DialogTrigger>
          <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white xl:max-w-[70em]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Add new Employee
              </DialogTitle>
              <DialogDescription className="sr-only">
                <span className="inline-block font-bold text-red-700">*</span>{" "}
                Fill up, Click Add when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="h-[24em] overflow-y-auto overscroll-none text-xl">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-6.5">
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-[13em]">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="title"
                      >
                        Title{" "}
                        <span className="inline-block font-bold text-red-700">
                          *
                        </span>
                      </label>
                      <FormInput
                        id="title"
                        register={register}
                        validationRules={{
                          required: {
                            value: true,
                            message: "Title is required",
                          },
                          validate: {
                            notEmpty: (value) =>
                              value.trim() !== "" ||
                              "Title cannot be empty or just spaces",
                          },
                        }}
                        disabled={localLoading || success}
                      />
                      {errors.title && (
                        <ErrorMessage>*{errors.title.message}</ErrorMessage>
                      )}
                    </div>
                    <div className="w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="firstName"
                      >
                        First Name{" "}
                        <span className="inline-block font-bold text-red-700">
                          *
                        </span>
                      </label>
                      <FormInput
                        id="firstName"
                        placeholder="First Name"
                        register={register}
                        validationRules={{
                          required: {
                            value: true,
                            message: "First Name is required",
                          },
                          validate: {
                            notEmpty: (value) =>
                              value.trim() !== "" ||
                              "First Name cannot be empty or just spaces",
                          },
                        }}
                        disabled={localLoading || success}
                      />
                      {errors.firstName && (
                        <ErrorMessage>*{errors.firstName.message}</ErrorMessage>
                      )}
                    </div>

                    <div className="w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="middleName"
                      >
                        Middle Name{" "}
                        <span className="inline-block font-bold text-red-700">
                          *
                        </span>
                      </label>
                      <FormInput
                        id="middleName"
                        placeholder="*Leave blank if not applicable"
                        register={register}
                        disabled={success}
                        className={"placeholder:text-[1.1rem]"}
                      />
                    </div>

                    <div className="w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="lastName"
                      >
                        Last Name{" "}
                        <span className="inline-block font-bold text-red-700">
                          *
                        </span>
                      </label>
                      <FormInput
                        id="lastName"
                        placeholder="Last Name"
                        register={register}
                        validationRules={{
                          required: {
                            value: true,
                            message: "Last Name is required",
                          },
                          validate: {
                            notEmpty: (value) =>
                              value.trim() !== "" ||
                              "Last Name cannot be empty or just spaces",
                          },
                        }}
                        disabled={localLoading || success}
                      />
                      {errors.lastName && (
                        <ErrorMessage>*{errors.lastName.message}</ErrorMessage>
                      )}
                    </div>
                  </div>

                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="mb-4.5 w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="address"
                      >
                        Address{" "}
                        <span className="inline-block font-bold text-red-700">
                          *
                        </span>
                      </label>
                      <FormInput
                        id="address"
                        placeholder="Address"
                        register={register}
                        validationRules={{
                          required: {
                            value: true,
                            message: "Address is required",
                          },
                          validate: {
                            notEmpty: (value) =>
                              value.trim() !== "" ||
                              "Address cannot be empty or just spaces",
                          },
                        }}
                        disabled={localLoading || success}
                      />
                      {errors.address && (
                        <ErrorMessage>*{errors.address.message}</ErrorMessage>
                      )}
                    </div>
                    <div className="mb-4.5 w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="gender"
                      >
                        Gender{" "}
                        <span className="inline-block font-bold text-red-700">
                          *
                        </span>
                      </label>

                      <Select
                        onValueChange={(value) => {
                          setSelectedGender(value);
                          clearErrors("gender");
                        }}
                        value={selectedGender}
                        disabled={localLoading || success}
                      >
                        <SelectTrigger className="h-[2.5em] w-full text-xl text-black dark:bg-form-input dark:text-white">
                          <SelectValue
                            placeholder="Select Gender"
                            defaultValue={selectedGender}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Gender</SelectLabel>
                            <SelectItem value={"Male"}>Male</SelectItem>
                            <SelectItem value={"Female"}>Female</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      {errors.gender && (
                        <ErrorMessage>*{errors.gender.message}</ErrorMessage>
                      )}
                    </div>
                  </div>

                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="contactNumber"
                      >
                        Contact Number
                      </label>
                      <FormInput
                        id="contactNumber"
                        placeholder="'09'"
                        register={register}
                        validationRules={{
                          required: {
                            value: true,
                            message: "Contact number is required",
                          },
                          pattern: {
                            value: /^[0-9]*$/,
                            message: "Contact number must only contain numbers",
                          },
                          validate: (value) => {
                            if (value.startsWith("09")) {
                              return (
                                value.length === 11 ||
                                'Contact number must be 11 digits long when starting with "09"'
                              );
                            } else {
                              return 'Contact number must start with "09"';
                            }
                          },
                        }}
                        disabled={localLoading || success}
                      />
                      {errors.contactNumber && (
                        <ErrorMessage>
                          *{errors.contactNumber.message}
                        </ErrorMessage>
                      )}
                    </div>

                    <div className="mb-4.5 w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="birthDate"
                      >
                        Birth Date:
                      </label>
                      <input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        {...register("birthDate", {
                          required: {
                            value: true,
                            message: "Birth date is required",
                          },
                          validate: {
                            validYear: (value) =>
                              validateBirthDate(value) ||
                              `Invalid birth date. Please enter a valid year between 1900 and ${new Date().getFullYear() - 10}.`,
                          },
                        })}
                        disabled={success}
                      />
                      {errors.birthDate && (
                        <span className="mt-2 inline-block text-sm font-medium text-red-600">
                          *{errors.birthDate.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="mb-4.5 w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="role"
                      >
                        Role{" "}
                        <span className="inline-block font-bold text-red-700">
                          *
                        </span>
                      </label>

                      <MultipleSelector
                        defaultOptions={roles}
                        placeholder="Search Role..."
                        creatable
                        emptyIndicator={
                          <p className="text-gray-600 dark:text-gray-400 bg-white text-center text-lg leading-10 dark:border-form-strokedark dark:bg-form-input">
                            No results found😭
                          </p>
                        }
                        className={"bg-white"}
                        value={selectedRoleObjects} // Use selectedRoleObjects for the value
                        onChange={handleRoleChange} // Attach the onChange handler
                      />

                      {errors.role && (
                        <ErrorMessage>*{errors.role.message}</ErrorMessage>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-6 xl:flex-row">
                    <div className="mb-4.5 w-full dark:bg-transparent md:bg-gray-2 md:p-3">
                      <span className="mb-2.5 block">
                        Qualification{" "}
                        <span className="inline-block font-bold text-red-700">
                          *
                        </span>{" "}
                        <span className="text-sm">
                          (You can skip this if not applicable)
                        </span>
                      </span>
                      {qualifications.map((qualification, index) => (
                        <div key={index} className="qualification">
                          <div className="mt-5 flex w-full flex-wrap justify-between gap-3 md:flex-nowrap">
                            <div className="w-full md:w-auto">
                              <span className="ml-1 block text-sm">
                                Abbreviation
                              </span>
                              <Input
                                type="text"
                                name="abbreviation"
                                placeholder="Abbreviation"
                                value={qualification.abbreviation}
                                onChange={(event) => {
                                  handleQualificationChange(index, event);
                                  clearErrors("qualifications");
                                }}
                                className="bg-white !p-2"
                              />
                            </div>
                            <div className="w-full">
                              <span className="ml-1 block text-sm">
                                Full Meaning
                              </span>
                              <Input
                                type="text"
                                name="meaning"
                                placeholder="Full Meaning (Leave blank if not applicable)"
                                value={qualification.meaning}
                                onChange={(event) => {
                                  handleQualificationChange(index, event);
                                  clearErrors("qualifications");
                                }}
                                className="bg-white !p-2"
                              />
                            </div>
                          </div>
                          {index !== 0 && (
                            <input
                              type="button"
                              onClick={() => {
                                handleRemoveQualification(index);
                                clearErrors("qualifications");
                              }}
                              className="mt-2 cursor-pointer rounded !bg-red-600 p-1 text-sm text-white hover:!bg-red-700"
                              value={"Remove"}
                            />
                          )}
                        </div>
                      ))}
                      <input
                        type="button"
                        onClick={handleAddQualification}
                        className="mt-4 cursor-pointer text-wrap rounded !bg-blue-600 p-2 text-sm text-white hover:!bg-blue-700 md:text-[1rem]"
                        value={"Add another Qualification"}
                      />

                      {errors.qualifications && (
                        <ErrorMessage>
                          *{errors.qualifications.message}
                        </ErrorMessage>
                      )}
                    </div>
                  </div>

                  {shouldShowDepartment && (
                    <div className="mb-4.5 w-full">
                      <span className="mb-2.5 block text-black dark:text-white">
                        Department
                      </span>

                      <DepartmentSelector
                        isDesktop={isDesktop}
                        hideGeneralSubject={true}
                        open={openComboBox}
                        setOpen={setOpenComboBox}
                        selectedDepartmentID={selectedDepartmentID}
                        selectedDepartmenName={selectedDepartmenName}
                        departmentsActive={deparmentsActive}
                        setSelectedDepartmentID={setSelectedDepartmentID}
                        setSelectedDepartmenName={setSelectedDepartmenName}
                        clearErrors={clearErrors}
                        loading={loading}
                      />

                      {errors.department_id && (
                        <ErrorMessage>
                          *{errors.department_id.message}
                        </ErrorMessage>
                      )}
                    </div>
                  )}

                  <div className="mb-4.5 w-full">
                    <label
                      className="mb-2.5 block text-black dark:text-white"
                      htmlFor="acc_campus"
                    >
                      Campus{" "}
                      <span className="inline-block font-bold text-red-700">
                        *
                      </span>
                    </label>

                    {HasRole(user.role, "SuperAdmin") ? (
                      <Select
                        onValueChange={(value) => {
                          setSelectedCampus(value);
                          clearErrors("campus_id");
                        }}
                        value={selectedCampus}
                        disabled={localLoading || success}
                      >
                        <SelectTrigger className="h-[2.5em] w-full text-xl text-black dark:bg-form-input dark:text-white">
                          <SelectValue
                            placeholder="Select Campus"
                            defaultValue={selectedCampus}
                          />
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
                      <input
                        id="dept_campus"
                        type="text"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={
                          campusActive.find(
                            (campus) =>
                              campus.campus_id.toString() === selectedCampus,
                          )?.campusName || ""
                        }
                        disabled
                      />
                    )}

                    {errors.campus_id && (
                      <ErrorMessage>*{errors.campus_id.message}</ErrorMessage>
                    )}
                  </div>

                  {error && (
                    <span className="mt-2 inline-block py-3 font-medium text-red-600">
                      Error: {error}
                    </span>
                  )}

                  <button
                    type="submit"
                    className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded bg-primary p-3.5 font-medium text-gray hover:bg-opacity-90 lg:text-base xl:text-lg"
                    disabled={localLoading || success}
                  >
                    {localLoading && <SmallLoader />}
                    {localLoading ? "Loading..." : "Add Employee"}
                  </button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>

        <ConfirmCloseDialog
          isOpen={confirmClose}
          onConfirmClose={confirmDialogClose} // Confirm and close both dialogs
          onCancel={() => setConfirmClose(false)} // Cancel closing
        />
      </div>
    </div>
  );
};

const validateBirthDate = (value) => {
  const birthYear = new Date(value).getFullYear();
  const currentYear = new Date().getFullYear();
  return (
    birthYear >= 1900 &&
    birthYear < currentYear &&
    birthYear <= currentYear - 10
  ); // which is 13 years old
};

export default AddEmployee;
