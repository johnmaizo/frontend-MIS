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

import { useContext, useEffect, useState, useRef } from "react";

import { DataTablePagination } from "../../../components/reuseable/DataTablePagination";

import ReuseTable from "../../../components/reuseable/ReuseTable";
import { AuthContext } from "../../../components/context/AuthContext";
import { useColumns } from "../../../components/reuseable/Columns";
import { useEnrollment } from "../../../components/context/EnrollmentContext";
import { useSchool } from "../../../components/context/SchoolContext";
import SearchInput from "../../../components/reuseable/SearchInput";
import ResetFilter from "../../../components/reuseable/ResetFilter";
import { HasRole } from "../../../components/reuseable/HasRole";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";

const StudentsPage = () => {
  const { user } = useContext(AuthContext);

  const NavItems = [
    { to: "/", label: "Dashboard" },
    {
      label: "Students",
    },
  ];

  return (
    <DefaultLayout>
      <BreadcrumbResponsive
        pageName={
          !HasRole(user.role, "SuperAdmin")
            ? `Students (${user?.campusName})`
            : "Students (All Campuses)"
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

  const [selectedSemesterId, setSelectedSemesterId] = useState(null);

  const {
    error,
    officalEnrolled,
    fetchOfficialEnrolled,
    loadingOfficalEnrolled,
  } = useEnrollment();

  const { semesters } = useSchool();

  // Create a ref to store the AbortController
  const abortControllerRef = useRef();

  useEffect(() => {
    // Set default selected semester based on the active semester
    if (semesters.length > 0) {
      const activeSemester = semesters.find((sem) => sem.isActive);
      if (activeSemester) {
        setSelectedSemesterId(activeSemester.semester_id.toString());
      } else {
        // If no active semester, set to the first semester in the list
        setSelectedSemesterId(semesters[0].semester_id.toString());
      }
    }
  }, []);

  useEffect(() => {
    // Abort previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    // Create a new AbortController
    const controller = new AbortController();
    abortControllerRef.current = controller;

    fetchOfficialEnrolled(selectedSemesterId, controller.signal);

    // Cleanup function to abort the request if component unmounts or dependencies change
    return () => {
      controller.abort();
    };
  }, [selectedSemesterId]);

  const { columnOfficiallyEnrolled } = useColumns();

  return (
    <>
      <DataTable
        columns={columnOfficiallyEnrolled}
        data={officalEnrolled}
        loading={loadingOfficalEnrolled}
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
        pageSize: 50,
      },
    },
  });

  // Combine School Year and Semester Name for selector
  const combinedSemesters = semesters.map((sem) => ({
    id: sem.semester_id.toString(),
    label: `${sem.schoolYear} - ${sem.semesterName}`,
  }));

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
                className="md:w-[17em]"
              />

              <SearchInput
                placeholder="Search by Email..."
                filterValue={table.getColumn("email")?.getFilterValue()}
                setFilterValue={(value) =>
                  table.getColumn("email")?.setFilterValue(value)
                }
                className="md:w-[17em]"
              />

              {/* Semester Selector */}
              <Select
                value={selectedSemesterId || "all-semesters"}
                onValueChange={(value) =>
                  setSelectedSemesterId(
                    value === "all-semesters" ? null : value,
                  )
                }
              >
                <SelectTrigger className="mb-5 h-[3.3em] w-[18em] md:mb-0">
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent className="dark:bg-[#1A222C]">
                  <SelectItem value="all-semesters">All Semesters</SelectItem>
                  {combinedSemesters.map((sem) => (
                    <SelectItem key={sem.id} value={sem.id}>
                      {sem.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            rowsPerPage={50}
            totalName={"Student"}
            table={table}
            totalDepartments={table.getFilteredRowModel().rows.length}
          />
        </div>
      </div>
    </>
  );
};

export default StudentsPage;
