/* eslint-disable react/prop-types */
import { Button } from "../ui/button";

const ButtonAction = ({ action, id }) => {
  return (
    <Button
      className={`w-full ${action === "delete" ? "!bg-red-600 hover:!bg-red-700 focus:!bg-red-700" : action === "reactivate" ? "!bg-green-600 hover:!bg-green-700 focus:!bg-green-700" : ""} !rounded-md p-2 !text-sm !text-white underline-offset-4 hover:underline`}
    >
      {action === "delete" ? "Delete" : action === "reactivate" && "Reactivate"}
    </Button>
  );
};

export default ButtonAction;
