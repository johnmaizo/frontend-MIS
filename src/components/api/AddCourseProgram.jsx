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

import { AddDepartmentIcon } from "../Icons";
import { useSchool } from "../context/SchoolContext";
import { AuthContext } from "../context/AuthContext";

import { useParams } from "react-router-dom";
import { getUniqueCourseCodes } from "../reuseable/GetUniqueValues";

import useFetchProgramById from "../reuseable/useFetchProgramById";
import { HasRole } from "../reuseable/HasRole";

import { ErrorMessage } from "../reuseable/ErrorMessage";
import CustomPopover from "../reuseable/CustomPopover";
import CustomList from "../reuseable/CustomList";

const AddCourseProgram = () => {
  const { user } = useContext(AuthContext);

  const { campusName, program_id } = useParams();

  const { fetchProgramCourse, courseActive, fetchCourseActive } = useSchool();

  const { program, programLoading } = useFetchProgramById(
    program_id,
    campusName,
  );

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

  // eslint-disable-next-line no-unused-vars
  const clearAllSelections = () => {
    setSelectedCourses([]);
  };

  useEffect(() => {
    fetchCourseActive(program_id);
    if (user && HasRole(user.role, "SuperAdmin")) {
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
          loading: "Assigning Subject...",
          success: "Assigned Subject successfully!",
          error: "Failed to Assign Subject.",
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
              if (!selectedCourses.length) {
                setSelectedCourses([]); // Reset selected courses
              }
            }
          }}
        >
          <DialogTrigger className="flex w-full justify-center gap-1 rounded bg-blue-600 p-3 text-white hover:bg-blue-700 md:w-auto md:justify-normal">
            <AddDepartmentIcon />
            <span className="max-w-[8em]">Assign Subject </span>
          </DialogTrigger>
          <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white lg:max-w-[70em]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Assign new Subject
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
                        value={
                          programLoading
                            ? "Loading..."
                            : `${program?.programCode} - ${program?.programDescription}`
                        }
                        disabled
                      />
                    </div>

                    <div className="mb-4.5 w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="dept_campus"
                      >
                        Select Subject
                      </label>

                      <CustomPopover
                        openPopover={openPopover}
                        setOpenPopover={setOpenPopover}
                        loading={loading || programLoading || success}
                        selectedItems={selectedCourses.map(
                          (val) =>
                            uniqueCourses.find((course) => course.value === val)
                              ?.value,
                        )}
                        itemName="Subject"
                        handleClearAll={clearAllSelections}
                      >
                        <CustomList
                          handleSelect={handleSetCourses}
                          value={selectedCourses}
                          data={uniqueCourses}
                          searchPlaceholder="Search Subject..."
                          clearErrors={clearErrors}
                          entity="courseChoose"
                        />
                      </CustomPopover>

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
                      disabled={loading || programLoading || success || error}
                    >
                      {loading && (
                        <span className="block h-6 w-6 animate-spin rounded-full border-4 border-solid border-secondary border-t-transparent"></span>
                      )}
                      {loading
                        ? "Adding Subject..."
                        : programLoading
                          ? "Loading..."
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

export default AddCourseProgram;
