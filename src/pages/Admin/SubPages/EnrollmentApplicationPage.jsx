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

import ReuseTable from "../../../components/reuseable/ReuseTable";
import { AuthContext } from "../../../components/context/AuthContext";
import { useColumns } from "../../../components/reuseable/Columns";
import { useEnrollment } from "../../../components/context/EnrollmentContext";
import SearchInput from "../../../components/reuseable/SearchInput";
import ResetFilter from "../../../components/reuseable/ResetFilter";
import { HasRole } from "../../../components/reuseable/HasRole";
import AddEmployee from "../../../components/api/AddEmployee";
import SyncApplicants from "../../../components/reuseable/SyncApplicants";

const EnrollmentApplicationPage = () => {
  const { user } = useContext(AuthContext);

  const NavItems = [
    { to: "/", label: "Dashboard" },
    {
      label: "Enrollment Application", // New breadcrumb item
    },
  ];

  return (
    <DefaultLayout>
      <BreadcrumbResponsive
        pageName={
          !HasRole(user.role, "SuperAdmin")
            ? `Enrollment Application (${user?.campusName})`
            : "Enrollment Application (All Campuses)"
        }
        items={NavItems}
        ITEMS_TO_DISPLAY={2}
      />

      <EnrollmentTables />
    </DefaultLayout>
  );
};

const EnrollmentTables = () => {
  const { user } = useContext(AuthContext);

  //   const { programActive, fetchProgramActive, loading, error } = useSchool();
  const { error, applicants, fetchApplicants, loadingApplicants } =
    useEnrollment();

  useEffect(() => {
    fetchApplicants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { columnEnrollmentApplication } = useColumns();

  return (
    <>
      <DataTable
        columns={columnEnrollmentApplication}
        data={applicants}
        loading={loadingApplicants}
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
        pageSize: 5,
      },
    },
  });

  return (
    <>
      <>
        <div className="my-5 rounded-sm border border-stroke bg-white p-4 px-6 dark:border-strokedark dark:bg-boxdark">
          <div className="items-center justify-between md:flex">
            <div className="gap-5 md:flex md:flex-col md:gap-0 lg:flex-row lg:gap-5">
              <div className="gap-5 md:flex">
                <SearchInput
                  placeholder="Search by Name..."
                  filterValue={table.getColumn("fullName")?.getFilterValue()}
                  setFilterValue={(value) =>
                    table.getColumn("fullName")?.setFilterValue(value)
                  }
                  className="md:max-w-[12em]"
                />
                <SearchInput
                  placeholder="Search by email..."
                  filterValue={table.getColumn("email")?.getFilterValue()}
                  setFilterValue={(value) =>
                    table.getColumn("email")?.setFilterValue(value)
                  }
                  className="md:w-[17em]"
                />
              </div>
              <div className="mb-5 md:mb-0">
                <ResetFilter table={table} className={"h-[3.3em]"} />
              </div>
            </div>
            <div className="mb-8 md:mb-0">
              <SyncApplicants />
            </div>
          </div>
          <div className="max-w-full overflow-x-auto">
            <ReuseTable
              table={table}
              columns={columns}
              loading={loading}
              error={error}
              forApplicants
            />
          </div>

          <div className="flex w-full justify-start py-4 md:items-center md:justify-end">
            <DataTablePagination
              rowsPerPage={5}
              totalName={"Applicant"}
              table={table}
              totalDepartments={table.getFilteredRowModel().rows.length}
            />
          </div>
        </div>
      </>
    </>
  );
};

export default EnrollmentApplicationPage;
