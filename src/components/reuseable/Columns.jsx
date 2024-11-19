import { ArrowUpDown, PencilIcon } from "lucide-react";
import { useSchool } from "../context/SchoolContext";
import { Button } from "../ui/button";
import { useContext, useState } from "react";
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
import { DeleteIcon, EyeIcon } from "../Icons";
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
import {
  getUniqueCodes,
  getUniqueCodesEnrollment,
  getUniqueCodesForProgram,
  getUniqueCodesForSubject,
} from "./GetUniqueValues";
import RoleBadge from "./RoleBadge";
import { useEnrollment } from "../context/EnrollmentContext";
import { FacetedFilterEnrollment } from "./FacetedFilterEnrollment";
import { FacetedFilterSubjectDepartment } from "./FacetedFilterSubjectDepartment";
import EditEmployee from "../api/EditEmployee";
import EditClass from "../api/EditClass";
import EditProspectus from "../api/EditProspectus";

const useColumns = () => {
  const {
    semesters,
    departments,
    program,
    programActive,
    course,
    classes,
    programCourse,
    employees,
    prospectus,
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
    fetchClass,
  } = useSchool();

  const { applicants, officalEnrolled } = useEnrollment();

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
            No.
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
      accessorKey: "schoolYear",
      header: ({ column }) => {
        return (
          <FacetedFilterEnrollment
            column={column}
            title="School Year"
            options={getUniqueCodes(semesters, "schoolYear")}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ cell }) => {
        return <span className="font-semibold">{cell.getValue()}</span>;
      },
    },

    {
      accessorKey: "semesterName",
      header: ({ column }) => {
        return (
          <FacetedFilterEnrollment
            column={column}
            title="Semester"
            options={getUniqueCodes(semesters, "semesterName")}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ cell }) => {
        return cell.getValue();
      },
    },
    ...(user && HasRole(user.role, "SuperAdmin")
      ? [
          {
            accessorKey: "campusName",
            header: ({ column }) => {
              return (
                <FacetedFilterEnrollment
                  column={column}
                  title="Campus"
                  options={getUniqueCodes(semesters, "campusName")}
                />
              );
            },
            filterFn: (row, id, value) => {
              return value.includes(row.getValue(id));
            },
          },
        ]
      : []),
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
            {cell.getValue() ? "Open" : "Closed"}
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

            {/* 
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
            */}
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
      accessorKey: "campusName",
      header: ({ column }) => {
        return (
          <FacetedFilterEnrollment
            column={column}
            title="Campus"
            options={getUniqueCodes(departments, "campusName")}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
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
    },
    {
      accessorKey: "fullDepartmentNameWithCampus",
      header: ({ column }) => {
        return (
          <FacetedFilterEnrollment
            column={column}
            title="Department"
            options={getUniqueCodesForProgram(
              program,
              "fullDepartmentNameWithCampus",
            )}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      // program
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
    {
      accessorKey: "fullDepartmentNameWithCampus",
      header: ({ column }) => {
        return (
          <FacetedFilterSubjectDepartment
            column={column}
            title="Department"
            options={getUniqueCodesForSubject(
              course,
              "fullDepartmentNameWithCampus",
            )}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ cell }) => {
        // const getDeparmentName = cell.getValue().split(" - ")[1];

        return cell.getValue() ? (
          <TooltipProvider delayDuration={75}>
            <Tooltip>
              <TooltipTrigger
                asChild
                className="cursor-default hover:underline hover:underline-offset-2"
              >
                <span className="font-medium">
                  {cell.getValue()
                    ? cell.getValue().split(" - ")[0]
                    : "General Subject"}
                </span>
              </TooltipTrigger>
              <TooltipContent className="bg-white !shadow-default dark:border-strokedark dark:bg-[#1A222C]">
                <p className="text-[1rem]">
                  {cell.getValue()
                    ? cell.getValue().split(" - ")[1]
                    : "General Subject"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <p className="text-[1rem] font-[500]">
            {cell.getValue()
              ? cell.getValue().split(" - ")[1]
              : "General Subject"}
          </p>
        );
      },
    },
    ...(user && HasRole(user.role, "SuperAdmin")
      ? [
          {
            accessorKey: "campusName",
            header: ({ column }) => {
              return (
                <FacetedFilterEnrollment
                  column={column}
                  title="Campus"
                  options={getUniqueCodes(course, "campusName")}
                />
              );
            },
            filterFn: (row, id, value) => {
              return value.includes(row.getValue(id));
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
    {
      accessorKey: "fullDepartmentNameWithCampus",
      header: ({ column }) => {
        return (
          <FacetedFilterEnrollment
            column={column}
            title="Department"
            options={getUniqueCodesForProgram(
              programActive,
              "fullDepartmentNameWithCampus",
            )}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      // program
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
        `${row.program_id} ${row.programCode} ${row.department.campus.campus_id} ${row.department.campus.campusName} ${row.isActive}`,
      id: "select",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <Link
              to={`/subjects/program-subjects/campus/${row.original.department.campus.campus_id}/${row.original.department.campus.campusName}/program/${row.original.programCode}/${row.original.program_id}`}
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
    // {
    //   accessorKey: "program.programCode",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //         className="p-1 hover:underline hover:underline-offset-4"
    //       >
    //         Program Code
    //         <ArrowUpDown className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },
    //   cell: ({ cell }) => {
    //     return (
    //       <span className="inline-block w-full text-center text-lg font-semibold">
    //         {cell.getValue()}
    //       </span>
    //     );
    //   },
    // },
    {
      accessorKey: "fullDepartmentNameWithCampusForSubject",
      header: ({ column }) => {
        return (
          <FacetedFilterSubjectDepartment
            column={column}
            title="Department"
            options={getUniqueCodesForSubject(
              programCourse,
              "fullDepartmentNameWithCampusForSubject",
            )}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ cell }) => {
        // const getDeparmentName = cell.getValue().split(" - ")[1];

        return cell.getValue() ? (
          <TooltipProvider delayDuration={75}>
            <Tooltip>
              <TooltipTrigger
                asChild
                className="cursor-default hover:underline hover:underline-offset-2"
              >
                <span className="font-medium">
                  {cell.getValue()
                    ? cell.getValue().split(" - ")[0]
                    : "General Subject"}
                </span>
              </TooltipTrigger>
              <TooltipContent className="bg-white !shadow-default dark:border-strokedark dark:bg-[#1A222C]">
                <p className="text-[1rem]">
                  {cell.getValue()
                    ? cell.getValue().split(" - ")[1]
                    : "General Subject"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <p className="text-[1rem] font-[500]">
            {cell.getValue()
              ? cell.getValue().split(" - ")[1]
              : "General Subject"}
          </p>
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
      accessorKey: "fullName",
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
            cell: ({ cell }) => {
              return (
                <span className="font-semibold">
                  {cell.getValue() ? cell.getValue() : "N/A"}
                </span>
              );
            },
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

    /*

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
        return (
          <div className="flex items-center gap-1">
            <EditDepartment departmentId={cell.getValue()} />
            <EyeIcon title={"View Account"} />
          </div>
        );
      },
    },

    */
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
      accessorFn: (row) => `${row.firstName} ${row.middleName} ${row.lastName}`,
      cell: ({ row }) => {
        const middleInitial =
          row.original.middleName && row.original.middleName.trim() !== ""
            ? `${row.original.middleName.charAt(0)}.`
            : "";
        return (
          <span className="text-lg font-semibold">
            {row.original.lastName}, {row.original.firstName}{" "}
            {middleInitial.toUpperCase()}
          </span>
        );
      },
      id: "fullName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Applicant Name <br /> (Last, First Middle)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "programCode",
      header: ({ column }) => {
        return (
          <FacetedFilterEnrollment
            column={column}
            title="Program"
            options={getUniqueCodes(applicants, "programCode")}
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
      accessorKey: "yearLevel",
      header: ({ column }) => {
        return (
          <FacetedFilterEnrollment
            column={column}
            title="Year Level"
            options={getUniqueCodes(applicants, "yearLevel")}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ cell }) => {
        return <span className="font-medium">{cell.getValue()}</span>;
      },
    },
    // {
    //   accessorKey: "email",
    //   header: "Email",
    // },
    // {
    //   accessorKey: "contactNumber",
    //   header: "Contact No.",
    // },
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
      accessorKey: "enrollmentType",
      header: ({ column }) => {
        return (
          <FacetedFilterEnrollment
            column={column}
            title="Registry"
            options={getUniqueCodesEnrollment(applicants, "enrollmentType")}
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
              cell.getValue() === "online"
                ? "bg-success"
                : cell.getValue() === "regular" && "bg-green-800"
            }`}
          >
            {cell.getValue() === "online"
              ? "Online"
              : cell.getValue() === "regular" && "On-Site"}
          </span>
        );
      },
    },
    {
      accessorKey: "dateEnrolled",
      header: "Date Enrolled",
      cell: ({ cell }) => {
        return (
          <Badge
            variant={"outline"}
            className={"w-[8.1em] text-[0.8rem] font-medium"}
          >
            <relative-time datetime={cell.getValue()}>
              {new Date(cell.getValue()).toDateString()}
            </relative-time>
          </Badge>
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
            options={getUniqueCodesEnrollment(applicants, "status")}
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
    {
      header: "Actions",
      accessorFn: (row) => `${row.applicant_id} ${row.active}`,
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            {/* <EditCampus campusId={row.getValue("applicant_id")} /> */}
            <Link
              to={`/enrollments/enrollment-application/applicant/${row.original.applicant_id}`}
              className="inline-block p-2 hover:text-primary"
            >
              <title>View Details</title>
              <EyeIcon />
            </Link>
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

  // ! Column Officially Enrolled START
  const columnOfficiallyEnrolled = [
    {
      accessorKey: "student_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Student ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return (
          <span className="inline-block w-[9em] font-semibold">
            {cell.getValue()}
          </span>
        );
      },
      sortingFn: (rowA, rowB) => {
        // Split student_id by '-' to extract the third number part
        const idA = rowA.getValue("student_id").split("-")[1]; // e.g., '0001'
        const idB = rowB.getValue("student_id").split("-")[1]; // e.g., '0002'

        // Convert to numbers for proper numeric comparison
        return parseInt(idA, 10) - parseInt(idB, 10);
      },
    },

    {
      accessorFn: (row) => `${row.firstName} ${row.middleName} ${row.lastName}`,
      cell: ({ row }) => {
        const middleInitial =
          row.original.middleName && row.original.middleName.trim() !== ""
            ? `${row.original.middleName.charAt(0)}.`
            : "";
        return (
          <span className="text-lg font-semibold">
            {row.original.lastName}, {row.original.firstName}{" "}
            {middleInitial.toUpperCase()}
          </span>
        );
      },
      id: "fullName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Full Name <br /> (Last, First Middle)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "programCode",
      header: ({ column }) => {
        return (
          <FacetedFilterEnrollment
            column={column}
            title="Program"
            options={getUniqueCodes(officalEnrolled, "programCode")}
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
            options={getUniqueCodes(officalEnrolled, "yearLevel")}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ cell }) => {
        return <span className="font-semibold">{cell.getValue()}</span>;
      },
    },
    ...(user && HasRole(user.role, "SuperAdmin")
      ? [
          {
            accessorKey: "campusName",
            header: ({ column }) => {
              return (
                <FacetedFilterEnrollment
                  column={column}
                  title="Campus"
                  options={getUniqueCodes(officalEnrolled, "campusName")}
                />
              );
            },
            filterFn: (row, id, value) => {
              return value.includes(row.getValue(id));
            },
            cell: ({ cell }) => {
              return <span className="font-semibold">{cell.getValue()}</span>;
            },
          },
        ]
      : []),
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "createdAt",
      header: "Date Enrolled",
      cell: ({ cell }) => {
        return (
          <Badge
            variant={"outline"}
            className={
              "w-[8em] !rounded bg-primary text-[0.8rem] font-medium text-white"
            }
          >
            <relative-time datetime={cell.getValue()}>
              {new Date(cell.getValue()).toDateString()}
            </relative-time>
          </Badge>
        );
      },
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        const studentId = row.original.student_id;
        const campusId = row.original.campus_id; // Ensure campus_id is available in your data

        return (
          <div className="flex items-center gap-2">
            {/* View Student Details */}
            <Link to={`/all-students/view-student/${studentId}/${campusId}`}>
              <button className="text-blue-500 hover:text-blue-700">
                <EyeIcon className="h-5 w-5" />
              </button>
            </Link>

            {/* Update Student Information */}
            <Link to={`/all-students/update-student/${studentId}/${campusId}`}>
              <button className="text-green-500 hover:text-green-700">
                <PencilIcon className="h-5 w-5" />
              </button>
            </Link>
          </div>
        );
      },
    },
  ];
  // ! Column Officially Enrolled END

  // ! Employees START
  const columnsEmployee = [
    {
      accessorKey: "employee_id",

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
      accessorKey: "fullName",
      header: () => {
        return <span className="inline-block w-[10em]">Employee Name</span>;
      },
      cell: ({ cell }) => {
        return <span>{cell.getValue()}</span>;
      },
    },
    // {
    //   accessorFn: (row) => {
    //     const middleInitial =
    //       row.middleName && row.middleName.trim() !== ""
    //         ? `${row.middleName.charAt(0)}.`
    //         : "";
    //     return `${row.firstName} ${middleInitial.toUpperCase()} ${row.lastName}`;
    //   },
    //   id: "fullName",
    //   header: "Employee Name",
    // },
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
      accessorKey: "contactNumber",
      header: "Contact Number",
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "gender",
      header: "Gender",
    },
    {
      accessorKey: "departmentCodeForClass",
      header: ({ column }) => {
        return (
          <FacetedFilterEnrollment
            column={column}
            title="Department"
            options={getUniqueCodes(employees, "departmentCodeForClass")}
            forEmployee={true}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ cell }) => {
        return cell.getValue() ? (
          <span className="block font-semibold">{cell.getValue()}</span>
        ) : (
          <span className="sr-only block">None</span>
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
      accessorKey: "createdAt",
      header: "Date Created",
      cell: ({ cell }) => {
        return (
          <Badge
            variant={"outline"}
            className={"w-[8.1em] text-[0.8rem] font-medium"}
          >
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
      accessorFn: (row) => `${row.createdAt} ${row.updatedAt}`,
      cell: ({ row }) => {
        return row.original.updatedAt !== row.original.createdAt ? (
          <Badge variant={"outline"} className={"text-[0.8rem]"}>
            <relative-time datetime={row.original.updatedAt}>
              {new Date(row.original.updatedAt).toDateString()}
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
      header: "Actions",
      accessorFn: (row) => `${row.employee_id} ${row.isActive} ${row.role}`,
      id: "actions",
      cell: ({ row }) => {
        return (
          <div
            className={`${(HasRole(row.getValue("role"), "Admin") || HasRole(row.getValue("role"), "SuperAdmin")) && !(HasRole(user.allRoles, "Admin") || HasRole(user.allRoles, "SuperAdmin")) ? "hover:cursor-not-allowed" : ""}`}
          >
            <div
              className={`flex items-center gap-1 ${(HasRole(row.getValue("role"), "Admin") || HasRole(row.getValue("role"), "SuperAdmin")) && !(HasRole(user.allRoles, "Admin") || HasRole(user.allRoles, "SuperAdmin")) ? "pointer-events-none hover:cursor-not-allowed" : ""}`}
            >
              <EditEmployee employeeId={row.getValue("employee_id")} />
              {/* 
              <Dialog>
                <DialogTrigger className="p-2 hover:text-primary">
                  <DeleteIcon forActions={"Delete Employee"} />
                </DialogTrigger>
                <DialogContent className="rounded-sm border border-stroke bg-white p-6 !text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:!text-white">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                      Delete Employee
                    </DialogTitle>
                    <DialogDescription asChild className="mt-2">
                      <p className="mb-5">
                        Are you sure you want to delete this Employee?
                      </p>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <div className="mx-[2em] flex w-full justify-center gap-[6em]">
                      <ButtonAction
                        entityType={"department"}
                        entityId={row.getValue("employee_id")}
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
              */}
            </div>
          </div>
        );
      },
    },
  ];
  // ! Employees End

  // ! Column Class START
  const columnClass = [
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
      accessorKey: "subject_code",
      header: ({ column }) => {
        return (
          <FacetedFilterEnrollment
            column={column}
            title="Subject Code"
            options={getUniqueCodes(classes, "subject_code")}
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
      accessorKey: "subject",
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
      accessorKey: "fullDepartmentNameWithCampus",
      header: ({ column }) => {
        return (
          <FacetedFilterSubjectDepartment
            column={column}
            title="Department"
            options={getUniqueCodesForSubject(
              classes,
              "fullDepartmentNameWithCampus",
            )}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ cell }) => {
        // const getDeparmentName = cell.getValue().split(" - ")[1];

        return cell.getValue() ? (
          <TooltipProvider delayDuration={75}>
            <Tooltip>
              <TooltipTrigger
                asChild
                className="cursor-default hover:underline hover:underline-offset-2"
              >
                <span className="font-medium">
                  {cell.getValue()
                    ? cell.getValue().split(" - ")[0]
                    : "General Subject"}
                </span>
              </TooltipTrigger>
              <TooltipContent className="bg-white !shadow-default dark:border-strokedark dark:bg-[#1A222C]">
                <p className="text-[1rem]">
                  {cell.getValue()
                    ? cell.getValue().split(" - ")[1]
                    : "General Subject"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <p className="text-[1rem] font-[500]">
            {cell.getValue()
              ? cell.getValue().split(" - ")[1]
              : "General Subject"}
          </p>
        );
      },
    },
    {
      accessorKey: "room",
      header: ({ column }) => {
        return (
          <FacetedFilterEnrollment
            column={column}
            title="Room"
            options={getUniqueCodes(classes, "room")}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ cell }) => {
        return cell.getValue();
      },
    },
    {
      accessorKey: "schedule",
      header: ({ column }) => {
        return (
          <FacetedFilterEnrollment
            column={column}
            title="Schedule"
            options={getUniqueCodes(classes, "schedule")}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ cell }) => {
        return cell.getValue().toString();
      },
    },
    // {
    //   accessorKey: "totalStudents",
    //   header: ({ column }) => {
    //     return (
    //       <FacetedFilterEnrollment
    //         column={column}
    //         title="Students"
    //         options={getUniqueCodes(classes, "totalStudents")}
    //       />
    //     );
    //   },
    //   filterFn: (row, id, value) => {
    //     return value.includes(row.getValue(id));
    //   },
    //   cell: ({ cell }) => {
    //     return cell.getValue().toString();
    //   },
    // },
    {
      accessorKey: "totalStudents",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Students
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return cell.getValue();
      },
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        const students = row.original.students;

        return (
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-blue-500 hover:text-blue-700">
                <EyeIcon className="h-5 w-5" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Students Enrolled</DialogTitle>
              <DialogDescription>
                {students.length > 0 ? (
                  <table className="border-gray-200 min-w-full border bg-white">
                    <thead>
                      <tr>
                        <th className="border-gray-300 text-gray-700 border-b px-4 py-2 text-left font-medium">
                          Student ID
                        </th>
                        <th className="border-gray-300 text-gray-700 border-b px-4 py-2 text-left font-medium">
                          Full Name
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.student_id}>
                          <td className="border-gray-300 text-gray-600 border-b border-r px-4 py-2">
                            {student.student_id}
                          </td>
                          <td className="text-gray-600 border-b px-4 py-2">
                            {student.fullName}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No students enrolled in this class.</p>
                )}
              </DialogDescription>
            </DialogContent>
          </Dialog>
        );
      },
    },
  ];
  // ! Column Class END

  // ! Column Prospectus START
  const columnProspectus = [
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
    {
      accessorKey: "fullDepartmentNameWithCampus",
      header: ({ column }) => {
        return (
          <FacetedFilterEnrollment
            column={column}
            title="Department"
            options={getUniqueCodesForProgram(
              programActive,
              "fullDepartmentNameWithCampus",
            )}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      // program
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
      header: () => {
        return <span className="sr-only">Select Program</span>;
      },
      accessorFn: (row) =>
        `${row.program_id} ${row.programCode} ${row.department.campus.campus_id} ${row.department.campus.campusName} ${row.isActive}`,
      id: "select",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <Link
              to={`/subjects/prospectus-subjects/campus/${row.original.department.campus.campus_id}/${row.original.department.campus.campusName}/program/${row.original.programCode}/${row.original.program_id}`}
              className="w-[120.86px] rounded bg-primary p-3 text-sm font-medium text-white hover:underline hover:underline-offset-2"
            >
              Select Program
            </Link>
          </div>
        );
      },
    },
  ];
  // ! Column Prospectus END

  // ! Column View Specific Prospectus START
  const columnViewSpecificProspectus = [
    {
      accessorKey: "prospectus_id",
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
      accessorKey: "prospectusName",
      id: "prospectusName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Prospectus Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return <span className="text-lg font-semibold">{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "prospectusDescription",
      id: "prospectusDescription",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Prospectus Description
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return cell.getValue();
      },
    },
    {
      accessorKey: "fullDepartmentNameWithCampusForSubject",
      header: ({ column }) => {
        return (
          <FacetedFilterSubjectDepartment
            column={column}
            title="Department"
            options={getUniqueCodesForSubject(
              prospectus,
              "fullDepartmentNameWithCampusForSubject",
            )}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ cell }) => {
        // const getDeparmentName = cell.getValue().split(" - ")[1];

        return cell.getValue() ? (
          <TooltipProvider delayDuration={75}>
            <Tooltip>
              <TooltipTrigger
                asChild
                className="cursor-default hover:underline hover:underline-offset-2"
              >
                <span className="font-medium">
                  {cell.getValue()
                    ? cell.getValue().split(" - ")[0]
                    : "General Subject"}
                </span>
              </TooltipTrigger>
              <TooltipContent className="bg-white !shadow-default dark:border-strokedark dark:bg-[#1A222C]">
                <p className="text-[1rem]">
                  {cell.getValue()
                    ? cell.getValue().split(" - ")[1]
                    : "General Subject"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <p className="text-[1rem] font-[500]">
            {cell.getValue()
              ? cell.getValue().split(" - ")[1]
              : "General Subject"}
          </p>
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
      accessorFn: (row) => `${row.prospectus_id} ${row.isActive}`,
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <EditProspectus prospectusID={row.getValue("prospectus_id")} />

            {/* 
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
                    <ButtonAction
                      entityType={"course"}
                      entityId={row.getValue("prospectus_id")}
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
             */}
          </div>
        );
      },
    },

    {
      header: () => {
        return <span className="sr-only">Select Prospectus</span>;
      },
      id: "selectProspectus",
      accessorFn: (row) =>
        `${row.prospectus_id} ${row.campus_id} ${row.campusName} ${row.programCode}`,
      cell: ({ row }) => {
        return (
          <div className={`flex items-center gap-1`}>
            <Link
              to={`/subjects/prospectus-subjects/campus/${row.original.campus_id}/${row.original.campusName}/program/${row.original.programCode}/prospectus/${row.original.prospectus_id}`}
              className={`rounded bg-primary p-3 text-sm font-medium text-white hover:underline hover:underline-offset-2`}
            >
              Select Prospectus
            </Link>
          </div>
        );
      },
    },
  ];
  // ! Column View Specific Prospectus END

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
    columnOfficiallyEnrolled,

    columnsEmployee,

    columnClass,

    columnProspectus,
    columnViewSpecificProspectus,
  };
};

// Consistent export
export { useColumns };
