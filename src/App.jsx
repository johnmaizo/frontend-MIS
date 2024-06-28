import {Suspense, useContext, useEffect} from "react";
import {Route, Routes, useLocation, Navigate} from "react-router-dom";

import PageTitle from "./components/PageTitle";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import HomePage from "./pages/HomePage";

import {AuthContext} from "./components/context/AuthContext";
import SessionExpired from "./pages/Authentication/SessionExpired";
import Loader from "./components/styles/Loader";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import StudentDashboard from "./pages/Student/StudentDashboard";

// import FormElements from "./pages/Sundoganan/Form/FormElements"
// import FormLayout from "./pages/Sundoganan/Form/FormLayout";

function App() {
  const {pathname} = useLocation();

  const {sessionExpired, user} = useContext(AuthContext);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      {sessionExpired && <SessionExpired />}
      <Suspense fallback={<Loader />}>
        {user === null && (
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <PageTitle title="Home Page oten" />
                  <HomePage />
                </>
              }
            />

            <Route
              path="/auth/signin"
              element={
                <>
                  <PageTitle title="Signin | BC - Management Information System" />
                  <SignIn />
                </>
              }
            />
            <Route
              path="/auth/signup"
              element={
                <>
                  <PageTitle title="Signup | BC - Management Information System" />
                  <SignUp />
                </>
              }
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}

        {user?.role === "Admin" && <AdminDashboard />}
        {user?.role === "User" && <StudentDashboard />}
      </Suspense>
    </>
  );
}

export default App;
