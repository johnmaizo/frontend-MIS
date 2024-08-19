/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import SmallLoader from "../styles/SmallLoader";

const ButtonActionCampus = ({ action, campusId, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);

    try {
      const isDeleted = action === "reactivate" ? false : true;
      await toast.promise(
        axios.put(`/campus/${campusId}`, { isDeleted }),
        {
          loading: isDeleted ? "Reactivating campus..." : "Deleting Campus...",
          success: isDeleted
            ? "Campus deleted successfully!"
            : "Campus reactivated successfully!",
          error: isDeleted
            ? "Failed to delete campus."
            : "Failed to reactivate campus.",
        },
        {
          position: "bottom-right",
          duration: 4500,
        },
      );
      setLoading(false);
      onSuccess();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(`Error: ${err.response.data.message}`, {
          position: "bottom-right",
          duration: 4500,
        });
      } else {
        toast.error("Failed to delete campus status", {
          position: "bottom-right",
          duration: 4500,
        });
      }
      setLoading(false);
    }
  };

  return (
    <Button
      className={`w-full ${action === "delete" ? "!bg-red-600 hover:!bg-red-700 focus:!bg-red-700" : action === "reactivate" ? "!bg-green-600 hover:!bg-green-700 focus:!bg-green-700" : ""} inline-flex gap-2 !rounded-md p-2 !text-sm !text-white underline-offset-4 hover:underline`}
      onClick={handleAction}
      disabled={loading}
    >
      {loading && <SmallLoader />}
      {loading ? "Loading..." : action === "delete" ? "Delete" : "Reactivate"}
    </Button>
  );
};

export default ButtonActionCampus;
