import { useEffect, useState } from "react";
import DefaultLayout from "../../layout/DefaultLayout";

import { useParams } from "react-router-dom";
import axios from "axios";

// import Breadcrumb from "../../../components/Sundoganan/Breadcrumbs/Breadcrumb";
import { BreadcrumbResponsive } from "../../../components/reuseable/Breadcrumbs";

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
        <p>First Name: {student.firstName}</p>
      </div>
    </DefaultLayout>
  );
};

export default ViewStudentPage;
