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

  console.log(prospectusSubjects);

  // Consolidate lecture and lab subjects per courseCode, yearLevel, and semesterName
  const consolidateSubjects = (subjects) => {
    const consolidated = {};

    subjects.forEach((subject) => {
      let baseCourseCode = subject.courseCode;
      let isLab = false;

      // Identify if the subject is lab based on courseCode or description
      if (subject.courseCode && subject.courseCode.endsWith("L")) {
        baseCourseCode = subject.courseCode.slice(0, -1);
        isLab = true;
      } else if (
        subject.courseDescription &&
        subject.courseDescription.toLowerCase().includes("lab")
      ) {
        baseCourseCode = subject.courseCode
          ? subject.courseCode.replace("L", "")
          : "N/A";
        isLab = true;
      }

      // Ensure unique consolidation per courseCode, yearLevel, and semesterName
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

  // Group subjects by year level and semester name within a program with dynamic ordering
  const groupSubjectsByYearAndSemester = (
    subjects,
    yearOrder,
    semesterOrder,
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

  // Extract departmentName and program description dynamically
  const getDepartmentAndProgram = (subjects) => {
    if (subjects.length === 0) return { departmentName: "", program: "" };

    const { departmentName, programDescription, programCode } = subjects[0];

    // Format the program as "programDescription (programCode)"
    const program = `${programDescription} (${programCode})`;

    return { departmentName, program };
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
        semesterOrder,
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

  // Debugging: Log the processed data
  useEffect(() => {
    if (isOpen) {
      console.log("Processed Data:", processedData);
      console.log("Year Order:", yearOrder);
      console.log("Semester Order:", semesterOrder);
    }
  }, [isOpen, processedData, yearOrder, semesterOrder]);

  return (
    <div>
      {/* Button to open Curriculum Tracker Dialog */}
      <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600">
            View Prospectus
          </button>
        </DialogTrigger>
        <DialogContent className="h-[40em] w-full max-w-[70em] overflow-y-auto bg-white p-4 !text-black dark:bg-boxdark dark:!text-white">
          <DialogTitle className="mb-4 text-center text-2xl sr-only font-semibold uppercase">
            {/* Display Department and Program */}
            {/* {prospectusSubjects.length > 0 ? (
              <>
                <span className="mb-2 block">
                  {prospectusSubjects[0].departmentName.toUpperCase()}
                </span>
                <span>
                  {prospectusSubjects[0].programDescription} (
                  {prospectusSubjects[0].programCode})
                </span>
              </>
            ) : (
              "Curriculum Tracker"
            )} */}
            Curriculum Tracker
          </DialogTitle>
          <DialogDescription className="sr-only">
            This is the curriculum tracker showing subjects taken and pending.
          </DialogDescription>
          <div>
            {loading ? (
              <div className="flex flex-col h-[37.5em] items-center justify-center">
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
                                                  (prereq) =>
                                                    prereq.courseCode.endsWith(
                                                      "L",
                                                    )
                                                      ? prereq.courseCode.slice(
                                                          0,
                                                          -1,
                                                        )
                                                      : prereq.courseCode,
                                                ),
                                              ),
                                            ).join(", ")
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
                                      {/* {subjects.reduce(
                                        (sum, subj) =>
                                          sum + (subj.lecUnits || 0),
                                        0,
                                      )} */}
                                    </td>
                                    <td className="border p-2 text-center font-bold">
                                      {/* Sum of Lab Units */}
                                      {/* {subjects.reduce(
                                        (sum, subj) =>
                                          sum + (subj.labUnits || 0),
                                        0,
                                      )} */}
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
                        },
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
  );
};

export default CurriculumTracker;
