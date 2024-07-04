import { Route, Routes, Navigate } from "react-router-dom";
import PageTitle from "../../components/Essentials/PageTitle";
import Tables from "../Sundoganan/Tables";
import Settings from "../Sundoganan/Settings";
import Chart from "../Sundoganan/Chart";
import Alerts from "../Sundoganan/UiElements/Alerts";
import Buttons from "../Sundoganan/UiElements/Buttons";
import Calendar from "../Sundoganan/Calendar";
import Profile from "../Sundoganan/Profile";
import AdminHome from "./subPages/AdminHome";
import FormElements from "../Sundoganan/Form/FormElements";
import FormLayout from "../Sundoganan/Form/FormLayout";

import AddStudentPage from "./subPages/AddStudentPage";
import StudentTablePage from "./subPages/StudentTablePage";

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
        path="/students/view-student"
        element={
          <>
            <PageTitle title="View Student | MIS - Benedicto College" />
            <StudentTablePage />
          </>
        }
      />











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
        path="/tables"
        element={
          <>
            <PageTitle title="Tables | MIS - Benedicto College" />
            <Tables />
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

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AdminRoutes;
