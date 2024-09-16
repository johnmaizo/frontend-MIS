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
import { HasRole } from "./HasRole";
import { Badge } from "../ui/badge";
import EditBuilding from "../api/EditBuilding";
import EditFloor from "../api/EditFloor";
import EditRoom from "../api/EditRoom";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { getUniqueCodes } from "./GetUniqueValues";
import RoleBadge from "./RoleBadge";

const useColumns = () => {
  const {
    program,
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
    fetchBuildings,
    fetchBuildingsDeleted,
    fetchFloors,
    fetchFloorsDeleted,
    fetchRooms,
    fetchRoomsDeleted,
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
          // <DataTableFacetedFilter
          //   column={column}
          //   title="Program Codes"
          //   options={getUniqueCodes(program, "programCode")}
          // />
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
            Subject Description
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
    ...(user && HasRole(user.role, "SuperAdmin")
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
    ...(user && HasRole(user.role, "SuperAdmin")
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
              to={`/subjects/program-subjects/campus/${row.original.department.campus.campusName}/program/${row.original.program_id}`}
              className="w-[120.86px] rounded bg-primary p-3 text-sm font-medium text-white hover:underline hover:underline-offset-2"
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
      accessorKey: "courseinfo.courseCode",
      id: "courseCode",
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
            Subject Description
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
    ...(user && HasRole(user.role, "SuperAdmin")
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

  // ! Accounts START
  const columnsAccount = [
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
        // `info.row.index` gives the zero-based index of the row
        return <span className="font-semibold">{info.row.index + 1}</span>; // +1 to start numbering from 1
      },
    },
    {
      accessorFn: (row) => {
        const middleInitial =
          row.middleName && row.middleName.trim() !== ""
            ? `${row.middleName.charAt(0)}.`
            : "";
        return `${row.firstName} ${middleInitial.toUpperCase()} ${row.lastName}`;
      },
      id: "fullName",
      header: "Name",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ cell }) => {
        return (
          <>
            <div className="flex flex-wrap gap-1">
              <RoleBadge rolesString={cell.getValue()} />
            </div>
          </>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
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
            cell: ({cell}) => {
              return (
                <span className="font-semibold">
                  {cell.getValue() ? cell.getValue() : "N/A"}
                </span>
              )
            }
          },
        ]
      : []),
    {
      accessorKey: "contactNumber",
      header: "Contact Number",
    },
    {
      accessorKey: "created",
      header: "Date Created",
      cell: ({ cell }) => {
        return (
          <Badge variant={"outline"} className={"text-[0.8rem] font-medium"}>
            <relative-time datetime={cell.getValue()}>
              {new Date(cell.getValue()).toDateString()}
            </relative-time>
          </Badge>
        );
      },
    },
    {
      accessorKey: "updated",
      header: "Date Updated",
      cell: ({ cell }) => {
        return cell.getValue() ? (
          <Badge variant={"outline"} className={"text-[0.8rem]"}>
            <relative-time datetime={cell.getValue()}>
              {new Date(cell.getValue()).toDateString()}
            </relative-time>
          </Badge>
        ) : (
          <Badge variant={"outline"} className={"text-[0.8rem] font-medium"}>
            N/A
          </Badge>
        );
      },
    },
    {
      accessorKey: "id",
      id: "Actions",

      header: "Action",
      cell: ({ cell }) => {
        return <EditDepartment departmentId={cell.getValue()} />;
      },
    },
  ];
  // ! Accounts End

  // ! Buildings START
  const columnBuildings = [
    {
      accessorKey: "structure_id",
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
      accessorKey: "buildingName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Building Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return <span className="text-lg font-semibold">{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "campus.campusName",
      id: "campusName",
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
      cell: ({ cell }) => {
        return <span>{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date Created",
      cell: ({ cell }) => {
        return (
          <Badge variant={"outline"} className={"text-[0.8rem]"}>
            <relative-time datetime={cell.getValue()}>
              {new Date(cell.getValue()).toDateString()}
            </relative-time>
          </Badge>
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
      id: "actions",
      accessorFn: (row) =>
        `${row.structure_id} ${row.buildingName} ${row.campus.campusName} ${row.campus.campus_id} ${row.isActive}`,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <EditBuilding structureId={row.original.structure_id} />

            <Dialog>
              <DialogTrigger className="p-2 hover:text-primary">
                <DeleteIcon forActions={"Delete Building"} />
              </DialogTrigger>
              <DialogContent className="rounded-sm border border-stroke bg-white p-6 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    Delete Building
                  </DialogTitle>
                  <DialogDescription asChild className="mt-2">
                    <p className="mb-5">
                      Are you sure you want to delete this Building?
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <div className="mx-[2em] flex w-full justify-center gap-[6em]">
                    <ButtonAction
                      entityType={"buildingstructure"}
                      entityId={row.original.structure_id}
                      action="delete"
                      BuildingType={"building"}
                      onSuccess={() => {
                        fetchBuildings();
                        fetchBuildingsDeleted();
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
    {
      header: () => {
        return <span className="sr-only">Select Floor</span>;
      },
      id: "selectFloor",
      accessorFn: (row) =>
        `${row.structure_id} ${row.buildingName} ${row.campus.campusName} ${row.campus.campus_id} ${row.isActive}`,
      cell: ({ row }) => {
        return (
          <div
            className={`flex items-center gap-1 ${!row.original.isActive ? "cursor-not-allowed" : ""}`}
          >
            <Link
              to={
                user && user.campus_id
                  ? `/structure-management/buildings/${row.original.buildingName}/floors`
                  : `/structure-management/${row.original.campus.campus_id}/buildings/${row.original.buildingName}/floors`
              }
              className={`rounded p-3 text-sm font-medium text-white ${!row.original.isActive ? "pointer-events-none bg-blue-400 hover:no-underline" : "bg-primary hover:underline hover:underline-offset-2"}`}
            >
              Select Floor
            </Link>
          </div>
        );
      },
    },
  ];
  // ! Buildings END

  // ! Floors START
  const columnFloors = [
    {
      accessorKey: "structure_id",
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
      accessorKey: "floorName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Floor Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return <span className="text-lg font-semibold">{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "buildingName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Building Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return <span>{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "campus.campusName",
      id: "campusName",
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
      cell: ({ cell }) => {
        return <span>{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date Created",
      cell: ({ cell }) => {
        return (
          <Badge variant={"outline"} className={"text-[0.8rem]"}>
            <relative-time datetime={cell.getValue()}>
              {new Date(cell.getValue()).toDateString()}
            </relative-time>
          </Badge>
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
      id: "actions",
      accessorFn: (row) =>
        `${row.structure_id} ${row.buildingName} ${row.campus.campusName} ${row.campus.campus_id} ${row.isActive}`,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <EditFloor
              structureId={row.original.structure_id}
              campusId={row.original.campus.campus_id}
              buildingName={row.original.buildingName}
            />

            <Dialog>
              <DialogTrigger className="p-2 hover:text-primary">
                <DeleteIcon forActions={"Delete Floor"} />
              </DialogTrigger>
              <DialogContent className="rounded-sm border border-stroke bg-white p-6 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    Delete Floor
                  </DialogTitle>
                  <DialogDescription asChild className="mt-2">
                    <p className="mb-5">
                      Are you sure you want to delete this Floor?
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <div className="mx-[2em] flex w-full justify-center gap-[6em]">
                    <ButtonAction
                      entityType={"buildingstructure"}
                      entityId={row.original.structure_id}
                      action="delete"
                      BuildingType={"floor"}
                      onSuccess={() => {
                        fetchFloors(
                          row.original.buildingName,
                          row.original.campus.campus_id,
                        );
                        fetchFloorsDeleted(
                          row.original.buildingName,
                          row.original.campus.campus_id,
                        );
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
    {
      header: () => {
        return <span className="sr-only">Select Floor</span>;
      },
      id: "selectFloor",
      accessorFn: (row) =>
        `${row.structure_id} ${row.buildingName} ${row.floorName} ${row.campus.campusName} ${row.isActive}`,
      cell: ({ row }) => {
        return (
          <div
            className={`flex items-center gap-1 ${!row.original.isActive ? "cursor-not-allowed" : ""}`}
          >
            <Link
              to={
                user && user.campus_id
                  ? `/structure-management/buildings/${row.original.buildingName}/floors/${row.original.floorName}/rooms`
                  : `/structure-management/${row.original.campus.campus_id}/buildings/${row.original.buildingName}/floors/${row.original.floorName}/rooms`
              }
              className={`rounded p-3 text-sm font-medium text-white ${!row.original.isActive ? "pointer-events-none bg-blue-400 hover:no-underline" : "bg-primary hover:underline hover:underline-offset-2"}`}
            >
              Select Room
            </Link>
          </div>
        );
      },
    },
  ];
  // ! Fooors END

  // ! Rooms START
  const columnRoom = [
    {
      accessorKey: "structure_id",

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
        // `info.row.index` gives the zero-based index of the row
        return <span>{info.row.index + 1}</span>; // +1 to start numbering from 1
      },
    },
    {
      accessorKey: "roomName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Room
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return <span className="text-lg font-semibold">{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "floorName",
      header: "Floor",
    },
    {
      accessorKey: "campus.campusName",
      id: "campusName",
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
      accessorKey: "createdAt",
      header: "Date Created",
      cell: ({ cell }) => {
        return (
          <Badge variant={"outline"} className={"text-[0.8rem]"}>
            <relative-time datetime={cell.getValue()}>
              {new Date(cell.getValue()).toDateString()}
            </relative-time>
          </Badge>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Date Updated",
      cell: ({ cell }) => {
        return cell.getValue() ? (
          <Badge variant={"outline"} className={"text-[0.8rem]"}>
            <relative-time datetime={cell.getValue()}>
              {new Date(cell.getValue()).toDateString()}
            </relative-time>
          </Badge>
        ) : (
          <Badge variant={"outline"} className={"text-[0.8rem]"}>
            &quot;N/A&quot;
          </Badge>
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
      id: "actions",
      accessorFn: (row) =>
        `${row.structure_id} ${row.buildingName} ${row.floorName} ${row.roomName} ${row.campus.campusName} ${row.campus.campus_id} ${row.isActive}`,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <EditRoom
              structureId={row.original.structure_id}
              campusId={row.original.campus.campus_id}
              buildingName={row.original.buildingName}
              floorName={row.original.floorName}
            />

            <Dialog>
              <DialogTrigger className="p-2 hover:text-primary">
                <DeleteIcon forActions={"Delete Room"} />
              </DialogTrigger>
              <DialogContent className="rounded-sm border border-stroke bg-white p-6 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    Delete Room
                  </DialogTitle>
                  <DialogDescription asChild className="mt-2">
                    <p className="mb-5">
                      Are you sure you want to delete this Room?
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <div className="mx-[2em] flex w-full justify-center gap-[6em]">
                    <ButtonAction
                      entityType={"buildingstructure"}
                      entityId={row.original.structure_id}
                      action="delete"
                      BuildingType={"room"}
                      onSuccess={() => {
                        fetchRooms(
                          row.original.buildingName,
                          row.original.floorName,
                          row.original.campus.campus_id,
                        );
                        fetchRoomsDeleted(
                          row.original.buildingName,
                          row.original.floorName,
                          row.original.campus.campus_id,
                        );
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
  // ! Rooms END

  // ! Column Enrollment Application START
  const columnEnrollmentApplication = [
    {
      accessorKey: "applicant_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Applicant No.
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => {
        return <span className="font-semibold">{info.row.index + 1}</span>;
      },
    },
    {
      accessorFn: (row) => {
        const middleInitial =
          row.middle_name && row.middle_name.trim() !== ""
            ? `${row.middle_name.charAt(0)}.`
            : "";
        return `${row.first_name} ${middleInitial.toUpperCase()} ${row.last_name}`;
      },
      id: "fullName",
      header: "Name",
    },
    {
      accessorKey: "year_level",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Year Level
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return <span className="text-lg font-semibold">{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "contact_number",
      header: "Contact No.",
    },
    {
      accessorKey: "program",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Program
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return <span className="text-lg font-semibold">{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "campus",
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
      cell: ({ cell }) => {
        return <span className="text-lg font-semibold">{cell.getValue()}</span>;
      },
    },

    {
      accessorKey: "status",
      header: "Status",
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
    {
      header: "Actions",
      accessorFn: (row) => `${row.applicant_id} ${row.active}`,
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <EditCampus campusId={row.getValue("applicant_id")} />

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
                      entityId={row.getValue("applicant_id")}
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
  // ! Column Enrollment Application END

  return {
    columnCampus,
    columnSemester,
    columnDepartment,
    columnProgram,
    columnCourse,
    columnProgramCourse,
    columnViewProgramCourse,
    columnsAccount,
    columnBuildings,
    columnFloors,
    columnRoom,

    columnEnrollmentApplication,
  };
};

// Consistent export
export { useColumns };
