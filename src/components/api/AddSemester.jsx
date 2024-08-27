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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { AddDepartmentIcon } from "../Icons";
import { useSchool } from "../context/SchoolContext";

const AddSemester = () => {
  const { fetchSemesters } = useSchool();
  const [open, setOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(""); // State to hold the selected semester

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    clearErrors, // Added clearErrors to manually clear errors
  } = useForm();

  const [error, setGeneralError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    if (!selectedSemester) {
      setError("semester_name", {
        type: "manual",
        message: "You must select a semester.",
      });
      return;
    }

    setLoading(true);
    const transformedData = {
      ...Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value.trim() === "" ? null : value.trim(),
        ]),
      ),
      semesterName: selectedSemester, // Add the selected semester to the form data
    };

    setGeneralError("");
    try {
      const response = await toast.promise(
        axios.post("/semesters/add-semester", transformedData),
        {
          loading: "Adding semester...",
          success: "Semester Added successfully!",
          error: "Failed to add semester.",
        },
        {
          position: "bottom-right",
          duration: 5000,
        },
      );

      if (response.data) {
        setSuccess(true);
        fetchSemesters();
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
        setSelectedSemester(""); // Reset selected semester
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
            if (!isOpen) {
              reset(); // Reset form fields when the dialog is closed
              setSelectedSemester(""); // Reset selected semester
              clearErrors("semester_name"); // Clear semester selection error when dialog closes
            }
          }}
        >
          <DialogTrigger className="flex w-full justify-center gap-1 rounded bg-blue-600 p-3 text-white hover:bg-blue-700 md:w-auto md:justify-normal">
            <AddDepartmentIcon />
            <span className="max-w-[8em]">Add Semester </span>
          </DialogTrigger>
          <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Add new Semester
              </DialogTitle>
              <DialogDescription className="overflow-y-auto overscroll-none text-xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="p-6.5">
                    <div className="mb-4.5 w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="school_year"
                      >
                        School Year{" "}
                        <span className="inline-block font-bold text-red-700">
                          *
                        </span>
                      </label>
                      <input
                        placeholder="YYYY-YYYY"
                        id="school_year"
                        type="text"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        {...register("schoolYear", {
                          required: {
                            value: true,
                            message: "School Year is required",
                          },
                          validate: {
                            notEmpty: (value) =>
                              value.trim() !== "" ||
                              "School Year cannot be empty or just spaces",
                          },
                          pattern: {
                            value: /^\d{4}-\d{4}$/,
                            message: 'You must follow the format "YYYY-YYYY"',
                          },
                        })}
                        disabled={loading || success}
                      />
                      {errors.schoolYear && (
                        <ErrorMessage>
                          *{errors.schoolYear.message}
                        </ErrorMessage>
                      )}
                    </div>

                    <div className="mb-4.5 w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="semester_name"
                      >
                        Semester{" "}
                        <span className="inline-block font-bold text-red-700">
                          *
                        </span>
                      </label>

                      <Select
                        value={selectedSemester}
                        onValueChange={(value) => {
                          setSelectedSemester(value);
                          clearErrors("semester_name"); // Clear error when semester is selected
                        }}
                        disabled={loading || success}
                      >
                        <SelectTrigger className="h-[2.5em] w-full text-xl text-black dark:bg-form-input dark:text-white">
                          <SelectValue placeholder="Select Semester" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Semesters</SelectLabel>
                            <SelectItem
                              value="1st Semester"
                              className="text-[1.2rem] font-medium"
                            >
                              1st Semester
                            </SelectItem>
                            <SelectItem
                              value="2nd Semester"
                              className="text-[1.2rem] font-medium"
                            >
                              2nd Semester
                            </SelectItem>
                            <SelectItem
                              value="Summer"
                              className="text-[1.2rem] font-medium"
                            >
                              Summer
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.semester_name && (
                        <ErrorMessage>
                          *{errors.semester_name.message}
                        </ErrorMessage>
                      )}
                    </div>

                    {error && (
                      <p className="mb-5 text-center text-red-600">{error}</p>
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
                        ? "Adding Semester..."
                        : success
                          ? "Semester Added!"
                          : "Add Semester"}
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

// eslint-disable-next-line react/prop-types
const ErrorMessage = ({ children }) => {
  return (
    <span className="mt-2 inline-block text-sm font-medium text-red-600">
      {children}
    </span>
  );
};

export default AddSemester;
