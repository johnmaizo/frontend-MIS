import { BreadcrumbResponsive } from "../../../components/reuseable/Breadcrumbs";
import DefaultLayout from "../../layout/DefaultLayout";

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
} from "../../../components/ui/table";

import { useState } from "react";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";

import { DataTablePagination } from "../../../components/reuseable/DataTablePagination";

import { ArrowUpDown } from "lucide-react";

import SmallLoader from "../../../components/styles/SmallLoader";

import { DeleteIcon } from "../../../components/Icons";

import StatusFilter from "../../../components/reuseable/StatusFilter";

import { useStudents } from "../../../components/context/StudentContext";

import AddCampus from "../../../components/api/AddCampus";

import EditCampus from "../../../components/api/EditCampus";

import ButtonActionCampus from "../../../components/reuseable/ButtonActionCampus";
import DeletedCampus from "../../../components/api/DeletedCampus";

const CampusPage = () => {
  const NavItems = [
    { to: "/", label: "Dashboard" },
    // { to: "/campus/add-campus", label: "Add Campus" },
    { label: "Campus" },
  ];

  return (
    <DefaultLayout>
      <BreadcrumbResponsive
        pageName={"Campus"}
        items={NavItems}
        ITEMS_TO_DISPLAY={2}
      />

      <CampusTables />
    </DefaultLayout>
  );
};

const CampusTables = () => {
  const { campus, fetchCampus, fetchCampusDeleted, loading, error } =
    useStudents();

  const columns = [
    {
      accessorKey: "campus_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return <span className="font-semibold">{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "campusName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Campus Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return <span className="text-lg font-semibold">{cell.getValue()}</span>;
      },
    },

    {
      accessorKey: "campusAddress",
      header: "Campus Address",
      cell: ({ cell }) => {
        return cell.getValue();
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
      accessorFn: (row) => `${row.campus_id} ${row.isActive}`,
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <EditCampus campusId={row.getValue("campus_id")} />

            <Dialog>
              <DialogTrigger className="p-2 hover:text-primary">
                <DeleteIcon forActions={"Delete Campus"} />
              </DialogTrigger>
              <DialogContent className="rounded-sm border border-stroke bg-white p-6 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    Delete
                  </DialogTitle>
                  <DialogDescription asChild className="mt-2">
                    <p className="mb-5">
                      Are you sure you want to delete this campus?
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <div className="mx-[2em] flex w-full justify-center gap-[6em]">
                    <ButtonActionCampus
                      action="delete"
                      campusId={row.getValue("campus_id")}
                      onSuccess={() => {
                        fetchCampus();
                        fetchCampusDeleted();
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
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={campus}
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
      <div className="mb-3 mt-2 flex w-full items-start justify-between">
        <div className="flex gap-5">
          <Input
            placeholder="Search by campus name..."
            value={table.getColumn("campusName")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("campusName")?.setFilterValue(event.target.value)
            }
            className="h-[3.3em] w-full !rounded !border-[1.5px] !border-stroke bg-white !px-5 !py-3 text-[1rem] font-medium text-black !outline-none !transition focus:!border-primary active:!border-primary disabled:cursor-default disabled:!bg-whiter dark:!border-form-strokedark dark:!bg-form-input dark:!text-white dark:focus:!border-primary md:w-[17em]"
          />

          <Input
            placeholder="Search by address..."
            value={table.getColumn("campusAddress")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table
                .getColumn("campusAddress")
                ?.setFilterValue(event.target.value)
            }
            className="h-[3.3em] w-full !rounded !border-[1.5px] !border-stroke bg-white !px-5 !py-3 text-[1rem] font-medium text-black !outline-none !transition focus:!border-primary active:!border-primary disabled:cursor-default disabled:!bg-whiter dark:!border-form-strokedark dark:!bg-form-input dark:!text-white dark:focus:!border-primary md:max-w-[15em]"
          />
        </div>

        <div className=" ">
          <AddCampus />
        </div>
      </div>

      <div className="mb-4 rounded-sm border border-stroke bg-white p-4 px-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="mb-5 flex w-full justify-between items-center gap-3">
          <div className="w-[11em]">
            <StatusFilter table={table} option={"campus"} />
          </div>

          <DeletedCampus />
        </div>

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
          <DataTablePagination table={table} totalDepartments={data.length} />
        </div>
      </div>
    </>
  );
};

export default CampusPage;
