/* eslint-disable react/prop-types */
import { EditDepartmentIcon } from "../Icons";
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

import { useSchool } from "../context/SchoolContext";
import { AuthContext } from "../context/AuthContext";

import { Switch } from "../ui/switch";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { ErrorMessage } from "../reuseable/ErrorMessage";

const EditBuilding = ({ structureId }) => {
  const { user } = useContext(AuthContext);

  const { fetchBuildings, campusActive } = useSchool();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true); // State for status switch

  const [selectedCampus, setSelectedCampus] = useState(""); // State for selected campus

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    clearErrors, // Added clearErrors to manually clear errors
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
          setIsActive(building.isActive); // Set the initial status
          setSelectedCampus(building.campus_id.toString()); // Set the initial campus
          setLoading(false);
        })
        .catch((err) => {
          setError(`Failed to fetch building data: (${err})`);
          setLoading(false);
        });
    }
  }, [structureId, open, setValue]);

  const onSubmit = async (data) => {
    if (!selectedCampus) {
      setError("campus_id", "You must select a campus.");
      return;
    }

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
      campus_id: parseInt(selectedCampus), // Add the selected campus to the form data
    };

    setError("");
    try {
      const response = await toast.promise(
        axios.put(`/building-structure/${structureId}`, transformedData),
        {
          loading: "Updating Building...",
          success: "Building updated successfully!",
          error: "Failed to update Building.",
        },
        {
          position: "bottom-right",
          duration: 5000,
        },
      );

      if (response.data) {
        setSuccess(true);
        fetchBuildings();
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
              setSelectedCampus(""); // Reset selected campus
              clearErrors("campus_id"); // Clear campus selection error when dialog closes
            }
          }}
        >
          <DialogTrigger className="flex gap-1 rounded p-2 text-black hover:text-blue-700 dark:text-white dark:hover:text-blue-700">
            <EditDepartmentIcon forActions={"Edit Building"} />
          </DialogTrigger>

          <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Edit Building
              </DialogTitle>
              <DialogDescription className="h-[20em] overflow-y-auto overscroll-none text-xl lg:h-auto">
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
                        disabled={loading || success}
                      />
                      {errors.buildingName && (
                        <ErrorMessage>
                          *{errors.buildingName.message}
                        </ErrorMessage>
                      )}
                    </div>

                    <div className="mb-4.5 w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="campus"
                      >
                        Campus
                      </label>

                      {user.role !== "SuperAdmin" ? (
                        <input
                          id="campus"
                          type="text"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          value={
                            campusActive.find(
                              (campus) =>
                                campus.campus_id.toString() === selectedCampus,
                            )?.campusName || ""
                          }
                          disabled
                        />
                      ) : (
                        <Select
                          onValueChange={(value) => {
                            setSelectedCampus(value);
                            clearErrors("campus_id");
                          }}
                          value={selectedCampus}
                          disabled={success || loading}
                        >
                          <SelectTrigger className="h-[2.5em] w-full text-xl text-black dark:bg-form-input dark:text-white">
                            <SelectValue placeholder="Select a campus" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Campuses</SelectLabel>
                              {campusActive.map((campus) => (
                                <SelectItem
                                  key={campus.campus_id}
                                  value={campus.campus_id.toString()}
                                >
                                  {campus.campusName}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}

                      {errors.campus_id && (
                        <ErrorMessage>{errors.campus_id.message}</ErrorMessage>
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
                        ? "Updating Building..."
                        : success
                          ? "Building Updated!"
                          : "Update Building"}
                    </button>
                  </div>
                </form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EditBuilding;