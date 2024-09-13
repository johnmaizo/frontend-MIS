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

import { ErrorMessage } from "../reuseable/ErrorMessage";

const AddStudent = () => {
  const { fetchStudents } = useSchool();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [gender, setGender] = useState("");
  const [civilStat, setCivilStat] = useState("");
  const [isAcrStudent, setIsAcrStudent] = useState(false);

  const [isOptionSelected, setIsOptionSelected] = useState(false);

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
        axios.post("/students/add-student", transformedData),
        {
          loading: "Adding Student...",
          success: "Student Added successfully!",
          error: "Failed to add student.",
        },
        {
          position: "bottom-right",
          duration: 5000,
        },
      );

      if (response.data) {
        setSuccess(true);

        fetchStudents(); // Fetch students after successful submission
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
        setCivilStat("");
        setGender("");
        setIsAcrStudent(false);
        setIsOptionSelected(false);
      }, 5000);
    } else if (error) {
      setTimeout(() => {
        setError("");
      }, 6000);
    }
  }, [success, error, reset]);

  const validateBirthDate = (value) => {
    const birthYear = new Date(value).getFullYear();
    const currentYear = new Date().getFullYear();
    return (
      birthYear >= 1900 &&
      birthYear < currentYear &&
      birthYear <= currentYear - 10
    ); // which is 13 years old
  };

  const validateContactNumber = (value) => {
    if (value.startsWith("+63")) {
      return (
        value.length === 13 ||
        'Contact number must be 13 digits long when starting with "+63"'
      );
    } else if (value.startsWith("09")) {
      return (
        value.length === 11 ||
        'Contact number must be 11 digits long when starting with "09"'
      );
    } else {
      return 'Contact number must start with "+63" or "09"';
    }
  };

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
    <>
      <div className="rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="text-2xl font-medium text-black dark:text-white">
            Add Student Information
          </h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6.5">
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  First name
                </label>
                <input
                  type="text"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  {...register("firstName", {
                    required: {
                      value: true,
                      message: "First name is required",
                    },
                  })}
                  disabled={success}
                />

                {errors.firstName?.type === "required" && (
                  <ErrorMessage>*{errors.firstName.message}</ErrorMessage>
                )}
              </div>

              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Middle name
                </label>
                <input
                  type="text"
                  placeholder="*Leave blank if not applicable"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  {...register("middleName")}
                  disabled={success}
                />
              </div>

              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Last name
                </label>
                <input
                  type="text"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  {...register("lastName", {
                    required: { value: true, message: "Last name is required" },
                  })}
                  disabled={success}
                />
                {errors.lastName?.type === "required" && (
                  <ErrorMessage>*{errors.lastName.message}</ErrorMessage>
                )}
              </div>
            </div>

            <div className="mb-4.5 flex flex-col justify-between gap-6 xl:flex-row">
              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Gender
                </label>
                <select
                  {...register("gender", {
                    required: { value: true, message: "Gender is required" },
                  })}
                  onChange={(e) => setGender(e.target.value)}
                  value={gender}
                  className={`relative z-20 w-full rounded border border-stroke bg-transparent !p-[0.85em] px-5 py-3 outline-none transition hover:cursor-pointer focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                    isOptionSelected
                      ? "text-black dark:text-white"
                      : success
                        ? "hover:cursor-auto"
                        : ""
                  }`}
                  disabled={success}
                >
                  <option
                    value=""
                    disabled
                    className="text-body dark:text-bodydark"
                    selected
                  >
                    Select
                  </option>
                  <option value="Male" className="text-body dark:text-bodydark">
                    Male
                  </option>
                  <option
                    value="Female"
                    className="text-body dark:text-bodydark"
                  >
                    Female
                  </option>
                  <option
                    value="Other"
                    className="text-body dark:text-bodydark"
                  >
                    Other
                  </option>
                </select>
                {errors.gender?.type === "required" && (
                  <ErrorMessage>*{errors.gender.message}</ErrorMessage>
                )}
              </div>

              <div className="mb-4.5 w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Civil Status
                </label>
                <select
                  {...register("civilStatus", {
                    required: {
                      value: true,
                      message: "Civil status is required",
                    },
                  })}
                  onChange={(e) => setCivilStat(e.target.value)}
                  value={civilStat}
                  className={`relative z-20 w-full rounded border border-stroke bg-transparent !p-[0.85em] px-5 py-3 outline-none transition hover:cursor-pointer focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                    isOptionSelected
                      ? "text-black dark:text-white"
                      : success
                        ? "hover:cursor-auto"
                        : ""
                  }`}
                  disabled={success}
                >
                  <option
                    value=""
                    disabled
                    className="text-body dark:text-bodydark"
                    selected
                  >
                    Select
                  </option>
                  <option
                    value="Single"
                    className="text-body dark:text-bodydark"
                  >
                    Single
                  </option>
                  <option
                    value="In relationship"
                    className="text-body dark:text-bodydark"
                  >
                    In relationship
                  </option>
                  <option
                    value="Married"
                    className="text-body dark:text-bodydark"
                  >
                    Married
                  </option>
                  <option
                    value="Separated"
                    className="text-body dark:text-bodydark"
                  >
                    Separated
                  </option>
                  <option
                    value="Divorced"
                    className="text-body dark:text-bodydark"
                  >
                    Divorced
                  </option>
                  <option
                    value="Widowed"
                    className="text-body dark:text-bodydark"
                  >
                    Widowed
                  </option>
                </select>
                {errors.civilStatus?.type === "required" && (
                  <ErrorMessage>*{errors.civilStatus.message}</ErrorMessage>
                )}
              </div>

              <div className="mb-4.5 w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Birth Date:
                </label>
                <input
                  type="date"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  {...register("birthDate", {
                    required: {
                      value: true,
                      message: "Birth date is required",
                    },
                    validate: {
                      validYear: (value) =>
                        validateBirthDate(value) ||
                        `Invalid birth date. Please enter a valid year between 1900 and ${new Date().getFullYear() - 10}.`,
                    },
                  })}
                  disabled={success}
                />
                {errors.birthDate && (
                  <span className="mt-2 inline-block text-sm font-medium text-red-600">
                    *{errors.birthDate.message}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  {...register("email", {
                    required: {
                      value: true,
                      message: "Email is required",
                    },
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email",
                    },
                  })}
                  disabled={success}
                />

                {errors.email?.type === "required" && (
                  <ErrorMessage>*{errors.email.message}</ErrorMessage>
                )}
              </div>

              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Contact Number
                </label>
                <input
                  type="text"
                  placeholder="'+63' or '09'"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  {...register("contactNumber", {
                    required: {
                      value: true,
                      message: "Contact number is required",
                    },
                    validate: validateContactNumber,
                  })}
                  disabled={success}
                />
                {errors.contactNumber && (
                  <ErrorMessage>*{errors.contactNumber.message}</ErrorMessage>
                )}
              </div>

              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Religion
                </label>
                <input
                  type="text"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  {...register("religion", {
                    required: { value: true, message: "Religion is required" },
                  })}
                  disabled={success}
                />
                {errors.religion?.type === "required" && (
                  <ErrorMessage>*{errors.religion.message}</ErrorMessage>
                )}
              </div>
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Birth Place
              </label>
              <input
                type="text"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                {...register("birthPlace", {
                  required: {
                    value: true,
                    message: "Birth place is required",
                  },
                })}
                disabled={success}
              />
              {errors.birthPlace?.type === "required" && (
                <ErrorMessage>*{errors.birthPlace.message}</ErrorMessage>
              )}
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Citizenship
              </label>
              <input
                type="text"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                {...register("citizenship", {
                  required: { value: true, message: "Citizenship is required" },
                })}
                disabled={success}
              />
              {errors.citizenship?.type === "required" && (
                <ErrorMessage>*{errors.citizenship.message}</ErrorMessage>
              )}
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Country
              </label>
              <input
                type="text"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                {...register("country", {
                  required: { value: true, message: "Country is required" },
                })}
                disabled={success}
              />
              {errors.country?.type === "required" && (
                <ErrorMessage>*{errors.country.message}</ErrorMessage>
              )}
            </div>

            <div className="mb-5 rounded-sm border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
              <div>
                <p className="mb-2.5 block text-black dark:text-white">
                  Foreign Student?
                </p>
                <select
                  onChange={(e) => {
                    setIsAcrStudent(e.target.value === "Yes");
                    reset({ ACR: "" });
                    setIsOptionSelected(true);
                  }}
                  className={`relative z-20 rounded border border-stroke bg-transparent px-2 py-2 outline-none transition hover:cursor-pointer focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                    isOptionSelected
                      ? "text-black dark:text-white"
                      : success
                        ? "hover:cursor-auto"
                        : ""
                  }`}
                  value={isAcrStudent ? "Yes" : "No"}
                  disabled={success}
                >
                  <option value="Yes" className="text-body dark:text-bodydark">
                    Yes
                  </option>
                  <option value="No" className="text-body dark:text-bodydark">
                    No
                  </option>
                </select>
              </div>
              {isAcrStudent && (
                <div className="mb-4.5 mt-6">
                  <label className="mb-2.5 block text-black dark:text-white">
                    ACR (Alien Certificate of Registration (ACR I))
                  </label>
                  <input
                    type="text"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    {...register("ACR", {
                      required: { value: true, message: "ACR is required" },
                    })}
                    disabled={success}
                  />
                  {errors.ACR?.type === "required" && (
                    <ErrorMessage>*{errors.ACR.message}</ErrorMessage>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`inline-flex w-full justify-center gap-2 rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 ${
                loading || success ? "bg-[#505456] hover:!bg-opacity-100" : ""
              }`}
              disabled={loading || success}
            >
              {loading && (
                <span className="block h-6 w-6 animate-spin rounded-full border-4 border-solid border-secondary border-t-transparent"></span>
              )}
              {loading
                ? "Adding Student..."
                : success
                  ? "Student Added!"
                  : "Add Student"}
            </button>
          </div>
        </form>
        {error && <div className="mb-5 text-center text-red-600">{error}</div>}

        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent className="rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
export default AddStudent;
