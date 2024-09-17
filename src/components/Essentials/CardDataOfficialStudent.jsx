import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { PersonIcon } from "../Icons";
import { AuthContext } from "../context/AuthContext";

/* eslint-disable react/prop-types */
const CardDataOfficialStudent = () => {
  const { user } = useContext(AuthContext);

  const [totalStudents, setTotalStudents] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const title = "Total Student";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = user.campusName ? { campusName: user.campusName } : {}; // If campusName doesn't exist, send empty
        const currentResponse = await axios.get("/enrollment/count", {
          params,
        });
        const total = currentResponse.data;
        setTotalStudents(total);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to fetch department");
        }
      }
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        <PersonIcon />
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4
            className={`text-title-md font-bold text-black dark:text-white ${error ? "text-red-500" : ""}`}
          >
            {loading ? "Loading..." : error ? "Error" : totalStudents}
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
