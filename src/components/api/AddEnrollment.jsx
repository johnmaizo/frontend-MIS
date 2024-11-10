/* eslint-disable react/prop-types */
import { useState, useContext, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { useEnrollment } from "../context/EnrollmentContext";
import { useSchool } from "../context/SchoolContext";
import { Link } from "react-router-dom";

const AddEnrollment = ({ student }) => {
  const [open, setOpen] = useState(false);
  const [enrollmentCreated, setEnrollmentCreated] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);
  const { fetchPendingStudents } = useEnrollment();
  const { fetchActiveSemester } = useSchool();

  const [activeSemester, setActiveSemester] = useState(null);

  useEffect(() => {
    const getActiveSemester = async () => {
      try {
        const response = await axios.get("/semesters/active", {
          params: { campus_id: user.campus_id },
        });
        if (response.data && response.data.length > 0) {
          setActiveSemester(response.data[0]);
        } else {
          toast.error("No active semester found.");
        }
      } catch (error) {
        console.error("Error fetching active semester:", error);
        toast.error("Failed to fetch active semester.");
      }
    };

    getActiveSemester();
  }, [user.campus_id]);

  const handleEnrollStudent = async () => {
    setLoading(true);
    try {
      await axios.post("/students/add-enrollment", {
        student_personal_id: student.student_personal_id,
        semester_id: activeSemester.semester_id,
      });

      toast.success("Enrollment added successfully!");
      setEnrollmentCreated(true);
      // fetchPendingStudents("existing-students"); // Refresh the list
    } catch (error) {
      console.error("Error adding enrollment:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to add enrollment. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-blue-500 hover:text-blue-700">
          Enroll
        </Button>
      </DialogTrigger>
      <DialogContent>
        {enrollmentCreated ? (
          <div>
            <h2 className="mb-4 text-xl font-semibold">Enrollment Created</h2>
            <p>
              Enrollment has been successfully created for {student.fullName}.
            </p>
            <Link
              to={`/enrollments/subject-enlistment/${student.student_personal_id}`}
              className="text-blue-500 hover:text-blue-700"
            >
              Click here to proceed to enlistment
            </Link>
            <div className="mt-4 flex justify-end">
              <Button variant="primary" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="mb-4 text-xl font-semibold">Enroll Student</h2>
            <p>
              Are you sure you want to enroll {student.fullName} into the new
              semester?
            </p>
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                className="ml-2"
                onClick={handleEnrollStudent}
                disabled={loading || !activeSemester}
              >
                {loading ? "Enrolling..." : "Enroll"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddEnrollment;
