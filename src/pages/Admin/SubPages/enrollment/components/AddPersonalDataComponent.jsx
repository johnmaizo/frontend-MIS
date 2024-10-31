import { useFormContext } from "react-hook-form";
import { Input } from "../../../../../components/ui/input";

const AddPersonalDataComponent = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4 text-start">
      {/* City Address */}
      <div className="space-y-2">
        <label
          htmlFor="cityAddress"
          className="block text-sm font-medium text-primary"
        >
          City Address
        </label>
        <Input id="cityAddress" {...register("cityAddress")} />
        {errors.cityAddress && (
          <span className="text-sm font-medium text-red-600">
            {errors.cityAddress.message}
          </span>
        )}
      </div>

      {/* City Telephone Number */}
      <div className="space-y-2">
        <label
          htmlFor="cityTelNumber"
          className="block text-sm font-medium text-primary"
        >
          City Telephone Number
        </label>
        <Input id="cityTelNumber" {...register("cityTelNumber")} />
        {errors.cityTelNumber && (
          <span className="text-sm font-medium text-red-600">
            {errors.cityTelNumber.message}
          </span>
        )}
      </div>

      {/* Province Address */}
      <div className="space-y-2">
        <label
          htmlFor="provinceAddress"
          className="block text-sm font-medium text-primary"
        >
          Province Address
        </label>
        <Input id="provinceAddress" {...register("provinceAddress")} />
        {errors.provinceAddress && (
          <span className="text-sm font-medium text-red-600">
            {errors.provinceAddress.message}
          </span>
        )}
      </div>

      {/* Province Telephone Number */}
      <div className="space-y-2">
        <label
          htmlFor="provinceTelNumber"
          className="block text-sm font-medium text-primary"
        >
          Province Telephone Number
        </label>
        <Input id="provinceTelNumber" {...register("provinceTelNumber")} />
        {errors.provinceTelNumber && (
          <span className="text-sm font-medium text-red-600">
            {errors.provinceTelNumber.message}
          </span>
        )}
      </div>
    </div>
  );
};

export default AddPersonalDataComponent;
