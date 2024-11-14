/* eslint-disable react-hooks/exhaustive-deps */
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

// import { useContext, useEffect, useState } from "react";
import { useEffect, useState } from "react";

import { Input } from "../../../components/ui/input";

import { DataTablePagination } from "../../../components/reuseable/DataTablePagination";

import { useSchool } from "../../../components/context/SchoolContext";

import ReuseTable from "../../../components/reuseable/ReuseTable";
// import { AuthContext } from "../../../components/context/AuthContext";
import { useParams } from "react-router-dom";
import StatusFilter from "../../../components/reuseable/StatusFilter";
import { useColumnsSecond } from "../../../components/reuseable/ColumnsSecond";
import PageNotFound from "../../PageNotFound";
import ProspectusDialog from "../../../components/reuseable/ProspectusDialog";
import AddProspectusSubject from "../../../components/api/AddProspectusSubject";
import ResetFilter from "../../../components/reuseable/ResetFilter";

const ViewProspectusSubjectPage = () => {
  // const { user } = useContext(AuthContext);
  const { prospectusProgramCode } = useParams();

  const NavItems = [
    { to: "/", label: "Dashboard" },
    {
      to: "/subjects/subject-list",
      label: "Subject List",
    },
    {
      to: "/subjects/prospectus",
      label: "Assign Prospectus to Program",
    },
    {
      label: `Prospectus Subjects for (${prospectusProgramCode})`,
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
            pageName={`Prospectus Subjects for (${prospectusProgramCode})`}
            items={NavItems}
            ITEMS_TO_DISPLAY={3}
          />
          <ProgramCourseTables />
        </>
      )}
    </DefaultLayout>
  );
};

const ProgramCourseTables = () => {
  const {
    prospectusCampusId,
    prospectusCampusName,
    prospectusProgramCode,
    prospectus_id,
  } = useParams();

  const {
    prospectusSubjects,
    fetchProspectusSubjects,
    loadingProspectusSubjects,
    error,
  } = useSchool();

  useEffect(() => {
    fetchProspectusSubjects(
      prospectusCampusId,
      prospectusCampusName,
      prospectusProgramCode,
      prospectus_id,
    );
  }, [
    prospectusCampusId,
    prospectusCampusName,
    prospectus_id,
    prospectusProgramCode,
  ]);

  const { columnViewSubjectProspectus } = useColumnsSecond();

  return (
    <DataTable
      columns={columnViewSubjectProspectus}
      data={prospectusSubjects}
      loading={loadingProspectusSubjects}
      error={error}
    />
  );
};

const DataTable = ({ data, columns, loading, error }) => {
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
        pageSize: 50,
      },
    },
  });

  return (
    <>
      <div className="mb-3 mt-2 w-full items-start justify-between md:flex">
        <div className="gap-5 md:flex">
          <Input
            placeholder="Search by Subject Code..."
            value={table.getColumn("courseCode")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("courseCode")?.setFilterValue(event.target.value)
            }
            className="mb-5 h-[3.3em] w-full !rounded !border-[1.5px] !border-stroke bg-white !px-5 !py-3 text-[1rem] font-medium text-black !outline-none !transition focus:!border-primary active:!border-primary disabled:cursor-default disabled:!bg-whiter dark:!border-form-strokedark dark:!bg-form-input dark:!text-white dark:focus:!border-primary md:mb-0 md:w-[17em]"
          />

          <Input
            placeholder="Search by Subject Description..."
            value={table.getColumn("courseDescription")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table
                .getColumn("courseDescription")
                ?.setFilterValue(event.target.value)
            }
            className="mb-5 h-[3.3em] w-full !rounded !border-[1.5px] !border-stroke bg-white !px-5 !py-3 text-[1rem] font-medium text-black !outline-none !transition focus:!border-primary active:!border-primary disabled:cursor-default disabled:!bg-whiter dark:!border-form-strokedark dark:!bg-form-input dark:!text-white dark:focus:!border-primary md:mb-0 md:w-[19em]"
          />

          <ResetFilter table={table} className={"mb-5 h-[3.3em] md:mb-0"} />
        </div>

        <div className=" ">
          {/* <AddProspectus /> */}
          <AddProspectusSubject />
        </div>
      </div>

      <div className="my-5 rounded-sm border border-stroke bg-white p-4 px-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="mb-5 flex w-full items-center justify-between gap-3">
          {/* <div className="w-[11.5em]">
            <StatusFilter table={table} option={"campus"} />
          </div> */}

          <div className="w-[11.5em]">
            {/* <StatusFilter table={table} option={"prospectus"} /> */}
            <ProspectusDialog />
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <ReuseTable
            table={table}
            columns={columns}
            loading={loading}
            error={error}
          />
        </div>

        <div className="flex w-full justify-start py-4 md:items-center md:justify-end">
          <DataTablePagination
            rowsPerPage={50}
            totalName={"Subject"}
            table={table}
            totalDepartments={table.getFilteredRowModel().rows.length}
          />
        </div>
      </div>
    </>
  );
};

export default ViewProspectusSubjectPage;
