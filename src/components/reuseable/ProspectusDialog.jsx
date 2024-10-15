/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { useSchool } from "../context/SchoolContext"; // Assuming SchoolContext is correctly set up
import { useParams } from "react-router-dom";
import DotSpinner from "../styles/DotSpinner";

/**
 * A reusable dialog component to display the prospectus for a given program.
 * The dialog will fetch the prospectus data when opened and render it in a tabular format.
 * The data is grouped by year level and semester.
 * The component also calculates the total units for each semester.
 * The total units are displayed as a separate row at the bottom of the table.
 * If there are no subjects available for the prospectus, the dialog will display a message.
 * @param {number} prospectusCampusId - The campus ID for the prospectus
 * @param {string} prospectusCampusName - The campus name for the prospectus
 * @param {string} prospectusProgramCode - The program code for the prospectus
 * @param {number} prospectus_id - The prospectus ID
 * @returns {JSX.Element} The ProspectusDialog component
 */
const ProspectusDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    prospectusSubjects,
    fetchProspectusSubjects,
    loadingProspectusSubjects,
  } = useSchool();
  const {
    prospectusCampusId,
    prospectusCampusName,
    prospectusProgramCode,
    prospectus_id,
  } = useParams();

  // Extract departmentName and program description dynamically
  const getDepartmentAndProgram = (subjects) => {
    if (subjects.length === 0) return { departmentName: "", program: "" };

    const { departmentName, programDescription, programCode } = subjects[0];

    // Format the program as "programDescription programCode"
    const program = `${programDescription} (${programCode})`;

    return { departmentName, program };
  };

  // Group subjects by year level and then by semester, and sort by courseCode and course_department_id
  const groupSubjectsByYearAndSemester = (subjects) => {
    // Define the sorting order for semesters
    const semesterOrder = {
      "1st Semester": 1,
      "2nd Semester": 2,
      Summer: 3,
    };

    // Group subjects by year level and semester
    const grouped = subjects.reduce((acc, subject) => {
      const yearLevel = subject.yearLevel;
      const semesterName = subject.semesterName;
      const yearSemesterKey = `${yearLevel} - ${semesterName}`; // Combine year level and semester

      if (!acc[yearSemesterKey]) {
        acc[yearSemesterKey] = [];
      }

      acc[yearSemesterKey].push(subject);

      // Sort subjects within each semester by course_department_id (non-null first) and then by courseCode (A to Z)
      acc[yearSemesterKey].sort((a, b) => {
        if (a.course_department_id && !b.course_department_id) return -1;
        if (!a.course_department_id && b.course_department_id) return 1;
        return a.courseCode.localeCompare(b.courseCode);
      });

      return acc;
    }, {});

    // Sort the grouped keys by year and then by the predefined semester order
    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      const [yearA, semesterA] = a.split(" - ");
      const [yearB, semesterB] = b.split(" - ");

      // Compare year levels numerically
      if (yearA !== yearB) {
        return yearA.localeCompare(yearB);
      }

      // Compare semester order
      return semesterOrder[semesterA] - semesterOrder[semesterB];
    });

    // Return a sorted object based on the sorted keys
    const sortedGrouped = sortedKeys.reduce((acc, key) => {
      acc[key] = grouped[key];
      return acc;
    }, {});

    return sortedGrouped;
  };

  // Consolidate lecture and lab into one row by removing redundancy
  const consolidateSubjects = (subjects, yearSemesterKey) => {
    const consolidated = {};

    subjects.forEach((subject) => {
      const baseCourseCode = subject.courseCode.endsWith("L")
        ? subject.courseCode.slice(0, -1)
        : subject.courseCode;

      if (!consolidated[baseCourseCode]) {
        consolidated[baseCourseCode] = {
          ...subject,
          lecUnits: 0,
          labUnits: 0,
          totalUnits: 0,
        };
      }

      // Check if we are in "Fourth Year - 2nd Semester" and the course has "(Lab)" in its description
      if (
        yearSemesterKey === "Fourth Year - 2nd Semester" &&
        subject.courseDescription.includes("(Lab)")
      ) {
        // Remove "(Lab)" from the description and move the units to lab
        consolidated[baseCourseCode].labUnits = subject.unit;
        consolidated[baseCourseCode].lecUnits = 0;
        consolidated[baseCourseCode].courseDescription =
          subject.courseDescription.replace(" (Lab)", ""); // Remove "(Lab)"
      } else if (subject.courseCode.endsWith("L")) {
        consolidated[baseCourseCode].labUnits = subject.unit;
      } else {
        consolidated[baseCourseCode].lecUnits = subject.unit;
      }

      // Calculate total units
      consolidated[baseCourseCode].totalUnits =
        consolidated[baseCourseCode].lecUnits +
        consolidated[baseCourseCode].labUnits;

      // Remove "(Lec)" from description if it exists
      consolidated[baseCourseCode].courseDescription = consolidated[
        baseCourseCode
      ].courseDescription.replace(" (Lec)", "");
    });

    return Object.values(consolidated);
  };

  // Calculate total units for a semester
  const calculateTotalUnits = (consolidatedSubjects) => {
    return consolidatedSubjects.reduce(
      (totals, subject) => {
        totals.totalUnits += subject.totalUnits;
        return totals;
      },
      { totalUnits: 0 },
    );
  };

  // Fetch the prospectus data when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchProspectusSubjects(
        prospectusCampusId,
        prospectusCampusName,
        prospectusProgramCode,
        prospectus_id,
      );
    }
  }, [isOpen]);

  const groupedSubjects = groupSubjectsByYearAndSemester(prospectusSubjects);
  const { departmentName, program } =
    getDepartmentAndProgram(prospectusSubjects);

  return (
    <div>
      {/* Button to open dialog */}
      <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="rounded bg-blue-500 px-4 py-2 text-white">
            Generate Prospectus
          </button>
        </DialogTrigger>
        <DialogContent className="h-[40em] w-full max-w-[70em] overflow-y-auto bg-white p-4 !text-black dark:bg-boxdark dark:!text-white max-xl:max-h-screen">
          <DialogTitle className="mt-10 text-center uppercase !text-black dark:!text-white">
            {loadingProspectusSubjects ? "" : departmentName && departmentName}
            <br /> <br />
            {loadingProspectusSubjects ? "" : program}
          </DialogTitle>
          <DialogDescription className="sr-only">
            This is the prospectus for{" "}
            {loadingProspectusSubjects ? "" : departmentName}
          </DialogDescription>
          <div className="mt-10">
            {loadingProspectusSubjects ? (
              <div className="absolute bottom-[50%] left-[45%] right-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] md:left-[49%]">
                <DotSpinner size="3.8rem" />
                <span className="mt-4 inline-block w-[15em] text-lg font-bold">
                  Loading Prospectus...
                </span>
              </div>
            ) : prospectusSubjects.length > 0 ? (
              // Iterate over the grouped subjects by combined year level and semester and render a table for each
              Object.keys(groupedSubjects).map((yearSemesterKey, index) => {
                const consolidatedSubjects = consolidateSubjects(
                  groupedSubjects[yearSemesterKey],
                  yearSemesterKey, // Pass the yearSemesterKey for conditional logic
                );
                const totalUnits =
                  calculateTotalUnits(consolidatedSubjects).totalUnits;

                return (
                  <div
                    key={index}
                    className="mb-10 !text-black dark:!text-white lg:px-[8em]"
                  >
                    <div className="overflow-x-auto">
                      <table className="mb-4 min-w-full border-collapse border !text-black dark:!text-white">
                        {/* Insert the row with Year - Semester across the whole table */}
                        <thead>
                          <tr>
                            <th
                              colSpan="6"
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
                          </tr>
                          <tr>
                            <th className="border p-2">Lec</th>
                            <th className="border p-2">Lab</th>
                            <th className="border p-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {consolidatedSubjects.map((subject) => (
                            <tr key={subject.prospectus_subject_id}>
                              <td className="border p-2">
                                {subject.courseCode}
                              </td>
                              <td className="border p-2">
                                {subject.courseDescription}
                              </td>
                              <td className="border p-2">{subject.lecUnits}</td>
                              <td className="border p-2">{subject.labUnits}</td>
                              <td className="border p-2">
                                {subject.totalUnits}
                              </td>
                              <td className="border p-2">
                                {subject.prerequisites.length > 0
                                  ? subject.prerequisites
                                      .map(
                                        (prerequisite) =>
                                          prerequisite.courseCode,
                                      )
                                      .join(", ")
                                  : ""}
                              </td>
                            </tr>
                          ))}
                          {/* Add Total Units row */}
                          <tr>
                            <td className="border p-2"></td>

                            <td className="border p-2 text-center font-bold">
                              Total Units
                            </td>
                            <td className="border-none p-2"></td>
                            <td className="border-none p-2 text-center font-bold">
                              {totalUnits}
                            </td>
                            <td className="border-r p-2 font-bold"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="absolute bottom-[50%] left-[45%] right-[50%] top-[50%] w-[20em] translate-x-[-50%] translate-y-[-50%] text-lg font-bold md:left-[49%]">
                <span className="inline-block">
                  No subjects available for this prospectus.
                </span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProspectusDialog;
