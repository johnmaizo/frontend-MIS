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

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

import { ArrowUpDown } from "lucide-react";

import { ArchiveIcon, UndoIcon } from "../Icons";

import { useSchool } from "../context/SchoolContext";

import ReuseTable from "../reuseable/ReuseTable";
import { getInitialProgramCodeAndCampus } from "../reuseable/GetInitialNames";
import ButtonAction from "../reuseable/ButtonAction";

const DeletedProgram = () => {
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
          <span className="max-w-[10em]">Deleted Program </span>
        </DialogTrigger>
        <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
          <DialogHeader>
            <DialogTitle className="mb-5 text-2xl font-medium text-black dark:text-white">
              Deleted Programs
            </DialogTitle>
            <DialogDescription className="h-[15em] overflow-y-auto overscroll-none text-xl">
              <ProgramTables />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ProgramTables = () => {
  const { fetchProgram, programDeleted, fetchProgramDeleted, loading, error } =
    useSchool();

  const columns = [
    {
      accessorKey: "program_id",
      header: "No.",
      cell: (info) => {
        // `info.row.index` gives the zero-based index of the row
        return <span className="font-semibold">{info.row.index + 1}</span>; // +1 to start numbering from 1
      },
    },
    {
      accessorKey: "programCode",
      header: "Program Code",
      cell: ({ cell }) => {
        return <span className="font-bold">{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "fullDepartmentNameWithCampus",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Department
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return (
          <TooltipProvider delayDuration={75}>
            <Tooltip>
              <TooltipTrigger
                asChild
                className="hover:cursor-auto hover:underline hover:underline-offset-2"
              >
                <span className="font-medium">
                  {getInitialProgramCodeAndCampus(cell.getValue())}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-[1rem]">{cell.getValue().split(" - ")[1]}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
      accessorFn: (row) => `${row.program_id} ${row.isDeleted}`,
      id: "action",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            {row.getValue("isDeleted") && (
              <>
                <Dialog>
                  <DialogTrigger className="rounded-md bg-blue-600 p-1 text-white hover:bg-blue-700">
                    <UndoIcon title={"Reactivate Program"} />
                  </DialogTrigger>
                  <DialogContent className="rounded-sm border border-stroke bg-white p-6 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">
                        Reactivate Program
                      </DialogTitle>
                      <DialogDescription asChild className="mt-2">
                        <p className="mb-5">
                          Are you sure you want to reactivate this Program?
                        </p>
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <div className="mx-[2em] flex w-full justify-center gap-[6em]">
                        {/* <ButtonActionProgram
                          action="reactivate"
                          programId={row.getValue("program_id")}
                          onSuccess={() => {
                            fetchProgramDeleted();
                            fetchProgram();
                          }}
                        /> */}
                        <ButtonAction
                          entityType={"program"}
                          entityId={row.getValue("program_id")}
                          action="reactivate"
                          onSuccess={() => {
                            fetchProgramDeleted();
                            fetchProgram();
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
        data={programDeleted}
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
      <div className="!w-[13.5em] overflow-x-auto xsm:!w-auto xsm:max-w-full">
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

export default DeletedProgram;
