/* eslint-disable react/prop-types */

import { useContext, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import AdminSidebar from "../../pages/layout/sidebars/AdminSidebar";
import { AuthContext } from "../context/AuthContext";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import BenedictoLogo from "../../assets/small-logo-transparent.png";
import BenedictoLogoLight from "../../assets/logo_light.png";
import StudentSidebar from "../../pages/layout/sidebars/StudentSidebar";
import { Button } from "../ui/button";
import { CalendarDays } from "lucide-react";
import { useMediaQuery } from "../../hooks/use-media-query";
import { ArrowIcon } from "../Icons";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { HasRole } from "../reuseable/HasRole";
import HiroHoverCard from "../Essentials/HiroHoverCard";
import EmployeeSidebar from "../../pages/layout/sidebars/EmployeeSidebar";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  handleToggleSidebar,
  SidebarOpened,
}) => {
  const { user } = useContext(AuthContext);

  const trigger = useRef(null);
  const sidebar = useRef(null);

  // const isDesktop = useMediaQuery("(min-width: 769px)");
  const isDesktop = useMediaQuery("(min-width: 880px)");

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true",
  );

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  // close on click outside
  useEffect(() => {
    if (!isDesktop) {
      const clickHandler = (event) => {
        const { target } = event;
        if (!sidebar.current || !trigger.current) return;
        if (
          !sidebarOpen ||
          sidebar.current.contains(target) ||
          trigger.current.contains(target)
        )
          return;
        setSidebarOpen(false);
      };

      document.addEventListener("click", clickHandler);
      return () => document.removeEventListener("click", clickHandler);
    }
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = (event) => {
      if (!sidebarOpen || event.key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <aside
      ref={sidebar}
      // className={`absolute left-0 top-0 z-9999 ${!isDesktop ? "!translate-x-[0%]" : "-translate-x-[70%]"} flex h-screen w-64 flex-col overflow-y-hidden bg-white !text-black lg:bg-transparent ${
      className={`absolute left-0 top-0 z-9999 ${!isDesktop && SidebarOpened === "open" ? "lg:!translate-x-[0%]" : ""} flex h-screen w-64 flex-col overflow-y-hidden !text-black lg:pointer-events-none lg:bg-transparent ${
        !isDesktop
          ? sidebarOpen
            ? "!translate-x-[0%] duration-300 ease-linear"
            : "-translate-x-full duration-300 ease-linear lg:-translate-x-[70%]"
          : isDesktop && "lg:-translate-x-[0%]"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div
        className={`flex items-center justify-between gap-2 bg-transparent bg-white px-6 py-5.5 shadow-2 ${!isDesktop && "dark:bg-boxdark"} lg:pointer-events-auto lg:bg-transparent`}
      >
        <NavLink to="/">
          {/* <img src={Logo} alt="Logo" /> */}
          <img src={BenedictoLogo} alt="Logo" width={127} />
          {/* <img src={BenedictoLogoLight} alt="Logo" width={127} /> */}
        </NavLink>

        <button
          ref={trigger}
          onClick={(e) => {
            e.stopPropagation();
            setSidebarOpen(!sidebarOpen);
            if (isDesktop) {
              handleToggleSidebar();
            }
          }}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block"
        >
          {isDesktop ? (
            <HamburgerMenuIcon
              width={30}
              height={30}
              className="rounded-md bg-[#E8EAF6] p-[0.3em] hover:bg-[#3949AB] hover:text-white dark:bg-boxdark dark:text-white dark:hover:bg-white dark:hover:text-black"
            />
          ) : (
            <ArrowIcon />
          )}
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div
        className={`no-scrollbar relative -z-10 flex h-screen flex-col overflow-y-auto bg-white dark:bg-boxdark lg:pointer-events-auto ${
          isDesktop &&
          (SidebarOpened === "open"
            ? "!left-[0] duration-300 ease-linear"
            : // : "left-[-11.5em] duration-300 ease-linear")
              "left-[-16em] duration-300 ease-linear")
        } `}
      >
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 px-4 py-4 pt-0 lg:px-6">
          {/* ! Mogamit rag sidebarExpanded/setSidebarExpanded if mogamit og SidebarLinkGroup nga component */}

          {(HasRole(user.allRoles, "SuperAdmin") ||
            HasRole(user.allRoles, "Admin")) && (
            <AdminSidebar
              sidebarExpanded={sidebarExpanded}
              setSidebarExpanded={setSidebarExpanded}
              // handleSetSidebarOpened={handleSetSidebarOpened}
              SidebarOpened={SidebarOpened}
            />
          )}

          {(HasRole(user.allRoles, "MIS") ||
            HasRole(user.allRoles, "DataCenter") ||
            HasRole(user.allRoles, "Registrar") ||
            HasRole(user.allRoles, "Dean") ||
            HasRole(user.allRoles, "Accounting")) && (
            <EmployeeSidebar
              sidebarExpanded={sidebarExpanded}
              setSidebarExpanded={setSidebarExpanded}
              // handleSetSidebarOpened={handleSetSidebarOpened}
              SidebarOpened={SidebarOpened}
            />
          )}

          {/* {user.role === "Student" && <StudentSidebar />} */}

          {/* <HiroHoverCard forSidebar /> */}
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
