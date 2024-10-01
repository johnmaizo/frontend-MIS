/* eslint-disable react-hooks/exhaustive-deps */
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

import StatusFilter from "../../../components/reuseable/StatusFilter";

import { useSchool } from "../../../components/context/SchoolContext";

import AddProgram from "../../../components/api/AddProgram";

import ReuseTable from "../../../components/reuseable/ReuseTable";
import DeletedProgram from "../../../components/api/DeletedProgram";
import { DataTableFacetedFilter } from "../../../components/reuseable/DataTableFacetedFilter";
import { getUniqueCodes } from "../../../components/reuseable/GetUniqueValues";
import { AuthContext } from "../../../components/context/AuthContext";
import { useColumns } from "../../../components/reuseable/Columns";
import SearchInput from "../../../components/reuseable/SearchInput";
import ResetFilter from "../../../components/reuseable/ResetFilter";

const ProgramPage = () => {
  const { user } = useContext(AuthContext);

  const NavItems = [
    { to: "/", label: "Dashboard" },
    // { to: "/program/add-program", label: "Add Program" },
    {
      label:
        user && user.campusName ? `Programs (${user.campusName})` : "Programs",
    },
  ];

  return (
    <DefaultLayout>
      <BreadcrumbResponsive
        pageName={
          user && user.campusName ? `Programs (${user.campusName})` : "Programs"
        }
        items={NavItems}
        ITEMS_TO_DISPLAY={2}
      />

      <ProgramTables />
    </DefaultLayout>
  );
};

const ProgramTables = () => {
  const {
    program,
    fetchProgram,
    fetchProgramDeleted,
    fetchProgramActive,
    loading,
    error,
  } = useSchool();

  useEffect(() => {
    fetchProgram();
    fetchProgramDeleted();
    fetchProgramActive();
  }, []);

  const { columnProgram } = useColumns();

  return (
    <>
      <DataTable
        columns={columnProgram}
        data={program}
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
        pageSize: 20,
      },
    },
  });

  return (
    <>
      <div className="mb-3 mt-2 w-full items-start justify-between md:flex">
        <div className="gap-5 md:flex">
          <SearchInput
            placeholder="Search by Code..."
            filterValue={table.getColumn("programCode")?.getFilterValue()}
            setFilterValue={(value) =>
              table.getColumn("programCode")?.setFilterValue(value)
            }
            className="md:mb-0 md:w-[10.5em]"
          />

          <SearchInput
            placeholder="Search by Program description..."
            filterValue={table
              .getColumn("programDescription")
              ?.getFilterValue()}
            setFilterValue={(value) =>
              table.getColumn("programDescription")?.setFilterValue(value)
            }
            className="md:mb-0 md:w-[18em]"
          />

          <ResetFilter table={table} className={"h-[3.3em]"} />
        </div>

        <div className=" ">
          <AddProgram />
        </div>
      </div>

      <div className="my-5 rounded-sm border border-stroke bg-white p-4 px-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="mb-5 flex w-full items-center justify-between gap-3">
          <div className="w-[11.5em]">
            <StatusFilter table={table} option={"department"} />

            {/* <div className="mt-5">
              <DataTableFacetedFilter
                column={table.getColumn("programCode")}
                title="Program Codes"
                options={getUniqueCodes(data, "programCode")}
              />
            </div> */}
          </div>

          <DeletedProgram />
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
            totalName={"Program"}
            rowsPerPage={20}
            table={table}
            totalDepartments={table.getFilteredRowModel().rows.length}
          />
        </div>
      </div>
    </>
  );
};

export default ProgramPage;
