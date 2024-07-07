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

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

import { useEffect, useState } from "react";
import axios from "axios";

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
import ButtonAction from "../reuseable/ButtonAction";

const StudentTables = () => {
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/students");

        setStudents(response.data);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to fetch students");
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger aria-label="View Student">
                  <Link
                    to={`/students/student-list/${row.getValue("student_id")}`}
                    className="inline-block p-2 hover:text-primary"
                  >
                    <EyeIcon />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Student</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {row.getValue("isActive") ? (
              <Dialog>
                <DialogTrigger className="p-2 hover:text-primary">
                  <DeleteIcon />
                </DialogTrigger>
                <DialogContent className="rounded-sm border border-stroke bg-white p-6 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Delete</DialogTitle>
                    <DialogDescription className="mt-2">
                      <p className="mb-5">
                        Are you sure you want to delete this student?
                      </p>

                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <div className="flex mx-[2em] justify-center gap-[6em] w-full">

                      <ButtonAction action="delete" studentId={row.getValue("student_id")} />
                      <DialogClose asChild>
                        <Button variant="ghost" className="w-full underline-offset-4 hover:underline">Cancel</Button>
                      </DialogClose>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              // <TooltipProvider>
              //   <Tooltip>
              //     <TooltipTrigger
              //       className="p-2 hover:text-primary"
              //       aria-label="Reactivate Student"
              //     >
              //       <ReactivateIcon />
              //     </TooltipTrigger>
              //     <TooltipContent>
              //       <p>Reactivate Student</p>
              //     </TooltipContent>
              //   </Tooltip>
              // </TooltipProvider>
              <Dialog>
                <DialogTrigger className="p-2 hover:text-primary">
                  <ReactivateIcon />
                </DialogTrigger>
                <DialogContent className="rounded-sm border border-stroke bg-white p-6 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Reactivate</DialogTitle>
                    <DialogDescription className="mt-2">
                      <p className="mb-5">Are you sure you want to reactivate this student?</p>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <div className="flex mx-[2em] justify-center gap-[6em] w-full">

                      <ButtonAction action="reactivate" studentId={row.getValue("student_id")} />
                      <DialogClose asChild>
                        <Button variant="ghost" className="w-full underline-offset-4 hover:underline">Cancel</Button>
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
      <div className="flex items-center gap-5 py-4">
        <Input
          placeholder="Search by ID ..."
          value={table.getColumn("student_id")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("student_id")?.setFilterValue(event.target.value)
          }
          className="h-[3em] max-w-[10em] !rounded !border-[1.5px] !border-stroke bg-white !px-5 !py-3 text-[1rem] font-medium text-black shadow-default !outline-none !transition focus:!border-primary active:!border-primary disabled:cursor-default disabled:!bg-whiter dark:!border-form-strokedark dark:!bg-form-input dark:!text-white dark:focus:!border-primary"
        />

        <Input
          placeholder="Search by Name ..."
          value={table.getColumn("fullName")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("fullName")?.setFilterValue(event.target.value)
          }
          className="h-[3em] max-w-xs !rounded !border-[1.5px] !border-stroke bg-white !px-5 !py-3 text-[1rem] font-medium text-black shadow-default !outline-none !transition focus:!border-primary active:!border-primary disabled:cursor-default disabled:!bg-whiter dark:!border-form-strokedark dark:!bg-form-input dark:!text-white dark:focus:!border-primary"
        />

        <Input
          placeholder="Search by Email ..."
          value={table.getColumn("email")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="h-[3em] max-w-xs !rounded !border-[1.5px] !border-stroke bg-white !px-5 !py-3 text-[1rem] font-medium text-black shadow-default !outline-none !transition focus:!border-primary active:!border-primary disabled:cursor-default disabled:!bg-whiter dark:!border-form-strokedark dark:!bg-form-input dark:!text-white dark:focus:!border-primary"
        />

        <StatusFilter table={table} />
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
        {/* <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="primary"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className = " bg-primary text-white hover:opacity-85"
          >
            <ArrowLeftIcon className=" mr-1 h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className = " bg-primary text-white hover:opacity-85"
          >
            Next
            <ArrowRightIcon className=" ml-1 h-4 w-4" />
          </Button>
        </div> */}

        <div className="flex w-full items-center justify-end py-4">
          <DataTablePagination table={table} />
        </div>
      </div>
    </>
  );
};

export default StudentTables;
