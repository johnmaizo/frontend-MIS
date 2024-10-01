/* eslint-disable react/prop-types */
import { flexRender } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import SmallLoader from "../styles/SmallLoader";

/**
 * A reusable table component that wraps the @tanstack/react-table
 * functionality.
 *
 * @param {Object} table - The table instance from @tanstack/react-table.
 * @param {Array} columns - The columns to be rendered in the table.
 * @param {boolean} loading - Whether the table is currently loading.
 * @param {string} error - The error message if there is an error.
 *
 * @returns A JSX element representing the table.
 */
const ReuseTable = ({ table, columns, loading, error, forApplicants }) => {
  return (
    <Table className="border border-stroke dark:border-strokedark">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            className="border-none bg-gray-2 transition-none dark:bg-[#313D4A]"
          >
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  className="h-[0.5em] !border-none px-4 py-4 text-[1rem] font-medium text-black dark:text-white"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody
        className={`!divide-x !divide-y !divide-stroke transition-none dark:!divide-strokedark ${loading || error ? "relative h-[7.5em]" : ""}`}
        // className={` transition-none ${loading || error ? "relative h-[7.5em]" : ""}`}
      >
        {loading ? (
          <TableRow className="border-none transition-none hover:!bg-transparent">
            <TableCell
              colSpan={columns.length}
              className="absolute inline-flex h-24 w-full items-center justify-center gap-3 text-center text-2xl font-[500] text-black transition-none dark:text-white"
            >
              <SmallLoader /> Loading...
            </TableCell>
          </TableRow>
        ) : error ? (
          <TableRow className="border-none hover:!bg-transparent">
            <TableCell
              colSpan={columns.length}
              className="absolute inline-flex h-24 w-full items-center justify-center gap-3 text-center text-2xl font-[500] text-red-500"
            >
              Error: {error}
            </TableCell>
          </TableRow>
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row, i) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className={`${i === 0 ? "" : ""} !divide-x !divide-y !divide-stroke border-t border-[#e2e8f0] transition-none dark:!divide-strokedark dark:border-[#2e3a47]`}
              // className={`!divide-x !divide-y  !divide-stroke dark:!divide-strokedark`}
            >
              {row.getVisibleCells().map((cell, i) => (
                <TableCell
                  key={cell.id}
                  className={` ${i === 0 ? "pl-[1em]" : ""} border-t border-[#e2e8f0] py-2 text-[1rem] text-black dark:border-[#2e3a47] dark:text-white`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : table.getRowModel().rows?.length === 0 &&
          forApplicants &&
          forApplicants === true ? (
          <TableRow className="border-none hover:!bg-transparent">
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center text-2xl font-[500]"
            >
              No results found. Click &quot;Sync&quot; to fetch applicants.
            </TableCell>
          </TableRow>
        ) : (
          <TableRow className="border-none hover:!bg-transparent">
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center text-2xl font-[500]"
            >
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ReuseTable;
