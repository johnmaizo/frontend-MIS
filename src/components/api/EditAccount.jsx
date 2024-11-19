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

import { Switch } from "../ui/switch";

import { useSchool } from "../context/SchoolContext";

import { ErrorMessage } from "../reuseable/ErrorMessage";
import FormInput from "../reuseable/FormInput";

const EditAccount = ({ accountID }) => {
  const { fetchAccounts } = useSchool();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (accountID && open) {
      // Fetch the account data when the modal is opened
      setLoading(true);
      axios
        .get(`/accounts/${accountID}`)
        .then((response) => {
          const account = response.data;

          setValue("email", account.email);
          setLoading(false);
        })
        .catch((err) => {
          setError(`Failed to fetch account data: (${err})`);
          setLoading(false);
        });
    }
  }, [accountID, open, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);

    // Transform form data
    const transformedData = {
      ...Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value.trim() === "" ? null : value.trim(),
        ]),
      ),
      employee_id: parseInt(accountID),
    };

    // Remove password fields if changePassword is false
    if (!changePassword) {
      delete transformedData.password;
      delete transformedData.confirmPassword;
    }

    setError("");
    try {
      const response = await toast.promise(
        axios.put(`/accounts/${accountID}`, transformedData),
        {
          loading: "Updating Account...",
          success: "Account updated successfully!",
          error: "Failed to update Account.",
        },
        {
          position: "bottom-right",
          duration: 5000,
        },
      );

      if (response.data) {
        setSuccess(true);
        fetchAccounts();
        setOpen(false); // Close the dialog
      }
      setLoading(false);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
        reset();
        setChangePassword(false);
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
            if (!loading) {
              setOpen(isOpen);
              if (!isOpen) {
                reset(); // Reset form fields when the dialog is closed
                setChangePassword(false); // Reset changePassword state
              }
            }
          }}
        >
          <DialogTrigger className="flex gap-1 rounded p-2 text-black hover:text-blue-700 dark:text-white dark:hover:text-blue-700">
            <EditDepartmentIcon forActions={"Edit Account"} />
          </DialogTrigger>

          <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Edit Account
              </DialogTitle>
              <DialogDescription className="sr-only">
                <span className="inline-block font-bold text-red-700">*</span>{" "}
                Edit, Click Update when you&apos;re done.
              </DialogDescription>
              <div className="h-[20em] overflow-y-auto overscroll-none text-xl lg:h-auto">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="p-6.5">
                    <div className="mb-4.5 w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="email"
                      >
                        Email{" "}
                        <span className="inline-block font-bold text-red-700">
                          *
                        </span>
                      </label>
                      <FormInput
                        id="email"
                        placeholder="Email"
                        register={register}
                        validationRules={{
                          required: {
                            value: true,
                            message: "Email is required",
                          },
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email address",
                          },
                          validate: {
                            notEmpty: (value) =>
                              value.trim() !== "" ||
                              "Email cannot be empty or just spaces",
                          },
                        }}
                        disabled={loading || success}
                      />
                      {errors.email && (
                        <ErrorMessage>*{errors.email.message}</ErrorMessage>
                      )}
                    </div>

                    <div className="mb-4.5 flex w-full items-center">
                      <label className="mr-2 text-black dark:text-white">
                        Change Password
                      </label>
                      <Switch
                        checked={changePassword}
                        onCheckedChange={(checked) =>
                          setChangePassword(checked)
                        }
                        disabled={loading || success}
                      />
                    </div>

                    {changePassword && (
                      <>
                        <div className="mb-4.5 w-full">
                          <label
                            className="mb-2.5 block text-black dark:text-white"
                            htmlFor="password"
                          >
                            Password{" "}
                            <span className="inline-block font-bold text-red-700">
                              *
                            </span>
                          </label>
                          <FormInput
                            id="password"
                            type="password"
                            placeholder="Password"
                            register={register}
                            validationRules={{
                              required: changePassword
                                ? {
                                    value: true,
                                    message: "Password is required",
                                  }
                                : false,
                              validate: changePassword
                                ? {
                                    notEmpty: (value) =>
                                      value.trim() !== "" ||
                                      "Password cannot be empty or just spaces",
                                    passwordStrength: (value) => {
                                      const password = value.trim();
                                      if (password.length < 8) {
                                        return "Password must be at least 8 characters long";
                                      }
                                      // Add more password strength checks if needed
                                      return true;
                                    },
                                  }
                                : {},
                            }}
                            disabled={loading || success}
                          />
                          {errors.password && (
                            <ErrorMessage>
                              *{errors.password.message}
                            </ErrorMessage>
                          )}
                        </div>

                        <div className="mb-4.5 w-full">
                          <label
                            className="mb-2.5 block text-black dark:text-white"
                            htmlFor="confirmPassword"
                          >
                            Confirm Password{" "}
                            <span className="inline-block font-bold text-red-700">
                              *
                            </span>
                          </label>
                          <FormInput
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            register={register}
                            validationRules={{
                              required: changePassword
                                ? {
                                    value: true,
                                    message: "Confirm Password is required",
                                  }
                                : false,
                              validate: changePassword
                                ? {
                                    notEmpty: (value) =>
                                      value.trim() !== "" ||
                                      "Confirm Password cannot be empty or just spaces",
                                    matchesPassword: (value) =>
                                      value === getValues("password") ||
                                      "Passwords do not match",
                                  }
                                : {},
                            }}
                            disabled={loading || success}
                          />
                          {errors.confirmPassword && (
                            <ErrorMessage>
                              *{errors.confirmPassword.message}
                            </ErrorMessage>
                          )}
                        </div>
                      </>
                    )}

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
                        ? "Updating Account..."
                        : success
                          ? "Account Updated!"
                          : "Update Account"}
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

export default EditAccount;
