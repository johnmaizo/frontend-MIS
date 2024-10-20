/* eslint-disable react/prop-types */
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
  clearErrors,
  loading,
  idKey,
  nameKey,
  errorKey,
  displayItem = null, // Accept displayItem prop
  disabledItems = [], // Accept disabledItems prop
}) => {
  const renderButton = () => (
    <Button
      variant="outline"
      className="h-[2.5em] w-[11em] justify-start truncate text-xl text-black dark:bg-form-input dark:text-white 2xsm:w-[15em] xsm:w-[17em] md:!w-full"
      disabled={forDisable && forDisable ? true : loading ? true : false}
    >
      {selectedID ? selectedName : <>Select {title}</>}
    </Button>
  );

  const handleItemSelect = (id, name) => {
    setSelectedID(id);
    setSelectedName(name);
  };

  const handleItemSelectWithCourseCode = (id, name, courseCode) => {
    setSelectedID(id);
    setSelectedName(name);
    setSelectedCourseCode((prev) =>
      prev === courseCode && courseCode === null ? "CEA" : courseCode,
    );

    // Clear selected instructor fields
    setSelectedInstructorID && setSelectedInstructorID("");
    setSelectedInstructorName && setSelectedInstructorName("");
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
          clearErrors={clearErrors}
          idKey={idKey}
          nameKey={nameKey}
          errorKey={errorKey}
          title={title}
          forCourse={forCourse}
          displayItem={displayItem} // Pass displayItem to CustomList
          disabledItems={disabledItems} // Pass disabledItems to CustomList
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
            clearErrors={clearErrors}
            idKey={idKey}
            nameKey={nameKey}
            errorKey={errorKey}
            title={title}
            forCourse={forCourse}
            displayItem={displayItem} // Pass displayItem to CustomList
            disabledItems={disabledItems} // Pass disabledItems to CustomList
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
  clearErrors,
  idKey,
  nameKey,
  errorKey,
  title,
  displayItem = null, // Accept displayItem prop
  disabledItems = [], // Accept disabledItems prop
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
      <CommandInput placeholder={`Filter ${title}...`} />{" "}
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
                      clearErrors(errorKey);
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
