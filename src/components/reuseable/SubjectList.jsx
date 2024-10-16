// Updated SubjectList.jsx
/* eslint-disable react/prop-types */

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";

import { Check } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { useState } from "react";

const SubjectList = ({
  handleSelect,
  value,
  data,
  searchPlaceholder,
  clearErrors,
  entity,
  handleClearAll,
  selectedItems,
  showUnits = false, // Added showUnits prop with default value
}) => {
  // State to track whether all subjects are selected
  const [allSelected, setAllSelected] = useState(false);

  // Filter data into two categories: isDepartmentIdNull and others
  const generalSubjects = data.filter((item) => item.isDepartmentIdNull);
  const otherSubjects = data.filter((item) => !item.isDepartmentIdNull);

  // Function to handle "Select All" or "Unselect All"
  const handleSelectAll = () => {
    if (allSelected) {
      // Deselect all items
      generalSubjects.forEach((item) => {
        if (value.includes(item.value)) {
          handleSelect(item.value, true); // Remove the selected item
        }
      });
    } else {
      // Select all items
      generalSubjects.forEach((item) => {
        if (!value.includes(item.value) && !item.disable) {
          handleSelect(item.value); // Add the item to selection
        }
      });
    }
    setAllSelected(!allSelected); // Toggle the state
    clearErrors(entity); // Clear any errors related to the selection
  };

  return (
    <Command
      className="w-[21em] md:w-[65em]"
      filter={(itemValue, search) => {
        const item = data.find((d) => d.value === itemValue);
        const combinedText = `${item?.value} ${item?.label}`.toLowerCase();
        return combinedText.includes(search.toLowerCase()) ? 1 : 0;
      }}
    >
      <CommandInput placeholder={searchPlaceholder} />
      <CommandEmpty>
        No {searchPlaceholder.split(/[. ]+/).at(1).toLocaleLowerCase()} found.
      </CommandEmpty>
      <CommandList className="overflow-hidden overflow-y-auto">
        {/* CommandGroup for General Subjects */}
        {generalSubjects.length > 0 && (
          <CommandGroup
            heading={`General Subject${generalSubjects.length > 1 ? "s" : ""}:`}
            className="relative [&_[cmdk-group-heading]]:h-[2.5em] [&_[cmdk-group-heading]]:text-[1.2rem] [&_[cmdk-group-heading]]:!text-black [&_[cmdk-group-heading]]:dark:!text-white"
          >
            <CommandSeparator className="border-t border-slate-200 dark:border-slate-700" />
            <CommandList className="h-[12em]">
              {generalSubjects.map((item) => (
                <div key={item.value}>
                  <CommandItem
                    disabled={item.disable}
                    value={item.value}
                    onSelect={() => {
                      handleSelect(item.value);
                      clearErrors(entity);
                    }}
                    className={`cursor-pointer py-4 !text-[1.3rem] font-medium text-black dark:text-white md:text-[1.2rem]`}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        item.disable
                          ? "opacity-100"
                          : value.includes(item.value)
                            ? "opacity-100"
                            : "opacity-0",
                      )}
                    />
                    <span>
                      {item.label}
                      {showUnits && item.unit !== undefined ? (
                        <span className="text-gray-600">
                          {" "}
                          ({item.unit} units)
                        </span>
                      ) : null}
                    </span>
                  </CommandItem>
                  <CommandSeparator className="border-t border-slate-200 dark:border-slate-700" />
                </div>
              ))}
            </CommandList>
          </CommandGroup>
        )}

        <CommandSeparator />

        {/* CommandGroup for Other Subjects */}
        {otherSubjects.length > 0 && (
          <CommandGroup
            heading={`Other Subject${otherSubjects.length > 1 ? "s" : ""}:`}
            className="[&_[cmdk-group-heading]]:text-[1.2rem] [&_[cmdk-group-heading]]:!text-black [&_[cmdk-group-heading]]:dark:!text-white"
          >
            <CommandSeparator className="border-t border-slate-200 dark:border-slate-700" />
            <CommandList className="h-[12em]">
              {otherSubjects.map((item) => (
                <div key={item.value}>
                  <CommandItem
                    disabled={item.disable}
                    value={item.value}
                    onSelect={() => {
                      handleSelect(item.value);
                      clearErrors(entity);
                    }}
                    className="cursor-pointer py-4 !text-[1.3rem] font-medium text-black dark:text-white md:text-[1.2rem]"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        item.disable
                          ? "opacity-100"
                          : value.includes(item.value)
                            ? "opacity-100"
                            : "opacity-0",
                      )}
                    />
                    <span>
                      {item.label}
                      {showUnits && item.unit !== undefined ? (
                        <span className="text-gray-600">
                          {" "}
                          ({item.unit} units)
                        </span>
                      ) : null}
                    </span>
                  </CommandItem>
                  <CommandSeparator className="border-t border-slate-200 dark:border-slate-700" />
                </div>
              ))}
            </CommandList>
          </CommandGroup>
        )}
        {selectedItems && selectedItems.length >= 5 && handleClearAll && (
          <div className="!w-full p-4">
            <Button
              variant="destructive"
              onClick={handleClearAll}
              className="w-full"
            >
              Clear All
            </Button>
          </div>
        )}
      </CommandList>
    </Command>
  );
};

export default SubjectList;
