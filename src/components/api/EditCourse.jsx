/* eslint-disable react/prop-types */
import { EditDepartmentIcon } from "../Icons";
import { useEffect, useState } from "react";
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

import { useSchool } from "../context/SchoolContext";
import { Switch } from "../ui/switch";

const EditCourse = ({ courseId }) => {
  const { fetchCourse } = useSchool();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true); // State for status switch

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (courseId && open) {
      // Fetch the course data when the modal is opened
      setLoading(true);
      axios
        .get(`/course/${courseId}`)
        .then((response) => {
          const course = response.data;
          // Pre-fill the form with course data
          setValue("courseCode", course.courseCode);
          setValue("courseDescription", course.courseDescription);
          setValue("unit", course.unit);
          setIsActive(course.isActive); // Set the initial status
          setLoading(false);
        })
        .catch((err) => {
          setError(`Failed to fetch Course data: (${err})`);
          setLoading(false);
        });
    }
  }, [courseId, open, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
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
    };

    setError("");
    try {
      const response = await toast.promise(
        axios.put(`/course/${courseId}`, transformedData),
        {
          loading: "Updating Course...",
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
      setLoading(false);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setLoading(false);
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
              <DialogDescription className="overflow-y-auto overscroll-none text-xl">
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
                        disabled={success || loading}
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
                          disabled={loading || success}
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
                                [1, 2, 3].includes(Number(value)) ||
                                "Unit must be 1, 2, or 3",
                            },
                          })}
                          disabled={loading || success}
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
                        disabled={loading || success}
                      />
                      {errors.courseDescription && (
                        <ErrorMessage>
                          *{errors.courseDescription.message}
                        </ErrorMessage>
                      )}
                    </div>

                    <button
                      type="submit"
                      className={`inline-flex w-full justify-center gap-2 rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 ${
                        loading || success
                          ? "bg-[#505456] hover:!bg-opacity-100"
                          : ""
                      }`}
                      disabled={loading || success}
                    >
                      {loading && (
                        <span className="block h-6 w-6 animate-spin rounded-full border-4 border-solid border-secondary border-t-transparent"></span>
                      )}
                      {loading
                        ? "Updating Course..."
                        : success
                          ? "Course Updated!"
                          : "Update Course"}
                    </button>
                  </div>
                </form>

                {error && (
                  <div className="mb-5 text-center text-red-600">{error}</div>
                )}
              </DialogDescription>
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
