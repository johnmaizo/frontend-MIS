import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { PersonIcon } from "../Icons";
import { AuthContext } from "../context/AuthContext";
import { Skeleton } from "../ui/skeleton";

/* eslint-disable react/prop-types */
const CardDataOfficialStudent = ({ filters }) => {
  const { user } = useContext(AuthContext);

  const [totalStudents, setTotalStudents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const title = "Total Student";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null); // Reset error before fetching new data
      try {
        const params = {
          campusName: user.campusName || null,
          schoolYear: filters.schoolYear || null,
          semester_id: filters.semester_id || null,
        };

        const currentResponse = await axios.get("/enrollment/count", {
          params,
        });
        const total = currentResponse.data;
        setTotalStudents(total);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to fetch student count");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.campusName, filters]);

  if (loading) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        <div className="mt-4 space-y-2">
          <Skeleton className="h-6 w-[150px]" />
          <Skeleton className="h-4 w-[120px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        <PersonIcon />
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4
            className={`text-title-md font-bold text-black dark:text-white ${
              error ? "text-red-500" : ""
            }`}
          >
            {error ? "Error" : totalStudents}
          </h4>
          <span className="text-sm font-medium">
            {title}
            {totalStudents > 1 && "s"} Enrolled
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardDataOfficialStudent;
