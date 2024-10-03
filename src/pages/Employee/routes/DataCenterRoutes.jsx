import { Route, Routes, Navigate } from "react-router-dom";
import PageTitle from "../../../components/Essentials/PageTitle";

import { useContext } from "react";
import { AuthContext } from "../../../components/context/AuthContext";
import AccountPage from "../../Admin/SubPages/AccountPage";
import { HasRole } from "../../../components/reuseable/HasRole";
import EmployeeHomePage from "../SubPages/EmployeeHomePage";

const DataCenterRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <PageTitle title="Dashboard - MIS Benedicto College" />
            <EmployeeHomePage />
          </>
        }
      />

      {(HasRole(user.role, "SuperAdmin") ||
        HasRole(user.role, "Admin") ||
        HasRole(user.role, "DataCenter")) && (
        <Route
          path="/employees/accounts"
          element={
            <>
              <PageTitle title="Accounts - MIS Benedicto College" />
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
