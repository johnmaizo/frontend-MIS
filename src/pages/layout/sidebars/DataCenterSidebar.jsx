/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import SidebarLinkGroup from "../../../components/Sidebar/SidebarLinkGroup";
import {
  CalendarIcon,
  CampusIcon,
  ProgramIcon,
  DepartmentIcon,
  TeacherIcon,
  CourseIcon,
  StudentIcon,
  AccountsIcon,
  DashboardIcon,
  BuildingStructureIcon,
  EnrollmentIcon,
} from "../../../components/Icons";

import { AuthContext } from "../../../components/context/AuthContext";
import { HasRole } from "../../../components/reuseable/HasRole";

const DataCenterSidebar = ({
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
          {HasRole(user.role, "SuperAdmin")
            ? "SUPER ADMIN MENU"
            : HasRole(user.role, "DataCenter")
              ? "DATA CENTER MENU"
              : "ADMIN MENU"}
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

          {(HasRole(user.role, "SuperAdmin") ||
            HasRole(user.role, "Admin") ||
            HasRole(user.role, "DataCenter")) && (
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
                        <ul className="mb-5.5 mt-4 flex flex-col gap-5 pl-6">
                          <li>
                            <NavLink
                              to="/enrollments/enrollment-application"
                              className={({ isActive }) =>
                                `group relative flex items-center gap-2.5 rounded-md px-4 font-medium underline-offset-4 duration-300 ease-in-out hover:underline dark:text-bodydark1 ${
                                  (pathname ===
                                    "/enrollments/enrollment-application" ||
                                    pathname.includes(
                                      "enrollment-application",
                                    )) &&
                                  "!underline "
                                }` +
                                (isActive && "text-primary dark:!text-white")
                              }
                            >
                              Employee List
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/employees/accounts"
                              className={({ isActive }) =>
                                `group relative flex items-center gap-2.5 rounded-md px-4 font-medium underline-offset-4 duration-300 ease-in-out hover:underline dark:text-bodydark1 ${
                                  (pathname === "/employees/accounts" ||
                                    pathname.includes("accounts")) &&
                                  "!underline "
                                }` +
                                (isActive && "text-primary dark:!text-white")
                              }
                            >
                              Account List
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
        </ul>
      </div>
    </>
  );
};

export default DataCenterSidebar;
