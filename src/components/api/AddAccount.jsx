/* eslint-disable react-hooks/exhaustive-deps */
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
import EmployeeSelector from "../reuseable/EmployeeSelector";
import { useMediaQuery } from "../../hooks/use-media-query";
import ConfirmCloseDialog from "../reuseable/ConfirmCloseDialog";
import { getDataWithDisable } from "../reuseable/GetUniqueValues";

const AddAccount = () => {
  const { user } = useContext(AuthContext);

  const {
    accounts,
    fetchAccounts,
    campusActive,
    fetchCampusActive,
    employeesActive,
    fetchEmployeesActiveForRoles,
  } = useSchool();
  const [open, setOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [openComboBox, setOpenComboBox] = useState(false);
  const [selectedEmployeeID, setSelectedEmployeeID] = useState("");
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    clearErrors,
    getValues,
  } = useForm();

  const [error, setGeneralError] = useState("");
  const [success, setSuccess] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    fetchCampusActive();
    fetchEmployeesActiveForRoles();
    if (user && user.campus_id) {
      setSelectedCampus(user.campus_id.toString());
    }
  }, []);

  const onSubmit = async (data) => {
    if (!user.campus_id) {
      if (!selectedCampus) {
        setError("campus_id", {
          type: "manual",
          message: "You must select a campus.",
        });
        return;
      }
    }

    if (!selectedEmployeeID) {
      setError("employee", {
        type: "manual",
        message: "You must select a employee.",
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
      employee_id: parseInt(selectedEmployeeID),
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
        setSelectedCampus("");
        setSelectedEmployeeID("");
        setSelectedEmployeeName("");
      }, 5000);
    } else if (error) {
      setTimeout(() => {
        setGeneralError("");
      }, 6000);
    }
  }, [success, error, reset]);

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
    setOpen(false); // Close the AddAccount dialog

    reset(); // Reset form fields
    setSelectedCampus(user.campus_id ? user.campus_id.toString() : "");
    setSelectedEmployeeID("");
    setSelectedEmployeeName("");
    clearErrors("campus_id");
  };

  return (
    <div className="w-full items-center justify-end gap-2 md:flex">
      <div>
        <Dialog open={open} onOpenChange={handleDialogClose}>
          <DialogTrigger
            className="flex w-full justify-center gap-1 rounded bg-blue-600 p-3 text-white hover:bg-blue-700 md:w-auto md:justify-normal"
            onClick={() => setOpen(true)} // Ensure the AddAccount dialog opens on click
          >
            <AddDepartmentIcon title={"Add Account"} />
            <span className="max-w-[8em]">Add Account </span>
          </DialogTrigger>
          <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white xl:max-w-[70em]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Add new Account
              </DialogTitle>
              <DialogDescription className="sr-only">
                <span className="inline-block font-bold text-red-700">*</span>{" "}
                Fill up, Click Add when you&apos;re done.
              </DialogDescription>
              <div className="h-[24em] overflow-y-auto overscroll-none text-xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="p-6.5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="mb-4.5 w-full">
                        <label
                          className="mb-2.5 block text-black dark:text-white"
                          htmlFor="employee"
                        >
                          Employee{" "}
                          <span className="inline-block font-bold text-red-700">
                            *
                          </span>
                        </label>

                        <EmployeeSelector
                          isDesktop={isDesktop}
                          open={openComboBox}
                          setOpen={setOpenComboBox}
                          selectedEmployeeID={selectedEmployeeID}
                          selectedEmployeeName={selectedEmployeeName}
                          data={getDataWithDisable(employeesActive, accounts, "fullNameWithRole")}
                          setSelectedEmployeeID={setSelectedEmployeeID}
                          setSelectedEmployeeName={setSelectedEmployeeName}
                          clearErrors={clearErrors}
                          loading={localLoading}
                        />

                        {errors.employee && (
                          <ErrorMessage>
                            *{errors.employee.message}
                          </ErrorMessage>
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
                        <ErrorMessage>*{errors.password.message}</ErrorMessage>
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
              </div>
            </DialogHeader>
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

export default AddAccount;
