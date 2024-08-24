/* eslint-disable react/prop-types */
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { useState } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { DataTablePagination } from "../reuseable/DataTablePagination";

import { ArrowUpDown } from "lucide-react";

import SmallLoader from "../styles/SmallLoader";
import { DeleteIcon, EyeIcon, ReactivateIcon } from "../Icons";
import { Link } from "react-router-dom";
import StatusFilter from "../reuseable/StatusFilter";

import ButtonActionStudent from "../reuseable/ButtonActionStudent";
import { useSchool } from "../context/SchoolContext";

const StudentTables = () => {
  const { students, fetchStudents, loading, error } = useSchool();

  const columns = [
    {
      accessorKey: "student_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Student ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorFn: (row) => {
        const middleInitial =
          row.middleName && row.middleName.trim() !== ""
            ? `${row.middleName.charAt(0)}.`
            : "";
        return `${row.firstName} ${middleInitial} ${row.lastName}`;
      },
      id: "fullName",
      header: "Name",
    },
    {
      accessorKey: "gender",
      header: "Gender",
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date Created",
      cell: ({ cell }) => {
        return `${cell.getValue().toString().split("T")[0]} at ${new Date(cell.getValue()).toLocaleTimeString()}`;
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ cell }) => {
        return (
          <span
            className={`inline-flex rounded px-3 py-1 text-sm font-medium text-white ${
              cell.getValue() ? "bg-success" : "bg-danger"
            }`}
          >
            {cell.getValue() ? "Active" : "Inactive"}
          </span>
        );
      },
    },

    {
      header: "Actions",
      accessorFn: (row) => `${row.student_id} ${row.isActive}`,
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            {/* <TooltipProvider>
              <Tooltip>
                <TooltipTrigger aria-label="View Student">
                  
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Student</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider> */}
            <Link
              to={`/students/student-list/${row.getValue("student_id")}`}
              className="inline-block p-2 hover:text-primary"
            >
              <EyeIcon />
            </Link>
            {row.getValue("isActive") ? (
              <Dialog>
                <DialogTrigger className="p-2 hover:text-primary">
                  <DeleteIcon />
                </DialogTrigger>
                <DialogContent className="rounded-sm border border-stroke bg-white p-6 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                      Deactivate
                    </DialogTitle>
                    <DialogDescription asChild className="mt-2">
                      <p className="mb-5">
                        Are you sure you want to deactivate this student?
                      </p>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <div className="mx-[2em] flex w-full justify-center gap-[6em]">
                      <ButtonActionStudent
                        action="delete"
                        studentId={row.getValue("student_id")}
                        onSuccess={fetchStudents}
                      />
                      <DialogClose asChild>
                        <Button
                          variant="ghost"
                          className="w-full underline-offset-4 hover:underline"
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <Dialog>
                <DialogTrigger className="p-2 hover:text-primary">
                  <ReactivateIcon />
                </DialogTrigger>
                <DialogContent className="rounded-sm border border-stroke bg-white p-6 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                      Reactivate
                    </DialogTitle>
                    <DialogDescription asChild className="mt-2">
                      <p className="mb-5">
                        Are you sure you want to reactivate this student?
                      </p>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <div className="mx-[2em] flex w-full justify-center gap-[6em]">
                      <ButtonActionStudent
                        action="reactivate"
                        studentId={row.getValue("student_id")}
                        onSuccess={fetchStudents}
                      />
                      <DialogClose asChild>
                        <Button
                          variant="ghost"
                          className="w-full underline-offset-4 hover:underline"
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={students}
        loading={loading}
        error={error}
      />
    </>
  );
};

const DataTable = ({ data, columns, loading, error }) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <>
      <div className="flex flex-col gap-5 py-4 md:flex-row md:items-center">
        <Input
          placeholder="Search by ID ..."
          value={table.getColumn("student_id")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("student_id")?.setFilterValue(event.target.value)
          }
          className="h-[3em] w-full !rounded !border-[1.5px] !border-stroke bg-white !px-5 !py-3 text-[1rem] font-medium text-black shadow-default !outline-none !transition focus:!border-primary active:!border-primary disabled:cursor-default disabled:!bg-whiter dark:!border-form-strokedark dark:!bg-form-input dark:!text-white dark:focus:!border-primary md:max-w-[10em]"
        />

        <Input
          placeholder="Search by Name ..."
          value={table.getColumn("fullName")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("fullName")?.setFilterValue(event.target.value)
          }
          className="h-[3em] w-full !rounded !border-[1.5px] !border-stroke bg-white !px-5 !py-3 text-[1rem] font-medium text-black shadow-default !outline-none !transition focus:!border-primary active:!border-primary disabled:cursor-default disabled:!bg-whiter dark:!border-form-strokedark dark:!bg-form-input dark:!text-white dark:focus:!border-primary md:max-w-xs"
        />

        <Input
          placeholder="Search by Email ..."
          value={table.getColumn("email")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="h-[3em] w-full !rounded !border-[1.5px] !border-stroke bg-white !px-5 !py-3 text-[1rem] font-medium text-black shadow-default !outline-none !transition focus:!border-primary active:!border-primary disabled:cursor-default disabled:!bg-whiter dark:!border-form-strokedark dark:!bg-form-input dark:!text-white dark:focus:!border-primary md:max-w-xs"
        />

        <div className="flex w-[11.5em] items-center lg:ml-auto">
          <StatusFilter table={table} />
        </div>
      </div>

      <div className="mb-4 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="max-w-full overflow-x-auto">
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
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
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
        </div>

        <div className="flex w-full justify-start py-4 md:items-center md:justify-end">
          <DataTablePagination table={table} totalStudents={data.length} />
        </div>
      </div>
    </>
  );
};

export default StudentTables;
