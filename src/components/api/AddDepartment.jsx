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
import { useStudents } from "../context/StudentContext";

const AddDepartment = () => {
  const { fetchDepartments, campusActive, fetchCampusActive } = useStudents();
  const [open, setOpen] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState(""); // State to hold the selected campus

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCampusActive();
    console.log(campusActive);
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    // Transform form data to replace empty strings or strings with only spaces with null
    const transformedData = {
      ...data,
      campus_id: parseInt(selectedCampus), // Add the selected campus to the form data
    };

    console.log(transformedData);

    setError("");
    try {
      const response = await toast.promise(
        axios.post("/departments/add-department", transformedData),
        {
          loading: "Adding Department...",
          success: "Department Added successfully!",
          error: "Failed to add Department.",
        },
        {
          position: "bottom-right",
          duration: 5000,
        },
      );

      if (response.data) {
        setSuccess(true);
        fetchDepartments();
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
        setSelectedCampus(""); // Reset selected campus
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
              setSelectedCampus(""); // Reset selected campus
            }
          }}
        >
          <DialogTrigger className="flex gap-1 rounded bg-blue-600 p-3 text-white hover:bg-blue-700">
            <AddDepartmentIcon />
            <span className="max-w-[8em]">Add Department </span>
          </DialogTrigger>
          <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Add new Department
              </DialogTitle>
              <DialogDescription className="overflow-y-auto overscroll-none text-xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="p-6.5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-[12em]">
                        <label
                          className="mb-2.5 block text-black dark:text-white"
                          htmlFor="dept_code"
                        >
                          Department Code
                        </label>
                        <input
                          id="dept_code"
                          type="text"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          {...register("departmentCode", {
                            required: {
                              value: true,
                              message: "Department Code is required",
                            },
                            validate: {
                              notEmpty: (value) =>
                                value.trim() !== "" ||
                                "Department Code cannot be empty or just spaces",
                            },
                          })}
                          disabled={success}
                        />
                        {errors.departmentCode && (
                          <ErrorMessage>
                            *{errors.departmentCode.message}
                          </ErrorMessage>
                        )}
                      </div>

                      <div className="w-full">
                        <label
                          className="mb-2.5 block text-black dark:text-white"
                          htmlFor="dept_name"
                        >
                          Department Name
                        </label>
                        <input
                          id="dept_name"
                          type="text"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          {...register("departmentName", {
                            required: {
                              value: true,
                              message: "Department Name is required",
                            },
                            validate: {
                              notEmpty: (value) =>
                                value.trim() !== "" ||
                                "Department Name cannot be empty or just spaces",
                            },
                          })}
                          disabled={success}
                        />
                        {errors.departmentName && (
                          <ErrorMessage>
                            *{errors.departmentName.message}
                          </ErrorMessage>
                        )}
                      </div>
                    </div>

                    <div className="mb-4.5 w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="dept_dean"
                      >
                        Department Dean
                      </label>
                      <input
                        id="dept_dean"
                        type="text"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        {...register("departmentDean", {
                          required: {
                            value: true,
                            message: "Department Dean is required",
                          },
                          validate: {
                            notEmpty: (value) =>
                              value.trim() !== "" ||
                              "Department Dean cannot be empty or just spaces",
                          },
                        })}
                        disabled={success}
                      />
                      {errors.departmentDean && (
                        <ErrorMessage>
                          *{errors.departmentDean.message}
                        </ErrorMessage>
                      )}
                    </div>

                    <div className="mb-4.5 w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="dept_campus"
                      >
                        Campus
                      </label>

                      <Select
                        value={selectedCampus}
                        onValueChange={(value) => {
                          setSelectedCampus(value);
                          console.log("Value: ", value);
                          console.log("Selected Campus: ", selectedCampus);
                        }}
                      >
                        <SelectTrigger className="h-[2.5em] w-full text-xl">
                          <SelectValue placeholder="Select campus" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Campus</SelectLabel>
                            {campusActive && campusActive.length ? (
                              campusActive.map((campus) => (
                                <SelectItem
                                  key={campus.campus_id}
                                  value={campus.campus_id.toString()}
                                >
                                  {campus.campusName}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem disabled>
                                (Empty, Please add new Course)
                              </SelectItem>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      {errors.campus_id && (
                        <ErrorMessage>*{errors.campus_id.message}</ErrorMessage>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="mt-5 inline-flex w-full cursor-pointer items-center justify-center rounded bg-primary p-3.5 font-medium text-gray hover:bg-opacity-90 lg:text-base xl:text-lg"
                      disabled={loading || success}
                    >
                      {loading ? (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      ) : (
                        "Add Department"
                      )}
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

export default AddDepartment;
