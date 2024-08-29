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

const ReuseTable = ({ table, columns, loading, error }) => {
  return (
    <Table className="border border-stroke dark:border-strokedark">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            className="border-none bg-gray-2 dark:bg-meta-4"
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
        className={`!divide-y !divide-stroke dark:!divide-strokedark ${loading || error ? "relative h-[7.5em]" : ""}`}
      >
        {loading ? (
          <TableRow className="border-none hover:!bg-transparent">
            <TableCell
              colSpan={columns.length}
              className="absolute inline-flex h-24 w-full items-center justify-center gap-3 text-center text-2xl font-[500] text-black dark:text-white"
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
              className={`${i === 0 ? "border-none" : ""}`}
            >
              {row.getVisibleCells().map((cell, i) => (
                <TableCell
                  key={cell.id}
                  className={` ${i === 0 ? "pl-[1em]" : ""} text-[1rem] text-black dark:border-strokedark dark:text-white`}
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
