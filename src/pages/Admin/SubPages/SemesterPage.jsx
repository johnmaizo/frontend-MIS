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

import { DataTablePagination } from "../../../components/reuseable/DataTablePagination";

import StatusFilter from "../../../components/reuseable/StatusFilter";

import { useSchool } from "../../../components/context/SchoolContext";

import AddSemester from "../../../components/api/AddSemester";

import DeletedSemesters from "../../../components/api/DeletedSemesters";
import { Input } from "../../../components/ui/input";
import ReuseTable from "../../../components/reuseable/ReuseTable";
import { AuthContext } from "../../../components/context/AuthContext";
import { useColumns } from "../../../components/reuseable/Columns";
import ResetFilter from "../../../components/reuseable/ResetFilter";

const SemesterPage = () => {
  const { user } = useContext(AuthContext);

  const NavItems = [
    { to: "/", label: "Dashboard" },
    // { to: "/semester/add-semester", label: "Add Semester" },
    {
      label:
        user && user.campusName
          ? `Semesters (${user.campusName})`
          : "Semesters",
    },
  ];

  return (
    <DefaultLayout>
      <BreadcrumbResponsive
        pageName={
          user && user.campusName
            ? `Semesters (${user.campusName})`
            : "Semesters"
        }
        items={NavItems}
        ITEMS_TO_DISPLAY={2}
      />

      <SemesterTables />
    </DefaultLayout>
  );
};

const SemesterTables = () => {
  const { semesters, fetchSemesters, fetchSemestersDeleted, loading, error } =
    useSchool();

  useEffect(() => {
    fetchSemesters();
    fetchSemestersDeleted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { columnSemester } = useColumns();

  return (
    <>
      <DataTable
        columns={columnSemester}
        data={semesters}
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
          {/* <Input
            placeholder="Search by Shool Year..."
            value={table.getColumn("schoolYear")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("schoolYear")?.setFilterValue(event.target.value)
            }
            className="mb-5 h-[3.3em] w-full !rounded !border-[1.5px] !border-stroke bg-white !px-5 !py-3 text-[1rem] font-medium text-black !outline-none !transition focus:!border-primary active:!border-primary disabled:cursor-default disabled:!bg-whiter dark:!border-form-strokedark dark:!bg-form-input dark:!text-white dark:focus:!border-primary md:mb-0 md:w-[17em]"
          /> */}

          <ResetFilter table={table} className={"h-[3.3em]"} />
        </div>

        <div className="">
          <AddSemester />
        </div>
      </div>

      <div className="my-5 rounded-sm border border-stroke bg-white p-4 px-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="mb-5 flex w-full items-center justify-between gap-3">
          <div className="w-[11.5em]">
            <StatusFilter table={table} option={"semester"} />
          </div>

          {/* <DeletedSemesters /> */}
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
            totalName={"Semester"}
            table={table}
            totalDepartments={table.getFilteredRowModel().rows.length}
          />
        </div>
      </div>
    </>
  );
};

export default SemesterPage;
