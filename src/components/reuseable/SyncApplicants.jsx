/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { RefreshCcwIcon } from "lucide-react";
import { useEnrollment } from "../context/EnrollmentContext";

const SyncApplicants = () => {
  const [loading, setLoading] = useState(false);

  const { fetchApplicants } = useEnrollment();

  const handleAction = async () => {
    setLoading(true);

    try {
      const response = await axios.get("/enrollment/fetch-applicant-data");

      console.log(response.data);

      if (response.data) {
        toast.success(response.data.message, {
          position: "bottom-right",
          duration: 4500,
        });

        if (response.data.message !== "All applicants are up to date.") {
          fetchApplicants();
        }
      }

      setLoading(false);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(`Error: ${err.response.data.message}`, {
          position: "bottom-right",
          duration: 4500,
        });
      } else {
        toast.error(`Failed to sync applicants data`, {
          position: "bottom-right",
          duration: 4500,
        });
      }
      setLoading(false);
    }
  };

  return (
    <Button
      className={`inline-flex w-full gap-2 ${loading ? "cursor-not-allowed bg-green-800" : ""} bg-green-600 hover:bg-green-700`}
      onClick={handleAction}
      disabled={loading}
    >
      <RefreshCcwIcon className={`${loading ? "animate-spin" : ""}`} />
      {loading ? "Syncing Applicants..." : "Sync Applicants"}
    </Button>
  );
};

export default SyncApplicants;
