import { BreadcrumbResponsive } from "../../../components/reuseable/Breadcrumbs";
import DefaultLayout from "../../layout/DefaultLayout";

/* eslint-disable react/prop-types */
import {
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { useContext, useEffect, useState } from "react";

import { DataTablePagination } from "../../../components/reuseable/DataTablePagination";

import { useSchool } from "../../../components/context/SchoolContext";

import ReuseTable from "../../../components/reuseable/ReuseTable";
import { AuthContext } from "../../../components/context/AuthContext";
import { useParams } from "react-router-dom";
import SmallLoader from "../../../components/styles/SmallLoader";
import { useColumns } from "../../../components/reuseable/Columns";
import { HasRole } from "../../../components/reuseable/HasRole";
import AddRoom from "../../../components/api/AddRoom";
import SearchInput from "../../../components/reuseable/SearchInput";
import PageNotFound from "../../PageNotFound";

const RoomPage = () => {
  const { user } = useContext(AuthContext);

  const { buildingName, floorName, campusId } = useParams();

  const NavItems = [
    { to: "/", label: "Dashboard" },
    { to: "/structure-management/buildings", label: "Select Building" },
    {
      to:
        user && HasRole(user.role, "SuperAdmin")
          ? `/structure-management/${campusId}/buildings/${buildingName}/floors`
          : `/structure-management/buildings/${buildingName}/floors`,
      label: "Select Floor",
    },
    {
      label:
        user && user.campusName
          ? `Rooms in ${floorName} (${user.campusName})`
          : `Rooms in ${floorName}`,
    },
  ];

  const { error } = useSchool();

  return (
    <DefaultLayout>
      {error ? (
        <PageNotFound />
      ) : (
        <>
          <BreadcrumbResponsive
            pageName={
              user && user.campusName
                ? `Rooms in ${floorName} (${user.campusName})`
                : `Rooms in ${floorName}`
            }
            items={NavItems}
            ITEMS_TO_DISPLAY={3}
          />

          <RoomTables />
        </>
      )}
    </DefaultLayout>
  );
};

const RoomTables = () => {
  const { buildingName, floorName, campusId } = useParams();

  const { rooms, fetchRooms, loadingBuildings, error } = useSchool();

  useEffect(() => {
    fetchRooms(buildingName, floorName, campusId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { columnRoom } = useColumns();

  return (
    <>
      <DataTable
        columns={columnRoom}
        data={rooms}
        loadingBuildings={loadingBuildings}
        error={error}
      />
    </>
  );
};

const DataTable = ({ data, columns, loadingBuildings, error }) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  const { buildingName, campusId, floorName } = useParams();

  return (
    <>
      <div className="mb-5 flex w-full items-center justify-between gap-3"></div>
      {loadingBuildings ? (
        <div className="my-5 rounded-sm border border-stroke bg-white p-4 px-6 dark:border-strokedark dark:bg-boxdark">
          <div className="grid h-[20em] w-full place-content-center">
            <p className="inline-flex items-center gap-4 text-[1.4rem] md:text-[2rem]">
              <SmallLoader width={8} height={8} />
              Loading Rooms...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="my-5 rounded-sm border border-stroke bg-white p-4 px-6 dark:border-strokedark dark:bg-boxdark">
          <div className="grid h-[20em] w-full place-content-center">
            <p className="text-[2rem] font-semibold text-red-700">
              Error: {error}
            </p>
          </div>
        </div>
      ) : (
        !loadingBuildings && (
          <>
            <div className="my-5 rounded-sm border border-stroke bg-white p-4 px-6 dark:border-strokedark dark:bg-boxdark">
              <div className="mb-5 mt-2 justify-between gap-5 md:flex">
                <div className="gap-5 md:flex">
                  <SearchInput
                    placeholder="Search by Room..."
                    filterValue={table.getColumn("roomName")?.getFilterValue()}
                    setFilterValue={(value) =>
                      table.getColumn("roomName")?.setFilterValue(value)
                    }
                    className="md:w-[12em]"
                  />

                  <SearchInput
                    placeholder="Search by Campus..."
                    filterValue={table
                      .getColumn("campusName")
                      ?.getFilterValue()}
                    setFilterValue={(value) =>
                      table.getColumn("campusName")?.setFilterValue(value)
                    }
                    className="md:w-[18em]"
                  />
                </div>
                <div>
                  <AddRoom
                    buildingName={buildingName}
                    floorName={floorName}
                    campusId={campusId}
                  />
                </div>
              </div>
              <div className="max-w-full overflow-x-auto">
                <ReuseTable
                  table={table}
                  columns={columns}
                  loadingBuildings={loadingBuildings}
                  error={error}
                />
              </div>

              <div className="flex w-full justify-start py-4 md:items-center md:justify-end">
                <DataTablePagination
                  rowsPerPage={20}
                  totalName={"Room"}
                  table={table}
                  totalDepartments={table.getFilteredRowModel().rows.length}
                />
              </div>
            </div>
          </>
        )
      )}
    </>
  );
};

export default RoomPage;
