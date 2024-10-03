import { Route, Routes, Navigate } from "react-router-dom";
import PageTitle from "../../components/Essentials/PageTitle";
import AdminHome from "../Admin/SubPages/AdminHome";
// import AddStudentPage from "../Admin/SubPages/AddStudentPage";
// import StudentTablePage from "../Admin/SubPages/StudentTablePage";
// import ViewStudentPage from "../Admin/SubPages/ViewStudentPage";

import DepartmentPage from "../Admin/SubPages/DepartmentPage";
import CampusPage from "../Admin/SubPages/CampusPage";
import SemesterPage from "../Admin/SubPages/SemesterPage";
import ProgramPage from "../Admin/SubPages/ProgramPage";
import CoursePage from "../Admin/SubPages/CoursePage";

import { useContext } from "react";
import { AuthContext } from "../../components/context/AuthContext";
import AccountPage from "../Admin/SubPages/AccountPage";
import ProgramCoursesPage from "../Admin/SubPages/ProgramCoursesPage";
import ViewProgramCoursePage from "../Admin/SubPages/ViewProgramCoursePage";
import { HasRole } from "../../components/reuseable/HasRole";
import BuildingStructurePage from "../Admin/SubPages/BuildingStructurePage";
import FloorPage from "../Admin/SubPages/FloorPage";
import RoomPage from "../Admin/SubPages/RoomPage";
import EnrollmentApplicationPage from "../Admin/SubPages/EnrollmentApplicationPage";
import ViewEnrollmentApplicantPage from "../Admin/SubPages/ViewEnrollmentApplicantPage";
import OfficialEnrolledPage from "../Admin/SubPages/OfficalEnrolledPage";
import EmployeePage from "../Admin/SubPages/EmployeePage";
import EmployeeHomePage from "./SubPages/EmployeeHomePage";

const EmployeeRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <PageTitle title="Dashboard - MIS Benedicto College" />
            {/* <AdminHome /> */}
            <EmployeeHomePage />
          </>
        }
      />

      {/* <Route
        path="/students/add-student"
        element={
          <>
            <PageTitle title="Add Student - MIS Benedicto College" />
            <AddStudentPage />
          </>
        }
      />

      <Route
        path="/students/student-list"
        element={
          <>
            <PageTitle title="Student List - MIS Benedicto College" />
            <StudentTablePage />
          </>
        }
      />

      <Route
        path="/students/student-list/:id"
        element={
          <>
            <PageTitle title="Student Information - MIS Benedicto College" />
            <ViewStudentPage />
          </>
        }
      /> */}

      {HasRole(user.allRoles, "SuperAdmin") && (
        <>
          <Route
            path="/campus"
            element={
              <>
                <PageTitle title="Campuses - MIS Benedicto College" />
                <CampusPage />
              </>
            }
          />
        </>
      )}

      {(HasRole(user.allRoles, "SuperAdmin") ||
        HasRole(user.allRoles, "Admin") ||
        HasRole(user.allRoles, "MIS")) && (
        <Route
          path="/employees"
          element={
            <>
              <PageTitle title="Employees - MIS Benedicto College" />
              <EmployeePage />
            </>
          }
        />
      )}

      {HasRole(user.allRoles, "DataCenter") && (
        <Route
          path="/employees/accounts"
          element={
            <>
              <PageTitle title="Accounts - MIS Benedicto College" />
              <AccountPage />
            </>
          }
        />
      )}

      {HasRole(user.allRoles, "MIS") && (
        <>
          <Route
            path="/semester"
            element={
              <>
                <PageTitle title="Semester - MIS Benedicto College" />
                <SemesterPage />
              </>
            }
          />

          <Route
            path="/departments"
            element={
              <>
                <PageTitle title="Departments - MIS Benedicto College" />
                <DepartmentPage />
              </>
            }
          />

          <Route
            path="/programs"
            element={
              <>
                <PageTitle title="Programs - MIS Benedicto College" />
                <ProgramPage />
              </>
            }
          />

          <Route
            path="/subjects/subject-list"
            element={
              <>
                <PageTitle title="Subjects - MIS Benedicto College" />
                <CoursePage />
              </>
            }
          />

          <Route
            path="/subjects/program-subjects"
            element={
              <>
                <PageTitle title="Assign Subjects to Program - MIS Benedicto College" />
                <ProgramCoursesPage />
              </>
            }
          />

          <Route
            path="/subjects/program-subjects/campus/:programCampusId/:programCampusName/program/:programCode/:program_id"
            element={
              <>
                <PageTitle title="Assign Subjects to Program - MIS Benedicto College" />
                <ViewProgramCoursePage />
              </>
            }
          />

          <Route
            path="/structure-management/buildings"
            element={
              <>
                <PageTitle title="Structure Management - MIS Benedicto College" />
                <BuildingStructurePage />
              </>
            }
          />
        </>
      )}

      {HasRole(user.allRoles, "SuperAdmin") ||
        (HasRole(user.allRoles, "MIS") && (
          <>
            <Route
              path={
                HasRole(user.allRoles, "SuperAdmin")
                  ? "/structure-management/:campusId/buildings/:buildingName/floors"
                  : "/structure-management/buildings/:buildingName/floors"
              }
              element={
                <>
                  <PageTitle title="Floors - MIS Benedicto College" />
                  <FloorPage />
                </>
              }
            />

            <Route
              path={
                HasRole(user.allRoles, "SuperAdmin")
                  ? "/structure-management/:campusId/buildings/:buildingName/floors/:floorName/rooms"
                  : "/structure-management/buildings/:buildingName/floors/:floorName/rooms"
              }
              element={
                <>
                  <PageTitle title="Rooms - MIS Benedicto College" />
                  <RoomPage />
                </>
              }
            />
          </>
        ))}

      {HasRole(user.allRoles, "Registrar") && (
        <>
          <Route
            path="/enrollments/enrollment-application"
            element={
              <>
                <PageTitle title="Enrollment Application - MIS Benedicto College" />
                <EnrollmentApplicationPage />
              </>
            }
          />

          <Route
            path="/enrollments/enrollment-application/applicant/:applicantId"
            element={
              <>
                <PageTitle title="View Enrollment Application - MIS Benedicto College" />
                <ViewEnrollmentApplicantPage />
              </>
            }
          />

          <Route
            path="/enrollments/official-enrolled"
            element={
              <>
                <PageTitle title="Official Enrolled - MIS Benedicto College" />
                <OfficialEnrolledPage />
              </>
            }
          />
        </>
      )}

      <Route path="*" element={<Navigate to="/" />} />

      {/* ! Mga way labot */}
    </Routes>
  );
};

export default EmployeeRoutes;
