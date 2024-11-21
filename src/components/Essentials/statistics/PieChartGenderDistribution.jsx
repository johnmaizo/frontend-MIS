/* eslint-disable react/prop-types */
import { useEffect, useState, useContext } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const PieChartGenderDistribution = ({ filters }) => {
  const { user } = useContext(AuthContext);
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({ labels: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenderDistribution = async () => {
      try {
        const params = {
          campus_id: user.campus_id,
          schoolYear: filters.schoolYear,
          semester_id: filters.semester_id,
        };
        const response = await axios.get("/statistics/gender-distribution", {
          params,
        });
        const data = response.data;

        console.log("Enrollments Data:", data);

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format: Expected an array");
        }

        // Validate each item has 'gender' and 'count'
        const validData = data.filter(
          (item) =>
            item.gender !== undefined &&
            item.gender !== null &&
            !isNaN(item.count),
        );

        if (validData.length === 0) {
          throw new Error("No valid data available for the chart");
        }

        const genders = validData.map((item) => item.gender);
        const counts = validData.map((item) => item.count);

        setOptions({ labels: genders });
        setSeries(counts);
      } catch (error) {
        console.error("Error fetching gender distribution:", error);
        // Optionally, set default error state or show user-friendly message
        setOptions({ labels: [] });
        setSeries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGenderDistribution();
  }, [user.campus_id, filters]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-4">
      <h5 className="mb-4 text-xl font-semibold text-black">
        Gender Distribution
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
          options={{
            labels: options.labels,
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200,
                  },
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
            title: {
              text: "Gender Distribution",
              align: "left",
            },
            tooltip: {
              y: {
                formatter: function (val) {
                  return `${val} Student${ val === 1 ? "" : "s"}`;
                },
              },
            },
          }}
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

export default PieChartGenderDistribution;
