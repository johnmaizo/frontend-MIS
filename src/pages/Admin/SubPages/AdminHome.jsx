import ChartOne from "../../../components/Sundoganan/Charts/ChartOne";
// import ChartThree from "../../../components/reuseable/PieChartDpartment";
import ChartTwo from "../../../components/Sundoganan/Charts/ChartTwo";
import ChatCard from "../../../components/Sundoganan/Chat/ChatCard";
import DefaultLayout from "../../layout/DefaultLayout";

import CardDataStudent from "../../../components/Essentials/CardDataStudent";
import CardDataDepartment from "../../../components/Essentials/CardDataDepartment";
import CardDataCampus from "../../../components/Essentials/CardDataCampus";
import CardDataPrograms from "../../../components/Essentials/CardDataPrograms";
import CardDataCourse from "../../../components/Essentials/CardDataCourse";

// import { ComboboxDemo } from "./ComboboxDemo";

import { useContext } from "react";
import { AuthContext } from "../../../components/context/AuthContext";
import { HasRole } from "../../../components/reuseable/HasRole";
import CardDataOfficialStudent from "../../../components/Essentials/CardDataOfficialStudent";
import PieChartDepartment from "../../../components/Essentials/PieChartDpartment";
import MultipleSelector from "../../../components/ui/multiple-selector";

const AdminHome = () => {
  const { user } = useContext(AuthContext);

  return (
    <DefaultLayout>
      {user && user.campusName && (
        <div className="mb-8">
          <h2 className="text-[2rem] mt-5 md:mt-0 font-bold text-black dark:text-white">
            {user.campusName}
          </h2>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xsm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5 2xl:gap-4">
        {/* <CardDataStudent /> */}
        <CardDataOfficialStudent />
        {HasRole(user.role, "SuperAdmin") && <CardDataCampus />}
        <CardDataDepartment />
        <CardDataPrograms />
        <CardDataCourse />
      </div>

      <div className="mt-8">{/* <UserTables /> */}</div>

      {(HasRole(user.role, "SuperAdmin") || HasRole(user.role, "Admin")) && (
        // <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
          {/* <ChartOne /> */}
          {/* <ChartThree /> */}
          <PieChartDepartment />
          {/* <ChartTwo /> */}

          {/* <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div> */}
          {/* <ChatCard /> */}
        </div>
      )}

      {/* <div className="mt-8 h-[50em]">
        <ComboboxDemo />
      </div> */}

      <div className="mt-6 h-screen rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        
      </div>
    </DefaultLayout>
  );
};

export default AdminHome;
