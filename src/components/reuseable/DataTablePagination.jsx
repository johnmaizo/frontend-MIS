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

/**
 * @function DataTablePagination
 * @description A reusable component to display pagination
 * @param {object} table - The table instance
 * @param {number} totalStudents - Total number of students
 * @param {number} totalDepartments - Total number of departments
 * @param {string} totalName - Total name of the departments
 * @param {number} rowsPerPage - Number of rows per page
 * @returns {ReactElement} The pagination component
 */
export function DataTablePagination({
  table,
  totalStudents,
  totalDepartments,
  totalName,
  rowsPerPage,
}) {
  const [pageSize, setPageSize] = useState(rowsPerPage ? rowsPerPage : 5); // State to manage the page size

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

      <div className="text-muted-foreground flex flex-col items-start gap-5 md:flex-row md:items-center md:gap-0 md:space-x-6 lg:space-x-8">
        {totalStudents && totalStudents !== undefined ? (
          <div>
            <p>Total Students: {totalStudents}</p>
          </div>
        ) : totalName && totalName !== undefined ? (
          <div>
            <p>
              Total {totalName}
              {totalDepartments > 1 && totalName !== "Campus" && "s"}:{" "}
              {totalDepartments}
            </p>
          </div>
        ) : (
          totalDepartments &&
          totalDepartments !== undefined && (
            <div>
              <p>Total Departments: {totalDepartments}</p>
            </div>
          )
        )}

        <div className="flex items-center space-x-2 md:space-x-0">
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
          {}
        </div>
        <div className="flex flex-col-reverse gap-3 md:flex-row">
          <div className="flex w-[100px] items-center text-sm font-medium md:justify-center">
            <p className="font-[500]">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="flex h-8 w-8 !bg-primary p-0 !text-white hover:opacity-85"
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
              className="flex h-8 w-8 !bg-primary p-0 !text-white hover:opacity-85"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <FiChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
