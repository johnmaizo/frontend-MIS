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

const SubjectList = ({
  handleSelect,
  value,
  data,
  searchPlaceholder,
  clearErrors,
  entity,
}) => {
  // Filter data into two categories: isDepartmentIdNull and others
  const generalSubjects = data.filter((item) => item.isDepartmentIdNull);
  const otherSubjects = data.filter((item) => !item.isDepartmentIdNull);

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
            className="[&_[cmdk-group-heading]]:text-[1.2rem] [&_[cmdk-group-heading]]:!text-black [&_[cmdk-group-heading]]:dark:!text-white"
          >
            <CommandSeparator className="border-t border-slate-200 dark:border-slate-700" />
            <CommandList className="h-[12em]">
              {generalSubjects.map((item) => (
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
              ))}
            </CommandList>
          </CommandGroup>
        )}

        <CommandSeparator />

        {/* CommandGroup for Other Subjects */}
        {otherSubjects.length > 0 && (
          <CommandGroup
            heading={`Other Subject${generalSubjects.length > 1 ? "s" : ""}:`}
            className="[&_[cmdk-group-heading]]:text-[1.2rem] [&_[cmdk-group-heading]]:!text-black [&_[cmdk-group-heading]]:dark:!text-white"
          >
            <CommandSeparator className="border-t border-slate-200 dark:border-slate-700" />
            <CommandList className="h-[12em]">
              {otherSubjects.map((item) => (
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
              ))}
            </CommandList>
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
};

export default SubjectList;
