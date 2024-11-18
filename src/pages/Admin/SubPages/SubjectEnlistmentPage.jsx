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
import CurriculumTracker from "../../../components/reuseable/CurriculumTracker";
// Import the Switch component from shadcn
import { Switch } from "../../../components/ui/switch";

const SubjectEnlistmentPage = () => {
  const { student_personal_id } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enrolledSubjects, setEnrolledSubjects] = useState([]);
  const [prospectusId, setProspectusId] = useState(null);
  const [unitLimit, setUnitLimit] = useState(null);
  // New states for toggles
  const [allowOverloadUnits, setAllowOverloadUnits] = useState(false);
  const [allowOverCapacityEnrollment, setAllowOverCapacityEnrollment] =
    useState(false);

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

        console.log("academicBackground:", academicBackground);

        // Extract prospectus_id and student_class_enrollments
        const { prospectus_id, student_class_enrollments, yearLevel } =
          academicBackground;

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

        // Collect unique subject_codes from all the prospectus subjects
        const prospectusSubjectCodesSet = new Set(
          prospectusSubjects.map((ps) => ps.courseCode.toUpperCase()),
        );

        // Extract class_ids from student_class_enrollments with status "enrolled" or "passed"
        const enrolledClassIds = student_class_enrollments
          .filter(
            (enrollment) =>
              enrollment.status === "enrolled" ||
              enrollment.status === "passed",
          )
          .map((enrollment) => enrollment.class_id);

        // Fetch all active classes without filtering by semester_id
        const classesResponse = await axios.get(`/class/active`);
        let classesData = classesResponse.data;

        // Map class IDs to subject codes for enrolled classes
        const enrolledClassesData = classesData.filter((cls) =>
          enrolledClassIds.includes(cls.id),
        );

        // Extract subject codes of enrolled classes
        const enrolledSubjectCodesSet = new Set(
          enrolledClassesData.map((cls) => cls.subject_code.toUpperCase()),
        );

        // Map enrolledClassesData to the expected format for CurriculumTracker
        const enrolledSubjectsData = enrolledClassesData.map((cls) => {
          return {
            classDetails: {
              subjectCode: cls.subject_code,
              subjectDescription: cls.subject,
            },
          };
        });

        // Set enrolledSubjects state for CurriculumTracker
        setEnrolledSubjects(enrolledSubjectsData);
        setProspectusId(prospectus_id);

        // Now, filter classesData to include only classes with subject_code in prospectusSubjectCodesSet and not in enrolledSubjectCodesSet
        classesData = classesData.filter(
          (cls) =>
            prospectusSubjectCodesSet.has(cls.subject_code.toUpperCase()) &&
            !enrolledSubjectCodesSet.has(cls.subject_code.toUpperCase()),
        );

        // Map the fetched data to match the expected structure
        classesData = classesData.map((cls) => {
          // Parse the schedule string
          const parsedSchedule = parseSchedule(cls.schedule);
          if (!parsedSchedule) {
            console.warn(
              `Unable to parse schedule for class ID ${cls.id}: "${cls.schedule}"`,
            );
            return null; // Skip classes with invalid schedule formats
          }

          const { daysString, startTime, endTime } = parsedSchedule;

          return {
            class_id: cls.id,
            subjectCode: cls.subject_code,
            subjectDescription: cls.subject,
            schedule: formatSchedule(daysString, startTime, endTime),
            instructorFullName: cls.teacher,
            className: cls.subject, // Assuming class name is the subject name
            timeStart: startTime, // e.g., "3:00 AM"
            timeEnd: endTime, // e.g., "4:30 AM"
            room: cls.room,
            units: cls.units,
            days: parseDays(daysString), // Parsed days
            totalStudents: cls.totalStudents || 0, // Added totalStudents
          };
        });

        // Remove any classes that failed to parse
        classesData = classesData.filter((cls) => cls !== null);

        // Include prerequisites in the subjects
        const prospectusSubjectsMap = {};
        prospectusSubjects.forEach((subject) => {
          prospectusSubjectsMap[subject.courseCode.toUpperCase()] = subject;
        });

        // Group classes by subjectCode and subjectDescription
        const subjectsMap = {};
        classesData.forEach((cls) => {
          const key = `${cls.subjectCode} - ${cls.subjectDescription}`;
          if (!subjectsMap[key]) {
            subjectsMap[key] = {
              subjectKey: key,
              classes: [],
              prerequisites: [],
            };
          }
          subjectsMap[key].classes.push(cls);

          // Add prerequisites from the prospectusSubjects data
          const prospectusSubject =
            prospectusSubjectsMap[cls.subjectCode.toUpperCase()];
          if (prospectusSubject && prospectusSubject.prerequisites) {
            subjectsMap[key].prerequisites =
              prospectusSubject.prerequisites.map((preq) =>
                preq.courseCode.toUpperCase(),
              );
          }
        });

        const subjectsArray = Object.values(subjectsMap);

        setSubjects(subjectsArray);

        // Fetch student's existing enlisted classes
        const enlistedClassesData = student_class_enrollments
          .filter((enrollment) => enrollment.status === "enlisted")
          .map((enrollment) => {
            // Find the matching class in classesData
            const matchingClass = classesData.find(
              (cls) => cls.class_id === enrollment.class_id,
            );
            if (matchingClass) {
              return matchingClass;
            } else {
              // If the class is not in classesData, perhaps it is inactive now
              // Try to find it in the enrolledClassesData
              const enrolledClass = enrolledClassesData.find(
                (cls) => cls.id === enrollment.class_id,
              );
              if (enrolledClass) {
                // Map to the expected structure
                const parsedSchedule = parseSchedule(enrolledClass.schedule);
                const { daysString, startTime, endTime } = parsedSchedule || {
                  daysString: "",
                  startTime: "",
                  endTime: "",
                };

                return {
                  class_id: enrolledClass.id,
                  subjectCode: enrolledClass.subject_code,
                  subjectDescription: enrolledClass.subject,
                  schedule: formatSchedule(daysString, startTime, endTime),
                  instructorFullName: enrolledClass.teacher,
                  className: enrolledClass.subject,
                  timeStart: startTime,
                  timeEnd: endTime,
                  room: enrolledClass.room,
                  units: enrolledClass.units,
                  days: parseDays(daysString),
                  totalStudents: enrolledClass.totalStudents || 0,
                };
              } else {
                // If not found, create a placeholder
                return {
                  class_id: enrollment.class_id,
                  subjectCode: "Unknown",
                  subjectDescription: "Unknown",
                  schedule: "Unknown",
                  instructorFullName: "Unknown",
                  className: "Unknown",
                  timeStart: "Unknown",
                  timeEnd: "Unknown",
                  room: "Unknown",
                  units: 0,
                  days: [],
                  totalStudents: 0,
                };
              }
            }
          });

        // Remove any classes that failed to map
        const validSelectedClasses = enlistedClassesData.filter(
          (cls) => cls !== null,
        );

        setSelectedClasses(validSelectedClasses);

        // Calculate unit limit based on the current semester and year level in the prospectus
        const currentSemester = studentData.semesterName.trim().toLowerCase();
        const currentYearLevel = yearLevel.trim().toLowerCase();
        const semesterUnitsSubjects = prospectusSubjects.filter(
          (subject) =>
            subject.semesterName.trim().toLowerCase() === currentSemester &&
            subject.yearLevel.trim().toLowerCase() === currentYearLevel,
        );

        // For reference only
        const semesterUnits = semesterUnitsSubjects.reduce(
          (total, subject) => total + (subject.unit || 0),
          0,
        );
        setUnitLimit(semesterUnits);
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

  /**
   * Parses the schedule string to extract days, start time, and end time.
   * Expected format: "DAYS START_TIME - END_TIME"
   * Example: "TTH 3:00 AM - 4:30 AM"
   *
   * @param {string} scheduleStr - The schedule string to parse.
   * @returns {object|null} - An object with daysString, startTime, and endTime or null if parsing fails.
   */
  const parseSchedule = (scheduleStr) => {
    if (typeof scheduleStr !== "string") return null;

    // Regular expression to match the schedule format
    const scheduleRegex =
      /^([A-Za-z,]+)\s+(\d{1,2}:\d{2}\s?(AM|PM))\s*-\s*(\d{1,2}:\d{2}\s?(AM|PM))$/i;
    const match = scheduleStr.match(scheduleRegex);

    if (!match) return null;

    const daysString = match[1].toUpperCase();
    const startTime = match[2].toUpperCase();
    const endTime = match[4].toUpperCase();

    return { daysString, startTime, endTime };
  };

  /**
   * Formats the schedule components into a readable string.
   *
   * @param {string} daysString - The days string (e.g., "TTH").
   * @param {string} startTime - The start time (e.g., "3:00 AM").
   * @param {string} endTime - The end time (e.g., "4:30 AM").
   * @returns {string} - The formatted schedule string.
   */
  const formatSchedule = (daysString, startTime, endTime) => {
    const daysFormatted = daysString
      .split(",")
      .map((day) => day.trim())
      .join(", ");
    return `${daysFormatted} ${startTime} - ${endTime}`;
  };

  /**
   * Parses the days string into an array of standardized day codes.
   *
   * @param {string} daysString - The days string (e.g., "TTH").
   * @returns {Array<string>} - An array of day codes (e.g., ["TU", "TH"]).
   */
  const parseDays = (daysString) => {
    if (typeof daysString !== "string") return [];

    // Handle multiple days separated by commas
    if (daysString.includes(",")) {
      return daysString.split(",").map((day) => day.trim());
    }

    // Handle abbreviations like "TTH"
    const dayMapping = {
      M: "MO",
      MT: "MO",
      MO: "MO",
      TU: "TU",
      T: "TU",
      TTH: "TH",
      TH: "TH",
      W: "WE",
      WE: "WE",
      F: "FR",
      FR: "FR",
      S: "SA",
      SA: "SA",
      SU: "SU",
    };

    const days = [];

    // Split the string into possible day codes
    let temp = daysString;
    while (temp.length > 0) {
      if (temp.startsWith("TTH")) {
        days.push(dayMapping["TTH"]);
        temp = temp.slice(3);
      } else if (temp.startsWith("TH")) {
        days.push(dayMapping["TH"]);
        temp = temp.slice(2);
      } else {
        const dayCode = temp.slice(0, 1);
        if (dayMapping[dayCode]) {
          days.push(dayMapping[dayCode]);
          temp = temp.slice(1);
        } else {
          // If unknown, skip one character to prevent infinite loop
          console.warn(`Unknown day code in daysString: "${daysString}"`);
          temp = temp.slice(1);
        }
      }
    }

    return days;
  };

  /**
   * Formats the days array into a readable string.
   *
   * @param {object} cls - The class object.
   * @returns {string} - Formatted days string.
   */
  const formatDays = (cls) => {
    if (cls.days && Array.isArray(cls.days)) {
      return cls.days.join(", ");
    } else if (typeof cls.days === "string") {
      return cls.days;
    } else if (cls.schedule && typeof cls.schedule === "string") {
      const parsed = parseSchedule(cls.schedule);
      if (parsed) {
        const { daysString } = parsed;
        return parseDays(daysString).join(", ");
      }
    }
    return "N/A"; // Default if days can't be determined
  };

  /**
   * Formats the time string for display.
   *
   * @param {string} timeString - The time string (e.g., "3:00 AM").
   * @returns {string} - Formatted time string.
   */
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    // Optionally, you can format the time string if needed
    return timeString; // Already in "3:00 AM" format
  };

  /**
   * Handles adding a class to the selectedClasses state.
   *
   * @param {object} cls - The class object to add.
   */
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
    let conflictingClass = null;
    const conflict = classesToCheck.some((selectedClass) => {
      // Compare days and times
      const daysOverlap = selectedClass.days.some((day) =>
        cls.days.includes(day),
      );

      if (daysOverlap) {
        const selectedStart = new Date(
          `1970-01-01T${convertTo24Hour(selectedClass.timeStart)}:00`,
        );
        const selectedEnd = new Date(
          `1970-01-01T${convertTo24Hour(selectedClass.timeEnd)}:00`,
        );
        const clsStart = new Date(
          `1970-01-01T${convertTo24Hour(cls.timeStart)}:00`,
        );
        const clsEnd = new Date(
          `1970-01-01T${convertTo24Hour(cls.timeEnd)}:00`,
        );

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

        const isConflict =
          (clsStart >= selectedStart && clsStart < selectedEnd) ||
          (clsEnd > selectedStart && clsEnd <= selectedEnd) ||
          (clsStart <= selectedStart && clsEnd >= selectedEnd); // Overlapping entire duration

        if (isConflict) {
          conflictingClass = selectedClass;
          return true;
        }
      }
      return false;
    });

    if (conflict) {
      toast.error(
        `Schedule conflict detected with ${conflictingClass.subjectCode} - ${conflictingClass.className} on ${formatDays(
          conflictingClass,
        )} ${formatTime(conflictingClass.timeStart)} - ${formatTime(
          conflictingClass.timeEnd,
        )}.`,
        { position: "bottom-right", duration: 4000 },
      );
      return;
    }

    // Check unit limit if overloading is not allowed
    if (!allowOverloadUnits) {
      const newTotalUnits = selectedClasses.reduce(
        (total, c) => total + (c.units || 0),
        cls.units || 0,
      );
      if (unitLimit !== null && newTotalUnits > unitLimit) {
        toast.error(
          `Unit limit exceeded! You can only enroll up to ${unitLimit} units.`,
          { position: "bottom-right" },
        );
        return;
      }
    }

    // Check class capacity if overcapacity enrollment is not allowed
    if (!allowOverCapacityEnrollment && cls.totalStudents >= 50) {
      toast.error(`Cannot add "${cls.className}". The class is full.`, {
        position: "bottom-right",
      });
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

      // If overcapacity enrollment is allowed, display a warning
      if (allowOverCapacityEnrollment && cls.totalStudents >= 50) {
        toast(
          `Warning: "${cls.className}" has reached its capacity of 50 students.`,
          { icon: "⚠️", position: "bottom-right" },
        );
      }
    }
  };

  /**
   * Converts a 12-hour time string to a 24-hour format.
   *
   * @param {string} timeStr - Time string in "h:mm AM/PM" format.
   * @returns {string} - Time string in "HH:MM" 24-hour format.
   */
  const convertTo24Hour = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);

    if (modifier.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }

    const formattedHours = hours.toString().padStart(2, "0");
    return `${formattedHours}:${minutes}`;
  };

  /**
   * Handles removing a class from the selectedClasses state.
   *
   * @param {number} class_id - The ID of the class to remove.
   */
  const handleRemoveClass = (class_id) => {
    setSelectedClasses((prev) =>
      prev.filter((cls) => cls.class_id !== class_id),
    );
  };

  /**
   * Handles submitting the enlisted classes.
   */
  const handleSubmitEnlistment = async () => {
    if (selectedClasses.length === 0) return;

    setIsSubmitting(true); // Set submitting state to true

    const selectedClassIds = selectedClasses.map((cls) => cls.class_id);

    const payload = {
      student_personal_id: parseInt(student_personal_id),
      class_ids: selectedClassIds,
    };

    try {
      const response = await axios.post(
        "/enrollment/submit-enlistment",
        payload,
      );
      toast.success("Subjects enlisted successfully!", {
        position: "bottom-right",
      });
      toast.success(response.data.message, {
        duration: 5500,
        position: "bottom-right",
      });
      navigate("/enrollments/unenrolled-registrations/");
    } catch (error) {
      console.error("Error submitting enlistment:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to submit enlistment. Please try again.",
        { position: "bottom-right" },
      );
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  /**
   * Filters subjects based on the search term.
   */
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

  // Collect all subject codes that the student has completed or is currently enrolled in
  const studentCompletedSubjects = new Set(
    enrolledSubjects.map((subj) => subj.classDetails.subjectCode.toUpperCase()),
  );

  // Also include subjects in selectedClasses (subjects the student is enlisting in this session)
  selectedClasses.forEach((cls) =>
    studentCompletedSubjects.add(cls.subjectCode.toUpperCase()),
  );

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
              {/* Add CurriculumTracker here */}
              {prospectusId && enrolledSubjects && (
                <CurriculumTracker
                  prospectus_id={prospectusId}
                  enrolledSubjects={enrolledSubjects}
                />
              )}
            </div>
          )}

          {/* Toggles for allowing overloading and overcapacity enrollment */}
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="allowOverloadUnits"
                checked={allowOverloadUnits}
                onCheckedChange={setAllowOverloadUnits}
              />
              <label htmlFor="allowOverloadUnits" className="select-none">
                Allow Overloading Units
              </label>
            </div>
            <div className="mt-2 flex items-center space-x-2 md:mt-0">
              <Switch
                id="allowOverCapacityEnrollment"
                checked={allowOverCapacityEnrollment}
                onCheckedChange={setAllowOverCapacityEnrollment}
              />
              <label
                htmlFor="allowOverCapacityEnrollment"
                className="select-none"
              >
                Allow Enrollment in Full Classes
              </label>
            </div>
          </div>

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
                  {/* Spinner */}
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
                  {filteredSubjects.map((subject) => {
                    const prerequisites = subject.prerequisites || [];
                    // Check if prerequisites are met
                    const prerequisitesMet = prerequisites.every((preqCode) =>
                      studentCompletedSubjects.has(preqCode),
                    );

                    return (
                      <AccordionItem
                        key={subject.subjectKey}
                        value={subject.subjectKey}
                      >
                        <AccordionTrigger>
                          {subject.subjectKey}
                        </AccordionTrigger>
                        <AccordionContent>
                          {/* Display missing prerequisites if any */}
                          {!prerequisitesMet && prerequisites.length > 0 && (
                            <p className="text-red-500">
                              Missing Prerequisites:{" "}
                              {prerequisites
                                .filter(
                                  (preqCode) =>
                                    !studentCompletedSubjects.has(preqCode),
                                )
                                .join(", ")}
                            </p>
                          )}
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

                            const disableAddButton =
                              isSubmitting || isSelected || !prerequisitesMet;

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
                                  <p className="font-semibold">
                                    {cls.className}
                                  </p>
                                  <p>{cls.schedule}</p>
                                  <p>Instructor: {cls.instructorFullName}</p>
                                  <p>
                                    Enrolled Students: {cls.totalStudents}
                                    {cls.totalStudents >= 50 && (
                                      <span className="text-red-500">
                                        {" "}
                                        (Class is full)
                                      </span>
                                    )}
                                  </p>
                                </div>
                                <Button
                                  onClick={() => handleAddClass(cls)}
                                  disabled={disableAddButton} // Disable if submitting, already selected, or prerequisites not met
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
                    );
                  })}
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
                            disabled={isSubmitting} // Optionally disable remove during submission
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
                  <span className="text-blue-600">
                    {totalUnits}
                    {unitLimit !== null ? `/${unitLimit}` : ""}
                  </span>
                </p>
              </div>

              {/* Submit Enlistment Button */}
              <Button
                className="mt-4 flex w-full items-center justify-center bg-purple-500 text-white hover:bg-purple-600"
                onClick={handleSubmitEnlistment}
                disabled={selectedClasses.length === 0 || isSubmitting} // Disabled if no classes or submitting
              >
                {isSubmitting ? (
                  <>
                    {/* Spinner Icon */}
                    <svg
                      className="mr-2 h-5 w-5 animate-spin text-white"
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
                    Submitting Enlistment...
                  </>
                ) : (
                  "Submit Enlistment"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SubjectEnlistmentPage;
