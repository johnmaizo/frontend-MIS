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

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";

import { useSchool } from "../context/SchoolContext";
import { Switch } from "../ui/switch";

import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { Button } from "../ui/button";
import { useMediaQuery } from "../../hooks/use-media-query";
import { getInitialDepartmentNameAndCampus } from "../reuseable/GetInitialNames";

const EditProgram = ({ programId }) => {
  const { fetchProgram, deparmentsActive } = useSchool();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true); // State for status switch

  const [openComboBox, setOpenComboBox] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [selectedDepartmentID, setSelectedDepartmentID] = useState(""); // State for selected department ID
  const [selectedDepartmenName, setSelectedDepartmenName] = useState(""); // State for selected department Name

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
    if (programId && open) {
      // Fetch the program data when the modal is opened
      setLoading(true);
      axios
        .get(`/programs/${programId}`)
        .then((response) => {
          const program = response.data;
          // Pre-fill the form with program data
          setValue("programCode", program.programCode);
          setValue("programDescription", program.programDescription);
          setIsActive(program.isActive); // Set the initial status
          setSelectedDepartmentID(program.department_id.toString()); // Set the initial department
          setSelectedDepartmenName(program.fullDepartmentNameWithCampus);
          setLoading(false);
        })
        .catch((err) => {
          setError(`Failed to fetch program data: (${err})`);
          setLoading(false);
        });
    }
  }, [programId, open, setValue]);

  const onSubmit = async (data) => {
    if (!selectedDepartmentID) {
      setError("department_id", "You must select a department.");
      return;
    }

    setLoading(true);
    // Add isActive and selectedDepartment to the form data
    const transformedData = {
      ...Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value.trim() === "" ? null : value.trim(),
        ]),
      ),
      isActive: isActive ? true : false, // Set isActive based on the switch value
      department_id: selectedDepartmentID, // Add the selected department to the form data

      departmentCode: selectedDepartmenName.split(" - ")[0],
      departmentName: selectedDepartmenName.split(" - ")[1],
      campusName: selectedDepartmenName.split(" - ")[2],
    };

    setError("");
    try {
      const response = await toast.promise(
        axios.put(`/programs/${programId}`, transformedData),
        {
          loading: "Updating Program...",
          success: "Program updated successfully!",
          error: "Failed to update Program.",
        },
        {
          position: "bottom-right",
          duration: 5000,
        },
      );

      if (response.data) {
        setSuccess(true);
        fetchProgram();
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
        setSelectedDepartmentID(""); // Reset selected department
        setSelectedDepartmenName(""); // Reset selected department
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
              setSelectedDepartmentID(""); // Reset selected department ID
              setSelectedDepartmenName(""); // Reset selected department Name
              clearErrors("department_id"); // Clear deparment selection error when dialog closes
            }

            if (!loading) {
              setOpen(isOpen); // Prevent closing the dialog if loading
            }
          }}
        >
          <DialogTrigger className="flex gap-1 rounded p-2 text-black hover:text-blue-700 dark:text-white dark:hover:text-blue-700">
            <EditDepartmentIcon forActions={"Edit Program"} />
          </DialogTrigger>

          <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Edit Program
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
                        htmlFor="program_active"
                      >
                        Status{" "}
                        <span className="inline-block font-bold text-red-700">
                          *
                        </span>
                      </label>
                      <Switch
                        id="program_active"
                        checked={isActive}
                        onCheckedChange={setIsActive} // Update the status when the switch is toggled
                        disabled={success || loading}
                      />
                    </div>

                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-[13.5em]">
                        <label
                          className="mb-2.5 block text-black dark:text-white"
                          htmlFor="program_code"
                        >
                          Program Code{" "}
                          <span className="inline-block font-bold text-red-700">
                            *
                          </span>
                        </label>
                        <input
                          id="program_code"
                          type="text"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          {...register("programCode", {
                            required: {
                              value: true,
                              message: "Program Code is required",
                            },
                            validate: {
                              notEmpty: (value) =>
                                value.trim() !== "" ||
                                "Program Code cannot be empty or just spaces",
                            },
                          })}
                          disabled={success || loading}
                        />
                        {errors.programCode && (
                          <ErrorMessage>
                            *{errors.programCode.message}
                          </ErrorMessage>
                        )}
                      </div>

                      <div className="w-full">
                        <label
                          className="mb-2.5 block text-black dark:text-white"
                          htmlFor="program_description"
                        >
                          Program Description{" "}
                          <span className="inline-block font-bold text-red-700">
                            *
                          </span>
                        </label>
                        <input
                          id="program_description"
                          type="text"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          {...register("programDescription", {
                            required: {
                              value: true,
                              message: "Program Description is required",
                            },
                            validate: {
                              notEmpty: (value) =>
                                value.trim() !== "" ||
                                "Program Description cannot be empty or just spaces",
                            },
                          })}
                          disabled={success || loading}
                        />
                        {errors.programDescription && (
                          <ErrorMessage>
                            *{errors.programDescription.message}
                          </ErrorMessage>
                        )}
                      </div>
                    </div>

                    <div className="mb-4.5 w-full">
                      <label
                        className="mb-2.5 block text-black dark:text-white"
                        htmlFor="program_department"
                      >
                        Department
                      </label>

                      {isDesktop ? (
                        <Popover
                          open={openComboBox}
                          onOpenChange={setOpenComboBox}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              disabled={loading}
                              className="h-[2.5em] w-[13em] justify-start text-xl text-black dark:bg-form-input dark:text-white md:w-full"
                            >
                              {selectedDepartmentID ? (
                                <>
                                  {getInitialDepartmentNameAndCampus(
                                    selectedDepartmenName,
                                  )}
                                </>
                              ) : (
                                <>
                                  {loading ? "Loading..." : "Select Department"}
                                </>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[200px] p-0"
                            align="start"
                          >
                            <DepartmentList
                              setOpen={setOpenComboBox}
                              setSelectedDepartmentID={setSelectedDepartmentID}
                              setSelectedDepartmenName={
                                setSelectedDepartmenName
                              }
                              data={deparmentsActive}
                              loading={loading}
                              clearErrors={clearErrors}
                            />
                          </PopoverContent>
                        </Popover>
                      ) : (
                        !isDesktop && (
                          <Drawer
                            open={openComboBox}
                            onOpenChange={setOpenComboBox}
                          >
                            <DrawerTrigger asChild>
                              <Button
                                variant="outline"
                                disabled={loading}
                                className="h-[2.5em] w-[13em] justify-start text-xl text-black dark:bg-form-input dark:text-white md:w-full"
                              >
                                {selectedDepartmentID ? (
                                  <>
                                    {getInitialDepartmentNameAndCampus(
                                      selectedDepartmenName,
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {loading
                                      ? "Loading..."
                                      : "Select Department"}
                                  </>
                                )}
                              </Button>
                            </DrawerTrigger>
                            <DrawerContent>
                              <div className="mt-4 border-t">
                                <DepartmentList
                                  setOpen={setOpenComboBox}
                                  setSelectedDepartmentID={
                                    setSelectedDepartmentID
                                  }
                                  setSelectedDepartmenName={
                                    setSelectedDepartmenName
                                  }
                                  data={deparmentsActive}
                                  loading={loading}
                                  clearErrors={clearErrors}
                                />
                              </div>
                            </DrawerContent>
                          </Drawer>
                        )
                      )}

                      {errors.department_id && (
                        <ErrorMessage>
                          *{errors.department_id.message}
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
                        ? "Updating Program..."
                        : success
                          ? "Program Updated!"
                          : "Update Program"}
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

// eslint-disable-next-line react/prop-types
const ErrorMessage = ({ children }) => {
  return (
    <span className="mt-2 inline-block text-sm font-medium text-red-600">
      {children}
    </span>
  );
};

function DepartmentList({
  setOpen,
  setSelectedDepartmentID,
  setSelectedDepartmenName,
  data,
  loading,
  clearErrors,
}) {
  return (
    <Command
      className="md:!w-[34.5em]"
      filter={(value, search, keywords = []) => {
        const extendValue = value + " " + keywords.join(" ");
        if (extendValue.toLowerCase().includes(search.toLowerCase())) {
          return 1;
        }
        return 0;
      }}
    >
      <CommandInput placeholder="Filter department..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {loading && (
            <CommandItem
              disabled
              className="text-[1rem] font-medium text-black dark:text-white md:text-[1.2rem]"
            >
              Searching...
            </CommandItem>
          )}
          {data && data.length ? (
            data.map((department, index) => (
              <div key={index}>
                <CommandSeparator className="border-t border-slate-200 dark:border-slate-700" />
                <CommandItem
                  value={department.department_id.toString()}
                  keywords={[
                    getInitialDepartmentNameAndCampus(
                      department.fullDepartmentNameWithCampus,
                    ),
                  ]}
                  onSelect={(value) => {
                    setSelectedDepartmentID(value);
                    setSelectedDepartmenName(
                      department.fullDepartmentNameWithCampus,
                    );
                    setOpen(false);
                    clearErrors("department_id");
                  }}
                  className="text-[1rem] font-medium text-black dark:text-white md:!w-[34.5em] md:text-[1.2rem]"
                >
                  {getInitialDepartmentNameAndCampus(
                    department.fullDepartmentNameWithCampus,
                  )}
                </CommandItem>
              </div>
            ))
          ) : (
            <CommandItem
              disabled
              className="text-[1rem] font-medium text-black dark:text-white"
            >
              Empty, please add a department.
            </CommandItem>
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export default EditProgram;
