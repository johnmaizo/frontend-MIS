import { Suspense, useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import PageTitle from "./components/Essentials/PageTitle";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";

// eslint-disable-next-line no-unused-vars
import HomePage from "./pages/HomePage";

import { AuthContext } from "./components/context/AuthContext";
import SessionExpired from "./pages/Authentication/SessionExpired";
import Loader from "./components/styles/Loader";
import AdminRoutes from "./pages/Admin/AdminRoutes";
import StudentRoutes from "./pages/Student/StudentRoutes";
import { Toaster } from "react-hot-toast";
import IsLoggingOut from "./pages/Authentication/IsLoggingOut";
import { SchoolProvider } from "./components/context/SchoolContext";
import { HasRole } from "./components/reuseable/HasRole";
import { EnrollmentProvider } from "./components/context/EnrollmentContext";

import EmployeeRoutes from "./pages/Employee/EmployeeRoutes";

function App() {
  const { sessionExpired, user, isLoggingOut } = useContext(AuthContext);

  return (
    <>
      {sessionExpired && <SessionExpired />}
      {isLoggingOut && <IsLoggingOut />}
      <Toaster containerStyle={{ zIndex: 999999 }} />

      <Suspense fallback={<Loader />}>
        {user === null && <DefaultRoutes />}

        {/* {(user?.role === "Admin" || user?.role === "SuperAdmin") && ( */}

        {/* 
        // <SchoolProvider>
                //   <EnrollmentProvider>
                        // <AdminRoutes />
                //   </EnrollmentProvider>
                // </SchoolProvider>
        
        */}
        {user && (
          <SchoolProvider>
            <EnrollmentProvider>
              {HasRole(user?.allRoles, "Admin") ||
              HasRole(user?.allRoles, "SuperAdmin") ? (
                <AdminRoutes />
              ) : (
                (HasRole(user?.allRoles, "MIS") ||
                  HasRole(user?.role, "DataCenter") ||
                  HasRole(user?.role, "Registrar") ||
                  HasRole(user?.role, "Dean") ||
                  HasRole(user?.role, "Accounting")) && <EmployeeRoutes />
              )}

              {/* // ) : HasRole(user?.allRoles, "MIS") ? ( // <MISRoutes />
              // ) : HasRole(user?.role, "DataCenter") ? ( //{" "}
              <DataCenterRoutes />
              // ) : HasRole(user?.role, "Registrar") ? ( // <RegistrarRoutes />
              // ) : ( // HasRole(user?.role, "Dean") && <DeanRoutes />
              // )} */}
            </EnrollmentProvider>
          </SchoolProvider>
        )}

        {/* {user?.role === "Student" && <StudentRoutes />} */}
      </Suspense>
    </>
  );
}

const DefaultRoutes = () => {
  return (
    <Routes>
      <Route
        index
        element={
          <>
            <PageTitle title="Benedicto College" />
            <Navigate to="/auth/signin" />
          </>
        }
      />

      {/* <Route
        path="/"
        element={
          <>
            <PageTitle title="Benedicto College" />
            <HomePage />
          </>
        }
      /> */}

      <Route
        path="/auth/signin"
        element={
          <>
            <PageTitle title="Signin - MIS Benedicto College" />
            <SignIn />
          </>
        }
      />

      <Route
        path="/auth/signup"
        element={
          <>
            <PageTitle title="Signup - MIS Benedicto College" />
            <SignUp />
          </>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
