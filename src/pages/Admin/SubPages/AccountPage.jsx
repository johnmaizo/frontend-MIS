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
import AddAccount from "../../../components/api/AddAccount";
import ReuseTable from "../../../components/reuseable/ReuseTable";

import { BreadcrumbResponsive } from "../../../components/reuseable/Breadcrumbs";
import DefaultLayout from "../../layout/DefaultLayout";
import { useColumns } from "../../../components/reuseable/Columns";
import SearchInput from "../../../components/reuseable/SearchInput";
import ResetFilter from "../../../components/reuseable/ResetFilter";
import { AuthContext } from "../../../components/context/AuthContext";

const AccountPage = () => {
  const { user } = useContext(AuthContext);

  const NavItems = [
    { to: "/", label: "Dashboard" },
    // { to: "/accounts/add-account", label: "Add Account" },
    {
      label:
        user && user.campusName ? `Accounts (${user.campusName})` : "Accounts",
    },
  ];

  return (
    <DefaultLayout>
      <BreadcrumbResponsive
        pageName={
          user && user.campusName ? `Accounts (${user.campusName})` : "Accounts"
        }
        items={NavItems}
        ITEMS_TO_DISPLAY={2}
      />

      <AccountTables />
    </DefaultLayout>
  );
};

const AccountTables = () => {
  const { accounts, fetchAccounts, loading, error } = useSchool();

  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { columnsAccount } = useColumns();

  return (
    <>
      <DataTable
        columns={columnsAccount}
        data={accounts}
        loading={loading}
        error={error}
      />
    </>
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
        pageSize: 10,
      },
    },
  });

  return (
    <>
      <div className="mb-3 mt-2 w-full items-start justify-between md:flex">
        <div className="gap-5 md:flex">
          <SearchInput
            placeholder="Search by Role..."
            filterValue={table.getColumn("role")?.getFilterValue()}
            setFilterValue={(value) =>
              table.getColumn("role")?.setFilterValue(value)
            }
            className="md:max-w-[12em]"
          />

          <SearchInput
            placeholder="Search by Name..."
            filterValue={table.getColumn("fullName")?.getFilterValue()}
            setFilterValue={(value) =>
              table.getColumn("fullName")?.setFilterValue(value)
            }
            className="md:w-[17em]"
          />

          <SearchInput
            placeholder="Search by Email..."
            filterValue={table.getColumn("email")?.getFilterValue()}
            setFilterValue={(value) =>
              table.getColumn("email")?.setFilterValue(value)
            }
            className="md:w-[17em]"
          />

          <ResetFilter table={table} className={"h-[3.3em]"} />
        </div>

        <div className=" ">
          <AddAccount />
        </div>
      </div>

      <div className="my-5 rounded-sm border border-stroke bg-white p-4 px-6 shadow-default dark:border-strokedark dark:bg-boxdark">
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
            totalName={"Account"}
            rowsPerPage={10}
            table={table}
            totalDepartments={table.getFilteredRowModel().rows.length}
          />
        </div>
      </div>
    </>
  );
};

export default AccountPage;
