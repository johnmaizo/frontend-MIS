/* eslint-disable react/prop-types */
// src/components/BarChartEnrollmentsByDepartment.jsx

import { useEffect, useState, useContext } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Skeleton } from "../../ui/skeleton";

const BarChartEnrollmentsByDepartment = ({ filters }) => {
  const { user } = useContext(AuthContext);
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({
    chart: { type: "bar", toolbar: { show: false } },
    xaxis: { categories: [], title: { text: "Department Code" } },
    tooltip: {
      y: {
        formatter: (val) => `${val} Enrollments`,
      },
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const departmentCode = w.globals.categoryLabels[dataPointIndex];
        const departmentName =
          w.globals.customData[dataPointIndex].departmentName;
        return `
          <div style="padding:10px;">
            <strong>${departmentCode}</strong> - ${departmentName}<br/>
            <strong>Enrollments:</strong> ${series[seriesIndex][dataPointIndex]}
          </div>
        `;
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        distributed: false,
        borderRadius: 4,
        dataLabels: {
          position: "top", // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val;
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
    },
    colors: ["#008FFB"],
    title: {
      text: "Subjects Enrolled by Department",
      align: "left",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#111",
      },
    },
    responsive: [
      {
        breakpoint: 1000,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "50%",
            },
          },
          dataLabels: {
            offsetY: -15,
          },
        },
      },
    ],
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

        // Assuming the API returns departmentCode and departmentName
        // Example: { departmentCode: "CSS", departmentName: "College of Computer Studies", totalEnrollments: 120 }

        // Extract department codes and names
        const departments = data.map((item) => item.departmentCode || "UN");
        const enrollments = data.map((item) => item.totalEnrollments || 0);

        // Prepare custom data for tooltips
        const customData = data.map((item) => ({
          departmentName: item.departmentName || "N/A",
        }));

        setOptions((prev) => ({
          ...prev,
          xaxis: {
            categories: departments,
            title: { text: "Department Code" },
          },
          tooltip: {
            ...prev.tooltip,
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
              const departmentCode = w.globals.categoryLabels[dataPointIndex];
              const departmentName =
                w.globals.customData[dataPointIndex].departmentName;
              return `
                <div style="padding:10px;">
                  <strong>${departmentCode}</strong> - ${departmentName}<br/>
                  <strong>Enrollments:</strong> ${series[seriesIndex][dataPointIndex]}
                </div>
              `;
            },
          },
          // Pass customData to ApexCharts
          customData: customData,
        }));
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
