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
const ReuseTable = ({ table, columns, loading, error }) => {
  return (
    <Table className="border border-stroke dark:border-strokedark">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            className="border-none dark:bg-[#313D4A] bg-gray-2 transition-none"
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
        className={`!divide-x !divide-y !divide-stroke dark:!divide-strokedark transition-none ${loading || error ? "relative h-[7.5em]" : ""}`}
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
              className={`${i === 0 ? "!border-none" : ""} transition-none !divide-x !divide-y !divide-stroke dark:!divide-strokedark`}
              // className={`!divide-x !divide-y  !divide-stroke dark:!divide-strokedark`}
            >
              {row.getVisibleCells().map((cell, i) => (
                <TableCell
                  key={cell.id}
                  className={` ${i === 0 ? "pl-[1em]" : ""} text-[1rem] py-3 text-black dark:border-strokedark dark:text-white`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
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
