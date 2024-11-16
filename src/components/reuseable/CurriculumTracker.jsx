/* eslint-disable react/prop-types */
// src/components/CurriculumTracker.jsx

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { TableCell } from "../ui/table";
import axios from "axios";
import DotSpinner from "../styles/DotSpinner"; // Adjust the import based on your project structure

const CurriculumTracker = ({ prospectus_id, enrolledSubjects }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prospectusSubjects, setProspectusSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch prospectus subjects based on prospectus_id
  useEffect(() => {
    if (isOpen && prospectus_id) {
      setLoading(true);
      setError(null);
      axios
        .get("/prospectus/get-all-prospectus-subjects", {
          params: { prospectus_id },
        })
        .then((response) => {
          setProspectusSubjects(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching prospectus subjects:", err);
          setError("Failed to fetch prospectus subjects.");
          setLoading(false);
        });
    } else if (isOpen && !prospectus_id) {
      setError("Prospectus ID is missing.");
    }
  }, [isOpen, prospectus_id]);

  // Consolidate lecture and lab subjects per yearLevel and semesterName
  const consolidateSubjects = (subjects) => {
    const consolidated = {};

    subjects.forEach((subject) => {
      let baseCourseCode = subject.courseCode;
      let isLab = false;

      // Identify if the subject is lab based on courseCode or description
      if (subject.courseCode.endsWith("L")) {
        baseCourseCode = subject.courseCode.slice(0, -1);
        isLab = true;
      } else if (subject.courseDescription.includes("Lab")) {
        baseCourseCode = subject.courseCode.replace(" (Lab)", "");
        isLab = true;
      }

      // Ensure unique consolidation per courseCode, yearLevel, and semesterName
      const key = `${baseCourseCode}-${subject.yearLevel}-${subject.semesterName}`;

      if (!consolidated[key]) {
        consolidated[key] = {
          prospectus_subject_id: subject.prospectus_subject_id,
          courseCode: baseCourseCode,
          courseDescription: subject.courseDescription
            .replace(" (Lec)", "")
            .replace(" (Lab)", ""),
          lecUnits: 0,
          labUnits: 0,
          totalUnits: 0,
          prerequisites: subject.prerequisites,
          yearLevel: subject.yearLevel,
          semesterName: subject.semesterName,
        };
      }

      if (isLab) {
        consolidated[key].labUnits += subject.unit;
      } else {
        consolidated[key].lecUnits += subject.unit;
      }

      // Update totalUnits
      consolidated[key].totalUnits =
        consolidated[key].lecUnits + consolidated[key].labUnits;
    });

    return Object.values(consolidated);
  };

  // Determine if a prospectus subject has been taken
  const determineStatus = (subject) => {
    const courseCodeLower = subject.courseCode.toLowerCase();

    // Check if lecture and lab units exist
    const hasLecture = subject.lecUnits > 0;
    const hasLab = subject.labUnits > 0;

    // Check if lecture is taken
    const lectureTaken = enrolledSubjects.some(
      (enrolled) =>
        enrolled.classDetails?.subjectCode.toLowerCase() === courseCodeLower &&
        !enrolled.classDetails?.subjectDescription
          .toLowerCase()
          .includes("lab"),
    );

    // Check if lab is taken
    const labTaken = enrolledSubjects.some(
      (enrolled) =>
        enrolled.classDetails?.subjectCode.toLowerCase() ===
          `${courseCodeLower}l` ||
        enrolled.classDetails?.subjectDescription.toLowerCase().includes("lab"),
    );

    if (hasLecture && hasLab) {
      // Subject has both lecture and lab; both must be taken
      return lectureTaken && labTaken ? "Taken" : "Not Taken";
    } else if (hasLecture) {
      // Subject has only lecture
      return lectureTaken ? "Taken" : "Not Taken";
    } else if (hasLab) {
      // Subject has only lab
      return labTaken ? "Taken" : "Not Taken";
    } else {
      // Default case
      return "Not Taken";
    }
  };

  // Group subjects by year level and semester
  const groupSubjectsByYearAndSemester = (subjects) => {
    const grouped = subjects.reduce((acc, subject) => {
      const yearLevel = subject.yearLevel;
      const semesterName = subject.semesterName;
      const key = `${yearLevel} - ${semesterName}`;

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(subject);
      return acc;
    }, {});

    // Define the order for years and semesters
    const yearOrder = {
      "First Year": 1,
      "Second Year": 2,
      "Third Year": 3,
      "Fourth Year": 4,
    };

    const semesterOrder = {
      "1st Semester": 1,
      "2nd Semester": 2,
      Summer: 3,
    };

    // Sort the grouped keys
    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      const [yearA, semesterA] = a.split(" - ");
      const [yearB, semesterB] = b.split(" - ");

      const yearComparison =
        (yearOrder[yearA] || 99) - (yearOrder[yearB] || 99);
      if (yearComparison !== 0) return yearComparison;

      return (
        (semesterOrder[semesterA] || 99) - (semesterOrder[semesterB] || 99)
      );
    });

    // Create a sorted grouped object
    const sortedGrouped = sortedKeys.reduce((acc, key) => {
      acc[key] = grouped[key];
      return acc;
    }, {});

    return sortedGrouped;
  };

  // Calculate total units for a semester
  const calculateTotalUnits = (subjects) => {
    return subjects.reduce((total, subject) => total + subject.totalUnits, 0);
  };

  // Process the data
  const consolidatedSubjects = consolidateSubjects(prospectusSubjects);
  const groupedSubjects = groupSubjectsByYearAndSemester(consolidatedSubjects);

  // Debugging: Log the consolidated and grouped subjects
  useEffect(() => {
    if (isOpen) {
      console.log("Consolidated Subjects:", consolidatedSubjects);
      console.log("Grouped Subjects:", groupedSubjects);
    }
  }, [isOpen, consolidatedSubjects, groupedSubjects]);

  return (
    <div>
      {/* Button to open Curriculum Tracker Dialog */}
      <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600">
            View Curriculum Tracker
          </button>
        </DialogTrigger>
        <DialogContent className="h-[30em] w-full max-w-[60em] overflow-y-auto bg-white p-4 !text-black dark:bg-boxdark dark:!text-white">
          <DialogTitle className="mb-4 text-center text-2xl font-semibold">
            Curriculum Tracker
          </DialogTitle>
          <DialogDescription className="sr-only">
            This is the curriculum tracker showing subjects taken and pending.
          </DialogDescription>
          <div>
            {loading ? (
              <div className="flex flex-col items-center justify-center">
                <DotSpinner size="3.8rem" />
                <span className="mt-4 text-lg font-bold">
                  Loading Curriculum Tracker...
                </span>
              </div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : prospectusSubjects.length > 0 ? (
              // Iterate over the grouped subjects by year level and semester and render a table for each
              Object.keys(groupedSubjects).map((yearSemesterKey, index) => {
                const subjects = groupedSubjects[yearSemesterKey];
                const totalUnits = calculateTotalUnits(subjects);

                return (
                  <div
                    key={index}
                    className="mb-10 !text-black dark:!text-white lg:px-[2em]"
                  >
                    <div className="overflow-x-auto">
                      <table className="mb-4 min-w-full border-collapse border">
                        {/* Header for Year - Semester */}
                        <thead>
                          <tr>
                            <th
                              colSpan="7"
                              className="bg-gray-200 dark:bg-gray-700 border p-2 text-center text-lg font-bold"
                            >
                              {yearSemesterKey}
                            </th>
                          </tr>
                          <tr>
                            <th className="border p-2" rowSpan="2">
                              Subject Code
                            </th>
                            <th className="border p-2" rowSpan="2">
                              Description Title
                            </th>
                            <th className="border p-2" colSpan="3">
                              Units
                            </th>
                            <th className="border p-2" rowSpan="2">
                              Pre-requisites
                            </th>
                            <th className="border p-2" rowSpan="2">
                              Status
                            </th>
                          </tr>
                          <tr>
                            <th className="border p-2">Lec</th>
                            <th className="border p-2">Lab</th>
                            <th className="border p-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subjects.map((subject) => (
                            <tr key={subject.prospectus_subject_id}>
                              <TableCell className="border p-2">
                                {subject.courseCode}
                              </TableCell>
                              <TableCell className="border p-2">
                                {subject.courseDescription}
                              </TableCell>
                              <TableCell className="border p-2 text-center">
                                {subject.lecUnits}
                              </TableCell>
                              <TableCell className="border p-2 text-center">
                                {subject.labUnits}
                              </TableCell>
                              <TableCell className="border p-2 text-center">
                                {subject.totalUnits}
                              </TableCell>
                              <TableCell className="border p-2">
                                {subject.prerequisites.length > 0
                                  ? subject.prerequisites
                                      .map((prereq) => prereq.courseCode)
                                      .join(", ")
                                  : ""}
                              </TableCell>
                              <TableCell className="border p-2 text-center">
                                <span
                                  className={`rounded px-2 py-1 ${
                                    determineStatus(subject) === "Taken"
                                      ? "bg-green-500 text-white"
                                      : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                                  }`}
                                >
                                  {determineStatus(subject)}
                                </span>
                              </TableCell>
                            </tr>
                          ))}
                          {/* Add Total Units row */}
                          <tr>
                            <td className="border p-2"></td>
                            <td className="border p-2 text-center font-bold">
                              Total Units
                            </td>
                            <td className="border p-2 text-center font-bold">
                              {/* Sum of Lec Units */}
                              <span className="sr-only">
                                {subjects.reduce(
                                  (sum, subj) => sum + (subj.lecUnits || 0),
                                  0,
                                )}
                              </span>
                            </td>
                            <td className="border p-2 text-center font-bold">
                              {/* Sum of Lab Units */}
                              <span className="sr-only">
                                {subjects.reduce(
                                  (sum, subj) => sum + (subj.labUnits || 0),
                                  0,
                                )}
                              </span>
                            </td>
                            <td className="border p-2 text-center font-bold">
                              {totalUnits}
                            </td>
                            <td className="border p-2"></td>
                            <td className="border p-2"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-500 text-center">
                No prospectus subjects available.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CurriculumTracker;
