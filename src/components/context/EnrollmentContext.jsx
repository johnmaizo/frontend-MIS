/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { HasRole } from "../reuseable/HasRole";

import axiosExternal from "../../axios/axiosExternal";

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
    try {
      const response = await axiosExternal.get(
        "/api/stdntbasicinfoapplication",
      ); // Use the external Axios instance

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

  return (
    <EnrollmentContext.Provider
      value={{
        error,

        enrollmentApplicants,
        fetchEnrollmentApplicants,
        loadingApplicants,
      }}
    >
      {children}
    </EnrollmentContext.Provider>
  );
};
