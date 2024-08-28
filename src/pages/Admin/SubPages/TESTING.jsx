/* eslint-disable react/prop-types */
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "../../../lib/utils";
import { Button } from "../../../components/ui/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../../../components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { useEffect, useState } from "react";

// from "@/components/ui/popover"

const frameworks = [
  {
    value: "HAHAHAHA",
    label: "Next.js",
  },
  {
    value: "bruh",
    label: "SvelteKit",
  },
  {
    value: "whut",
    label: "Nuxt.js",
  },
  {
    value: "bleee",
    label: "Remix",
  },
  {
    value: "wow",
    label: "Astro",
  },
];

export function ComboboxDemo() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);

  const handleSetValue = (val) => {
    if (value.includes(val)) {
      value.splice(value.indexOf(val), 1);
      setValue(value.filter((item) => item !== val));
    } else {
      setValue((prevValue) => [...prevValue, val]);
    }
  };

  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-auto w-full justify-between px-3 py-5" // change the width of the button here (w-[200px])
        >
          <div className="flex flex-wrap justify-start gap-2">
            {value?.length ? (
              value.map((val, i) => (
                <div
                  key={i}
                  className="rounded bg-slate-200 px-2 py-1 text-[1.2rem] font-medium text-black dark:bg-strokedark dark:text-white"
                >
                  {
                    frameworks.find((framework) => framework.value === val)
                      ?.label
                  }
                </div>
              ))
            ) : (
              <span className="inline-block text-[1.2rem]">
                Select framework..
              </span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <SubjectList
          handleSetValue={handleSetValue}
          value={value}
          data={frameworks}
        />
      </PopoverContent>
    </Popover>
  );
}

const SubjectList = ({ handleSetValue, value, data }) => {
  return (
    <Command
      filter={(value, search, keywords = []) => {
        const extendValue = value + " " + keywords.join(" ");
        if (extendValue.toLowerCase().includes(search.toLowerCase())) {
          return 1;
        }
        return 0;
      }}
    >
      <CommandInput placeholder="Search framework..." />
      <CommandEmpty>No framework found.</CommandEmpty>
      <CommandList>
        <CommandGroup>
          <CommandList>
            {data && data.length ? (
              data.map((data) => (
                <div key={data.value}>
                  <CommandSeparator className="border-t border-slate-200 dark:border-slate-700" />
                  <CommandItem
                    value={data.value}
                    onSelect={() => {
                      handleSetValue(data.value);
                    }}
                    className="text-[1rem] font-medium text-black dark:text-white md:!w-[34.5em] md:text-[1.2rem]"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(data.value)
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {data.label}
                  </CommandItem>
                </div>
              ))
            ) : (
              <CommandItem
                disabled
                className="text-[1rem] font-medium text-black dark:text-white"
              >
                Empty, please add a course.
              </CommandItem>
            )}
          </CommandList>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
