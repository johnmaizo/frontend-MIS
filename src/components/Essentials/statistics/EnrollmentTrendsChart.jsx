/* eslint-disable react/prop-types */
import { useEffect, useState, useContext } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const EnrollmentTrendsChart = ({ filters }) => {
  const { user } = useContext(AuthContext);
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: false, // Hide toolbar to remove unwanted icons
      },
      zoom: {
        enabled: true,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
      dropShadow: {
        enabled: true,
        color: "#623CEA14",
        top: 10,
        left: 0,
        blur: 4,
        opacity: 0.1,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
      width: 2,
    },
    markers: {
      size: 4,
      colors: ["#fff"], // White fill for markers
      strokeColors: ["#3056D3"], // Border color matches the series color
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: 7,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
    colors: ["#3C50E0"], // Primary color
    title: {
      text: "Enrollment Trends by Semester",
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#333",
      },
    },
    xaxis: {
      type: "category",
      categories: [],
      title: {
        text: "Semester",
        style: {
          fontSize: "14px",
          fontWeight: 600,
        },
      },
      labels: {
        rotate: -45,
        rotateAlways: true,
        style: {
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: true,
        color: "#e7e7e7",
      },
      axisTicks: {
        show: true,
        color: "#e7e7e7",
      },
    },
    yaxis: {
      title: {
        text: "Total Enrollments",
        style: {
          fontSize: "14px",
          fontWeight: 600,
        },
      },
      labels: {
        formatter: function (val) {
          return val;
        },
        style: {
          fontSize: "12px",
        },
      },
      min: 0,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `${val} Students`;
        },
        title: {
          formatter: (seriesName) => seriesName,
        },
      },
    },
    grid: {
      borderColor: "#e7e7e7",
      strokeDashArray: 4,
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
          xaxis: {
            labels: {
              rotate: -30,
            },
          },
        },
      },
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 250,
          },
          xaxis: {
            labels: {
              rotate: 0,
            },
          },
        },
      },
    ],
    legend: {
      show: false, // Hide legend if not necessary
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // New state for error handling

  useEffect(() => {
    const fetchEnrollmentTrends = async () => {
      try {
        const params = {
          campus_id: user.campus_id,
          // Include other filters if necessary
        };
        const response = await axios.get(
          "/statistics/enrollment-trends-by-semester",
          {
            params,
          },
        );
        const data = response.data;

        console.log("Fetched Enrollment Trends:", data);

        if (!Array.isArray(data)) {
          throw new Error("Data fetched is not an array");
        }

        const semesters = data.map((item) => item.semester);
        const totalEnrollments = data.map((item) => item.totalEnrollments);

        setOptions((prev) => ({
          ...prev,
          xaxis: { categories: semesters },
        }));
        setSeries([{ name: "Total Enrollments", data: totalEnrollments }]);
      } catch (err) {
        console.error("Error fetching enrollment trends:", err);
        setError("Failed to load enrollment trends.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollmentTrends();
  }, [user.campus_id, filters]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      {loading ? (
        <div className="flex h-80 items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : error ? (
        <div className="flex h-80 items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="mt-5 overflow-hidden">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={350}
          />
        </div>
      )}
    </div>
  );
};

export default EnrollmentTrendsChart;
