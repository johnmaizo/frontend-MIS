import { ArrowUpDown } from "lucide-react";
import { useSchool } from "../context/SchoolContext";
import { Button } from "../ui/button";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import EditCourse from "../api/EditCourse";
import { DeleteIcon } from "../Icons";
import ButtonAction from "./ButtonAction";
import EditCampus from "../api/EditCampus";
import EditSemester from "../api/EditSemester";
import EditDepartment from "../api/EditDepartment";
import { getInitialDepartmentCodeAndCampus } from "./GetInitialNames";
import EditProgram from "../api/EditProgram";
import { Link, useParams } from "react-router-dom";

const useColumns = () => {
  const {
    fetchCampus,
    fetchCampusDeleted,
    fetchSemesters,
    fetchSemestersDeleted,
    fetchDepartments,
    fetchDepartmentsDeleted,
    fetchProgram,
    fetchProgramDeleted,
    fetchCourse,
    fetchCourseDeleted,
    fetchProgramCourse,
    fetchProgramCourseDeleted,
  } = useSchool();

  const { campusName, program_id } = useParams();

  const { user } = useContext(AuthContext);

  // ! Column Campus START
  const columnCampus = [
    {
      accessorKey: "campus_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Numeric ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return <span className="font-semibold">{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "campusName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Campus Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return <span className="text-lg font-semibold">{cell.getValue()}</span>;
      },
    },

    {
      accessorKey: "campusAddress",
      header: "Campus Address",
      cell: ({ cell }) => {
        return cell.getValue();
      },
    },
    // {
    //   accessorKey: "createdAt",
    //   header: "Date Created",
    //   cell: ({ cell }) => {
    //     return `${cell.getValue().toString().split("T")[0]} at ${new Date(cell.getValue()).toLocaleTimeString()}`;
    //   },
    // },
    // {
    //   accessorKey: "updatedAt",
    //   header: "Date Updated",
    //   cell: ({ cell }) => {
    //     return `${cell.getValue().toString().split("T")[0]} at ${new Date(cell.getValue()).toLocaleTimeString()}`;
    //   },
    // },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ cell }) => {
        return (
          <span
            className={`inline-flex rounded px-3 py-1 text-sm font-medium text-white ${
              cell.getValue() ? "bg-success" : "bg-danger"
            }`}
          >
            {cell.getValue() ? "Active" : "Inactive"}
          </span>
        );
      },
    },

    {
      header: "Actions",
      accessorFn: (row) => `${row.campus_id} ${row.isActive}`,
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <EditCampus campusId={row.getValue("campus_id")} />

            <Dialog>
              <DialogTrigger className="p-2 hover:text-primary">
                <DeleteIcon forActions={"Delete Campus"} />
              </DialogTrigger>
              <DialogContent className="rounded-sm border border-stroke bg-white p-6 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    Delete
                  </DialogTitle>
                  <DialogDescription asChild className="mt-2">
                    <p className="mb-5">
                      Are you sure you want to delete this campus?
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <div className="mx-[2em] flex w-full justify-center gap-[6em]">
                    <ButtonAction
                      entityType={"campus"}
                      entityId={row.getValue("campus_id")}
                      action="delete"
                      onSuccess={() => {
                        fetchCampus();
                        fetchCampusDeleted();
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
  // ! Column Campus END

  // ! Column Semester START
  const columnSemester = [
    {
      accessorKey: "semester_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Numeric ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => {
        // `info.row.index` gives the zero-based index of the row
        return <span>{info.row.index + 1}</span>; // +1 to start numbering from 1
      },
    },

    {
      accessorKey: "schoolYear",
      header: "School Year",
      cell: ({ cell }) => {
        return <span className="font-semibold">{cell.getValue()}</span>;
      },
    },

    {
      accessorKey: "semesterName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Semester
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return cell.getValue();
      },
    },
    {
      accessorKey: "campus.campusName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Campus
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return (
          <span
            className={`inline-flex rounded px-3 py-1 text-sm font-medium text-white ${
              cell.getValue() ? "bg-success" : "bg-danger"
            }`}
          >
            {cell.getValue() ? "Active" : "Inactive"}
          </span>
        );
      },
    },

    {
      header: "Actions",
      accessorFn: (row) => `${row.semester_id} ${row.isActive}`,
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <EditSemester semesterId={row.getValue("semester_id")} />

            <Dialog>
              <DialogTrigger className="p-2 hover:text-primary">
                <DeleteIcon forActions={"Delete Semester"} />
              </DialogTrigger>
              <DialogContent className="rounded-sm border border-stroke bg-white p-6 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    Delete Semester
                  </DialogTitle>
                  <DialogDescription asChild className="mt-2">
                    <p className="mb-5">
                      Are you sure you want to delete this semester?
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <div className="mx-[2em] flex w-full justify-center gap-[6em]">
                    <ButtonAction
                      entityType={"semester"}
                      entityId={row.getValue("semester_id")}
                      action="delete"
                      onSuccess={() => {
                        fetchSemesters();
                        fetchSemestersDeleted();
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
  // ! Column Semester END

  // ! Column Departments START
  const columnDepartment = [
    {
      accessorKey: "department_id",

      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Numeric ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => {
        // `info.row.index` gives the zero-based index of the row
        return <span>{info.row.index + 1}</span>; // +1 to start numbering from 1
      },
    },
    {
      accessorKey: "departmentCode",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Department Code
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return <span className="text-lg font-semibold">{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "departmentName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Department Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "departmentDean",
      header: "Dean",
    },
    {
      accessorKey: "campus.campusName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Campus
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ cell }) => {
        return (
          <span
            className={`inline-flex rounded px-3 py-1 text-sm font-medium text-white ${
              cell.getValue() ? "bg-success" : "bg-danger"
            }`}
          >
            {cell.getValue() ? "Active" : "Inactive"}
          </span>
        );
      },
    },

    {
      header: "Actions",
      accessorFn: (row) => `${row.department_id} ${row.isActive}`,
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <EditDepartment departmentId={row.getValue("department_id")} />

            <Dialog>
              <DialogTrigger className="p-2 hover:text-primary">
                <DeleteIcon forActions={"Delete Department"} />
              </DialogTrigger>
              <DialogContent className="rounded-sm border border-stroke bg-white p-6 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    Delete Department
                  </DialogTitle>
                  <DialogDescription asChild className="mt-2">
                    <p className="mb-5">
                      Are you sure you want to delete this department?
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <div className="mx-[2em] flex w-full justify-center gap-[6em]">
                    {/* <ButtonActionDepartment
                      action="delete"
                      departmentId={row.getValue("department_id")}
                      onSuccess={() => {
                        fetchDepartments();
                        fetchDepartmentsDeleted();
                      }}
                    /> */}
                    <ButtonAction
                      entityType={"department"}
                      entityId={row.getValue("department_id")}
                      action="delete"
                      onSuccess={() => {
                        fetchDepartments();
                        fetchDepartmentsDeleted();
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
  // ! Column Departments END

  // ! Column Program START
  const columnProgram = [
    {
      accessorKey: "program_id",

      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Numeric ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => {
        // `info.row.index` gives the zero-based index of the row
        return <span className="font-semibold">{info.row.index + 1}</span>; // +1 to start numbering from 1
      },
    },
    {
      accessorKey: "programCode",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Program Code
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
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
      accessorKey: "programDescription",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Program Description
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "fullDepartmentNameWithCampus",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Department
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        const getDeparmentName = cell.getValue().split(" - ")[1];

        return (
          <TooltipProvider delayDuration={75}>
            <Tooltip>
              <TooltipTrigger
                asChild
                className="cursor-default hover:underline hover:underline-offset-2"
              >
                <span className="font-medium">
                  {getInitialDepartmentCodeAndCampus(cell.getValue())}
                </span>
              </TooltipTrigger>
              <TooltipContent className="bg-white !shadow-default dark:border-strokedark dark:bg-[#1A222C]">
                <p className="text-[1rem]">{getDeparmentName}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ cell }) => {
        return (
          <span
            className={`inline-flex rounded px-3 py-1 text-sm font-medium text-white ${
              cell.getValue() ? "bg-success" : "bg-danger"
            }`}
          >
            {cell.getValue() ? "Active" : "Inactive"}
          </span>
        );
      },
    },

    {
      header: "Actions",
      accessorFn: (row) => `${row.program_id} ${row.isActive}`,
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <EditProgram programId={row.getValue("program_id")} />

            <Dialog>
              <DialogTrigger className="p-2 hover:text-primary">
                <DeleteIcon forActions={"Delete Program"} />
              </DialogTrigger>
              <DialogContent className="rounded-sm border border-stroke bg-white p-6 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    Delete Program
                  </DialogTitle>
                  <DialogDescription asChild className="mt-2">
                    <p className="mb-5">
                      Are you sure you want to delete this program?
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <div className="mx-[2em] flex w-full justify-center gap-[6em]">
                    {/* <ButtonActionProgram
                      action="delete"
                      programId={row.getValue("program_id")}
                      onSuccess={() => {
                        fetchProgram();
                        fetchProgramDeleted();
                      }}
                    /> */}
                    <ButtonAction
                      entityType={"program"}
                      entityId={row.getValue("program_id")}
                      action="delete"
                      onSuccess={() => {
                        fetchProgram();
                        fetchProgramDeleted();
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
  // ! Column Program END

  // ! Column Course START
  const columnCourse = [
    {
      accessorKey: "course_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Numeric ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => {
        return <span className="font-semibold">{info.row.index + 1}</span>;
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
            Course Code
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return <span className="text-lg font-semibold">{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "courseDescription",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Course Description
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return cell.getValue();
      },
    },
    {
      accessorKey: "unit",
      header: "Unit",
      cell: ({ cell }) => {
        return cell.getValue();
      },
    },
    ...(user && user.role === "SuperAdmin"
      ? [
          {
            accessorKey: "campus.campusName",
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
          },
        ]
      : []),
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ cell }) => {
        return (
          <span
            className={`inline-flex rounded px-3 py-1 text-sm font-medium text-white ${
              cell.getValue() ? "bg-success" : "bg-danger"
            }`}
          >
            {cell.getValue() ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      header: "Actions",
      accessorFn: (row) => `${row.course_id} ${row.isActive}`,
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <EditCourse courseId={row.getValue("course_id")} />
            <Dialog>
              <DialogTrigger className="p-2 hover:text-primary">
                <DeleteIcon forActions={"Delete Course"} />
              </DialogTrigger>
              <DialogContent className="rounded-sm border border-stroke bg-white p-6 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    Delete
                  </DialogTitle>
                  <DialogDescription asChild className="mt-2">
                    <p className="mb-5">
                      Are you sure you want to delete this Course?
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <div className="mx-[2em] flex w-full justify-center gap-[6em]">
                    {/* <ButtonActionCourse
                      action="delete"
                      courseId={row.getValue("course_id")}
                      onSuccess={() => {
                        fetchCourse();
                        fetchCourseDeleted();
                      }}
                    /> */}
                    <ButtonAction
                      entityType={"course"}
                      entityId={row.getValue("course_id")}
                      action="delete"
                      onSuccess={() => {
                        fetchCourse();
                        fetchCourseDeleted();
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
  // ! Column Course END

  // ! Column Program Course START
  const columnProgramCourse = [
    {
      accessorKey: "program_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Numeric ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => {
        return <span className="font-semibold">{info.row.index + 1}</span>;
      },
    },
    {
      accessorKey: "programCode",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Program Code
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return <span className="text-lg font-semibold">{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "programDescription",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Program Description
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return cell.getValue();
      },
    },
    ...(user && user.role === "SuperAdmin"
      ? [
          {
            accessorKey: "department.campus.campusName",
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
                <span className="inline-block font-semibold">
                  {cell.getValue()}
                </span>
              );
            },
          },
        ]
      : []),
    {
      header: () => {
        return <span className="sr-only">Select Program</span>;
      },
      accessorFn: (row) =>
        `${row.program_id} ${row.department.campus.campusName} ${row.isActive}`,
      id: "select",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <Link
              to={`/courses/program-courses/${row.original.department.campus.campusName}/${row.original.program_id}`}
              className="rounded bg-primary p-3 text-sm font-medium text-white hover:underline hover:underline-offset-2"
            >
              Select Program
            </Link>
          </div>
        );
      },
    },
  ];
  // ! Column Program Course END

  // ! Column View Program Course START
  const columnViewProgramCourse = [
    {
      accessorKey: "programCourse_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Numeric ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => {
        return <span className="font-semibold">{info.row.index + 1}</span>;
      },
    },
    {
      accessorKey: "courseinfo.courseCode",
      id: "courseCode",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Course Code
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return <span className="text-lg font-semibold">{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "courseinfo.courseDescription",
      id: "courseDescription",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Course Description
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return cell.getValue();
      },
    },
    {
      accessorKey: "courseinfo.unit",
      header: "Unit",
      cell: ({ cell }) => {
        return cell.getValue();
      },
    },
    {
      accessorKey: "program.programCode",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Program Code
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return (
          <span className="inline-block w-full text-center text-lg font-semibold">
            {cell.getValue()}
          </span>
        );
      },
    },
    ...(user && user.role === "SuperAdmin"
      ? [
          {
            accessorKey: "program.department.campus.campusName",
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
          },
        ]
      : []),
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ cell }) => {
        return (
          <span
            className={`inline-flex rounded px-3 py-1 text-sm font-medium text-white ${
              cell.getValue() ? "bg-success" : "bg-danger"
            }`}
          >
            {cell.getValue() ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      header: "Actions",
      accessorFn: (row) => `${row.programCourse_id} ${row.isActive}`,
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <EditCourse courseId={row.getValue("programCourse_id")} />
            <Dialog>
              <DialogTrigger className="p-2 hover:text-primary">
                <DeleteIcon forActions={"Delete Course"} />
              </DialogTrigger>
              <DialogContent className="rounded-sm border border-stroke bg-white p-6 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    Delete
                  </DialogTitle>
                  <DialogDescription asChild className="mt-2">
                    <p className="mb-5">
                      Are you sure you want to delete this Course?
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <div className="mx-[2em] flex w-full justify-center gap-[6em]">
                    {/* <ButtonActionCourse
                      action="delete"
                      courseId={row.getValue("programCourse_id")}
                      onSuccess={() => {
                        fetchProgramCourse(campusName, program_id);
                        fetchProgramCourseDeleted(campusName, program_id);
                      }}
                    /> */}
                    <ButtonAction
                      entityType={"course"}
                      entityId={row.getValue("programCourse_id")}
                      action="delete"
                      onSuccess={() => {
                        fetchProgramCourse(campusName, program_id);
                        fetchProgramCourseDeleted(campusName, program_id);
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
  // ! Column View Program Course END

  return {
    columnCampus,
    columnSemester,
    columnDepartment,
    columnProgram,
    columnCourse,
    columnProgramCourse,
    columnViewProgramCourse,
  };
};

// Consistent export
export { useColumns };