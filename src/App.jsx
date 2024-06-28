import { Suspense, useContext, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import PageNotFound from "./pages/PageNotFound";
import PageTitle from "./components/PageTitle";
import ECommerce from "./pages/Sundoganan/Dashboard/ECommerce";
import Calendar from "./pages/Sundoganan/Calendar";
import Profile from "./pages/Sundoganan/Profile";
import Tables from "./pages/Sundoganan/Tables";
import Settings from "./pages/Sundoganan/Settings";
import Chart from "./pages/Sundoganan/Chart";
import Alerts from "./pages/Sundoganan/UiElements/Alerts";
import Buttons from "./pages/Sundoganan/UiElements/Buttons";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
// import LoginForm from "./pages/Authentication/LoginForm";
import HomePage from "./pages/HomePage";

import { AuthContext } from "./components/context/AuthContext";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import SessionExpired from "./pages/Authentication/SessionExpired";
import Loader from "./components/styles/Loader";


// import FormElements from "./pages/Sundoganan/Form/FormElements"
// import FormLayout from "./pages/Sundoganan/Form/FormLayout";

function App() {
  const { pathname } = useLocation();

  const { sessionExpired } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
    {sessionExpired && <SessionExpired />}
      <Suspense fallback={<Loader />}>
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

          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={
                <>
                  <PageTitle title="Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <ECommerce />
                </>
              }
            />
            <Route
              path="/calendar"
              element={
                <>
                  <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Calendar />
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <>
                  <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Profile />
                </>
              }
            />












              {/* ! WALA NIY LABOT SA UBOS */}

















          </Route>

             



              
            {/* <Route
              path="/forms/form-elements"
              element={
                <>
                  <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <FormElements />
                </>
              }
            />
            <Route
              path="/forms/form-layout"
              element={
                <>
                  <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <FormLayout />
                </>
              }
            /> */}
            <Route
              path="/tables"
              element={
                <>
                  <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Tables />
                </>
              }
            />
            <Route
              path="/settings"
              element={
                <>
                  <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Settings />
                </>
              }
            />
            <Route
              path="/chart"
              element={
                <>
                  <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Chart />
                </>
              }
            />
            <Route
              path="/ui/alerts"
              element={
                <>
                  <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Alerts />
                </>
              }
            />
            <Route
              path="/ui/buttons"
              element={
                <>
                  <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Buttons />
                </>
              }
            />
            <Route
              path="/auth/signin"
              element={
                <>
                  <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <SignIn />
                </>
              }
            />
            <Route
              path="/auth/signup"
              element={
                <>
                  <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <SignUp />
                </>
              }
            />

            <Route
              path="*"
              element={
                <>
                  <PageTitle title="404 Not Found | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <PageNotFound />
                </>
              }
            />






          {/* <Route
            path="/gwapoko"
            element={
              <>
                <PageTitle title="Testing | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <LoginForm />
              </>
            }
          /> */}
        </Routes>
      </Suspense>
        

        

    </>
  );
}

export default App;
