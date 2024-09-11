/* eslint-disable react/prop-types */
import {
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { useEffect, useState } from "react";

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

import { ArchiveIcon, SelectIcon, UndoIcon } from "../Icons";

import { useSchool } from "../context/SchoolContext";

import ButtonAction from "../reuseable/ButtonAction";
import ReuseTable from "../reuseable/ReuseTable";

const SelectFloor = ({ campusName, buildingName }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log(open)
  },[open])

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
        }}
      >
        <DialogTrigger className="flex items-center gap-1 rounded bg-blue-600 p-2 text-xs font-medium text-white hover:bg-blue-700">
          <SelectIcon />
          <span className="max-w-[10em]">Select Floor </span>
        </DialogTrigger>
        <DialogContent className="max-w-[40em] rounded-sm border border-stroke bg-white p-4 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white lg:max-w-[60em]">
          <DialogHeader>
            <DialogTitle className="mb-5 text-2xl font-medium text-black dark:text-white">
              Select Floor {`(${buildingName} - ${campusName})`}
            </DialogTitle>
            <DialogDescription className="h-[15em] overflow-y-auto overscroll-none text-xl">
              <FloorTables buildingName={buildingName} setOpen={setOpen}  />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

const FloorTables = ({ buildingName, setOpen }) => {
  const { floors, fetchFloors, loadingFloors, error } =
    useSchool();

  const columns = [
    {
      accessorKey: "structure_id",
      header: "Numeric ID",
      cell: (info) => {
        // `info.row.index` gives the zero-based index of the row
        return <span>{info.row.index + 1}</span>; // +1 to start numbering from 1
      },
    },
    {
      accessorKey: "floorName",
      header: "Floor Name",
      cell: ({ cell }) => {
        return <span className="text-lg font-semibold">{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "campus.campusName",
      id: "campusName",
      header: "Campus Name",
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

    // {
    //   header: "Action",
    //   accessorFn: (row) => `${row.structure_id} ${row.isDeleted}`,
    //   id: "action",
    //   cell: ({ row }) => {
    //     return (
    //       <div className="flex items-center gap-1">
    //         {row.getValue("isDeleted") && (
    //           <>
    //             <Dialog>
    //               <DialogTrigger className="rounded-md bg-blue-600 p-1 text-white hover:bg-blue-700">
    //                 <UndoIcon title={"Reactivate Department"} />
    //               </DialogTrigger>
    //               <DialogContent className="rounded-sm border border-stroke bg-white p-6 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
    //                 <DialogHeader>
    //                   <DialogTitle className="text-2xl font-bold">
    //                     Reactivate Department
    //                   </DialogTitle>
    //                   <DialogDescription asChild className="mt-2">
    //                     <p className="mb-5">
    //                       Are you sure you want to reactivate this department?
    //                     </p>
    //                   </DialogDescription>
    //                 </DialogHeader>
    //                 <DialogFooter>
    //                   <div className="mx-[2em] flex w-full justify-center gap-[6em]">
    //                     <ButtonAction
    //                       entityType={"department"}
    //                       entityId={row.getValue("structure_id")}
    //                       action="reactivate"
    //                       onSuccess={() => {
    //                         fetchFloors();
    //                       }}
    //                     />
    //                     <DialogClose asChild>
    //                       <Button
    //                         variant="ghost"
    //                         className="w-full underline-offset-4 hover:underline"
    //                       >
    //                         Cancel
    //                       </Button>
    //                     </DialogClose>
    //                   </div>
    //                 </DialogFooter>
    //               </DialogContent>
    //             </Dialog>
    //           </>
    //         )}
    //       </div>
    //     );
    //   },
    // },
  ];

  useEffect(() => {
    fetchFloors(buildingName);
    setOpen(true)
    // console.log(floors)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <DataTable
        columns={columns}
        data={floors}
        loadingFloors={loadingFloors}
        error={error}
      />
    </>
  );
};

const DataTable = ({ data, columns, loadingFloors, error }) => {
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
          loadingFloors={loadingFloors}
          error={error}
        />
      </div>
    </>
  );
};

export default SelectFloor;
