/* eslint-disable react/prop-types */
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

import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { Button } from "../ui/button";

import { useMediaQuery } from "../../hooks/use-media-query";

import { AddDepartmentIcon } from "../Icons";
import { useSchool } from "../context/SchoolContext";

const AddCourse = () => {
  const { fetchCourse, deparmentsCustom, fetchDepartmentsActive, loading } =
    useSchool();

  const [open, setOpen] = useState(false);

  const [openComboBox, setOpenComboBox] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [selectedDepartment, setSelectedDepartment] = useState("");

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

  useEffect(() => {
    fetchDepartmentsActive();
  }, []);

  const onSubmit = async (data) => {
    if (!selectedDepartment) {
      setError("departmentName", {
        type: "manual",
        message: "You must select a department.",
      });
      return;
    }

    setLocalLoading(true);
    const transformedData = {
      ...data,
      departmentName: selectedDepartment,
    };

    console.log(transformedData);

    setGeneralError("");
    try {
      const response = await toast.promise(
        axios.post("/course/add-course", transformedData),
        {
          loading: "Adding Course...",
          success: "Course Added successfully!",
          error: "Failed to add Course.",
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
        setSelectedDepartment(""); // Reset selected campus
      }, 5000);
    } else if (error) {
      setTimeout(() => {
        setGeneralError("");
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
    <div className="w-full items-center justify-end gap-2 md:flex">
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
          <DialogTrigger className="flex w-full justify-center gap-1 rounded bg-blue-600 p-3 text-white hover:bg-blue-700 md:w-auto md:justify-normal">
            <AddDepartmentIcon />
            <span className="max-w-[8em]">Add Course </span>
          </DialogTrigger>
          <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Add new Course
              </DialogTitle>
              <DialogDescription className="h-[20em] overflow-y-auto overscroll-none text-xl lg:h-auto">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="p-6.5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-[12em]">
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
                          htmlFor="course_name"
                        >
                          Course Name
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
                          disabled={localLoading || success}
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
                              className="h-[2.5em] w-full justify-start text-xl text-black dark:bg-form-input dark:text-white"
                            >
                              {selectedDepartment ? (
                                <>{selectedDepartment}</>
                              ) : (
                                <>Select Department</>
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
                                className="h-[2.5em] w-full justify-start text-xl text-black dark:bg-form-input dark:text-white"
                              >
                                {selectedDepartment ? (
                                  <>{selectedDepartment}</>
                                ) : (
                                  <>Select Department</>
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
                      <span className="mt-2 inline-block py-3 font-medium text-red-600">
                        Error: {error}
                      </span>
                    )}

                    <button
                      type="submit"
                      className="mt-5 inline-flex w-full items-center justify-center rounded bg-primary p-3.5 font-medium text-gray hover:bg-opacity-90 lg:text-base xl:text-lg"
                      disabled={localLoading || success}
                    >
                      {localLoading ? (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      ) : (
                        "Add Course"
                      )}
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
      <CommandInput placeholder="Filter status..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {loading && (
            <CommandItem
              disabled
              className="text-[1rem] font-medium text-black dark:text-white"
            >
              Searching...
            </CommandItem>
          )}
          {data && data.length ? (
            data.map((department, index) => (
              <>
                <CommandSeparator
                  key={index}
                  className="border-t border-slate-200 dark:border-slate-700"
                />
                <CommandItem
                  key={index}
                  value={department.departmentName.toString()}
                  onSelect={(value) => {
                    setSelectedDepartment(value);
                    setOpen(false);
                    clearErrors("departmentName");
                  }}
                  className="text-[1rem] font-medium text-black dark:text-white md:!w-[34.5em]"
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

export default AddCourse;
