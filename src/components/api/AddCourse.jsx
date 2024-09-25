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
import { useMediaQuery } from "../../hooks/use-media-query";
import DepartmentSelector from "../reuseable/DepartmentSelector";

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

  const onSubmit = async (data) => {
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
      }, 2000);
    } else if (error) {
      setTimeout(() => {
        setGeneralError("");
      }, 5000);
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
              setSelectedCampus(
                user.campus_id ? user.campus_id.toString() : "",
              ); // Reset selected campus based on user role
              clearErrors("campus_id"); // Clear campus selection error when dialog closes
              clearErrors("department_id"); // Clear campus selection error when dialog closes
              setSelectedDepartmentID(""); // Reset selected department ID
              setSelectedDepartmenName(""); // Reset selected department Name
            }
          }}
        >
          <DialogTrigger className="flex w-full justify-center gap-1 rounded bg-blue-600 p-3 text-white hover:bg-blue-700 md:w-auto md:justify-normal">
            <AddDepartmentIcon />
            <span className="max-w-[8em]">Add Subject </span>
          </DialogTrigger>
          <DialogContent className="max-w-[60em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Add new Subject
              </DialogTitle>
              <DialogDescription className="max-h-[20em] overflow-y-auto overscroll-none text-xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="p-6.5">
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
                                // Replace multiple spaces with a single space
                                value = value.replace(/\s{2,}/g, " ");
                                return (
                                  /^[A-Z0-9\s-]+$/.test(value) ||
                                  "Course Code must contain only capital letters, numbers, and hyphens"
                                );
                              },
                            },
                            setValueAs: (value) =>
                              value.replace(/\s{2,}/g, " ").trim(), // Automatically trim and replace multiple spaces
                          })}
                          disabled={localLoading || success}
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
                                [1, 2, 3, 6].includes(Number(value)) ||
                                "Unit must be 1, 2, 3, or 6",
                            },
                          })}
                          disabled={localLoading || success}
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
                        disabled={localLoading || success}
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
                      <div className="mb-5 text-center text-red-600">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      className={`inline-flex w-full justify-center gap-2 rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 ${
                        localLoading || success
                          ? "bg-[#505456] hover:!bg-opacity-100"
                          : ""
                      }`}
                      disabled={localLoading || success || error}
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
                </form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AddCourse;
