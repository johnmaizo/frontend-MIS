/* eslint-disable react/prop-types */
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

import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { Button } from "../ui/button";

import { useMediaQuery } from "../../hooks/use-media-query";

import { AddDepartmentIcon } from "../Icons";
import { useSchool } from "../context/SchoolContext";
import { getInitialDepartmentNameAndCampus } from "../reuseable/GetInitialNames";

import { ErrorMessage } from "../reuseable/ErrorMessage";

const AddProgram = () => {
  const { fetchProgram, deparmentsActive, fetchDepartmentsActive, loading } =
    useSchool();

  const [open, setOpen] = useState(false);

  const [openComboBox, setOpenComboBox] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [selectedDepartmentID, setSelectedDepartmentID] = useState("");
  const [selectedDepartmenName, setSelectedDepartmenName] = useState("");

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
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    fetchDepartmentsActive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data) => {
    if (!selectedDepartmentID) {
      setError("department_id", {
        type: "manual",
        message: "You must select a department.",
      });
      return;
    }

    setLocalLoading(true);
    const transformedData = {
      ...Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value.trim() === "" ? null : value.trim(),
        ]),
      ),
      department_id: parseInt(selectedDepartmentID),

      departmentCode: selectedDepartmenName.split(" - ")[0],
      departmentName: selectedDepartmenName.split(" - ")[1],
      campusName: selectedDepartmenName.split(" - ")[2],
    };

    setGeneralError("");
    try {
      const response = await toast.promise(
        axios.post("/programs/add-program", transformedData),
        {
          loading: "Adding Program...",
          success: "Program Added successfully!",
          error: "Failed to add Program.",
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
        setSelectedDepartmentID(""); // Reset selected department
        setSelectedDepartmenName(""); // Reset selected department
      }, 2000);
    } else if (error) {
      setTimeout(() => {
        setGeneralError("");
      }, 5000);
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
              setSelectedDepartmentID(""); // Reset selected department ID
              setSelectedDepartmenName(""); // Reset selected department Name
              clearErrors("department_id"); // Clear deparment selection error when dialog closes
            }
          }}
        >
          <DialogTrigger className="flex w-full justify-center gap-1 rounded bg-blue-600 p-3 text-white hover:bg-blue-700 md:w-auto md:justify-normal">
            <AddDepartmentIcon title={"Add Program"} />
            <span className="max-w-[8em]">Add Program </span>
          </DialogTrigger>
          <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-black dark:text-white">
                Add new Program
              </DialogTitle>
              <DialogDescription className="sr-only">
                <span className="inline-block font-bold text-red-700">*</span>{" "}
                Fill up, Click Add when you&apos;re done.
              </DialogDescription>
              <div className="h-[20em] overflow-y-auto overscroll-none text-xl lg:h-auto">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="p-6.5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-[12em]">
                        <label
                          className="mb-2.5 block text-black dark:text-white"
                          htmlFor="program_code"
                        >
                          Program Code
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
                              isUpperCase: (value) =>
                                /^[A-Z\s-]+$/.test(value) ||
                                "Program Code must contain only capital letters",
                            },
                          })}
                          disabled={localLoading || success}
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
                          Program Description
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
                          disabled={localLoading || success}
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
                          modal={true}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="h-[2.5em] w-[13em] justify-start text-xl text-black dark:bg-form-input dark:text-white md:w-full"
                            >
                              {selectedDepartmentID ? (
                                <>
                                  {getInitialDepartmentNameAndCampus(
                                    selectedDepartmenName,
                                  )}
                                </>
                              ) : (
                                <>Select Department</>
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
                                className="h-[2.5em] w-[13em] justify-start text-xl text-black dark:bg-form-input dark:text-white md:w-full"
                              >
                                {selectedDepartmentID ? (
                                  <>
                                    {getInitialDepartmentNameAndCampus(
                                      selectedDepartmenName,
                                    )}
                                  </>
                                ) : (
                                  <>Select Department</>
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
                      {localLoading ? "Loading..." : "Add Program"}
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

export default AddProgram;
