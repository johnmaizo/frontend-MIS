// pages/ViewCLassDetailsPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import DefaultLayout from "../../layout/DefaultLayout";
import { BreadcrumbResponsive } from "../../../components/reuseable/Breadcrumbs";
import { HasRole } from "../../../components/reuseable/HasRole";
import { AuthContext } from "../../../components/context/AuthContext";

const ViewCLassDetailsPage = () => {
  const { classID } = useParams();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch class data
    axios
      .get(`/class/${classID}`)
      .then((response) => {
        setClassData(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching class data:", error);
        setError("Failed to fetch class data.");
        setLoading(false);
      });
  }, [classID]);

  const { user } = useContext(AuthContext);

  const NavItems = [
    { to: "/", label: "Dashboard" },
    { to: "/class-list", label: "Class List" },
    {
      label: "Class Details",
    },
  ];

  return (
    <DefaultLayout>
      <BreadcrumbResponsive
        pageName={
          !HasRole(user.role, "SuperAdmin")
            ? `Class Details (${user?.campusName})`
            : "Class Details"
        }
        items={NavItems}
        ITEMS_TO_DISPLAY={3}
      />

      <div className="mx-auto max-w-6xl p-4">
        {/* Loading State */}
        {loading && (
          <div className="flex h-screen items-center justify-center">
            <div className="text-xl">Loading...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex h-screen items-center justify-center">
            <div className="text-xl text-red-500">{error}</div>
          </div>
        )}

        {/* No Data State */}
        {!loading && !error && !classData && (
          <div className="flex h-screen items-center justify-center">
            <div className="text-gray-500 text-xl">No data found.</div>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && classData && (
          <>
            {/* Class Information */}
            <div className="my-5 rounded-lg border border-stroke bg-white p-4 px-6 dark:border-strokedark dark:bg-boxdark">
              <h3 className="mb-4 text-2xl font-semibold">Class Details</h3>
              <div className="flex justify-between">
                {/* Left Side */}
                <div>
                  <p>
                    <strong>Subject Code:</strong> {classData.subject_code}
                  </p>
                  <p>
                    <strong>Subject Description:</strong> {classData.subject}
                  </p>
                  <p>
                    <strong>Schedule:</strong> {classData.schedule}
                  </p>
                </div>
                {/* Right Side */}
                <div>
                  <p>
                    <strong>Teacher:</strong> {classData.teacher}
                  </p>
                  <p>
                    <strong>Total Students:</strong> {classData.totalStudents}
                  </p>
                  <p>
                    <strong>Room:</strong> {classData.room}
                  </p>
                </div>
              </div>
            </div>
            {/* Students Table */}
            <div className="my-5 rounded-lg border border-stroke bg-white p-4 px-6 dark:border-strokedark dark:bg-boxdark">
              <h3 className="mb-4 text-2xl font-semibold">Enrolled Students</h3>
              <table className="divide-gray-200 min-w-full divide-y">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Program
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Year Level
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-gray-200 divide-y">
                  {classData.students.map((student, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap px-6 py-4">
                        {student.student_id}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {student.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {student.gender}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {student.program}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {student.yearLevel}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </DefaultLayout>
  );
};

export default ViewCLassDetailsPage;
