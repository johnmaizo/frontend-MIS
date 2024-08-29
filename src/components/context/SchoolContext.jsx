/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useState, useContext, useEffect } from "react";

const SchoolContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
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
  const [deparmentsActive, setDepartmentsActive] = useState([]);
  const [deparmentsDeleted, setDepartmentsDeleted] = useState([]);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/departments");

      const modifiedDepartments = response.data.map((department) => ({
        ...department,
        departmentNameAndCampus: `${department.departmentName} - ${department.campus.campusName}`,
      }));


      setDepartments(modifiedDepartments);
      // setDepartments(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to fetch departments");
      }
    }
    setLoading(false);
  };

  const fetchDepartmentsActive = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/departments/active");
      setDepartmentsActive(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch Department active: (${err})`);
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

  // ! Semester START
  const [semesters, setSemesters] = useState([]);
  const [semestersDeleted, setSemestersDeleted] = useState([]);

  const fetchSemesters = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/semesters");
      setSemesters(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to fetch semesters");
      }
    }
    setLoading(false);
  };

  const fetchSemestersDeleted = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/semesters/deleted");
      setSemestersDeleted(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch Semesters deleted: (${err})`);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

  useEffect(() => {
    fetchSemestersDeleted();
  }, []);
  // ! Semester END

  // ! Program START
  const [program, setProgram] = useState([]);
  const [programDeleted, setProgramDeleted] = useState([]);
  const [programActive, setProgramActive] = useState([]);

  const fetchProgram = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/programs");

      const modifiedprogram = response.data.map((program) => ({
        ...program,
        fullProgramNameWithCampus: `${program.programCode} - ${program.programName} - ${program.department.campus.campusName}`,
      }));

      // setProgram(response.data);
      setProgram(modifiedprogram);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch program: (${err})`);
      }
    }
    setLoading(false);
  };

  const fetchProgramDeleted = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/programs/deleted");
      setProgramDeleted(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch program deleted: (${err})`);
      }
    }
    setLoading(false);
  };

  const fetchProgramActive = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/programs/active");
      setProgramActive(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch program active: (${err})`);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProgramDeleted();
  }, []);

  // ! Program END

  // ! Subject START
  const [subjects, setSubjects] = useState([]);
  const [subjectsActive, setSubjectsActive] = useState([]);
  const [subjectsDeleted, setSubjectsDeleted] = useState([]);

  const fetchSubject = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/subjects");

      // const modifiedSubject = response.data.map((subject) => ({
      //   ...subject,
      //   fullprogramNameWithCampus: `${subject.programCode} - ${subject.programName} - ${subject.Campus}`,
      // }));

      // setSubjects(modifiedSubject);
      setSubjects(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch Subjects: (${err})`);
      }
    }
    setLoading(false);
  };

  const fetchSubjectActive = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/subjects/active");
      setSubjectsActive(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch Subjects Active: (${err})`);
      }
    }
    setLoading(false);
  };

  const fetchSubjectDeleted = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/subjects/deleted");
      setSubjectsDeleted(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch Subjects Deleted: (${err})`);
      }
    }
    setLoading(false);
  };

  // useEffect(() => {
  //   fetchSubjectDeleted();
  // }, []);
  // ! Subject END

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
        deparmentsActive,
        fetchDepartmentsActive,

        // ! Campus
        campus,
        fetchCampus,
        campusDeleted,
        fetchCampusDeleted,
        campusActive,
        fetchCampusActive,

        // ! Semester
        semesters,
        fetchSemesters,
        semestersDeleted,
        fetchSemestersDeleted,

        // ! programs
        program,
        fetchProgram,
        programDeleted,
        fetchProgramDeleted,
        programActive,
        fetchProgramActive,

        // ! Subjects
        subjects,
        fetchSubject,
        subjectsDeleted,
        fetchSubjectDeleted,
        subjectsActive,
        fetchSubjectActive,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};
