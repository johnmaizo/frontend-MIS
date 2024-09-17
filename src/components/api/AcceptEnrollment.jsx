/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { AddDepartmentIcon } from "../Icons";

const AcceptEnrollment = ({ applicantId, loading }) => {
  const [open, setOpen] = useState(false);
  const [error, setGeneralError] = useState("");
  const [success, setSuccess] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const navigate = useNavigate(); // Initialize the navigate function from react-router-dom

  const handleClick = async () => {
    setGeneralError("");
    setLocalLoading(true); // Set loading to true when the process starts
    try {
      const response = await toast.promise(
        axios.post("/enrollment/enroll-student", {
          applicant_id: applicantId,
        }),
        {
          loading: "Adding Enrollment...",
          success: "Enrollment Added successfully!",
          error: "Failed to add Enrollment.",
        },
        {
          position: "bottom-right",
          duration: 5000,
        },
      );

      if (response.data) {
        setSuccess(true);
        setOpen(false); // Close the dialog
        navigate(-1); // Navigate to the previous page on success
      }
      setLocalLoading(false); // Set loading to false after the process finishes
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setGeneralError(err.response.data.message);
      } else {
        setGeneralError("An unexpected error occurred. Please try again.");
      }
      console.log(err);
      setLocalLoading(false); // Set loading to false in case of an error
    }
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } else if (error) {
      setTimeout(() => {
        setGeneralError("");
      }, 6000);
    }
  }, [success, error]);

  return (
    <div className="w-full items-center justify-end gap-2 md:flex">
      <div>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            if (!localLoading) {
              setOpen(isOpen); // Prevent closing the dialog if loading
            }
          }}
          modal // This prevents closing the dialog via the backdrop click
        >
          <DialogTrigger
            className="flex w-full justify-center gap-1 rounded bg-green-600 p-3 text-white hover:bg-green-700 md:w-auto md:justify-normal"
            disabled={loading || localLoading} // Disable trigger while loading
          >
            {loading ? (
              "Loading..."
            ) : (
              <>
                <AddDepartmentIcon />
                <span className="max-w-[9em]">Accept Enrollment</span>
              </>
            )}
          </DialogTrigger>
          <DialogContent
            className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white"
            onClose={(e) => {
              e.preventDefault(); // Prevent any close action if loading
              if (!localLoading) setOpen(false); // Close only if not loading
            }}
          >
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Accept Enrollment
              </DialogTitle>
              <DialogDescription className="h-[20em] overflow-y-auto overscroll-none text-xl lg:h-auto">
                <div className="p-6.5">
                  <p className="pb-10">
                    Are you sure you want to accept this enrollment?
                  </p>

                  {error && (
                    <span className="mt-2 inline-block py-3 font-medium text-red-600">
                      Error: {error}
                    </span>
                  )}

                  <button
                    type="submit"
                    className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded bg-primary p-3.5 font-medium text-gray hover:bg-opacity-90 lg:text-base xl:text-lg"
                    onClick={handleClick}
                    disabled={loading || localLoading || success} // Disable the button while loading
                  >
                    {(localLoading || loading) && (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    )}
                    {localLoading || loading ? "Loading..." : "Accept"}
                  </button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AcceptEnrollment;
