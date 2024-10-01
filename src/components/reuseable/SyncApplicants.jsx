/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { RefreshCcwIcon } from "lucide-react";
import { useEnrollment } from "../context/EnrollmentContext";

const SyncApplicants = ({ loadingApplicants }) => {
  const [loading, setLoading] = useState(false);
  const { fetchApplicants } = useEnrollment();
  let longProcessToastId = null;
  let timer = null;

  // Use a ref to store the AbortController so it persists across renders
  const abortControllerRef = useRef(null);

  const handleAction = async () => {
    setLoading(true);

    // Create a new AbortController before the request
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    // Set a timeout to show the loading toast after 7 seconds if the process is still running
    timer = setTimeout(() => {
      longProcessToastId = toast.loading(
        "This may take a while... Please wait.",
        {
          position: "bottom-right",
        },
      );
    }, 7000);

    try {
      const response = await axios.get("/enrollment/fetch-applicant-data", {
        signal, // Pass the signal to axios to handle the abort
      });

      console.log(response.data);

      if (response.data) {
        toast.success(response.data.message, {
          position: "bottom-right",
          duration: 5000,
        });

        if (response.data.message !== "All applicants are up to date.") {
          fetchApplicants();
        }
      }

      setLoading(false);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Request canceled by user");
      } else {
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(`Error: ${err.response.data.message}`, {
            position: "bottom-right",
            duration: 5000,
          });
        } else {
          toast.error("Failed to sync applicants data", {
            position: "bottom-right",
            duration: 5000,
          });
        }
        setLoading(false);
      }
    } finally {
      // Clear the timer if the process finishes before 7 seconds
      clearTimeout(timer);

      // If the loading toast was shown, dismiss it
      if (longProcessToastId) {
        toast.dismiss(longProcessToastId);
      }
    }
  };

  useEffect(() => {
    return () => {
      // Abort the request if the component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <Button
      className={`inline-flex w-full gap-2 ${
        loading ? "cursor-not-allowed bg-green-800" : ""
      } bg-green-600 hover:bg-green-700`}
      onClick={handleAction}
      disabled={loading || loadingApplicants}
    >
      <RefreshCcwIcon className={`${loading ? "animate-reverse-spin" : ""}`} />
      {loading ? "Syncing Applicants..." : "Sync Applicants"}
    </Button>
  );
};

export default SyncApplicants;
