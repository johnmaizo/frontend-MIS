// pages/ViewAccountDetailsPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import DefaultLayout from "../../layout/DefaultLayout";
import { BreadcrumbResponsive } from "../../../components/reuseable/Breadcrumbs";
import { HasRole } from "../../../components/reuseable/HasRole";
import { AuthContext } from "../../../components/context/AuthContext";

// Importing shadCN components
import { Card } from "../../../components/ui/Card";
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
    { to: "/enrollments/all-students", label: "All Students" },
    {
      label: "Student Details",
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
            ? `Student Details (${user?.campusName})`
            : "Student Details (All Campuses)"
        }
        items={NavItems}
        ITEMS_TO_DISPLAY={3}
      />

      <div className="mx-auto max-w-6xl p-4">
        {/* Loading State */}
        {loading && (
          <div className="flex h-screen items-center justify-center">
            <div className="text-xl">Loading...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex h-screen items-center justify-center">
            <div className="text-xl text-red-500">{error}</div>
          </div>
        )}

        {/* No Data State */}
        {!loading && !error && !accountData && (
          <div className="flex h-screen items-center justify-center">
            <div className="text-gray-500 text-xl">No data found.</div>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && accountData && (
          <>
            {/* Combined Account & Employee Information */}
            <Card className="mb-6">
              <h3 className="mb-4 text-2xl font-semibold">
                Account & Employee Information
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Account Information */}
                <div>
                  <p className="text-gray-500 text-sm">Email:</p>
                  <p className="text-lg font-medium">{accountData.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Verified:</p>
                  <p className="text-lg font-medium">
                    {accountData.isVerified ? (
                      <Badge variant="success">Verified</Badge>
                    ) : (
                      <Badge variant="danger">Not Verified</Badge>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Account Created:</p>
                  <p className="text-lg font-medium">
                    {new Date(accountData.created).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Last Updated:</p>
                  <p className="text-lg font-medium">
                    {new Date(accountData.updated).toLocaleString()}
                  </p>
                </div>

                {/* Employee Information */}
                <div>
                  <p className="text-gray-500 text-sm">Employee Name:</p>
                  <p className="text-lg font-medium">
                    {accountData.employee.firstName}{" "}
                    {accountData.employee.middleName}{" "}
                    {accountData.employee.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Role:</p>
                  <p className="text-lg font-medium">
                    {accountData.employee.role}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Campus:</p>
                  <p className="text-lg font-medium">
                    {accountData.employee.campus.campusName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Contact Number:</p>
                  <p className="text-lg font-medium">
                    {accountData.employee.contactNumber}
                  </p>
                </div>
                {/* Add more fields as necessary */}
              </div>
            </Card>

            {/* History Logging Tracker */}
            <Card>
              <h3 className="mb-4 text-2xl font-semibold">
                History Logging Tracker
              </h3>
              {accountData.histories.length === 0 ? (
                <p className="text-gray-500">No history logs available.</p>
              ) : (
                <Accordion type="multiple" collapsible className="w-full">
                  {Object.entries(groupedHistories)
                    .sort((a, b) => new Date(b[0]) - new Date(a[0])) // Sort by date descending
                    .map(([date, entities]) => (
                      <AccordionItem key={date} value={date}>
                        <AccordionTrigger className="flex w-full items-center justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                          <span>{date}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-500 px-4 pb-2 pt-4 text-sm">
                          {/* Nested Accordion for Entities */}
                          <Accordion
                            type="multiple"
                            collapsible
                            className="w-full"
                          >
                            {Object.entries(entities)
                              .sort((a, b) => a[0].localeCompare(b[0])) // Sort entities alphabetically
                              .map(([entity, histories]) => (
                                <AccordionItem key={entity} value={entity}>
                                  <AccordionTrigger className="text-gray-800 bg-gray-100 hover:bg-gray-200 focus-visible:ring-gray-500 flex w-full items-center justify-between rounded-lg px-4 py-2 text-left text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-opacity-75">
                                    <span>{entity}</span>
                                  </AccordionTrigger>
                                  <AccordionContent className="text-gray-600 px-4 pb-2 pt-4 text-sm">
                                    <div className="space-y-4">
                                      {histories
                                        .sort(
                                          (a, b) =>
                                            new Date(a.timestamp) -
                                            new Date(b.timestamp),
                                        ) // Sort actions chronologically within the entity
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
            </Card>
          </>
        )}
      </div>
    </DefaultLayout>
  );
};

export default ViewAccountDetailsPage;