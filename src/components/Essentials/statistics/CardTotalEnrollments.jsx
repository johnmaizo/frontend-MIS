import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { PersonIcon } from "../../Icons";

const CardTotalEnrollments = () => {
  const { user } = useContext(AuthContext);
  const [totalEnrollments, setTotalEnrollments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotalEnrollments = async () => {
      try {
        const params = {
          campus_id: user.campus_id,
          // You can add schoolYear and semester_id if needed
        };
        const response = await axios.get("/statistics/total-enrollments", {
          params,
        });
        setTotalEnrollments(response.data.totalEnrollments);
      } catch (err) {
        setError("Failed to fetch total enrollments.");
      } finally {
        setLoading(false);
      }
    };

    fetchTotalEnrollments();
  }, [user.campus_id]);

  return (
    <div className="rounded-sm border bg-white px-7.5 py-6 shadow-default">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2">
        <PersonIcon />
      </div>
      <div className="mt-4">
        <h4 className="text-title-md font-bold text-black dark:text-white">
          {loading ? "Loading..." : error ? "Error" : totalEnrollments}
        </h4>
        <span className="text-sm font-medium ">Total Enrollments</span>
      </div>
    </div>
  );
};

export default CardTotalEnrollments;
