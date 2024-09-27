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
import RoleBadge from "./RoleBadge";

const EmployeeSelector = ({
  isDesktop,
  open,
  setOpen,
  selectedEmployeeID,
  selectedEmployeeName,
  employeeActive,
  setSelectedEmployeeID,
  setSelectedEmployeeName,
  clearErrors,
  loading,
}) => {
  const renderButton = () => (
    <Button
      variant="outline"
      className="h-[2.5em] w-full justify-start text-xl text-black dark:bg-form-input dark:text-white"
    >
      {selectedEmployeeID ? (
        // `${selectedEmployeeName.split(" - ")[0]} - ${selectedEmployeeName.split(" - ")[1]}`
        `${selectedEmployeeName}`
      ) : (
        <>Select Employee</>
      )}
    </Button>
  );

  const handleEmployeeSelect = (id, name) => {
    setSelectedEmployeeID(id);
    setSelectedEmployeeName(name);
  };

  return isDesktop ? (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>{renderButton()}</PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <EmployeeList
          setOpen={setOpen}
          onSelectEmployee={handleEmployeeSelect}
          data={employeeActive}
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
          <EmployeeList
            setOpen={setOpen}
            onSelectEmployee={handleEmployeeSelect}
            data={employeeActive}
            loading={loading}
            clearErrors={clearErrors}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const EmployeeList = ({
  setOpen,
  onSelectEmployee,
  data,
  loading,
  clearErrors,
}) => {
  return (
    <Command className="md:!w-[62em]">
      <CommandInput placeholder="Filter employee..." />
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

          {data && data.length ? (
            <>
              {data.map((employee, index) => (
                <div key={index}>
                  <CommandSeparator className="border-t border-slate-200 dark:border-slate-700" />
                  <CommandItem
                    value={employee.employee_id.toString()}
                    onSelect={(value) => {
                      onSelectEmployee(value, employee.fullNameWithRole);
                      setOpen(false);
                      clearErrors("employee");
                    }}
                    className="text-[1rem] font-medium text-black dark:text-white md:!w-[62em] md:text-[1.2rem]"
                  >
                    {/* {employee.fullNameWithRole.split(" - ")[0]} -{" "} */}
                    {employee.role}
                    {/* <div>
                      <RoleBadge
                        roleString={employee.role}
                      />
                    </div> */}
                    {/* {employee.fullNameWithRole.split(" - ")[1]} */}
                  </CommandItem>
                </div>
              ))}
            </>
          ) : (
            <CommandItem
              disabled
              className="text-[1rem] font-medium text-black dark:text-white"
            >
              Empty, please add a Employee.
            </CommandItem>
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default EmployeeSelector;
