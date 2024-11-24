// pages/ViewCLassDetailsPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import DefaultLayout from "../../layout/DefaultLayout";
import { BreadcrumbResponsive } from "../../../components/reuseable/Breadcrumbs";
import { HasRole } from "../../../components/reuseable/HasRole";
import { AuthContext } from "../../../components/context/AuthContext";
import { jsPDF } from "jspdf";
import { Skeleton } from "../../../components/ui/skeleton";

const ViewCLassDetailsPage = () => {
  const { classID } = useParams();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch class data
    axios
      .get(`/class/${classID}`)
      .then((response) => {
        setClassData(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching class data:", error);
        setError("Failed to fetch class data.");
        setLoading(false);
      });
  }, [classID]);

  const { user } = useContext(AuthContext);

  const NavItems = [
    { to: "/", label: "Dashboard" },
    { to: "/class-list", label: "Class List" },
    {
      label: "Class Details",
    },
  ];

  // Function to convert year level words to ordinal numbers
  const convertYearLevel = (yearLevel) => {
    const mapping = {
      "First Year": "1st Year",
      "Second Year": "2nd Year",
      "Third Year": "3rd Year",
      "Fourth Year": "4th Year",
    };
    return mapping[yearLevel] || yearLevel;
  };

  // Function to handle printing the PDF
  const handlePrint = () => {
    if (!classData) return;

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
    // doc.text(
    //   "A.S. Fortuna Street, Mandaue City, 6014, Metro Cebu, Philippines",
    //   pageWidth / 2,
    //   currentY,
    //   { align: "center" },
    // );
    // currentY += 12;

    // doc.setFontSize(20);
    // doc.text(classData.subject_code, pageWidth / 2, currentY, {
    //   align: "center",
    // });
    // currentY += 10;

    currentY += 12;
    doc.setFontSize(16);
    doc.text("CLASS LIST", pageWidth / 2, currentY, {
      align: "center",
    });
    currentY += 8;
    doc.text(
      `${classData.school_year} - ${classData.semester}`,
      pageWidth / 2,
      currentY,
      { align: "center" },
    );
    currentY += 12;

    // Left Side Information
    doc.setFontSize(12);
    let leftY = currentY;
    doc.text(`Subject Code: ${classData.subject_code}`, margin, leftY);
    leftY += 8;
    doc.text(`Subject Description: ${classData.subject}`, margin, leftY);
    leftY += 8;
    doc.text(`Schedule: ${classData.schedule}`, margin, leftY);
    leftY += 8;
    doc.text(`Teacher: ${classData.teacher}`, margin, leftY);

    // Right Side Information
    let rightY = currentY;
    const rightX = pageWidth - margin - 45; // Adjust based on content width
    doc.text(`Room: ${classData.room}`, rightX, rightY);
    rightY += 8;
    doc.text(`Total Students: ${classData.totalStudents}`, rightX, rightY);

    currentY = Math.max(leftY, rightY) + 12; // Move currentY below the left and right sections

    // Table Headers
    const tableColumnWidths = [10, 30, 50, 20, 40, 20];
    const tableHeaders = [
      "No.",
      "Student ID",
      "Name",
      "Gender",
      "Course",
      "Year Level",
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
    classData.students.forEach((student, studentIndex) => {
      startX = margin;
      const rowHeight = 8;
      let rowY = currentY;

      const yearLevelConverted = convertYearLevel(student.yearLevel);

      const rowData = [
        (studentIndex + 1).toString(),
        student.student_id,
        student.name,
        student.gender,
        student.program,
        yearLevelConverted,
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

      // Check if we need to add a new page
      if (currentY > pageHeight - margin) {
        doc.addPage();
        currentY = margin;
      }
    });

    // Open the PDF in a new minimized window
    const pdfDataUri = doc.output("bloburl");
    window.open(
      pdfDataUri,
      "_blank",
      "toolbar=no,scrollbars=yes,resizable=yes,top=100,left=100,width=800,height=600",
    );
  };

  return (
    <DefaultLayout>
      <BreadcrumbResponsive
        pageName={
          !HasRole(user.role, "SuperAdmin")
            ? `Class Details (${user?.campusName})`
            : "Class Details"
        }
        items={NavItems}
        ITEMS_TO_DISPLAY={3}
      />

      <div className="mx-auto max-w-6xl p-4">
        {/* Loading State */}
        {loading && (
          <>
            <div className="my-5 rounded-lg border border-stroke bg-white p-4 px-6 dark:border-strokedark dark:bg-boxdark">
              <div className="space-y-4">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>

            <div className="my-5 rounded-lg border border-stroke bg-white p-4 px-6 dark:border-strokedark dark:bg-boxdark">
              <div className="space-y-4">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-[50vh] mt-2 w-full" />
              </div>
            </div>
          </>
        )}

        {/* Error State */}
        {error && (
          <div className="my-5 rounded-lg border border-stroke bg-white p-4 px-6 dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-screen items-center justify-center">
              <div className="text-xl text-red-500">{error}</div>
            </div>
          </div>
        )}

        {/* No Data State */}
        {!loading && !error && !classData && (
          <div className="my-5 rounded-lg border border-stroke bg-white p-4 px-6 dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-screen items-center justify-center">
              <div className="text-gray-500 text-xl">No data found.</div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && classData && (
          <>
            {/* Class Information */}
            <div className="my-5 rounded-lg border border-stroke bg-white p-4 px-6 dark:border-strokedark dark:bg-boxdark">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">Class Details</h3>
                {/* Print Button */}
                <button
                  onClick={handlePrint}
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Print
                </button>
              </div>
              <div className="mt-4 flex justify-between">
                {/* Left Side */}
                <div>
                  <p>
                    <strong>Subject Code:</strong> {classData.subject_code}
                  </p>
                  <p>
                    <strong>Subject Description:</strong> {classData.subject}
                  </p>
                  <p>
                    <strong>Schedule:</strong> {classData.schedule}
                  </p>
                  <p>
                    <strong>Teacher:</strong> {classData.teacher}
                  </p>
                </div>
                {/* Right Side */}
                <div>
                  <p>
                    <strong>Room:</strong> {classData.room}
                  </p>
                  <p>
                    <strong>Total Students:</strong> {classData.totalStudents}
                  </p>
                </div>
              </div>
            </div>
            {/* Students Table */}
            <div className="my-5 rounded-lg border border-stroke bg-white p-4 px-6 dark:border-strokedark dark:bg-boxdark">
              <h3 className="mb-4 text-2xl font-semibold">Enrolled Students</h3>
              <table className="divide-gray-200 min-w-full divide-y">
                <thead>
                  <tr>
                    <th className="border px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      No.
                    </th>
                    <th className="border px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="border px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Name
                    </th>
                    <th className="border px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="border px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Course
                    </th>
                    <th className="border px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Year Level
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-gray-200 divide-y">
                  {classData.students.map((student, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap border px-6 py-4">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap border px-6 py-4">
                        {student.student_id}
                      </td>
                      <td className="whitespace-nowrap border px-6 py-4">
                        {student.name}
                      </td>
                      <td className="whitespace-nowrap border px-6 py-4">
                        {student.gender}
                      </td>
                      <td className="whitespace-nowrap border px-6 py-4">
                        {student.program}
                      </td>
                      <td className="whitespace-nowrap border px-6 py-4">
                        {convertYearLevel(student.yearLevel)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </DefaultLayout>
  );
};

export default ViewCLassDetailsPage;
