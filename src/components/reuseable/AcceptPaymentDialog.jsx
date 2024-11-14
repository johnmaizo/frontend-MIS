/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import ButtonActionPayment from "./ButtonActionPayment";
import axios from "axios";

const AcceptPaymentDialog = ({
  studentPersonalId,
  fullName,
  fetchEnrollmentStatus,
}) => {
  const [open, setOpen] = useState(false);
  const [enlistedSubjects, setEnlistedSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [error, setError] = useState("");
  const [officialStudentId, setOfficialStudentId] = useState("");
  const [semesterInfo, setSemesterInfo] = useState({
    schoolYear: "",
    semesterName: "",
  });

  useEffect(() => {
    if (open) {
      fetchEnlistedSubjects();
      fetchOfficialStudentId();
    }
  }, [open]);

  const fetchEnlistedSubjects = async () => {
    setLoadingSubjects(true);
    setError("");
    try {
      // Fetch student's current academic background to get semester_id
      const academicBackgroundResponse = await axios.get(
        `/enrollment/student-academic-background/${studentPersonalId}`,
      );
      const semesterId = academicBackgroundResponse.data.semester_id;

      // Fetch enlisted classes for the student and semester
      const response = await axios.get(
        `/enrollment/student-enrolled-classes/${studentPersonalId}/${semesterId}?status=enlisted`,
      );
      setEnlistedSubjects(response.data);

      // Set semester info from the first class (assuming all classes are in the same semester)
      if (response.data.length > 0) {
        const { schoolYear, semesterName } = response.data[0];
        setSemesterInfo({ schoolYear, semesterName });
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Failed to fetch enlisted subjects",
      );
    }
    setLoadingSubjects(false);
  };

  const fetchOfficialStudentId = async () => {
    try {
      const response = await axios.get(
        `/students/official/${studentPersonalId}`,
      );
      if (response.data && response.data.student_id) {
        setOfficialStudentId(response.data.student_id);
      } else {
        setOfficialStudentId("Not yet officially enrolled");
      }
    } catch (err) {
      setOfficialStudentId("Not yet officially enrolled");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="rounded-md !bg-green-600 p-2 !text-white">
        Accept Payment
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-sm border border-stroke bg-white p-6 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Accept Payment
          </DialogTitle>
          <DialogDescription asChild className="mt-2">
            <>
              <p className="mb-2">
                Below are the enlisted subjects for <strong>{fullName}</strong>:
              </p>
              {officialStudentId && (
                <p className="mb-2">
                  Official Student ID: <strong>{officialStudentId}</strong>
                </p>
              )}
              {semesterInfo.schoolYear && semesterInfo.semesterName && (
                <p className="mb-4">
                  Semester: <strong>{semesterInfo.semesterName}</strong>, School
                  Year: <strong>{semesterInfo.schoolYear}</strong>
                </p>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 border border-gray-200 text-left">Subject Code</th>
                      <th className="px-4 py-2 border border-gray-200 text-left">
                        Subject Description
                      </th>
                      <th className="px-4 py-2 border border-gray-200 text-left">Units</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-boxdark">
                    {loadingSubjects ? (
                      <tr>
                        <td colSpan="3" className="px-4 py-4 text-center">
                          Loading subjects...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td
                          colSpan="3"
                          className="px-4 py-4 text-center text-red-500"
                        >
                          {error}
                        </td>
                      </tr>
                    ) : enlistedSubjects.length > 0 ? (
                      <>
                        {enlistedSubjects.map((subject, index) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                            <td className="px-4 py-2 border border-gray-200">{subject.subjectCode}</td>
                            <td className="px-4 py-2 border border-gray-200">
                              {subject.subjectDescription}
                            </td>
                            <td className="px-4 py-2 border border-gray-200">{subject.unit}</td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan="2" className="px-4 py-2 border border-gray-200 font-bold">
                            Total Units
                          </td>
                          <td className="px-4 py-2 border border-gray-200 font-bold">
                            {enlistedSubjects.reduce(
                              (total, subject) => total + subject.unit,
                              0,
                            )}
                          </td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td colSpan="3" className="px-4 py-4 text-center">
                          No enlisted subjects found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="mx-[2em] flex w-full justify-center gap-[6em]">
            <ButtonActionPayment
              entityType={"enrollment"}
              entityId={studentPersonalId}
              action="accept"
              loadingOutisde={loadingSubjects}
              onSuccess={() => {
                fetchEnrollmentStatus("approvals");
                setOpen(false); // Close the dialog after success
              }}
            >
              Accept Payment
            </ButtonActionPayment>

            <DialogClose asChild>
              <Button
                variant="ghost"
                className="w-full underline-offset-4 hover:underline"
              >
                Cancel
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AcceptPaymentDialog;
