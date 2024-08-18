/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const StatusFilter = ({ table, option }) => {
  const [status, setStatus] = useState("all");

  const handleStatusChange = (value) => {
    setStatus(value === "all" ? "" : value);
    table.setGlobalFilter(value === "all" ? "" : value); // Set global filter for the table
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <div>
          {option && (option === "campus" || option === "department") ? (
            <p>Status Filter: </p>
          ) : (
            <p
              className={`${option && (option === "campus" || option === "department") ? "text-sm" : ""}`}
            >
              Total: {table.getFilteredRowModel().rows.length}
            </p>
          )}
        </div>
        <Select
          onValueChange={(value) => {
            handleStatusChange(value);
            console.log("Status Filter: ", status)
          }}
          value={status}
        >
          <SelectTrigger
            className={`h-[3em] max-w-[115px] !rounded !border-[1.5px] !border-stroke bg-white !px-5 !py-3 text-[1rem] font-medium text-black shadow-default !outline-none !transition focus:!border-primary active:!border-primary disabled:cursor-default disabled:!bg-whiter dark:!border-form-strokedark dark:!bg-form-input dark:!text-white dark:focus:!border-primary ${option && (option === "campus" || option === "department") ? "max-w-[70px] !p-1 text-sm" : ""}`}
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
