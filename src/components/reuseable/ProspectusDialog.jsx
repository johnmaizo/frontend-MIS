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
    return subjects.reduce((acc, subject) => {
      const yearLevel = subject.yearLevel;
      const semesterName = subject.semesterName;

      if (!acc[yearLevel]) {
        acc[yearLevel] = {};
      }

      if (!acc[yearLevel][semesterName]) {
        acc[yearLevel][semesterName] = [];
      }

      acc[yearLevel][semesterName].push(subject);

      // Sort subjects within each semester by course_department_id (non-null first) and then by courseCode (A to Z)
      acc[yearLevel][semesterName].sort((a, b) => {
        if (a.course_department_id && !b.course_department_id) return -1;
        if (!a.course_department_id && b.course_department_id) return 1;
        return a.courseCode.localeCompare(b.courseCode);
      });

      return acc;
    }, {});
  };

  // Consolidate lecture and lab into one row by removing redundancy
  const consolidateSubjects = (subjects) => {
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

      // Assign lec or lab units based on the course code
      if (subject.courseCode.endsWith("L")) {
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
  const calculateTotalUnits = (subjects) => {
    return subjects.reduce(
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
        <DialogContent className="max-h-screen w-full max-w-4xl overflow-y-auto bg-white p-4 !text-black dark:bg-boxdark dark:!text-white md:h-[42em]">
          <DialogTitle className="mt-10 text-center uppercase !text-black dark:!text-white">
            {departmentName || "Loading Department..."}
          </DialogTitle>
          <DialogDescription>
            <div className="mb-4 !text-black dark:!text-white">
              <p className="text-center text-xl font-semibold uppercase">
                {program}
              </p>
            </div>
            <div className="mt-10">
              {loadingProspectusSubjects ? (
                <p>Loading...</p>
              ) : prospectusSubjects.length > 0 ? (
                // Iterate over the grouped subjects by year level and semester and render a table for each semester
                Object.keys(groupedSubjects).map((yearLevel, index) => (
                  <div
                    key={index}
                    className="mb-10 !text-black dark:!text-white"
                  >
                    <h2 className="mb-4 text-center text-2xl font-semibold">
                      {yearLevel}
                    </h2>
                    {Object.keys(groupedSubjects[yearLevel]).map(
                      (semesterName, idx) => {
                        const semesterSubjects = consolidateSubjects(
                          groupedSubjects[yearLevel][semesterName],
                        );
                        const totalUnits =
                          calculateTotalUnits(semesterSubjects);
                        return (
                          <div key={idx} className="mb-6">
                            <h3 className="mb-2 text-center text-xl font-semibold">
                              {semesterName}
                            </h3>
                            <div className="overflow-x-auto">
                              <table className="mb-4 min-w-full border-collapse border !text-black dark:!text-white">
                                <thead>
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
                                  {semesterSubjects.map((subject) => (
                                    <tr key={subject.prospectus_subject_id}>
                                      <td className="border p-2">
                                        {subject.courseCode}
                                      </td>
                                      <td className="border p-2">
                                        {subject.courseDescription}
                                      </td>
                                      <td className="border p-2">
                                        {subject.lecUnits}
                                      </td>
                                      <td className="border p-2">
                                        {subject.labUnits}
                                      </td>
                                      <td className="border p-2">
                                        {subject.totalUnits}
                                      </td>
                                      <td className="border p-2">
                                        {subject.prerequisites.length > 0
                                          ? subject.prerequisites.map(
                                              (prerequisite) => (
                                                <span
                                                  key={
                                                    prerequisite.pre_requisite_id
                                                  }
                                                >
                                                  {prerequisite.courseCode}
                                                  <br />
                                                </span>
                                              ),
                                            )
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
                                      {totalUnits.totalUnits}
                                    </td>
                                    <td className="border-r p-2 font-bold"></td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                ))
              ) : (
                <p>No subjects available for this prospectus.</p>
              )}
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProspectusDialog;
