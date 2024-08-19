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

import SmallLoader from "../styles/SmallLoader";

import { ArchiveIcon, UndoIcon } from "../Icons";

import { useStudents } from "../context/StudentContext";

import ButtonActionCampus from "../reuseable/ButtonActionCampus";

const DeletedCampus = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
        }}
      >
        <DialogTrigger className="flex items-center gap-1 rounded bg-blue-600 p-2 text-xs font-medium text-white hover:bg-blue-700">
          <ArchiveIcon />
          <span className="max-w-[8em]">Deleted Campus </span>
        </DialogTrigger>
        <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
          <DialogHeader>
            <DialogTitle className="mb-5 text-2xl font-medium text-black dark:text-white">
              Deleted Campus
            </DialogTitle>
            <DialogDescription className="overflow-y-auto overscroll-none text-xl">
              <CampusTables />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

const CampusTables = () => {
  const { campusDeleted, fetchCampusDeleted, fetchCampus, loading, error } =
    useStudents();

  const columns = [
    {
      accessorKey: "campus_id",
      header: "ID",
      cell: ({ cell }) => {
        return <span className="font-semibold">{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "campusName",
      header: "Campus Name",
      cell: ({ cell }) => {
        return <span className="text-lg font-semibold">{cell.getValue()}</span>;
      },
    },

    {
      accessorKey: "isDeleted",
      header: "Status",
      cell: ({ cell }) => {
        return (
          <span
            className={`inline-flex rounded px-3 py-1 text-sm font-medium text-white ${
              cell.getValue() === false ? "bg-success" : "bg-danger"
            }`}
          >
            {cell.getValue() === false ? "Active" : "Deleted"}
          </span>
        );
      },
    },

    {
      header: "Action",
      accessorFn: (row) => `${row.campus_id} ${row.isDeleted}`,
      id: "action",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            {row.getValue("isDeleted") && (
              <>
                <Dialog>
                  <DialogTrigger className="rounded-md bg-blue-600 p-1 text-white hover:bg-blue-700">
                    <UndoIcon />
                  </DialogTrigger>
                  <DialogContent className="rounded-sm border border-stroke bg-white p-6 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">
                        Reactivate
                      </DialogTitle>
                      <DialogDescription asChild className="mt-2">
                        <p className="mb-5">
                          Are you sure you want to reactivate this campus?
                        </p>
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <div className="mx-[2em] flex w-full justify-center gap-[6em]">
                        <ButtonActionCampus
                          action="reactivate"
                          campusId={row.getValue("campus_id")}
                          onSuccess={() => {
                            fetchCampusDeleted();
                            fetchCampus();
                          }}
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
              </>
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
        data={campusDeleted}
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
    </>
  );
};

export default DeletedCampus;
