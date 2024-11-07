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

import { useSchool } from "../../../components/context/SchoolContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

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
  const { semesters, fetchSemesters } = useSchool();

  const [selectedSemesterId, setSelectedSemesterId] = useState(null);

  useEffect(() => {
    fetchSemesters();
  }, []);

  // Set default selected semester based on the active semester
  useEffect(() => {
    if (semesters.length > 0) {
      const activeSemester = semesters.find((sem) => sem.isActive);
      if (activeSemester) {
        setSelectedSemesterId(activeSemester.semester_id.toString());
      } else {
        // If no active semester, you can set default values or leave it null
        setSelectedSemesterId(semesters[0].semester_id.toString());
      }
    }
  }, [semesters]);

  useEffect(() => {
    fetchEnrollmentStatus(view, selectedSemesterId);
  }, [view, selectedSemesterId]);

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
        semesters={semesters}
        selectedSemesterId={selectedSemesterId}
        setSelectedSemesterId={setSelectedSemesterId}
      />
    </>
  );
};

const DataTable = ({
  data,
  columns,
  loading,
  error,
  semesters,
  selectedSemesterId,
  setSelectedSemesterId,
}) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  // Get unique school years from semesters
  const schoolYears = Array.from(
    new Set(semesters.map((sem) => sem.schoolYear)),
  ).sort();

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
        <div className="mb-5 mt-2 justify-between gap-5 md:flex">
          <div className="gap-5 md:flex md:items-center">
            <SearchInput
              placeholder="Search by Name..."
              filterValue={table.getColumn("fullName")?.getFilterValue()}
              setFilterValue={(value) =>
                table.getColumn("fullName")?.setFilterValue(value)
              }
              className="md:max-w-[12em]"
            />
            {/* Combined Semester Selector */}
            <Select
              value={selectedSemesterId || "all-semesters"}
              onValueChange={(value) =>
                setSelectedSemesterId(value === "all-semesters" ? null : value)
              }
            >
              <SelectTrigger className="mb-5 h-[3.3em] w-[18em] md:mb-0">
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#1A222C]">
                <SelectItem value="all-semesters">All Semesters</SelectItem>
                {semesters.map((sem) => (
                  <SelectItem
                    key={sem.semester_id}
                    value={sem.semester_id.toString()}
                  >
                    {`${sem.schoolYear} - ${sem.semesterName}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ResetFilter table={table} className={"mb-5 h-[3.3em] md:mb-0"} />
          </div>
          {/* No AddClass component needed here */}
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
            totalName={"Record"}
            table={table}
            totalDepartments={table.getFilteredRowModel().rows.length}
          />
        </div>
      </div>
    </>
  );
};

export default PaymentApprovalPage;
