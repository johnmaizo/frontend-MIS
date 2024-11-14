import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../../components/ui/accordion";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../../components/ui/table";
import { toast } from "react-hot-toast";
import DefaultLayout from "../../layout/DefaultLayout";
import { BreadcrumbResponsive } from "../../../components/reuseable/Breadcrumbs";
import { HasRole } from "../../../components/reuseable/HasRole";
import { AuthContext } from "../../../components/context/AuthContext";

const SubjectEnlistmentPage = () => {
  const { student_personal_id } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);

  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        // Fetch student academic background
        const academicResponse = await axios.get(
          `/enrollment/student-academic-background/${student_personal_id}`,
        );
        const academicBackground = academicResponse.data;

        // Extract prospectus_id and semester_id from academicBackground
        const { prospectus_id, semester_id } = academicBackground;

        // Fetch prospectus subjects
        const prospectusResponse = await axios.get(
          "/prospectus/get-all-prospectus-subjects",
          {
            params: { prospectus_id },
          },
        );
        const prospectusSubjects = prospectusResponse.data;

        // Fetch student personal data
        const studentResponse = await axios.get(
          `/students/personal-data/${student_personal_id}`,
        );
        const studentData = studentResponse.data;

        // Combine data
        setStudentInfo({
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          officialStudentId: studentData.officialStudentId,
          schoolYear: studentData.schoolYear,
          semesterName: studentData.semesterName,
        });

        // Determine the current semester from studentInfo
        const currentSemester = studentData.semesterName;

        // Filter prospectus subjects for the current semester
        const currentSemesterProspectusSubjects = prospectusSubjects.filter(
          (ps) =>
            ps.semesterName === currentSemester && ps.isActive && !ps.isDeleted,
        );

        // Debugging: Log the filtered prospectus subjects
        console.log(
          "Filtered Prospectus Subjects:",
          currentSemesterProspectusSubjects,
        );

        // Collect unique subject_codes from the filtered prospectus subjects
        const subjectCodes = [
          ...new Set(
            currentSemesterProspectusSubjects.map((ps) => ps.courseCode),
          ),
        ];

        // Debugging: Log the subjectCodes to verify correctness
        console.log("Prospectus Subject Codes:", subjectCodes);

        // Fetch available classes for the semester
        const classesResponse = await axios.get(`/class/active`, {
          params: { semester_id },
        });
        let classesData = classesResponse.data;

        // Debugging: Log the fetched classesData before filtering
        console.log("Fetched Classes Data (Before Filtering):", classesData);

        // Filter classesData to include only classes with subject_code in subjectCodes
        classesData = classesData.filter((cls) =>
          subjectCodes.includes(cls.subject_code),
        );

        // Debugging: Log the classesData after filtering
        console.log("Filtered Classes Data:", classesData);

        // Map the fetched data to match the expected structure
        classesData = classesData.map((cls) => ({
          class_id: cls.id,
          subjectCode: cls.subject_code,
          subjectDescription: cls.subject,
          schedule: formatSchedule(cls),
          instructorFullName: cls.teacher,
          className: cls.subject, // Assuming class name is the subject name
          timeStart: cls.start, // Keep as ISO string
          timeEnd: cls.end, // Keep as ISO string
          room: cls.room,
          units: cls.units,
          days: parseDays(cls.day), // Parse days correctly
        }));

        // Group classes by subjectCode and subjectDescription
        const subjectsMap = {};
        classesData.forEach((cls) => {
          const key = `${cls.subjectCode} - ${cls.subjectDescription}`;
          if (!subjectsMap[key]) {
            subjectsMap[key] = [];
          }
          subjectsMap[key].push(cls);
        });

        const subjectsArray = Object.keys(subjectsMap).map((subjectKey) => {
          return {
            subjectKey,
            classes: subjectsMap[subjectKey],
          };
        });

        setSubjects(subjectsArray);

        // Fetch student's existing enlisted classes
        const enlistedClassesResponse = await axios.get(
          `/enrollment/get-enlisted-classes/${student_personal_id}`,
        );
        const enlistedClassesData = enlistedClassesResponse.data;

        // Map enlisted classes to match the structure of classesData
        const selectedClassesData = enlistedClassesData.map((cls) => {
          // Find the matching class in classesData
          const matchingClass = classesData.find(
            (c) => c.class_id === cls.class_id,
          );
          if (matchingClass) {
            return matchingClass;
          } else {
            // If the class is not in classesData, perhaps it is inactive now
            return {
              class_id: cls.id,
              subjectCode: cls.subject_code,
              subjectDescription: cls.subject,
              schedule: formatSchedule(cls),
              instructorFullName: cls.teacher,
              className: cls.subject,
              timeStart: cls.start, // Keep as ISO string
              timeEnd: cls.end, // Keep as ISO string
              room: cls.room,
              units: cls.units,
              days: parseDays(cls.day), // Parse days correctly
            };
          }
        });

        setSelectedClasses(selectedClassesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load student data.", {
          position: "bottom-right",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [student_personal_id]);

  // Helper function to format schedule string
  const formatSchedule = (cls) => {
    const daysFormatted = cls.day
      .split(",")
      .map((day) => day.trim())
      .join(", ");
    const startTime = formatTime(cls.start);
    const endTime = formatTime(cls.end);
    return `${daysFormatted} ${startTime} - ${endTime}`;
  };

  // Helper function to parse days from the 'day' field
  const parseDays = (daysString) => {
    if (typeof daysString === "string") {
      // Handle cases like "TTH" or "TU, TH"
      if (daysString.includes(",")) {
        return daysString.split(",").map((day) => day.trim());
      } else {
        // Split "TTH" into ["TU", "TH"] if necessary
        // This assumes "TTH" stands for Tuesday and Thursday
        if (daysString === "TTH") {
          return ["TU", "TH"];
        }
        // Handle other abbreviations as needed
        const dayMapping = {
          M: "MO",
          T: "TU",
          W: "WE",
          TH: "TH",
          F: "FR",
          S: "SA",
          SU: "SU",
          MO: "MO",
          TU: "TU",
          WE: "WE",
          FR: "FR",
          SA: "SA",
          // Removed duplicate 'TH' and 'SU' keys
        };
        return [dayMapping[daysString] || daysString];
      }
    }
    return [];
  };

  const handleAddClass = (cls) => {
    // Find existing class for the same subject
    const existingClass = selectedClasses.find(
      (selectedClass) => selectedClass.subjectCode === cls.subjectCode,
    );

    // Prepare a list of classes to check for conflict
    const classesToCheck = existingClass
      ? selectedClasses.filter(
          (selectedClass) => selectedClass.class_id !== existingClass.class_id,
        )
      : selectedClasses;

    // Check for schedule conflicts with classesToCheck
    const conflict = classesToCheck.some((selectedClass) => {
      // Compare days and times
      const daysOverlap = selectedClass.days.some((day) =>
        cls.days.includes(day),
      );

      if (daysOverlap) {
        const selectedStart = new Date(selectedClass.timeStart);
        const selectedEnd = new Date(selectedClass.timeEnd);
        const clsStart = new Date(cls.timeStart);
        const clsEnd = new Date(cls.timeEnd);

        // Ensure valid dates
        if (
          isNaN(selectedStart) ||
          isNaN(selectedEnd) ||
          isNaN(clsStart) ||
          isNaN(clsEnd)
        ) {
          console.warn("Invalid date encountered during conflict check.");
          return false;
        }

        return (
          (clsStart >= selectedStart && clsStart < selectedEnd) ||
          (clsEnd > selectedStart && clsEnd <= selectedEnd)
        );
      }
      return false;
    });

    if (conflict) {
      toast.error("Schedule conflict detected!", { position: "bottom-right" });
      return;
    }

    if (existingClass) {
      // Replace the existing class with the new one
      setSelectedClasses((prev) => [
        ...prev.filter(
          (selectedClass) => selectedClass.subjectCode !== cls.subjectCode,
        ),
        cls,
      ]);
      toast.success(
        `Replaced "${existingClass.className}" with "${cls.className}"`,
        {
          position: "bottom-right",
        },
      );
    } else {
      // Add the new class
      setSelectedClasses((prev) => [...prev, cls]);
      toast.success(`Added "${cls.className}"`, {
        position: "bottom-right",
      });
    }
  };

  const handleRemoveClass = (class_id) => {
    setSelectedClasses((prev) =>
      prev.filter((cls) => cls.class_id !== class_id),
    );
  };

  const handleSubmitEnlistment = () => {
    const selectedClassIds = selectedClasses.map((cls) => cls.class_id);

    const payload = {
      student_personal_id: parseInt(student_personal_id),
      class_ids: selectedClassIds,
    };

    axios
      .post("/enrollment/submit-enlistment", payload)
      .then((response) => {
        toast.success("Subjects enlisted successfully!", {
          position: "bottom-right",
        });
        toast.success(response.data.message, {
          duration: 5500,
          position: "bottom-right",
        });
        navigate("/enrollments/unenrolled-registrations/");
      })
      .catch((error) => {
        console.error("Error submitting enlistment:", error);
        toast.error(
          error.response?.data?.message ||
            "Failed to submit enlistment. Please try again.",
          { position: "bottom-right" },
        );
      });
  };

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.subjectKey &&
      subject.subjectKey.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const NavItems = [
    { to: "/", label: "Dashboard" },
    {
      label: "Subject Enlistment",
    },
  ];

  // Calculate total units
  const totalUnits = selectedClasses.reduce((total, cls) => {
    return total + (cls.units || 0);
  }, 0);

  return (
    <DefaultLayout>
      <BreadcrumbResponsive
        pageName={
          !HasRole(user.role, "SuperAdmin")
            ? `Subject Enlistment (${user?.campusName})`
            : "Subject Enlistment (All Campuses)"
        }
        items={NavItems}
        ITEMS_TO_DISPLAY={2}
      />

      <div className="my-5 rounded-sm border border-stroke bg-white p-4 px-6 dark:border-strokedark dark:bg-boxdark">
        <div className="p-4">
          {/* Display student information */}
          {studentInfo && (
            <div className="mb-4">
              <h2 className="text-2xl font-bold">
                Enlistment for &quot;{studentInfo.firstName}{" "}
                {studentInfo.lastName}&quot;
              </h2>
              <p>
                Official Student ID: {studentInfo.officialStudentId || "N/A"}
              </p>
              <p>
                School Year: <strong>{studentInfo.schoolYear}</strong>
              </p>
              <p>
                Semester: <strong>{studentInfo.semesterName}</strong>
              </p>
            </div>
          )}

          <h2 className="text-2xl font-bold">Available Subjects</h2>
          <div className="mt-4 flex flex-col md:flex-row">
            {/* Left side - Subjects */}
            <div className="w-full pr-4 md:w-1/2">
              <Input
                placeholder="Search by subject code or class name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {loading ? (
                <div className="mt-4 flex justify-center">
                  {/* You can replace this with a spinner or any loading indicator */}
                  <svg
                    className="h-8 w-8 animate-spin text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                </div>
              ) : filteredSubjects.length === 0 ? (
                <p className="mt-4">No classes found. Please add new Class.</p>
              ) : (
                <Accordion type="single" collapsible className="mt-4">
                  {filteredSubjects.map((subject) => (
                    <AccordionItem
                      key={subject.subjectKey}
                      value={subject.subjectKey}
                    >
                      <AccordionTrigger>{subject.subjectKey}</AccordionTrigger>
                      <AccordionContent>
                        {subject.classes.map((cls) => {
                          // Determine if this class is already selected
                          const isSelected = selectedClasses.some(
                            (selected) => selected.class_id === cls.class_id,
                          );

                          // Determine if any class from the same subject is already selected
                          const isSubjectSelected = selectedClasses.some(
                            (selected) =>
                              selected.subjectCode === cls.subjectCode,
                          );

                          return (
                            <div
                              key={cls.class_id}
                              className={`flex items-center justify-between border-b p-2 ${
                                isSelected
                                  ? "bg-green-100" // Light green background for selected
                                  : "bg-white" // Default background
                              }`}
                            >
                              <div>
                                <p className="font-semibold">{cls.className}</p>
                                <p>{cls.schedule}</p>
                                <p>Instructor: {cls.instructorFullName}</p>
                              </div>
                              <Button
                                onClick={() => handleAddClass(cls)}
                                disabled={isSelected} // **Fixed Condition**
                                className={`${
                                  isSelected
                                    ? "cursor-not-allowed bg-green-500 text-white hover:bg-green-600" // Green for added
                                    : isSubjectSelected
                                      ? "bg-yellow-500 text-white hover:bg-yellow-600" // Yellow for replace
                                      : "bg-blue-500 text-white hover:bg-blue-600" // Blue for add
                                }`}
                              >
                                {isSelected
                                  ? "Added"
                                  : isSubjectSelected
                                    ? "Replace"
                                    : "Add"}
                              </Button>
                            </div>
                          );
                        })}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>

            {/* Right side - Selected Classes */}
            <div className="mt-8 w-full pl-4 md:mt-0 md:w-1/2">
              <h3 className="text-xl font-semibold">Selected Subjects</h3>
              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject Code</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedClasses.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan="6"
                        className="text-gray-500 text-center"
                      >
                        No subjects selected.
                      </TableCell>
                    </TableRow>
                  ) : (
                    selectedClasses.map((cls) => (
                      <TableRow key={cls.class_id}>
                        <TableCell>{cls.subjectCode}</TableCell>
                        <TableCell>{formatDays(cls)}</TableCell>
                        {/* Updated Time Column */}
                        <TableCell>
                          {formatTime(cls.timeStart)} -{" "}
                          {formatTime(cls.timeEnd)}
                        </TableCell>
                        <TableCell>{cls.room}</TableCell>
                        <TableCell>{cls.units}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            onClick={() => handleRemoveClass(cls.class_id)}
                            className="bg-red-500 text-white hover:bg-red-600"
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Display Total Units */}
              <div className="mt-4 flex justify-end">
                <p className="text-lg font-semibold">
                  Total Units:{" "}
                  <span className="text-blue-600">{totalUnits}</span>
                </p>
              </div>

              <Button
                className="mt-4 w-full bg-purple-500 text-white hover:bg-purple-600"
                onClick={handleSubmitEnlistment}
                disabled={selectedClasses.length === 0}
              >
                Submit Enlistment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

// Helper function to format days
const formatDays = (cls) => {
  if (cls.days && Array.isArray(cls.days)) {
    return cls.days.join(", ");
  } else if (typeof cls.days === "string") {
    return cls.days;
  } else if (cls.schedule && typeof cls.schedule === "string") {
    const daysPart = cls.schedule.split(" ")[0].trim(); // Extract days before time
    return daysPart
      .split(",")
      .map((day) => day.trim())
      .join(", ");
  }
  return "N/A"; // Default if days can't be determined
};

// Helper function to format time
const formatTime = (dateTimeString) => {
  if (!dateTimeString) return "N/A";
  const date = new Date(dateTimeString);
  if (isNaN(date)) return "N/A"; // Handle invalid dates
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default SubjectEnlistmentPage;
