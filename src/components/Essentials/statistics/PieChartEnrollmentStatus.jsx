/* eslint-disable react/prop-types */
import { useEffect, useState, useContext } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const PieChartEnrollmentStatus = ({ filters }) => {
  const { user } = useContext(AuthContext);
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({ labels: [] });
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollmentStatusBreakdown();
  }, [user.campus_id, filters]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-4">
      <h5 className="mb-4 text-xl font-semibold text-black">
        Enrollment Status Breakdown
      </h5>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ReactApexChart
          options={options}
          series={series}
          type="pie"
          height={350}
        />
      )}
    </div>
  );
};

export default PieChartEnrollmentStatus;
