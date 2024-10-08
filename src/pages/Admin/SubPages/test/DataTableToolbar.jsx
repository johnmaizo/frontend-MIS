/* eslint-disable react/prop-types */
import { Cross2Icon } from "@radix-ui/react-icons";

import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";

export function DataTableToolbar({ table }) {
  const isFiltered = table?.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={table?.getColumn("courseCode")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table?.getColumn("courseCode")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table?.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
