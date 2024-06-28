import {Navigate, Route, Routes} from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import StudentHome from "./subPages/StudentHome";
import Profile from "../Sundoganan/Profile";
import Calendar from "../Sundoganan/Calendar";

const StudentDashboard = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <PageTitle title="Student Dashboard | GIATAY " />
            <StudentHome />
          </>
        }
      />

      <Route
        path="/student/profile"
        element={
          <>
            <PageTitle title="Profile | GIATAY " />
            <Profile />
          </>
        }
      />
      
      <Route
        path="/student/calendar"
        element={
          <>
            <PageTitle title="Calendar | GIATAY " />
            <Calendar />
          </>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default StudentDashboard;
