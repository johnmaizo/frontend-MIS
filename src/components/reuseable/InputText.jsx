const InputText = ({ disabled, value, className }) => {
  return (
    <>
      <input
        type="text"
        className={` w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${className}`}
        disabled={disabled}
        value={value}
      />
    </>
  );
};

export default InputText;
