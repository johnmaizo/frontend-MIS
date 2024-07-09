import {Navigate, Route, Routes} from "react-router-dom";
import PageTitle from "../../components/Essentials/PageTitle";
import StudentHome from "./SubPages/StudentHome";
import Profile from "../Sundoganan/Profile";
import Calendar from "../Sundoganan/Calendar";

const StudentRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <PageTitle title="Student Dashboard | MIS - Benedicto College " />
            <StudentHome />
          </>
        }
      />

      <Route
        path="/student/profile"
        element={
          <>
            <PageTitle title="Profile | MIS - Benedicto College " />
            <Profile />
          </>
        }
      />
      
      <Route
        path="/student/calendar"
        element={
          <>
            <PageTitle title="Calendar | MIS - Benedicto College " />
            <Calendar />
          </>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default StudentRoutes;
