/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { HasRole } from "../reuseable/HasRole";

import axios from "axios";

const EnrollmentContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useEnrollment = () => {
  return useContext(EnrollmentContext);
};

export const EnrollmentProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [error, setError] = useState(null);

  // ! Applicants START
  const [loadingOnlineApplicants, setLoadingApplicants] = useState(false);

  const [onlineApplicants, setOnlineApplicants] = useState([]);

  const fetchOnlineApplicants = async () => {
    setError("");
    setLoadingApplicants(true);
    try {
      const params = user.campus_id ? { campus_id: user.campus_id } : {};
      const response = await axios.get("/enrollment/get-all-online-applicant", {
        params,
      });

      setOnlineApplicants(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch applications: ${err}`);
      }
    }
    setLoadingApplicants(false);
  };
  // ! Applicants END

  // ! Offically Enrolled START
  const [loadingOfficalEnrolled, setLoadingOfficalEnrolled] = useState(false);

  const [officalEnrolled, setOfficialEnrolled] = useState([]);

  const fetchOfficialEnrolled = async (semesterId, signal) => {
    setError("");
    setLoadingOfficalEnrolled(true);
    try {
      const params = {
        ...(user.campusName ? { campusName: user.campusName } : {}),
        ...(semesterId ? { semester_id: semesterId } : {}),
      };

      const response = await axios.get("/enrollment", { params, signal });

      setOfficialEnrolled(response.data);
    } catch (err) {
      if (axios.isCancel(err) || err.code === "ERR_CANCELED") {
        // Request was canceled, do not set error
        console.log("Request canceled:", err.message);
      } else if (
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch official enrolled: ${err}`);
      }
    } finally {
      setLoadingOfficalEnrolled(false);
    }
  };
  // ! Offically Enrolled END

  // ! Enrollment Status START
  const [loadingEnrollmentStatus, setLoadingEnrollmentStatus] = useState(false);
  const [enrollmentStatuses, setEnrollmentStatuses] = useState([]);

  const fetchEnrollmentStatus = async (view, selectedSemesterId) => {
    setError("");
    setLoadingEnrollmentStatus(true);
    try {
      let params = {};

      if (view === "approvals") {
        // Fetch pending approvals for both new and existing students
        params = {
          ...(user.campus_id ? { campus_id: user.campus_id } : {}),
          accounting_status: "upcoming",
          registrar_status: "accepted",
          payment_confirmed: false,
        };
      } else if (view === "history") {
        // Fetch accepted payments
        params = {
          ...(user.campus_id ? { campus_id: user.campus_id } : {}),
          accounting_status: "accepted",
          registrar_status: "accepted",
          payment_confirmed: true,
        };
      }

      // Add selected semester to params
      if (selectedSemesterId) {
        params.semester_id = selectedSemesterId;
      }

      const response = await axios.get(
        "/enrollment/get-all-enrollment-status",
        { params },
      );
      setEnrollmentStatuses(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch enrollment statuses: ${err}`);
      }
    } finally {
      setLoadingEnrollmentStatus(false);
    }
  };
  // ! Enrollment Status END

  // EnrollmentContext.js

  const [pendingStudents, setPendingStudents] = useState([]);
  const [loadingPendingStudents, setLoadingPendingStudents] = useState(false);

  const fetchPendingStudents = async (
    view,
    semesterId,
    subView = null,
    signal,
  ) => {
    setError("");
    setPendingStudents([])
    setLoadingPendingStudents(true);
    try {
      let params = {};

      if (view === "existing-students") {
        if (subView === "enlistment") {
          // Fetch students ready for enlistment
          params = {
            campus_id: user.campus_id,
            enlistment: true,
            semester_id: semesterId,
          };
        } else {
          // Fetch existing students not enrolled in the selected semester
          params = {
            campus_id: user.campus_id,
            existing_students: true,
            semester_id: semesterId,
          };
        }
      } else if (view === "new-students") {
        // Fetch new unenrolled students
        params = {
          campus_id: user.campus_id,
          new_unenrolled_students: true,
          semester_id: semesterId,
        };
      }

      const response = await axios.get("/students/get-unenrolled-students", {
        params,
        signal, // Pass the signal here
      });
      setPendingStudents(response.data);
    } catch (err) {
      if (err.name === "CanceledError") {
        // Request was canceled, do not update error state
        return;
      }
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch pending students: ${err}`);
      }
    } finally {
      setLoadingPendingStudents(false);
    }
  };

  return (
    <EnrollmentContext.Provider
      value={{
        error,

        onlineApplicants,
        fetchOnlineApplicants,
        loadingOnlineApplicants,

        officalEnrolled,
        fetchOfficialEnrolled,
        loadingOfficalEnrolled,

        enrollmentStatuses,
        fetchEnrollmentStatus,
        loadingEnrollmentStatus,

        pendingStudents,
        fetchPendingStudents,
        loadingPendingStudents,
      }}
    >
      {children}
    </EnrollmentContext.Provider>
  );
};
