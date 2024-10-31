import { useFormContext } from "react-hook-form";
import { Input } from "../../../../../components/ui/input";

const AcademicBackgroundComponent = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4 text-start">
      <div className="flex gap-10">
        {/* Major In */}
        <div className="w-full space-y-2">
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
        <div className="w-full space-y-2">
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
        <div className="w-full space-y-2">
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

      <div className="flex gap-10">
        {/* Semester ID */}
        <div className="w-full space-y-2">
          <label
            htmlFor="semester_id"
            className="block text-sm font-medium text-primary"
          >
            Semester
          </label>
          <select
            id="semester_id"
            {...register("semester_id", { valueAsNumber: true })}
            className="block w-full rounded-md border p-2"
          >
            {/* Options should be populated dynamically */}
            <option value="">Select Semester</option>
            <option value="1">First Semester</option>
            <option value="2">Second Semester</option>
          </select>
          {errors.semester_id && (
            <span className="text-sm font-medium text-red-600">
              {errors.semester_id.message}
            </span>
          )}
        </div>
        {/* Year Entry */}
        <div className="w-full space-y-2">
          <label
            htmlFor="yearEntry"
            className="block text-sm font-medium text-primary"
          >
            Year Entry
          </label>
          <Input id="yearEntry" type="number" {...register("yearEntry", { valueAsNumber: true })} />
          {errors.yearEntry && (
            <span className="text-sm font-medium text-red-600">
              {errors.yearEntry.message}
            </span>
          )}
        </div>
        {/* Year Graduate */}
        <div className="w-full space-y-2">
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
