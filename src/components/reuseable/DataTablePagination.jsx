/* eslint-disable react/prop-types */
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

import { useState } from "react";

import { Button } from "../ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/selectRowFilter";

export function DataTablePagination({ table }) {
  const [pageSize, setPageSize] = useState(10); // State to manage the page size

  const handleRowsPerPageChange = (newPageSize) => {
    setPageSize(newPageSize);
    table.setPageSize(newPageSize);
  };
  return (
    <>
      {/* <div className="text-muted-foreground flex-1 text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div> */}

      <div className="text-muted-foreground flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-[500]">Rows per page</p>
          {/* <p>{`${table.getState().pagination.pageSize}`}</p> */}
          <div>
            <Select
              value={pageSize.toString()} // Ensure the value is a string
              onValueChange={(value) =>
                handleRowsPerPageChange(parseInt(value, 10))
              }
              className="w-[60px] font-[500]"
              variant="primary"
            >
              <SelectTrigger className="w-[60px] font-[500] dark:bg-[#1A222C]">
                <SelectValue placeholder="Rows per Page" />
              </SelectTrigger>
              <SelectContent className=" dark:bg-[#1A222C] ">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {}
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          <p className=" font-[500]">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 !bg-primary p-0 !text-white hover:opacity-85 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <FiChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 !bg-primary p-0 !text-white hover:opacity-85"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <FiChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 !bg-primary p-0 !text-white hover:opacity-85"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <FiChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 !bg-primary p-0 !text-white hover:opacity-85 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <FiChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
