/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { AddDepartmentIcon } from "../Icons";
import { useSchool } from "../context/SchoolContext";
import { useParams } from "react-router-dom";

import useFetchProgramById from "../reuseable/useFetchProgramById";

import { ErrorMessage } from "../reuseable/ErrorMessage";

import ConfirmCloseDialog from "../reuseable/ConfirmCloseDialog";
import FormInput from "../reuseable/FormInput";

const AddProspectus = () => {
  const { programCampusId, programCampusName, program_id, programCode } =
    useParams();

  const { fetchProspectus } = useSchool();

  const { program, programLoading } = useFetchProgramById(
    program_id,
    programCampusName,
  );

  const [open, setOpen] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    clearErrors, // Added clearErrors to manually clear errors
  } = useForm();

  const [error, setGeneralError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    // Transform form data to replace empty strings or strings with only spaces with null
    const transformedData = {
      ...Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value.trim() === "" ? null : value.trim(),
        ]),
      ),
      campusName: programCampusName,
      program_id: program_id,
      programCode: program.programCode,
    };

    setGeneralError("");
    try {
      const response = await toast.promise(
        axios.post("/prospectus/add-prospectus", transformedData),
        {
          loading: "Assigning Prospectus...",
          success: "Assigned Prospectus successfully!",
          error: "Failed to Assign Prospectus.",
        },
        {
          position: "bottom-right",
        },
      );

      if (response.data) {
        setSuccess(true);
        fetchProspectus(
          programCampusId,
          programCampusName,
          program_id,
          programCode,
        );
        setOpen(false); // Close the dialog
      }
      setLoading(false);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setGeneralError(err.response.data.message);
      } else {
        setGeneralError("An unexpected error occurred. Please try again.");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
        reset();
      }, 2000);
    } else if (error) {
      setTimeout(() => {
        setGeneralError("");
      }, 3000);
    }
  }, [success, error, reset]);

  const [confirmClose, setConfirmClose] = useState(false); // State for confirmation dialog

  // Handle the close button of AddAccount dialog
  const handleDialogClose = (isOpen) => {
    if (!isOpen) {
      // If user is trying to close the dialog, show the confirmation dialog
      setConfirmClose(true);
    } else {
      // If dialog is opening, just open it normally
      setOpen(true);
    }
  };

  // Confirm closing both dialogs
  const confirmDialogClose = () => {
    setConfirmClose(false);
    setOpen(false); // Close the AddAccount dialog

    reset(); // Reset form fields
    clearErrors("courseChoose"); // Clear campus selection error when dialog closes
  };

  return (
    <div className="w-full items-center justify-end gap-2 md:flex">
      <div>
        <Dialog open={open} onOpenChange={handleDialogClose}>
          <DialogTrigger
            className="flex w-full justify-center gap-1 rounded bg-blue-600 p-3 text-white hover:bg-blue-700 md:w-auto md:justify-normal"
            onClick={() => setOpen(true)}
          >
            <AddDepartmentIcon />
            <span className="max-w-[8em]">Add Prospectus </span>
          </DialogTrigger>
          <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white lg:max-w-[50em]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Add new Prospectus
              </DialogTitle>
              <DialogDescription className="sr-only">
                <span className="inline-block font-bold text-red-700">*</span>{" "}
                Fill up, Click Add when you&apos;re done.
              </DialogDescription>
              <div className="overflow-y-auto overscroll-none text-xl md:!h-[21.7em]">
                <form onSubmit={handleSubmit(onSubmit)} className="h-full">
                  <div className="p-6.5">
                    <div className="mb-4.5 w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="program_code"
                      >
                        Program
                      </label>
                      <input
                        id="program_code"
                        type="text"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={
                          programLoading
                            ? "Loading..."
                            : `${program?.programCode} - ${program?.programDescription}`
                        }
                        disabled
                      />
                    </div>

                    <div className="mb-4.5 w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="prospectusName"
                      >
                        Prospectus Name
                      </label>
                      <FormInput
                        id="prospectusName"
                        placeholder="Prospectus Name"
                        register={register}
                        validationRules={{
                          required: {
                            value: true,
                            message: "Prospectus Name is required",
                          },
                          validate: {
                            notEmpty: (value) =>
                              value.trim() !== "" ||
                              "Prospectus Name cannot be empty or just spaces",
                          },
                        }}
                        disabled={loading || success}
                      />

                      {errors.prospectusName && (
                        <ErrorMessage>
                          *{errors.prospectusName.message}
                        </ErrorMessage>
                      )}
                    </div>

                    <div className="mb-4.5 w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="prospectusDescription"
                      >
                        Prospectus Description
                      </label>
                      <FormInput
                        id="prospectusDescription"
                        placeholder="Prospectus Description"
                        register={register}
                        validationRules={{
                          required: {
                            value: true,
                            message: "Prospectus Description is required",
                          },
                          validate: {
                            notEmpty: (value) =>
                              value.trim() !== "" ||
                              "Prospectus Description cannot be empty or just spaces",
                          },
                        }}
                        disabled={loading || success}
                      />

                      {errors.prospectusDescription && (
                        <ErrorMessage>
                          *{errors.prospectusDescription.message}
                        </ErrorMessage>
                      )}
                    </div>

                    {error && (
                      <div className="mb-5 text-center text-red-600">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      className={`mt-auto inline-flex w-full justify-center gap-2 rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 ${
                        loading || success
                          ? "bg-[#505456] hover:!bg-opacity-100"
                          : ""
                      }`}
                      disabled={loading || programLoading || success || error}
                    >
                      {loading && (
                        <span className="block h-6 w-6 animate-spin rounded-full border-4 border-solid border-secondary border-t-transparent"></span>
                      )}
                      {loading
                        ? "Adding Prospectus..."
                        : programLoading
                          ? "Loading..."
                          : success
                            ? "Prospectus Added!"
                            : "Add Prospectus"}
                    </button>
                  </div>
                </form>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <ConfirmCloseDialog
          isOpen={confirmClose}
          onConfirmClose={confirmDialogClose} // Confirm and close both dialogs
          onCancel={() => setConfirmClose(false)} // Cancel closing
        />
      </div>
    </div>
  );
};

export default AddProspectus;
