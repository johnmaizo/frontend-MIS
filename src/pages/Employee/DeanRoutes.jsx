import { Route, Routes, Navigate } from "react-router-dom";
import PageTitle from "../../components/Essentials/PageTitle";

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
import DeanHomePage from "./SubPages/DeanHomePage";
import EmployeePage from "../Admin/SubPages/EmployeePage";

const DeanRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <PageTitle title="Dashboard - MIS Benedicto College" />
            <DeanHomePage />
          </>
        }
      />

      {HasRole(user.role, "SuperAdmin") && (
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

      {(HasRole(user.role, "SuperAdmin") || HasRole(user.role, "Admin")) && (
        <>
          <Route
            path="/employees"
            element={
              <>
                <PageTitle title="Employees - MIS Benedicto College" />
                <EmployeePage />
              </>
            }
          />

          <Route
            path="/employees/accounts"
            element={
              <>
                <PageTitle title="Accounts - MIS Benedicto College" />
                <AccountPage />
              </>
            }
          />
        </>
      )}

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

      <Route
        path={
          HasRole(user.role, "SuperAdmin")
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
          HasRole(user.role, "SuperAdmin")
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

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default DeanRoutes;
