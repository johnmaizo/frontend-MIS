import axios from "axios";
import { useContext, useEffect, useState, useRef } from "react";
import { DepartmentIcon } from "../Icons";
import { AuthContext } from "../context/AuthContext";

/* eslint-disable react/prop-types */
const CardDataDepartment = () => {
  const { user } = useContext(AuthContext);

  const [totalDepartment, setTotalDepartment] = useState(null);
  const [nextUpdate, setNextUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState("");

  const previousDepartmentCount = useRef(null);
  const timeoutId = useRef(null);
  const retryCount = useRef(0);
  const maxRetries = 5;

  const title = "Total Department";

  // Function to fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const currentResponse = await axios.get("/departments/cron-count", {
        params: {
          campus_id: user.campus_id,
        },
        timeout: 10000, // 10-second timeout for the request
      });
      const { departmentCount, nextUpdate } = currentResponse.data;
      const parsedNextUpdate = new Date(nextUpdate);

      // If nextUpdate from the backend is in the past, fetch the data again immediately
      if (parsedNextUpdate <= new Date()) {
        setLoading(false);
        fetchData(); // Fetch data again if the backend's next update time is outdated
        return;
      }

      setNextUpdate(parsedNextUpdate);
      setError(null);
      retryCount.current = 0; // Reset retry count on a successful fetch

      // Update the department count if it has changed
      if (departmentCount !== previousDepartmentCount.current) {
        setTotalDepartment(departmentCount);
        previousDepartmentCount.current = departmentCount;
      }
    } catch (err) {
      if (retryCount.current < maxRetries) {
        // Implement exponential backoff
        const retryDelay = Math.pow(2, retryCount.current) * 1000; // 2^retryCount * 1000ms
        retryCount.current += 1;
        console.warn(`Retrying in ${retryDelay / 1000} seconds...`);
        setTimeout(fetchData, retryDelay);
      } else {
        setError("Failed to fetch department data. Please try again later.");
        retryCount.current = 0; // Reset retry count after max retries
      }
    }
    setLoading(false);
  };

  // Function to set up the next data fetch based on the provided nextUpdate time
  const setupNextFetch = () => {
    if (nextUpdate) {
      const timeDiff = nextUpdate - new Date();
      if (timeDiff > 0) {
        // Schedule the next data fetch based on the nextUpdate time
        timeoutId.current = setTimeout(fetchData, timeDiff);
      } else {
        // If nextUpdate is in the past, fetch data immediately
        fetchData();
      }
    }
  };

  useEffect(() => {
    // Fetch the data immediately on component mount
    fetchData();

    // Clean up the timeout on component unmount
    return () => clearTimeout(timeoutId.current);
  }, [user.campus_id]);

  // Set up the next data fetch whenever nextUpdate changes
  useEffect(() => {
    // Clear any existing timeout to avoid duplicate fetches
    clearTimeout(timeoutId.current);
    setupNextFetch();

    // Cleanup the timeout when component unmounts or nextUpdate changes
    return () => clearTimeout(timeoutId.current);
  }, [nextUpdate]);

  // Update the time remaining for the next update
  useEffect(() => {
    const timer = setInterval(() => {
      if (nextUpdate) {
        const timeDiff = nextUpdate - new Date();
        if (timeDiff > 0) {
          const minutes = Math.floor(
            (timeDiff % (1000 * 60 * 60)) / (1000 * 60),
          );
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
          setTimeRemaining(`${minutes}m ${seconds}s`);
        } else {
          // When the countdown reaches zero, indicate that data is updating now
          setTimeRemaining("Updating now...");
        }
      }
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, [nextUpdate]);

  return (
    <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        <DepartmentIcon forCard={"true"} width={24} height={24} />
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4
            className={`text-title-md font-bold text-black dark:text-white ${error ? "text-red-500" : ""}`}
          >
            {loading ? "Loading..." : error ? "Error" : totalDepartment}
          </h4>
          <span className="text-sm font-medium">
            {title}
            {totalDepartment > 1 && "s"}
          </span>
          <div className="text-gray-500 mt-1 text-xs">
            {`Next update in: ${timeRemaining}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDataDepartment;
