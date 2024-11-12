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
          Elementary School
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
          Elementary Address
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
          Elementary Honors
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
          Elementary Graduate
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
          Secondary School
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
          Secondary Address
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
          Secondary Honors
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
          Secondary Graduate
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
          Senior High School
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
          Senior High Address
        </label>
        <Input id="seniorHighAddress" {...register("seniorHighAddress")} />
        {errors.seniorHighAddress && (
          <span className="text-sm font-medium text-red-600">
            {errors.seniorHighAddress.message}
          </span>
        )}
      </div>

      <div className="w-full space-y-2">
        <label
          htmlFor="seniorHighHonors"
          className="block text-sm font-medium text-primary"
        >
          Senior High Honors
        </label>
        <Input id="seniorHighHonors" {...register("seniorHighHonors")} />
        {errors.seniorHighHonors && (
          <span className="text-sm font-medium text-red-600">
            {errors.seniorHighHonors.message}
          </span>
        )}
      </div>

      <div className="w-full space-y-2">
        <label
          htmlFor="seniorHighSchoolGraduate"
          className="block text-sm font-medium text-primary"
        >
          Senior High School Graduate
        </label>
        <Input
          id="seniorHighSchoolGraduate"
          {...register("seniorHighSchoolGraduate")}
        />
        {errors.seniorHighSchoolGraduate && (
          <span className="text-sm font-medium text-red-600">
            {errors.seniorHighSchoolGraduate.message}
          </span>
        )}
      </div>

      <hr />

      <div className="w-full space-y-2">
        <label
          htmlFor="ncae_grade"
          className="block text-sm font-medium text-primary"
        >
          NCAE Grade
        </label>
        <Input id="ncae_grade" {...register("ncae_grade")} />
        {errors.ncae_grade && (
          <span className="text-sm font-medium text-red-600">
            {errors.ncae_grade.message}
          </span>
        )}
      </div>

      <div className="w-full space-y-2">
        <label
          htmlFor="ncae_year_taken"
          className="block text-sm font-medium text-primary"
        >
          NCAE Year Taken
        </label>
        <Input id="ncae_year_taken" {...register("ncae_year_taken")} />
        {errors.ncae_year_taken && (
          <span className="text-sm font-medium text-red-600">
            {errors.ncae_year_taken.message}
          </span>
        )}
      </div>

      <div className="w-full space-y-2">
        <label
          htmlFor="latest_college"
          className="block text-sm font-medium text-primary"
        >
          Latest College
        </label>
        <Input id="latest_college" {...register("latest_college")} />
        {errors.latest_college && (
          <span className="text-sm font-medium text-red-600">
            {errors.latest_college.message}
          </span>
        )}
      </div>

      <div className="w-full space-y-2">
        <label
          htmlFor="college_address"
          className="block text-sm font-medium text-primary"
        >
          College Address
        </label>
        <Input id="college_address" {...register("college_address")} />
        {errors.college_address && (
          <span className="text-sm font-medium text-red-600">
            {errors.college_address.message}
          </span>
        )}
      </div>

      <div className="w-full space-y-2">
        <label
          htmlFor="college_honors"
          className="block text-sm font-medium text-primary"
        >
          College Honor's
        </label>
        <Input id="college_honors" {...register("college_honors")} />
        {errors.college_honors && (
          <span className="text-sm font-medium text-red-600">
            {errors.college_honors.message}
          </span>
        )}
      </div>

      <div className="w-full space-y-2">
        <label
          htmlFor="program"
          className="block text-sm font-medium text-primary"
        >
          Program
        </label>
        <Input id="program" {...register("program")} />
        {errors.program && (
          <span className="text-sm font-medium text-red-600">
            {errors.program.message}
          </span>
        )}
      </div>
    </div>
  );
};

export default AcademicHistoryComponent;
