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
import { getInitialProgramCodeAndCampus } from "../reuseable/GetInitialNames";

const EditSubject = ({ subjectId }) => {
  const { fetchSubject, course } = useSchool();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [openComboBox, setOpenComboBox] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [selectedSubject, setSelectedSubject] = useState({});
  const [selectedCourseName, setSelectedCourseName] = useState("");

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
    if (subjectId && open) {
      // Fetch the course data when the modal is opened
      setLoading(true);
      axios
        .get(`/subjects/${subjectId}`)
        .then((response) => {
          const subject = response.data;

          // Pre-fill the form with subject data
          setValue("subjectCode", subject.subjectCode);
          setValue("unit", subject.unit);
          setValue("subjectDescription", subject.subjectDescription);
          setIsActive(subject.isActive);

          // Spread the course object directly into selectedSubject
          setSelectedSubject({
            ...subject,
            ...subject.course,
            departmentCode: subject.course.department.departmentCode,
            departmentName: subject.course.department.departmentName,
            campusName: subject.course.department.campus.campusName,
          });

          setSelectedCourseName(
            getInitialProgramCodeAndCampus(subject.fullCourseNameWithCampus),
          );
          setLoading(false);
        })
        .catch((err) => {
          setError(`Failed to fetch subject data: (${err})`);
          setLoading(false);
        });
    }
  }, [subjectId, open, setValue]);

  const onSubmit = async (data) => {
    if (Object.keys(selectedSubject).length === 0) {
      setError("course_id", {
        type: "manual",
        message: "You must select a course.",
      });
      return;
    }

    setLoading(true);

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
      isActive: isActive ? true : false,
      course_id: parseInt(selectedSubject.course_id),
      courseCode: selectedSubject.courseCode,
      courseName: selectedSubject.courseName,
      departmentCode: selectedSubject.departmentCode,
      departmentName: selectedSubject.departmentName,
      campusName: selectedSubject.campusName,
    };

    setError("");
    try {
      const response = await toast.promise(
        axios.put(`/subjects/${subjectId}`, transformedData),
        {
          loading: "Updating Subject...",
          success: "Subject updated successfully!",
          error: "Failed to update Subject.",
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
        setSelectedSubject({});
        setSelectedCourseName("");
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
              setSelectedSubject({});
              setSelectedCourseName("");
              clearErrors("course_id");
            }
          }}
        >
          <DialogTrigger className="flex gap-1 rounded p-2 text-black hover:text-blue-700 dark:text-white dark:hover:text-blue-700">
            <EditDepartmentIcon forActions={"Edit Subject"} />
          </DialogTrigger>

          <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Edit Subject
              </DialogTitle>
              <DialogDescription className="h-[20em] overflow-y-auto overscroll-none text-xl lg:h-auto">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="p-6.5">
                    <div className="w-full pb-3 xl:w-[12em]">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="subject_active"
                      >
                        Status{" "}
                        <span className="inline-block font-bold text-red-700">
                          *
                        </span>
                      </label>
                      <Switch
                        id="subject_active"
                        checked={isActive}
                        onCheckedChange={setIsActive} // Update the status when the switch is toggled
                        disabled={success || loading}
                      />
                    </div>

                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full">
                        <label
                          className="mb-2.5 block text-black dark:text-white"
                          htmlFor="subject_code"
                        >
                          Subject Code{" "}
                          <span className="inline-block font-bold text-red-700">
                            *
                          </span>
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
                          disabled={success || loading}
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
                          Unit{" "}
                          <span className="inline-block font-bold text-red-700">
                            *
                          </span>
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
                          disabled={success || loading}
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
                        Subject Description{" "}
                        <span className="inline-block font-bold text-red-700">
                          *
                        </span>
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
                        disabled={loading || success}
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
                              disabled={loading || success}
                              variant="outline"
                              className="h-[2.5em] w-[13em] justify-start text-xl text-black dark:bg-form-input dark:text-white md:w-full"
                            >
                              {selectedSubject.course_id ? (
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
                              selectedSubject={selectedSubject}
                              setOpen={setOpenComboBox}
                              setSelectedSubject={setSelectedSubject}
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
                                disabled={loading || success}
                                variant="outline"
                                className="h-[2.5em] w-[13em] justify-start text-xl text-black dark:bg-form-input dark:text-white md:w-full"
                              >
                                {selectedSubject.course_id ? (
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
                                  setSelectedSubject={setSelectedSubject}
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
                        ? "Updating Subject..."
                        : success
                          ? "Subject Updated!"
                          : "Update Subject"}
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
  setSelectedSubject,
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
                      getInitialProgramCodeAndCampus(
                        course.fullCourseNameWithCampus,
                      ),
                    );

                    setSelectedSubject((prevSelectedSubject) => ({
                      ...prevSelectedSubject,
                      ...course,
                      course_id: value,
                      departmentCode: course.department.departmentCode,
                      departmentName: course.department.departmentName,
                    }));

                    setOpen(false);
                    clearErrors("course_id");
                  }}
                  className="text-[1rem] font-medium text-black dark:text-white md:!w-[34.5em] md:text-[1.2rem]"
                >
                  {getInitialProgramCodeAndCampus(
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

export default EditSubject;
