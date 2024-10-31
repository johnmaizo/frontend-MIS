import { useFormContext } from "react-hook-form";
import { Input } from "../../../../../components/ui/input";

const DocumentsComponent = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4 text-start">
      <div className="space-y-2">
        <label
          htmlFor={register("address").name}
          className="block text-sm font-medium text-primary"
        >
          Address
        </label>
        <Input
          id={register("address").name}
          {...register("address")}
          className="block w-full rounded-md border p-2"
        />
        {errors.address && (
          <span className="text-sm font-medium text-red-600">
            {errors.address.message}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor={register("city").name}
          className="block text-sm font-medium text-primary"
        >
          City
        </label>
        <Input
          id={register("city").name}
          {...register("city")}
          className="block w-full rounded-md border p-2"
        />
        {errors.city && (
          <span className="text-sm font-medium text-red-600">
            {errors.city.message}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor={register("postalCode").name}
          className="block text-sm font-medium text-primary"
        >
          Postal Code
        </label>
        <Input
          id={register("postalCode").name}
          {...register("postalCode")}
          className="block w-full rounded-md border p-2"
        />
        {errors.postalCode && (
          <span className="text-sm font-medium text-red-600">
            {errors.postalCode.message}
          </span>
        )}
      </div>
    </div>
  );
};

export default DocumentsComponent;
