/* eslint-disable react-hooks/exhaustive-deps */
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

import { HasRole } from "../reuseable/HasRole";

import { ErrorMessage } from "../reuseable/ErrorMessage";
import CustomPopover from "../reuseable/CustomPopover";
import SubjectList from "../reuseable/SubjectList";
import ConfirmCloseDialog from "../reuseable/ConfirmCloseDialog";
import { Input } from "../ui/input";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectValue,
} from "../ui/select";

const AddProspectusSubject = () => {
  const { user } = useContext(AuthContext);

  const {
    prospectusCampusId,
    prospectusCampusName,
    prospectusProgramCode,
    prospectus_id,
  } = useParams();

  const {
    prospectusSubjects,
    fetchProspectusSubjects,
    courseActive,
    fetchCourseActive,
    loadingProspectusSubjects,
  } = useSchool();

  const [open, setOpen] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);

  const [selectedCampus, setSelectedCampus] = useState("");

  const uniqueCourses = getUniqueCourseCodes(
    courseActive,
    "courseCode",
    prospectusSubjects,
  );

  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [preRequisites, setPreRequisites] = useState([]); // To store the pre-requisite data

  const [years, setYears] = useState([
    "First Year",
    "Second Year",
    "Third Year",
    "Fourth Year",
  ]);

  const {
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const [error, setGeneralError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSetCourses = (val, clearAll) => {
    if (clearAll) {
      setSelectedCourses([]);
    } else if (selectedCourses.includes(val)) {
      setSelectedCourses(selectedCourses.filter((item) => item !== val));
    } else {
      setSelectedCourses((prevValue) => [...prevValue, val]);
    }
  };

  const clearAllSelections = () => {
    setSelectedCourses([]);
  };

  // Mapping of ordinal words to numbers and vice versa
  const ordinals = [
    "First",
    "Second",
    "Third",
    "Fourth",
    "Fifth",
    "Sixth",
    "Seventh",
    "Eighth",
    "Ninth",
    "Tenth",
  ];

  const addNewYear = () => {
    // Get the last year in the array (e.g., "Fourth Year")
    const lastYear = years[years.length - 1];

    // Split the last year to extract the ordinal word (e.g., "Fourth")
    const [lastOrdinal] = lastYear.split(" ");

    // Find the index of the ordinal word in the ordinals array
    const lastYearIndex = ordinals.indexOf(lastOrdinal);

    if (lastYearIndex === -1) {
      console.error("Failed to extract the year number from:", lastYear);
      return; // Exit early if the ordinal is not found
    }

    // Increment the index to get the next year
    const newYearOrdinal = ordinals[lastYearIndex + 1];

    // If we reach beyond the available ordinals, log an error or handle accordingly
    if (!newYearOrdinal) {
      console.error("No more ordinals available.");
      return;
    }

    // Create the new year string (e.g., "Fifth Year")
    const newYear = `${newYearOrdinal} Year`;

    // Safely add the new year to the list
    setYears((prevYears) => [...prevYears, newYear]);
  };

  const handleAddPreRequisite = () => {
    // Add a new empty pre-requisite with subjectCode as an empty array
    setPreRequisites((prev) => [
      ...prev,
      { prospectus_subject_code: "", subjectCode: [] },
    ]);
  };

  const handlePreRequisiteChange = (index, field, value) => {
    setPreRequisites((prev) => {
      const newPreReqs = [...prev];

      if (field === "courseCode") {
        // Ensure that subjectCode is updated as an array
        if (!Array.isArray(newPreReqs[index].subjectCode)) {
          newPreReqs[index].subjectCode = []; // Initialize as array if not already
        }
        newPreReqs[index].subjectCode = [
          ...newPreReqs[index].subjectCode,
          value,
        ]; // Push the value into the array
      } else {
        newPreReqs[index][field] = value;
      }

      return newPreReqs;
    });
  };

  // State to store the previous values before the user tries to change them
  const [previousSemester, setPreviousSemester] = useState("");
  const [previousYear, setPreviousYear] = useState("");

  // State to control the confirmation dialog
  const [showClearPreReqDialog, setShowClearPreReqDialog] = useState(false);

  // Function to handle clearing the pre-requisites
  const clearPreRequisites = () => {
    setPreRequisites([]); // Clear pre-requisites
    setShowClearPreReqDialog(false); // Close the dialog
  };

  useEffect(() => {
    // Show confirmation dialog if there are existing pre-requisites and "First Year" and "1st Semester" are selected
    if (
      selectedYear === "First Year" &&
      selectedSemester === "1st Semester" &&
      preRequisites.length > 0
    ) {
      setShowClearPreReqDialog(true); // Show dialog if pre-requisites exist
    }
  }, [selectedYear, selectedSemester]);

  // Handle the change in semester and store the previous semester if it changes
  const handleSemesterChange = (newSemester) => {
    if (newSemester !== selectedSemester) {
      setPreviousSemester(selectedSemester); // Only store the previous semester if it's actually changing
    }
    setSelectedSemester(newSemester);
  };

  // Handle the change in year and store the previous year if it changes
  const handleYearChange = (newYear) => {
    if (newYear !== selectedYear) {
      setPreviousYear(selectedYear); // Only store the previous year if it's actually changing
    }
    if (newYear === "First Year" && selectedSemester === "1st Semester") {
      setShowClearPreReqDialog(true); // Trigger the dialog if First Year, 1st Semester is selected
    } else {
      setSelectedYear(newYear);
    }
  };

  // Handle the cancelation of the dialog (user doesn't want to clear pre-requisites)
  const handleCancelClearPreReq = () => {
    // Revert only the year or semester that changed, leave the other one unchanged
    if (previousYear) {
      setSelectedYear(previousYear); // Restore previous year
    }
    if (previousSemester) {
      setSelectedSemester(previousSemester); // Restore previous semester
    }
    setShowClearPreReqDialog(false); // Close the dialog
  };

  const isAddPreReqButtonDisabled = () => {
    // Disable the button if selectedYear is "First Year" or no courses are selected
    return (
      (selectedYear === "First Year" && selectedSemester === "1st Semester") ||
      selectedCourses.length === 0
    );
  };

  useEffect(() => {
    fetchCourseActive(null, prospectusProgramCode);

    if (user && HasRole(user.role, "SuperAdmin")) {
      setSelectedCampus(prospectusCampusId.toString());
    } else if (user && user.campus_id) {
      setSelectedCampus(user.campus_id.toString());
    }
  }, []);

  const onSubmit = async (data) => {
    if (!selectedYear) {
      setError("yearLevel", {
        type: "manual",
        message: "You must select a year.",
      });
      return;
    }

    if (!selectedSemester) {
      setError("semesterName", {
        type: "manual",
        message: "You must select a semester.",
      });
      return;
    }

    if (!selectedCourses.length) {
      setError("courseChoose", {
        type: "manual",
        message: "You must select a subject.",
      });
      return;
    }

    setLoading(true);
    const transformedData = {
      ...Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          typeof value === "string" && value.trim() === ""
            ? null
            : value.trim(),
        ]),
      ),
      campus_id: parseInt(selectedCampus),
      prospectus_id: prospectus_id,
      yearLevel: selectedYear,
      semesterName: selectedSemester,
      subjectCode: selectedCourses,
      preRequisite: preRequisites,
    };

    setGeneralError("");
    try {
      const response = await toast.promise(
        axios.post("/prospectus/assign-prospectus-subject", transformedData),
        {
          loading: "Assigning Subject...",
          success: "Assigned Subject successfully!",
          error: "Failed to Assign Subject.",
        },
        {
          position: "bottom-right",
        },
      );

      if (response.data) {
        setSuccess(true);
        fetchProspectusSubjects(
          prospectusCampusId,
          prospectusCampusName,
          prospectusProgramCode,
          prospectus_id,
        );
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
        setSelectedCourses([]);
        setSelectedYear("");
        setSelectedSemester("");
        setPreRequisites([]); // Clear pre-requisites
      }, 2000);
    } else if (error) {
      setTimeout(() => {
        setGeneralError("");
      }, 7000);
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

  const confirmDialogClose = () => {
    setConfirmClose(false);
    setOpen(false);

    reset();
    setSelectedCampus(user.campus_id ? user.campus_id.toString() : "");
    clearErrors("courseChoose");
    setSelectedCourses([]);
    setSelectedYear("");
    setSelectedSemester("");
    setPreRequisites([]); // Clear pre-requisites
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
            <span className="max-w-[8em]">Assign Prospect Subject </span>
          </DialogTrigger>
          <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white lg:max-w-[70em]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Assign new Subject
              </DialogTitle>
              <DialogDescription className="sr-only">
                <span className="inline-block font-bold text-red-700">*</span>{" "}
                Fill up, Click Add when you&apos;re done.
              </DialogDescription>
              <div className="overflow-y-auto overscroll-none text-xl md:!h-[28em]">
                <form onSubmit={handleSubmit(onSubmit)} className="h-full">
                  <div className="p-6.5">
                    <div className="mb-4.5 w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="program_code"
                      >
                        Program
                      </label>
                      <Input
                        id="program_code"
                        type="text"
                        value={
                          loadingProspectusSubjects
                            ? "Loading..."
                            : `${prospectusProgramCode} (${prospectusCampusName})`
                        }
                        disabled
                      />
                    </div>

                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      {/* Year Selection */}
                      <div className="mb-4.5 w-full">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Select Year
                        </label>
                        <Select
                          value={selectedYear}
                          //   onValueChange={(val) => handleYearChange(val)}
                          onValueChange={(val) => {
                            if (val === "add_year") {
                              addNewYear(); // Call addNewYear if Add Year is clicked
                            } else {
                              handleYearChange(val); // Set selected year
                            }
                            clearErrors("yearLevel");
                          }}
                        >
                          <SelectTrigger className="w-full py-7 pl-5 text-lg font-medium">
                            <SelectValue placeholder="Select Year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Years</SelectLabel>
                              {years.map((year) => (
                                <SelectItem key={year} value={year}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                            {/* Add Year trigger button */}
                            <button
                              className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer p-2"
                              onClick={addNewYear}
                            >
                              + Add Year
                            </button>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Semester Selection */}
                      <div className="mb-4.5 w-full">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Select Semester
                        </label>
                        <Select
                          value={selectedSemester}
                          onValueChange={(val) => {
                            handleSemesterChange(val);
                            clearErrors("semesterName");
                          }}
                        >
                          <SelectTrigger className="w-full py-7 pl-5 text-lg font-medium">
                            <SelectValue placeholder="Select Semester" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Semesters</SelectLabel>
                              <SelectItem value="1st Semester">
                                1st Semester
                              </SelectItem>
                              <SelectItem value="2nd Semester">
                                2nd Semester
                              </SelectItem>
                              <SelectItem value="Summer">Summer</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="mb-4.5 w-full">
                      <span className="mb-2.5 block text-black dark:text-white">
                        Select Subject
                      </span>

                      <CustomPopover
                        openPopover={openPopover}
                        setOpenPopover={setOpenPopover}
                        loading={
                          loading ||
                          loadingProspectusSubjects ||
                          success ||
                          !selectedYear ||
                          !selectedSemester
                        }
                        selectedItems={selectedCourses.map(
                          (val) =>
                            uniqueCourses.find((course) => course.value === val)
                              ?.value,
                        )}
                        itemName={`${!selectedYear || !selectedSemester ? "Subject (Select year and semester first)" : "Subject"}`}
                      >
                        <SubjectList
                          handleSelect={handleSetCourses}
                          value={selectedCourses}
                          data={uniqueCourses}
                          searchPlaceholder="Search Subject..."
                          clearErrors={clearErrors}
                          entity="courseChoose"
                          handleClearAll={clearAllSelections}
                          selectedItems={selectedCourses.map(
                            (val) =>
                              uniqueCourses.find(
                                (course) => course.value === val,
                              )?.value,
                          )}
                        />
                      </CustomPopover>

                      {errors.courseChoose && (
                        <ErrorMessage>
                          *{errors.courseChoose.message}
                        </ErrorMessage>
                      )}
                    </div>

                    {/* Pre-requisite Section */}
                    <div className="mb-4.5 w-full">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Pre-requisites
                      </label>
                      {preRequisites.map((preReq, index) => (
                        <div key={index} className="mb-4">
                          {/* Select for prospectus_subject_code */}
                          <Select
                            value={preReq.prospectus_subject_code}
                            onValueChange={(val) =>
                              handlePreRequisiteChange(
                                index,
                                "prospectus_subject_code",
                                val,
                              )
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select Subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Subjects</SelectLabel>
                                {selectedCourses.map((course) => (
                                  <SelectItem key={course} value={course}>
                                    {course}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>

                          {/* Select for courseCode (pre-requisite) */}
                          <Select
                            value={preReq.courseCode}
                            onValueChange={(val) =>
                              handlePreRequisiteChange(index, "courseCode", val)
                            }
                            disabled={!preReq.prospectus_subject_code}
                          >
                            <SelectTrigger
                              className={`w-[180px] ${
                                !preReq.prospectus_subject_code
                                  ? "cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <SelectValue placeholder="Select Pre-requisite" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Pre-requisites</SelectLabel>
                                {prospectusSubjects.map((subject) => (
                                  <SelectItem
                                    key={subject.courseCode}
                                    value={subject.courseCode}
                                  >
                                    {subject.courseCode}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={handleAddPreRequisite}
                        disabled={isAddPreReqButtonDisabled()}
                        className={`mt-2 inline-flex justify-center gap-2 rounded ${
                          isAddPreReqButtonDisabled()
                            ? "cursor-not-allowed bg-slate-400"
                            : "bg-green-500 hover:bg-green-600"
                        } p-2 text-white`}
                      >
                        + Add Pre-requisite
                      </button>
                      {!selectedYear || !selectedSemester ? (
                        <span className="ml-3 inline-block text-sm font-semibold text-red-600">
                          * You must select a year and semester in order to add
                          a pre-requisite
                        </span>
                      ) : selectedYear === "First Year" &&
                        selectedSemester === "1st Semester" ? (
                        <span className="ml-3 inline-block text-sm font-semibold text-red-600">
                          * First Years cannot have pre-requisites
                        </span>
                      ) : (
                        selectedYear &&
                        isAddPreReqButtonDisabled() && (
                          <span className="ml-3 inline-block text-sm font-semibold text-red-600">
                            * You must select at least 1 subject in order to add
                            a pre-requisite
                          </span>
                        )
                      )}

                      {/* Confirmation Dialog for Clearing Pre-requisites */}
                      {showClearPreReqDialog && (
                        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
                          <div className="rounded-md bg-white p-6 shadow-lg">
                            <h2 className="text-lg font-bold">
                              Clear Pre-requisites
                            </h2>
                            <p>
                              You&apos;re about to clear all pre-requisites
                              because you selected &quot;First Year&quot; and
                              &quot;1st Semester&quot;, which cannot have
                              pre-requisites. Do you want to proceed?
                            </p>
                            <div className="mt-4 flex justify-end">
                              <button
                                onClick={handleCancelClearPreReq}
                                className="bg-gray-200 hover:bg-gray-300 mr-2 rounded px-4 py-2"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={clearPreRequisites}
                                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                              >
                                Clear Pre-requisites
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {error && (
                      <div className="mb-5 mt-10 text-center font-bold text-red-600">
                        <p>Error: {error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      className={`mt-auto inline-flex w-full justify-center gap-2 rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 ${
                        loading || success
                          ? "bg-[#505456] hover:!bg-opacity-100"
                          : ""
                      }`}
                      disabled={
                        loading || loadingProspectusSubjects || success || error
                      }
                    >
                      {loading && (
                        <span className="block h-6 w-6 animate-spin rounded-full border-4 border-solid border-secondary border-t-transparent"></span>
                      )}
                      {loading
                        ? "Assigning Subject..."
                        : loadingProspectusSubjects
                          ? "Loading..."
                          : success
                            ? "Subject Assigned!"
                            : "Assign Subject"}
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

export default AddProspectusSubject;
