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
import CustomPopover from "../reuseable/CustomPopover";
import CustomList from "../reuseable/CustomList";
import FormInput from "../reuseable/FormInput";

/**
 * AddAccount component
 *
 * @description
 *   Dialog component for adding a new account. The form is
 *   validated using react-hook-form. The submit button is
 *   disabled if the form is invalid or if an account with the
 *   same email already exists.
 *
 * @prop {boolean} open - Whether the dialog is open or not
 * @prop {boolean} setOpen - Set the open state of the dialog
 * @prop {boolean} localLoading - Whether the component is loading or not
 * @prop {boolean} success - Whether the form was submitted successfully or not
 * @prop {string} error - The error message if the form was not submitted successfully
 */
const AddAccount = () => {
  const { user } = useContext(AuthContext);

  const roles =
    HasRole(user.role, "SuperAdmin") || HasRole(user.role, "Admin")
      ? [
          {
            value: "Admin",
            label: "Admin",
          },
          {
            value: "Registrar",
            label: "Registrar",
          },
          {
            value: "DataCenter",
            label: "Data Center",
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
            value: "Registrar",
            label: "Registrar",
          },
          {
            value: "DataCenter",
            label: "Data Center",
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

  const { fetchAccounts, campusActive, fetchCampusActive } = useSchool();
  const [open, setOpen] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);

  const [selectedCampus, setSelectedCampus] = useState("");
  const [selectedGender, setSelectedGender] = useState("");

  const [selectedRole, setSelectedRole] = useState([]);

  const handleSetRoles = (val) => {
    if (selectedRole.includes(val)) {
      setSelectedRole(selectedRole.filter((item) => item !== val));
    } else {
      setSelectedRole((prevValue) => [...prevValue, val]);
    }
  };

  // Check if selectedRole contains "Admin" or "Registrar"
  const showPasswordFields =
    selectedRole.length &&
    selectedRole.some(
      (role) =>
        role === "Admin" || role === "Registrar" || role === "DataCenter",
    );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    clearErrors, // Added clearErrors to manually clear errors
    getValues,
  } = useForm();

  const [error, setGeneralError] = useState("");
  const [success, setSuccess] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    fetchCampusActive();
    if (user && user.campus_id) {
      // Automatically set the campus if the user has a campus_id
      setSelectedCampus(user.campus_id.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data) => {
    if (!selectedCampus) {
      setError("campus_id", {
        type: "manual",
        message: "You must select a campus.",
      });
      return;
    }
    if (!selectedRole.length) {
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
      campus_id: parseInt(selectedCampus), // Add the selected campus to the form data
      role: selectedRole,
      gender: selectedGender,
      acceptTerms: true,
    };

    setGeneralError("");
    try {
      const response = await toast.promise(
        axios.post("/accounts/", transformedData),
        {
          loading: "Adding Account...",
          success: "Account Added successfully!",
          error: "Failed to add Account.",
        },
        {
          position: "bottom-right",
          duration: 5000,
        },
      );

      if (response.data) {
        setSuccess(true);
        fetchAccounts();
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
        setSelectedCampus(""); // Reset selected campus
        setSelectedGender("");
        setSelectedRole([]);
      }, 5000);
    } else if (error) {
      setTimeout(() => {
        setGeneralError("");
      }, 6000);
    }
  }, [success, error, reset]);

  return (
    <div className="w-full items-center justify-end gap-2 md:flex">
      <div>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
              reset(); // Reset form fields when the dialog is closed
              setSelectedRole([]);
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
            <AddDepartmentIcon title={"Add Account"} />
            <span className="max-w-[8em]">Add Account </span>
          </DialogTrigger>
          <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white xl:max-w-[70em]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Add new Account
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

                        <CustomPopover
                          openPopover={openPopover}
                          setOpenPopover={setOpenPopover}
                          loading={localLoading || success}
                          selectedItems={
                            selectedRole.length &&
                            selectedRole.map(
                              (val) =>
                                roles.find((role) => role.value === val)?.value,
                            )
                          }
                          itemName="Role"
                        >
                          <CustomList
                            handleSelect={handleSetRoles}
                            value={selectedRole}
                            data={roles}
                            searchPlaceholder="Search Role..."
                            clearErrors={clearErrors}
                            entity={"role"}
                          />
                        </CustomPopover>

                        {errors.role && (
                          <ErrorMessage>*{errors.role.message}</ErrorMessage>
                        )}
                      </div>
                    </div>

                    <div className="mb-4.5 w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="email"
                      >
                        Email{" "}
                        <span className="inline-block font-bold text-red-700">
                          *
                        </span>
                      </label>
                      <FormInput
                        id="email"
                        placeholder="Email"
                        register={register}
                        validationRules={{
                          required: {
                            value: true,
                            message: "Email is required",
                          },
                          validate: {
                            notEmpty: (value) =>
                              value.trim() !== "" ||
                              "Email cannot be empty or just spaces",
                          },
                        }}
                        disabled={localLoading || success}
                      />
                      {errors.email && (
                        <ErrorMessage>*{errors.email.message}</ErrorMessage>
                      )}
                    </div>

                    {showPasswordFields === true && (
                      <>
                        <div className="mb-4.5 w-full">
                          <label
                            className="mb-2.5 block text-black dark:text-white"
                            htmlFor="password"
                          >
                            Password{" "}
                            <span className="inline-block font-bold text-red-700">
                              *
                            </span>
                          </label>
                          <FormInput
                            id="password"
                            placeholder="Password"
                            register={register}
                            validationRules={{
                              required: {
                                value: true,
                                message: "Password is required",
                              },
                              validate: {
                                notEmpty: (value) =>
                                  value.trim() !== "" ||
                                  "Password cannot be empty or just spaces",
                              },
                            }}
                            disabled={localLoading || success}
                          />
                          {errors.password && (
                            <ErrorMessage>
                              *{errors.password.message}
                            </ErrorMessage>
                          )}
                        </div>

                        <div className="mb-4.5 w-full">
                          <label
                            className="mb-2.5 block text-black dark:text-white"
                            htmlFor="confirmPassword"
                          >
                            Confirm Password{" "}
                            <span className="inline-block font-bold text-red-700">
                              *
                            </span>
                          </label>
                          <FormInput
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            register={register}
                            validationRules={{
                              required: {
                                value: true,
                                message: "Confirm Password is required",
                              },
                              validate: {
                                notEmpty: (value) =>
                                  value.trim() !== "" ||
                                  "Confirm Password cannot be empty or just spaces",
                                matchesPassword: (value) =>
                                  value === getValues("password") ||
                                  "Passwords do not match",
                              },
                            }}
                            disabled={localLoading || success}
                          />
                          {errors.confirmPassword && (
                            <ErrorMessage>
                              *{errors.confirmPassword.message}
                            </ErrorMessage>
                          )}
                        </div>
                      </>
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
                      {localLoading ? "Loading..." : "Add Account"}
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

export default AddAccount;
