/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { EditDepartmentIcon } from "../Icons";
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

import { useSchool } from "../context/SchoolContext";
import { Switch } from "../ui/switch";
import { AuthContext } from "../context/AuthContext";
import DepartmentSelector from "../reuseable/DepartmentSelector";
import { useMediaQuery } from "../../hooks/use-media-query";

const EditCourse = ({ courseId }) => {
  const { user } = useContext(AuthContext);

  const { fetchCourse, campusActive, deparmentsActive } = useSchool();
  const [open, setOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [isActive, setIsActive] = useState(true); // State for status switch

  const [selectedCampus, setSelectedCampus] = useState(""); // State for selected campus

  const [openComboBox, setOpenComboBox] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [selectedDepartmentID, setSelectedDepartmentID] = useState(""); // State for selected department ID
  const [selectedDepartmenName, setSelectedDepartmenName] = useState(""); // State for selected department Name

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    clearErrors, // Added clearErrors to manually clear errors
  } = useForm();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (courseId && open) {
      // Fetch the course data when the modal is opened
      setLocalLoading(true);
      axios
        .get(`/course/${courseId}`)
        .then((response) => {
          const course = response.data;
          // Pre-fill the form with course data
          setValue("courseCode", course.courseCode);
          setValue("courseDescription", course.courseDescription);
          setValue("unit", course.unit);
          setIsActive(course.isActive); // Set the initial status
          setSelectedCampus(course.campus_id.toString());
          setSelectedDepartmentID(
            course.department_id
              ? course.department_id.toString()
              : "general-subject",
          );
          setSelectedDepartmenName(
            course.fullDepartmentNameWithCampus
              ? course.fullDepartmentNameWithCampus
              : "General Subject",
          );
          setLocalLoading(false);
        })
        .catch((err) => {
          setError(`Failed to fetch Course data: (${err})`);
          setLocalLoading(false);
        });
    }
  }, [courseId, open, setValue]);

  const onSubmit = async (data) => {
    if (!selectedDepartmentID) {
      setError("department_id", {
        type: "manual",
        message: "You must select a department.",
      });
      return;
    }

    if (!selectedCampus) {
      setError("campus_id", "You must select a campus.");
      return;
    }

    setLocalLoading(true);
    // Add isActive to the form data
    const transformedData = {
      ...Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          typeof value === "string"
            ? value.trim() === ""
              ? null
              : value.trim()
            : value,
        ]),
      ),
      isActive: isActive ? true : false, // Set isActive based on the switch value
      campus_id: parseInt(selectedCampus), // Add the selected campus to the form data
      department_id:
        selectedDepartmentID === "general-subject"
          ? null
          : parseInt(selectedDepartmentID),
    };

    setError("");
    try {
      const response = await toast.promise(
        axios.put(`/course/${courseId}`, transformedData),
        {
          localLoading: "Updating Course...",
          success: "Course updated successfully!",
          error: "Failed to update Course.",
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
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
        reset();
      }, 5000);
    } else if (error) {
      setTimeout(() => {
        setError("");
      }, 6000);
    }
  }, [success, error, reset]);

  return (
    <div className="flex items-center justify-end gap-2">
      <div>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
              reset(); // Reset form fields when the dialog is closed
              setSelectedCampus(""); // Reset selected campus
              clearErrors("campus_id"); // Clear campus selection error when dialog closes
            }

            if (!localLoading) {
              setOpen(isOpen); // Prevent closing the dialog if loading
            }
          }}
        >
          <DialogTrigger className="flex gap-1 rounded p-2 text-black hover:text-blue-700 dark:text-white dark:hover:text-blue-700">
            <EditDepartmentIcon forActions={"Edit Course"} />
          </DialogTrigger>

          <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Edit Course
              </DialogTitle>
              <DialogDescription className="sr-only">
                <span className="inline-block font-bold text-red-700">*</span>{" "}
                Edit, Click Add when you&apos;re done.
              </DialogDescription>
              <div className="max-h-[25em] overflow-y-auto overscroll-none text-xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="p-6.5">
                    <div className="mb-5 w-full xl:w-[12em]">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="course_active"
                      >
                        Status{" "}
                        <span className="inline-block font-bold text-red-700">
                          *
                        </span>
                      </label>
                      <Switch
                        id="course_active"
                        checked={isActive}
                        onCheckedChange={setIsActive} // Update the status when the switch is toggled
                        disabled={success || localLoading}
                      />
                    </div>

                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full">
                        <label
                          className="mb-2.5 block text-black dark:text-white"
                          htmlFor="course_code"
                        >
                          Course Code
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
                              isValidCourseCode: (value) =>
                                /^[A-Z0-9\s-]+$/.test(value) ||
                                "Course Code must contain only capital letters, numbers, and hyphens",
                            },
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
                        Course Description
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
                        loading={localLoading}
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
                        htmlFor="campus"
                      >
                        Campus
                      </label>

                      {user.role !== "SuperAdmin" ? (
                        <input
                          id="campus"
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
                      ) : (
                        <Select
                          onValueChange={(value) => {
                            setSelectedCampus(value);
                            clearErrors("campus_id");
                          }}
                          value={selectedCampus}
                          disabled={success || localLoading}
                        >
                          <SelectTrigger className="h-[2.5em] w-full text-xl text-black dark:bg-form-input dark:text-white">
                            <SelectValue placeholder="Select a campus" />
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
                      )}

                      {errors.campus_id && (
                        <ErrorMessage>{errors.campus_id.message}</ErrorMessage>
                      )}
                    </div>

                    {error && (
                      <span className="mt-2 inline-block pb-6 font-medium text-red-600">
                        Error: {error}
                      </span>
                    )}

                    <button
                      type="submit"
                      className={`inline-flex w-full justify-center gap-2 rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 ${
                        localLoading || success
                          ? "bg-[#505456] hover:!bg-opacity-100"
                          : ""
                      }`}
                      disabled={localLoading || success}
                    >
                      {localLoading && (
                        <span className="block h-6 w-6 animate-spin rounded-full border-4 border-solid border-secondary border-t-transparent"></span>
                      )}
                      {localLoading
                        ? "Updating Course..."
                        : success
                          ? "Course Updated!"
                          : "Update Course"}
                    </button>
                  </div>
                </form>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const ErrorMessage = ({ children }) => {
  return (
    <span className="mt-2 inline-block text-sm font-medium text-red-600">
      {children}
    </span>
  );
};

export default EditCourse;
