import axios from "axios";
import { useEffect, useState } from "react";
import { CourseIcon } from "../Icons";

/* eslint-disable react/prop-types */
const CardDataCourse = () => {
  const [totalStudent, setTotalStudent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const title = "Total Courses";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentResponse = await axios.get("/course/active");
        const total = currentResponse.data.length;
        setTotalStudent(total);
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
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        <CourseIcon forCard={"true"} width={22} height={22} />
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4
            className={`text-title-md font-bold text-black dark:text-white ${error ? "text-red-500" : ""}`}
          >
            {loading ? "Loading..." : error ? "Error" : totalStudent}
          </h4>
          <span className="text-sm font-medium">{title}</span>
        </div>
      </div>
    </div>
  );
};

export default CardDataCourse;
