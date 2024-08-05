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
import { useStudents } from "../context/StudentContext";

const AddDepartment = () => {
  const { fetchDepartments } = useStudents();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    // Transform form data to replace empty strings or strings with only spaces with null
    const transformedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value.trim() === "" ? null : value.trim(),
      ]),
    );

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
        setOpen(false);
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
      <p className="max-w-[8em]">Add Department </p>
      <div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="rounded bg-blue-600 p-1 text-white hover:bg-blue-700">
            <AddDepartmentIcon />
          </DialogTrigger>
          <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Add new Department
              </DialogTitle>
              {/* <DialogDescription className="h-[20em] overflow-y-auto overscroll-none text-xl"> */}
              <DialogDescription className=" overflow-y-auto overscroll-none text-xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="p-6.5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-[12em]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Department Code
                        </label>
                        <input
                          type="text"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          {...register("departmentCode", {
                            required: {
                              value: true,
                              message: "Department Code is required",
                            },
                          })}
                          disabled={success}
                        />
                        {errors.departmentCode?.type === "required" && (
                          <ErrorMessage>
                            *{errors.departmentCode.message}
                          </ErrorMessage>
                        )}
                      </div>

                      <div className="w-full">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Department Name
                        </label>
                        <input
                          type="text"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          {...register("departmentName", {
                            required: {
                              value: true,
                              message: "Department Name is required",
                            },
                          })}
                          disabled={success}
                        />
                        {errors.departmentName?.type === "required" && (
                          <ErrorMessage>
                            *{errors.departmentName.message}
                          </ErrorMessage>
                        )}
                      </div>
                    </div>

                    {/* <div className="mb-4.5">
                      
                    </div> */}

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
                        ? "Adding Department..."
                        : success
                          ? "Department Added!"
                          : "Add Department"}
                    </button>
                  </div>
                </form>

                {error && (
                  <div className="mb-5 text-center text-red-600">{error}</div>
                )}
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
