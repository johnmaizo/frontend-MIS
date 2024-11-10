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

        // Fetch student personal data
        const studentResponse = await axios.get(
          `/students/personal-data/${student_personal_id}`,
        );
        const studentData = studentResponse.data;

        console.log("studentData: ", studentData);

        // Combine data
        setStudentInfo({
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          officialStudentId: studentData.officialStudentId,
          schoolYear: studentData.schoolYear,
          semesterName: studentData.semesterName,
        });

        // Fetch available classes for the semester
        const classesResponse = await axios.get(`/class/active`, {
          params: { semester_id: academicBackground.semester_id },
        });
        let classesData = classesResponse.data;

        // Format 'days' for each class
        classesData = classesData.map((cls) => ({
          ...cls,
          days: parseDays(cls.days, cls.schedule),
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
              ...cls,
              days: parseDays(cls.days, cls.schedule),
            };
          }
        });

        setSelectedClasses(selectedClassesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load student data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [student_personal_id]);

  // Helper function to parse days
  const parseDays = (days, schedule) => {
    if (Array.isArray(days)) {
      return days;
    } else if (typeof days === "string") {
      // Check if it's a JSON stringified array
      if (days.startsWith("[") && days.endsWith("]")) {
        try {
          const parsedDays = JSON.parse(days);
          if (Array.isArray(parsedDays)) {
            return parsedDays;
          }
        } catch (error) {
          console.warn("Failed to parse days string:", days);
        }
      }
      // If it's a comma-separated string, split it
      return days.split(",").map((day) => day.trim());
    } else if (schedule && typeof schedule === "string") {
      // Attempt to extract days from schedule
      const daysPart = schedule.split(/\d/)[0].trim(); // Split at first digit
      return daysPart.split(",").map((day) => day.trim());
    }
    return [];
  };

  const handleAddClass = (cls) => {
    // Check for schedule conflicts
    const conflict = selectedClasses.some((selectedClass) => {
      // Compare days and times
      const daysOverlap = selectedClass.days.some((day) =>
        cls.days.includes(day),
      );

      if (daysOverlap) {
        const selectedStart = new Date(`1970-01-01T${selectedClass.timeStart}`);
        const selectedEnd = new Date(`1970-01-01T${selectedClass.timeEnd}`);
        const clsStart = new Date(`1970-01-01T${cls.timeStart}`);
        const clsEnd = new Date(`1970-01-01T${cls.timeEnd}`);

        return (
          (clsStart >= selectedStart && clsStart < selectedEnd) ||
          (clsEnd > selectedStart && clsEnd <= selectedEnd)
        );
      }
      return false;
    });

    if (conflict) {
      toast.error("Schedule conflict detected!");
      return;
    }

    // Ensure 'days' is an array
    const formattedClass = {
      ...cls,
      days: Array.isArray(cls.days)
        ? cls.days
        : typeof cls.days === "string"
          ? cls.days.split(",").map((day) => day.trim())
          : cls.schedule
            ? cls.schedule
                .split(/\d/)[0]
                .trim()
                .split(",")
                .map((day) => day.trim())
            : [],
    };

    setSelectedClasses([...selectedClasses, formattedClass]);
  };

  const handleRemoveClass = (class_id) => {
    setSelectedClasses(
      selectedClasses.filter((cls) => cls.class_id !== class_id),
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
    // Assuming units are stored in cls.courseinfo.unit or cls.subjectUnits
    return total + (cls.courseinfo?.unit || cls.subjectUnits || 0);
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
                <p className="mt-4">Loading classes...</p>
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
                        {subject.classes.map((cls) => (
                          <div
                            key={cls.class_id}
                            className="flex items-center justify-between border-b p-2"
                          >
                            <div>
                              <p className="font-semibold">{cls.className}</p>
                              <p>{cls.schedule}</p>
                              <p>Instructor: {cls.instructorFullName}</p>
                            </div>
                            <Button
                              onClick={() => handleAddClass(cls)}
                              disabled={selectedClasses.some(
                                (selected) =>
                                  selected.class_id === cls.class_id,
                              )}
                            >
                              {selectedClasses.some(
                                (selected) =>
                                  selected.class_id === cls.class_id,
                              )
                                ? "Added"
                                : "Add"}
                            </Button>
                          </div>
                        ))}
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
                        <TableCell>
                          {formatTime(cls.timeStart)} -{" "}
                          {formatTime(cls.timeEnd)}
                        </TableCell>
                        <TableCell>{cls.room}</TableCell>
                        <TableCell>
                          {cls.courseinfo?.unit || cls.subjectUnits || 0}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            onClick={() => handleRemoveClass(cls.class_id)}
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
                className="mt-4 w-full"
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
    // Check if it's a JSON stringified array
    if (cls.days.startsWith("[") && cls.days.endsWith("]")) {
      try {
        const parsedDays = JSON.parse(cls.days);
        if (Array.isArray(parsedDays)) {
          return parsedDays.join(", ");
        }
      } catch (error) {
        console.warn("Failed to parse days string:", cls.days);
      }
    }
    // If it's a comma-separated string, return as-is
    return cls.days;
  } else if (cls.schedule && typeof cls.schedule === "string") {
    const daysPart = cls.schedule.split(/\d/)[0].trim(); // Split at first digit
    return daysPart
      .split(",")
      .map((day) => day.trim())
      .join(", ");
  }
  return "N/A"; // Default if days can't be determined
};

// Helper function to format time
const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  const [hour, minute] = timeString.split(":");
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

export default SubjectEnlistmentPage;
