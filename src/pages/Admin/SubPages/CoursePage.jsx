import { BreadcrumbResponsive } from "../../../components/reuseable/Breadcrumbs";
import DefaultLayout from "../../layout/DefaultLayout";

/* eslint-disable react/prop-types */
import {
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

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

import { DeleteIcon } from "../../../components/Icons";

import StatusFilter from "../../../components/reuseable/StatusFilter";

import { useSchool } from "../../../components/context/SchoolContext";

import AddCourse from "../../../components/api/AddCourse";

import EditCourse from "../../../components/api/EditCourse";

import ButtonActionCourse from "../../../components/reuseable/ButtonActionCourse";
import DeletedCourse from "../../../components/api/DeletedCourse";
import ReuseTable from "../../../components/reuseable/ReuseTable";

const CoursePage = () => {
  const NavItems = [
    { to: "/", label: "Dashboard" },
    // { to: "/courses/add-course", label: "Add Course" },
    { label: "Course List" },
  ];

  return (
    <DefaultLayout>
      <BreadcrumbResponsive
        pageName={"Course List"}
        items={NavItems}
        ITEMS_TO_DISPLAY={2}
      />

      <CourseTables />
    </DefaultLayout>
  );
};

const CourseTables = () => {
  const { course, fetchCourse, fetchCourseDeleted, loading, error } =
    useSchool();

  const columns = [
    {
      accessorKey: "course_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Numeric ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => {
        // `info.row.index` gives the zero-based index of the row
        return <span className="font-semibold">{info.row.index + 1}</span>; // +1 to start numbering from 1
      },
    },
    {
      accessorKey: "courseCode",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Course Code
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return <span className="text-lg font-semibold">{cell.getValue()}</span>;
      },
    },

    {
      accessorKey: "courseDescription",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Course Description
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return cell.getValue();
      },
    },
    // {
    //   accessorKey: "createdAt",
    //   header: "Date Created",
    //   cell: ({ cell }) => {
    //     return `${cell.getValue().toString().split("T")[0]} at ${new Date(cell.getValue()).toLocaleTimeString()}`;
    //   },
    // },
    // {
    //   accessorKey: "updatedAt",
    //   header: "Date Updated",
    //   cell: ({ cell }) => {
    //     return `${cell.getValue().toString().split("T")[0]} at ${new Date(cell.getValue()).toLocaleTimeString()}`;
    //   },
    // },

    {
      accessorKey: "unit",
      header: "Unit",
      cell: ({ cell }) => {
        return cell.getValue();
      },
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
      accessorFn: (row) => `${row.course_id} ${row.isActive}`,
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <EditCourse courseId={row.getValue("course_id")} />

            <Dialog>
              <DialogTrigger className="p-2 hover:text-primary">
                <DeleteIcon forActions={"Delete Course"} />
              </DialogTrigger>
              <DialogContent className="rounded-sm border border-stroke bg-white p-6 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    Delete
                  </DialogTitle>
                  <DialogDescription asChild className="mt-2">
                    <p className="mb-5">
                      Are you sure you want to delete this Course?
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <div className="mx-[2em] flex w-full justify-center gap-[6em]">
                    <ButtonActionCourse
                      action="delete"
                      courseId={row.getValue("course_id")}
                      onSuccess={() => {
                        fetchCourse();
                        fetchCourseDeleted();
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
        data={course}
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
      <div className="mb-3 mt-2 w-full items-start justify-between md:flex">
        <div className="gap-5 md:flex">
          <Input
            placeholder="Search by Code..."
            value={table.getColumn("courseCode")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("courseCode")?.setFilterValue(event.target.value)
            }
            className="mb-5 h-[3.3em] w-full !rounded !border-[1.5px] !border-stroke bg-white !px-5 !py-3 text-[1rem] font-medium text-black !outline-none !transition focus:!border-primary active:!border-primary disabled:cursor-default disabled:!bg-whiter dark:!border-form-strokedark dark:!bg-form-input dark:!text-white dark:focus:!border-primary md:mb-0 md:w-[12em]"
          />

          <Input
            placeholder="Search by Course Description..."
            value={table.getColumn("courseDescription")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table
                .getColumn("courseDescription")
                ?.setFilterValue(event.target.value)
            }
            className="mb-5 h-[3.3em] w-full !rounded !border-[1.5px] !border-stroke bg-white !px-5 !py-3 text-[1rem] font-medium text-black !outline-none !transition focus:!border-primary active:!border-primary disabled:cursor-default disabled:!bg-whiter dark:!border-form-strokedark dark:!bg-form-input dark:!text-white dark:focus:!border-primary md:mb-0 md:w-[18em]"
          />
        </div>

        <div className=" ">
          <AddCourse />
        </div>
      </div>

      <div className="my-5 rounded-sm border border-stroke bg-white p-4 px-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="mb-5 flex w-full items-center justify-between gap-3">
          <div className="w-[11.5em]">
            <StatusFilter table={table} option={"campus"} />
          </div>

          <DeletedCourse />
        </div>

        <div className="max-w-full overflow-x-auto">
          <ReuseTable
            table={table}
            columns={columns}
            loading={loading}
            error={error}
          />
        </div>

        <div className="flex w-full justify-start py-4 md:items-center md:justify-end">
          <DataTablePagination
            rowsPerPage={10}
            totalName={"Course"}
            table={table}
            totalDepartments={data.length}
          />
        </div>
      </div>
    </>
  );
};

export default CoursePage;
