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

const EditCampus = ({ campusId }) => {
  const { fetchCampus } = useSchool();
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
    if (campusId && open) {
      // Fetch the campus data when the modal is opened
      setLoading(true);
      axios
        .get(`/campus/${campusId}`)
        .then((response) => {
          const campus = response.data;
          // Pre-fill the form with campus data
          setValue("campusName", campus.campusName);
          setValue("campusAddress", campus.campusAddress);
          setIsActive(campus.isActive); // Set the initial status
          setLoading(false);
        })
        .catch((err) => {
          setError(`Failed to fetch campus data: (${err})`);
          setLoading(false);
        });
    }
  }, [campusId, open, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    // Add isActive to the form data
    const transformedData = {
      ...Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value.trim() === "" ? null : value.trim(),
        ]),
      ),
      isActive: isActive ? true : false, // Set isActive based on the switch value
    };

    setError("");
    try {
      const response = await toast.promise(
        axios.put(`/campus/${campusId}`, transformedData),
        {
          loading: "Updating Campus...",
          success: "Campus updated successfully!",
          error: "Failed to update Campus.",
        },
        {
          position: "bottom-right",
          duration: 5000,
        },
      );

      if (response.data) {
        setSuccess(true);
        fetchCampus();
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

  useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(
        `[name="${firstErrorField}"]`,
      );
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement.focus();
      }
    }
  }, [errors]);

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
            <EditDepartmentIcon forActions={"Edit Campus"} />
          </DialogTrigger>

          <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Edit Campus
              </DialogTitle>
              <DialogDescription className="sr-only">
                <span className="inline-block font-bold text-red-700">*</span>{" "}
                Edit, Click Add when you&apos;re done.
              </DialogDescription>
              <div className="overflow-y-auto overscroll-none text-xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="p-6.5">
                    <div className="mb-5 w-full xl:w-[12em]">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="campus_active"
                      >
                        Status{" "}
                        <span className="inline-block font-bold text-red-700">
                          *
                        </span>
                      </label>
                      <Switch
                        id="campus_active"
                        checked={isActive}
                        onCheckedChange={setIsActive} // Update the status when the switch is toggled
                        disabled={success || loading}
                      />
                    </div>

                    <div className="mb-4.5 w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="campus_name"
                      >
                        Campus Name{" "}
                        <span className="inline-block font-bold text-red-700">
                          *
                        </span>
                      </label>
                      <input
                        id="campus_name"
                        type="text"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        {...register("campusName", {
                          required: {
                            value: true,
                            message: "Campus Name is required",
                          },
                          validate: {
                            notEmpty: (value) =>
                              value.trim() !== "" ||
                              "Campus Name cannot be empty or just spaces",
                          },
                        })}
                        disabled={success || loading}
                      />
                      {errors.campusName && (
                        <ErrorMessage>
                          *{errors.campusName.message}
                        </ErrorMessage>
                      )}
                    </div>

                    <div className="mb-4.5 w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="dept_name"
                      >
                        Campus Address{" "}
                        <span className="inline-block font-bold text-red-700">
                          *
                        </span>
                      </label>
                      <input
                        id="dept_name"
                        type="text"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        {...register("campusAddress", {
                          required: {
                            value: true,
                            message: "Campus Address is required",
                          },
                          validate: {
                            notEmpty: (value) =>
                              value.trim() !== "" ||
                              "Campus Address cannot be empty or just spaces",
                          },
                        })}
                        disabled={success || loading}
                      />
                      {errors.campusAddress && (
                        <ErrorMessage>
                          *{errors.campusAddress.message}
                        </ErrorMessage>
                      )}
                    </div>

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
                        ? "Updating Campus..."
                        : success
                          ? "Campus Updated!"
                          : "Update Campus"}
                    </button>
                  </div>
                </form>

                {error && (
                  <div className="mb-5 text-center text-red-600">{error}</div>
                )}
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const ErrorMessage = ({ children }) => {
  return (
    <span className="mt-2 inline-block text-sm font-medium text-red-600">
      {children}
    </span>
  );
};

export default EditCampus;
