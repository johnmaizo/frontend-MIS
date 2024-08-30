import axios from "axios";
import { useEffect, useState } from "react";
import { CampusIcon } from "../Icons";

/* eslint-disable react/prop-types */
const CardDataCampus = () => {
  const [totalCampus, setTotalCampus] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const title = "Total Campus";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentResponse = await axios.get("/campus/count");
        const total = currentResponse.data;
        setTotalCampus(total);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to fetch campus");
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        <CampusIcon forCard={"true"} />
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4
            className={`text-title-md font-bold text-black dark:text-white ${error ? "text-red-500" : ""}`}
          >
            {loading ? "Loading..." : error ? "Error" : totalCampus}
          </h4>
          <span className="text-sm font-medium">
            {title}
            {totalCampus > 1 && "es"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardDataCampus;
