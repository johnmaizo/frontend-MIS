/* eslint-disable react/prop-types */
import axios from "axios";
import { CalendarClock, Loader } from "lucide-react"; // Loader icon for spinner
import { useEffect, useState } from "react";

const getStatusColor = (status, loading) => {
  if (loading) {
    return "#e2e8f0"; // Default gray color while loading
  }
  switch (status) {
    case "accepted":
      return "#38a169"; // Green for accepted steps
    case "in-progress":
      return "#4299e1"; // Blue for current step
    case "upcoming":
      return "#e2e8f0"; // Gray for upcoming steps
    case "rejected":
      return "#e53e3e"; // Red for rejected steps
    default:
      return "#e2e8f0"; // Default gray
  }
};

const EnrollmentProgress = ({ enrollmentId }) => {
  const [steps, setSteps] = useState([
    {
      id: 1,
      label: "Registrar Approval",
      description: "Check by the registrar office",
      status: "upcoming",
      date: null,
    },
    {
      id: 2,
      label: "Accounting Approval",
      description: "Check by the accounting department",
      status: "upcoming",
      date: null,
    },
    {
      id: 3,
      label: "Final Approval",
      description: "Final approval of the application",
      status: "upcoming",
      date: null,
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollmentStatus = async () => {
      try {
        const response = await axios.get(
          `/enrollment/get-enrollment-status/${enrollmentId}`,
        );

        const data = response.data;

        const mappedSteps = [
          {
            id: 1,
            label: "Registrar Approval",
            description: "Check by the registrar office",
            status: mapBackendStatus(data.registrar_status),
            accepted: data.registrar_status === "accepted",
            rejected: data.registrar_status === "rejected",
            date: data.registrar_status_date, // Add date
          },
          {
            id: 2,
            label: "Accounting Approval",
            description: "Check by the accounting department",
            status: mapBackendStatus(data.accounting_status),
            accepted: data.accounting_status === "accepted",
            rejected: data.accounting_status === "rejected",
            paymentConfirmed: data.payment_confirmed,
            date: data.accounting_status_date, // Add date
          },
          {
            id: 3,
            label: "Final Approval",
            description: "Final approval of the application",
            status: data.final_approval_status ? "accepted" : "upcoming",
            accepted: data.final_approval_status,
            rejected: false,
            date: null, // No date field for final approval
          },
        ];

        setSteps(mappedSteps);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching enrollment status:", error);
        setLoading(false);
      }
    };

    fetchEnrollmentStatus();
  }, [enrollmentId]);

  const mapBackendStatus = (status) => {
    switch (status) {
      case "accepted":
        return "accepted";
      case "in-progress":
        return "in-progress";
      case "rejected":
        return "rejected";
      default:
        return "upcoming";
    }
  };

  return (
    <div className="text-gray-600 dark:text-gray-400 flex flex-wrap items-center justify-center gap-y-2 space-x-4 text-base text-black dark:text-white">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={`flex items-center ${loading ? "opacity-50" : "opacity-100"}`}
        >
          <div className="mt-0 flex items-center space-x-4">
            <div className="flex flex-none items-center">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full text-xl text-black dark:text-white ${
                  step.accepted || step.status === "in-progress"
                    ? "text-white"
                    : step.rejected
                      ? "text-white"
                      : "!text-black"
                } ${loading ? "animate-pulse" : ""}`} // Pulsating effect while loading
                style={{
                  backgroundColor: getStatusColor(step.status, loading),
                }}
              >
                {loading ? (
                  <Loader className="text-gray-400 h-6 w-6 animate-spin" />
                ) : step.accepted ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6 !text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : step.rejected ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6 !text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              {/* Always show the label and description */}
              <div className="ml-4 w-[9em]">
                <span className="font-medium">{step.label}</span>
                <p className="text-xs">
                  {step.description}
                  {step.label === "Accounting Approval" && (
                    <span className="mt-1 text-[0.55rem] font-semibold">
                      <br />(Payment Status:{" "}
                      {step.paymentConfirmed ? (
                        <span className="text-green-500">Confirmed</span>
                      ) : (
                        <span className="text-red-500">Pending</span>
                      )})
                    </span>
                  )}
                </p>

                {!loading && step.accepted && step.date && (
                  <p className="text-gray-500 mt-1 inline-flex items-center gap-1 text-[0.6rem] font-medium">
                    <CalendarClock className="h-[15px] w-[15px]" />{" "}
                    <relative-time datetime={step.date} />
                  </p>
                )}

                {/* Payment Status Indicator for Accounting Approval */}
              </div>
            </div>
          </div>
          {index !== steps.length - 1 && (
            <div
              className="mb-0 h-1 w-10 flex-none"
              style={{ backgroundColor: step.accepted ? "#38a169" : "#e2e8f0" }}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EnrollmentProgress;
