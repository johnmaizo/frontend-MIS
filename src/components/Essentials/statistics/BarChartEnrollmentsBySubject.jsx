/* eslint-disable react/prop-types */
import { useEffect, useState, useContext } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Skeleton } from "../../ui/skeleton";

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
        text: "Number of Unique Students",
      },
      min: 0,
      forceNiceScale: true,
    },
    fill: {
      opacity: 1,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrollmentsByCourse = async () => {
      setLoading(true);
      setError(null); // Reset error before fetching new data
      try {
        const params = {
          campus_id: user.campus_id,
          schoolYear: filters.schoolYear,
          semester_id: filters.semester_id,
        };
        const response = await axios.get("/statistics/enrollments-by-course", {
          params,
        });
        const { categories, data, othersDescriptions } = response.data;

        // Validate the data
        if (
          !Array.isArray(categories) ||
          !Array.isArray(data) ||
          typeof othersDescriptions !== "object"
        ) {
          throw new Error("Invalid data format: Expected structured data");
        }

        // Check if data is empty
        if (categories.length === 0 || data.length === 0) {
          setSeries([]);
          setOptions((prev) => ({
            ...prev,
            xaxis: { categories: [] },
          }));
        } else {
          setOptions((prev) => ({
            ...prev,
            xaxis: { categories: categories },
            tooltip: {
              custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                const category = w.globals.labels[dataPointIndex];

                if (category === "Others") {
                  return `<div style="padding:10px;">
                            <strong>Others</strong><br/>
                            ${
                              othersDescriptions.length > 0
                                ? othersDescriptions.join("<br/>")
                                : "No additional subjects."
                            }
                          </div>`;
                } else {
                  return `<div style="padding:10px;">
                            <strong>${category}</strong><br/>
                            Unique Students: ${data[dataPointIndex]}
                          </div>`;
                }
              },
            },
          }));

          setSeries([{ name: "Unique Students", data: data }]);
        }
      } catch (error) {
        console.error("Error fetching enrollments by subject:", error);
        setError("Failed to load enrollments by subject.");
        setSeries([]);
        setOptions((prev) => ({
          ...prev,
          xaxis: { categories: [] },
        }));
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
        <div className="space-y-3 p-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-80 w-full" />
        </div>
      ) : error ? (
        <div className="flex h-80 items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : series.length > 0 ? (
        <div className="mt-5 overflow-hidden">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
          />
        </div>
      ) : (
        <p className="text-gray-500 text-center">
          No enrollment data available for the selected filters.
        </p>
      )}
    </div>
  );
};

export default BarChartEnrollmentsBySubject;
