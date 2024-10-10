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
import { Link } from "react-router-dom";
import SmallLoader from "../../../components/styles/SmallLoader";
import { useColumns } from "../../../components/reuseable/Columns";
import ResetFilter from "../../../components/reuseable/ResetFilter";

const ProspectusPage = () => {
  const { user } = useContext(AuthContext);

  const NavItems = [
    { to: "/", label: "Dashboard" },
    {
      to: "/subjects/subject-list",
      label: "Subject List",
    },
    {
      label: "Assign Prospectus to Program",
    },
  ];

  return (
    <DefaultLayout>
      <BreadcrumbResponsive
        pageName={`Select Program to Assign Prospectus (${user?.campusName})`}
        items={NavItems}
        ITEMS_TO_DISPLAY={3}
      />

      <CourseTables />
    </DefaultLayout>
  );
};

const CourseTables = () => {
  const { user } = useContext(AuthContext);

  const { programActive, fetchProgramActive, loading, error } = useSchool();

  useEffect(() => {
    fetchProgramActive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { columnProspectus } = useColumns();

  return (
    <>
      <DataTable
        columns={columnProspectus}
        data={programActive}
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
        pageSize: 20,
      },
    },
  });

  return (
    <>
      <div className="mb-5 flex w-full items-center justify-between gap-3"></div>
      {loading ? (
        <div className="my-5 rounded-sm border border-stroke bg-white p-4 px-6 dark:border-strokedark dark:bg-boxdark">
          <div className="grid h-[20em] w-full place-content-center">
            <p className="inline-flex items-center gap-4 text-[2rem]">
              <SmallLoader width={8} height={8} />
              Loading...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="my-5 rounded-sm border border-stroke bg-white p-4 px-6 dark:border-strokedark dark:bg-boxdark">
          <div className="grid h-[20em] w-full place-content-center">
            <p className="text-[2rem] font-semibold text-red-700">
              Error: {error}
            </p>
          </div>
        </div>
      ) : !loading && data && data.length > 0 ? (
        <>
          <div className="my-5 rounded-sm border border-stroke bg-white p-4 px-6 dark:border-strokedark dark:bg-boxdark">
            <div className="mb-5 mt-2 gap-5 md:flex">
              <Input
                placeholder="Search by Code..."
                value={table.getColumn("programCode")?.getFilterValue() ?? ""}
                onChange={(event) =>
                  table
                    .getColumn("programCode")
                    ?.setFilterValue(event.target.value)
                }
                className="mb-5 h-[3.3em] w-full !rounded !border-[1.5px] !border-stroke bg-white !px-5 !py-3 text-[1rem] font-medium text-black !outline-none !transition focus:!border-primary active:!border-primary disabled:cursor-default disabled:!bg-whiter dark:!border-form-strokedark dark:!bg-form-input dark:!text-white dark:focus:!border-primary md:mb-0 md:w-[12em]"
              />

              <Input
                placeholder="Search by Program Description..."
                value={
                  table.getColumn("programDescription")?.getFilterValue() ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn("programDescription")
                    ?.setFilterValue(event.target.value)
                }
                className="mb-5 h-[3.3em] w-full !rounded !border-[1.5px] !border-stroke bg-white !px-5 !py-3 text-[1rem] font-medium text-black !outline-none !transition focus:!border-primary active:!border-primary disabled:cursor-default disabled:!bg-whiter dark:!border-form-strokedark dark:!bg-form-input dark:!text-white dark:focus:!border-primary md:mb-0 md:w-[18em]"
              />

              <div className="flex items-center">
                <ResetFilter table={table} />
              </div>
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
                rowsPerPage={20}
                totalName={"Program"}
                table={table}
                totalDepartments={table.getFilteredRowModel().rows.length}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="my-5 rounded-sm border border-stroke bg-white p-4 px-6 dark:border-strokedark dark:bg-boxdark">
          <div className="grid h-[20em] w-full place-content-center">
            <p className="text-[2rem]">
              No program found.{" "}
              <Link to={"/programs"} className="text-primary hover:underline">
                Click here to add program
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ProspectusPage;
