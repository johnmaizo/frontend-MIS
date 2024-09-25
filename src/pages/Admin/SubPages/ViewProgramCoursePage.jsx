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

import { Input } from "../../../components/ui/input";

import { DataTablePagination } from "../../../components/reuseable/DataTablePagination";

import { useSchool } from "../../../components/context/SchoolContext";

import ReuseTable from "../../../components/reuseable/ReuseTable";
import { AuthContext } from "../../../components/context/AuthContext";
import { useParams } from "react-router-dom";
import StatusFilter from "../../../components/reuseable/StatusFilter";
import DeletedCourse from "../../../components/api/DeletedCourse";
import AddCourseProgram from "../../../components/api/AddCourseProgram";
import { useColumns } from "../../../components/reuseable/Columns";

const ViewProgramCoursePage = () => {
  // const { user } = useContext(AuthContext);

  const NavItems = [
    { to: "/", label: "Dashboard" },
    {
      to: "/subjects/subject-list",
      label: "Subject List",
    },
    {
      to: "/subjects/program-subjects",
      label: "Assign Subjects to Program",
    },
    {
      label: "Program Subjects Offered", // New breadcrumb item
    },
  ];

  return (
    <DefaultLayout>
      <BreadcrumbResponsive
        pageName={"Program Subjects Offered"} // Updated page name
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

  const { columnViewProgramCourse } = useColumns();

  return (
    <>
      <DataTable
        columns={columnViewProgramCourse}
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
            placeholder="Search by Subject Description..."
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
            totalName={"Subject"}
            table={table}
            totalDepartments={table.getFilteredRowModel().rows.length}
          />
        </div>
      </div>
    </>
  );
};

export default ViewProgramCoursePage;
