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

const EditFloor = ({ structureId, campusId, buildingName }) => {
  const { fetchFloors } = useSchool();
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
    if (structureId && open) {
      // Fetch the department data when the modal is opened
      setLoading(true);
      axios
        .get(`/building-structure/${structureId}`)
        .then((response) => {
          const building = response.data;
          // Pre-fill the form with building data
          setValue("buildingName", building.buildingName);
          setValue("floorName", building.floorName);
          setIsActive(building.isActive); // Set the initial status
          setLoading(false);
        })
        .catch((err) => {
          setError(`Failed to fetch building data: (${err})`);
          setLoading(false);
        });
    }
  }, [structureId, open, setValue]);

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
      isActive: isActive ? true : false, // Set isActive based on the switch value
      campus_id: campusId, // Add the selected campus to the form data
    };

    setError("");
    try {
      const response = await toast.promise(
        axios.put(`/building-structure/${structureId}`, transformedData),
        {
          loading: "Updating Floor...",
          success: "Floor updated successfully!",
          error: "Failed to update Floor.",
        },
        {
          position: "bottom-right",
          duration: 5000,
        },
      );

      if (response.data) {
        setSuccess(true);
        fetchFloors(buildingName, campusId);
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
            <EditDepartmentIcon forActions={"Edit Floor"} />
          </DialogTrigger>

          <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Edit Floor
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
                        htmlFor="blg_active"
                      >
                        Status{" "}
                        <span className="inline-block font-bold text-red-700">
                          *
                        </span>
                      </label>
                      <Switch
                        id="blg_active"
                        checked={isActive}
                        onCheckedChange={setIsActive} // Update the status when the switch is toggled
                        disabled={success || loading}
                      />
                    </div>

                    <div className="mb-4.5 w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="floor_name"
                      >
                        Floor Name
                      </label>
                      <input
                        id="floor_name"
                        type="text"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        {...register("floorName", {
                          required: {
                            value: true,
                            message: "Floor Name is required",
                          },
                          validate: {
                            notEmpty: (value) =>
                              value.trim() !== "" ||
                              "Floor Name cannot be empty or just spaces",
                          },
                        })}
                        disabled={loading || success}
                      />
                      {errors.floorName && (
                        <ErrorMessage>*{errors.floorName.message}</ErrorMessage>
                      )}
                    </div>

                    <div className="mb-4.5 w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="blg_name"
                      >
                        Building Name
                      </label>
                      <input
                        id="blg_name"
                        type="text"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        {...register("buildingName", {
                          required: {
                            value: true,
                            message: "Building Name is required",
                          },
                          validate: {
                            notEmpty: (value) =>
                              value.trim() !== "" ||
                              "Building Name cannot be empty or just spaces",
                          },
                        })}
                        disabled
                      />
                      {errors.buildingName && (
                        <ErrorMessage>
                          *{errors.buildingName.message}
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
                        ? "Updating Floor..."
                        : success
                          ? "Floor Updated!"
                          : "Update Floor"}
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

export default EditFloor;
