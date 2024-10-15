/* eslint-disable react/prop-types */

import { Button } from "../ui/button";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { ChevronsUpDown } from "lucide-react";


/**
 * @function CustomPopover
 * @description A reusable Popover component for search and selection.
 * @param {boolean} openPopover - Whether the popover is open or not.
 * @param {function} setOpenPopover - Function to set the openPopover state.
 * @param {boolean} [modal=true] - Whether the popover should be modal or not.
 * @param {boolean} loading - Whether the component is in a loading state or not.
 * @param {array} [selectedItems=[]] - Array of selected items.
 * @param {string} [itemName="Item"] - Name of the item being selected.
 * @param {function} [handleClearAll] - Function to clear all selected items.
 * @param {ReactNode} children - JSX children to be rendered inside the popover.
 * @returns {ReactElement} - The Popover component.
 */
const CustomPopover = ({
  openPopover,
  setOpenPopover,
  modal = true,
  loading,
  selectedItems = [],
  itemName = "Item",
  handleClearAll,
  children,
}) => {
  return (
    <Popover open={openPopover} onOpenChange={setOpenPopover} modal={modal}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={openPopover}
          className="h-auto w-full truncate justify-between bg-white px-3 py-4 transition dark:border-form-strokedark dark:bg-form-input "
          disabled={loading}
        >
          <div className="flex flex-wrap justify-start gap-2">
            {selectedItems.length ? (
              selectedItems.map((val, i) => (
                <div
                  key={i}
                  className="rounded bg-slate-200 px-2 py-1 text-[1.2rem] font-medium text-black dark:bg-strokedark dark:text-white "
                >
                  {val}
                </div>
              ))
            ) : (
              <span className="inline-block text-[1.2rem]">
                Select {itemName}..
              </span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        {children}
        {selectedItems.length >= 5 && handleClearAll && (
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
      </PopoverContent>
    </Popover>
  );
};

export default CustomPopover;
