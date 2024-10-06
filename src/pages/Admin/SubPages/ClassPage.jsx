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
import { useColumns } from "../../../components/reuseable/Columns";
import AddBuilding from "../../../components/api/AddBuilding";
import AddClass from "../../../components/api/AddClass";
import ResetFilter from "../../../components/reuseable/ResetFilter";

const ClassPage = () => {
  const { user } = useContext(AuthContext);

  const NavItems = [
    { to: "/", label: "Dashboard" },
    {
      label:
        user && user.campusName
          ? `Class List (${user.campusName})`
          : "Class List",
    },
  ];

  return (
    <DefaultLayout>
      <BreadcrumbResponsive
        pageName={
          user && user.campusName
            ? `Class List (${user.campusName})`
            : "Class List"
        }
        items={NavItems}
        ITEMS_TO_DISPLAY={2}
      />

      <ClassTable />
    </DefaultLayout>
  );
};

const ClassTable = () => {
  const { user } = useContext(AuthContext);

  const { classes, fetchClass, loadingClass, error } = useSchool();

  useEffect(() => {
    fetchClass();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { columnClass } = useColumns();

  return (
    <>
      <DataTable
        columns={columnClass}
        data={classes}
        loadingClass={loadingClass}
        error={error}
      />
    </>
  );
};

const DataTable = ({ data, columns, loadingClass, error }) => {
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
        pageSize: 20,
      },
    },
  });

  return (
    <>
      <div className="mb-5 flex w-full items-center justify-between gap-3"></div>
      <div className="my-5 rounded-sm border border-stroke bg-white p-4 px-6 dark:border-strokedark dark:bg-boxdark">
        <div className="mb-5 mt-2 justify-between gap-5 md:flex">
          <div className="gap-5 md:flex">
            <Input
              placeholder="Search by Class Name..."
              value={table.getColumn("className")?.getFilterValue() ?? ""}
              onChange={(event) =>
                table.getColumn("className")?.setFilterValue(event.target.value)
              }
              className="mb-5 h-[3.3em] w-full !rounded !border-[1.5px] !border-stroke bg-white !px-5 !py-3 text-[1rem] font-medium text-black !outline-none focus:!border-primary active:!border-primary disabled:cursor-default disabled:!bg-whiter dark:!border-form-strokedark dark:!bg-form-input dark:!text-white dark:focus:!border-primary md:mb-0 md:w-[14em]"
            />
            {/* <Input
              placeholder="Search by Campus..."
              value={table.getColumn("campusName")?.getFilterValue() ?? ""}
              onChange={(event) =>
                table
                  .getColumn("campusName")
                  ?.setFilterValue(event.target.value)
              }
              className="mb-5 h-[3.3em] w-full !rounded !border-[1.5px] !border-stroke bg-white !px-5 !py-3 text-[1rem] font-medium text-black !outline-none focus:!border-primary active:!border-primary disabled:cursor-default disabled:!bg-whiter dark:!border-form-strokedark dark:!bg-form-input dark:!text-white dark:focus:!border-primary md:mb-0 md:w-[18em]"
            /> */}

            <ResetFilter table={table} className={"h-[3.3em]"} />
          </div>
          <div>
            <AddClass />
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          <ReuseTable
            table={table}
            columns={columns}
            loading={loadingClass}
            error={error}
          />
        </div>

        <div className="flex w-full justify-start py-4 md:items-center md:justify-end">
          <DataTablePagination
            rowsPerPage={20}
            totalName={"Class"}
            table={table}
            totalDepartments={table.getFilteredRowModel().rows.length}
          />
        </div>
      </div>
    </>
  );
};

export default ClassPage;
