import { Route, Routes, Navigate } from "react-router-dom";
import PageTitle from "../../../components/Essentials/PageTitle";
import DepartmentPage from "../../Admin/SubPages/DepartmentPage";
import CampusPage from "../../Admin/SubPages/CampusPage";
import SemesterPage from "../../Admin/SubPages/SemesterPage";
import ProgramPage from "../../Admin/SubPages/ProgramPage";
import CoursePage from "../../Admin/SubPages/CoursePage";


import { useContext } from "react";
import { AuthContext } from "../../../components/context/AuthContext";
import ProgramCoursesPage from "../../Admin/SubPages/ProgramCoursesPage";
import ViewProgramCoursePage from "../../Admin/SubPages/ViewProgramCoursePage";
import { HasRole } from "../../../components/reuseable/HasRole";
import BuildingStructurePage from "../../Admin/SubPages/BuildingStructurePage";
import FloorPage from "../../Admin/SubPages/FloorPage";
import RoomPage from "../../Admin/SubPages/RoomPage";
import EnrollmentApplicationPage from "../../Admin/SubPages/EnrollmentApplicationPage";
import ViewEnrollmentApplicantPage from "../../Admin/SubPages/ViewEnrollmentApplicantPage";
import OfficialEnrolledPage from "../../Admin/SubPages/OfficalEnrolledPage";
import EmployeeHomePage from "../SubPages/EmployeeHomePage";

const RegistrarRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <PageTitle title="Dashboard - MIS Benedicto College" />
            <EmployeeHomePage />
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

      {/* ! Mga way labot */}

      {/* <OtherRoutes /> */}
    </Routes>
  );
};

export default RegistrarRoutes;
