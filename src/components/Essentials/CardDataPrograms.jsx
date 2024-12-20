import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { ProgramIcon } from "../Icons";
import { AuthContext } from "../context/AuthContext";
import { Skeleton } from "../ui/skeleton";

/* eslint-disable react/prop-types */
const CardDataPrograms = () => {
  const { user } = useContext(AuthContext);

  const [totalPrograms, setTotalPrograms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const title = "Total Program";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentResponse = await axios.get("/programs/count", {
          params: {
            campus_id: user.campus_id,
          },
        });
        const total = currentResponse.data;
        setTotalPrograms(total);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to fetch programs");
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [user.campus_id]);

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
        <ProgramIcon forCard={"true"} width={22} height={22} />
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4
            className={`text-title-md font-bold text-black dark:text-white ${
              error ? "text-red-500" : ""
            }`}
          >
            {error ? "Error" : totalPrograms}
          </h4>
          <span className="text-sm font-medium">
            {title}
            {totalPrograms > 1 && "s"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardDataPrograms;
