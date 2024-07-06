import { useEffect, useState } from "react";
import DefaultLayout from "../../layout/DefaultLayout";

import { useParams } from "react-router-dom";
import axios from "axios";

// import Breadcrumb from "../../../components/Sundoganan/Breadcrumbs/Breadcrumb";
import { BreadcrumbResponsive } from "../../../components/reuseable/Breadcrumbs";
import InputText from "../../../components/reuseable/InputText";

import loadingProfile from "../../../assets/images/profile-user.jpg";
import { PersonStanding } from "lucide-react";

const ViewStudentPage = () => {
  const [student, setStudent] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/students/${id}`);
        console.log(response.data);
        setStudent(response.data);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to fetch student");
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const NavItems = [
    { to: "/", label: "Dashboard" },
    { to: "/students/student-list", label: "Student List" },
    {
      label: `${loading ? "Loading..." : error ? "Error" : student.student_id}`,
    },
  ];

  return (
    <DefaultLayout>
      <BreadcrumbResponsive
        pageName={"View Student"}
        items={NavItems}
        ITEMS_TO_DISPLAY={3}
      />

      <div className="mb-4 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3>Lorem, ipsum dolor.</h3>
      </div>

      <div className="mb-4 rounded-sm border border-stroke bg-white p-4 text-[1.3rem] font-medium text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:text-white">
        <div className="mb-4.5 flex flex-col justify-center gap-6 lg:justify-between xl:flex-row">
          <div className="mx-auto animate-pulse lg:mx-0">
            <div className="h-[10em] w-[10em] rounded-full border bg-white dark:bg-boxdark">
              {loading ? <PersonStanding /> : <img src={loadingProfile} alt="Loading" className=" rounded-full" />}
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                First name
              </label>
              <InputText value={student.firstName} disabled={true} />
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ViewStudentPage;
