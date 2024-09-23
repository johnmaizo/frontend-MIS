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
                ACCOUNT SECTION
              </h3>

              <li>
                <NavLink
                  to="/accounts"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                    (pathname === "/accounts" ||
                      pathname.includes("accounts")) &&
                    "bg-gray text-primary underline underline-offset-4 dark:bg-meta-4"
                  }`}
                >
                  <AccountsIcon />
                  Accounts
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default DataCenterSidebar;
