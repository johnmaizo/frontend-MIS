/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
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
import { AuthContext } from "../context/AuthContext";

import { ErrorMessage } from "../reuseable/ErrorMessage";

const AddFloor = ({ buildingName, campusId }) => {
  const { user } = useContext(AuthContext);

  const { fetchFloors, buildings } = useSchool();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [error, setGeneralError] = useState("");
  const [success, setSuccess] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const onSubmit = async (data) => {
    setLocalLoading(true);
    const transformedData = {
      ...Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value.trim() === "" ? null : value.trim(),
        ]),
      ),

      campus_id:
        user && user.campus_id ? parseInt(user.campus_id) : parseInt(campusId), // Use user.campus_id if available
      isFloor: true,
      buildingName: buildingName,
    };

    setGeneralError("");
    try {
      const response = await toast.promise(
        axios.post("/building-structure/add-structure", transformedData),
        {
          loading: "Adding Floor...",
          success: "Floor Added successfully!",
          error: "Failed to add Floor.",
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
      setLocalLoading(false);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setGeneralError(err.response.data.message);
      } else {
        setGeneralError("An unexpected error occurred. Please try again.");
      }
      setLocalLoading(false);
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
        setGeneralError("");
      }, 6000);
    }
  }, [success, error, reset]);

  return (
    <div className="w-full items-center justify-end gap-2 md:flex">
      <div>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);

            if (!localLoading) {
              setOpen(isOpen); // Prevent closing the dialog if loading
            }
          }}
        >
          <DialogTrigger className="flex w-full justify-center gap-1 rounded bg-blue-600 p-3 text-white hover:bg-blue-700 md:w-auto md:justify-normal">
            <AddDepartmentIcon />
            <span className="max-w-[8em]">Add Floor </span>
          </DialogTrigger>
          <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Add new Floor ({buildingName})
              </DialogTitle>
              <DialogDescription className="sr-only">
                <span className="inline-block font-bold text-red-700">*</span>{" "}
                Fill up, Click Add when you&apos;re done.
              </DialogDescription>
              <div className="h-[20em] overflow-y-auto overscroll-none text-xl lg:h-auto">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="p-6.5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full">
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
                          disabled={localLoading || success}
                        />
                        {errors.floorName && (
                          <ErrorMessage>
                            *{errors.floorName.message}
                          </ErrorMessage>
                        )}
                      </div>
                    </div>

                    <div className="mb-4.5 w-full">
                      <span className="mb-2.5 block text-black dark:text-white">
                        Building
                      </span>
                      <input
                        id="building_name"
                        type="text"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={
                          buildings.find(
                            (building) =>
                              building.buildingName.toString() === buildingName,
                          )?.buildingName || ""
                        }
                        disabled
                      />
                    </div>

                    {error && (
                      <span className="mt-2 inline-block py-3 font-medium text-red-600">
                        Error: {error}
                      </span>
                    )}

                    <button
                      type="submit"
                      className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded bg-primary p-3.5 font-medium text-gray hover:bg-opacity-90 lg:text-base xl:text-lg"
                      disabled={localLoading || success}
                    >
                      {localLoading && (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      )}
                      {localLoading ? "Loading..." : "Add Floor"}
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

export default AddFloor;
