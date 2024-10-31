import { useFormContext } from "react-hook-form";
import { Input } from "../../../../../components/ui/input";

const PersonalDataComponent = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4 text-start">
      <div className="flex gap-10">
        {/* Civil Status */}
        <div className="w-full space-y-2">
          <label
            htmlFor="civilStatus"
            className="block text-sm font-medium text-primary"
          >
            Civil Status
          </label>
          <select
            id="civilStatus"
            {...register("civilStatus")}
            className="block w-full rounded-md border p-2"
          >
            <option value="">Select Civil Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Widowed">Widowed</option>
            <option value="Separated">Separated</option>
            <option value="Divorced">Divorced</option>
          </select>
          {errors.civilStatus && (
            <span className="text-sm font-medium text-red-600">
              {errors.civilStatus.message}
            </span>
          )}
        </div>
        {/* Birth Place */}
        <div className="w-full space-y-2">
          <label
            htmlFor="birthPlace"
            className="block text-sm font-medium text-primary"
          >
            Birth Place
          </label>
          <Input id="birthPlace" {...register("birthPlace")} />
          {errors.birthPlace && (
            <span className="text-sm font-medium text-red-600">
              {errors.birthPlace.message}
            </span>
          )}
        </div>
        {/* Religion */}
        <div className="w-full space-y-2">
          <label
            htmlFor="religion"
            className="block text-sm font-medium text-primary"
          >
            Religion
          </label>
          <Input id="religion" {...register("religion")} />
          {errors.religion && (
            <span className="text-sm font-medium text-red-600">
              {errors.religion.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-10">
        {/* Citizenship */}
        <div className="w-full space-y-2">
          <label
            htmlFor="citizenship"
            className="block text-sm font-medium text-primary"
          >
            Citizenship
          </label>
          <Input id="citizenship" {...register("citizenship")} />
          {errors.citizenship && (
            <span className="text-sm font-medium text-red-600">
              {errors.citizenship.message}
            </span>
          )}
        </div>
        {/* Country */}
        <div className="w-full space-y-2">
          <label
            htmlFor="country"
            className="block text-sm font-medium text-primary"
          >
            Country
          </label>
          <Input id="country" {...register("country")} />
          {errors.country && (
            <span className="text-sm font-medium text-red-600">
              {errors.country.message}
            </span>
          )}
        </div>
        {/* ACR */}
        <div className="w-full space-y-2">
          <label
            htmlFor="ACR"
            className="block text-sm font-medium text-primary"
          >
            ACR (For foreign students)
          </label>
          <Input id="ACR" {...register("ACR")} />
          {errors.ACR && (
            <span className="text-sm font-medium text-red-600">
              {errors.ACR.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalDataComponent;
