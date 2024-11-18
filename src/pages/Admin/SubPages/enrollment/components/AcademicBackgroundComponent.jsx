/* eslint-disable react/prop-types */
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "../../../../../components/ui/input";
import { useSchool } from "../../../../../components/context/SchoolContext";
import { useContext, useState, useEffect } from "react";
import CustomSelector from "../../../../../components/reuseable/CustomSelector";
import { useMediaQuery } from "../../../../../hooks/use-media-query";
import axios from "axios";
import { AuthContext } from "../../../../../components/context/AuthContext";

const AcademicBackgroundComponent = () => {
  const {
    control,
    register,
    clearErrors,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const { programActive, semesters, loading } = useSchool();

  const [openProgramSelector, setOpenProgramSelector] = useState(false);
  const [openSemesterSelector, setOpenSemesterSelector] = useState(false);
  const [openProspectusSelector, setOpenProspectusSelector] = useState(false);

  const [prospectuses, setProspectuses] = useState([]);
  const [loadingProspectus, setLoadingProspectus] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const selectedProgramID = watch("program_id");

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (selectedProgramID) {
      setLoadingProspectus(true);
      axios
        .get("/prospectus/get-all-prospectus/active", {
          params: {
            program_id: selectedProgramID,
            campus_id: user.campus_id ? user.campus_id : null,
          },
        })
        .then((response) => {
          setProspectuses(response.data);
          setLoadingProspectus(false);
        })
        .catch((error) => {
          console.error("Error fetching prospectuses:", error);
          setLoadingProspectus(false);
        });
    } else {
      setProspectuses([]);
    }
  }, [selectedProgramID, user.campus_id]);

  return (
    <div className="space-y-4 text-start">
      <div className="flex flex-wrap gap-10">
        {/* Program ID */}
        <div className="w-full space-y-2 sm:w-1/2">
          <label
            htmlFor="program_id"
            className="block text-sm font-medium text-primary"
          >
            Program
          </label>
          <Controller
            name="program_id"
            control={control}
            rules={{ required: "Program is required" }}
            render={({ field }) => {
              const fieldValue = field.value ? Number(field.value) : null;

              const selectedProgram = programActive.find(
                (program) => program.program_id === fieldValue,
              );

              // Format the selected name
              const selectedName = selectedProgram
                ? `${selectedProgram.programCode} - ${selectedProgram.programDescription}`
                : "";

              return (
                <CustomSelector
                  title="Program"
                  isDesktop={isDesktop}
                  open={openProgramSelector}
                  setOpen={setOpenProgramSelector}
                  selectedID={field.value || ""}
                  selectedName={selectedName}
                  data={programActive}
                  setSelectedID={(value) => {
                    field.onChange(Number(value)); // Update program_id
                    clearErrors("program_id"); // Clear program_id errors

                    // Reset prospectus_id when program changes
                    setValue("prospectus_id", null); // or undefined
                    clearErrors("prospectus_id"); // Clear any prospectus_id errors
                  }}
                  setSelectedName={() => {}}
                  loading={loading}
                  idKey="program_id"
                  nameKey="programDescription"
                  errorKey="program_id"
                  displayItem={(program) =>
                    `${program.programCode} - ${program.programDescription}`
                  }
                  // No need to pass clearErrors as it's handled internally
                />
              );
            }}
          />
          {errors.program_id && (
            <span className="text-sm font-medium text-red-600">
              {errors.program_id.message}
            </span>
          )}
        </div>

        {/* Prospectus */}
        <div className="w-full space-y-2 sm:w-1/2">
          <label
            htmlFor="prospectus_id"
            className="block text-sm font-medium text-primary"
          >
            Prospectus
          </label>
          <Controller
            name="prospectus_id"
            control={control}
            rules={{ required: "Prospectus is required" }}
            render={({ field }) => {
              const fieldValue = field.value ? Number(field.value) : null;

              const selectedProspectus = prospectuses.find(
                (prospectus) => prospectus.prospectus_id === fieldValue,
              );

              const selectedName = selectedProspectus
                ? `${selectedProspectus.prospectusName} - ${selectedProspectus.prospectusDescription}`
                : "";

              // Filter out any undefined or null prospectuses
              const validProspectuses = prospectuses.filter(
                (prospectus) => prospectus !== undefined && prospectus !== null,
              );

              return (
                <CustomSelector
                  title="Prospectus"
                  isDesktop={isDesktop}
                  open={openProspectusSelector}
                  setOpen={setOpenProspectusSelector}
                  selectedID={field.value || ""}
                  selectedName={selectedName}
                  data={validProspectuses} // Use filtered data
                  setSelectedID={(value) => {
                    field.onChange(Number(value));
                    clearErrors("prospectus_id"); // Clear errors using useFormContext internally
                  }}
                  setSelectedName={() => {}}
                  loading={loadingProspectus || !selectedProgramID}
                  idKey="prospectus_id"
                  nameKey="prospectusName"
                  errorKey="prospectus_id"
                  displayItem={(prospectus) =>
                    prospectus
                      ? `${prospectus.prospectusName || "None"} - ${prospectus.prospectusDescription || "Please add prospectus"}`
                      : "Empty, please add prospectus"
                  }
                  forSemester={true}
                />
              );
            }}
          />
          {errors.prospectus_id && (
            <span className="text-sm font-medium text-red-600">
              {errors.prospectus_id.message}
            </span>
          )}
        </div>

        {/* Year Level */}
        <div className="w-full space-y-2 sm:w-1/2">
          <label
            htmlFor="yearLevel"
            className="block text-sm font-medium text-primary"
          >
            Year Level
          </label>
          <select
            id="yearLevel"
            {...register("yearLevel")}
            className="block w-full rounded-md border p-2"
          >
            <option value="">Select Year Level</option>
            <option value="First Year">First Year</option>
            <option value="Second Year">Second Year</option>
            <option value="Third Year">Third Year</option>
            <option value="Fourth Year">Fourth Year</option>
            {/* <option value="Fifth Year">Fifth Year</option> */}
          </select>
          {errors.yearLevel && (
            <span className="text-sm font-medium text-red-600">
              {errors.yearLevel.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-10">
        {/* Major In */}
        <div className="w-full space-y-2 sm:w-1/2 lg:w-1/3">
          <label
            htmlFor="majorIn"
            className="block text-sm font-medium text-primary"
          >
            Major In
          </label>
          <Input id="majorIn" {...register("majorIn")} />
          {errors.majorIn && (
            <span className="text-sm font-medium text-red-600">
              {errors.majorIn.message}
            </span>
          )}
        </div>
        {/* Student Type */}
        <div className="w-full space-y-2 sm:w-1/2 lg:w-1/3">
          <label
            htmlFor="studentType"
            className="block text-sm font-medium text-primary"
          >
            Student Type
          </label>
          <select
            id="studentType"
            {...register("studentType")}
            className="block w-full rounded-md border p-2"
          >
            <option value="">Select Student Type</option>
            <option value="Regular">Regular</option>
            <option value="Irregular">Irregular</option>
          </select>
          {errors.studentType && (
            <span className="text-sm font-medium text-red-600">
              {errors.studentType.message}
            </span>
          )}
        </div>
        {/* Application Type */}
        <div className="w-full space-y-2 sm:w-1/2 lg:w-1/3">
          <label
            htmlFor="applicationType"
            className="block text-sm font-medium text-primary"
          >
            Application Type
          </label>
          <select
            id="applicationType"
            {...register("applicationType")}
            className="block w-full rounded-md border p-2"
          >
            <option value="">Select Application Type</option>
            <option value="Freshmen">Freshmen</option>
            <option value="Transferee">Transferee</option>
            <option value="Cross Enrollee">Cross Enrollee</option>
          </select>
          {errors.applicationType && (
            <span className="text-sm font-medium text-red-600">
              {errors.applicationType.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-10">
        {/* Semester ID */}
        <div className="w-full space-y-2 sm:w-1/2 lg:w-1/3">
          <label
            htmlFor="semester_id"
            className="block text-sm font-medium text-primary"
          >
            Semester
          </label>
          <Controller
            name="semester_id"
            control={control}
            rules={{ required: "Semester is required" }}
            render={({ field }) => {
              const fieldValue = field.value ? Number(field.value) : null;

              const selectedSemester = semesters.find(
                (semester) => semester.semester_id === fieldValue,
              );

              // Format the selected name
              const selectedName = selectedSemester
                ? `${selectedSemester.schoolYear} - ${selectedSemester.semesterName}`
                : "";

              return (
                <CustomSelector
                  title="Semester"
                  isDesktop={isDesktop}
                  open={openSemesterSelector}
                  setOpen={setOpenSemesterSelector}
                  selectedID={field.value || ""}
                  selectedName={selectedName}
                  data={semesters}
                  setSelectedID={(value) => {
                    field.onChange(Number(value)); // Convert value to number
                    clearErrors("semester_id"); // Clear errors using useFormContext internally
                  }}
                  setSelectedName={() => {}}
                  loading={loading}
                  idKey="semester_id"
                  nameKey="semesterName"
                  errorKey="semester_id"
                  displayItem={(semester) =>
                    `${semester.schoolYear} - ${semester.semesterName} `
                  }
                  forSemester={true}
                />
              );
            }}
          />
          {errors.semester_id && (
            <span className="text-sm font-medium text-red-600">
              {errors.semester_id.message}
            </span>
          )}
        </div>
        {/* Year Entry */}
        <div className="w-full space-y-2 sm:w-1/2 lg:w-1/3">
          <label
            htmlFor="yearEntry"
            className="block text-sm font-medium text-primary"
          >
            Year Entry
          </label>
          <Input
            id="yearEntry"
            type="number"
            {...register("yearEntry", { valueAsNumber: true })}
          />
          {errors.yearEntry && (
            <span className="text-sm font-medium text-red-600">
              {errors.yearEntry.message}
            </span>
          )}
        </div>
        {/* Year Graduate */}
        <div className="w-full space-y-2 sm:w-1/2 lg:w-1/3">
          <label
            htmlFor="yearGraduate"
            className="block text-sm font-medium text-primary"
          >
            Year Graduate
          </label>
          <Input
            id="yearGraduate"
            type="number"
            {...register("yearGraduate", { valueAsNumber: true })}
          />
          {errors.yearGraduate && (
            <span className="text-sm font-medium text-red-600">
              {errors.yearGraduate.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcademicBackgroundComponent;
