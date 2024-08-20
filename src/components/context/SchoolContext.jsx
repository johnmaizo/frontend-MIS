/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useState, useContext, useEffect } from "react";

const SchoolContext = createContext();

export const useSchool = () => {
  return useContext(SchoolContext);
};

export const SchoolProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/students");
      setStudents(response.data);
      // console.log(response);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to fetch students");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ! Students END

  // ! Departments START
  const [departments, setDepartments] = useState([]);
  const [deparmentsDeleted, setDepartmentsDeleted] = useState([]);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/departments");
      setDepartments(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to fetch departments");
      }
    }
    setLoading(false);
  };

  const fetchDepartmentsDeleted = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/departments/deleted");
      setDepartmentsDeleted(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch department deleted: (${err})`);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchDepartmentsDeleted();
  }, []);
  // ! Departments END

  // ! Campus START
  const [campus, setCampus] = useState([]);
  const [campusDeleted, setCampusDeleted] = useState([]);
  const [campusActive, setCampusActive] = useState([]);

  const fetchCampus = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/campus");
      setCampus(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to fetch Campus");
      }
    }
    setLoading(false);
  };

  const fetchCampusDeleted = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/campus/deleted");
      setCampusDeleted(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch Campus deleted: (${err})`);
      }
    }
    setLoading(false);
  };

  const fetchCampusActive = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/campus/active");
      setCampusActive(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch Campus active: (${err})`);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCampus();
  }, []);

  useEffect(() => {
    fetchCampusDeleted();
  }, []);

  useEffect(() => {
    fetchCampusActive();
  }, []);
  // ! Campus END

  return (
    <SchoolContext.Provider
      value={{
        loading,
        error,

        // ! Students
        students,
        setStudents,
        fetchStudents,

        // ! Department
        departments,
        fetchDepartments,
        deparmentsDeleted,
        fetchDepartmentsDeleted,

        // ! Campus
        campus,
        fetchCampus,
        campusDeleted,
        fetchCampusDeleted,
        campusActive,
        fetchCampusActive,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};
