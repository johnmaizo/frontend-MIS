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

/**
 * A custom Command component that displays a list of items based on the data
 * prop. The component is also searchable and allows the user to select an item
 * by clicking on it. The selected item is passed to the handleSelect function
 * prop.
 *
 * @param {{ handleSelect: function, value: array, data: array, searchPlaceholder: string, clearErrors: function, entity: string }} props
 * @returns {JSX.Element}
 */
const CustomList = ({
  handleSelect,
  value,
  data,
  searchPlaceholder,
  clearErrors,
  entity,
}) => {
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
      <CommandList className="!overflow-hidden">
        <CommandGroup>
          <CommandSeparator className="border-t border-slate-200 dark:border-slate-700" />

          <CommandList className="h-[12em]">
            {data.length ? (
              data.map((item) => (
                <div key={item.value}>
                  <CommandItem
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
                        value.includes(item.value)
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {item.label}
                  </CommandItem>
                  <CommandSeparator className="border-t border-slate-200 dark:border-slate-700" />
                </div>
              ))
            ) : (
              <CommandItem
                disabled
                className="text-[1rem] font-medium text-black dark:text-white"
              >
                Empty, please add an item.
              </CommandItem>
            )}
          </CommandList>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default CustomList;
