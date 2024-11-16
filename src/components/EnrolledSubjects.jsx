/* eslint-disable react/prop-types */
// src/components/EnrolledSubjects.jsx

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./ui/accordion";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
// import CurriculumTracker from "./CurriculumTracker"; // Import the new component
import CurriculumTracker from "./reuseable/CurriculumTracker";

// Helper function to format days
const formatDays = (days) => {
  if (Array.isArray(days)) {
    return days.join(", ");
  } else if (typeof days === "string") {
    // Check if it's a JSON stringified array
    if (days.startsWith("[") && days.endsWith("]")) {
      try {
        const parsedDays = JSON.parse(days);
        if (Array.isArray(parsedDays)) {
          return parsedDays.join(", ");
        }
      } catch (error) {
        console.warn("Failed to parse days string:", days);
      }
    }
    // If it's a comma-separated string, return as-is
    return days;
  } else {
    console.warn("Unexpected type for days:", days);
    return "N/A";
  }
};

// Helper function to format time
const formatTime = (start, end) => {
  const format = (timeStr) => {
    if (typeof timeStr !== "string") return "N/A";
    const parts = timeStr.split(":");
    if (parts.length < 2) return "N/A";
    const [hour, minute] = parts;
    const date = new Date();
    date.setHours(parseInt(hour, 10), parseInt(minute, 10));
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  return `${format(start)} - ${format(end)}`;
};

const EnrolledSubjects = ({ groupedEnrollments, prospectus_id }) => {
  // Extract enrolledSubjects for CurriculumTracker
  const enrolledSubjects = groupedEnrollments.flatMap(
    ([_, enrollments]) => enrollments,
  );

  console.log("enrolledSubjects: ", enrolledSubjects)

  return (
    <div className="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-boxdark dark:!text-white">
      <section>
        <h2 className="mb-4 border-b pb-2 text-2xl font-semibold">
          Enrolled Subjects
        </h2>

        {/* Add Curriculum Tracker */}
        <div className="w-full flex justify-end mb-6">
          <CurriculumTracker
            prospectus_id={prospectus_id}
            enrolledSubjects={enrolledSubjects}
          />
        </div>

        <Accordion type="single" collapsible>
          {groupedEnrollments.map(([semesterKey, enrollments]) => (
            <AccordionItem key={semesterKey} value={semesterKey}>
              <AccordionTrigger>{semesterKey}</AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject Code</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Final Grade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollments.map((enrollment) => (
                      <TableRow key={enrollment.student_class_enrollment_id}>
                        <TableCell>
                          {enrollment.classDetails?.subjectCode || "N/A"}
                        </TableCell>
                        <TableCell>
                          {enrollment.classDetails?.unit || "N/A"}
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell>Taken</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline">More Details</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white xl:max-w-[70em]">
                              <DialogHeader>
                                <DialogTitle>
                                  Enrolled Subject Details
                                </DialogTitle>
                                <DialogDescription className="sr-only">
                                  <span className="inline-block font-bold text-red-700">
                                    *
                                  </span>{" "}
                                  These are the subjects that have been taken
                                  of:
                                </DialogDescription>
                              </DialogHeader>
                              <div>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Subject Code</TableHead>
                                      <TableHead>Subject Description</TableHead>
                                      <TableHead>Days</TableHead>
                                      <TableHead>Time</TableHead>
                                      <TableHead>Room</TableHead>
                                      <TableHead>Instructor</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell>
                                        {enrollment.classDetails?.subjectCode ||
                                          "N/A"}
                                      </TableCell>
                                      <TableCell>
                                        {enrollment.classDetails
                                          ?.subjectDescription || "N/A"}
                                      </TableCell>
                                      <TableCell>
                                        {formatDays(
                                          enrollment.classDetails?.schedule
                                            ?.day,
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {formatTime(
                                          enrollment.classDetails?.schedule
                                            ?.start,
                                          enrollment.classDetails?.schedule
                                            ?.end,
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {enrollment.classDetails?.room
                                          ?.room_number || "N/A"}
                                      </TableCell>
                                      <TableCell>
                                        {enrollment.classDetails
                                          ?.instructorFullName || "N/A"}
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
};

export default EnrolledSubjects;
