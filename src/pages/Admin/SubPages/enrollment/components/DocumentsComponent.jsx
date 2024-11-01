import { useFormContext } from "react-hook-form";
// import { Input } from "../../../../../components/ui/input";

const DocumentsComponent = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4 text-start">
      {/* form_167 */}
      <div className="w-full space-y-2">
        <label
          htmlFor="form_167"
          className="block text-sm font-medium text-primary"
        >
          Form 167
        </label>
        <input type="checkbox" id="form_167" {...register("form_167")} />
        {errors.form_167 && (
          <span className="text-sm font-medium text-red-600">
            {errors.form_167.message}
          </span>
        )}
      </div>

      {/* certificate_of_good_moral */}
      <div className="w-full space-y-2">
        <label
          htmlFor="certificate_of_good_moral"
          className="block text-sm font-medium text-primary"
        >
          Certificate of Good Moral
        </label>
        <input
          type="checkbox"
          id="certificate_of_good_moral"
          {...register("certificate_of_good_moral")}
        />
        {errors.certificate_of_good_moral && (
          <span className="text-sm font-medium text-red-600">
            {errors.certificate_of_good_moral.message}
          </span>
        )}
      </div>

      {/* transcript_of_records */}
      <div className="w-full space-y-2">
        <label
          htmlFor="transcript_of_records"
          className="block text-sm font-medium text-primary"
        >
          Transcript of Records
        </label>
        <input
          type="checkbox"
          id="transcript_of_records"
          {...register("transcript_of_records")}
        />
        {errors.transcript_of_records && (
          <span className="text-sm font-medium text-red-600">
            {errors.transcript_of_records.message}
          </span>
        )}
      </div>

      {/* nso_birth_certificate */}
      <div className="w-full space-y-2">
        <label
          htmlFor="nso_birth_certificate"
          className="block text-sm font-medium text-primary"
        >
          NSO Birth Certificate
        </label>
        <input
          type="checkbox"
          id="nso_birth_certificate"
          {...register("nso_birth_certificate")}
        />
        {errors.nso_birth_certificate && (
          <span className="text-sm font-medium text-red-600">
            {errors.nso_birth_certificate.message}
          </span>
        )}
      </div>

      {/* two_by_two_id_photo */}
      <div className="w-full space-y-2">
        <label
          htmlFor="two_by_two_id_photo"
          className="block text-sm font-medium text-primary"
        >
          2x2 ID Photo
        </label>
        <input
          type="checkbox"
          id="two_by_two_id_photo"
          {...register("two_by_two_id_photo")}
        />
        {errors.two_by_two_id_photo && (
          <span className="text-sm font-medium text-red-600">
            {errors.two_by_two_id_photo.message}
          </span>
        )}
      </div>

      {/* certificate_of_transfer_credential */}
      <div className="w-full space-y-2">
        <label
          htmlFor="certificate_of_transfer_credential"
          className="block text-sm font-medium text-primary"
        >
          Certificate of Transfer Credential
        </label>
        <input
          type="checkbox"
          id="certificate_of_transfer_credential"
          {...register("certificate_of_transfer_credential")}
        />
        {errors.certificate_of_transfer_credential && (
          <span className="text-sm font-medium text-red-600">
            {errors.certificate_of_transfer_credential.message}
          </span>
        )}
      </div>
    </div>
  );
};

export default DocumentsComponent;
