import { useFormContext } from "react-hook-form";
import { Input } from "../../../../../components/ui/input";

const FamilyDetailsComponent = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4 text-start">
      {/* Father&apos;s Information */}
      <h3 className="text-lg font-medium text-primary">
        Father&apos;s Information
      </h3>
      {/* Include all father&apos;s fields here using the same pattern */}
      {/* ... */}
      <div className="flex flex-col gap-4 p-2 sm:flex-row sm:gap-6 sm:p-4 md:gap-8 md:p-6 lg:gap-10">
        <div className="w-full space-y-2">
          <label
            htmlFor="fatherFirstName"
            className="block text-sm font-medium text-primary"
          >
            Father&apos;s FirstName
          </label>
          <Input id="fatherFirstName" {...register("fatherFirstName")} />
          {errors.fatherFirstName && (
            <span className="text-sm font-medium text-red-600">
              {errors.fatherFirstName.message}
            </span>
          )}
        </div>
        <div className="w-full space-y-2">
          <label
            htmlFor="fatherMiddleName"
            className="block text-sm font-medium text-primary"
          >
            Father&apos;s MiddleName
          </label>
          <Input id="fatherMiddleName" {...register("fatherMiddleName")} />
          {errors.fatherMiddleName && (
            <span className="text-sm font-medium text-red-600">
              {errors.fatherMiddleName.message}
            </span>
          )}
        </div>
        <div className="w-full space-y-2">
          <label
            htmlFor="fatherLastName"
            className="block text-sm font-medium text-primary"
          >
            Father&apos;s LastName
          </label>
          <Input id="fatherLastName" {...register("fatherLastName")} />
          {errors.fatherLastName && (
            <span className="text-sm font-medium text-red-600">
              {errors.fatherLastName.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 p-2 sm:flex-row sm:gap-6 sm:p-4 md:gap-8 md:p-6 lg:gap-10">
        <div className="w-full space-y-2">
          <label
            htmlFor="fatherAddress"
            className="block text-sm font-medium text-primary"
          >
            Father&apos;s Address
          </label>
          <Input id="fatherAddress" {...register("fatherAddress")} />
          {errors.fatherAddress && (
            <span className="text-sm font-medium text-red-600">
              {errors.fatherAddress.message}
            </span>
          )}
        </div>
        <div className="w-full space-y-2">
          <label
            htmlFor="fatherOccupation"
            className="block text-sm font-medium text-primary"
          >
            Father&apos;s Occupation
          </label>
          <Input id="fatherOccupation" {...register("fatherOccupation")} />
          {errors.fatherOccupation && (
            <span className="text-sm font-medium text-red-600">
              {errors.fatherOccupation.message}
            </span>
          )}
        </div>
        <div className="w-full space-y-2">
          <label
            htmlFor="fatherContactNumber"
            className="block text-sm font-medium text-primary"
          >
            Father&apos;s Contact Number
          </label>
          <Input
            id="fatherContactNumber"
            {...register("fatherContactNumber")}
          />
          {errors.fatherContactNumber && (
            <span className="text-sm font-medium text-red-600">
              {errors.fatherContactNumber.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 p-2 sm:flex-row sm:gap-6 sm:p-4 md:gap-8 md:p-6 lg:gap-10">
        <div className="w-full space-y-2">
          <label
            htmlFor="fatherCompanyName"
            className="block text-sm font-medium text-primary"
          >
            Father&apos;s Company Name
          </label>
          <Input id="fatherCompanyName" {...register("fatherCompanyName")} />
          {errors.fatherCompanyName && (
            <span className="text-sm font-medium text-red-600">
              {errors.fatherCompanyName.message}
            </span>
          )}
        </div>
        <div className="w-full space-y-2">
          <label
            htmlFor="fatherCompanyAddress"
            className="block text-sm font-medium text-primary"
          >
            Father&apos;s Company Address
          </label>
          <Input
            id="fatherCompanyAddress"
            {...register("fatherCompanyAddress")}
          />
          {errors.fatherCompanyAddress && (
            <span className="text-sm font-medium text-red-600">
              {errors.fatherCompanyAddress.message}
            </span>
          )}
        </div>
        <div className="w-full space-y-2">
          <label
            htmlFor="fatherEmail"
            className="block text-sm font-medium text-primary"
          >
            Father&apos;s Email Address
          </label>
          <Input id="fatherEmail" {...register("fatherEmail")} />
          {errors.fatherEmail && (
            <span className="text-sm font-medium text-red-600">
              {errors.fatherEmail.message}
            </span>
          )}
        </div>
        <div className="w-full space-y-2">
          <label
            htmlFor="fatherIncome"
            className="block text-sm font-medium text-primary"
          >
            Father&apos;s Income
          </label>
          <Input id="fatherIncome" {...register("fatherIncome")} />
          {errors.fatherIncome && (
            <span className="text-sm font-medium text-red-600">
              {errors.fatherIncome.message}
            </span>
          )}
        </div>
      </div>

      <hr />

      {/* Mother&apos;s Information */}
      <h3 className="text-lg font-medium text-primary">
        Mother&apos;s Information
      </h3>
      {/* Include all mother&apos;s fields here using the same pattern */}
      {/* ... */}
      <div className="flex flex-col gap-4 p-2 sm:flex-row sm:gap-6 sm:p-4 md:gap-8 md:p-6 lg:gap-10">
        <div className="w-full space-y-2">
          <label
            htmlFor="motherFirstName"
            className="block text-sm font-medium text-primary"
          >
            Mother&apos;s FirstName
          </label>
          <Input id="motherFirstName" {...register("motherFirstName")} />
          {errors.motherFirstName && (
            <span className="text-sm font-medium text-red-600">
              {errors.motherFirstName.message}
            </span>
          )}
        </div>
        <div className="w-full space-y-2">
          <label
            htmlFor="motherMiddleName"
            className="block text-sm font-medium text-primary"
          >
            Mother&apos;s MiddleName
          </label>
          <Input id="motherMiddleName" {...register("motherMiddleName")} />
          {errors.motherMiddleName && (
            <span className="text-sm font-medium text-red-600">
              {errors.motherMiddleName.message}
            </span>
          )}
        </div>
        <div className="w-full space-y-2">
          <label
            htmlFor="motherLastName"
            className="block text-sm font-medium text-primary"
          >
            Mother&apos;s LastName
          </label>
          <Input id="motherLastName" {...register("motherLastName")} />
          {errors.motherLastName && (
            <span className="text-sm font-medium text-red-600">
              {errors.motherLastName.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 p-2 sm:flex-row sm:gap-6 sm:p-4 md:gap-8 md:p-6 lg:gap-10">
        <div className="w-full space-y-2">
          <label
            htmlFor="motherAddress"
            className="block text-sm font-medium text-primary"
          >
            Mother&apos;s Address
          </label>
          <Input id="motherAddress" {...register("motherAddress")} />
          {errors.motherAddress && (
            <span className="text-sm font-medium text-red-600">
              {errors.motherAddress.message}
            </span>
          )}
        </div>
        <div className="w-full space-y-2">
          <label
            htmlFor="motherOccupation"
            className="block text-sm font-medium text-primary"
          >
            Mother&apos;s Occupation
          </label>
          <Input id="motherOccupation" {...register("motherOccupation")} />
          {errors.motherOccupation && (
            <span className="text-sm font-medium text-red-600">
              {errors.motherOccupation.message}
            </span>
          )}
        </div>
        <div className="w-full space-y-2">
          <label
            htmlFor="motherContactNumber"
            className="block text-sm font-medium text-primary"
          >
            Mother&apos;s Contact Number
          </label>
          <Input
            id="motherContactNumber"
            {...register("motherContactNumber")}
          />
          {errors.motherContactNumber && (
            <span className="text-sm font-medium text-red-600">
              {errors.motherContactNumber.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 p-2 sm:flex-row sm:gap-6 sm:p-4 md:gap-8 md:p-6 lg:gap-10">
        <div className="w-full space-y-2">
          <label
            htmlFor="motherCompanyName"
            className="block text-sm font-medium text-primary"
          >
            Mother&apos;s Company Name
          </label>
          <Input id="motherCompanyName" {...register("motherCompanyName")} />
          {errors.motherCompanyName && (
            <span className="text-sm font-medium text-red-600">
              {errors.motherCompanyName.message}
            </span>
          )}
        </div>
        <div className="w-full space-y-2">
          <label
            htmlFor="motherCompanyAddress"
            className="block text-sm font-medium text-primary"
          >
            Mother&apos;s Company Address
          </label>
          <Input
            id="motherCompanyAddress"
            {...register("motherCompanyAddress")}
          />
          {errors.motherCompanyAddress && (
            <span className="text-sm font-medium text-red-600">
              {errors.motherCompanyAddress.message}
            </span>
          )}
        </div>
        <div className="w-full space-y-2">
          <label
            htmlFor="motherEmail"
            className="block text-sm font-medium text-primary"
          >
            Mother&apos;s Email Address
          </label>
          <Input id="motherEmail" {...register("motherEmail")} />
          {errors.motherEmail && (
            <span className="text-sm font-medium text-red-600">
              {errors.motherEmail.message}
            </span>
          )}
        </div>
        <div className="w-full space-y-2">
          <label
            htmlFor="motherIncome"
            className="block text-sm font-medium text-primary"
          >
            Mother&apos;s Income
          </label>
          <Input id="motherIncome" {...register("motherIncome")} />
          {errors.motherIncome && (
            <span className="text-sm font-medium text-red-600">
              {errors.motherIncome.message}
            </span>
          )}
        </div>
      </div>

      <hr />

      {/* Guardian&apos;s Information */}
      <h3 className="text-lg font-medium text-primary">
        Guardian&apos;s Information
      </h3>
      {/* Include all guardian&apos;s fields here using the same pattern */}
      {/* ... */}
      <div className="flex flex-col gap-4 p-2 sm:flex-row sm:gap-6 sm:p-4 md:gap-8 md:p-6 lg:gap-10">
        <div className="w-full space-y-2">
          <label
            htmlFor="guardianFirstName"
            className="block text-sm font-medium text-primary"
          >
            Guardian&apos;s FirstName
          </label>
          <Input id="guardianFirstName" {...register("guardianFirstName")} />
          {errors.guardianFirstName && (
            <span className="text-sm font-medium text-red-600">
              {errors.guardianFirstName.message}
            </span>
          )}
        </div>
        <div className="w-full space-y-2">
          <label
            htmlFor="guardianMiddleName"
            className="block text-sm font-medium text-primary"
          >
            Guardian&apos;s MiddleName
          </label>
          <Input id="guardianMiddleName" {...register("guardianMiddleName")} />
          {errors.guardianMiddleName && (
            <span className="text-sm font-medium text-red-600">
              {errors.guardianMiddleName.message}
            </span>
          )}
        </div>
        <div className="w-full space-y-2">
          <label
            htmlFor="guardianLastName"
            className="block text-sm font-medium text-primary"
          >
            Guardian&apos;s LastName
          </label>
          <Input id="guardianLastName" {...register("guardianLastName")} />
          {errors.guardianLastName && (
            <span className="text-sm font-medium text-red-600">
              {errors.guardianLastName.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 p-2 sm:flex-row sm:gap-6 sm:p-4 md:gap-8 md:p-6 lg:gap-10">
        <div className="w-full space-y-2">
          <label
            htmlFor="guardianRelation"
            className="block text-sm font-medium text-primary"
          >
            Guardian&apos;s Relation
          </label>
          <Input id="guardianRelation" {...register("guardianRelation")} />
          {errors.guardianRelation && (
            <span className="text-sm font-medium text-red-600">
              {errors.guardianRelation.message}
            </span>
          )}
        </div>
        <div className="w-full space-y-2">
          <label
            htmlFor="guardianContactNumber"
            className="block text-sm font-medium text-primary"
          >
            Guardian&apos;s Contact Number
          </label>
          <Input
            id="guardianContactNumber"
            {...register("guardianContactNumber")}
          />
          {errors.guardianContactNumber && (
            <span className="text-sm font-medium text-red-600">
              {errors.guardianContactNumber.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FamilyDetailsComponent;
