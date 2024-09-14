/* eslint-disable react/prop-types */

import { Input } from "../ui/input";

/**
 * A simple search input component that takes a value and an onChange
 * callback as props. The component renders a simple input field with
 * placeholder text and styles it to match the design of the rest of the
 * application. The component also accepts a className prop that can be
 * used to add additional CSS styles to the component.
 *
 * @param {{ placeholder: string, filterValue: string | null, setFilterValue: (value: string) => void, className: string }} props
 * @returns {JSX.Element}
 */
const SearchInput = ({
  placeholder,
  filterValue,
  setFilterValue,
  className,
}) => {
  return (
    <Input
      placeholder={placeholder}
      value={filterValue ?? ""}
      onChange={(event) => setFilterValue(event.target.value)}
      className={`mb-5 h-[3.3em] w-full !rounded !border-[1.5px] !border-stroke bg-white !px-5 !py-3 text-[1rem] font-medium text-black !outline-none focus:!border-primary active:!border-primary disabled:cursor-default disabled:!bg-whiter dark:!border-form-strokedark dark:!bg-form-input dark:!text-white dark:focus:!border-primary ${className}`}
    />
  );
};

export default SearchInput;
