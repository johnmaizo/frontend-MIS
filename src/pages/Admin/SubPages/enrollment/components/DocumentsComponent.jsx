import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "../../../../../components/ui/checkbox";

const DocumentsComponent = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const renderCheckboxField = (name, label) => (
    <div className="w-full space-y-2">
      <div className="flex items-center space-x-2">
        <Controller
          name={name}
          control={control}
          defaultValue={false} // Ensure default value is boolean
          render={({ field }) => (
            <Checkbox
              id={name}
              checked={field.value} // Pass boolean value
              onCheckedChange={field.onChange} // Handle boolean change
            />
          )}
        />
        <label
          htmlFor={name}
          className="cursor-pointer px-2 py-4 text-sm font-medium leading-none text-primary peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      </div>
      {errors[name] && (
        <span className="text-sm font-medium text-red-600">
          {errors[name].message}
        </span>
      )}
    </div>
  );

  return (
    <div className="space-y-4 text-start">
      {renderCheckboxField("form_167", "Form 167")}
      {renderCheckboxField(
        "certificate_of_good_moral",
        "Certificate of Good Moral",
      )}
      {renderCheckboxField("transcript_of_records", "Transcript of Records")}
      {renderCheckboxField("nso_birth_certificate", "NSO Birth Certificate")}
      {renderCheckboxField("two_by_two_id_photo", "2x2 ID Photo")}
      {renderCheckboxField(
        "certificate_of_transfer_credential",
        "Certificate of Transfer Credential",
      )}
    </div>
  );
};

export default DocumentsComponent;
