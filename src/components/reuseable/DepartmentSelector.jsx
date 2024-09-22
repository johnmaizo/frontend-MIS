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
}) => {
  const renderButton = () => (
    <Button
      variant="outline"
      className="h-[2.5em] w-full justify-start text-xl text-black dark:bg-form-input dark:text-white"
    >
      {selectedDepartmentID ? (
        selectedDepartmentID === "general-subject" ? (
          "General Subject"
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
}) => {
  return (
    <Command className="md:!w-[34.5em]">
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

          {/* General Subject option */}
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

          {/* List departments */}
          {data && data.length ? (
            data.map((department, index) => (
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
            ))
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
