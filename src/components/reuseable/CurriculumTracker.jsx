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

// Import Tooltip components from shadCN
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

// Import icons from react-icons
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";

const CurriculumTracker = ({ prospectus_id, enrolledSubjects }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prospectusSubjects, setProspectusSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to convert ordinal words to numbers
  const parseOrdinalWord = (word) => {
    const ordinalMap = {
      First: 1,
      Second: 2,
      Third: 3,
      Fourth: 4,
      Fifth: 5,
      Sixth: 6,
      Seventh: 7,
      Eighth: 8,
      Ninth: 9,
      Tenth: 10,
    };
    return ordinalMap[word] || 99; // Default to 99 if not found
  };

  // Helper function to convert semester names to numbers
  const parseSemester = (semester) => {
    const semesterMap = {
      "1st Semester": 1,
      "2nd Semester": 2,
      Summer: 3,
      // Add more semesters if needed
    };
    return semesterMap[semester] || 99; // Default to 99 if not found
  };

  // Function to extract unique year levels and semesters
  const extractOrdering = (subjects) => {
    const uniqueYears = [
      ...new Set(subjects.map((subject) => subject.yearLevel)),
    ];
    const uniqueSemesters = [
      ...new Set(subjects.map((subject) => subject.semesterName)),
    ];

    // Sort year levels based on ordinal words
    uniqueYears.sort((a, b) => {
      const wordA = a.split(" ")[0]; // e.g., "First" from "First Year"
      const wordB = b.split(" ")[0];
      return parseOrdinalWord(wordA) - parseOrdinalWord(wordB);
    });

    // Sort semesters based on predefined semester order
    uniqueSemesters.sort((a, b) => parseSemester(a) - parseSemester(b));

    // Create ordering maps
    const yearOrder = {};
    uniqueYears.forEach((year, index) => {
      yearOrder[year] = index + 1;
    });

    const semesterOrder = {};
    uniqueSemesters.forEach((semester, index) => {
      semesterOrder[semester] = index + 1;
    });

    return { yearOrder, semesterOrder };
  };

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

  // Consolidate subjects with careful handling of courseCode
  const consolidateSubjects = (subjects) => {
    const courseCodeSet = new Set(
      subjects.map((subject) => subject.courseCode)
    );

    const consolidated = {};

    subjects.forEach((subject) => {
      let baseCourseCode = subject.courseCode;
      let isLab = false;

      // Identify if the subject is lab based on courseCode and existing course codes
      if (subject.courseCode && subject.courseCode.endsWith("L")) {
        const potentialBaseCode = subject.courseCode.slice(0, -1);
        if (courseCodeSet.has(potentialBaseCode)) {
          baseCourseCode = potentialBaseCode;
          isLab = true;
        } else {
          baseCourseCode = subject.courseCode;
        }
      } else {
        baseCourseCode = subject.courseCode;
      }

      // Ensure unique consolidation per baseCourseCode, yearLevel, and semesterName
      const key = `${baseCourseCode}-${subject.yearLevel}-${subject.semesterName}`;

      if (!consolidated[key]) {
        consolidated[key] = {
          prospectus_subject_id: subject.prospectus_subject_id,
          courseCode: baseCourseCode,
          courseDescription: subject.courseDescription
            ? subject.courseDescription
                .replace(" (Lec)", "")
                .replace(" (Lab)", "")
            : "N/A",
          lecUnits: 0,
          labUnits: 0,
          totalUnits: 0,
          prerequisites: subject.prerequisites,
          yearLevel: subject.yearLevel,
          semesterName: subject.semesterName,
          departmentName: subject.departmentName || "N/A",
          programDescription: subject.programDescription || "N/A",
          programCode: subject.programCode || "N/A",
        };
      }

      // Determine if the subject is lab or lecture
      if (
        isLab ||
        (subject.courseDescription &&
          subject.courseDescription.includes(" (Lab)"))
      ) {
        consolidated[key].labUnits += subject.unit || 0;
      } else {
        consolidated[key].lecUnits += subject.unit || 0;
      }

      // Update totalUnits
      consolidated[key].totalUnits =
        consolidated[key].lecUnits + consolidated[key].labUnits;
    });

    return Object.values(consolidated);
  };

  // Group subjects by department and program
  const groupSubjectsByDepartmentAndProgram = (subjects) => {
    const grouped = {};

    subjects.forEach((subject) => {
      const dept = subject.departmentName.toUpperCase() || "N/A";
      const program =
        `${subject.programDescription} (${subject.programCode})` || "N/A";

      if (!grouped[dept]) {
        grouped[dept] = {};
      }

      if (!grouped[dept][program]) {
        grouped[dept][program] = [];
      }

      grouped[dept][program].push(subject);
    });

    return grouped;
  };

  // Prepare enrolled subject codes set
  const enrolledSubjectCodes = new Set(
    enrolledSubjects.map((enrolled) =>
      enrolled.classDetails?.subjectCode.toLowerCase()
    )
  );

  // Determine the detailed status of a subject
  const determineStatus = (subject) => {
    const baseCourseCodeLower = subject.courseCode.toLowerCase();

    // Check if the subject has lecture and/or lab units
    const hasLecture = subject.lecUnits > 0;
    const hasLab = subject.labUnits > 0;

    let lectureTaken = false;
    let labTaken = false;

    // If lecture units exist, check if lecture component is taken
    if (hasLecture) {
      lectureTaken = enrolledSubjectCodes.has(baseCourseCodeLower);
    } else {
      lectureTaken = true; // If no lecture units, consider lecture as taken
    }

    // If lab units exist, check if lab component is taken
    if (hasLab) {
      labTaken =
        enrolledSubjectCodes.has(`${baseCourseCodeLower}l`) ||
        enrolledSubjectCodes.has(`${baseCourseCodeLower} l`);
    } else {
      labTaken = true; // If no lab units, consider lab as taken
    }

    // Determine status based on both lecture and lab components
    if (hasLecture && hasLab) {
      if (lectureTaken && labTaken) {
        return "Taken";
      } else if (lectureTaken && !labTaken) {
        return "Only Lecture";
      } else if (!lectureTaken && labTaken) {
        return "Only Laboratory";
      } else {
        return "Not Taken";
      }
    } else if (hasLecture) {
      return lectureTaken ? "Taken" : "Not Taken";
    } else if (hasLab) {
      return labTaken ? "Taken" : "Not Taken";
    } else {
      return "N/A";
    }
  };

  // Group subjects by year level and semester name within a program with dynamic ordering
  const groupSubjectsByYearAndSemester = (
    subjects,
    yearOrder,
    semesterOrder
  ) => {
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

    // Sort the grouped keys based on dynamic year and semester order
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

  // Calculate total lec units for a semester
  const calculateTotalLecUnits = (subjects) => {
    return subjects.reduce((total, subject) => total + subject.lecUnits, 0);
  };

  // Calculate total lab units for a semester
  const calculateTotalLabUnits = (subjects) => {
    return subjects.reduce((total, subject) => total + subject.labUnits, 0);
  };

  // Consolidate and group the subjects
  const consolidatedSubjects = consolidateSubjects(prospectusSubjects);
  const groupedByDeptAndProgram =
    groupSubjectsByDepartmentAndProgram(consolidatedSubjects);

  // Extract ordering maps
  const { yearOrder, semesterOrder } = extractOrdering(consolidatedSubjects);

  // Process the data: group subjects by department and program, then by year and semester
  const processedData = Object.keys(groupedByDeptAndProgram).map((dept) => {
    const programs = groupedByDeptAndProgram[dept];
    const programData = Object.keys(programs).map((program) => {
      const subjects = programs[program];
      const groupedSubjects = groupSubjectsByYearAndSemester(
        subjects,
        yearOrder,
        semesterOrder
      );
      return {
        program,
        groupedSubjects,
      };
    });
    return {
      department: dept,
      programs: programData,
    };
  });

  return (
    <TooltipProvider>
      <div>
        {/* Button to open Curriculum Tracker Dialog */}
        <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600">
              View Prospectus
            </button>
          </DialogTrigger>
          <DialogContent className="h-[40em] w-full max-w-[70em] overflow-y-auto bg-white p-4 !text-black dark:bg-boxdark dark:!text-white">
            <DialogTitle className="sr-only mb-4 text-center text-2xl font-semibold uppercase">
              Curriculum Tracker
            </DialogTitle>
            <DialogDescription className="sr-only">
              This is the curriculum tracker showing subjects taken and pending.
            </DialogDescription>
            <div>
              {loading ? (
                <div className="flex h-[37.5em] flex-col items-center justify-center">
                  <DotSpinner size="3.8rem" />
                  <span className="mt-4 text-lg font-bold">
                    Loading Prospectus...
                  </span>
                </div>
              ) : error ? (
                <div className="text-center text-red-500">{error}</div>
              ) : prospectusSubjects.length > 0 ? (
                // Iterate over the departments
                processedData.map((deptData, deptIndex) => (
                  <div key={deptIndex} className="mb-10 lg:px-[2em]">
                    {/* Department Name */}
                    <h2 className="mb-2 text-center text-2xl font-bold uppercase">
                      {deptData.department}
                    </h2>

                    {/* Iterate over the programs within the department */}
                    {deptData.programs.map((programData, programIndex) => (
                      <div key={programIndex} className="mb-8">
                        {/* Program Description and Code */}
                        <h3 className="mb-4 text-center text-xl font-semibold uppercase">
                          {programData.program}
                        </h3>

                        {/* Iterate over the grouped subjects by year and semester */}
                        {Object.keys(programData.groupedSubjects).map(
                          (yearSemesterKey, yearSemIndex) => {
                            const subjects =
                              programData.groupedSubjects[yearSemesterKey];
                            const totalUnits = calculateTotalUnits(subjects);
                            const totalLecUnits =
                              calculateTotalLecUnits(subjects);
                            const totalLabUnits =
                              calculateTotalLabUnits(subjects);

                            return (
                              <div
                                key={yearSemIndex}
                                className="mb-10 overflow-x-auto"
                              >
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
                                            ? Array.from(
                                                new Set(
                                                  subject.prerequisites.map(
                                                    (prereq) => prereq.courseCode
                                                  )
                                                )
                                              ).join(", ")
                                            : ""}
                                        </TableCell>
                                        <TableCell className="border p-2 text-center">
                                          {/* Determine the status and display corresponding badge with tooltip */}
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <span className="cursor-pointer">
                                                {(() => {
                                                  const status = determineStatus(subject);
                                                  switch (status) {
                                                    case "Taken":
                                                      return (
                                                        <span className={`flex items-center justify-center rounded px-2 py-1 bg-green-500 text-white`}>
                                                          <FaCheckCircle className="mr-1" />
                                                          {status}
                                                        </span>
                                                      );
                                                    case "Only Lecture":
                                                      return (
                                                        <span className={`flex items-center justify-center rounded px-2 py-1 bg-yellow-500 text-white`}>
                                                          <FaExclamationTriangle className="mr-1" />
                                                          {status}
                                                        </span>
                                                      );
                                                    case "Only Laboratory":
                                                      return (
                                                        <span className={`flex items-center justify-center rounded px-2 py-1 bg-yellow-500 text-white`}>
                                                          <FaInfoCircle className="mr-1" />
                                                          {status}
                                                        </span>
                                                      );
                                                    case "Not Taken":
                                                      return (
                                                        <span className={`flex items-center justify-center rounded px-2 py-1 bg-red-500 text-white`}>
                                                          <FaTimesCircle className="mr-1" />
                                                          {status}
                                                        </span>
                                                      );
                                                    default:
                                                      return (
                                                        <span className={`flex items-center justify-center rounded px-2 py-1 bg-gray-400 text-white`}>
                                                          <FaInfoCircle className="mr-1" />
                                                          {status}
                                                        </span>
                                                      );
                                                  }
                                                })()}
                                              </span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              {(() => {
                                                const status = determineStatus(subject);
                                                switch (status) {
                                                  case "Taken":
                                                    return "You have completed both Lecture and Laboratory components.";
                                                  case "Only Lecture":
                                                    return "You have only completed the Lecture component. Laboratory is pending.";
                                                  case "Only Laboratory":
                                                    return "You have only completed the Laboratory component. Lecture is pending.";
                                                  case "Not Taken":
                                                    return "You have not completed this subject.";
                                                  default:
                                                    return "Status unavailable.";
                                                }
                                              })()}
                                            </TooltipContent>
                                          </Tooltip>
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
                                        {totalLecUnits}
                                      </td>
                                      <td className="border p-2 text-center font-bold">
                                        {totalLabUnits}
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
                            );
                          }
                        )}
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center">
                  No prospectus subjects available.
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default CurriculumTracker;
