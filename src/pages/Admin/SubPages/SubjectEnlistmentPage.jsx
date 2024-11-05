// SubjectEnlistmentPage.jsx

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
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
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [semester_id, setSemesterID] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedClasses, setSelectedClasses] = useState([]);

  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Fetch the student's academic background to get the semester_id
    const fetchAcademicBackground = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/enrollment/student-academic-background/${student_personal_id}`,
        );
        const academicBackground = response.data;
        setSemesterID(academicBackground.semester_id);

        console.log("Semester id: ", academicBackground.semester_id);

        // Fetch available classes for the semester
        const classesResponse = await axios.get(`/class/active`, {
          params: { semester_id: academicBackground.semester_id },
        });
        const classesData = classesResponse.data;

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

        setSubjects(subjectsArray); // Corrected assignment
      } catch (error) {
        console.error("Error fetching classes:", error);
        toast.error("Failed to load available subjects.");
      } finally {
        setLoading(false);
      }
    };

    fetchAcademicBackground();
  }, [student_personal_id]);

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

    setSelectedClasses([...selectedClasses, cls]);
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
        toast.success("Subjects enlisted successfully!");
        toast.success(response.data.message);

        // Navigate to the next step, e.g., payment section
        // navigate(`/enrollment/payment/${student_personal_id}`);
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
                        <TableCell>{cls.days.join(", ")}</TableCell>
                        <TableCell>
                          {formatTime(cls.timeStart)} -{" "}
                          {formatTime(cls.timeEnd)}
                        </TableCell>
                        <TableCell>{cls.room}</TableCell>
                        <TableCell>{cls.courseinfo.unit}</TableCell>
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

// Helper function to format time
const formatTime = (timeString) => {
  const [hour, minute] = timeString.split(":");
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

export default SubjectEnlistmentPage;
