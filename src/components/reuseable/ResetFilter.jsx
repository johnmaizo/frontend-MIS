/* eslint-disable react/prop-types */
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";

/**
 * @function ResetFilter
 * @description A reusable component to reset the column filters for the given table.
 * @param {object} table - The table instance from @tanstack/react-table.
 * @param {string} className - The class name to be applied on the button.
 * @returns {ReactElement} - The ResetFilter component.
 */
const ResetFilter = ({ table, className }) => {
  const isFiltered = table?.getState().columnFilters.length > 0;

  return (
    <>
      {isFiltered && (
        <Button
          variant="destructive"
          onClick={() => table?.resetColumnFilters()}
          className={`h-8 px-2 hover:underline hover:underline-offset-2 lg:px-3 ${className}`}
        >
          Reset
          <Cross2Icon className="ml-2 h-4 w-4" />
        </Button>
      )}
    </>
  );
};

export default ResetFilter;
