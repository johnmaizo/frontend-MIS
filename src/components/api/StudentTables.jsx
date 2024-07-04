import { useEffect, useState } from "react";
import axios from "axios";
import { DeleteIcon, DownloadIcon, EyeIcon } from "../Icons";


const StudentTables = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/students");

        setStudents(response.data);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to fetch students");
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="mb-4 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3>Lorem, ipsum.</h3>
      </div>
      <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto border border-stroke dark:border-strokedark">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="px-4 py-4 pl-7 font-medium text-black dark:text-white">
                  Student ID
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Name
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Gender
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Civil Status
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Date Created
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Status
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody
              className={`relative divide-y divide-stroke dark:divide-strokedark ${error || loading ? "h-[5.5em]" : ""}`}
            >
              {loading || error ? (
                <tr className="h-[5.5em]">
                  <td>
                    {loading ? (
                      <p className="absolute left-[50%] top-[0.4em] inline-flex translate-x-[-50%] items-center gap-2 py-5 text-2xl font-[500]">
                        <span className="h-5 w-5 animate-spin rounded-full border-4 border-solid border-[#3b82f6] border-t-transparent"></span>
                        Loading...
                      </p>
                    ) : (
                      error && (
                        <p className="absolute left-[50%] top-[0.4em] translate-x-[-50%] py-5 text-2xl font-[500] text-red-500">
                          Error: {error}
                        </p>
                      )
                    )}
                  </td>
                </tr>
              ) : students.length > 0 ? (
                <>
                  {students.map((student, index) => (
                    <tr
                      key={index}
                      className="divide-stroke dark:divide-strokedark"
                    >
                      <td className="px-8 py-2 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {student.student_id}
                        </p>
                      </td>
                      <td className="px-4 py-2 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {student.firstName} {student.lastName}
                        </p>
                      </td>
                      <td className="px-4 py-2 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {student.gender}
                        </p>
                      </td>
                      <td className="px-4 py-2 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {student.civilStatus}
                        </p>
                      </td>
                      <td className="px-4 py-2 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {new Date(student.createdAt).toLocaleDateString()} -{" "}
                          {new Date(student.createdAt).toLocaleTimeString()}
                        </p>
                      </td>
                      <td className="px-4 py-2 dark:border-strokedark">
                        <p
                          className={`inline-flex rounded px-3 py-1 text-sm font-medium text-white ${
                            student.isActive ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {student.isActive ? "Active" : "Inactive"}
                        </p>
                      </td>

                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <div className="flex items-center space-x-3.5">
                          <button
                            className="hover:text-primary"
                            aria-label="View Student"
                          >
                            <EyeIcon />
                          </button>
                          <button className="hover:text-primary">
                            <DeleteIcon />
                          </button>
                          <button className="hover:text-primary">
                            <DownloadIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr className="h-[5.5em]">
                  <td>
                    <p className="absolute left-[50%] top-[0.4em] inline-flex translate-x-[-50%] items-center gap-2 py-5 text-2xl font-[500]">
                      No students found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default StudentTables;