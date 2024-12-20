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
  const [yearLevel, setYearLevel] = useState("");

  const [semesterInfo, setSemesterInfo] = useState({
    schoolYear: "",
    semesterName: "",
  });

  const [semesterID, setSemesterID] = useState("");

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
      setSemesterID(semesterId);
      setYearLevel(academicBackgroundResponse.data.yearLevel);

      // Fetch enlisted classes for the student and semester
      const response = await axios.get(
        `/enrollment/student-enrolled-classes/${studentPersonalId}/${semesterId}?status=enlisted`,
      );

      console.log(response.data);

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
          <DialogDescription className="mt-2">
            <p className="mb-2">
              Below are the enlisted subjects for <strong>{fullName}</strong>:
            </p>
            {officialStudentId && (
              <p className="mb-2">
                Official Student ID: <strong>{officialStudentId}</strong>
              </p>
            )}
            {yearLevel && (
              <p className="mb-2">
                Year Level: <strong>{yearLevel}</strong>
              </p>
            )}
            {semesterInfo.schoolYear && semesterInfo.semesterName && (
              <p className="mb-4">
                Semester: <strong>{semesterInfo.semesterName}</strong>, School
                Year: <strong>{semesterInfo.schoolYear}</strong>
              </p>
            )}
          </DialogDescription>
          <>
            <div className="overflow-x-auto overflow-y-auto h-[20em]">
              <table className="border-gray-200 min-w-full border-collapse border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border-gray-200 border px-4 py-2 text-left">
                      Subject Code
                    </th>
                    <th className="border-gray-200 border px-4 py-2 text-left">
                      Subject Description
                    </th>
                    <th className="border-gray-200 border px-4 py-2 text-left">
                      Units
                    </th>
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
                        <tr key={index} className={"bg-white text-black dark:bg-boxdark dark:text-white"}>
                          <td className="border-gray-200 border px-4 py-2">
                            {subject.subjectCode}
                          </td>
                          <td className="border-gray-200 border px-4 py-2">
                            {subject.subjectDescription}
                          </td>
                          <td className="border-gray-200 border px-4 py-2">
                            {subject.unit}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td
                          colSpan="2"
                          className="border-gray-200 border px-4 py-2 font-bold"
                        >
                          Total Units
                        </td>
                        <td className="border-gray-200 border px-4 py-2 font-bold">
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
        </DialogHeader>
        <DialogFooter>
          <div className="mx-[2em] flex w-full justify-center gap-[6em]">
            <ButtonActionPayment
              entityType={"enrollment"}
              entityId={studentPersonalId}
              action="accept"
              loadingOutisde={loadingSubjects}
              onSuccess={() => {
                fetchEnrollmentStatus("approvals", semesterID);
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
