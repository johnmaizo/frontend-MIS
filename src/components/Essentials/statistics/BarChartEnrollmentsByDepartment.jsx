/* eslint-disable react/prop-types */
import { useEffect, useState, useContext, useRef } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Skeleton } from "../../ui/skeleton";

const BarChartEnrollmentsByDepartment = ({ filters }) => {
  const { user } = useContext(AuthContext);
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({
    chart: { type: "bar" },
    xaxis: { categories: [] },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        // Access the department codes and names from refs
        const code = departmentCodesRef.current[dataPointIndex];
        const name = departmentNamesRef.current[dataPointIndex];
        const enrollment = series[seriesIndex][dataPointIndex];

        // Return custom HTML for the tooltip
        return `
          <div class="custom-tooltip" style="background: white; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
            <strong>${code} - ${name}</strong><br/>
            Enrollments: ${enrollment}
          </div>
        `;
      },
    },
  });
  const [loading, setLoading] = useState(true);

  // Refs to store department codes and names
  const departmentCodesRef = useRef([]);
  const departmentNamesRef = useRef([]);

  useEffect(() => {
    const fetchEnrollmentsByDepartment = async () => {
      setLoading(true);
      try {
        const params = {
          campus_id: user.campus_id,
          schoolYear: filters.schoolYear,
          semester_id: filters.semester_id,
        };
        const response = await axios.get(
          "/statistics/enrollments-by-department",
          { params },
        );
        const data = response.data;

        // Extract department codes, names, and enrollments
        const codes = data.map((item) => item.departmentCode || "");
        const names = data.map(
          (item) => item.departmentName || "General Subject",
        );
        const enrollments = data.map((item) => item.totalEnrollments);

        // Define x-axis categories: "CCS" and "General Subject"
        const categories = data.map((item) =>
          item.departmentCode === "GS"
            ? "General Subject"
            : item.departmentCode,
        );

        // Store codes and names in refs
        departmentCodesRef.current = codes;
        departmentNamesRef.current = names;

        // Update chart options
        setOptions((prev) => ({
          ...prev,
          xaxis: { categories: categories },
        }));

        // Update series data
        setSeries([{ name: "Enrollments", data: enrollments }]);
      } catch (error) {
        console.error("Error fetching enrollments by department:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollmentsByDepartment();
  }, [user.campus_id, filters]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-4">
      <h5 className="mb-4 text-xl font-semibold text-black dark:text-white">
        Subjects Enrolled by Department
      </h5>
      {loading ? (
        <div className="space-y-3 p-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-80 w-full" />
        </div>
      ) : (
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={350}
        />
      )}
    </div>
  );
};

export default BarChartEnrollmentsByDepartment;
