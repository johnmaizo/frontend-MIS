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

import { useContext, useEffect, useState } from "react";

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

import { useSchool } from "../../../components/context/SchoolContext";

import ReuseTable from "../../../components/reuseable/ReuseTable";
import { AuthContext } from "../../../components/context/AuthContext";
import { useParams } from "react-router-dom";
import EditCourse from "../../../components/api/EditCourse";
import { DeleteIcon } from "../../../components/Icons";
import ButtonAction from "../../../components/reuseable/ButtonAction";
import StatusFilter from "../../../components/reuseable/StatusFilter";
import DeletedCourse from "../../../components/api/DeletedCourse";
import AddCourseProgram from "../../../components/api/AddCourseProgram";

const ViewProgramCoursePage = () => {
  // const { user } = useContext(AuthContext);
  const { campusName, program_id } = useParams();

  const NavItems = [
    { to: "/", label: "Dashboard" },
    {
      to: "/courses/course-list",
      label: "Course List",
    },
    {
      to: "/courses/program-courses",
      label: "Assign Courses to Program",
    },
    {
      label: "Program Courses Offered", // New breadcrumb item
    },
  ];

  return (
    <DefaultLayout>
      <BreadcrumbResponsive
        pageName={"Program Courses Offered"} // Updated page name
        items={NavItems}
        ITEMS_TO_DISPLAY={3}
      />

      <ProgramCourseTables />
    </DefaultLayout>
  );
};

const ProgramCourseTables = () => {
  const { user } = useContext(AuthContext);

  const { campusName, program_id } = useParams();

  const {
    programCourse,
    fetchProgramCourse,
    fetchProgramCourseDeleted,
    loading,
    error,
  } = useSchool();

  useEffect(() => {
    fetchProgramCourse(campusName, program_id);
    fetchProgramCourseDeleted(campusName, program_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      accessorKey: "programCourse_id",
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
        return <span className="font-semibold">{info.row.index + 1}</span>;
      },
    },
    {
      accessorKey: "courseinfo.courseCode",
      id: "courseCode",
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
      accessorKey: "courseinfo.courseDescription",
      id: "courseDescription",
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
    {
      accessorKey: "courseinfo.unit",
      header: "Unit",
      cell: ({ cell }) => {
        return cell.getValue();
      },
    },
    {
      accessorKey: "program.programCode",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Program Code
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return (
          <span className="inline-block w-full text-center text-lg font-semibold">
            {cell.getValue()}
          </span>
        );
      },
    },
    ...(user && user.role === "SuperAdmin"
      ? [
          {
            accessorKey: "program.department.campus.campusName",
            header: ({ column }) => {
              return (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                  className="p-1 hover:underline hover:underline-offset-4"
                >
                  Campus
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              );
            },
          },
        ]
      : []),
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
      accessorFn: (row) => `${row.programCourse_id} ${row.isActive}`,
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <EditCourse courseId={row.getValue("programCourse_id")} />
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
                    {/* <ButtonActionCourse
                      action="delete"
                      courseId={row.getValue("programCourse_id")}
                      onSuccess={() => {
                        fetchProgramCourse(campusName, program_id);
                        fetchProgramCourseDeleted(campusName, program_id);
                      }}
                    /> */}
                    <ButtonAction
                      entityType={"course"}
                      entityId={row.getValue("programCourse_id")}
                      action="delete"
                      onSuccess={() => {
                        fetchProgramCourse(campusName, program_id);
                        fetchProgramCourseDeleted(campusName, program_id);
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
        data={programCourse}
        loading={loading}
        error={error}
      />
    </>
  );
};

const DataTable = ({ data, columns, loading, error }) => {
  const { user } = useContext(AuthContext);

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
          <AddCourseProgram />
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

export default ViewProgramCoursePage;
