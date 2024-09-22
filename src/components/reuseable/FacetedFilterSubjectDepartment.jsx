/* eslint-disable react/prop-types */
import { CheckIcon } from "@radix-ui/react-icons";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { Separator } from "../ui/separator";
import { ArrowUpDown } from "lucide-react";

export function FacetedFilterSubjectDepartment({ column, title, options }) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue());

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="p-1 hover:underline hover:underline-offset-4"
        >
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 1 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm bg-primary px-1 font-normal text-white !no-underline hover:bg-primary hover:!no-underline dark:bg-primary dark:hover:bg-primary"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className={`rounded-sm px-1 font-normal ${option.label === "Pending" ? "!bg-orange-500 hover:!bg-orange-500 dark:bg-orange-500 hover:dark:bg-orange-500" : option.label === "Rejected" ? "!bg-danger hover:!bg-danger dark:!bg-danger hover:dark:!bg-danger" : option.label === "Accepted" && "!bg-success hover:!bg-success dark:!bg-success hover:dark:!bg-success"} bg-primary text-white hover:bg-primary hover:!no-underline dark:bg-primary dark:hover:bg-primary`}
                      >
                        {!(option.label === "General Subject")
                          ? option.label.split(" - ")[0]
                          : option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined,
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "text-primary-foreground bg-primary"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="text-muted-foreground mr-2 h-4 w-4" />
                    )}
                    <span>
                      {option.label === "General Subject"
                        ? "General Subject"
                        : `${option.label.split(" - ")[0]} - ${option.label.split(" - ")[1]}`}
                    </span>
                    {facets?.get(option.value) && (
                      <span className="font-mono ml-auto flex h-4 w-4 items-center justify-center text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center !bg-danger text-center !text-white hover:cursor-pointer hover:underline hover:underline-offset-2 dark:bg-danger dark:text-white"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
