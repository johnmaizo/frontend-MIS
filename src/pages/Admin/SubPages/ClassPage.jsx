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

import { useSchool } from "../../../components/context/SchoolContext";

import ReuseTable from "../../../components/reuseable/ReuseTable";
import { AuthContext } from "../../../components/context/AuthContext";
import { useColumns } from "../../../components/reuseable/Columns";
import AddClass from "../../../components/api/AddClass";
import ResetFilter from "../../../components/reuseable/ResetFilter";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

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

  const {
    classes,
    fetchClass,
    loadingClass,
    error,
    semesters,
    fetchSemesters,
    fetchRoomsActive,
  } = useSchool();

  const [selectedSemesterId, setSelectedSemesterId] = useState(null);

  useEffect(() => {
    fetchSemesters();
    fetchRoomsActive();
  }, []);

  // Set default selected semester based on the active semester
  useEffect(() => {
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
    if (selectedSemesterId) {
      fetchClass(null, selectedSemesterId); // Passing null for schoolYear as it's combined
    }
  }, [selectedSemesterId]);

  const { columnClass } = useColumns();

  return (
    <>
      <DataTable
        columns={columnClass}
        data={classes}
        loadingClass={loadingClass}
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
  loadingClass,
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
        pageSize: 20,
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
        <div className="mb-5 mt-2 justify-between gap-5 md:flex">
          <div className="gap-5 md:flex md:items-center">
            <Input
              placeholder="Search by Description..."
              value={table.getColumn("subject")?.getFilterValue() ?? ""}
              onChange={(event) =>
                table.getColumn("subject")?.setFilterValue(event.target.value)
              }
              className="mb-5 h-[3.3em] w-full !rounded !border-[1.5px] !border-stroke bg-white !px-5 !py-3 text-[1rem] font-medium text-black !outline-none focus:!border-primary active:!border-primary disabled:cursor-default disabled:!bg-whiter dark:!border-form-strokedark dark:!bg-form-input dark:!text-white dark:focus:!border-primary md:mb-0 md:w-[14em]"
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
                {combinedSemesters.map((sem) => (
                  <SelectItem key={sem.id} value={sem.id}>
                    {sem.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ResetFilter table={table} className={"mb-5 h-[3.3em] md:mb-0"} />
          </div>
          {/* <div>
            <AddClass selectedSemesterId={selectedSemesterId} />
          </div> */}
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
