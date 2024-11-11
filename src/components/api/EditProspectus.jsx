/* eslint-disable react/prop-types */
import { EditDepartmentIcon } from "../Icons";
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

import { useSchool } from "../context/SchoolContext";

import { Switch } from "../ui/switch";

import { ErrorMessage } from "../reuseable/ErrorMessage";
import useFetchProgramById from "../reuseable/useFetchProgramById";
import { useParams } from "react-router-dom";
import FormInput from "../reuseable/FormInput";

const EditProspectus = ({ prospectusID }) => {
  const { programCampusId, programCampusName, program_id, programCode } =
    useParams();

  const { fetchProspectus } = useSchool();

  const { program, programLoading } = useFetchProgramById(
    program_id,
    programCampusName,
  );

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true); // State for status switch

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (prospectusID && open) {
      // Fetch the prospectus data when the modal is opened
      setLoading(true);
      axios
        .get(`/prospectus/get-prospectus-by-id/${prospectusID}`)
        .then((response) => {
          const prospectus = response.data;
          // Pre-fill the form with prospectus data
          setValue("prospectusName", prospectus.prospectusName);
          setValue("prospectusDescription", prospectus.prospectusDescription);
          setIsActive(prospectus.isActive); // Set the initial status
          setLoading(false);
        })
        .catch((err) => {
          setError(`Failed to fetch prospectus data: (${err})`);
          setLoading(false);
        });
    }
  }, [prospectusID, open, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    // Add isActive and selectedCampus to the form data
    const transformedData = {
      ...Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value.trim() === "" ? null : value.trim(),
        ]),
      ),
      program_id: program_id,
      campusName: programCampusName,
      isActive: isActive ? true : false, // Set isActive based on the switch value
    };

    setError("");
    try {
      const response = await toast.promise(
        axios.put(`/prospectus/update-prospectus/${prospectusID}`, transformedData),
        {
          loading: "Updating Prospectus...",
          success: "Prospectus updated successfully!",
          error: "Failed to update Prospectus.",
        },
        {
          position: "bottom-right",
          duration: 5000,
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
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
        reset();
      }, 5000);
    } else if (error) {
      setTimeout(() => {
        setError("");
      }, 6000);
    }
  }, [success, error, reset]);

  return (
    <div className="flex items-center justify-end gap-2">
      <div>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
              reset(); // Reset form fields when the dialog is closed
            }

            if (!loading) {
              setOpen(isOpen); // Prevent closing the dialog if loading
            }
          }}
        >
          <DialogTrigger className="flex gap-1 rounded p-2 text-black hover:text-blue-700 dark:text-white dark:hover:text-blue-700">
            <EditDepartmentIcon />
          </DialogTrigger>

          <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Edit Prospectus
              </DialogTitle>
              <DialogDescription className="sr-only">
                <span className="inline-block font-bold text-red-700">*</span>{" "}
                Edit, Click Add when you&apos;re done.
              </DialogDescription>
              <div className="h-[20em] overflow-y-auto overscroll-none text-xl lg:h-auto">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="p-6.5">
                    <div className="w-full pb-3 xl:w-[12em]">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="department_active"
                      >
                        Status{" "}
                        <span className="inline-block font-bold text-red-700">
                          *
                        </span>
                      </label>
                      <Switch
                        id="department_active"
                        checked={isActive}
                        onCheckedChange={setIsActive} // Update the status when the switch is toggled
                        disabled={success || loading}
                      />
                    </div>

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
                      <span className="mt-2 inline-block pb-6 font-medium text-red-600">
                        Error: {error}
                      </span>
                    )}

                    <button
                      type="submit"
                      className={`inline-flex w-full justify-center gap-2 rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 ${
                        loading || success
                          ? "bg-[#505456] hover:!bg-opacity-100"
                          : ""
                      }`}
                      disabled={loading || success}
                    >
                      {loading && (
                        <span className="block h-6 w-6 animate-spin rounded-full border-4 border-solid border-secondary border-t-transparent"></span>
                      )}
                      {loading
                        ? "Updating Prospectus..."
                        : success
                          ? "Prospectus Updated!"
                          : "Update Prospectus"}
                    </button>
                  </div>
                </form>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EditProspectus;
