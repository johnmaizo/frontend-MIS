import { useEffect, useState } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import { useParams } from "react-router-dom";
import axios from "axios";

// import Breadcrumb from "../../../components/Sundoganan/Breadcrumbs/Breadcrumb";
import { BreadcrumbResponsive } from "../../../components/reuseable/Breadcrumbs";
import InputText from "../../../components/reuseable/InputText";

import loadingProfile from "../../../assets/images/profile-user.jpg";

import { ProfileLoadingIcon } from "../../../components/Icons";

const ViewStudentPage = () => {
  const [student, setStudent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/students/${id}`);
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
        <h3>Student Details</h3>
      </div>

      {!loading && student && !student.isActive && (
        <div className="mb-4 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-2xl font-semibold text-red-600">
            NOTE: This Student is Inactive.
          </p>
        </div>
      )}

      <div className="font-small mb-4 rounded-sm border border-stroke bg-white p-4 py-10 text-[1.3rem] text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:text-white">
        <div
          className={`flex flex-col items-center gap-6 xl:flex-row xl:items-start ${loading ? "animate-pulse" : ""}`}
        >
          <div className="">
            <div
              className={` ${loading ? "grid place-content-center" : ""} h-[10em] w-[10em] rounded-full border bg-white dark:bg-boxdark`}
            >
              {loading ? (
                <ProfileLoadingIcon />
              ) : (
                <img
                  src={loadingProfile}
                  alt="Anonymous Profile"
                  className="rounded-full"
                />
              )}
            </div>
          </div>
          <div className="w-full space-y-6 xl:w-3/4">
            {/* First Row */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/3">
                <label className="mb-2.5 block text-black dark:text-white">
                  First Name
                </label>
                <InputText value={student.firstName} disabled={true} />
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-2.5 block text-black dark:text-white">
                  Middle Name
                </label>
                <InputText value={student.middleName} disabled={true} />
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-2.5 block text-black dark:text-white">
                  Last Name
                </label>
                <InputText value={student.lastName} disabled={true} />
              </div>
            </div>
            {/* Second Row */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/3">
                <label className="mb-2.5 block text-black dark:text-white">
                  Gender
                </label>
                <InputText value={student.gender} disabled={true} />
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-2.5 block text-black dark:text-white">
                  Civil Status
                </label>
                <InputText value={student.civilStatus} disabled={true} />
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-2.5 block text-black dark:text-white">
                  Birthdate
                </label>
                <InputText value={student.birthDate} disabled={true} />
              </div>
            </div>
            {/* Third Row */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/3">
                <label className="mb-2.5 block text-black dark:text-white">
                  Email
                </label>
                <InputText value={student.email} disabled={true} />
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-2.5 block text-black dark:text-white">
                  Contact Number
                </label>
                <InputText value={student.contactNumber} disabled={true} />
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-2.5 block text-black dark:text-white">
                  Religion
                </label>
                <InputText value={student.religion} disabled={true} />
              </div>
            </div>
            {/* Fourth Row */}
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Birthplace
              </label>
              <InputText value={student.birthPlace} disabled={true} />
            </div>
            {/* Fifth Row */}
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Citizenship
              </label>
              <InputText value={student.citizenship} disabled={true} />
            </div>
            {/* Last Row */}
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Country
              </label>
              <InputText value={student.country} disabled={true} />
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ViewStudentPage;
