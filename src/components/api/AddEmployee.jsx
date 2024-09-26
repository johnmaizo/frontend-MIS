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
            value: "DataCenter",
            label: "DataCenter",
          },
          {
            value: "Registrar",
            label: "Registrar",
          },
          {
            value: "Staff",
            label: "Staff",
          },
          {
            value: "Teacher",
            label: "Teacher",
          },
        ]
      : [
          {
            value: "DataCenter",
            label: "DataCenter",
          },
          {
            value: "Registrar",
            label: "Registrar",
          },
          {
            value: "Staff",
            label: "Staff",
          },
          {
            value: "Teacher",
            label: "Teacher",
          },
        ];

  const { fetchEmployees, campusActive, fetchCampusActive } = useSchool();
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

  // State to store the selected roles as an array of strings (values only)
  const [selectedRoles, setSelectedRoles] = useState([]);

  // State to store the selected role objects
  const [selectedRoleObjects, setSelectedRoleObjects] = useState([]);

  // List of disallowed roles
  const disallowedRoles = HasRole(user.role, "SuperAdmin")
    ? []
    : HasRole(user.role, "Admin")
      ? ["SuperAdmin", "Oten"]
      : ["SuperAdmin", "Admin", "Oten"];

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
        // Ensure uniqueness and check against disallowed roles
        return (
          self.indexOf(value) === index && !disallowedRoles.includes(value)
        );
      });

    // Create an array of objects for selectedRoleObjects with first letter capitalized and spaces removed
    const updatedSelectedRoleObjects = selectedOptions
      .map((option) => ({
        value: capitalizeFirstLetter(option.value),
        label: capitalizeFirstLetter(option.label),
      }))
      .filter((obj, index, self) => {
        // Ensure uniqueness based on the value and check against disallowed roles
        return (
          self.map((o) => o.value).indexOf(obj.value) === index &&
          !disallowedRoles.includes(obj.value)
        );
      });

    // Update the states
    setSelectedRoles(updatedSelectedRoles);
    setSelectedRoleObjects(updatedSelectedRoleObjects);
  };

  useEffect(() => {
    fetchCampusActive();
    if (user && user.campus_id) {
      // Automatically set the campus if the user has a campus_id
      setSelectedCampus(user.campus_id.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    setLocalLoading(true);
    const transformedData = {
      ...Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value.trim() === "" ? null : value.trim(),
        ]),
      ),
      campus_id: user.campus_id ? user.campus_id : parseInt(selectedCampus), // Add the selected campus to the form data
      role: selectedRoles,
      gender: selectedGender,
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
      }, 5000);
    } else if (error) {
      setTimeout(() => {
        setGeneralError("");
      }, 6000);
    }
  }, [success, error, reset, user.role]);

  return (
    <div className="w-full items-center justify-end gap-2 md:flex">
      <div>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
              reset(); // Reset form fields when the dialog is closed
              setSelectedRoles([]);
              setSelectedRoleObjects([]);
              setSelectedGender("");
              setSelectedCampus(
                user.campus_id ? user.campus_id.toString() : "",
              ); // Reset selected campus based on user role
              clearErrors("campus_id");
              clearErrors("role");
              clearErrors("gender");
            }
          }}
        >
          <DialogTrigger className="flex w-full justify-center gap-1 rounded bg-blue-600 p-3 text-white hover:bg-blue-700 md:w-auto md:justify-normal">
            <AddDepartmentIcon title={"Add Employee"} />
            <span className="max-w-[8em]">Add Employee </span>
          </DialogTrigger>
          <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white xl:max-w-[70em]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Add new Employee
              </DialogTitle>
              <DialogDescription className="h-[24em] overflow-y-auto overscroll-none text-xl">
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
                          <ErrorMessage>
                            *{errors.firstName.message}
                          </ErrorMessage>
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
                          <ErrorMessage>
                            *{errors.lastName.message}
                          </ErrorMessage>
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
                              message:
                                "Contact number must only contain numbers",
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
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AddEmployee;
