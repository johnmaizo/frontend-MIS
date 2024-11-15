/* eslint-disable react/prop-types */
import { useEffect, useState, useContext } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const BarChartEnrollmentsBySubject = ({ filters }) => {
  const { user } = useContext(AuthContext);
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({
    chart: { type: "bar" },
    xaxis: { categories: [] },
    tooltip: {
      custom: undefined, // Will be set after data processing
    },
    title: {
      text: "Enrollments by Subject",
      align: "left",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    yaxis: {
      title: {
        text: "Number of Enrollments",
      },
      min: 0,
      forceNiceScale: true,
    },
    fill: {
      opacity: 1,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollmentsByCourse = async () => {
      try {
        const params = {
          campus_id: user.campus_id,
          schoolYear: filters.schoolYear,
          semester_id: filters.semester_id,
        };
        const response = await axios.get("/statistics/enrollments-by-course", {
          params,
        });
        const data = response.data;

        console.log("Enrollments Data:", data);

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format: Expected an array");
        }

        // Sort the data in descending order based on totalEnrollments
        const sortedData = [...data].sort(
          (a, b) => b.totalEnrollments - a.totalEnrollments,
        );

        // Select the top 3 courses
        const topCourses = sortedData.slice(0, 3);

        // Aggregate the remaining courses into "Others"
        const others = sortedData.slice(3);

        // Calculate the total enrollments for "Others"
        const othersTotalEnrollments = others.reduce(
          (acc, curr) => acc + curr.totalEnrollments,
          0,
        );

        // Collect the descriptions and enrollment counts of the courses under "Others"
        const othersDescriptions = others.map(
          (course) =>
            `${course.courseCode} - ${course.courseDescription}: ${course.totalEnrollments}`,
        );

        // Prepare the final categories and series data
        const finalCategories = [
          ...topCourses.map((item) => `${item.courseCode}`),
          "Others",
        ];

        const finalEnrollments = [
          ...topCourses.map((item) => item.totalEnrollments),
          othersTotalEnrollments,
        ];

        // Update the chart options with categories and customized tooltip
        setOptions((prev) => ({
          ...prev,
          xaxis: { categories: finalCategories },
          tooltip: {
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
              const category = w.globals.labels[dataPointIndex]; // Corrected access

              if (category === "Others") {
                // If "Others" is hovered, display the list of other subjects with enrollments
                return `<div style="padding:10px;">
                          <strong>Others</strong><br/>
                          ${
                            othersDescriptions.length > 0
                              ? othersDescriptions.join("<br/>")
                              : "No additional subjects."
                          }
                        </div>`;
              } else {
                // For other categories, display the default tooltip
                return `<div style="padding:10px;">
                          <strong>${category}</strong><br/>
                          Enrollments: ${finalEnrollments[dataPointIndex]}
                        </div>`;
              }
            },
          },
        }));

        // Update the series data
        setSeries([{ name: "Enrollments", data: finalEnrollments }]);
      } catch (error) {
        console.error("Error fetching enrollments by subject:", error);
        // Optionally, update the chart to indicate an error
        setOptions((prev) => ({
          ...prev,
          title: {
            ...prev.title,
            text: "Enrollments by Subject (Error Fetching Data)",
          },
        }));
        setSeries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollmentsByCourse();
  }, [user.campus_id, filters]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-4">
      <h5 className="mb-4 text-xl font-semibold text-black">
        Enrollments by Subject
      </h5>
      {loading ? (
        <div className="flex h-80 items-center justify-center">
          {/* Loading Spinner */}
          <svg
            className="-ml-1 mr-3 h-10 w-10 animate-spin text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
            role="img"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <p className="text-lg">Loading...</p>
        </div>
      ) : series.length > 0 ? (
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
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

export default BarChartEnrollmentsBySubject;
