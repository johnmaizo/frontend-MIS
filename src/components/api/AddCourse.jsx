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

import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

import { Label } from "../ui/label";

import { AddDepartmentIcon } from "../Icons";
import { useSchool } from "../context/SchoolContext";
import { AuthContext } from "../context/AuthContext";
import { HasRole } from "../reuseable/HasRole";

import { ErrorMessage } from "../reuseable/ErrorMessage";
import { useMediaQuery } from "../../hooks/use-media-query";
import DepartmentSelector from "../reuseable/DepartmentSelector";
import ConfirmCloseDialog from "../reuseable/ConfirmCloseDialog";

const AddCourse = () => {
  const { user } = useContext(AuthContext);

  const {
    fetchCourse,
    campusActive,
    fetchCampusActive,
    deparmentsActive,
    fetchDepartmentsActive,
    loading,
  } = useSchool();
  const [open, setOpen] = useState(false);

  const [selectedCampus, setSelectedCampus] = useState(""); // State to hold the selected campus

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    clearErrors, // Added clearErrors to manually clear errors
  } = useForm();

  const [error, setGeneralError] = useState("");
  const [success, setSuccess] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [openComboBox, setOpenComboBox] = useState(false);

  const [selectedDepartmentID, setSelectedDepartmentID] = useState("");
  const [selectedDepartmenName, setSelectedDepartmenName] = useState("");

  useEffect(() => {
    fetchCampusActive();
    fetchDepartmentsActive();
    if (user && user.campus_id) {
      // Automatically set the campus if the user has a campus_id
      setSelectedCampus(user.campus_id.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [subjectType, setSubjectType] = useState(""); // State for subject type selection (Lecture or Laboratory)

  const onSubmit = async (data) => {
    if (!subjectType) {
      setError("subjectType", {
        type: "manual",
        message: "You must select a subject type (Lecture or Laboratory).",
      });
      return;
    }

    if (!selectedDepartmentID) {
      setError("department_id", {
        type: "manual",
        message: "You must select a department.",
      });
      return;
    }
    if (HasRole(user.role, "SuperAdmin")) {
      if (!selectedCampus) {
        setError("campus_id", {
          type: "manual",
          message: "You must select a campus.",
        });
        return;
      }
    }

    setLocalLoading(true);
    // Transform form data to replace empty strings or strings with only spaces with null
    const transformedData = {
      ...Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value.trim() === "" ? null : value.trim(),
        ]),
      ),
      campus_id: HasRole(user.role, "SuperAdmin")
        ? parseInt(selectedCampus)
        : user.campus_id, // Add the selected campus to the form data
      department_id:
        selectedDepartmentID === "general-subject"
          ? null
          : parseInt(selectedDepartmentID),
    };

    console.log(transformedData);

    setGeneralError("");
    try {
      const response = await toast.promise(
        axios.post("/course/add-course", transformedData),
        {
          localLoading: "Adding Subject...",
          success: "Subject Added successfully!",
          error: "Failed to add Subject.",
        },
        {
          position: "bottom-right",
          duration: 5000,
        },
      );

      if (response.data) {
        setSuccess(true);
        fetchCourse();
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

        if (user && user.campus_id) {
          // Automatically set the campus if the user has a campus_id
          setSelectedCampus(user.campus_id.toString());
        } else {
          setSelectedCampus(""); // Reset selected campus
        }
        setSelectedDepartmentID(""); // Reset selected department ID
        setSelectedDepartmenName(""); // Reset selected department Name
        setSubjectType("");
      }, 2000);
    } else if (error) {
      setTimeout(() => {
        setGeneralError("");
      }, 5000);
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
    setSelectedCampus(user.campus_id ? user.campus_id.toString() : ""); // Reset selected campus based on user role
    clearErrors("campus_id"); // Clear campus selection error when dialog closes
    clearErrors("department_id"); // Clear campus selection error when dialog closes
    setSelectedDepartmentID(""); // Reset selected department ID
    setSelectedDepartmenName(""); // Reset selected department Name
    setSubjectType("");
  };

  return (
    <div className="w-full items-center justify-end gap-2 md:flex">
      <div>
        <Dialog open={open} onOpenChange={handleDialogClose}>
          <DialogTrigger
            className="flex w-full justify-center gap-1 rounded bg-blue-600 p-3 text-white hover:bg-blue-700 md:w-auto md:justify-normal"
            onClick={() => setOpen(true)}
          >
            <AddDepartmentIcon />
            <span className="max-w-[8em]">Add Subject </span>
          </DialogTrigger>
          <DialogContent className="max-w-[60em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Add new Subject
              </DialogTitle>
              <DialogDescription className="text-base font-medium text-black dark:text-white">
                <span className="inline-block font-bold text-red-700">*</span>{" "}
                NOTE: If this is a Laboratory subject, make sure the code ends
                with an &#39;L&#39; (e.g., IT311L). <br />{" "}
                <span className="ml-3 inline-block">
                  Select the subject type below and click Add when you&#39;re
                  done.
                </span>
              </DialogDescription>

              {/* Blocker for when subject type is not selected */}
              {/* {subjectType === "" && (
                <div className="bg-gray-400 absolute inset-0 z-10 flex items-center justify-center bg-opacity-50 transition-opacity duration-500 ease-in-out">
                  <p className="text-xl font-semibold text-red-600">
                    Please select a subject type to enable the form.
                  </p>
                </div>
              )} */}

              <div
                className={`max-h-[20em] overflow-y-auto overscroll-none text-xl`}
              >
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="p-6.5">
                    {/* Radio Group for Lecture or Laboratory */}
                    <div className="mb-4.5">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Subject Type
                      </label>
                      <RadioGroup
                        value={subjectType}
                        onValueChange={(value) => setSubjectType(value)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Lecture" id="lecture" />
                          <Label htmlFor="lecture">Lecture</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Laboratory" id="laboratory" />
                          <Label htmlFor="laboratory">Laboratory</Label>
                        </div>
                      </RadioGroup>
                      {subjectType === "" && (
                        <ErrorMessage>
                          *Please select a subject type
                        </ErrorMessage>
                      )}
                    </div>

                    <div
                      className={`${subjectType === "" ? "pointer-events-none opacity-50" : ""}`}
                    >
                      <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full">
                          <label
                            className="mb-2.5 block text-black dark:text-white"
                            htmlFor="course_code"
                          >
                            Subject Code
                          </label>
                          <input
                            id="course_code"
                            type="text"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            {...register("courseCode", {
                              required: {
                                value: true,
                                message: "Course Code is required",
                              },
                              validate: {
                                notEmpty: (value) =>
                                  value.trim() !== "" ||
                                  "Course Code cannot be empty or just spaces",
                                noMultipleSpaces: (value) =>
                                  !/\s{2,}/.test(value) ||
                                  "Course Code cannot contain multiple consecutive spaces",
                                isValidCourseCode: (value) => {
                                  value = value.replace(/\s{2,}/g, " "); // Trim extra spaces
                                  const isValidFormat = /^[A-Z0-9\s-]+$/.test(
                                    value,
                                  );

                                  // Validation for Lecture (must NOT end with 'L')
                                  if (
                                    subjectType === "Lecture" &&
                                    value.endsWith("L")
                                  ) {
                                    return "Lecture subject code must not end with 'L'.";
                                  }

                                  // Validation for Laboratory (must end with 'L')
                                  if (
                                    subjectType === "Laboratory" &&
                                    !value.endsWith("L")
                                  ) {
                                    return "Laboratory subject code must end with 'L'.";
                                  }

                                  return (
                                    isValidFormat ||
                                    "Course Code must contain only capital letters, numbers, and hyphens"
                                  );
                                },
                              },
                              setValueAs: (value) =>
                                value.replace(/\s{2,}/g, " ").trim(),
                            })}
                            disabled={
                              localLoading || success || subjectType === ""
                            }
                          />
                          {errors.courseCode && (
                            <ErrorMessage>
                              *{errors.courseCode.message}
                            </ErrorMessage>
                          )}
                        </div>

                        <div className="w-full">
                          <label
                            className="mb-2.5 block text-black dark:text-white"
                            htmlFor="unit"
                          >
                            Unit
                          </label>
                          <input
                            id="unit"
                            type="number"
                            min="1"
                            max="6"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            {...register("unit", {
                              required: {
                                value: true,
                                message: "Unit is required",
                              },
                              validate: {
                                notEmpty: (value) =>
                                  value.trim() !== "" ||
                                  "Unit cannot be empty or just spaces",
                                validUnit: (value) =>
                                  (Number(value) >= 1 && Number(value) <= 6) ||
                                  "Unit must be between 1 and 6",
                              },
                            })}
                            disabled={
                              localLoading || success || subjectType === ""
                            }
                          />
                          {errors.unit && (
                            <ErrorMessage>*{errors.unit.message}</ErrorMessage>
                          )}
                        </div>
                      </div>
                      <div className="mb-4.5 w-full">
                        <label
                          className="mb-2.5 block text-black dark:text-white"
                          htmlFor="course_description"
                        >
                          Subject Description
                        </label>
                        <input
                          id="course_description"
                          type="text"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          {...register("courseDescription", {
                            required: {
                              value: true,
                              message: "Course Description is required",
                            },
                            validate: {
                              notEmpty: (value) =>
                                value.trim() !== "" ||
                                "Course Description cannot be empty or just spaces",
                            },
                          })}
                          disabled={
                            localLoading || success || subjectType === ""
                          }
                        />
                        {errors.courseDescription && (
                          <ErrorMessage>
                            *{errors.courseDescription.message}
                          </ErrorMessage>
                        )}
                      </div>
                      <div className="mb-4.5 w-full">
                        <label
                          className="mb-2.5 block text-black dark:text-white"
                          htmlFor="subject_department"
                        >
                          Department
                        </label>
                        <DepartmentSelector
                          isDesktop={isDesktop}
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
                      <div className="mb-4.5 w-full">
                        <label
                          className="mb-2.5 block text-black dark:text-white"
                          htmlFor="dept_campus"
                        >
                          Campus
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
                                  campus.campus_id.toString() ===
                                  selectedCampus,
                              )?.campusName || ""
                            }
                            disabled
                          />
                        )}
                        {errors.campus_id && (
                          <ErrorMessage>
                            *{errors.campus_id.message}
                          </ErrorMessage>
                        )}
                      </div>
                      {error && (
                        <div className="mb-5 text-center text-red-600">
                          {error}
                        </div>
                      )}
                      <button
                        type="submit"
                        className={`inline-flex w-full justify-center gap-2 rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 ${
                          localLoading || success || error
                            ? "bg-[#505456] hover:!bg-opacity-100"
                            : ""
                        }`}
                        disabled={
                          localLoading || success || error || subjectType === ""
                        }
                      >
                        {localLoading && (
                          <span className="block h-6 w-6 animate-spin rounded-full border-4 border-solid border-secondary border-t-transparent"></span>
                        )}
                        {localLoading
                          ? "Adding Subject..."
                          : success
                            ? "Subject Added!"
                            : "Add Subject"}
                      </button>
                    </div>
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

export default AddCourse;
