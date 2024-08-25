import axios from "axios";
import { useEffect, useState } from "react";
import { LevelDownIcon, LevelUpIcon, PersonIcon } from "../Icons";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

/* eslint-disable react/prop-types */
const CardDataStudent = () => {
  const [totalStudent, setTotalStudent] = useState(null);
  const [previousTotalStudent, setPreviousTotalStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const title = "Total Students";

  const calculateRate = (current, previous) => {
    if (previous === 0) return "100%";
    if (previous === null || current === null) return "N/A";
    const rate = ((current - previous) / previous) * 100;
    return `${Math.min(rate, 100).toFixed(2)}%`;
  };

  const getRateDetails = (current, previous) => {
    if (previous === 0)
      return { color: "text-green-500", icon: <LevelUpIcon /> };
    if (previous === null || current === null)
      return { color: "text-gray-500", icon: null };
    return current >= previous
      ? { color: "text-green-500", icon: <LevelUpIcon /> }
      : { color: "text-red-500", icon: <LevelDownIcon /> };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentResponse = await axios.get("/students/active");
        const total = currentResponse.data;
        setTotalStudent(total);

        const previousResponse = await axios.get("/students/previous-active");
        const previousTotal = previousResponse.data.total;
        setPreviousTotalStudent(previousTotal);
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

  const rate =
    !loading && totalStudent !== null && previousTotalStudent !== null
      ? calculateRate(totalStudent, previousTotalStudent)
      : "Loading...";

  const rateDetails =
    !loading && totalStudent !== null && previousTotalStudent !== null
      ? getRateDetails(totalStudent, previousTotalStudent)
      : { color: "text-gray-500", icon: null };

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
            {loading ? "Loading..." : error ? "Error" : totalStudent}
          </h4>
          <span className="text-sm font-medium">{title}</span>
        </div>

        {loading ? (
          <span
            className={`flex items-center gap-1 text-sm font-medium ${rateDetails.color}`}
          >
            {rate}
            {rateDetails.icon}
          </span>
        ) : (
          <HoverCard>
            <HoverCardTrigger asChild>
              <span
                className={`flex items-center gap-1 text-sm font-medium hover:cursor-pointer hover:underline hover:underline-offset-2 ${rateDetails.color}`}
              >
                {rate}
                {rateDetails.icon}
              </span>
            </HoverCardTrigger>
            <HoverCardContent asChild>
              <p className="text-sm font-medium text-black dark:text-white">
                {`The rate represents the change from ${previousTotalStudent} students previously to ${totalStudent} students currently.`}
              </p>
            </HoverCardContent>
          </HoverCard>
        )}
      </div>
    </div>
  );
};

export default CardDataStudent;
