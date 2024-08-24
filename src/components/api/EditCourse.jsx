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

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";

import { useSchool } from "../context/SchoolContext";
import { Switch } from "../ui/switch";

import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { Button } from "../ui/button";
import { useMediaQuery } from "../../hooks/use-media-query";

const EditCourse = ({ courseId }) => {
  const { fetchCourse, deparmentsCustom } = useSchool();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true); // State for status switch

  const [openComboBox, setOpenComboBox] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [selectedDepartment, setSelectedDepartment] = useState(""); // State for selected department

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
      setLoading(true);
      axios
        .get(`/course/${courseId}`)
        .then((response) => {
          const course = response.data;
          // Pre-fill the form with course data
          setValue("courseCode", course.courseCode);
          setValue("courseName", course.courseName);
          setIsActive(course.isActive); // Set the initial status
          setSelectedDepartment(course.departmentName.toString()); // Set the initial department
          setLoading(false);
        })
        .catch((err) => {
          setError(`Failed to fetch course data: (${err})`);
          setLoading(false);
        });
    }
  }, [courseId, open, setValue]);

  const onSubmit = async (data) => {
    if (!selectedDepartment) {
      setError("departmentName", "You must select a department.");
      return;
    }

    setLoading(true);
    // Add isActive and selectedDepartment to the form data
    const transformedData = {
      ...Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value.trim() === "" ? null : value.trim(),
        ]),
      ),
      isActive: isActive ? true : false, // Set isActive based on the switch value
      departmentName: selectedDepartment, // Add the selected department to the form data
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

  useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(
        `[name="${firstErrorField}"]`,
      );
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement.focus();
      }
    }
  }, [errors]);

  return (
    <div className="flex items-center justify-end gap-2">
      <div>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
              reset(); // Reset form fields when the dialog is closed
              setSelectedDepartment(""); // Reset selected campus
              clearErrors("campus_id"); // Clear campus selection error when dialog closes
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
              <DialogDescription className="h-[20em] overflow-y-auto overscroll-none text-xl lg:h-auto">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="p-6.5">
                    <div className="w-full pb-3 xl:w-[12em]">
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
                      <div className="w-full xl:w-[13.5em]">
                        <label
                          className="mb-2.5 block text-black dark:text-white"
                          htmlFor="course_code"
                        >
                          Course Code{" "}
                          <span className="inline-block font-bold text-red-700">
                            *
                          </span>
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
                            },
                          })}
                          disabled={success || loading}
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
                          htmlFor="course_name"
                        >
                          Course Name{" "}
                          <span className="inline-block font-bold text-red-700">
                            *
                          </span>
                        </label>
                        <input
                          id="course_name"
                          type="text"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          {...register("courseName", {
                            required: {
                              value: true,
                              message: "Course Name is required",
                            },
                            validate: {
                              notEmpty: (value) =>
                                value.trim() !== "" ||
                                "Course Name cannot be empty or just spaces",
                            },
                          })}
                          disabled={success || loading}
                        />
                        {errors.courseName && (
                          <ErrorMessage>
                            *{errors.courseName.message}
                          </ErrorMessage>
                        )}
                      </div>
                    </div>

                    <div className="mb-4.5 w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="course_department"
                      >
                        Department
                      </label>

                      {isDesktop ? (
                        <Popover
                          open={openComboBox}
                          onOpenChange={setOpenComboBox}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              disabled={loading}
                              className="h-[2.5em] w-[13em] justify-start text-xl text-black dark:bg-form-input dark:text-white md:w-full"
                            >
                              {selectedDepartment ? (
                                <>{selectedDepartment}</>
                              ) : (
                                <>
                                  {loading ? "Loading..." : "Select Department"}
                                </>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[200px] p-0"
                            align="start"
                          >
                            <DepartmentList
                              setOpen={setOpenComboBox}
                              setSelectedDepartment={setSelectedDepartment}
                              data={deparmentsCustom}
                              loading={loading}
                              clearErrors={clearErrors}
                            />
                          </PopoverContent>
                        </Popover>
                      ) : (
                        !isDesktop && (
                          <Drawer
                            open={openComboBox}
                            onOpenChange={setOpenComboBox}
                          >
                            <DrawerTrigger asChild>
                              <Button
                                variant="outline"
                                disabled={loading}
                                className="h-[2.5em] w-[13em] justify-start text-xl text-black dark:bg-form-input dark:text-white md:w-full"
                              >
                                {selectedDepartment ? (
                                  <>{selectedDepartment}</>
                                ) : (
                                  <>
                                    {loading
                                      ? "Loading..."
                                      : "Select Department"}
                                  </>
                                )}
                              </Button>
                            </DrawerTrigger>
                            <DrawerContent>
                              <div className="mt-4 border-t">
                                <DepartmentList
                                  setOpen={setOpenComboBox}
                                  setSelectedDepartment={setSelectedDepartment}
                                  data={deparmentsCustom}
                                  loading={loading}
                                  clearErrors={clearErrors}
                                />
                              </div>
                            </DrawerContent>
                          </Drawer>
                        )
                      )}

                      {errors.departmentName && (
                        <ErrorMessage>
                          *{errors.departmentName.message}
                        </ErrorMessage>
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
                        ? "Updating Department..."
                        : success
                          ? "Department Updated!"
                          : "Update Department"}
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

// eslint-disable-next-line react/prop-types
const ErrorMessage = ({ children }) => {
  return (
    <span className="mt-2 inline-block text-sm font-medium text-red-600">
      {children}
    </span>
  );
};

function DepartmentList({
  setOpen,
  setSelectedDepartment,
  data,
  loading,
  clearErrors,
}) {
  return (
    <Command className="md:!w-[34.5em]">
      <CommandInput placeholder="Filter department..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {loading && (
            <CommandItem
              disabled
              className="text-[1rem] font-medium text-black dark:text-white md:text-[1.2rem]"
            >
              Searching...
            </CommandItem>
          )}
          {data && data.length ? (
            data.map((department, index) => (
              <>
                <CommandSeparator className="border-t border-slate-200 dark:border-slate-700" />
                <CommandItem
                  key={index}
                  value={department.departmentName.toString()}
                  onSelect={(value) => {
                    setSelectedDepartment(value);
                    setOpen(false);
                    clearErrors("departmentName");
                  }}
                  className="text-[1rem] font-medium text-black dark:text-white md:!w-[34.5em] md:text-[1.2rem]"
                >
                  {department.departmentName}
                </CommandItem>
              </>
            ))
          ) : (
            <CommandItem
              disabled
              className="text-[1rem] font-medium text-black dark:text-white"
            >
              Empty, please add a department.
            </CommandItem>
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export default EditCourse;