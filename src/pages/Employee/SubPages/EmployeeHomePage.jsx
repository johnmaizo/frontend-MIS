import DefaultLayout from "../../layout/DefaultLayout";

import HamsterProfile from "../../../assets/images/profile-maizo.jpg";
import VonsProfile from "../../../assets/images/profile-vons.jpg";
import ThomasProfile from "../../../assets/images/thomas.jfif";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../components/context/AuthContext";

const EmployeeHomePage = () => {
  const [profile, setProfile] = useState(HamsterProfile);

  useEffect(() => {
    const profileChange = setTimeout(() => {
      setProfile(
        profile === HamsterProfile
          ? VonsProfile
          : profile === VonsProfile
            ? ThomasProfile
            : HamsterProfile,
      );
    }, 1500);
    return () => clearInterval(profileChange);
  }, [profile]);

  const { user } = useContext(AuthContext);

  return (
    <DefaultLayout>
      <>
        <h3 className="mb-5 mt-2 text-[1.1rem] text-xl font-bold text-black dark:text-white">
          Welcome {user?.name}!
        </h3>

        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-xl font-bold">
            {user?.role === "DataCenter" ? "Data Center" : user?.role} Home Page
          </h3>
        </div>

        <div className="mt-6 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque, rem
          quisquam! Recusandae non dignissimos quibusdam cupiditate sit adipisci
          aspernatur in, aliquid, amet sint autem nam accusamus itaque nesciunt
          ipsum. Perferendis.
        </div>

        <div className="mt-6 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">



        </div>

        <div className="mt-6 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">


          
        </div>
      </>
    </DefaultLayout>
  );
};

export default EmployeeHomePage;
