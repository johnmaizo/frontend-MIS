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

  const fetchOfficialEnrolled = async () => {
    setError("");
    setLoadingOfficalEnrolled(true);
    try {
      // Define params conditionally
      const params = user.campusName ? { campusName: user.campusName } : {}; // If campusName doesn't exist, send empty params or other fallback

      const response = await axios.get("/enrollment", { params });

      setOfficialEnrolled(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch offical enrolled: ${err}`);
      }
    }
    setLoadingOfficalEnrolled(false);
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

  const fetchPendingStudents = async (view) => {
    setError("");
    setLoadingPendingStudents(true);
    try {
      let params = {};

      if (view === "existing-students") {
        // Fetch existing students not enrolled in the new semester
        params = {
          campus_id: user.campus_id,
          existing_students: true,
        };
      } else if (view === "new-students") {
        // Fetch new unenrolled students
        params = {
          campus_id: user.campus_id,
          new_unenrolled_students: true,
        };
      }

      const response = await axios.get("/students/get-unenrolled-students", {
        params,
      });
      setPendingStudents(response.data);
    } catch (err) {
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
