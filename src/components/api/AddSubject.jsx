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
import { getInitialCourseCodeAndCampus } from "../reuseable/GetInitialNames";

const AddSubject = () => {
  const { fetchSubject, course, fetchCourse, loading } = useSchool();

  const [open, setOpen] = useState(false);

  const [openComboBox, setOpenComboBox] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [selectedCourse, setSelectedCourse] = useState({});
  const [selectedCourseName, setSelectedCourseName] = useState("");

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
    fetchCourse();
  }, []);

  const onSubmit = async (data) => {
    if (Object.keys(selectedCourse).length === 0) {
      setError("course_id", {
        type: "manual",
        message: "You must select a course.",
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
      unit: parseInt(data.unit),
      course_id: parseInt(selectedCourse.course_id),
      courseCode: selectedCourse.courseCode,
      courseName: selectedCourse.courseName,
      departmentCode: selectedCourse.department.departmentCode,
      departmentName: selectedCourse.department.departmentName,
      campusName: selectedCourse.department.campus.campusName,
    };

    setGeneralError("");
    try {
      const response = await toast.promise(
        axios.post("/subjects/add-subject", transformedData),
        {
          loading: "Adding Subject...",
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
        fetchSubject();
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
        setSelectedCourse({}); // Reset selected department
        setSelectedCourseName(""); // Reset selected department
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
              setSelectedCourse({});
              setSelectedCourseName(""); // Reset selected department Name
              clearErrors("course_id"); // Clear deparment selection error when dialog closes
            }
          }}
        >
          <DialogTrigger className="flex w-full justify-center gap-1 rounded bg-blue-600 p-3 text-white hover:bg-blue-700 md:w-auto md:justify-normal">
            <AddDepartmentIcon />
            <span className="max-w-[8em]">Add Subject </span>
          </DialogTrigger>
          <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Add new Subject
              </DialogTitle>
              <DialogDescription className="h-[20em] overflow-y-auto overscroll-none text-xl lg:h-auto">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="p-6.5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full">
                        <label
                          className="mb-2.5 block text-black dark:text-white"
                          htmlFor="subject_code"
                        >
                          Subject Code
                        </label>
                        <input
                          id="subject_code"
                          type="text"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          {...register("subjectCode", {
                            required: {
                              value: true,
                              message: "Subject Code is required",
                            },
                            validate: {
                              notEmpty: (value) =>
                                value.trim() !== "" ||
                                "Subject Code cannot be empty or just spaces",
                              isUpperCaseAndNumbers: (value) =>
                                /^[A-Z0-9]+$/.test(value) ||
                                "Subject Code must contain only capital letters and numbers",
                            },
                          })}
                          disabled={localLoading || success}
                        />
                        {errors.subjectCode && (
                          <ErrorMessage>
                            *{errors.subjectCode.message}
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
                                [1, 2, 3].includes(Number(value)) ||
                                "Unit must be 1, 2, or 3",
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
                        htmlFor="subjectDescription"
                      >
                        Subject Description
                      </label>
                      <input
                        id="subjectDescription"
                        type="text"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        {...register("subjectDescription", {
                          required: {
                            value: true,
                            message: "Subject Description is required",
                          },
                          validate: {
                            notEmpty: (value) =>
                              value.trim() !== "" ||
                              "Subject Description cannot be empty or just spaces",
                          },
                        })}
                        disabled={localLoading || success}
                      />
                      {errors.subjectDescription && (
                        <ErrorMessage>
                          *{errors.subjectDescription.message}
                        </ErrorMessage>
                      )}
                    </div>

                    <div className="mb-4.5 w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="course_code"
                      >
                        Course
                      </label>

                      {isDesktop ? (
                        <Popover
                          open={openComboBox}
                          onOpenChange={setOpenComboBox}
                          modal={true}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="h-[2.5em] w-[13em] justify-start text-xl text-black dark:bg-form-input dark:text-white md:w-full"
                            >
                              {selectedCourse.course_id ? (
                                <>{selectedCourseName}</>
                              ) : (
                                <>Select Course</>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[200px] p-0"
                            align="start"
                          >
                            <CourseList
                              setOpen={setOpenComboBox}
                              setSelectedCourse={setSelectedCourse}
                              setSelectedCourseName={setSelectedCourseName}
                              data={course}
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
                                className="h-[2.5em] w-[13em] justify-start text-xl text-black dark:bg-form-input dark:text-white md:w-full"
                              >
                                {selectedCourse.course_id ? (
                                  <>{selectedCourseName}</>
                                ) : (
                                  <>Select Course</>
                                )}
                              </Button>
                            </DrawerTrigger>
                            <DrawerContent>
                              <div className="mt-4 border-t">
                                <CourseList
                                  setOpen={setOpenComboBox}
                                  setSelectedCourse={setSelectedCourse}
                                  setSelectedCourseName={setSelectedCourseName}
                                  data={course}
                                  loading={loading}
                                  clearErrors={clearErrors}
                                />
                              </div>
                            </DrawerContent>
                          </Drawer>
                        )
                      )}

                      {errors.course_id && (
                        <ErrorMessage>*{errors.course_id.message}</ErrorMessage>
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
                      {localLoading && (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      )}
                      {localLoading ? "Loading..." : "Add Subject"}
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

function CourseList({
  setOpen,
  setSelectedCourse,
  setSelectedCourseName,
  data,
  loading,
  clearErrors,
}) {
  return (
    <Command
      className="md:!w-[34.5em]"
      filter={(value, search, keywords = []) => {
        const extendValue = value + " " + keywords.join(" ");
        if (extendValue.toLowerCase().includes(search.toLowerCase())) {
          return 1;
        }
        return 0;
      }}
    >
      <CommandInput placeholder="Filter course..." />

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
            data.map((course, index) => (
              <div key={index}>
                <CommandSeparator className="border-t border-slate-200 dark:border-slate-700" />
                <CommandItem
                  value={course.course_id.toString()}
                  keywords={[course.fullCourseNameWithCampus]}
                  onSelect={(value) => {
                    setSelectedCourseName(
                      getInitialCourseCodeAndCampus(
                        course.fullCourseNameWithCampus,
                      ),
                    );

                    setSelectedCourse({ ...course, course_id: value });

                    setOpen(false);
                    clearErrors("course_id");
                  }}
                  className="text-[1rem] font-medium text-black dark:text-white md:!w-[34.5em] md:text-[1.2rem]"
                >
                  {getInitialCourseCodeAndCampus(
                    course.fullCourseNameWithCampus,
                  )}
                </CommandItem>
              </div>
            ))
          ) : (
            <CommandItem
              disabled
              className="text-[1rem] font-medium text-black dark:text-white"
            >
              Empty, please add a course.
            </CommandItem>
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export default AddSubject;
