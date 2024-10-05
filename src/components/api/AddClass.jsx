/* eslint-disable react-hooks/exhaustive-deps */
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

import { ErrorMessage } from "../reuseable/ErrorMessage";
import ConfirmCloseDialog from "../reuseable/ConfirmCloseDialog";
import CustomSelector from "../reuseable/CustomSelector";
import { useMediaQuery } from "../../hooks/use-media-query";
import { compareDataAndSetDisable } from "../reuseable/GetUniqueValues";

const AddClass = () => {
  const { user } = useContext(AuthContext);

  const {
    fetchClass,
    courseActive,
    fetchCourseActive,
    fetchSemesters,
    semesters,
    fetchEmployeesActive,
    employeesActive,
    employeeLoading,
    loading,
  } = useSchool();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const [error, setGeneralError] = useState("");
  const [success, setSuccess] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const [openComboBox, setOpenComboBox] = useState(false);
  const [openComboBox2, setOpenComboBox2] = useState(false);
  const [openComboBox3, setOpenComboBox3] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [selectedSubjectID, setSelectedSubjectID] = useState("");
  const [selectedSubjectName, setSelectedSubjectName] = useState("");

  const [selectedSemesterID, setSelectedSemesterID] = useState("");
  const [selectedSemesterName, setSelectedSemesterName] = useState("");

  const [selectedInstructorID, setSelectedInstructorID] = useState("");
  const [selectedInstructorName, setSelectedInstructorName] = useState("");

  const [selectedCourseCode, setSelectedCourseCode] = useState("");

  useEffect(() => {
    fetchCourseActive();
    fetchSemesters();
    fetchEmployeesActive("Instructor");
  }, []);

  const onSubmit = async (data) => {
    if (!selectedSubjectID) {
      setError("course_id", {
        type: "manual",
        message: "You must select a Subject.",
      });
      return;
    }

    if (!selectedSemesterID) {
      setError("semester_id", {
        type: "manual",
        message: "You must select a semester.",
      });
      return;
    }

    if (!selectedInstructorID) {
      setError("employee_id", {
        type: "manual",
        message: "You must select an Instructor.",
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

      course_id: parseInt(selectedSubjectID),
      semester_id: parseInt(selectedSemesterID),
      employee_id: parseInt(selectedInstructorID),
    };

    setGeneralError("");
    try {
      const response = await toast.promise(
        axios.post("/class/add-class", transformedData),
        {
          loading: "Adding Class...",
          success: "Class Added successfully!",
          error: "Failed to add Class.",
        },
        {
          position: "bottom-right",
          duration: 5000,
        },
      );

      if (response.data) {
        setSuccess(true);
        fetchClass();
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

        setSelectedSubjectID("");
        setSelectedSubjectName("");
        setSelectedSemesterID("");
        setSelectedSemesterName("");
        setSelectedInstructorID("");
        setSelectedInstructorName("");
      }, 5000);
    } else if (error) {
      setTimeout(() => {
        setGeneralError("");
      }, 6000);
    }
  }, [success, error, reset]);

  const [confirmClose, setConfirmClose] = useState(false); // State for confirmation dialog

  const handleDialogClose = (isOpen) => {
    if (!isOpen) {
      setConfirmClose(true);
    } else {
      setOpen(true);
    }
  };

  // Confirm closing both dialogs
  const confirmDialogClose = () => {
    setConfirmClose(false);
    setOpen(false);

    reset();
    setSelectedSubjectID("");
    setSelectedSubjectName("");
    setSelectedSemesterID("");
    setSelectedSemesterName("");
    setSelectedInstructorID("");
    setSelectedInstructorName("");
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
            <span className="max-w-[8em]">Add Class </span>
          </DialogTrigger>
          <DialogContent className="max-w-[70em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Add new Class
              </DialogTitle>
              <DialogDescription className="sr-only">
                <span className="inline-block font-bold text-red-700">*</span>{" "}
                Click Add when you&apos;re done.
              </DialogDescription>
              <div className="!h-[20em] overflow-y-auto overscroll-none text-xl xl:!h-[27em]">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="p-6.5">
                    <div className="mb-4.5 w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="class_name"
                      >
                        Class Name
                      </label>

                      <input
                        id="class_name"
                        type="text"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        {...register("className", {
                          required: {
                            value: true,
                            message: "Class Name is required",
                          },
                          validate: {
                            notEmpty: (value) =>
                              value.trim() !== "" ||
                              "Class Name cannot be empty or just spaces",
                          },
                        })}
                        disabled={localLoading || success}
                      />

                      {errors.className && (
                        <ErrorMessage>*{errors.className.message}</ErrorMessage>
                      )}
                    </div>

                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full">
                        <span className="mb-2.5 block text-black dark:text-white">
                          Subject Code
                        </span>

                        <CustomSelector
                          title={"Subject"}
                          isDesktop={isDesktop}
                          open={openComboBox}
                          setOpen={setOpenComboBox}
                          selectedID={selectedSubjectID}
                          selectedName={selectedSubjectName}
                          data={courseActive}
                          forCourse={true}
                          setSelectedCourseCode={setSelectedCourseCode}
                          setSelectedID={setSelectedSubjectID}
                          setSelectedName={setSelectedSubjectName}
                          clearErrors={clearErrors}
                          loading={loading}
                          idKey="course_id"
                          nameKey="fullCourseName"
                          errorKey="course_id"
                        />

                        {errors.course_id && (
                          <ErrorMessage>
                            *{errors.course_id.message}
                          </ErrorMessage>
                        )}
                      </div>
                    </div>

                    <div className="mb-4.5 w-full">
                      <span className="mb-2.5 block text-black dark:text-white">
                        Subject Code
                      </span>

                      <CustomSelector
                        title={"Semester"}
                        isDesktop={isDesktop}
                        open={openComboBox2}
                        setOpen={setOpenComboBox2}
                        selectedID={selectedSemesterID}
                        selectedName={selectedSemesterName}
                        data={semesters}
                        forSemester={true}
                        setSelectedID={setSelectedSemesterID}
                        setSelectedName={setSelectedSemesterName}
                        clearErrors={clearErrors}
                        loading={loading}
                        idKey="semester_id"
                        nameKey="fullSemesterName"
                        errorKey="semester_id"
                      />

                      {errors.semester_id && (
                        <ErrorMessage>
                          *{errors.semester_id.message}
                        </ErrorMessage>
                      )}
                    </div>

                    <div className="mb-4.5 w-full">
                      <span className="mb-2.5 block text-black dark:text-white">
                        Instructor
                      </span>

                      <CustomSelector
                        title={"Instructor"}
                        isDesktop={isDesktop}
                        open={openComboBox3}
                        setOpen={setOpenComboBox3}
                        selectedID={selectedInstructorID}
                        selectedName={selectedInstructorName}
                        data={compareDataAndSetDisable(
                          employeesActive,
                          courseActive,
                          selectedCourseCode,
                        )}
                        forDisable={!selectedSubjectID}
                        forInstructor={true}
                        setSelectedID={setSelectedInstructorID}
                        setSelectedName={setSelectedInstructorName}
                        clearErrors={clearErrors}
                        loading={loading || employeeLoading}
                        idKey="employee_id"
                        nameKey="fullName"
                        errorKey="employee_id"
                      />

                      {errors.employee_id && (
                        <ErrorMessage>
                          *{errors.employee_id.message}
                        </ErrorMessage>
                      )}
                    </div>

                    <div className="mb-4.5 w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="schedule"
                      >
                        Schedule
                      </label>

                      <input
                        id="schedule"
                        type="text"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        {...register("schedule", {
                          required: {
                            value: true,
                            message: "Schedule is required",
                          },
                          validate: {
                            notEmpty: (value) =>
                              value.trim() !== "" ||
                              "Schedule cannot be empty or just spaces",
                          },
                        })}
                        disabled={localLoading || success}
                      />

                      {errors.schedule && (
                        <ErrorMessage>*{errors.schedule.message}</ErrorMessage>
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
                      {localLoading ? "Loading..." : "Add Class"}
                    </button>
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

export default AddClass;
