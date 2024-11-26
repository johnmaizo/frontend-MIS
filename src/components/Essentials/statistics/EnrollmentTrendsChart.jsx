// EnrollmentTrendsChart.jsx
/* eslint-disable react/prop-types */
import { useEffect, useState, useContext } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Skeleton } from "../../ui/skeleton";

const EnrollmentTrendsChart = ({ filters }) => {
  const { user } = useContext(AuthContext);
  const [series, setSeries] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [options, setOptions] = useState({
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#3C50E0"],
    chart: {
      type: "area",
      height: 350,
      fontFamily: "Satoshi, sans-serif",
      toolbar: {
        show: false,
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
      background: "transparent",
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
      colors: ["#fff"],
      strokeColors: ["#3056D3"],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
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
    title: {
      text: "Enrollment Trends by Semester",
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#333", // Default color for light mode
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
          color: "#333", // Default color for light mode
        },
      },
      labels: {
        rotate: -45,
        rotateAlways: true,
        style: {
          fontSize: "12px",
          colors: "#333", // Default color for light mode
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
        text: "Total Students",
        style: {
          fontSize: "14px",
          fontWeight: 600,
          color: "#333", // Default color for light mode
        },
      },
      labels: {
        formatter: function (val) {
          return val;
        },
        style: {
          fontSize: "12px",
          colors: "#333", // Default color for light mode
        },
      },
      min: 0,
    },
    tooltip: {
      theme: "light", // Default theme for light mode
      y: {
        formatter: function (val) {
          return `${val} Student${val !== 1 ? "s" : ""}`;
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
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to detect dark mode
  const detectDarkMode = () => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  };

  useEffect(() => {
    setIsDarkMode(detectDarkMode());

    const handleThemeChange = () => {
      setIsDarkMode(detectDarkMode());
    };

    // Listen for changes to the class on the root element
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchEnrollmentTrends = async () => {
      try {
        const params = {
          campus_id: user.campus_id,
          ...filters,
        };
        const response = await axios.get(
          "/statistics/enrollment-trends-by-semester",
          { params },
        );
        const data = response.data;

        if (!Array.isArray(data)) {
          throw new Error("Data fetched is not an array");
        }

        const semesters = data.map((item) => item.semester);
        const totalStudents = data.map((item) => item.totalStudents);

        setOptions((prev) => ({
          ...prev,
          xaxis: {
            ...prev.xaxis,
            categories: semesters,
          },
        }));

        setSeries([{ name: "Total Students", data: totalStudents }]);
      } catch (err) {
        setError("Failed to load enrollment trends.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollmentTrends();
  }, [user.campus_id, filters]);

  useEffect(() => {
    // Update chart options based on theme
    setOptions((prev) => ({
      ...prev,
      title: {
        ...prev.title,
        style: {
          ...prev.title.style,
          color: isDarkMode ? "#fff" : "#333",
        },
      },
      xaxis: {
        ...prev.xaxis,
        labels: {
          ...prev.xaxis.labels,
          colors: isDarkMode ? "#fff" : "#333",
        },
        title: {
          ...prev.xaxis.title,
          color: isDarkMode ? "#fff" : "#333",
        },
      },
      yaxis: {
        ...prev.yaxis,
        labels: {
          ...prev.yaxis.labels,
          colors: isDarkMode ? "#fff" : "#333",
        },
        title: {
          ...prev.yaxis.title,
          color: isDarkMode ? "#fff" : "#333",
        },
      },
      tooltip: {
        ...prev.tooltip,
        theme: isDarkMode ? "dark" : "light",
      },
      grid: {
        ...prev.grid,
        borderColor: isDarkMode ? "#444" : "#e7e7e7",
      },
    }));
  }, [isDarkMode]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Enrollment</p>
              <p className="text-sm font-medium">Current Semester</p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button className="rounded bg-white px-3 py-1 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark">
              Day
            </button>
            <button className="rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Week
            </button>
            <button className="rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Month
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col space-y-4 p-4">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-60 w-full" />
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
