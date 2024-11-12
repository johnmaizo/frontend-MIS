import { Route, Routes, Navigate } from "react-router-dom";
import PageTitle from "../../components/Essentials/PageTitle";
import Settings from "../Sundoganan/Settings";
import Chart from "../Sundoganan/Chart";
import Alerts from "../Sundoganan/UiElements/Alerts";
import Buttons from "../Sundoganan/UiElements/Buttons";
import Calendar from "../Sundoganan/Calendar";
import Profile from "../Sundoganan/Profile";
import FormElements from "../Sundoganan/Form/FormElements";
import FormLayout from "../Sundoganan/Form/FormLayout";

import AdminHome from "./SubPages/AdminHome";
// import AddStudentPage from "./SubPages/AddStudentPage";
// import StudentTablePage from "./SubPages/StudentTablePage";
// import ViewStudentPage from "./SubPages/ViewStudentPage";

import DepartmentPage from "./SubPages/DepartmentPage";
import CampusPage from "./SubPages/CampusPage";
import SemesterPage from "./SubPages/SemesterPage";
import ProgramPage from "./SubPages/ProgramPage";
import CoursePage from "./SubPages/CoursePage";

import { useContext } from "react";
import { AuthContext } from "../../components/context/AuthContext";
import AccountPage from "./SubPages/AccountPage";
import { HasRole } from "../../components/reuseable/HasRole";
import BuildingStructurePage from "./SubPages/BuildingStructurePage";
import FloorPage from "./SubPages/FloorPage";
import RoomPage from "./SubPages/RoomPage";
import ViewEnrollmentApplicantPage from "./SubPages/ViewEnrollmentApplicantPage";
import StudentsPage from "./SubPages/StudentsPage";
import EmployeePage from "./SubPages/EmployeePage";
import ClassPage from "./SubPages/ClassPage";
import ProspectusPage from "./SubPages/ProspectusPage";
import ViewProspectusPage from "./SubPages/ViewProspectusPage";
import ViewProspectusSubjectPage from "./SubPages/ViewProspectusSubjectPage";
import EnrollStudentPage from "./SubPages/EnrollStudentPage";
import PaymentApprovalPage from "./SubPages/PaymentApprovalPage";
import UnenrolledRegistrationPage from "./SubPages/UnenrolledRegistrationPage";
import SubjectEnlistmentPage from "./SubPages/SubjectEnlistmentPage";
import ViewStudentDetailsPage from "./SubPages/ViewStudentDetailsPage";
import UpdateStudentInfoPage from "./SubPages/UpdateStudentInfoPage";
import OnlinePendingApplicantPage from "./SubPages/OnlinePendingApplicantPage";

const AdminRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <PageTitle title="Dashboard - MIS Benedicto College" />
            <AdminHome />
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
        path="/subjects/prospectus"
        element={
          <>
            <PageTitle title="Prospectus - MIS Benedicto College" />
            <ProspectusPage />
          </>
        }
      />

      <Route
        path="/subjects/prospectus-subjects/campus/:programCampusId/:programCampusName/program/:programCode/:program_id"
        element={
          <>
            <PageTitle title="View Prospectus - MIS Benedicto College" />
            <ViewProspectusPage />
          </>
        }
      />

      <Route
        path="/subjects/prospectus-subjects/campus/:prospectusCampusId/:prospectusCampusName/program/:prospectusProgramCode/prospectus/:prospectus_id"
        element={
          <>
            <PageTitle title="Assign Subjects to Program Prospectus - MIS Benedicto College" />
            <ViewProspectusSubjectPage />
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
        path="/enrollments/enroll-student"
        element={
          <>
            <PageTitle title="Enrollment Student - MIS Benedicto College" />
            <EnrollStudentPage />
          </>
        }
      />

      <Route
        path="/all-students"
        element={
          <>
            <PageTitle title="All Students - MIS Benedicto College" />
            <StudentsPage />
          </>
        }
      />

      <Route
        path="/all-students/view-student/:view_student_id/:view_campus_id"
        element={
          <>
            <PageTitle title="View Student Details - MIS Benedicto College" />
            <ViewStudentDetailsPage />
          </>
        }
      />

      <Route
        path="/all-students/update-student/:update_student_id/:update_campus_id"
        element={
          <>
            <PageTitle title="Update Student Details - MIS Benedicto College" />
            <UpdateStudentInfoPage />
          </>
        }
      />

      <Route
        path="/class-list"
        element={
          <>
            <PageTitle title="Class List - MIS Benedicto College" />
            <ClassPage />
          </>
        }
      />

      <Route
        path="/enrollments/unenrolled-registrations"
        element={
          <>
            <PageTitle title="Unenrolled Registration - MIS Benedicto College" />
            <UnenrolledRegistrationPage />
          </>
        }
      />

      <Route
        path="/enrollments/subject-enlistment/:student_personal_id"
        element={
          <>
            <PageTitle title="Unenrolled Registration - MIS Benedicto College" />
            <SubjectEnlistmentPage />
          </>
        }
      />

      <Route
        path="/enrollments/online-applicants"
        element={
          <>
            <PageTitle title="Online Applicants - MIS Benedicto College" />
            <OnlinePendingApplicantPage />
          </>
        }
      />

      <Route
        path="/enrollments/online-applicants/applicant/:applicantId"
        element={
          <>
            <PageTitle title="View Enrollment Application - MIS Benedicto College" />
            <ViewEnrollmentApplicantPage />
          </>
        }
      />

      <Route
        path="/payment-approvals"
        element={
          <>
            <PageTitle title="Payment Approvals - MIS Benedicto College" />
            <PaymentApprovalPage />
          </>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />

      {/* ! Mga way labot */}

      {/* <OtherRoutes /> */}
    </Routes>
  );
};

// eslint-disable-next-line no-unused-vars
const OtherRoutes = () => {
  return (
    <>
      {/* ! Mga way labot */}

      <Route
        path="/admin/calendar"
        element={
          <>
            <PageTitle title="Calendar - MIS Benedicto College" />
            <Calendar />
          </>
        }
      />

      <Route
        path="/admin/profile"
        element={
          <>
            <PageTitle title="Profile - MIS Benedicto College" />
            <Profile />
          </>
        }
      />

      <Route
        path="/settings"
        element={
          <>
            <PageTitle title="Settings - MIS Benedicto College" />
            <Settings />
          </>
        }
      />

      <Route
        path="/chart"
        element={
          <>
            <PageTitle title="Basic Chart - MIS Benedicto College" />
            <Chart />
          </>
        }
      />

      <Route
        path="/ui/alerts"
        element={
          <>
            <PageTitle title="Alerts - MIS Benedicto College" />
            <Alerts />
          </>
        }
      />

      <Route
        path="/ui/buttons"
        element={
          <>
            <PageTitle title="Buttons - MIS Benedicto College" />
            <Buttons />
          </>
        }
      />

      <Route
        path="/forms/form-elements"
        element={
          <>
            <PageTitle title="Form Elements - MIS Benedicto College" />
            <FormElements />
          </>
        }
      />

      <Route
        path="/forms/form-layout"
        element={
          <>
            <PageTitle title="Form Layout - MIS Benedicto College" />
            <FormLayout />
          </>
        }
      />
    </>
  );
};

export default AdminRoutes;
