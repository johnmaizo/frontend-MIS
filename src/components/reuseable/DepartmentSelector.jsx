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

const DepartmentSelector = ({
  isDesktop,
  open,
  setOpen,
  selectedDepartmentID,
  selectedDepartmenName,
  departmentsActive,
  setSelectedDepartmentID,
  setSelectedDepartmenName,
  clearErrors,
  loading,
  hideGeneralSubject,
}) => {
  const renderButton = () => (
    <Button
      variant="outline"
      className="h-[2.5em] w-full justify-start text-xl text-black dark:bg-form-input dark:text-white"
    >
      {selectedDepartmentID ? (
        selectedDepartmentID === "general-subject" ? (
          "General Subject"
        ) : selectedDepartmentID === "blank" ? (
          "-Select Department-"
        ) : (
          `${selectedDepartmenName.split(" - ")[0]} - ${selectedDepartmenName.split(" - ")[1]}`
        )
      ) : (
        <>Select Department</>
      )}
    </Button>
  );

  const handleDepartmentSelect = (id, name) => {
    setSelectedDepartmentID(id);
    setSelectedDepartmenName(name);
  };

  return isDesktop ? (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>{renderButton()}</PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <DepartmentList
          setOpen={setOpen}
          onSelectDepartment={handleDepartmentSelect}
          data={departmentsActive}
          loading={loading}
          clearErrors={clearErrors}
          isHideGeneralSubject={hideGeneralSubject}
        />
      </PopoverContent>
    </Popover>
  ) : (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{renderButton()}</DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <DepartmentList
            setOpen={setOpen}
            onSelectDepartment={handleDepartmentSelect}
            data={departmentsActive}
            loading={loading}
            clearErrors={clearErrors}
            isHideGeneralSubject={hideGeneralSubject}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const DepartmentList = ({
  setOpen,
  onSelectDepartment,
  data,
  loading,
  clearErrors,
  isHideGeneralSubject,
}) => {
  return (
    <Command
      className="md:!w-[34.5em]"
      filter={(value, search) => {
        const deparment = data.find(
          (item) => item.department_id.toString() === value,
        );
        const departmentName = deparment?.fullDepartmentNameWithCampus;

        // Adjusted to filter by deparment name and role
        if (departmentName?.toLowerCase().includes(search?.toLowerCase())) {
          return 1;
        }
        return 0;
      }}
    >
      <CommandInput placeholder="Filter department..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {loading && (
            <CommandItem
              disabled
              className="text-[1rem] font-medium text-black dark:text-white md:text-[1.2rem]"
            >
              Searching...
            </CommandItem>
          )}

          {/* List departments */}
          {data && data.length ? (
            <>
              {/* General Subject option */}

              {!isHideGeneralSubject && (
                <CommandItem
                  value="general-subject"
                  onSelect={() => {
                    onSelectDepartment("general-subject", "General Subject");
                    setOpen(false);
                    clearErrors("department_id");
                  }}
                  className="text-[1rem] font-medium text-black dark:text-white md:!w-[34.5em] md:text-[1.2rem]"
                >
                  General Subject
                </CommandItem>
              )}

              {data.map((department, index) => (
                <div key={index}>
                  <CommandSeparator className="border-t border-slate-200 dark:border-slate-700" />
                  <CommandItem
                    value={department.department_id.toString()}
                    onSelect={(value) => {
                      onSelectDepartment(
                        value,
                        department.fullDepartmentNameWithCampus,
                      );
                      setOpen(false);
                      clearErrors("department_id");
                    }}
                    className="text-[1rem] font-medium text-black dark:text-white md:!w-[34.5em] md:text-[1.2rem]"
                  >
                    {`${department.fullDepartmentNameWithCampus.split(" - ")[0]} - ${department.fullDepartmentNameWithCampus.split(" - ")[1]}`}
                  </CommandItem>
                </div>
              ))}
            </>
          ) : (
            <CommandItem
              disabled
              className="text-[1rem] font-medium text-black dark:text-white"
            >
              Empty, please add a department.
            </CommandItem>
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default DepartmentSelector;
