/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

/**
 * StatusFilter is a reusable component to filter the table based on the status.
 * It accepts two props: `table` and `option`. The `table` prop should be an instance of the `useReactTable` hook.
 * The `option` prop is optional and can be either "campus", "department", or "semester". If provided, it will display a different label and max-width for the select.
 * The component renders a select with options for "All", "Active", and "Inactive". When the user selects an option, it will set the global filter for the table.
 * @param {Object} table - The instance of the `useReactTable` hook.
 * @param {String} option - The option to display a different label and max-width for the select. Can be either "campus", "department", or "semester".
 * @returns {ReactElement} - The StatusFilter component.
 */
const StatusFilter = ({ table, option }) => {
  const [status, setStatus] = useState("all");

  const handleStatusChange = (value) => {
    setStatus(value === "all" ? "" : value);
    table.setGlobalFilter(value === "all" ? "" : value); // Set global filter for the table
  };

  return (
    <>
      <div className=" md:flex items-center gap-2">
        <div>
          {option && (option === "campus" || option === "department" || option === "semester") ? (
            <p>Filter Status: </p>
          ) : (
            <p
              className={`${option && (option === "campus" || option === "department" || option === "semester") ? "text-sm" : ""}`}
            >
              Total: {table.getFilteredRowModel().rows.length}
            </p>
          )}
        </div>
        <Select
          onValueChange={(value) => handleStatusChange(value)}
          value={status}
        >
          <SelectTrigger
            className={`h-[3em] max-w-[115px] !rounded !border-[1.5px] !border-stroke bg-white !px-5 !py-3 text-[1rem] font-medium text-black shadow-default !outline-none focus:!border-primary active:!border-primary disabled:cursor-default disabled:!bg-whiter dark:!border-form-strokedark dark:!bg-form-input dark:!text-white dark:focus:!border-primary ${option && (option === "campus" || option === "department" || option === "semester") ? "max-w-[85px] !p-1 text-sm !px-2" : ""}`}
          >
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="dark:bg-[#1A222C]">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default StatusFilter;
