import { useContext, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { HasRole } from "../reuseable/HasRole";
import SmallLoader from "../styles/SmallLoader";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

let options = {
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "pie",
  },
  legend: {
    show: false,
    position: "bottom",
    labels: {
      colors: "#FFFFFF",
    },
  },
  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        background: "transparent",
      },
    },
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: "13px",
      fontFamily: "Helvetica, Arial, sans-serif",
      fontWeight: "medium",
      colors: ["#FFFFFF"],
    },
  },
  tooltip: {
    theme: "dark",
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 400,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const PieChartDepartment = () => {
  const { user } = useContext(AuthContext);

  const [data, setData] = useState({});
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = user.campusName ? { campusName: user.campusName } : {}; // If campusName doesn't exist, send empty
        const currentResponse = await axios.get("/enrollment/get-chart-data", {
          params,
        });
        const data = currentResponse.data;

        options = {
          ...options,
          labels: HasRole(user.role, "SuperAdmin")
            ? data?.labels.map((label) => label.departmentNameWithCampusName)
            : data?.labels.map((label) => label.departmentName),
          colors: data?.colors,
        };

        setData(data);
        setSeries(data?.series);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to fetch Chart Data");
        }
      }

      setTimeout(() => {
        setLoading(false);
      }, 450); // Adjust the timeout value (in milliseconds) as needed
    };

    fetchData();
  }, [user.campusName, user.role]);

  return loading ? (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-4">
      <div className="flex items-center gap-3 text-2xl font-semibold text-black dark:text-white">
        <SmallLoader width={10} height={10} /> <span>Loading...</span>
      </div>
    </div>
  ) : error ? (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-4">
      <div className="flex items-center gap-3 text-2xl font-semibold text-black dark:text-white">
        <p className="text-2xl font-medium text-red-500">Error: {error}</p>
      </div>
    </div>
  ) : (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-4">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          {/* Tooltip explanation added here */}
          <TooltipProvider delayDuration={250}>
            <Tooltip>
              <TooltipTrigger asChild>
                <h5
                  className={`cursor-help text-xl font-semibold text-black dark:text-white`}
                >
                  {HasRole(user.role, "SuperAdmin")
                    ? "Department Analytics (All Campuses)"
                    : `Department Analytics (${user.campusName})`}
                </h5>
              </TooltipTrigger>
              <TooltipContent className="bg-white !shadow-default dark:border-strokedark dark:bg-[#1A222C]">
                <p className="text-lg">
                  This pie chart provides a visual breakdown of student <br />
                  enrollment by department in the selected campus. <br /> <br />{" "}
                  Each slice represents the percentage of total enrollment{" "}
                  <br /> attributed to a specific department.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="mb-2">
        <div id="PieChartDepartment" className="mx-auto flex justify-center">
          <ReactApexChart options={options} series={series} type="pie" />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        {Array.isArray(data?.labels) &&
          data?.labels.map((label, index) => (
            //             <div key={index} className="w-full px-8 sm:w-1/2">
            <div key={index} className="gap-3 px-3">
              <div className="flex w-full items-center">
                <span
                  className="mr-2 block aspect-square h-3 w-full max-w-3 rounded-full"
                  style={{ backgroundColor: data?.colors[index] }} // Applying dynamic background color
                ></span>

                <TooltipProvider delayDuration={75}>
                  <Tooltip>
                    <TooltipTrigger
                      asChild
                      className="cursor-default hover:underline hover:underline-offset-2"
                    >
                      <p className="flex justify-between gap-1 text-sm font-medium text-black dark:text-white">
                        {HasRole(user.role, "SuperAdmin")
                          ? label.departmentCodeWithCampusName
                          : label.departmentCode}{" "}
                        - {data?.percentages[index]}%
                      </p>
                    </TooltipTrigger>
                    <TooltipContent
                      className="text-white !shadow-default"
                      style={{ backgroundColor: data?.colors[index] }} // Applying dynamic background color
                    >
                      <p className="text-[1rem]">
                        {HasRole(user.role, "SuperAdmin")
                          ? label.departmentNameWithCampusName
                          : label.departmentName}
                        : <span className="font-bold">{series[index]}</span>
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PieChartDepartment;
