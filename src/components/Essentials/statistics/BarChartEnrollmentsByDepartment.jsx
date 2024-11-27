/* eslint-disable react/prop-types */
import { useEffect, useState, useContext } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Skeleton } from "../../ui/skeleton";

const BarChartEnrollmentsByDepartment = ({ filters }) => {
  const { user } = useContext(AuthContext);
  const [series, setSeries] = useState([]);
  const [departmentNames, setDepartmentNames] = useState([]); // New state for department names
  const [options, setOptions] = useState({
    chart: { type: "bar" },
    xaxis: { categories: [] },
    tooltip: {
      x: {
        formatter: function (val, { dataPointIndex }) {
          // Access the department name using the dataPointIndex
          const deptName = departmentNames[dataPointIndex] || "";
          return `${val} - ${deptName}`;
        },
      },
      y: {
        formatter: function (val) {
          return `${val} Enrollments`;
        },
      },
    },
    plotOptions: {
      bar: {
        distributed: true, // Optional: for better visual distinction
      },
    },
    dataLabels: {
      enabled: false,
    },
    // Optional: Enhance chart appearance
    title: {
      text: "Subjects Enrolled by Department",
      align: 'center',
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
      },
    },
  });
  const [loading, setLoading] = useState(true);

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

        // Extract departmentCodes and departmentNames
        const departmentCodes = data.map(
          (item) => item.departmentCode || "N/A"
        );
        const departmentNamesArray = data.map(
          (item) => item.departmentName || "General Subject"
        );
        const enrollments = data.map((item) => item.totalEnrollments);

        // Update the departmentNames state
        setDepartmentNames(departmentNamesArray);

        // Update chart options with departmentCodes as categories
        setOptions((prev) => ({
          ...prev,
          xaxis: { categories: departmentCodes },
        }));

        // Set the series data
        setSeries([{ name: "Enrollments", data: enrollments }]);
      } catch (error) {
        console.error("Error fetching enrollments by department:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollmentsByDepartment();
  }, [user.campus_id, filters, departmentNames]);

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
