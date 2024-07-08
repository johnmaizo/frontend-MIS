/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import SmallLoader from "../styles/SmallLoader";

const ButtonActionStudent = ({ action, studentId, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    
    try {
      const isActive = action === "reactivate";
      await toast.promise(
        axios.put(`/students/${studentId}`, { isActive }),
        {
          loading: isActive ? "Reactivating student..." : "Deactivating student...",
          success: isActive ? "Student reactivated successfully!" : "Student deactivated successfully!",
          error: isActive ? "Failed to reactivate student." : "Failed to deactivate student.",
        },
        {
          position: "bottom-right",
          duration: 4500,
        }
      );
      setLoading(false);
      onSuccess();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(`Error: ${err.response.data.message}`, { position: "bottom-right", duration: 4500 });
      } else {
        toast.error("Failed to update student status", { position: "bottom-right", duration: 4500 });
      }
      setLoading(false);
    }
  };

  return (
    <Button
      className={`w-full ${action === "delete" ? "!bg-red-600 hover:!bg-red-700 focus:!bg-red-700" : action === "reactivate" ? "!bg-green-600 hover:!bg-green-700 focus:!bg-green-700" : ""} !rounded-md p-2 !text-sm !text-white underline-offset-4 hover:underline  inline-flex gap-2`}
      onClick={handleAction}
      disabled={loading}
    >
      {loading && <SmallLoader />}
      {loading ? "Loading..." : action === "delete" ? "Deactivate" : "Reactivate"}
    </Button>
  );
};

export default ButtonActionStudent;
