/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import SmallLoader from "../styles/SmallLoader";

const ButtonAction = ({ entityType, entityId, action, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);

    try {
      const isDeleted = action === "reactivate" ? false : true;
      const endpointMap = {
        campus: `/campus/${entityId}`,
        semester: `/semesters/${entityId}`,
        department: `/departments/${entityId}`,
        program: `/programs/${entityId}`,
        course: `/course/${entityId}`,
      };

      const successMessageMap = {
        campus: {
          delete: "Campus deleted successfully!",
          reactivate: "Campus reactivated successfully!",
        },
        semester: {
          delete: "Semester deleted successfully!",
          reactivate: "Semester reactivated successfully!",
        },
        department: {
          delete: "Department deleted successfully!",
          reactivate: "Department reactivated successfully!",
        },
        program: {
          delete: "Program deleted successfully!",
          reactivate: "Program reactivated successfully!",
        },
        course: {
          delete: "Course deleted successfully!",
          reactivate: "Course reactivated successfully!",
        },
      };

      const errorMessageMap = {
        campus: {
          delete: "Failed to delete campus.",
          reactivate: "Failed to reactivate campus.",
        },
        semester: {
          delete: "Failed to delete semester.",
          reactivate: "Failed to reactivate semester.",
        },
        department: {
          delete: "Failed to delete department.",
          reactivate: "Failed to reactivate department.",
        },
        program: {
          delete: "Failed to delete program.",
          reactivate: "Failed to reactivate program.",
        },
        course: {
          delete: "Failed to delete course.",
          reactivate: "Failed to reactivate course.",
        },
      };

      await toast.promise(
        axios.put(endpointMap[entityType], { isDeleted }),
        {
          loading: isDeleted
            ? `Deleting ${entityType}...`
            : `Reactivating ${entityType}...`,
          success: successMessageMap[entityType][action],
          error: errorMessageMap[entityType][action],
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
        toast.error(`Failed to update ${entityType} status`, {
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

export default ButtonAction;
