import { Route, Routes, useLocation } from "react-router-dom";

import PageTitle from "../../components/PageTitle";
import SignIn from "../Authentication/SignIn";
import SignUp from "../Authentication/SignUp";
import Calendar from "../Calendar";
import Chart from "../Chart";
import ECommerce from "../Dashboard/ECommerce";
import FormElements from "../Form/FormElements";
import FormLayout from "../Form/FormLayout";
import Profile from "../Profile";
import Settings from "../Settings";
import Tables from "../Tables";
import Alerts from "../UiElements/Alerts";
import Buttons from "../UiElements/Buttons";
import PageNotFound from "../PageNotFound";
import LoginForm from "../LoginForm";
import { useEffect, useState } from "react";
import React from "react";

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 250);
  }, []);

  return loading ? (
    <>
      <main className=" h-screen grid place-content-center">
        <h1 className=" font-bold text-4xl">Loading...</h1>
      </main>
    </>
  ) : (
    <Routes>
      <Route
        index
        element={
          <>
            <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
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
      <Route
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
      />
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

      <Route
        path="/gwapoko"
        element={
          <>
            <PageTitle title="Testing | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <LoginForm />
          </>
        }
      />
    </Routes>
  );
}

export default AdminDashboard;
