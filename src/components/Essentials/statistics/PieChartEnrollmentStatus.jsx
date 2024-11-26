/* eslint-disable react/prop-types */
import { useEffect, useState, useContext } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Skeleton } from "../../ui/skeleton";

const PieChartEnrollmentStatus = ({ filters }) => {
  const { user } = useContext(AuthContext);
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({ labels: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrollmentStatusBreakdown = async () => {
      try {
        const params = {
          campus_id: user.campus_id,
          schoolYear: filters.schoolYear,
          semester_id: filters.semester_id,
        };
        const response = await axios.get(
          "/statistics/enrollment-status-breakdown",
          { params },
        );
        const data = response.data;

        const statuses = data.map((item) => item.status);
        const counts = data.map((item) => item.count);

        setOptions({ labels: statuses });
        setSeries(counts);
      } catch (error) {
        console.error("Error fetching enrollment status breakdown:", error);
        setError("Failed to load enrollment status breakdown.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollmentStatusBreakdown();
  }, [user.campus_id, filters]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-4">
      <h5 className="mb-4 text-xl font-semibold text-black dark:text-white">
        Enrollment Status Breakdown
      </h5>
      {loading ? (
        <div className="space-y-3 p-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-80 w-full" />
        </div>
      ) : error ? (
        <div className="flex h-80 items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : series.length > 0 ? (
        <ReactApexChart
          options={options}
          series={series}
          type="pie"
          height={350}
        />
      ) : (
        <p className="text-gray-500 text-center">
          No enrollment data available for the selected filters.
        </p>
      )}
    </div>
  );
};

export default PieChartEnrollmentStatus;
