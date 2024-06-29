import { useEffect, useMemo, useState } from "react";
import { fetchAllUsers } from "../../axios/services/admin/adminService";

const UserTables = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useMemo(
    () => async () => {
      try {
        const allUsers = await fetchAllUsers();
        setUsers(allUsers);
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
          {loading ? (
            <p className="py-5 text-center text-2xl font-semibold">
              Loading...
            </p>
          ) : error ? (
            <p className="py-5 text-center text-2xl font-semibold text-red-500">
              Error: {error}
            </p>
          ) : users.length > 0 ? (
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
                      Role
                    </th>
                    <th className="px-4 py-4 font-medium text-black dark:text-white">
                      Email
                    </th>
                    <th className="px-4 py-4 font-medium text-black dark:text-white">
                      Date Created
                    </th>
                    <th className="px-4 py-4 font-medium text-black dark:text-white">
                      Verified?
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={index}
                      className="divide-y-2 divide-stroke dark:divide-strokedark"
                    >
                      <td className="px-8 py-2 dark:border-strokedark">
                        <p className="text-black dark:text-white">{user.id}</p>
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
                          {user.role}
                        </p>
                      </td>
                      <td className="px-4 py-2 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {user.email}
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
                          className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${
                            user.isVerified
                              ? "bg-success text-success"
                              : "bg-danger text-danger"
                          }`}
                        >
                          {user.isVerified ? "Yes" : "No"}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>No users found</div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserTables;
