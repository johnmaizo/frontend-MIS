import { Suspense, useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import PageTitle from "./components/Essentials/PageTitle";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import HomePage from "./pages/HomePage";

import { AuthContext } from "./components/context/AuthContext";
import SessionExpired from "./pages/Authentication/SessionExpired";
import Loader from "./components/styles/Loader";
import AdminRoutes from "./pages/Admin/AdminRoutes";
import StudentRoutes from "./pages/Student/StudentRoutes";
import { Toaster } from "react-hot-toast";
import IsLoggingOut from "./pages/Authentication/IsLoggingOut";

function App() {
  const { sessionExpired, user, isLoggingOut } = useContext(AuthContext);

  return (
    <>
      {sessionExpired && <SessionExpired />}
      {isLoggingOut && <IsLoggingOut/>}
      <Toaster />

      <Suspense fallback={<Loader />}>
        {user === null && <DefaultRoutes />}

        {user?.role === "Admin" && <AdminRoutes />}
        {user?.role === "User" && <StudentRoutes />}
      </Suspense>
    </>
  );
}

const DefaultRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <PageTitle title="Benedicto College" />
            <HomePage />
          </>
        }
      />

      <Route
        path="/auth/signin"
        element={
          <>
            <PageTitle title="Signin | MIS - Benedicto College" />
            <SignIn />
          </>
        }
      />
      <Route
        path="/auth/signup"
        element={
          <>
            <PageTitle title="Signup | MIS - Benedicto College" />
            <SignUp />
          </>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
