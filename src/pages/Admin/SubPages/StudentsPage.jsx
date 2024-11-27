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

import { jsPDF } from "jspdf";
import { Button } from "../../../components/ui/button";
import { PrinterIcon } from "lucide-react";

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

  const { fetchSemesters, semesters } = useSchool();

  // Create a ref to store the AbortController
  const abortControllerRef = useRef();

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
    // Create a new AbortController
    const controller = new AbortController();

    fetchOfficialEnrolled(selectedSemesterId, controller.signal);

    // Cleanup function to abort the request if component unmounts or dependencies change
    return () => {
      controller.abort();
    };
  }, [selectedSemesterId]);

  const { columnOfficiallyEnrolled } = useColumns(officalEnrolled);

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
    schoolYear: sem.schoolYear,
    semesterName: sem.semesterName,
  }));

  // Get the selected semester details
  const selectedSemester = combinedSemesters.find(
    (sem) => sem.id === selectedSemesterId,
  );

  // Function to handle printing the PDF
  const handlePrint = () => {
    // Get the filtered data
    const filteredRows = table.getFilteredRowModel().rows;

    if (filteredRows.length === 0) {
      alert("No data available to print.");
      return;
    }

    const doc = new jsPDF();

    // Define some constants for positioning
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    let currentY = 20;

    // Centered text
    doc.setFontSize(16);
    doc.text("BENEDICTO COLLEGE", pageWidth / 2, currentY, {
      align: "center",
    });
    currentY += 8;
    doc.setFontSize(12);

    currentY += 12;
    doc.setFontSize(16);
    doc.text("STUDENTS", pageWidth / 2, currentY, {
      align: "center",
    });
    currentY += 8;
    doc.text(
      selectedSemester
        ? `${selectedSemester.schoolYear} - ${selectedSemester.semesterName}`
        : "All Semesters",
      pageWidth / 2,
      currentY,
      { align: "center" },
    );
    currentY += 12;

    // Left Side Information
    doc.setFontSize(12);
    let leftY = currentY;
    doc.text(`Campus: ${user.campusName || "All Campuses"}`, margin, leftY);
    leftY += 8;

    currentY = leftY + 12; // Move currentY below the left section

    // Table Headers
    const tableColumnWidths = [10, 30, 50, 20, 30, 30, 30];
    const tableHeaders = [
      "No.",
      "Student ID",
      "Name",
      "Gender",
      "Program",
      "Year Level",
      "Date Enrolled",
    ];

    // Draw table header with borders
    let startX = margin;
    let startY = currentY;

    doc.setFontSize(10);
    doc.setFont("bold");

    // Draw header text and borders
    tableHeaders.forEach((header, index) => {
      const cellWidth = tableColumnWidths[index];
      doc.rect(startX, startY, cellWidth, 10); // Cell border
      doc.text(header, startX + 2, startY + 6);
      startX += cellWidth;
    });
    doc.setFont("normal");

    currentY += 10; // Move to next line after header

    // Table Body
    filteredRows.forEach((row, rowIndex) => {
      startX = margin;
      const rowHeight = 8;
      let rowY = currentY;

      const rowData = [
        (rowIndex + 1).toString(),
        row.original.student_id,
        `${row.original.lastName}, ${row.original.firstName} ${row.original.middleName ? `${row.original.middleName[0].toUpperCase()}.` : ""}`,
        row.original.gender,
        row.original.programCode,
        row.original.yearLevel,
        new Date(row.original.createdAt).toLocaleDateString(),
      ];

      // Draw cell borders and data
      rowData.forEach((data, index) => {
        const cellWidth = tableColumnWidths[index];
        doc.rect(startX, rowY, cellWidth, rowHeight); // Cell border
        const cellText = doc.splitTextToSize(data, cellWidth - 4);
        doc.text(cellText, startX + 2, rowY + 5);
        startX += cellWidth;
      });

      currentY += rowHeight;

      if (currentY > pageHeight - margin) {
        doc.addPage();
        currentY = margin;
      }
    });

    const pdfDataUri = doc.output("bloburl");
    window.open(
      pdfDataUri,
      "_blank",
      "toolbar=no,scrollbars=yes,resizable=yes,top=100,left=100,width=800,height=600",
    );
  };

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
            <div className="mb-5 flex gap-2 md:mb-0 md:w-full md:justify-between">
              <ResetFilter table={table} className={"h-[3.3em]"} />
              {/* Print Button */}
              <Button
                onClick={handlePrint}
                className="inline-flex h-[3.3em] gap-1 !bg-blue-500 !text-white hover:!bg-blue-600"
              >
                <PrinterIcon className="h-5 w-5" />
                Print
              </Button>
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
