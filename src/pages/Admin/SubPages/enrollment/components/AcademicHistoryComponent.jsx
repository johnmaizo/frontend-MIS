import { useFormContext } from "react-hook-form";
import { Input } from "../../../../../components/ui/input";

const AcademicHistoryComponent = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4 text-start">
      {/* Elementary Education */}
      <h3 className="text-lg font-medium text-primary">Elementary Education</h3>
      {/* Include all elementary fields here */}
      {/* ... */}
      <div className="w-full space-y-2">
        <label
          htmlFor="elementarySchool"
          className="block text-sm font-medium text-primary"
        >
          elementarySchool
        </label>
        <Input id="elementarySchool" {...register("elementarySchool")} />
        {errors.elementarySchool && (
          <span className="text-sm font-medium text-red-600">
            {errors.elementarySchool.message}
          </span>
        )}
      </div>

      <div className="w-full space-y-2">
        <label
          htmlFor="elementaryAddress"
          className="block text-sm font-medium text-primary"
        >
          elementaryAddress
        </label>
        <Input id="elementaryAddress" {...register("elementaryAddress")} />
        {errors.elementaryAddress && (
          <span className="text-sm font-medium text-red-600">
            {errors.elementaryAddress.message}
          </span>
        )}
      </div>

      <div className="w-full space-y-2">
        <label
          htmlFor="elementaryHonors"
          className="block text-sm font-medium text-primary"
        >
          elementaryHonors
        </label>
        <Input id="elementaryHonors" {...register("elementaryHonors")} />
        {errors.elementaryHonors && (
          <span className="text-sm font-medium text-red-600">
            {errors.elementaryHonors.message}
          </span>
        )}
      </div>

      <div className="w-full space-y-2">
        <label
          htmlFor="elementaryGraduate"
          className="block text-sm font-medium text-primary"
        >
          elementaryGraduate
        </label>
        <Input id="elementaryGraduate" {...register("elementaryGraduate")} />
        {errors.elementaryGraduate && (
          <span className="text-sm font-medium text-red-600">
            {errors.elementaryGraduate.message}
          </span>
        )}
      </div>

      <hr />

      {/* Secondary Education */}
      <h3 className="text-lg font-medium text-primary">Secondary Education</h3>
      {/* Include all secondary fields here */}
      {/* ... */}
      <div className="w-full space-y-2">
        <label
          htmlFor="secondarySchool"
          className="block text-sm font-medium text-primary"
        >
          secondarySchool
        </label>
        <Input id="secondarySchool" {...register("secondarySchool")} />
        {errors.secondarySchool && (
          <span className="text-sm font-medium text-red-600">
            {errors.secondarySchool.message}
          </span>
        )}
      </div>

      <div className="w-full space-y-2">
        <label
          htmlFor="secondaryAddress"
          className="block text-sm font-medium text-primary"
        >
          secondaryAddress
        </label>
        <Input id="secondaryAddress" {...register("secondaryAddress")} />
        {errors.secondaryAddress && (
          <span className="text-sm font-medium text-red-600">
            {errors.secondaryAddress.message}
          </span>
        )}
      </div>

      <div className="w-full space-y-2">
        <label
          htmlFor="secondaryHonors"
          className="block text-sm font-medium text-primary"
        >
          secondaryHonors
        </label>
        <Input id="secondaryHonors" {...register("secondaryHonors")} />
        {errors.secondaryHonors && (
          <span className="text-sm font-medium text-red-600">
            {errors.secondaryHonors.message}
          </span>
        )}
      </div>

      <div className="w-full space-y-2">
        <label
          htmlFor="secondaryGraduate"
          className="block text-sm font-medium text-primary"
        >
          secondaryGraduate
        </label>
        <Input id="secondaryGraduate" {...register("secondaryGraduate")} />
        {errors.secondaryGraduate && (
          <span className="text-sm font-medium text-red-600">
            {errors.secondaryGraduate.message}
          </span>
        )}
      </div>

      <hr />
      {/* Senior High School Education */}
      <h3 className="text-lg font-medium text-primary">
        Senior High School Education
      </h3>
      {/* Include all senior high school fields here */}
      {/* ... */}
      <div className="w-full space-y-2">
        <label
          htmlFor="seniorHighSchool"
          className="block text-sm font-medium text-primary"
        >
          seniorHighSchool
        </label>
        <Input id="seniorHighSchool" {...register("seniorHighSchool")} />
        {errors.seniorHighSchool && (
          <span className="text-sm font-medium text-red-600">
            {errors.seniorHighSchool.message}
          </span>
        )}
      </div>

      <div className="w-full space-y-2">
        <label
          htmlFor="seniorHighAddress"
          className="block text-sm font-medium text-primary"
        >
          seniorHighAddress
        </label>
        <Input id="seniorHighAddress" {...register("seniorHighAddress")} />
        {errors.seniorHighAddress && (
          <span className="text-sm font-medium text-red-600">
            {errors.seniorHighAddress.message}
          </span>
        )}
      </div>
    </div>
  );
};

export default AcademicHistoryComponent;
