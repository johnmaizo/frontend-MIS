/* eslint-disable react/prop-types */
import { useState, useContext } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import SmallLoader from "../styles/SmallLoader";
import { AuthContext } from "../context/AuthContext";

/**
 * @function ButtonActionPayment
 * @description A reusable button for performing an action on an entity.
 * @param {string} entityType The type of entity to perform the action on.
 * @param {number} entityId The ID of the entity to perform the action on.
 * @param {"accept" | "reject"} action The action to perform on the entity.
 * @param {() => void} onSuccess A callback function to call when the action is successful.
 * @returns {JSX.Element} A button element with the appropriate action and styling.
 */
const ButtonActionPayment = ({ entityType, entityId, action, onSuccess, loadingOutisde }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const handleAction = async () => {
    setLoading(true);

    try {
      if (entityType === "enrollment") {
        const endpoint = "/enrollment/enrollmentprocess";
        const data = {
          student_personal_id: entityId,
          allRoles: user.allRoles, // e.g., "Registrar, Accounting"
          specificRole: "Accounting",
          status: action === "accept" ? "accepted" : "rejected",
          payment_confirmed: action === "accept" ? true : false,
        };

        // const response = axios.put(endpoint, data);

        const response = await toast.promise(
          axios.put(endpoint, data),
          {
            loading:
              action === "accept"
                ? "Accepting payment..."
                : "Rejecting payment...",
            success:
              action === "accept"
                ? "Payment accepted successfully!"
                : "Payment rejected successfully!",
            error:
              action === "accept"
                ? "Failed to accept payment."
                : "Failed to reject payment.",
          },
          {
            position: "bottom-right",
            duration: 4500,
          },
        );

        if (response.data) {
          toast.success(response.data.message, {
            position: "bottom-right",
            duration: 5500,
          });
        }

        setLoading(false);
        onSuccess();
      } else {
        // Handle other entity types if necessary
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(`Error: ${err.response.data.message}`, {
          position: "bottom-right",
          duration: 4500,
        });
      } else {
        console.error(err);
        toast.error(`Failed to update enrollment status`, {
          position: "bottom-right",
          duration: 4500,
        });
      }
      setLoading(false);
    }
  };

  return (
    <Button
      className={`w-full ${
        action === "accept"
          ? "!bg-green-600 hover:!bg-green-700 focus:!bg-green-700"
          : action === "reject"
            ? "!bg-red-600 hover:!bg-red-700 focus:!bg-red-700"
            : ""
      } inline-flex gap-2 !rounded-md p-2 !text-sm !text-white underline-offset-4 hover:underline`}
      onClick={handleAction}
      disabled={loading || loadingOutisde}
    >
      {loading && <SmallLoader />}
      {loading
        ? "Loading..."
        : action === "accept"
          ? "Accept Payment"
          : "Reject Payment"}
    </Button>
  );
};

export default ButtonActionPayment;
