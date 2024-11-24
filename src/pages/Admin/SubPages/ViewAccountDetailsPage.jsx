// pages/ViewAccountDetailsPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import DefaultLayout from "../../layout/DefaultLayout";
import { BreadcrumbResponsive } from "../../../components/reuseable/Breadcrumbs";
import { HasRole } from "../../../components/reuseable/HasRole";
import { AuthContext } from "../../../components/context/AuthContext";

// Importing shadCN components
import { Badge } from "../../../components/ui/badge";

// Importing Accordion components from shadCN
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";

// Importing TimelineItem component
import TimelineItem from "../../../components/ui/TimelineItem";

// Importing Skeleton for loading state
import { Skeleton } from "../../../components/ui/skeleton";

const ViewAccountDetailsPage = () => {
  const { accountID, accountCampusName } = useParams();
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch account data
    axios
      .get(`/accounts/get-history-log/${accountID}`, {
        params: { campusName: accountCampusName },
      })
      .then((response) => {
        setAccountData(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching account data:", error);
        setError("Failed to fetch account data.");
        setLoading(false);
      });
  }, [accountID, accountCampusName]);

  const { user } = useContext(AuthContext);

  const NavItems = [
    { to: "/", label: "Dashboard" },
    { to: "/employees/accounts", label: "Accounts" },
    {
      label: "Account Details",
    },
  ];

  // Helper function to group histories by date, then by entity
  const groupHistoriesByDateAndEntity = (histories) => {
    return histories.reduce((dateGroups, history) => {
      const date = new Date(history.timestamp).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!dateGroups[date]) {
        dateGroups[date] = {};
      }

      const entity = history.entity.toUpperCase(); // Ensure consistency

      if (!dateGroups[date][entity]) {
        dateGroups[date][entity] = [];
      }

      dateGroups[date][entity].push(history);

      return dateGroups;
    }, {});
  };

  // Memoize grouped histories to optimize performance
  const groupedHistories = useMemo(() => {
    if (!accountData?.histories) return {};
    return groupHistoriesByDateAndEntity(accountData.histories);
  }, [accountData]);

  return (
    <DefaultLayout>
      <BreadcrumbResponsive
        pageName={
          !HasRole(user.role, "SuperAdmin")
            ? `Account Details (${user?.campusName})`
            : "Account Details"
        }
        items={NavItems}
        ITEMS_TO_DISPLAY={3}
      />

      <div className="mx-auto max-w-6xl p-4">
        {/* Loading State */}
        {loading && (
          <div className="my-5 rounded-lg border border-stroke bg-white p-4 px-6 dark:border-strokedark dark:bg-boxdark">
            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="my-5 rounded-lg border border-stroke bg-white p-4 px-6 dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-screen items-center justify-center">
              <div className="text-xl text-red-500">{error}</div>
            </div>
          </div>
        )}

        {/* No Data State */}
        {!loading && !error && !accountData && (
          <div className="my-5 rounded-lg border border-stroke bg-white p-4 px-6 dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-screen items-center justify-center">
              <div className="text-gray-500 text-xl">No data found.</div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && accountData && (
          <>
            {/* Combined Account & Employee Information */}
            <div className="my-5 rounded-lg border border-stroke bg-white p-4 px-6 dark:border-strokedark dark:bg-boxdark">
              <h3 className="mb-4 text-2xl font-semibold">
                Account Information
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Account Information */}
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Email:
                  </p>
                  <p className="text-lg font-medium">{accountData.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Verified:
                  </p>
                  <p className="text-lg font-medium">
                    {accountData.isVerified ? (
                      <Badge
                        variant="success"
                        className={"!bg-green-500 !text-white"}
                      >
                        Verified
                      </Badge>
                    ) : (
                      <Badge
                        variant="danger"
                        className={"!bg-red-500 !text-white"}
                      >
                        Not Verified
                      </Badge>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Account Created:
                  </p>
                  <p className="text-lg font-medium">
                    {new Date(accountData.created).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Last Updated:
                  </p>
                  <p className="text-lg font-medium">
                    {new Date(accountData.updated).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Name:
                  </p>
                  <p className="text-lg font-medium">
                    {accountData.employee.firstName}{" "}
                    {accountData.employee.middleName}{" "}
                    {accountData.employee.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Role:
                  </p>
                  <p className="text-lg font-medium">
                    {accountData.employee.role}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Campus:
                  </p>
                  <p className="text-lg font-medium">
                    {accountData.employee.campus.campusName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Contact Number:
                  </p>
                  <p className="text-lg font-medium">
                    {accountData.employee.contactNumber}
                  </p>
                </div>
                {/* Add more fields as necessary */}
              </div>
            </div>

            {/* History Logging Tracker */}
            <div className="my-5 rounded-lg border border-stroke bg-white p-4 px-6 dark:border-strokedark dark:bg-boxdark">
              <h3 className="mb-4 text-2xl font-semibold">
                History Logging Tracker
              </h3>
              {accountData.histories.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  No history logs available.
                </p>
              ) : (
                <Accordion type="multiple" collapsible className="w-full">
                  {Object.entries(groupedHistories)
                    .sort((a, b) => new Date(b[0]) - new Date(a[0])) // Sort by date descending
                    .map(([date, entities]) => (
                      <AccordionItem key={date} value={date}>
                        <AccordionTrigger className="dark:bg-gray-700 dark:hover:bg-gray-600 flex w-full items-center justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 dark:text-blue-300">
                          <span>{date}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-500 dark:text-gray-400 px-4 pb-2 pt-4 text-sm">
                          {/* Nested Accordion for Entities */}
                          <Accordion
                            type="multiple"
                            collapsible
                            className="w-full"
                          >
                            {Object.entries(entities)
                              .sort((a, b) => a[0].localeCompare(b[0]))
                              .map(([entity, histories]) => (
                                <AccordionItem key={entity} value={entity}>
                                  <AccordionTrigger className="text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 focus-visible:ring-gray-500 flex w-full items-center justify-between rounded-lg px-4 py-2 text-left text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-opacity-75">
                                    <span>{entity}</span>
                                  </AccordionTrigger>
                                  <AccordionContent className="text-gray-600 dark:text-gray-300 px-4 pb-2 pt-4 text-sm">
                                    <div className="space-y-4">
                                      {histories
                                        .sort(
                                          (a, b) =>
                                            new Date(a.timestamp) -
                                            new Date(b.timestamp),
                                        )
                                        .map((history) => (
                                          <TimelineItem
                                            key={history.id}
                                            history={history}
                                          />
                                        ))}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                          </Accordion>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              )}
            </div>
          </>
        )}
      </div>
    </DefaultLayout>
  );
};

export default ViewAccountDetailsPage;
