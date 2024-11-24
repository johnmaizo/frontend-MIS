import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import ProfileUser from "../../assets/images/profile-user.jpg";
import ProfileVons from "../../assets/images/profile-vons.jpg";
import ProfileMaizo from "../../assets/images/profile-maizo.jpg";
import ProfileThomas from "../../assets/images/thomas.jfif";

import { AuthContext } from "../context/AuthContext";
import { HasRole } from "../reuseable/HasRole";
import { Badge } from "../ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import EditProfile from "../api/EditProfile";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  const { user, setIsLoggingOut } = useContext(AuthContext);

  const profileImage = useMemo(() => {
    return HasRole(user.role, "SuperAdmin")
      ? ProfileThomas
      : user.firstName === "Vonsleryl"
        ? ProfileVons
        : user.firstName === "John Robert"
          ? ProfileMaizo
          : ProfileUser;
  }, [user.role, user.firstName]); // This will recalculate only when user.role or user.firstName changes

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <>
      <div className="relative">
        <Link
          ref={trigger}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-4"
          to="#"
        >
          <span className="hidden text-right lg:block">
            <span className="block text-sm font-medium text-black dark:text-white">
              {user.fullName}
            </span>
            <div className="block text-xs">
              Role:{" "}
              {HasRole(user.role, "SuperAdmin") ? (
                <Badge className="!bg-red-600 !text-white hover:!bg-red-700">
                  Super Admin
                </Badge>
              ) : HasRole(user.role, "Admin") ? (
                <Badge className="!bg-blue-500 !text-white hover:!bg-blue-600">
                  Admin {user.campusName && `(${user.campusName})`}
                </Badge>
              ) : HasRole(user.role, "MIS") ? (
                <Badge className="!bg-emerald-700 !text-white hover:!bg-emerald-800">
                  MIS {user.campusName && `(${user.campusName})`}
                </Badge>
              ) : HasRole(user.role, "Accounting") ? (
                <Badge className="!bg-green-500 !text-white hover:!bg-green-600">
                  Accounting {user.campusName && `(${user.campusName})`}
                </Badge>
              ) : HasRole(user.role, "Registrar") ? (
                <Badge className="!bg-violet-800 !text-white hover:!bg-violet-900">
                  Registrar {user.campusName && `(${user.campusName})`}
                </Badge>
              ) : HasRole(user.role, "DataCenter") ? (
                <Badge className="!bg-orange-500 !text-white hover:!bg-orange-600">
                  Data Center {user.campusName && `(${user.campusName})`}
                </Badge>
              ) : HasRole(user.role, "Dean") ? (
                <Badge className="!bg-cyan-700 !text-white hover:!bg-cyan-800">
                  Dean {user.campusName && `(${user.campusName})`}
                </Badge>
              ) : (
                <span className="ml-1 font-semibold">
                  {HasRole(user.role, "SuperAdmin") ||
                  HasRole(user.role, "Admin")
                    ? ""
                    : user.role}
                  {user.campusName && `(${user.campusName})`}
                </span>
              )}
            </div>
          </span>

          <Avatar className="!aspect-square !h-[3em] !w-[3em]">
            <AvatarImage
              draggable={false}
              src={profileImage}
              alt="User"
              className=""
            />
            <AvatarFallback>
              {user.firstName[0]}
              {user.firstName.split(" ")[1]
                ? user.firstName.split(" ")[1][0]
                : user.middleName && user.middleName[0]}
              {user.lastName[0]}
            </AvatarFallback>
          </Avatar>

          <svg
            className="hidden fill-current sm:block"
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
              fill=""
            />
          </svg>
        </Link>

        {/* <!-- Dropdown Start --> */}
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
          className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
            dropdownOpen === true ? "block" : "hidden"
          }`}
        >
          <ul className="flex flex-col gap-5 border-b border-stroke px-7 py-4 dark:border-strokedark">
            <span className="block text-center text-sm font-medium text-black dark:text-white lg:hidden">
              {user.fullName}
              <div className="block text-xs">
                <span className="hidden md:mt-1 md:block">Role: </span>
                <div className="mt-3 md:mt-0">
                  {HasRole(user.role, "SuperAdmin") ? (
                    <Badge className="!bg-red-600 !text-white hover:!bg-red-700">
                      Super Admin
                    </Badge>
                  ) : HasRole(user.role, "Admin") ? (
                    <Badge className="!bg-blue-500 !text-white hover:!bg-blue-600">
                      Admin {user.campusName && `(${user.campusName})`}
                    </Badge>
                  ) : HasRole(user.role, "MIS") ? (
                    <Badge className="!bg-emerald-700 !text-white hover:!bg-emerald-800">
                      MIS {user.campusName && `(${user.campusName})`}
                    </Badge>
                  ) : HasRole(user.role, "Accounting") ? (
                    <Badge className="!bg-green-500 !text-white hover:!bg-green-600">
                      Accounting {user.campusName && `(${user.campusName})`}
                    </Badge>
                  ) : HasRole(user.role, "Registrar") ? (
                    <Badge className="!bg-violet-800 !text-white hover:!bg-violet-900">
                      Registrar {user.campusName && `(${user.campusName})`}
                    </Badge>
                  ) : HasRole(user.role, "DataCenter") ? (
                    <Badge className="!bg-orange-500 !text-white hover:!bg-orange-600">
                      Data Center {user.campusName && `(${user.campusName})`}
                    </Badge>
                  ) : HasRole(user.role, "Dean") ? (
                    <Badge className="!bg-cyan-700 !text-white hover:!bg-cyan-800">
                      Dean {user.campusName && `(${user.campusName})`}
                    </Badge>
                  ) : (
                    <span className="ml-1 font-semibold">
                      {HasRole(user.role, "SuperAdmin") ||
                      HasRole(user.role, "Admin")
                        ? ""
                        : user.role}
                      {user.campusName && `(${user.campusName})`}
                    </span>
                  )}
                </div>
              </div>
            </span>

            {/* vv Settings vv */}
            
            
            <li>
              {/* <Link
                to="/pages/settings"
                className="pointer-events-none flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <Settings
                Account Settings
              </Link> */}
              <EditProfile accountID={user.id} />
            </li>
          
           
          </ul>
          <button
            className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
            onClick={() => setIsLoggingOut(true)}
          >
            <svg
              className="fill-current"
              width="22"
              height="22"
              viewBox="0 0 18 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_130_9814)">
                <path
                  d="M12.7127 0.55835H9.53457C8.80332 0.55835 8.18457 1.1771 8.18457 1.90835V3.84897C8.18457 4.18647 8.46582 4.46772 8.80332 4.46772C9.14082 4.46772 9.45019 4.18647 9.45019 3.84897V1.88022C9.45019 1.82397 9.47832 1.79585 9.53457 1.79585H12.7127C13.3877 1.79585 13.9221 2.33022 13.9221 3.00522V15.0709C13.9221 15.7459 13.3877 16.2802 12.7127 16.2802H9.53457C9.47832 16.2802 9.45019 16.2521 9.45019 16.1959V14.2552C9.45019 13.9177 9.16894 13.6365 8.80332 13.6365C8.43769 13.6365 8.18457 13.9177 8.18457 14.2552V16.1959C8.18457 16.9271 8.80332 17.5459 9.53457 17.5459H12.7127C14.0908 17.5459 15.1877 16.4209 15.1877 15.0709V3.03335C15.1877 1.65522 14.0627 0.55835 12.7127 0.55835Z"
                  fill=""
                />
                <path
                  d="M10.4346 8.60205L7.62207 5.7333C7.36895 5.48018 6.97519 5.48018 6.72207 5.7333C6.46895 5.98643 6.46895 6.38018 6.72207 6.6333L8.46582 8.40518H3.45957C3.12207 8.40518 2.84082 8.68643 2.84082 9.02393C2.84082 9.36143 3.12207 9.64268 3.45957 9.64268H8.49395L6.72207 11.4427C6.46895 11.6958 6.46895 12.0896 6.72207 12.3427C6.83457 12.4552 7.00332 12.5114 7.17207 12.5114C7.34082 12.5114 7.50957 12.4552 7.62207 12.3145L10.4346 9.4458C10.6877 9.24893 10.6877 8.85518 10.4346 8.60205Z"
                  fill=""
                />
              </g>
              <defs>
                <clipPath id="clip0_130_9814">
                  <rect
                    width="18"
                    height="18"
                    fill="white"
                    transform="translate(0 0.052124)"
                  />
                </clipPath>
              </defs>
            </svg>
            Log Out
          </button>
        </div>
        {/* <!-- Dropdown End --> */}
      </div>
    </>
  );
};

export default DropdownUser;
