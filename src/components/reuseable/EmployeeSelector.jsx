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

const EmployeeSelector = ({
  isDesktop,
  open,
  setOpen,
  selectedEmployeeID,
  selectedEmployeeName,
  data,
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
        `${selectedEmployeeName.split(" - ")[1] === "DataCenter" ? `${selectedEmployeeName.split(" - ")[0]} - Data Center` : selectedEmployeeName}`
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
          data={data}
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
            data={data}
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
    <Command
      className="md:!w-[62em]"
      filter={(value, search) => {
        const employee = data.find(
          (item) => item.employee_id.toString() === value,
        );
        const employeeNameWithRole = employee?.fullNameWithRole;

        // Adjusted to filter by employee name and role
        if (
          employeeNameWithRole?.toLowerCase().includes(search?.toLowerCase())
        ) {
          return 1;
        }
        return 0;
      }}
    >
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
                    disabled={employee.disable}
                    className="text-[1rem] font-medium text-black dark:text-white md:!w-[62em] md:text-[1.2rem]"
                  >
                    {employee.fullNameWithRole.split(" - ")[1] === "DataCenter"
                      ? `${employee.fullNameWithRole.split(" - ")[0]} - Data Center`
                      : `${employee.fullNameWithRole}`}
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
