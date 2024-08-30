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
import AddStudentPage from "./SubPages/AddStudentPage";
import StudentTablePage from "./SubPages/StudentTablePage";
import ViewStudentPage from "./SubPages/ViewStudentPage";

import DepartmentPage from "./SubPages/DepartmentPage";
import CampusPage from "./SubPages/CampusPage";
import SubjectPage from "./SubPages/SubjectPage";
import SemesterPage from "./SubPages/SemesterPage";
import ProgramPage from "./SubPages/ProgramPage";
import CoursePage from "./SubPages/CoursePage";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <PageTitle title="Dashboard | MIS - Benedicto College" />
            <AdminHome />
          </>
        }
      />

      <Route
        path="/students/add-student"
        element={
          <>
            <PageTitle title="Add Student | MIS - Benedicto College" />
            <AddStudentPage />
          </>
        }
      />

      <Route
        path="/students/student-list"
        element={
          <>
            <PageTitle title="Student List | MIS - Benedicto College" />
            <StudentTablePage />
          </>
        }
      />

      <Route
        path="/students/student-list/:id"
        element={
          <>
            <PageTitle title="Student Information | MIS - Benedicto College" />
            <ViewStudentPage />
          </>
        }
      />

      {/* <Route
          path="/teachers/add-teacher"
          element={
            <>
              <PageTitle title="Add Teacher | MIS - Benedicto College" />
              <AddTeacherPage />
            </>
          }
        />

        <Route
          path="/teachers/teacher-list"
          element={
            <>
              <PageTitle title="Teacher List | MIS - Benedicto College" />
              <TeacherTablePage />
            </>
          }
        /> */}

      <Route
        path="/semester"
        element={
          <>
            <PageTitle title="Semester | MIS - Benedicto College" />
            <SemesterPage />
          </>
        }
      />

      <Route
        path="/campus"
        element={
          <>
            <PageTitle title="Campuses | MIS - Benedicto College" />
            <CampusPage />
          </>
        }
      />

      <Route
        path="/departments"
        element={
          <>
            <PageTitle title="Departments | MIS - Benedicto College" />
            <DepartmentPage />
          </>
        }
      />

      <Route
        path="/programs"
        element={
          <>
            <PageTitle title="Programs | MIS - Benedicto College" />
            <ProgramPage />
          </>
        }
      />

      <Route
        path="/courses/course-list"
        element={
          <>
            <PageTitle title="Courses | MIS - Benedicto College" />
            <CoursePage />
          </>
        }
      />

      <Route
        path="/subjectss"
        element={
          <>
            <PageTitle title="Subjects | MIS - Benedicto College" />
            <SubjectPage />
          </>
        }
      />

      <Route
        path="/teachers"
        element={
          <>
            <PageTitle title="Teachers | MIS - Benedicto College" />
            <DepartmentPage />
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
            <PageTitle title="Calendar | MIS - Benedicto College" />
            <Calendar />
          </>
        }
      />

      <Route
        path="/admin/profile"
        element={
          <>
            <PageTitle title="Profile | MIS - Benedicto College" />
            <Profile />
          </>
        }
      />

      <Route
        path="/settings"
        element={
          <>
            <PageTitle title="Settings | MIS - Benedicto College" />
            <Settings />
          </>
        }
      />

      <Route
        path="/chart"
        element={
          <>
            <PageTitle title="Basic Chart | MIS - Benedicto College" />
            <Chart />
          </>
        }
      />

      <Route
        path="/ui/alerts"
        element={
          <>
            <PageTitle title="Alerts | MIS - Benedicto College" />
            <Alerts />
          </>
        }
      />

      <Route
        path="/ui/buttons"
        element={
          <>
            <PageTitle title="Buttons | MIS - Benedicto College" />
            <Buttons />
          </>
        }
      />

      <Route
        path="/forms/form-elements"
        element={
          <>
            <PageTitle title="Form Elements | MIS - Benedicto College" />
            <FormElements />
          </>
        }
      />

      <Route
        path="/forms/form-layout"
        element={
          <>
            <PageTitle title="Form Layout | MIS - Benedicto College" />
            <FormLayout />
          </>
        }
      />
    </>
  );
};

export default AdminRoutes;
