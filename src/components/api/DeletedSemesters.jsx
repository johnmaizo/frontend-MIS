/* eslint-disable react/prop-types */
import {
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

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

import { ArchiveIcon, UndoIcon } from "../Icons";

import { useSchool } from "../context/SchoolContext";

import ButtonAction from "../reuseable/ButtonAction";
import ReuseTable from "../reuseable/ReuseTable";
import { ArrowUpDown } from "lucide-react";

const DeletedSemesters = () => {
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
          <span className="max-w-[8.5em]">Deleted Semesters </span>
        </DialogTrigger>
        <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
          <DialogHeader>
            <DialogTitle className="mb-5 text-2xl font-medium text-black dark:text-white">
              Deleted Semesters
            </DialogTitle>
            <DialogDescription className="h-[15em] overflow-y-auto overscroll-none text-xl">
              <SemesterTables />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

const SemesterTables = () => {
  const {
    fetchSemesters,
    semestersDeleted,
    fetchSemestersDeleted,
    loading,
    error,
  } = useSchool();

  const columns = [
    {
      accessorKey: "semester_id",
      header: "No.",
      cell: (info) => {
        // `info.row.index` gives the zero-based index of the row
        return <span>{info.row.index + 1}</span>; // +1 to start numbering from 1
      },
    },
    {
      accessorKey: "schoolYear",
      header: "School Year",
      cell: ({ cell }) => {
        return <span className="text-lg font-semibold">{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "semesterName",
      header: "Semester",
    },
    {
      accessorKey: "campus.campusName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Campus
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
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
      accessorFn: (row) => `${row.semester_id} ${row.isDeleted}`,
      id: "action",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            {row.getValue("isDeleted") && (
              <>
                <Dialog>
                  <DialogTrigger className="rounded-md bg-blue-600 p-1 text-white hover:bg-blue-700">
                    <UndoIcon title={"Reactivate Semester"} />
                  </DialogTrigger>
                  <DialogContent className="rounded-sm border border-stroke bg-white p-6 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">
                        Reactivate Semester
                      </DialogTitle>
                      <DialogDescription asChild className="mt-2">
                        <p className="mb-5">
                          Are you sure you want to reactivate this semester?
                        </p>
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <div className="mx-[2em] flex w-full justify-center gap-[6em]">
                        {/* <ButtonActionSemester
                          action="reactivate"
                          semesterId={row.getValue("semester_id")}
                          onSuccess={() => {
                            fetchSemestersDeleted();
                            fetchSemesters();
                          }}
                        /> */}
                        <ButtonAction
                          entityType={"semester"}
                          entityId={row.getValue("semester_id")}
                          action="reactivate"
                          onSuccess={() => {
                            fetchSemestersDeleted();
                            fetchSemesters();
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
        data={semestersDeleted}
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
      <div className="!w-[13.5em] overflow-auto overflow-x-auto xsm:!w-auto xsm:max-w-full">
        <ReuseTable
          table={table}
          columns={columns}
          loading={loading}
          error={error}
        />
      </div>
    </>
  );
};

export default DeletedSemesters;
