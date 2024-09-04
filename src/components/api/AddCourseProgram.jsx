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

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";

import { Button } from "../ui/button";

import { AddDepartmentIcon } from "../Icons";
import { useSchool } from "../context/SchoolContext";
import { AuthContext } from "../context/AuthContext";

import { useParams } from "react-router-dom";
import { getUniqueCourseCodes } from "../reuseable/GetUniqueValues";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "../../lib/utils";
import useFetchProgramById from "../reuseable/useFetchProgramById";

const AddCourseProgram = () => {
  const { user } = useContext(AuthContext);

  const { campusName, program_id } = useParams();

  const { fetchProgramCourse, courseActive, fetchCourseActive } = useSchool();

  const { program } = useFetchProgramById(program_id, campusName);

  const [open, setOpen] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);

  const [selectedCampus, setSelectedCampus] = useState(""); // State to hold the selected campus

  const uniqueCourses = getUniqueCourseCodes(courseActive, "courseCode");

  const [selectedCourses, setSelectedCourses] = useState([]);

  const {
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    clearErrors, // Added clearErrors to manually clear errors
  } = useForm();

  const [error, setGeneralError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSetCourses = (val) => {
    if (selectedCourses.includes(val)) {
      setSelectedCourses(selectedCourses.filter((item) => item !== val));
    } else {
      setSelectedCourses((prevValue) => [...prevValue, val]);
    }
  };

  const clearAllSelections = () => {
    setSelectedCourses([]);
  };

  useEffect(() => {
    fetchCourseActive();
    if (user && user.role === "SuperAdmin") {
      setSelectedCampus(program.department.campus.campus_id);
    } else if (user && user.campus_id) {
      // Automatically set the campus if the user has a campus_id
      setSelectedCampus(user.campus_id.toString());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data) => {
    if (!selectedCourses.length) {
      setError("courseChoose", {
        type: "manual",
        message: "You must select a course.",
      });
      return;
    }

    setLoading(true);
    // Transform form data to replace empty strings or strings with only spaces with null
    const transformedData = {
      ...Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value.trim() === "" ? null : value.trim(),
        ]),
      ),
      campus_id: parseInt(selectedCampus), // Add the selected campus to the form data
      programCode: program.programCode,
      courseCode: selectedCourses,
    };

    console.log(transformedData);

    setGeneralError("");
    try {
      const response = await toast.promise(
        axios.post("/program-courses/assign-program-course", transformedData),
        {
          loading: "Assigning Course...",
          success: "Assigned Course successfully!",
          error: "Failed to Assign Course.",
        },
        {
          position: "bottom-right",
          duration: 5000,
        },
      );

      if (response.data) {
        setSuccess(true);
        fetchProgramCourse(campusName, program_id);
        setOpen(false); // Close the dialog
      }
      setLoading(false);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setGeneralError(err.response.data.message);
      } else {
        setGeneralError("An unexpected error occurred. Please try again.");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
        reset();
        setSelectedCourses([]); // Reset selected courses
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
              clearErrors("courseChoose"); // Clear campus selection error when dialog closes
              setSelectedCourses([]); // Reset selected courses
            }
          }}
        >
          <DialogTrigger className="flex w-full justify-center gap-1 rounded bg-blue-600 p-3 text-white hover:bg-blue-700 md:w-auto md:justify-normal">
            <AddDepartmentIcon />
            <span className="max-w-[8em]">Assign Course </span>
          </DialogTrigger>
          <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Assign new Course
              </DialogTitle>
              <DialogDescription className="h-[18em] overflow-y-auto overscroll-none text-xl">
                <form onSubmit={handleSubmit(onSubmit)} className="h-full">
                  <div className="p-6.5">
                    <div className="mb-4.5 w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="program_code"
                      >
                        Program
                      </label>
                      <input
                        id="program_code"
                        type="text"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={`${program?.programCode} - ${program?.programDescription}`}
                        disabled
                      />
                    </div>

                    <div className="mb-4.5 w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="dept_campus"
                      >
                        Select Course
                      </label>

                      {/* <Select
                        onValueChange={(value) => {
                          setSelectedCampus(value);
                          clearErrors("campus_id");
                        }}
                        value={selectedCampus}
                        disabled={loading || success}
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
                            {courseActive.map((course) => (
                              <SelectItem
                                key={course.course_id}
                                value={course.course_id.toString()}
                              >
                                {course.courseCode} - {course.courseDescription}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select> */}

                      <Popover
                        open={openPopover}
                        onOpenChange={setOpenPopover}
                        modal={true}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="h-auto w-full justify-between bg-white px-3 py-4 transition dark:border-form-strokedark dark:bg-form-input"
                            disabled={loading || success}
                          >
                            <div className="flex flex-wrap justify-start gap-2">
                              {selectedCourses?.length ? (
                                selectedCourses.map((val, i) => (
                                  <div
                                    key={i}
                                    className="rounded bg-slate-200 px-2 py-1 text-[1.2rem] font-medium text-black dark:bg-strokedark dark:text-white"
                                  >
                                    {
                                      uniqueCourses.find(
                                        (course) => course.value === val,
                                      )?.value
                                    }
                                  </div>
                                ))
                              ) : (
                                <span className="inline-block text-[1.2rem]">
                                  Select Course..
                                </span>
                              )}
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <SubjectList
                            handleSetCourses={handleSetCourses}
                            value={selectedCourses}
                            data={uniqueCourses}
                            clearErrors={clearErrors}
                          />
                          {/* {selectedCourses.length > 0 && (
                            <div className="!w-full p-4">
                              <Button
                                variant="destructive"
                                onClick={clearAllSelections}
                                className="w-full"
                              >
                                Clear All
                              </Button>
                            </div>
                          )} */}
                        </PopoverContent>
                      </Popover>

                      {errors.courseChoose && (
                        <ErrorMessage>
                          *{errors.courseChoose.message}
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
                        loading || success
                          ? "bg-[#505456] hover:!bg-opacity-100"
                          : ""
                      }`}
                      disabled={loading || success || error}
                    >
                      {loading && (
                        <span className="block h-6 w-6 animate-spin rounded-full border-4 border-solid border-secondary border-t-transparent"></span>
                      )}
                      {loading
                        ? "Adding Course..."
                        : success
                          ? "Course Added!"
                          : "Add Course"}
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

const SubjectList = ({ handleSetCourses, value, data, clearErrors }) => {
  return (
    <Command
      className="w-[21em] md:w-[45em]"
      filter={(itemValue, search) => {
        // Find the item in the data array based on the value
        const item = data.find((d) => d.value === itemValue);

        // Combine the value and label for searching
        const combinedText = `${item?.value} ${item?.label}`.toLowerCase();

        // Check if the search term exists in the combined value and label text
        return combinedText.includes(search.toLowerCase()) ? 1 : 0;
      }}
    >
      <CommandInput placeholder="Search Course..." />
      <CommandEmpty>No Course found.</CommandEmpty>
      <CommandList className="!overflow-hidden">
        <CommandGroup>
          <CommandList className="h-[12em]">
            {data && data.length ? (
              data.map((data) => (
                <div key={data.value}>
                  <CommandSeparator className="border-t border-slate-200 dark:border-slate-700" />
                  <CommandItem
                    value={data.value}
                    onSelect={() => {
                      handleSetCourses(data.value);
                      clearErrors("courseChoose");
                    }}
                    className="py-4 !text-[1.3rem] font-medium text-black dark:text-white md:text-[1.2rem]"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(data.value)
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {data.label}
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
          </CommandList>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default AddCourseProgram;
