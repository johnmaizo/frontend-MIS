/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { createContext, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { HasRole } from "../reuseable/HasRole";

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
    setError("");
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
    setError("");
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
    setError("");
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
    setError("");
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
    setError("");
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
    setError("");
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
    setError("");
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
    setError("");
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
    setError("");
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
    setError("");
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
    setError("");
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
    setError("");
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
    setError("");
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
    setError("");
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
    setError("");
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

  const fetchCourseActive = async (program_id = null, programCode = null) => {
    setError("");
    setLoading(true);
    try {
      const response = await axios.get("/course/active", {
        params: {
          campus_id: user.campus_id,
          program_id: program_id,
          programCode: programCode,
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

  const [loadingProgramCourse, setLoadingProgramCourse] = useState(false);
  const [programCourse, setProgramCourse] = useState([]);
  const [programCourseDeleted, setProgramCourseDeleted] = useState([]);
  const [programCourseActive, setProgramCourseActive] = useState([]);

  const fetchProgramCourse = async (
    campusId,
    campusName,
    programId,
    programCode,
  ) => {
    setProgramCourse([]);
    setError("");
    setLoadingProgramCourse(true);
    try {
      const response = await axios.get("/program-courses/", {
        params: {
          campus_id: user.campus_id ? user.campus_id : campusId,
          campusName: campusName,
          program_id: programId,
          programCode: programCode,
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
    setLoadingProgramCourse(false);
  };

  const fetchProgramCourseDeleted = async (
    campusId,
    campusName,
    programId,
    programCode,
  ) => {
    setError("");
    setLoadingProgramCourse(true);
    try {
      const response = await axios.get("/program-courses/deleted", {
        params: {
          campus_id: user.campus_id ? user.campus_id : campusId,
          campusName: campusName,
          program_id: programId,
          programCode: programCode,
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
    setLoadingProgramCourse(false);
  };

  const fetchProgramCourseActive = async (
    campusId,
    campusName,
    programId,
    programCode,
  ) => {
    setError("");
    setLoadingProgramCourse(true);
    try {
      const response = await axios.get("/program-courses/active", {
        params: {
          campus_id: user.campus_id ? user.campus_id : campusId,
          campusName: campusName,
          program_id: programId,
          programCode: programCode,
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
    setLoadingProgramCourse(false);
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
    setError("");
    setLoadingBuildings(true);
    try {
      const response = await axios.get("/building-structure", {
        params: {
          campus_id: user.campus_id,
          filterBuilding: "true",
        },
      });

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
    setError("");
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
    setError("");
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
  const [floors, setFloors] = useState([]);
  const [floorsActive, setFloorsActive] = useState([]);
  const [floorsDeleted, setFloorsDeleted] = useState([]);

  const fetchFloors = async (buildingName, floorName, campusId) => {
    setError("");
    setLoadingBuildings(true);
    try {
      const response = await axios.get("/building-structure", {
        params: {
          campus_id: HasRole(user.role, "SuperAdmin")
            ? campusId
            : user.campus_id,
          filterFloor: "true",
          buildingName: buildingName,
          floorName: floorName,
        },
      });

      setFloors(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to fetch floors");
      }
    }
    setLoadingBuildings(false);
  };

  /**
   * Fetches the active floors based on the provided building name and campus ID
   * @param {string} buildingName The name of the building to fetch the active floors for
   * @param {number} campusId The id of the campus to fetch the active floors for
   * @returns {Promise<void>}
   */
  const fetchFloorsActive = async (buildingName, campusId) => {
    setError("");
    setLoadingBuildingsActive(true);
    try {
      const response = await axios.get("/building-structure/active", {
        params: {
          campus_id: HasRole(user.role, "SuperAdmin")
            ? campusId
            : user.campus_id,
          filterFloor: "true",
          buildingName: buildingName,
        },
      });
      setFloorsActive(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch Floor active: (${err})`);
      }
    }
    setLoadingBuildingsActive(false);
  };

  const fetchFloorsDeleted = async (buildingName, campusId) => {
    setError("");
    setLoadingBuildingsDeleted(true);
    try {
      const response = await axios.get("/building-structure/deleted", {
        params: {
          campus_id: HasRole(user.role, "SuperAdmin")
            ? campusId
            : user.campus_id,
          filterFloor: "true",
          buildingName: buildingName,
        },
      });
      setFloorsDeleted(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch Floor deleted: (${err})`);
      }
    }
    setLoadingBuildingsDeleted(false);
  };
  // ! Floors END

  // ! Rooms START
  const [rooms, setRooms] = useState([]);
  const [roomsActive, setRoomsActive] = useState([]);
  const [roomsDeleted, setRoomsDeleted] = useState([]);
  const [loadingRoomsActive, setLoadingRoomsActive] = useState(false);

  const fetchRooms = async (buildingName, floorName, campusId) => {
    setError("");
    setLoadingBuildings(true);
    try {
      const response = await axios.get("/building-structure", {
        params: {
          campus_id: HasRole(user.role, "SuperAdmin")
            ? campusId
            : user.campus_id,
          filterRoom: "true",
          buildingName: buildingName,
          floorName: floorName,
        },
      });

      setRooms(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to fetch rooms");
      }
    }
    setLoadingBuildings(false);
  };

  const fetchRoomsActive = async (campusId) => {
    setError("");
    setLoadingRoomsActive(true);
    try {
      const response = await axios.get("/building-structure/active", {
        params: {
          campus_id: HasRole(user.role, "SuperAdmin")
            ? campusId
            : user.campus_id,
          filterRoom: "true",
        },
      });
      setRoomsActive(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch active rooms: (${err})`);
      }
    }
    setLoadingRoomsActive(false);
  };

  const fetchRoomsDeleted = async (buildingName, floorName, campusId) => {
    setError("");
    setLoadingBuildingsDeleted(true);
    try {
      const response = await axios.get("/building-structure/deleted", {
        params: {
          campus_id: HasRole(user.role, "SuperAdmin")
            ? campusId
            : user.campus_id,
          filterRoom: "true",
          buildingName: buildingName,
          floorName: floorName,
        },
      });
      setRoomsDeleted(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch Room deleted: (${err})`);
      }
    }
    setLoadingBuildingsDeleted(false);
  };
  // ! Floors END

  // ! Employee START
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [employeesActive, setEmployeesActive] = useState([]);
  const [employeesDeleted, setEmployeesDeleted] = useState([]);

  const fetchEmployees = async () => {
    setError("");
    setEmployeeLoading(true);
    try {
      // Fetch departments based on the user's campus
      const response = await axios.get("/employee", {
        params: {
          campus_id: user.campus_id,
        },
      });

      setEmployees(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to fetch employee");
      }
    }
    setEmployeeLoading(false);
  };

  const fetchEmployeesActive = async (role = null, ascend = null) => {
    setError("");
    setEmployeeLoading(true);
    try {
      const params = role
        ? { campus_id: user.campus_id, role: role }
        : { campus_id: user.campus_id };

      const response = await axios.get("/employee/active", { params });

      // Check if ascend is true, and sort the employees by (A-Z)
      const sortedEmployees = ascend
        ? response.data.sort((a, b) =>
            a.departmentCodeForClass.localeCompare(b.departmentCodeForClass),
          )
        : response.data;

      setEmployeesActive(sortedEmployees);

      // setEmployeesActive(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch Employee active: (${err})`);
      }
    }
    setEmployeeLoading(false);
  };

  const fetchEmployeesActiveForRoles = async () => {
    setError("");
    setEmployeeLoading(true);
    try {
      const response = await axios.get("/employee/active", {
        params: {
          campus_id: user.campus_id,
          role: null,
          forAccounts: true,
        },
      });
      setEmployeesActive(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch Employee active: (${err})`);
      }
    }
    setEmployeeLoading(false);
  };

  const fetchEmployeesDeleted = async () => {
    setError("");
    setEmployeeLoading(true);
    try {
      const response = await axios.get("/employee/deleted", {
        params: {
          campus_id: user.campus_id,
        },
      });
      setEmployeesDeleted(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch Employee deleted: (${err})`);
      }
    }
    setEmployeeLoading(false);
  };

  // ! Employee END

  // ! Class START
  const [loadingClass, setLoadingClass] = useState(false);
  const [classes, setClasses] = useState([]);
  const [classDeleted, setClassDeleted] = useState([]);
  const [classActive, setClassActive] = useState([]);

  const fetchClass = async (schoolYear = null, semesterId = null) => {
    setError("");
    setLoadingClass(true);
    try {
      const response = await axios.get("/class/active", {
        params: {
          campus_id: HasRole(user.role, "SuperAdmin") ? null : user.campus_id,
          schoolYear: schoolYear,
          semester_id: semesterId,
        },
      });

      console.log(response.data)
      
      setClasses(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to fetch classes");
      }
    }
    setLoadingClass(false);
  };

  const fetchClassDeleted = async () => {
    setError("");
    setLoadingClass(true);
    try {
      const response = await axios.get("/class/deleted", {
        params: {
          campus_id: user.campus_id,
        },
      });
      setClassDeleted(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch Class deleted: (${err})`);
      }
    }
    setLoadingClass(false);
  };

  const fetchClassActive = async (program_id) => {
    setError("");
    setLoadingClass(true);
    try {
      const response = await axios.get("/class/active", {
        params: {
          campus_id: user.campus_id,
          program_id: program_id,
        },
      });
      setClassActive(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch Class active: (${err})`);
      }
    }
    setLoadingClass(false);
  };
  // ! Class END

  // ! Prospectus START
  const [loadingProspectus, setLoadingProspectus] = useState(false);
  const [prospectus, setProspectus] = useState([]);

  const fetchProspectus = async (
    campusId,
    campusName,
    programId,
    programCode,
  ) => {
    setProspectus([]);
    setError("");
    setLoadingProspectus(true);
    try {
      const response = await axios.get("/prospectus/get-all-prospectus/", {
        params: {
          campus_id: user.campus_id ? user.campus_id : campusId,
          campusName: campusName,
          program_id: programId,
          programCode: programCode,
        },
      });
      setProspectus(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch Prospectus: (${err})`);
      }
    }
    setLoadingProspectus(false);
  };

  // ! Prospectus END

  // ! Prospectus Subjects START
  const [loadingProspectusSubjects, setLoadingProspectusSubjects] =
    useState(false);
  const [prospectusSubjects, setProspectusSubjects] = useState([]);

  const fetchProspectusSubjects = async (
    campusId,
    campusName,
    programCode,
    prospectusId,
  ) => {
    setProspectusSubjects([]);
    setError("");
    setLoadingProspectusSubjects(true);
    try {
      const response = await axios.get(
        "/prospectus/get-all-prospectus-subjects/",
        {
          params: {
            campus_id: user.campus_id ? user.campus_id : campusId,
            campusName: campusName,
            prospectus_id: prospectusId,
            programCode: programCode,
          },
        },
      );
      setProspectusSubjects(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch Prospectus: (${err})`);
      }
    }
    setLoadingProspectusSubjects(false);
  };

  // ! Prospectus Subjects END

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
        loadingProgramCourse,
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
        floors,
        fetchFloors,
        floorsDeleted,
        fetchFloorsDeleted,
        floorsActive,
        fetchFloorsActive,

        // ! Rooms
        rooms,
        fetchRooms,
        roomsDeleted,
        fetchRoomsDeleted,
        roomsActive,
        fetchRoomsActive,
        loadingRoomsActive,

        // ! Employee
        employees,
        employeeLoading,
        fetchEmployees,
        employeesDeleted,
        fetchEmployeesDeleted,
        employeesActive,
        fetchEmployeesActive,
        fetchEmployeesActiveForRoles,

        // ! Classes
        classes,
        loadingClass,
        fetchClass,
        classDeleted,
        fetchClassDeleted,
        classActive,
        fetchClassActive,

        // ! Prospectus
        prospectus,
        loadingProspectus,
        fetchProspectus,

        // ! Prospectus Subjects
        prospectusSubjects,
        loadingProspectusSubjects,
        fetchProspectusSubjects,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};
