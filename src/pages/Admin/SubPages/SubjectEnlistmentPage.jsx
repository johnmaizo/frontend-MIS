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
          };
        });

        // Remove any classes that failed to parse
        classesData = classesData.filter((cls) => cls !== null);

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
            const parsedSchedule = parseSchedule(cls.schedule);
            if (!parsedSchedule) {
              console.warn(
                `Unable to parse schedule for enlisted class ID ${cls.id}: "${cls.schedule}"`,
              );
              return null; // Skip if schedule can't be parsed
            }

            const { daysString, startTime, endTime } = parsedSchedule;

            return {
              class_id: cls.id,
              subjectCode: cls.subject_code,
              subjectDescription: cls.subject,
              schedule: formatSchedule(daysString, startTime, endTime),
              instructorFullName: cls.teacher,
              className: cls.subject,
              timeStart: startTime, // e.g., "3:00 AM"
              timeEnd: endTime, // e.g., "4:30 AM"
              room: cls.room,
              units: cls.units,
              days: parseDays(daysString), // Parsed days
            };
          }
        });

        // Remove any classes that failed to parse
        const validSelectedClasses = selectedClassesData.filter(
          (cls) => cls !== null,
        );

        setSelectedClasses(validSelectedClasses);
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

        return (
          (clsStart >= selectedStart && clsStart < selectedEnd) ||
          (clsEnd > selectedStart && clsEnd <= selectedEnd) ||
          (clsStart <= selectedStart && clsEnd >= selectedEnd) // Overlapping entire duration
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

export default SubjectEnlistmentPage;
