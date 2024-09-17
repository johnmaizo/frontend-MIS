import { useEffect, useState } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import { useParams } from "react-router-dom";

import { BreadcrumbResponsive } from "../../../components/reuseable/Breadcrumbs";
import InputText from "../../../components/reuseable/InputText";

import loadingProfile from "../../../assets/images/profile-user.jpg";

import { ProfileLoadingIcon } from "../../../components/Icons";

import axiosExternal from "../../../axios/axiosExternal";
import AcceptEnrollment from "../../../components/api/AcceptEnrollment";

const ViewEnrollmentApplicantPage = () => {
  const [student, setStudent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { applicantId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosExternal.get(
          `api/stdntbasicinfoapplication/`,
          {
            params: {
              filter: `applicant_id=${applicantId}`,
            },
          },
        );

        setStudent(response.data[0]);
        // console.log(student);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(`Failed to fetch student: ${err}`);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [applicantId]);

  const NavItems = [
    { to: "/", label: "Dashboard" },
    {
      to: "/enrollments/enrollment-application",
      label: "Enrollment Application List",
    },
    // {
    //   label: `View Enrollment Application`,
    // },
    {
      label: `${loading ? "Loading..." : error ? "Error" : `View Enrollment Application`}`,
    },
  ];

  return (
    <DefaultLayout>
      <BreadcrumbResponsive
        pageName={"View Enrollment Application"}
        items={NavItems}
        ITEMS_TO_DISPLAY={3}
      />

      <div className="flex w-full justify-end">
        <div className="mb-4 p-4 shadow-default">
          <AcceptEnrollment applicantId={applicantId} loading={loading} />
        </div>
      </div>

      {!loading && student && !student.active && (
        <div className="mb-4 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-2xl font-semibold text-red-600">
            NOTE: This Student is Inactive.
          </p>
        </div>
      )}

      {!loading && student && student.status === "accepted" && (
        <div className="mb-4 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-2xl font-semibold text-success">
            NOTE: This Student has been Accepted. 😭😭
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
                <InputText value={student.first_name} disabled={true} />
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-2.5 block text-black dark:text-white">
                  Middle Name
                </label>
                <InputText value={student.middle_name} disabled={true} />
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-2.5 block text-black dark:text-white">
                  Last Name
                </label>
                <InputText value={student.last_name} disabled={true} />
              </div>
            </div>
            {/* Second Row */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/3">
                <label className="mb-2.5 block text-black dark:text-white">
                  Year Level
                </label>
                <InputText
                  value={student.year_level}
                  disabled={true}
                  className={"font-bold"}
                />
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-2.5 block text-black dark:text-white">
                  Program
                </label>
                <InputText
                  value={student.program}
                  disabled={true}
                  className={"font-bold"}
                />
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-2.5 block text-black dark:text-white">
                  Campus
                </label>
                <InputText
                  value={student.campus}
                  disabled={true}
                  className={"font-bold"}
                />
              </div>
            </div>
            {/* <div className="flex flex-col gap-6 xl:flex-row">
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
            </div> */}
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
                <InputText value={student.contact_number} disabled={true} />
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-2.5 block text-black dark:text-white">
                  Gender
                </label>
                <InputText value={student.sex} disabled={true} />
              </div>
            </div>
            {/* Fourth Row */}
            {/* <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Birthplace
              </label>
              <InputText value={student.birthPlace} disabled={true} />
            </div> */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/3">
                <label className="mb-2.5 block text-black dark:text-white">
                  Address
                </label>
                <InputText value={student.address} disabled={true} />
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-2.5 block text-black dark:text-white">
                  Birth Date
                </label>
                <InputText value={student.birth_date} disabled={true} />
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-2.5 block text-black dark:text-white">
                  is Transferee
                </label>
                <InputText
                  value={
                    loading
                      ? ""
                      : student?.is_transferee
                        ? "Yes 😭"
                        : !student?.is_transferee
                          ? "No 😝"
                          : ""
                  }
                  disabled={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ViewEnrollmentApplicantPage;
