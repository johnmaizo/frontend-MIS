import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const AddStudent = () => {
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

  const [isAcrStudent, setIsAcrStudent] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const transformedData = Object.fromEntries(
      Object.entries({ ...data, gender }).map(([key, value]) => [
        key,
        value === "" ? null : value,
      ]),
    );

    setError("");
    try {
      const response = await axios.post(
        "/students/add-student",
        transformedData,
      );
      if (response.data) {
        setSuccess(true);
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

  const validateBirthDate = (value) => {
    const birthYear = new Date(value).getFullYear();
    const currentYear = new Date().getFullYear();
    return birthYear >= 1900 && birthYear < currentYear;
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

  const [isOptionSelected, setIsOptionSelected] = useState(false);

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="text-2xl font-medium text-black dark:text-white">
            Add Student
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

                {errors.firstName && (
                  <span className="mt-2 inline-block text-sm font-medium text-red-600">
                    *{errors.firstName.message}
                  </span>
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
                {errors.lastName && (
                  <span className="mt-2 inline-block text-sm font-medium text-red-600">
                    *{errors.lastName.message}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-4.5 flex flex-col justify-between gap-6 xl:flex-row">
              {/* <div className="mb-4.5 w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Gender
                </label>
                <input
                  type="text"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  {...register("gender", {
                    required: { value: true, message: "Gender is required" },
                  })}
                  disabled={success}
                />
                {errors.gender && (
                  <span className="mt-2 inline-block text-sm font-medium text-red-600">
                    *{errors.gender.message}
                  </span>
                )}
              </div> */}

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
                  className={`hover:cursor-pointer relative z-20 w-full !p-[0.85em] rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                    isOptionSelected ? "text-black dark:text-white" : ""
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
                {errors.gender && (
                  <span className="mt-2 inline-block font-semibold text-red-600">
                    {errors.gender.message}
                  </span>
                )}
              </div>

              <div className="mb-4.5 w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Civil Status
                </label>
                <input
                  type="text"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  {...register("civilStatus", {
                    required: {
                      value: true,
                      message: "Civil status is required",
                    },
                  })}
                  disabled={success}
                />
                {errors.civilStatus && (
                  <span className="mt-2 inline-block text-sm font-medium text-red-600">
                    *{errors.civilStatus.message}
                  </span>
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
                        "Invalid birth date. Please enter a valid year between 1900 and the current year.",
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

            <div className="mb-4.5 w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Birth Place
              </label>
              <input
                type="text"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                {...register("birthPlace", {
                  required: { value: true, message: "Birth place is required" },
                })}
                disabled={success}
              />
              {errors.birthPlace && (
                <span className="mt-2 inline-block text-sm font-medium text-red-600">
                  *{errors.birthPlace.message}
                </span>
              )}
            </div>

            <div className="mb-4.5">
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
              {errors.religion && (
                <span className="mt-2 inline-block text-sm font-medium text-red-600">
                  *{errors.religion.message}
                </span>
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
              {errors.citizenship && (
                <span className="mt-2 inline-block text-sm font-medium text-red-600">
                  *{errors.citizenship.message}
                </span>
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
              {errors.country && (
                <span className="mt-2 inline-block text-sm font-medium text-red-600">
                  *{errors.country.message}
                </span>
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
                  className={` hover:cursor-pointer relative z-20 rounded border border-stroke bg-transparent px-2 py-2 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                    isOptionSelected ? "text-black dark:text-white" : ""
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
                  {errors.ACR && (
                    <span className="mt-2 inline-block text-sm font-medium text-red-600">
                      *{errors.ACR.message}
                    </span>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 ${
                loading || success
                  ? "cursor-not-allowed bg-[#505456] !bg-opacity-100"
                  : ""
              }`}
              disabled={loading || success}
            >
              {loading ? "Loading..." : "Add Student"}
            </button>
          </div>
        </form>
        {error && <div className="text-center text-red-600">{error}</div>}
        {success && (
          <div className="text-center text-green-600">
            Student added successfully!
          </div>
        )}
      </div>
    </>
  );
};

export default AddStudent;
