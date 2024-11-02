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

import { DataTablePagination } from "../../../components/reuseable/DataTablePagination";

import ReuseTable from "../../../components/reuseable/ReuseTable";
import { AuthContext } from "../../../components/context/AuthContext";
import { useEnrollment } from "../../../components/context/EnrollmentContext";
import SearchInput from "../../../components/reuseable/SearchInput";
import ResetFilter from "../../../components/reuseable/ResetFilter";
import { HasRole } from "../../../components/reuseable/HasRole";
import { useColumnsSecond } from "../../../components/reuseable/ColumnsSecond";

// Import Tabs components
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../components/ui/tabs";

const PaymentApprovalPage = () => {
  const { user } = useContext(AuthContext);

  const NavItems = [
    { to: "/", label: "Dashboard" },
    {
      label: "Payment Approvals",
    },
  ];

  return (
    <DefaultLayout>
      <BreadcrumbResponsive
        pageName={
          !HasRole(user.role, "SuperAdmin")
            ? `Payment Approvals (${user?.campusName})`
            : "Payment Approvals (All Campuses)"
        }
        items={NavItems}
        ITEMS_TO_DISPLAY={2}
      />

      <Tabs defaultValue="approvals" className="w-full">
        <TabsList>
          <TabsTrigger value="approvals">Payment Approvals</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>
        <TabsContent value="approvals">
          <EnrollmentTables view="approvals" />
        </TabsContent>
        <TabsContent value="history">
          <EnrollmentTables view="history" />
        </TabsContent>
      </Tabs>
    </DefaultLayout>
  );
};

const EnrollmentTables = ({ view }) => {
  const { user } = useContext(AuthContext);

  const {
    error,
    enrollmentStatuses,
    fetchEnrollmentStatus,
    loadingEnrollmentStatus,
  } = useEnrollment();

  useEffect(() => {
    fetchEnrollmentStatus(view);
  }, [view]);

  const { columnPaymentEnrollmentStatus, columnPaymentHistory } =
    useColumnsSecond();

  const columns =
    view === "approvals" ? columnPaymentEnrollmentStatus : columnPaymentHistory;

  return (
    <>
      <DataTable
        columns={columns}
        data={enrollmentStatuses}
        loading={loadingEnrollmentStatus}
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
        pageSize: 5,
      },
    },
  });

  return (
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
            </div>
            <div className="mb-5 md:mb-0">
              <ResetFilter table={table} className={"h-[3.3em]"} />
            </div>
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
            rowsPerPage={5}
            totalName={"Records"}
            table={table}
            totalDepartments={table.getFilteredRowModel().rows.length}
          />
        </div>
      </div>
    </>
  );
};

export default PaymentApprovalPage;
