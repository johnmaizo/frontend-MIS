import DefaultLayout from "../../layout/DefaultLayout";

import { useContext, useState } from "react";
import { AuthContext } from "../../../components/context/AuthContext";
import { HasRole } from "../../../components/reuseable/HasRole";
import PieChartDepartment from "../../../components/Essentials/PieChartDpartment";
import BarChartEnrollmentsByDepartment from "../../../components/Essentials/statistics/BarChartEnrollmentsByDepartment";
import BarChartEnrollmentsBySubject from "../../../components/Essentials/statistics/BarChartEnrollmentsBySubject";

const EmployeeHomePage = () => {
  const { user } = useContext(AuthContext);

  const [filters, setFilters] = useState({
    schoolYear: null,
    semester_id: null,
  });

  return (
    <DefaultLayout>
      <>
        <h3 className="mb-5 mt-2 text-[1.1rem] text-xl font-bold text-black dark:text-white">
          Welcome {user?.name}!
        </h3>

        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-xl font-bold">
            {user?.allRoles === "DataCenter" ? "Data Center" : user?.allRoles}{" "}
            Home Page
          </h3>
        </div>

        {HasRole(user.allRoles, "Registrar") && (
          <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
            <PieChartDepartment />

            <BarChartEnrollmentsByDepartment filters={filters} />
            <BarChartEnrollmentsBySubject filters={filters} />
          </div>
        )}
      </>
    </DefaultLayout>
  );
};

export default EmployeeHomePage;
