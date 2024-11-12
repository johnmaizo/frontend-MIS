import { ArrowUpDown, PencilIcon } from "lucide-react";
import { Button } from "../ui/button";
import { FacetedFilterEnrollment } from "./FacetedFilterEnrollment";
import { getUniqueCodes, getUniqueCodesEnrollment } from "./GetUniqueValues";
import { useSchool } from "../context/SchoolContext";
import EditCampus from "../api/EditCampus";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { HasRole } from "./HasRole";
import { useEnrollment } from "../context/EnrollmentContext";
import ButtonActionPayment from "./ButtonActionPayment";

import { format } from "date-fns";
import AcceptPaymentDialog from "./AcceptPaymentDialog";
import { Link } from "react-router-dom";
import AddEnrollment from "../api/AddEnrollment";

const useColumnsSecond = () => {
  const { user } = useContext(AuthContext);
  const { prospectusSubjects } = useSchool();
  const { fetchEnrollmentStatus, pendingStudents, onlineApplicants } =
    useEnrollment();

  // ! Column View Subject Prospectus START
  const columnViewSubjectProspectus = [
    {
      accessorKey: "prospectus_subject_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            No.
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => {
        return <span className="font-semibold">{info.row.index + 1}</span>;
      },
    },
    {
      accessorKey: "yearLevel",
      header: ({ column }) => {
        return (
          <FacetedFilterEnrollment
            column={column}
            title="Year Level"
            options={getUniqueCodes(prospectusSubjects, "yearLevel")}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ cell }) => {
        return <span className="text-lg font-semibold">{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "semesterName",
      header: ({ column }) => {
        return (
          <FacetedFilterEnrollment
            column={column}
            title="Semester"
            options={getUniqueCodes(prospectusSubjects, "semesterName")}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ cell }) => {
        return <span className="">{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "courseCode",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Subject Code
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return (
          <span className={"inline-block font-medium"}>{cell.getValue()}</span>
        );
      },
    },
    {
      accessorKey: "courseDescription",
      header: "Subject Description",
      cell: ({ cell }) => {
        return <span>{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "unit",
      header: "Unit",
      cell: ({ cell }) => {
        return <span>{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "prerequisites",
      header: "Pre-requisites",
      cell: ({ cell }) => {
        const value = cell.getValue();

        // Check if value is an array, then map it to display courseCodes as a styled bullet list
        if (Array.isArray(value)) {
          return (
            <ul
              style={{
                listStyleType: "disc",
                paddingLeft: "20px",
                color: "#333",
              }}
            >
              {value.map((item, index) => (
                <li
                  key={index}
                  style={{ marginBottom: "5px", fontWeight: "bold" }}
                >
                  {item.courseCode}
                </li>
              ))}
            </ul>
          );
        }

        // If not an array, just return the value as it is
        return <span>{value}</span>;
      },
    },
  ];
  // ! Column View Subject Prospectus END

  // ! Column Payment Enrollment Status START
  const columnPaymentEnrollmentStatus = [
    {
      accessorKey: "enrollment_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            No.
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => {
        return <span className="font-semibold">{info.row.index + 1}</span>;
      },
    },
    {
      accessorKey: "fullName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Full Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return <span className="text-lg font-semibold">{cell.getValue()}</span>;
      },
    },

    {
      // accessorKey: "campusAddress",
      id: "amountDue",
      header: "Amount Due",
      // cell: ({ cell }) => {
      //   return cell.getValue();
      // },
      cell: "₱500",
    },
    {
      accessorKey: "payment_confirmed",
      header: "Payment Status",
      cell: ({ cell }) => {
        return (
          <span
            className={`inline-flex rounded px-3 py-1 text-sm font-medium text-white ${
              cell.getValue() ? "bg-success" : "bg-orange-600"
            }`}
          >
            {cell.getValue() ? "Payed" : "Pending"}
          </span>
        );
      },
    },
    ...(user && HasRole(user.role, "SuperAdmin")
      ? [
          {
            accessorKey: "campusName",
            header: ({ column }) => {
              return (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                  className="p-1 hover:underline hover:underline-offset-4"
                >
                  Campus
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              );
            },
            cell: ({ cell }) => {
              return (
                <span className="font-semibold">
                  {cell.getValue() === "Campus name not found"
                    ? "N/A"
                    : cell.getValue()}
                </span>
              );
            },
          },
        ]
      : []),
    {
      header: "Actions",
      accessorFn: (row) =>
        `${row.student_personal_id} ${row.fullName} ${row.isActive}`,
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex w-[5em] items-center gap-3">
            <AcceptPaymentDialog
              studentPersonalId={row.original.student_personal_id}
              fullName={row.original.fullName}
              fetchEnrollmentStatus={fetchEnrollmentStatus}
            />

            {/* Reject Payment Dialog */}
            <Dialog>
              <DialogTrigger className="rounded-md !bg-red-600 p-2 !text-white">
                Reject Payment
              </DialogTrigger>
              <DialogContent className="rounded-sm border border-stroke bg-white p-6 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    Reject Payment
                  </DialogTitle>
                  <DialogDescription asChild className="mt-2">
                    <p className="mb-5">
                      Are you sure you want to reject{" "}
                      <strong>&quot;{row.original.fullName}&quot;</strong>{" "}
                      payment?
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <div className="mx-[2em] flex w-full justify-center gap-[6em]">
                    <ButtonActionPayment
                      entityType={"enrollment"}
                      entityId={row.original.student_personal_id}
                      action="reject"
                      onSuccess={() => {
                        fetchEnrollmentStatus("approvals");
                      }}
                    />

                    <DialogClose asChild>
                      <Button
                        variant="ghost"
                        className="w-full underline-offset-4 hover:underline"
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ];
  // ! Column Payment Enrollment Status END

  // ! New columns for Payment History
  const columnPaymentHistory = [
    {
      accessorKey: "enrollment_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            No.
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => {
        return <span className="font-semibold">{info.row.index + 1}</span>;
      },
    },
    {
      accessorKey: "fullName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Full Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return <span className="text-lg font-semibold">{cell.getValue()}</span>;
      },
    },
    {
      id: "amountPaid",
      header: "Amount Paid",
      cell: "₱500", // Or use actual data if available
    },
    {
      accessorKey: "payment_confirmed",
      header: "Payment Status",
      cell: ({ cell }) => {
        return (
          <span
            className={`inline-flex rounded px-3 py-1 text-sm font-medium text-white ${
              cell.getValue() ? "bg-success" : "bg-orange-600"
            }`}
          >
            {cell.getValue() ? "Paid" : "Pending"}
          </span>
        );
      },
    },
    {
      accessorKey: "accounting_status_date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Payment Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        const date = cell.getValue();
        if (date) {
          return format(new Date(date), "MMMM dd, yyyy");
        }
        return "N/A";
      },
    },
    ...(user && HasRole(user.role, "SuperAdmin")
      ? [
          {
            accessorKey: "campusName",
            header: ({ column }) => {
              return (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                  className="p-1 hover:underline hover:underline-offset-4"
                >
                  Campus
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              );
            },
            cell: ({ cell }) => {
              return (
                <span className="font-semibold">
                  {cell.getValue() === "Campus name not found"
                    ? "N/A"
                    : cell.getValue()}
                </span>
              );
            },
          },
        ]
      : []),
    // No Actions column in history
  ];
  // ! Columns Payment History END

  // ! Columns Pending Students START
  const columnUnenrolledStudents = [
    {
      accessorKey: "enrollment_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            No.
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => {
        return <span className="font-semibold">{info.row.index + 1}</span>;
      },
    },
    {
      accessorKey: "fullName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Full Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return <span className="text-lg font-semibold">{cell.getValue()}</span>;
      },
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        const studentPersonalId = row.original.student_personal_id;
        return (
          <Link to={`/enrollments/subject-enlistment/${studentPersonalId}`}>
            <Button
              variant="ghost"
              className="text-blue-500 hover:text-blue-700"
            >
              <PencilIcon className="h-5 w-5" />
            </Button>
          </Link>
        );
      },
    },
  ];
  // ! Columns Pending Students END

  const columnExistingStudents = [
    {
      accessorKey: "student_id",
      header: "Student ID",
      cell: ({ cell }) => (
        <span className="text-base font-medium">{cell.getValue()}</span>
      ),
    },
    {
      accessorKey: "fullName",
      header: "Full Name",
      cell: ({ cell }) => (
        <span className="text-lg font-semibold">{cell.getValue()}</span>
      ),
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        const student = row.original;
        return <AddEnrollment student={student} />;
      },
    },
  ];

  const columnNewUnenrolledStudents = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            No.
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => {
        return <span className="font-semibold">{info.row.index + 1}</span>;
      },
    },
    {
      accessorKey: "fullName",
      header: "Full Name",
      cell: ({ cell }) => <span className="text-lg">{cell.getValue()}</span>,
    },
    {
      accessorKey: "programCode",
      header: ({ column }) => {
        return (
          <FacetedFilterEnrollment
            column={column}
            title="Program"
            options={getUniqueCodes(pendingStudents, "programCode")}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ cell }) => {
        return <span className="text-lg font-semibold">{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "yearLevel",
      header: ({ column }) => {
        return (
          <FacetedFilterEnrollment
            column={column}
            title="Year Level"
            options={getUniqueCodes(pendingStudents, "yearLevel")}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ cell }) => {
        return <span className="text-lg">{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "enrollmentType",
      header: ({ column }) => {
        return (
          <FacetedFilterEnrollment
            column={column}
            title="Enrollment Type"
            options={getUniqueCodes(pendingStudents, "enrollmentType")}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ cell }) => {
        return <span className="text-lg font-semibold">{cell.getValue()}</span>;
      },
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        const studentPersonalId = row.original.id;
        const hasEnlistedSubjects = row.original.hasEnlistedSubjects;

        return (
          <Link to={`/enrollments/subject-enlistment/${studentPersonalId}`}>
            <Button
              variant="ghost"
              className="text-blue-500 hover:text-blue-700"
            >
              {hasEnlistedSubjects ? "Edit Enlistment" : "Enlist Subjects"}
            </Button>
          </Link>
        );
      },
    },
  ];

  const columnPendingOnlineApplicant = [
    {
      accessorKey: "fulldata_applicant_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            No.
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => {
        return <span className="font-semibold">{info.row.index + 1}</span>;
      },
    },
    {
      accessorKey: "fullName",
      header: "Full Name",
      cell: ({ cell }) => <span className="text-lg">{cell.getValue()}</span>,
    },
    {
      accessorKey: "programCode",
      header: ({ column }) => {
        return (
          <FacetedFilterEnrollment
            column={column}
            title="Program"
            options={getUniqueCodes(onlineApplicants, "programCode")}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ cell }) => {
        return <span className="text-lg font-semibold">{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "yearLevel",
      header: ({ column }) => {
        return (
          <FacetedFilterEnrollment
            column={column}
            title="Year Level"
            options={getUniqueCodes(onlineApplicants, "yearLevel")}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ cell }) => {
        return <span className="text-lg">{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "enrollmentType",
      header: ({ column }) => {
        return (
          <FacetedFilterEnrollment
            column={column}
            title="Enrollment Type"
            options={getUniqueCodes(onlineApplicants, "enrollmentType")}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ cell }) => {
        return (
          <span className="inline-block rounded-md !bg-green-600 p-1 font-medium !text-white">
            {cell.getValue()}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <FacetedFilterEnrollment
            column={column}
            title="Status"
            options={getUniqueCodesEnrollment(onlineApplicants, "status")}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ cell }) => {
        return (
          <span
            className={`inline-block rounded px-3 py-1 text-sm font-medium text-white ${
              cell.getValue() === "accepted"
                ? "bg-success"
                : cell.getValue() === "pending"
                  ? "bg-orange-500"
                  : "bg-danger"
            }`}
          >
            {cell.getValue() === "accepted"
              ? "Accepted"
              : cell.getValue() === "pending"
                ? "Pending"
                : "Rejected"}
          </span>
        );
      },
    },
    ...(user && HasRole(user.role, "SuperAdmin")
      ? [
          {
            accessorKey: "campusName",
            header: ({ column }) => {
              return (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                  className="p-1 hover:underline hover:underline-offset-4"
                >
                  Campus
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              );
            },
            cell: ({ cell }) => {
              return (
                <span className="font-semibold">
                  {cell.getValue() === "Campus name not found"
                    ? "N/A"
                    : cell.getValue()}
                </span>
              );
            },
          },
        ]
      : []),
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        const applicantID = row.original.fulldata_applicant_id;

        return (
          <Link to={`/enrollments/online-applicants/applicant/${applicantID}`}>
            <Button
              variant="ghost"
              className="text-blue-500 hover:text-blue-700"
            >
              View Applicant
            </Button>
          </Link>
        );
      },
    },
  ];

  return {
    columnViewSubjectProspectus,
    columnPaymentEnrollmentStatus,
    columnPaymentHistory,
    columnUnenrolledStudents,

    columnExistingStudents,
    columnNewUnenrolledStudents,

    columnPendingOnlineApplicant,
  };
};

export { useColumnsSecond };
