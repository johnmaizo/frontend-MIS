import { Route, Routes, Navigate } from "react-router-dom";
import PageTitle from "../../components/Essentials/PageTitle";
import AdminHome from "../Admin/SubPages/AdminHome";

import { useContext } from "react";
import { AuthContext } from "../../components/context/AuthContext";
import AccountPage from "../Admin/SubPages/AccountPage";
import { HasRole } from "../../components/reuseable/HasRole";
import DataCenterHome from "./SubPages/DataCenterHome";

const DataCenterRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <PageTitle title="Dashboard | MIS - Benedicto College" />
            <DataCenterHome />
          </>
        }
      />

      {(HasRole(user.role, "SuperAdmin") || HasRole(user.role, "Admin") || HasRole(user.role, "DataCenter")) && (
        <Route
          path="/employees/accounts"
          element={
            <>
              <PageTitle title="Accounts | MIS - Benedicto College" />
              <AccountPage />
            </>
          }
        />
      )}

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
export default DataCenterRoutes;
