/* eslint-disable react/prop-types */
const FormInput = ({
  id,
  type = "text",
  placeholder,
  register,
  validationRules,
  disabled,
  className,
}) => {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${className}`}
      {...register(id, validationRules)}
      disabled={disabled}
    />
  );
};

export default FormInput;
