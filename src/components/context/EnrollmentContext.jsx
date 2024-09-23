/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { HasRole } from "../reuseable/HasRole";

import axiosExternal from "../../axios/axiosExternal";
import axios from "axios";

const EnrollmentContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useEnrollment = () => {
  return useContext(EnrollmentContext);
};

export const EnrollmentProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [error, setError] = useState(null);

  // ! Enrollment START
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  const [enrollmentApplicants, setBuildings] = useState([]);

  const fetchEnrollmentApplicants = async () => {
    setLoadingApplicants(true);
    setError("");

    try {
      // Define params conditionally
      const params = user.campusName
        ? { filter: `campus=${user.campusName}` }
        : {}; // If campusName doesn't exist, send empty params or other fallback

      // Make the API request with the external Axios instance
      const response = await axiosExternal.get(
        "/api/stdntbasicinfoapplication",
        { params },
      );

      setBuildings(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch enrollment applications: ${err}`);
      }
    }

    setLoadingApplicants(false);
  };

  // ! Enrollment END

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
        setError(`Failed to fetch enrollment applications: ${err}`);
      }
    }
    setLoadingOfficalEnrolled(false);
  };
  // ! Offically Enrolled END

  return (
    <EnrollmentContext.Provider
      value={{
        error,

        enrollmentApplicants,
        fetchEnrollmentApplicants,
        loadingApplicants,

        officalEnrolled,
        fetchOfficialEnrolled,
        loadingOfficalEnrolled,
      }}
    >
      {children}
    </EnrollmentContext.Provider>
  );
};
