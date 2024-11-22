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

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../components/ui/tabs";

import { useContext, useEffect, useState } from "react";

import { DataTablePagination } from "../../../components/reuseable/DataTablePagination";

import ReuseTable from "../../../components/reuseable/ReuseTable";
import { AuthContext } from "../../../components/context/AuthContext";
import { useEnrollment } from "../../../components/context/EnrollmentContext";
import SearchInput from "../../../components/reuseable/SearchInput";
import ResetFilter from "../../../components/reuseable/ResetFilter";
import { HasRole } from "../../../components/reuseable/HasRole";
import { useColumnsSecond } from "../../../components/reuseable/ColumnsSecond";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";
import { useSchool } from "../../../components/context/SchoolContext";

const UnenrolledRegistrationPage = () => {
  const { user } = useContext(AuthContext);

  const NavItems = [
    { to: "/", label: "Dashboard" },
    {
      label: "Unenrolled Registrations",
    },
  ];

  return (
    <DefaultLayout>
      <BreadcrumbResponsive
        pageName={
          !HasRole(user.role, "SuperAdmin")
            ? `Unenrolled Registrations (${user?.campusName})`
            : "Unenrolled Registrations (All Campuses)"
        }
        items={NavItems}
        ITEMS_TO_DISPLAY={2}
      />

      <Tabs defaultValue="existing-students" className="w-full">
        <TabsList>
          <TabsTrigger value="existing-students">Existing Students</TabsTrigger>
          <TabsTrigger value="new-students">
            New Unenrolled Students
          </TabsTrigger>
        </TabsList>
        <TabsContent value="existing-students">
          <UnenrolledStudentsTable view="existing-students" />
        </TabsContent>
        <TabsContent value="new-students">
          <UnenrolledStudentsTable view="new-students" />
        </TabsContent>
      </Tabs>
    </DefaultLayout>
  );
};

const UnenrolledStudentsTable = ({ view }) => {
  const [selectedSemesterId, setSelectedSemesterId] = useState(null);

  const {
    pendingStudents,
    fetchPendingStudents,
    loadingPendingStudents,
    error,
  } = useEnrollment();

  const { fetchSemesters, semesters } = useSchool();

  useEffect(() => {
    fetchSemesters();
  }, []);

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
  }, [semesters]);

  useEffect(() => {
    fetchPendingStudents(view, selectedSemesterId);
  }, [view, selectedSemesterId]);

  const { columnExistingStudents, columnNewUnenrolledStudents } =
    useColumnsSecond();

  const columns =
    view === "existing-students"
      ? columnExistingStudents
      : columnNewUnenrolledStudents;

  return (
    <DataTable
      columns={columns}
      data={pendingStudents}
      loading={loadingPendingStudents}
      error={error}
      semesters={semesters}
      selectedSemesterId={selectedSemesterId}
      setSelectedSemesterId={setSelectedSemesterId}
    />
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
                className="transition-none md:max-w-[12em]"
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

export default UnenrolledRegistrationPage;
