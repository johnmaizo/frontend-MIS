/* eslint-disable react/prop-types */
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/selectRowFilter";

const SelectRows = ({ table }) => {
  const [pageSize, setPageSize] = useState(10); // State to manage the page size

  const handleRowsPerPageChange = (newPageSize) => {
    setPageSize(newPageSize);
    table.setPageSize(newPageSize);
  };

  return (
    <div>
      <Select
        value={pageSize.toString()} // Ensure the value is a string
        onValueChange={(value) => handleRowsPerPageChange(parseInt(value, 10))}
        className="w-[60px] font-[500]"
        variant="primary"
      >
        <SelectTrigger className="w-[60px] font-[500] dark:bg-[#1A222C]">
          <SelectValue placeholder="Rows per Page" />
        </SelectTrigger>
        <SelectContent className="dark:bg-[#1A222C]">
          <SelectItem value="5">5</SelectItem>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="30">30</SelectItem>
          <SelectItem value="40">40</SelectItem>
          <SelectItem value="50">50</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectRows;
