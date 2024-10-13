import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { FacetedFilterEnrollment } from "./FacetedFilterEnrollment";
import { getUniqueCodes } from "./GetUniqueValues";
import { useSchool } from "../context/SchoolContext";

const useColumnsSecond = () => {
  const { prospectusSubjects } = useSchool();

  // ! Column View Subject Prospectus START
  const columnViewSubjectProspectus = [
    {
      accessorKey: "prospectus_subject_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            No.
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => {
        return <span className="font-semibold">{info.row.index + 1}</span>;
      },
    },
    {
      accessorKey: "yearLevel",
      header: ({ column }) => {
        return (
          <FacetedFilterEnrollment
            column={column}
            title="Year Level"
            options={getUniqueCodes(prospectusSubjects, "yearLevel")}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ cell }) => {
        return <span className="text-lg font-semibold">{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "semesterName",
      header: ({ column }) => {
        return (
          <FacetedFilterEnrollment
            column={column}
            title="Semester"
            options={getUniqueCodes(prospectusSubjects, "semesterName")}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ cell }) => {
        return <span className="">{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "courseCode",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline hover:underline-offset-4"
          >
            Subject Code
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => {
        return (
          <span className={"inline-block font-medium"}>{cell.getValue()}</span>
        );
      },
    },
    {
      accessorKey: "courseDescription",
      header: "Subject Description",
      cell: ({ cell }) => {
        return <span>{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "unit",
      header: "Unit",
      cell: ({ cell }) => {
        return <span>{cell.getValue()}</span>;
      },
    },
    {
      accessorKey: "prerequisites",
      header: "Pre-requisites",
      cell: ({ cell }) => {
        const value = cell.getValue();

        // Check if value is an array, then map it to display courseCodes as a styled bullet list
        if (Array.isArray(value)) {
          return (
            <ul
              style={{
                listStyleType: "disc",
                paddingLeft: "20px",
                color: "#333",
              }}
            >
              {value.map((item, index) => (
                <li
                  key={index}
                  style={{ marginBottom: "5px", fontWeight: "bold" }}
                >
                  {item.courseCode}
                </li>
              ))}
            </ul>
          );
        }

        // If not an array, just return the value as it is
        return <span>{value}</span>;
      },
    },
  ];
  // ! Column View Subject Prospectus END

  return {
    columnViewSubjectProspectus,
  };
};

export { useColumnsSecond };
