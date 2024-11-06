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

const EnrolledSubjects = ({ groupedEnrollments }) => {
  return (
    <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
      <section>
        <h2 className="mb-4 border-b pb-2 text-2xl font-semibold">
          Enrolled Subjects
        </h2>
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
                          {enrollment.class.courseinfo.courseCode}
                        </TableCell>
                        <TableCell>
                          {enrollment.class.courseinfo.unit}
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
                                        {enrollment.class.courseinfo.courseCode}
                                      </TableCell>
                                      <TableCell>
                                        {
                                          enrollment.class.courseinfo
                                            .courseDescription
                                        }
                                      </TableCell>
                                      <TableCell>
                                        {formatDays(enrollment.class.days)}
                                      </TableCell>
                                      <TableCell>
                                        {formatTime(
                                          enrollment.class.timeStart,
                                          enrollment.class.timeEnd,
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {
                                          enrollment.class.buildingstructure
                                            .roomName
                                        }
                                      </TableCell>
                                      <TableCell>
                                        {enrollment.class.employee
                                          ? `${enrollment.class.employee.firstName} ${enrollment.class.employee.lastName}`
                                          : "N/A"}
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

// Helper function to format time
const formatTime = (start, end) => {
  const format = (timeStr) => {
    const [hour, minute] = timeStr.split(":");
    const date = new Date();
    date.setHours(parseInt(hour, 10), parseInt(minute, 10));
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  return `${format(start)} - ${format(end)}`;
};

// New helper function to safely format days
const formatDays = (days) => {
  if (Array.isArray(days)) {
    return days.join(", ");
  } else if (typeof days === "string") {
    return days; // If days is a single string
  } else {
    console.warn("Unexpected type for days:", days);
    return "N/A";
  }
};

export default EnrolledSubjects;
