/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { EditDepartmentIcon } from "../Icons"; // Use your appropriate icon
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

import { useSchool } from "../context/SchoolContext";
import { Switch } from "../ui/switch";
import { AuthContext } from "../context/AuthContext";
import { useMediaQuery } from "../../hooks/use-media-query";
import ConfirmCloseDialog from "../reuseable/ConfirmCloseDialog";
import CustomSelector from "../reuseable/CustomSelector";
import { compareDataAndSetDisable } from "../reuseable/GetUniqueValues";
import { ErrorMessage } from "../reuseable/ErrorMessage";

const EditClass = ({ classId }) => {
  const { user } = useContext(AuthContext);

  const {
    fetchClass,
    courseActive,
    semesters,
    employeesActive,
    employeeLoading,
    loading,
    roomsActive,
    loadingRoomsActive,
  } = useSchool();

  const [open, setOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const [selectedSubjectID, setSelectedSubjectID] = useState("");
  const [selectedSubjectName, setSelectedSubjectName] = useState("");

  const [selectedSemesterID, setSelectedSemesterID] = useState("");
  const [selectedSemesterName, setSelectedSemesterName] = useState("");

  const [selectedInstructorID, setSelectedInstructorID] = useState("");
  const [selectedInstructorName, setSelectedInstructorName] = useState("");

  const [selectedCourseCode, setSelectedCourseCode] = useState("");

  const [selectedRoomID, setSelectedRoomID] = useState("");
  const [selectedRoomName, setSelectedRoomName] = useState("");

  const [days, setDays] = useState([]);
  const daysOfWeek = [
    { name: "Monday", value: "Monday" },
    { name: "Tuesday", value: "Tuesday" },
    { name: "Wednesday", value: "Wednesday" },
    { name: "Thursday", value: "Thursday" },
    { name: "Friday", value: "Friday" },
    { name: "Saturday", value: "Saturday" },
    { name: "Sunday", value: "Sunday" },
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    clearErrors,
    setValue,
  } = useForm();

  const [error, setGeneralError] = useState("");
  const [success, setSuccess] = useState(false);

  const [confirmClose, setConfirmClose] = useState(false); // State for confirmation dialog

  const [openComboBox, setOpenComboBox] = useState(false);
  const [openComboBox2, setOpenComboBox2] = useState(false);
  const [openComboBox3, setOpenComboBox3] = useState(false);
  const [openComboBox4, setOpenComboBox4] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (classId && open) {
      // Fetch the class data when the modal is opened
      setLocalLoading(true);
      axios
        .get(`/class/${classId}`)
        .then((response) => {
          const cls = response.data;

          console.log(cls);

          // Pre-fill the form with class data
          setValue("className", cls.className);
          setSelectedSubjectID(cls.course_id.toString());
          setSelectedSubjectName(
            `${cls.subjectCode} - ${cls.subjectDescription}`,
          );
          setSelectedCourseCode(cls.subjectCode);
          setSelectedSemesterID(cls.semester_id.toString());
          setSelectedSemesterName(cls.semester.semesterName); // Updated field
          setSelectedInstructorID(cls.employee_id.toString());
          setSelectedInstructorName(cls.instructorFullNameWithDepartmentCode);
          setSelectedRoomID(cls.structure_id.toString());
          setSelectedRoomName(cls.fullStructureDetails); // Updated field

          setValue("timeStart", cls.timeStart.slice(0, 5)); // HH:MM
          setValue("timeEnd", cls.timeEnd.slice(0, 5)); // HH:MM

          setDays(cls.days || []);
          setIsActive(cls.isActive); // Set the initial status
          setLocalLoading(false);
        })
        .catch((err) => {
          setGeneralError(`Failed to fetch Class data: (${err})`);
          setLocalLoading(false);
        });
    }
  }, [classId, open, setValue]);

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

    if (!selectedRoomID) {
      setError("structure_id", {
        type: "manual",
        message: "You must select a Room.",
      });
      return;
    }

    if (days.length === 0) {
      setError("days", {
        type: "manual",
        message: "You must select at least one day.",
      });
      return;
    }

    setLocalLoading(true);

    const transformedData = {
      ...Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value === "" ? null : value,
        ]),
      ),
      isActive: isActive ? true : false, // Set isActive based on the switch value
      course_id: parseInt(selectedSubjectID),
      semester_id: parseInt(selectedSemesterID),
      employee_id: parseInt(selectedInstructorID),
      structure_id: parseInt(selectedRoomID),
      days: days, // Send days as an array
    };

    setGeneralError("");
    try {
      const response = await toast.promise(
        axios.put(`/class/${classId}`, transformedData),
        {
          loading: "Updating Class...",
          success: "Class updated successfully!",
          error: "Failed to update Class.",
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
        // Reset selected IDs and names
        setSelectedSubjectID("");
        setSelectedSubjectName("");
        setSelectedSemesterID("");
        setSelectedSemesterName("");
        setSelectedInstructorID("");
        setSelectedInstructorName("");
        setSelectedRoomID("");
        setSelectedRoomName("");
        setDays([]);
      }, 5000);
    } else if (error) {
      setTimeout(() => {
        setGeneralError("");
      }, 6000);
    }
  }, [success, error, reset]);

  // Confirm close dialog handling
  const handleDialogClose = (isOpen) => {
    if (!isOpen) {
      setConfirmClose(true);
    } else {
      setOpen(true);
    }
  };

  const confirmDialogClose = () => {
    setConfirmClose(false);
    setOpen(false);

    reset();
    // Reset selected IDs and names
    setSelectedSubjectID("");
    setSelectedSubjectName("");
    setSelectedSemesterID("");
    setSelectedSemesterName("");
    setSelectedInstructorID("");
    setSelectedInstructorName("");
    setSelectedRoomID("");
    setSelectedRoomName("");
    setDays([]);
  };

  const [isActive, setIsActive] = useState(true); // State for status switch

  return (
    <div className="flex items-center justify-end gap-2">
      <div>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            if (localLoading) {
              // Prevent the dialog from closing while loading
              setOpen(true);
            } else {
              handleDialogClose(isOpen);
            }
          }}
        >
          <DialogTrigger className="flex gap-1 rounded p-2 text-black hover:text-blue-700 dark:text-white dark:hover:text-blue-700">
            <EditDepartmentIcon forActions={"Edit Class"} />
          </DialogTrigger>

          <DialogContent className="max-w-[70em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Edit Class
              </DialogTitle>
              <DialogDescription className="sr-only">
                <span className="inline-block font-bold text-red-700">*</span>{" "}
                Click Update when you&apos;re done.
              </DialogDescription>
              <div className="!h-[20em] overflow-y-auto overscroll-none text-xl xl:!h-[27em]">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="p-6.5">
                    {/* Status Switch */}
                    <div className="mb-5 w-full xl:w-[12em]">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="class_active"
                      >
                        Status{" "}
                        <span className="inline-block font-bold text-red-700">
                          *
                        </span>
                      </label>
                      <Switch
                        id="class_active"
                        checked={isActive}
                        onCheckedChange={setIsActive} // Update the status when the switch is toggled
                        disabled={success || localLoading}
                      />
                    </div>

                    {/* Class Name */}
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

                    {/* Subject Code */}
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
                          setSelectedCourseCode={setSelectedCourseCode}
                          setSelectedID={setSelectedSubjectID}
                          setSelectedName={setSelectedSubjectName}
                          clearErrorsProp={clearErrors}
                          loading={loading || success}
                          idKey="course_id"
                          nameKey="fullCourseName" // Ensure this matches your data
                          errorKey="course_id"
                          forCourse={true}
                          setSelectedInstructorID={setSelectedInstructorID}
                          setSelectedInstructorName={setSelectedInstructorName}
                        />

                        {errors.course_id && (
                          <ErrorMessage>
                            *{errors.course_id.message}
                          </ErrorMessage>
                        )}
                      </div>
                    </div>

                    {/* Semester */}
                    <div className="mb-4.5 w-full">
                      <span className="mb-2.5 block text-black dark:text-white">
                        Semester
                      </span>

                      <CustomSelector
                        title={"Semester"}
                        isDesktop={isDesktop}
                        open={openComboBox2}
                        setOpen={setOpenComboBox2}
                        selectedID={selectedSemesterID}
                        selectedName={selectedSemesterName}
                        data={semesters}
                        setSelectedID={setSelectedSemesterID}
                        setSelectedName={setSelectedSemesterName}
                        clearErrorsProp={clearErrors}
                        loading={loading || success}
                        idKey="semester_id"
                        nameKey="semesterName" // Updated to use semesterName
                        errorKey="semester_id"
                        forSemester={true}
                      />

                      {errors.semester_id && (
                        <ErrorMessage>
                          *{errors.semester_id.message}
                        </ErrorMessage>
                      )}
                    </div>

                    {/* Instructor */}
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
                        clearErrorsProp={clearErrors}
                        loading={loading || employeeLoading || success}
                        idKey="employee_id"
                        nameKey="fullNameWithDepartmentCode"
                        errorKey="employee_id"
                      />

                      {errors.employee_id && (
                        <ErrorMessage>
                          *{errors.employee_id.message}
                        </ErrorMessage>
                      )}
                    </div>

                    {/* Room Selection */}
                    <div className="mb-4.5 w-full">
                      <span className="mb-2.5 block text-black dark:text-white">
                        Room
                      </span>

                      <CustomSelector
                        title={"Room"}
                        isDesktop={isDesktop}
                        open={openComboBox4}
                        setOpen={setOpenComboBox4}
                        selectedID={selectedRoomID}
                        selectedName={selectedRoomName}
                        data={roomsActive}
                        setSelectedID={setSelectedRoomID}
                        setSelectedName={setSelectedRoomName}
                        clearErrorsProp={clearErrors}
                        loading={loading || loadingRoomsActive || success}
                        idKey="structure_id"
                        nameKey="fullStructureDetails"
                        errorKey="structure_id"
                      />

                      {errors.structure_id && (
                        <ErrorMessage>
                          *{errors.structure_id.message}
                        </ErrorMessage>
                      )}
                    </div>

                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      {/* Time Start */}
                      <div className="mb-4.5 w-full">
                        <label
                          className="mb-2.5 block text-black dark:text-white"
                          htmlFor="timeStart"
                        >
                          Time Start
                        </label>
                        <input
                          id="timeStart"
                          type="time"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          {...register("timeStart", {
                            required: {
                              value: true,
                              message: "Time Start is required",
                            },
                          })}
                          disabled={localLoading || success}
                        />
                        {errors.timeStart && (
                          <ErrorMessage>
                            *{errors.timeStart.message}
                          </ErrorMessage>
                        )}
                      </div>
                      {/* Time End */}
                      <div className="mb-4.5 w-full">
                        <label
                          className="mb-2.5 block text-black dark:text-white"
                          htmlFor="timeEnd"
                        >
                          Time End
                        </label>
                        <input
                          id="timeEnd"
                          type="time"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          {...register("timeEnd", {
                            required: {
                              value: true,
                              message: "Time End is required",
                            },
                          })}
                          disabled={localLoading || success}
                        />
                        {errors.timeEnd && (
                          <ErrorMessage>*{errors.timeEnd.message}</ErrorMessage>
                        )}
                      </div>
                    </div>

                    {/* Days */}
                    <div className="mb-4.5 w-full">
                      <span className="mb-2.5 block text-black dark:text-white">
                        Days
                      </span>

                      <div className="flex flex-wrap gap-3">
                        {daysOfWeek.map((day) => (
                          <label key={day.value} className="flex items-center">
                            <input
                              type="checkbox"
                              value={day.value}
                              checked={days.includes(day.value)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setDays([...days, day.value]);
                                } else {
                                  setDays(days.filter((d) => d !== day.value));
                                }
                              }}
                              disabled={localLoading || success}
                              className="mr-2"
                            />
                            {day.name}
                          </label>
                        ))}
                      </div>

                      {errors.days && (
                        <ErrorMessage>*{errors.days.message}</ErrorMessage>
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
                      {localLoading ? "Updating Class..." : "Update Class"}
                    </button>
                  </div>
                </form>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <ConfirmCloseDialog
          isOpen={confirmClose}
          onConfirmClose={confirmDialogClose}
          onCancel={() => setConfirmClose(false)}
        />
      </div>
    </div>
  );
};

export default EditClass;
