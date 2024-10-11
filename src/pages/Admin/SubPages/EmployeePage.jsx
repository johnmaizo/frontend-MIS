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

import { useSchool } from "../../../components/context/SchoolContext";
import ReuseTable from "../../../components/reuseable/ReuseTable";

import { BreadcrumbResponsive } from "../../../components/reuseable/Breadcrumbs";
import DefaultLayout from "../../layout/DefaultLayout";
import { useColumns } from "../../../components/reuseable/Columns";
import SearchInput from "../../../components/reuseable/SearchInput";
import ResetFilter from "../../../components/reuseable/ResetFilter";
import { AuthContext } from "../../../components/context/AuthContext";
import AddEmployee from "../../../components/api/AddEmployee";

const EmployeePage = () => {
  const { user } = useContext(AuthContext);

  const NavItems = [
    { to: "/", label: "Dashboard" },
    {
      label:
        user && user.campusName
          ? `Employees (${user.campusName})`
          : "Employees",
    },
  ];

  return (
    <DefaultLayout>
      <BreadcrumbResponsive
        pageName={
          user && user.campusName
            ? `Employees (${user.campusName})`
            : "Employees"
        }
        items={NavItems}
        ITEMS_TO_DISPLAY={2}
      />

      <AccountTables />
    </DefaultLayout>
  );
};

const AccountTables = () => {
  const { employees, fetchEmployees, fetchDepartmentsActive, employeeLoading, error } = useSchool();

  useEffect(() => {
    fetchEmployees();
    fetchDepartmentsActive()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { columnsEmployee } = useColumns();

  return (
    <>
      <DataTable
        columns={columnsEmployee}
        data={employees}
        loading={employeeLoading}
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
        <div className="gap-5 md:flex md:flex-col lg:flex-row md:gap-0 lg:gap-5">
          <div className="gap-5 md:flex ">
            <SearchInput
              placeholder="Search by Role..."
              filterValue={table.getColumn("role")?.getFilterValue()}
              setFilterValue={(value) =>
                table.getColumn("role")?.setFilterValue(value)
              }
              className="md:max-w-[12em]"
            />
            <SearchInput
              placeholder="Search by Name..."
              filterValue={table.getColumn("fullName")?.getFilterValue()}
              setFilterValue={(value) =>
                table.getColumn("fullName")?.setFilterValue(value)
              }
              className="md:w-[17em]"
            />
          </div>

          <div className="mb-5 md:mb-0">
            <ResetFilter table={table} className={"h-[3.3em]"} />
          </div>
        </div>

        <div className=" ">
          <AddEmployee />
        </div>
      </div>

      <div className="my-5 rounded-sm border border-stroke bg-white p-4 px-6 shadow-default dark:border-strokedark dark:bg-boxdark">
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
            totalName={"Employee"}
            rowsPerPage={20}
            table={table}
            totalDepartments={table.getFilteredRowModel().rows.length}
          />
        </div>
      </div>
    </>
  );
};

export default EmployeePage;
