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

// Import CustomSelector and useMediaQuery
import CustomSelector from "../reuseable/CustomSelector";
import { useMediaQuery } from "../../hooks/use-media-query";
import { X } from "lucide-react";

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
  const [totalUnits, setTotalUnits] = useState(0); // New state to track total units

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
      {
        prospectus_subject_code: "",
        subjectCode: [],
        prospectus_subject_name: "",
        subjectName: "",
        subjectOpen: false,
        preReqOpen: false,
      },
    ]);
  };

  // Function to remove a pre-requisite
  const handleRemovePreRequisite = (index) => {
    setPreRequisites((prev) => {
      const newPreReqs = [...prev];
      newPreReqs.splice(index, 1);
      return newPreReqs;
    });
  };

  // Adjusted handlePreRequisiteChange function
  const handlePreRequisiteChange = (index, field, value) => {
    setPreRequisites((prev) => {
      const newPreReqs = [...prev];
      if (field === "courseCode") {
        newPreReqs[index]["subjectCode"] = [value]; // Store as array
      } else if (field === "subjectName") {
        newPreReqs[index]["subjectName"] = value;
      } else if (field === "prospectus_subject_code") {
        newPreReqs[index][field] = value;
        // Reset subjectCode and names when prospectus_subject_code changes
        newPreReqs[index]["subjectCode"] = [];
        newPreReqs[index]["subjectName"] = "";
        newPreReqs[index]["prospectus_subject_name"] = "";
      } else if (field === "prospectus_subject_name") {
        newPreReqs[index]["prospectus_subject_name"] = value;
      } else {
        newPreReqs[index][field] = value;
      }
      return newPreReqs;
    });
  };

  // State to store the pending changes when the dialog is triggered
  const [pendingYear, setPendingYear] = useState(null);
  const [pendingSemester, setPendingSemester] = useState(null);

  // State to control the confirmation dialog
  const [showClearPreReqDialog, setShowClearPreReqDialog] = useState(false);

  const clearPreRequisites = () => {
    setPreRequisites([]); // Clear pre-requisites
    if (pendingSemester) {
      setSelectedSemester(pendingSemester); // Apply the pending semester change
    }
    if (pendingYear) {
      setSelectedYear(pendingYear); // Apply the pending year change
    }
    setPendingSemester(null); // Clear the pending semester
    setPendingYear(null); // Clear the pending year
    setShowClearPreReqDialog(false); // Close the dialog
  };

  useEffect(() => {
    // Check if pre-requisites exist (and are non-empty) and the selected year is "First Year" and semester is "1st Semester"
    if (
      preRequisites.length > 0 &&
      preRequisites.some(
        (prereq) =>
          prereq.prospectus_subject_code !== "" ||
          prereq.subjectCode.length > 0,
      ) &&
      selectedYear === "First Year" &&
      selectedSemester === "1st Semester"
    ) {
      setShowClearPreReqDialog(true); // Show dialog if valid pre-requisites exist
    } else {
      setShowClearPreReqDialog(false); // Don't show dialog if no valid pre-requisites
    }
  }, [selectedYear, selectedSemester, preRequisites]);

  const handleYearChange = (newYear) => {
    if (
      newYear === "First Year" &&
      selectedSemester === "1st Semester" &&
      preRequisites.length > 0
    ) {
      setShowClearPreReqDialog(true); // Show dialog if pre-requisites exist
      setPendingYear(newYear); // Store the pending year change
    } else {
      setSelectedYear(newYear); // Update year
    }
  };

  const handleSemesterChange = (newSemester) => {
    // Check if the new semester is "1st Semester" and pre-requisites exist
    if (
      selectedYear === "First Year" &&
      newSemester === "1st Semester" &&
      preRequisites.length > 0
    ) {
      setShowClearPreReqDialog(true); // Show the dialog if pre-requisites exist
      setPendingSemester(newSemester); // Store the pending semester change
    } else {
      setSelectedSemester(newSemester); // If no dialog is needed, apply the change immediately
    }
  };

  const handleCancelClearPreReq = () => {
    // Discard the pending year and semester changes if the user cancels
    setPendingYear(null); // Discard the pending year change
    setPendingSemester(null); // Discard the pending semester change

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

  // Update total units whenever selectedCourses changes
  useEffect(() => {
    const total = selectedCourses.reduce((acc, courseCode) => {
      const course = uniqueCourses.find((c) => c.value === courseCode);
      return acc + (course ? parseFloat(course.unit) : 0);
    }, 0);
    setTotalUnits(total);
  }, [selectedCourses, uniqueCourses]);

  // New state variables for confirmation dialog
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmedData, setConfirmedData] = useState(null);

  const onSubmit = (data) => {
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

    setConfirmedData(transformedData);
    setConfirmationOpen(true);
  };

  const handleConfirmAdd = async () => {
    setLoading(true);
    setGeneralError("");

    try {
      const response = await axios.post(
        "/prospectus/assign-prospectus-subject",
        confirmedData,
      );

      toast.success("Assigned Subject successfully!", {
        position: "bottom-right",
      });

      if (response.data) {
        setSuccess(true);
        fetchProspectusSubjects(
          prospectusCampusId,
          prospectusCampusName,
          prospectusProgramCode,
          prospectus_id,
        );
        setOpen(false); // Close the dialog
        setConfirmationOpen(false); // Close the confirmation dialog
      }
    } catch (err) {
      toast.error("Failed to Assign Subject.", {
        position: "bottom-right",
      });
      if (err.response && err.response.data && err.response.data.message) {
        setGeneralError(err.response.data.message);
      } else {
        setGeneralError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false); // Ensure loading is false regardless of success or error
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
        setTotalUnits(0); // Reset total units
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
    setTotalUnits(0); // Reset total units
  };

  // Declare isDesktop for CustomSelector
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Extract selected prospectus_subject_codes from preRequisites
  const selectedPreReqSubjects = preRequisites
    .map((preReq) => preReq.prospectus_subject_code)
    .filter((code) => code !== "");

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
          <DialogContent className="max-w-[90%] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white md:max-w-[70em]">
            <DialogHeader>
              <DialogTitle className="text-xl font-medium text-black dark:text-white md:text-2xl">
                {confirmationOpen
                  ? "Confirm Assigning Subject"
                  : "Assign new Subject"}
              </DialogTitle>
              <DialogDescription className="sr-only">
                <span className="inline-block font-bold text-red-700">*</span>{" "}
                Fill up, Click Add when you&apos;re done.
              </DialogDescription>
              <div className="!h-[24em] overflow-y-auto overscroll-none text-base md:!h-[28em] md:text-xl">
                {!confirmationOpen ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="h-full">
                    <div className="p-4 md:p-6.5">
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

                      <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
                        {/* Year Selection */}
                        <div className="mb-4.5 w-full">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Select Year
                          </label>
                          <Select
                            value={selectedYear}
                            onValueChange={(val) => {
                              if (val === "add_year") {
                                addNewYear(); // Call addNewYear if Add Year is clicked
                              } else {
                                handleYearChange(val); // Set selected year
                              }
                              clearErrors("yearLevel");
                            }}
                          >
                            <SelectTrigger className="w-full py-4 pl-5 text-lg font-medium md:py-7">
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
                                type="button"
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
                            <SelectTrigger className="w-full py-4 pl-5 text-lg font-medium md:py-7">
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
                          Select Subject{" "}
                          {(!selectedYear || !selectedSemester) && (
                            <span className="inline-block text-start text-sm font-bold text-red-600">
                              *Select year and semester first
                            </span>
                          )}
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
                              uniqueCourses.find(
                                (course) => course.value === val,
                              )?.value,
                          )}
                          itemName="Subject"
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
                            showUnits={true} // New prop to indicate units should be displayed
                          />
                        </CustomPopover>

                        {errors.courseChoose && (
                          <ErrorMessage>
                            *{errors.courseChoose.message}
                          </ErrorMessage>
                        )}
                      </div>

                      {/* Display total units */}
                      <div className="mb-4.5 w-full">
                        <p className="text-lg font-medium text-black dark:text-white">
                          Total Units Selected: {totalUnits}
                        </p>
                      </div>

                      {/* Pre-requisite Section */}
                      <div className="mb-4.5 w-full">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Pre-requisites
                        </label>
                        {preRequisites.map((preReq, index) => {
                          // Get the current subject code
                          const currentSubjectCode =
                            preReq.prospectus_subject_code;

                          // Collect pre-requisites selected for the same subject code, excluding the current entry
                          const selectedPreRequisitesForSubject = preRequisites
                            .filter(
                              (pr, idx) =>
                                idx !== index &&
                                pr.prospectus_subject_code ===
                                  currentSubjectCode,
                            )
                            .map((pr) => pr.subjectCode[0])
                            .filter(
                              (code) => code !== undefined && code !== "",
                            );

                          return (
                            <div
                              key={index}
                              className="mb-4 flex flex-col md:flex-row md:items-center md:gap-4"
                            >
                              {/* CustomSelector for prospectus_subject_code */}
                              <CustomSelector
                                title={"Subject"}
                                isDesktop={isDesktop}
                                open={preReq.subjectOpen || false}
                                setOpen={(isOpen) => {
                                  setPreRequisites((prev) => {
                                    const newPreReqs = [...prev];
                                    newPreReqs[index].subjectOpen = isOpen;
                                    return newPreReqs;
                                  });
                                }}
                                selectedID={preReq.prospectus_subject_code}
                                // Display only subject code on button
                                selectedName={
                                  preReq.prospectus_subject_code ||
                                  "Select Subject"
                                }
                                data={selectedCourses.map((courseCode) => {
                                  const course = uniqueCourses.find(
                                    (c) => c.value === courseCode,
                                  );
                                  return {
                                    courseCode: course.value,
                                    courseDescription: course.label,
                                  };
                                })}
                                setSelectedID={(id) =>
                                  handlePreRequisiteChange(
                                    index,
                                    "prospectus_subject_code",
                                    id,
                                  )
                                }
                                setSelectedName={(name) =>
                                  handlePreRequisiteChange(
                                    index,
                                    "prospectus_subject_name",
                                    name,
                                  )
                                }
                                clearErrorsProp={clearErrors}
                                loading={false}
                                idKey="courseCode"
                                nameKey="courseDescription"
                                errorKey="prospectus_subject_code"
                                // Show both code and description during selection
                                displayItem={(item) =>
                                  `${item.courseDescription}`
                                }
                                // Disable already selected subjects globally
                                // disabledItems={selectedPreReqSubjects.filter(
                                //   (code, idx) => code !== "" && idx !== index, // Exclude the current index
                                // )}
                              />

                              {/* CustomSelector for courseCode (pre-requisite) */}
                              <CustomSelector
                                title={"Pre-requisite"}
                                isDesktop={isDesktop}
                                open={preReq.preReqOpen || false}
                                setOpen={(isOpen) => {
                                  setPreRequisites((prev) => {
                                    const newPreReqs = [...prev];
                                    newPreReqs[index].preReqOpen = isOpen;
                                    return newPreReqs;
                                  });
                                }}
                                selectedID={preReq.subjectCode[0] || ""}
                                // Display only subject code on button
                                selectedName={
                                  preReq.subjectCode[0] ||
                                  "Select Pre-requisite"
                                }
                                data={prospectusSubjects.map((subject) => ({
                                  courseCode: subject.courseCode,
                                  courseDescription: subject.courseDescription,
                                }))}
                                setSelectedID={(id) =>
                                  handlePreRequisiteChange(
                                    index,
                                    "courseCode",
                                    id,
                                  )
                                }
                                setSelectedName={(name) =>
                                  handlePreRequisiteChange(
                                    index,
                                    "subjectName",
                                    name,
                                  )
                                }
                                clearErrorsProp={clearErrors}
                                loading={false}
                                idKey="courseCode"
                                nameKey="courseDescription"
                                errorKey="courseCode"
                                forDisable={!preReq.prospectus_subject_code}
                                // Show both code and description during selection
                                displayItem={(item) => {
                                  // If courseDescription already includes courseCode, return courseDescription
                                  if (!item) {
                                    return `None.`;
                                  } else if (
                                    item.courseDescription.startsWith(
                                      item.courseCode,
                                    )
                                  ) {
                                    return item.courseDescription;
                                  } else {
                                    return `${item.courseCode} - ${item.courseDescription}`;
                                  }
                                }}
                                // Disable pre-requisites selected for the same subject code
                                disabledItems={selectedPreRequisitesForSubject}
                              />

                              {/* Remove Button */}
                              <button
                                type="button"
                                onClick={() => handleRemovePreRequisite(index)}
                                className="mt-2 inline-flex items-center gap-1 rounded-md bg-red-500 px-1 py-1 text-sm font-medium text-white hover:bg-red-600 md:mt-0"
                              >
                                <X className="h-5 w-5" />
                                <span className="sr-only">Remove</span>
                              </button>
                            </div>
                          );
                        })}

                        <button
                          type="button"
                          onClick={handleAddPreRequisite}
                          disabled={isAddPreReqButtonDisabled()}
                          className={`mt-2 inline-flex w-full justify-center gap-2 rounded md:w-auto ${
                            isAddPreReqButtonDisabled()
                              ? "cursor-not-allowed bg-slate-400"
                              : "bg-green-500 hover:bg-green-600"
                          } p-2 text-white`}
                        >
                          + Add Pre-requisite
                        </button>
                        {!selectedYear || !selectedSemester ? (
                          <span className="ml-3 mt-3 inline-block text-sm font-semibold text-red-600">
                            * You must select a year and semester in order to
                            add a pre-requisite
                          </span>
                        ) : selectedYear === "First Year" &&
                          selectedSemester === "1st Semester" ? (
                          <span className="ml-3 mt-3 inline-block text-sm font-semibold text-red-600">
                            * First Years cannot have pre-requisites
                          </span>
                        ) : (
                          selectedYear &&
                          isAddPreReqButtonDisabled() && (
                            <span className="ml-3 mt-3 inline-block text-sm font-semibold text-red-600">
                              * You must select at least 1 subject in order to
                              add a pre-requisite
                            </span>
                          )
                        )}

                        {/* Confirmation Dialog for Clearing Pre-requisites */}
                        {showClearPreReqDialog && (
                          <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="max-w-[35em] rounded-md bg-white p-6 shadow-lg">
                              <h2 className="text-lg font-bold">
                                Clear Pre-requisites
                              </h2>
                              <p>
                                You&apos;re about to clear all pre-requisites
                                because you selected &quot;First Year&quot; and
                                &quot;1st Semester&quot;, which cannot have
                                pre-requisites. <br />
                                <br /> Do you want to proceed?
                              </p>
                              <div className="mt-4 flex justify-end">
                                <button
                                  onClick={handleCancelClearPreReq}
                                  className="bg-gray-200 hover:bg-gray-300 mr-2 rounded px-4 py-2 hover:underline hover:underline-offset-4"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={clearPreRequisites}
                                  className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 hover:underline hover:underline-offset-4"
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
                          loading ||
                          loadingProspectusSubjects ||
                          success ||
                          error
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
                ) : (
                  // Confirmation Dialog Content
                  <div className="h-full p-4 md:p-6.5">
                    <p className="mb-4 text-base md:text-lg">
                      Please confirm the following details before proceeding:
                    </p>
                    {/* Display selected Year Level and Semester */}
                    <p className="mb-2 text-base md:text-lg">
                      <strong>Year Level:</strong>{" "}
                      {confirmedData?.yearLevel || "N/A"}
                    </p>
                    <p className="mb-4 text-base md:text-lg">
                      <strong>Semester:</strong>{" "}
                      {confirmedData?.semesterName || "N/A"}
                    </p>
                    {/* Responsive Table */}
                    <div className="overflow-x-auto">
                      <table className="mb-4 w-full table-auto border-collapse text-sm md:text-base">
                        <thead>
                          <tr>
                            <th className="border px-2 py-1">Subject Code</th>
                            <th className="border px-2 py-1">Subject Name</th>
                            <th className="border px-2 py-1">Units</th>
                            <th className="border px-2 py-1">Pre-requisites</th>
                          </tr>
                        </thead>
                        <tbody>
                          {confirmedData &&
                            confirmedData.subjectCode.map((subjectCode) => {
                              const subject = uniqueCourses.find(
                                (course) => course.value === subjectCode,
                              );
                              // Collect all pre-requisites for this subjectCode
                              const preReqs = confirmedData.preRequisite.filter(
                                (pr) =>
                                  pr.prospectus_subject_code === subjectCode,
                              );
                              // Collect all pre-requisite codes
                              const preReqCodesArray =
                                preReqs.length > 0
                                  ? preReqs.map((pr) => pr.subjectCode[0])
                                  : [];
                              // Display all pre-requisite codes individually
                              const displayPreReqCodes =
                                preReqCodesArray.join(", ");

                              return (
                                <tr key={subjectCode}>
                                  <td className="border px-2 py-1">
                                    {subjectCode}
                                  </td>
                                  <td className="border px-2 py-1">
                                    {subject
                                      ? subject.label.split(" - ")[1]
                                      : "N/A"}
                                  </td>
                                  <td className="border px-2 py-1">
                                    {subject ? subject.unit : "N/A"}
                                  </td>
                                  <td className="border px-2 py-1">
                                    {displayPreReqCodes}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                        {/* Display Total Units */}
                        <tfoot>
                          <tr>
                            <td
                              colSpan="2"
                              className="border px-2 py-1 font-bold"
                            >
                              Total Units
                            </td>
                            <td className="border px-2 py-1 font-bold">
                              {totalUnits}
                            </td>
                            <td className="border px-2 py-1"></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    <div className="mt-4 flex flex-col-reverse justify-end md:flex-row">
                      <button
                        onClick={() => setConfirmationOpen(false)}
                        className="bg-gray-200 hover:bg-gray-300 mt-2 rounded px-4 py-2 hover:underline hover:underline-offset-4 md:mr-2 md:mt-0"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmAdd}
                        className={`rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 hover:underline hover:underline-offset-4 ${
                          loading ? "cursor-not-allowed opacity-50" : ""
                        }`}
                        disabled={loading}
                      >
                        {loading ? "Assigning Subject..." : "Confirm"}
                      </button>
                    </div>
                    {error && (
                      <div className="mt-4 text-center font-bold text-red-600">
                        <p>Error: {error}</p>
                      </div>
                    )}
                  </div>
                )}
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
