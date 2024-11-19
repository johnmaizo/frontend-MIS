/* eslint-disable react/prop-types */
// components/ui/TimelineItem.jsx
import { Badge } from "./badge";
import { useState } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  PlusSquare,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import clsx from "clsx"; // Utility for conditionally joining classNames
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "./tooltip"; // Using shadCN's Tooltip components

const TimelineItem = ({ history }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Define sensitive fields to censor
  const sensitiveFields = ["password", "confirmpassword"]; // Ensure all keys are lowercase and without spaces

  // Function to determine if a field should be censored
  const shouldCensor = (entity, key) => {
    if (entity.toUpperCase() !== "ACCOUNTS") return false;
    const normalizedKey = key.toLowerCase().replace(/\s+/g, ""); // Remove spaces and lowercase
    return sensitiveFields.includes(normalizedKey);
  };

  // Function to format keys
  const formatKey = (key) => {
    // Remove 'is' prefix if present and followed by a capital letter
    if (
      key.startsWith("is") &&
      key.length > 2 &&
      key[2] === key[2].toUpperCase()
    ) {
      key = key.slice(2);
    }

    // Replace underscores with spaces and split camelCase
    const words = key
      .replace(/([A-Z])/g, " $1") // Insert space before capital letters
      .replace(/_/g, " ") // Replace underscores with spaces
      .split(" "); // Split into words

    // Capitalize the first letter of each word
    const capitalized = words.map((word) => {
      // Handle acronyms (e.g., NCAE_grade)
      if (word.toUpperCase() === word) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    });

    return capitalized.join(" ");
  };

  // Mapping change types to icons, colors, and tooltips
  const fieldChangeTypeMap = {
    CREATE: {
      icon: PlusSquare,
      color: "text-green-600 dark:text-green-400",
      tooltip: "Added",
    },
    UPDATE: {
      icon: PencilIcon,
      color: "text-yellow-600 dark:text-yellow-400",
      tooltip: "Updated",
    },
    DELETE: {
      icon: TrashIcon,
      color: "text-red-600 dark:text-red-400",
      tooltip: "Deleted",
    },
  };

  // Recursive helper function to render changes
  const renderChanges = (changes, action) => {
    // If changes is a stringified JSON, parse it
    let parsedChanges;
    try {
      parsedChanges =
        typeof changes === "string" ? JSON.parse(changes) : changes;
    } catch (error) {
      console.error("Error parsing changes:", error);
      return <span className="text-red-500">Invalid changes data.</span>;
    }

    // If parsedChanges is not an object, return it as a string
    if (typeof parsedChanges !== "object" || parsedChanges === null) {
      return (
        <span>{parsedChanges?.toString() || "No changes available."}</span>
      );
    }

    // Recursive function to render key-value pairs with highlighting and icons
    const renderKeyValuePairs = (obj, parentKey = "") => {
      return Object.entries(obj).map(([key, value]) => {
        // Determine the change type based on the action
        let changeType = action; // Default to action type

        // If action is UPDATE and there's an original value, it's an update
        if (action === "UPDATE" && obj.original) {
          changeType = "UPDATE";
        }

        // Get the corresponding icon, color, and tooltip
        const {
          icon: ChangeIcon,
          color: changeColor,
          tooltip,
        } = fieldChangeTypeMap[changeType] || {};

        // Determine if the current field should be censored
        const isCensored = shouldCensor(history.entity, key);

        return (
          <div key={key} className="mb-2 ml-4 flex items-start">
            {/* Icon for the field change */}
            {ChangeIcon && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ChangeIcon className={clsx("mr-2 h-4 w-4", changeColor)} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {formatKey(key)}:
              </p>
              {typeof value === "object" && value !== null ? (
                Array.isArray(value) ? (
                  <ul className="text-gray-600 dark:text-gray-400 list-inside list-disc">
                    {value.map((item, index) => (
                      <li key={index}>
                        {typeof item === "object" && item !== null
                          ? renderKeyValuePairs(item, key)
                          : item !== null && item !== undefined
                            ? item.toString()
                            : "N/A"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="ml-4">{renderKeyValuePairs(value, key)}</div>
                )
              ) : (
                <p
                  className={clsx(
                    "text-gray-600 dark:text-gray-400",
                    changeType === "CREATE"
                      ? "text-green-600 dark:text-green-400"
                      : changeType === "UPDATE"
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-red-600 dark:text-red-400",
                  )}
                >
                  {isCensored
                    ? "••••••••"
                    : value !== null && value !== undefined
                      ? value.toString()
                      : "N/A"}
                </p>
              )}
            </div>
          </div>
        );
      });
    };

    if (
      action === "UPDATE" &&
      parsedChanges.updated &&
      parsedChanges.original
    ) {
      return (
        <div className="space-y-4">
          <div>
            <p className="text-gray-700 dark:text-gray-300 font-semibold">
              Updated:
            </p>
            {renderKeyValuePairs(parsedChanges.updated, "UPDATE")}
          </div>
          <div>
            <p className="text-gray-700 dark:text-gray-300 font-semibold">
              Original:
            </p>
            {renderKeyValuePairs(parsedChanges.original, "UPDATE")}
          </div>
        </div>
      );
    }

    // For CREATE and other actions
    return (
      <div className="space-y-2">
        {renderKeyValuePairs(parsedChanges, action)}
      </div>
    );
  };

  // Toggle the visibility of changes
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // Determine which icon to display based on action type
  const ActionIcon =
    fieldChangeTypeMap[history.action.toUpperCase()]?.icon || ChevronRightIcon;

  // Determine the color for the action badge
  const badgeColor =
    fieldChangeTypeMap[history.action.toUpperCase()]?.color ||
    "text-blue-600 dark:text-blue-400";

  return (
    <TooltipProvider>
      <div className="flex items-start">
        {/* Dot Indicator */}
        <div className="relative">
          <div className="mt-2 h-3 w-3 rounded-full bg-blue-500 dark:bg-blue-300"></div>
        </div>

        {/* Content */}
        <div className="ml-8 w-full">
          <div className="mb-1 flex items-center gap-3">
            <div className="flex items-center">
              {/* Action Icon */}
              {ActionIcon && (
                <ActionIcon className={clsx("mr-2 h-5 w-5", badgeColor)} />
              )}
              <Badge
                variant="info"
                className={`mr-2 !text-white ${history.action.toUpperCase() === "CREATE" ? "bg-green-500" : history.action.toUpperCase() === "UPDATE" ? "bg-yellow-500" : history.action.toUpperCase() === "DELETE" ? "bg-red-500" : ""}`}
              >
                {history.action.toUpperCase()}
              </Badge>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {new Date(history.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            {/* Toggle Button with Tooltip */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleOpen}
                  className="p-2 font-semibold text-blue-500 focus:outline-none dark:text-blue-300"
                  aria-label={isOpen ? "Hide details" : "Show details"}
                >
                  {isOpen ? (
                    <ChevronDownIcon className="h-5 w-5" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isOpen ? "Hide details" : "Show details"}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div>
            <p className="text-md text-gray-800 dark:text-gray-200 font-medium">
              {history.entity} (ID: {history.entityId})
            </p>
            {/* Render changes conditionally */}
            {isOpen && (
              <div className="border-gray-300 dark:border-gray-600 mt-2 border-l-2 pl-4 transition-all duration-300 ease-in-out">
                {renderChanges(history.changes, history.action.toUpperCase())}
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TimelineItem;
