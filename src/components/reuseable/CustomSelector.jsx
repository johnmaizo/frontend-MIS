/* eslint-disable react/prop-types */
import { useFormContext, Controller } from "react-hook-form"; // Import useFormContext and Controller
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { Button } from "../ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";

const CustomSelector = ({
  title,
  isDesktop,
  open,
  setOpen,
  selectedID,
  selectedName,
  data,
  forSemester = null,
  forDisable = null,
  forInstructor = null,
  forCourse = null,
  setSelectedCourseCode = null,
  setSelectedID,
  setSelectedName,
  setSelectedInstructorID,
  setSelectedInstructorName,
  loading,
  idKey,
  nameKey,
  errorKey,
  displayItem = null, // Accept displayItem prop
  disabledItems = [], // Accept disabledItems prop
  clearErrorsProp, // New prop to accept clearErrors
}) => {
  // Attempt to get clearErrors from FormProvider context
  const formContext = useFormContext();
  const clearErrors = clearErrorsProp || formContext?.clearErrors;

  const renderButton = () => (
    <Button
      variant="outline"
      className="h-[2.5em] w-[11em] justify-start truncate text-xl text-black dark:bg-form-input dark:text-white 2xsm:w-[15em] xsm:w-[17em] md:!w-full"
      disabled={forDisable || loading}
      type="button" // Ensure the button type is set to avoid form submissions
    >
      {selectedID ? selectedName : <>Select {title}</>}
    </Button>
  );

  const handleItemSelect = (id, name) => {
    setSelectedID(id);
    setSelectedName(name);
    if (clearErrors) {
      clearErrors(errorKey);
    }
  };

  const handleItemSelectWithCourseCode = (id, name, courseCode) => {
    setSelectedID(id);
    setSelectedName(name);
    setSelectedCourseCode((prev) =>
      prev === courseCode && courseCode === null ? "CEA" : courseCode,
    );

    // Clear selected instructor fields
    if (setSelectedInstructorID) setSelectedInstructorID("");
    if (setSelectedInstructorName) setSelectedInstructorName("");
    if (clearErrors) {
      clearErrors(errorKey);
    }
  };

  return isDesktop ? (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <div>
        <PopoverTrigger asChild>{renderButton()}</PopoverTrigger>
      </div>
      <PopoverContent className="w-full p-0" align="start">
        <CustomList
          setOpen={setOpen}
          onSelectItem={handleItemSelect}
          data={data}
          onselectItemWithCourseCode={handleItemSelectWithCourseCode}
          forSemester={forSemester}
          forInstructor={forInstructor}
          loading={loading}
          idKey={idKey}
          nameKey={nameKey}
          errorKey={errorKey}
          title={title}
          forCourse={forCourse}
          displayItem={displayItem} // Pass displayItem to CustomList
          disabledItems={disabledItems} // Pass disabledItems to CustomList
          clearErrors={clearErrors} // Pass clearErrors to CustomList
        />
      </PopoverContent>
    </Popover>
  ) : (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{renderButton()}</DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <CustomList
            setOpen={setOpen}
            onselectItemWithCourseCode={handleItemSelectWithCourseCode}
            onSelectItem={handleItemSelect}
            data={data}
            forSemester={forSemester}
            forInstructor={forInstructor}
            loading={loading}
            idKey={idKey}
            nameKey={nameKey}
            errorKey={errorKey}
            title={title}
            forCourse={forCourse}
            displayItem={displayItem} // Pass displayItem to CustomList
            disabledItems={disabledItems} // Pass disabledItems to CustomList
            clearErrors={clearErrors} // Pass clearErrors to CustomList
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const CustomList = ({
  setOpen,
  onSelectItem,
  data,
  loading,
  onselectItemWithCourseCode,
  forSemester = null,
  forCourse = null,
  forInstructor = null,
  idKey,
  nameKey,
  errorKey,
  title,
  displayItem = null, // Accept displayItem prop
  disabledItems = [], // Accept disabledItems prop
  clearErrors, // Accept clearErrors from props
}) => {
  return (
    <Command
      className="!w-full"
      filter={(value, search) => {
        const listItem = data.find((item) => item[idKey].toString() === value);
        const listName = displayItem
          ? displayItem(listItem)
          : listItem[nameKey];
        if (listName?.toLowerCase().includes(search?.toLowerCase())) return 1;
        return 0;
      }}
    >
      <CommandInput placeholder={`Filter ${title}...`} />
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandList>
        <CommandGroup>
          {loading && (
            <CommandItem
              disabled
              className="text-[1rem] font-medium text-black dark:text-white md:text-[1.2rem]"
            >
              Searching...
            </CommandItem>
          )}

          {/* List generic items */}
          {data && data.length ? (
            <>
              {data.map((list, index) => (
                <div key={index}>
                  <CommandSeparator className="border-t border-slate-200 dark:border-slate-700" />
                  <CommandItem
                    value={list[idKey].toString()} // Dynamic key for ID
                    onSelect={(value) => {
                      forCourse
                        ? onselectItemWithCourseCode(
                            value,
                            list[nameKey],
                            list.departmentCodeForClass,
                          )
                        : onSelectItem(value, list[nameKey]);
                      setOpen(false);
                      if (clearErrors) {
                        clearErrors(errorKey); // Now clearErrors is accessible
                      }
                    }}
                    disabled={
                      disabledItems.includes(list[idKey]) ||
                      (forSemester &&
                        forSemester === true &&
                        list.isActive === false) ||
                      (forInstructor &&
                        forInstructor === true &&
                        list.disable === true)
                    }
                    className="text-[1rem] font-medium text-black dark:text-white md:!w-[34.5em] md:text-[1.2rem]"
                  >
                    {displayItem ? displayItem(list) : list[nameKey]}{" "}
                    {/* Use displayItem if provided */}
                  </CommandItem>
                </div>
              ))}
            </>
          ) : (
            <CommandItem
              disabled
              className="text-[1rem] font-medium text-black dark:text-white"
            >
              Empty, please add a {title.toLowerCase()}.
            </CommandItem>
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default CustomSelector;
