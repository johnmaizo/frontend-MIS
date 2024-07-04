import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const UserTables = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useMemo(
    () => async () => {
      try {
        const response = await axios.get("/accounts");
        setUsers(response.data);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to fetch users");
        }
      }
      setLoading(false);
    },
    [],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          All Users from Database
        </h4>
        <div className="rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="px-4 py-4 pl-7 font-medium text-black dark:text-white">
                    ID
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Title
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Name
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Email
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Role
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Date Created
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Verified?
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
                ) : users.length > 0 ? (
                  <>
                    {users.map((user, index) => (
                      <tr
                        key={index}
                        className="divide-stroke dark:divide-strokedark"
                      >
                        <td className="px-8 py-2 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {user.id}
                          </p>
                        </td>
                        <td className="px-4 py-2 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {user.title}
                          </p>
                        </td>
                        <td className="px-4 py-2 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {user.firstName} {user.lastName}
                          </p>
                        </td>
                        <td className="px-4 py-2 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {user.email}
                          </p>
                        </td>
                        <td className="px-4 py-2 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {user.role}
                          </p>
                        </td>
                        <td className="px-4 py-2 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {new Date(user.created).toDateString()} -{" "}
                            {new Date(user.created).toLocaleTimeString()}
                          </p>
                        </td>
                        <td className="px-4 py-2 dark:border-strokedark">
                          <p
                            className={`inline-flex rounded text-white px-3 py-1 text-sm font-medium ${
                              user.isVerified
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {user.isVerified ? "Yes" : "No"}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr className="h-[5.5em]">
                    <td>
                      <p className="absolute left-[50%] top-[0.4em] inline-flex translate-x-[-50%] items-center gap-2 py-5 text-2xl font-[500]">
                        No users found
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserTables;
