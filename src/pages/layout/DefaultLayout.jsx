/* eslint-disable react/prop-types */
import { useState } from "react";
// import Header from '../Header';
import Header from "../../components/Header";
// import Sidebar from '../Sidebar';
import Sidebar from "../../components/Sidebar";
import { Outlet } from "react-router-dom";
import useOpenMode from "../../hooks/useOpenMode";

const DefaultLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [SidebarOpened, setSidebarOpened] = useOpenMode();

  const handleSetSidebarOpened = () => {
    if (typeof setSidebarOpened === "function") {
      setSidebarOpened((prev) => (prev === "open" ? "close" : "open"));
    }
  };

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          handleSetSidebarOpened={handleSetSidebarOpened}
          SidebarOpened={SidebarOpened}
        />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main
            // className={`duration-300 ease-linear lg:relative ${SidebarOpened === "open" ? "lg:ml-[16em]" : "lg:ml-[5em]"}`}
            className={`duration-300 ease-linear lg:relative ${SidebarOpened === "open" ? "lg:ml-[16em]" : "lg:ml-[0]"}`}
          >
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <Outlet />
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default DefaultLayout;
