import { BreadcrumbResponsive } from "../../../components/reuseable/Breadcrumbs";
import DefaultLayout from "../../layout/DefaultLayout";

/* eslint-disable react/prop-types */

import { useContext } from "react";
import { AuthContext } from "../../../components/context/AuthContext";
import { HasRole } from "../../../components/reuseable/HasRole";
import EnrollmentFormPage from "./enrollment/EnrollmentFormPage";

const EnrollStudentPage = () => {
  const { user } = useContext(AuthContext);

  const NavItems = [
    { to: "/", label: "Dashboard" },
    {
      label: "Enrollment Application", // New breadcrumb item
    },
  ];

  return (
    <DefaultLayout>
      <BreadcrumbResponsive
        pageName={
          !HasRole(user.role, "SuperAdmin")
            ? `Enrollment Application (${user?.campusName})`
            : "Enrollment Application (All Campuses)"
        }
        items={NavItems}
        ITEMS_TO_DISPLAY={2}
      />

      <div className="my-5 rounded-sm border border-stroke bg-white p-4 px-6 dark:border-strokedark dark:bg-boxdark">
        <EnrollmentFormPage />
      </div>
    </DefaultLayout>
  );
};

export default EnrollStudentPage;
