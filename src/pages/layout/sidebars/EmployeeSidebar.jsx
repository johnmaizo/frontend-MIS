/* eslint-disable react/prop-types */
import React, { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";

import SidebarLinkGroup from "../../../components/Sidebar/SidebarLinkGroup";
import {
  CalendarIcon,
  CampusIcon,
  ProgramIcon,
  DepartmentIcon,
  CourseIcon,
  AccountsIcon,
  DashboardIcon,
  BuildingStructureIcon,
  EnrollmentIcon,
  ClassIcon,
} from "../../../components/Icons";

import { AuthContext } from "../../../components/context/AuthContext";
import { HasRole } from "../../../components/reuseable/HasRole";
import { ArrowRightIcon, MonitorCheck } from "lucide-react";
import { PersonIcon } from "@radix-ui/react-icons";

const EmployeeSidebar = ({
  sidebarExpanded,
  setSidebarExpanded,
  handleSetSidebarOpened,
  SidebarOpened,
}) => {
  const { user } = useContext(AuthContext);

  const location = useLocation();
  const { pathname } = location;

  return (
    <>
      {/* <!-- Menu Group --> */}
      <div>
        <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
          {HasRole(user.role, "MIS")
            ? "MIS MENU"
            : HasRole(user.role, "Registrar")
              ? "REGISTRAR MENU"
              : HasRole(user.role, "DataCenter")
                ? "DATA CENTER MENU"
                : HasRole(user.role, "Accounting")
                  ? "ACCOUNTING MENU"
                  : HasRole(user.role, "Dean") && "DEAN MENU"}
        </h3>

        <ul className="mb-6 flex flex-col gap-1.5">
          {/* Dashboard */}
          <li>
            <NavLink
              to="/"
              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                (pathname === "/" || pathname.includes("dashboard")) &&
                "bg-gray text-primary underline underline-offset-4 dark:bg-meta-4"
              } `}
            >
              <DashboardIcon />
              Dashboard
            </NavLink>
          </li>

          {(HasRole(user.allRoles, "DataCenter") ||
            HasRole(user.allRoles, "MIS")) && (
            <>
              <h3 className="my-2 ml-4 mt-6 text-sm font-semibold text-bodydark2">
                EMPLOYEE SECTION
              </h3>

              <SidebarLinkGroup
                activeCondition={
                  pathname === "/employees" || pathname.includes("employees")
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="/employees/"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                          (pathname === "/employees" ||
                            pathname.includes("employees")) &&
                          "bg-gray text-primary dark:bg-meta-4"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <AccountsIcon />
                        Employees
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                            open && "rotate-180"
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && "hidden"
                        }`}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-3">
                          {HasRole(user.allRoles, "MIS") && (
                            <li>
                              <NavLink
                                to="/employees"
                                className={({ isActive }) =>
                                  `group relative flex items-center gap-1 rounded-md px-4 font-medium underline-offset-4 duration-300 ease-in-out hover:underline dark:text-bodydark1 ${
                                    pathname === "/employees" && "!underline "
                                  }` +
                                  (isActive && "text-primary dark:!text-white")
                                }
                              >
                                <ArrowRightIcon className="h-4 w-4 flex-none" />
                                Employee List
                              </NavLink>
                            </li>
                          )}

                          {HasRole(user.allRoles, "DataCenter") && (
                            <li>
                              <NavLink
                                to="/employees/accounts"
                                className={({ isActive }) =>
                                  `group relative flex items-center gap-1 rounded-md px-4 font-medium underline-offset-4 duration-300 ease-in-out hover:underline dark:text-bodydark1 ${
                                    (pathname === "/employees/accounts" ||
                                      pathname.includes(
                                        "/employees/accounts",
                                      )) &&
                                    "!underline "
                                  }` +
                                  (isActive && "text-primary dark:!text-white")
                                }
                              >
                                <ArrowRightIcon className="h-4 w-4 flex-none" />
                                Account List
                              </NavLink>
                            </li>
                          )}
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
            </>
          )}

          {HasRole(user.allRoles, "MIS") && (
            <>
              <h3 className="my-2 ml-4 mt-6 text-sm font-semibold text-bodydark2">
                MIS SECTION
              </h3>
              {HasRole(user.allRoles, "SuperAdmin") && (
                <li>
                  <NavLink
                    to="/campus"
                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                      (pathname === "/campus" || pathname.includes("campus")) &&
                      "bg-gray text-primary underline underline-offset-4 dark:bg-meta-4"
                    }`}
                  >
                    <CampusIcon />
                    Campus
                  </NavLink>
                </li>
              )}

              <li>
                <NavLink
                  to="/semester"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                    (pathname === "/semester" ||
                      pathname.includes("semester")) &&
                    "bg-gray text-primary underline underline-offset-4 dark:bg-meta-4"
                  }`}
                >
                  <CalendarIcon />
                  Semester
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/structure-management/buildings"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                    (pathname === "/structure-management/" ||
                      pathname.includes("structure-management/")) &&
                    "bg-gray text-primary underline underline-offset-4 dark:bg-meta-4"
                  }`}
                >
                  <BuildingStructureIcon />
                  Structure Management
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/departments"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                    (pathname === "/departments" ||
                      pathname.includes("departments")) &&
                    "bg-gray text-primary underline underline-offset-4 dark:bg-meta-4"
                  }`}
                >
                  <DepartmentIcon />
                  Departments
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/programs"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                    (pathname === "/programs" ||
                      pathname.includes("programs")) &&
                    "bg-gray text-primary underline underline-offset-4 dark:bg-meta-4"
                  }`}
                >
                  <ProgramIcon />
                  Programs
                </NavLink>
              </li>

              {/* <!-- Menu Item Course --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === "/subject" || pathname.includes("subject")
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="/subjects/subject-list"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                          (pathname === "/subjects" ||
                            pathname.includes("subjects")) &&
                          "bg-gray text-primary dark:bg-meta-4"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <CourseIcon />
                        Subjects
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                            open && "rotate-180"
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && "hidden"
                        }`}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-3">
                          <li>
                            <NavLink
                              to="/subjects/subject-list"
                              className={({ isActive }) =>
                                `group relative flex items-center gap-1 rounded-md px-4 font-medium underline-offset-4 duration-300 ease-in-out hover:underline dark:text-bodydark1 ${
                                  (pathname === "/subjects/subject-list" ||
                                    pathname.includes("subject-list")) &&
                                  "!underline "
                                }` +
                                (isActive && "text-primary dark:!text-white")
                              }
                            >
                              <ArrowRightIcon className="h-4 w-4 flex-none" />
                              Subject List
                            </NavLink>
                          </li>
                          {/* <li>
                            <NavLink
                              to="/subjects/program-subjects"
                              className={({ isActive }) =>
                                `group relative flex items-center gap-1 rounded-md px-4 font-medium underline-offset-4 duration-300 ease-in-out hover:underline dark:text-bodydark1 ${
                                  (pathname === "/subjects/program-subjects" ||
                                    pathname.includes("program-subjects")) &&
                                  "!underline "
                                }` +
                                (isActive && "text-primary dark:!text-white")
                              }
                            >
                              <ArrowRightIcon className="h-4 w-4 flex-none" />
                              Program Subjects
                            </NavLink>
                          </li> */}
                          <li>
                            <NavLink
                              to="/subjects/prospectus"
                              className={({ isActive }) =>
                                `group relative flex items-center gap-1 rounded-md px-4 font-medium underline-offset-4 duration-300 ease-in-out hover:underline dark:text-bodydark1 ${
                                  (pathname === "/subjects/prospectus" ||
                                    pathname.includes("prospectus")) &&
                                  "!underline "
                                }` +
                                (isActive && "text-primary dark:!text-white")
                              }
                            >
                              <ArrowRightIcon className="h-4 w-4 flex-none" />
                              Prospectus
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
            </>
          )}

          {HasRole(user.allRoles, "Registrar") && (
            <>
              <h3 className="my-2 ml-4 mt-6 text-sm font-semibold text-bodydark2">
                REGISTRAR SECTION
              </h3>

              <li>
                <NavLink
                  to="/all-students"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                    (pathname === "/all-students" ||
                      pathname.includes("all-students")) &&
                    "bg-gray text-primary underline underline-offset-4 dark:bg-meta-4"
                  }`}
                >
                  <PersonIcon className="inline-block h-5 w-5 font-medium" />
                  Students
                </NavLink>
              </li>

              <SidebarLinkGroup
                activeCondition={
                  pathname === "/enrollments" ||
                  pathname.includes("enrollments")
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="/enrollments/"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                          (pathname === "/enrollments" ||
                            pathname.includes("enrollments")) &&
                          "bg-gray text-primary dark:bg-meta-4"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <EnrollmentIcon />
                        Enrollment
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                            open && "rotate-180"
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && "hidden"
                        }`}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-3.5 pl-3">
                          <li>
                            <NavLink
                              to="/enrollments/online-applicants"
                              className={({ isActive }) =>
                                `group relative flex items-center gap-1 rounded-md px-4 font-medium underline-offset-4 duration-300 ease-in-out hover:underline dark:text-bodydark1 ${
                                  (pathname ===
                                    "/enrollments/online-applicants" ||
                                    pathname.includes("online-applicants")) &&
                                  "!underline "
                                }` +
                                (isActive && "text-primary dark:!text-white")
                              }
                            >
                              <ArrowRightIcon className="h-4 w-4 flex-none" />
                              Pending Enrollment Applicants
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/enrollments/enroll-student"
                              className={({ isActive }) =>
                                `group relative flex items-center gap-1 rounded-md px-4 font-medium underline-offset-4 duration-300 ease-in-out hover:underline dark:text-bodydark1 ${
                                  (pathname === "/enrollments/enroll-student" ||
                                    pathname.includes("enroll-student")) &&
                                  "!underline "
                                }` +
                                (isActive && "text-primary dark:!text-white")
                              }
                            >
                              <ArrowRightIcon className="h-4 w-4 flex-none" />
                              New Enrollment
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/enrollments/unenrolled-registrations"
                              className={({ isActive }) =>
                                `group relative flex items-center gap-1 rounded-md px-4 font-medium underline-offset-4 duration-300 ease-in-out hover:underline dark:text-bodydark1 ${
                                  (pathname ===
                                    "/enrollments/unenrolled-registrations" ||
                                    pathname.includes(
                                      "unenrolled-registrations",
                                    )) &&
                                  "!underline "
                                }` +
                                (isActive && "text-primary dark:!text-white")
                              }
                            >
                              <ArrowRightIcon className="h-4 w-4 flex-none" />
                              Unenrolled Registration
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              <li>
                <NavLink
                  to="/class-list"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                    (pathname === "/class-list" ||
                      pathname.includes("class-list")) &&
                    "bg-gray text-primary underline underline-offset-4 dark:bg-meta-4"
                  }`}
                >
                  <ClassIcon />
                  Class List
                </NavLink>
              </li>
            </>
          )}

          {HasRole(user.allRoles, "Accounting") && (
            <>
              <h3 className="my-2 ml-4 mt-6 text-sm font-semibold text-bodydark2">
                ACCOUNTING SECTION
              </h3>

              <li>
                <NavLink
                  to="/payment-approvals"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                    (pathname === "/payment-approvals" ||
                      pathname.includes("payment-approvals")) &&
                    "bg-gray text-primary underline underline-offset-4 dark:bg-meta-4"
                  }`}
                >
                  <MonitorCheck width={17} height={17} />
                  Payment Approvals
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default EmployeeSidebar;
