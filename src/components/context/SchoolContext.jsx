/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { createContext, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

const SchoolContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSchool = () => {
  return useContext(SchoolContext);
};

export const SchoolProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  // ! Students START
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

  // useEffect(() => {
  //   fetchStudents();
  // }, []);

  // ! Students END

  // ! Accounts START
  const [accounts, setAccounts] = useState([]);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/accounts", {
        params: {
          campus_id: user.campus_id,
        },
      });
      setAccounts(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch accounts: ${err}`);
      }
    }
    setLoading(false);
  };
  // ! Accounts END

  // ! Departments START
  const [departments, setDepartments] = useState([]);
  const [deparmentsActive, setDepartmentsActive] = useState([]);
  const [deparmentsDeleted, setDepartmentsDeleted] = useState([]);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      // Fetch departments based on the user's campus
      const response = await axios.get("/departments", {
        params: {
          campus_id: user.campus_id,
        },
      });

      const modifiedDepartments = response.data.map((department) => ({
        ...department,
        departmentNameAndCampus: `${department.departmentName} - ${department.campus.campusName}`,
      }));

      setDepartments(modifiedDepartments);
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
      const response = await axios.get("/departments/active", {
        params: {
          campus_id: user.campus_id,
        },
      });
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
      const response = await axios.get("/departments/deleted", {
        params: {
          campus_id: user.campus_id,
        },
      });
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

  // ! Campus END

  // ! Semester START
  const [semesters, setSemesters] = useState([]);
  const [semestersDeleted, setSemestersDeleted] = useState([]);

  const fetchSemesters = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/semesters", {
        params: {
          campus_id: user.campus_id,
        },
      });
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
      const response = await axios.get("/semesters/deleted", {
        params: {
          campus_id: user.campus_id,
        },
      });
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

  // ! Semester END

  // ! Program START
  const [program, setProgram] = useState([]);
  const [programDeleted, setProgramDeleted] = useState([]);
  const [programActive, setProgramActive] = useState([]);

  const fetchProgram = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/programs", {
        params: {
          campus_id: user.campus_id,
        },
      });

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
      const response = await axios.get("/programs/deleted", {
        params: {
          campus_id: user.campus_id,
        },
      });
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
      const response = await axios.get("/programs/active", {
        params: {
          campus_id: user.campus_id,
        },
      });
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
  // ! Program END

  // ! Course START
  const [course, setCourse] = useState([]);
  const [courseDeleted, setCourseDeleted] = useState([]);
  const [courseActive, setCourseActive] = useState([]);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/course", {
        params: {
          campus_id: user.campus_id,
        },
      });
      setCourse(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to fetch Course");
      }
    }
    setLoading(false);
  };

  const fetchCourseDeleted = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/course/deleted", {
        params: {
          campus_id: user.campus_id,
        },
      });
      setCourseDeleted(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch Course deleted: (${err})`);
      }
    }
    setLoading(false);
  };

  const fetchCourseActive = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/course/active", {
        params: {
          campus_id: user.campus_id,
        },
      });
      setCourseActive(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch Course active: (${err})`);
      }
    }
    setLoading(false);
  };

  // ! Course END

  // ! Program Courses START

  const [programCourse, setProgramCourse] = useState([]);
  const [programCourseDeleted, setProgramCourseDeleted] = useState([]);
  const [programCourseActive, setProgramCourseActive] = useState([]);

  const fetchProgramCourse = async (campusName, programId) => {
    setLoading(true);
    try {
      const response = await axios.get("/program-courses/", {
        params: {
          campus_id: user.campus_id,
          campusName: campusName,
          program_id: programId,
        },
      });
      setProgramCourse(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to fetch Course");
      }
    }
    setLoading(false);
  };

  const fetchProgramCourseDeleted = async (campusName, programId) => {
    setLoading(true);
    try {
      const response = await axios.get("/program-courses/deleted", {
        params: {
          campus_id: user.campus_id,
          campusName: campusName,
          program_id: programId,
        },
      });
      setProgramCourseDeleted(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch Course deleted: (${err})`);
      }
    }
    setLoading(false);
  };

  const fetchProgramCourseActive = async (campusName, programId) => {
    setLoading(true);
    try {
      const response = await axios.get("/program-courses/active", {
        params: {
          campus_id: user.campus_id,
          campusName: campusName,
          program_id: programId,
        },
      });
      setProgramCourseActive(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch Course active: (${err})`);
      }
    }
    setLoading(false);
  };
  // ! Program Course END

  // ! Buildings START
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingBuildingsActive, setLoadingBuildingsActive] = useState(false);
  const [loadingBuildingsDeleted, setLoadingBuildingsDeleted] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [buildingsActive, setBuildingsActive] = useState([]);
  const [buildingsDeleted, setBuildingsDeleted] = useState([]);

  const fetchBuildings = async () => {
    setLoadingBuildings(true);
    try {
      const response = await axios.get("/building-structure", {
        params: {
          campus_id: user.campus_id,
          filterBuilding: "true",
        },
      });

      // const modifiedBuildings = response.data.map((building) => ({
      //   ...building,
      //   departmentNameAndCampus: `${building.departmentName} - ${building.campus.campusName}`,
      // }));

      // setBuildings(modifiedBuildings);
      setBuildings(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to fetch buildings");
      }
    }
    setLoadingBuildings(false);
  };

  const fetchBuildingsActive = async () => {
    setLoadingBuildingsActive(true);
    try {
      const response = await axios.get("/building-structure/active", {
        params: {
          campus_id: user.campus_id,
          filterBuilding: "true",
        },
      });
      setBuildingsActive(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch Building active: (${err})`);
      }
    }
    setLoadingBuildingsActive(false);
  };

  const fetchBuildingsDeleted = async () => {
    setLoadingBuildingsDeleted(true);
    try {
      const response = await axios.get("/building-structure/deleted", {
        params: {
          campus_id: user.campus_id,
          filterBuilding: "true",
        },
      });
      setBuildingsDeleted(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch Building deleted: (${err})`);
      }
    }
    setLoadingBuildingsDeleted(false);
  };
  // ! Buildings END

  // ! Floors START
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [loadingFloorsActive, setLoadingFloorsActive] = useState(false);
  const [loadingFloorsDeleted, setLoadingFloorsDeleted] = useState(false);
  const [floors, setFloors] = useState([]);
  const [floorsActive, setFloorsActive] = useState([]);
  const [floorsDeleted, setFloorsDeleted] = useState([]);

  const fetchFloors = async (buildingName) => {
    setLoadingFloors(true);
    try {
      const response = await axios.get("/building-structure", {
        params: {
          campus_id: user.campus_id,
          filterFloor: "true",
          buildingName: buildingName,
        },
      });

      setFloors(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to fetch buildings");
      }
    }
    setLoadingFloors(false);
  };

  const fetchFloorsActive = async () => {
    setLoadingFloorsActive(true);
    try {
      const response = await axios.get("/building-structure/active", {
        params: {
          campus_id: user.campus_id,
          filterBuilding: "true",
        },
      });
      setFloorsActive(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch Building active: (${err})`);
      }
    }
    setLoadingFloorsActive(false);
  };

  const fetchFloorsDeleted = async () => {
    setLoadingFloorsDeleted(true);
    try {
      const response = await axios.get("/building-structure/deleted", {
        params: {
          campus_id: user.campus_id,
          filterBuilding: "true",
        },
      });
      setFloorsDeleted(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch Building deleted: (${err})`);
      }
    }
    setLoadingFloorsDeleted(false);
  };
  // ! Buildings END

  return (
    <SchoolContext.Provider
      value={{
        loading,
        error,

        // ! Accounts
        accounts,
        fetchAccounts,

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

        // ! Programs
        program,
        fetchProgram,
        programDeleted,
        fetchProgramDeleted,
        programActive,
        fetchProgramActive,

        // ! Courses
        course,
        fetchCourse,
        courseDeleted,
        fetchCourseDeleted,
        courseActive,
        fetchCourseActive,

        // ! Program Courses
        programCourse,
        fetchProgramCourse,
        programCourseDeleted,
        fetchProgramCourseDeleted,
        programCourseActive,
        fetchProgramCourseActive,

        // ! Buildings
        loadingBuildings,
        buildings,
        fetchBuildings,
        loadingBuildingsDeleted,
        buildingsDeleted,
        fetchBuildingsDeleted,
        loadingBuildingsActive,
        buildingsActive,
        fetchBuildingsActive,

        // ! Floors
        loadingFloors,
        floors,
        fetchFloors,
        loadingFloorsDeleted,
        floorsDeleted,
        fetchFloorsDeleted,
        loadingFloorsActive,
        floorsActive,
        fetchFloorsActive,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};
