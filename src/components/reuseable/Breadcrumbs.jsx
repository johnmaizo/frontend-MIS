/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

// import { useMediaQuery } from "@/hooks/use-media-query";
import { useMediaQuery } from "../../hooks/use-media-query";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import React, { useState } from "react";
import { HomeIcon } from "lucide-react";

/**
 * A responsive breadcrumb component that will use a dropdown menu on desktop
 * and a drawer on mobile devices to handle long breadcrumb lists.
 *
 * @param {string} pageName - The name of the page to display in the title.
 * @param {Array<{ to: string, label: string }>} items - An array of breadcrumb
 *   items. Each item should have a `to` property with the link to the page and
 *   a `label` property with the text to display.
 * @param {number} ITEMS_TO_DISPLAY - The number of items to display before
 *   showing the dropdown menu or drawer.
 */

export function BreadcrumbResponsive({ pageName, items, ITEMS_TO_DISPLAY }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 rounded-lg bg-white px-4 py-3 dark:bg-boxdark sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-title-md font-semibold text-black dark:text-white">
            {pageName}
          </h2>
        </div>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="text-[1rem] font-medium">
              <BreadcrumbLink asChild>
                <Link
                  to={items[0].to}
                  className="inline-flex items-center gap-1 text-[#5E6B7E] dark:text-[#94A3B8]"
                >
                  <HomeIcon width={15} height={15} className="flex-none" />{" "}
                  {items[0].label}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />{" "}
            {/* Place separator between BreadcrumbItems */}
            {items.length > ITEMS_TO_DISPLAY ? (
              <>
                <BreadcrumbItem>
                  {isDesktop ? (
                    <DropdownMenu open={open} onOpenChange={setOpen}>
                      <DropdownMenuTrigger
                        className="flex items-center gap-1"
                        aria-label="Toggle menu"
                      >
                        <BreadcrumbEllipsis className="h-5 w-5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="border border-stroke bg-white dark:border-strokedark dark:bg-boxdark"
                      >
                        {items.slice(1, -2).map((item, index) => (
                          <DropdownMenuItem key={index}>
                            <Link
                              to={item.to ? item.to : "#"}
                              className="text-[1rem] font-medium"
                            >
                              {item.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Drawer open={open} onOpenChange={setOpen}>
                      <DrawerTrigger aria-label="Toggle Menu">
                        <BreadcrumbEllipsis className="h-4 w-4" />
                      </DrawerTrigger>
                      <DrawerContent className="border border-stroke bg-white text-black dark:border-strokedark dark:bg-boxdark dark:text-white">
                        <DrawerHeader className="text-left">
                          <DrawerTitle>Navigate to</DrawerTitle>
                          <DrawerDescription>
                            Select a page to navigate to.
                          </DrawerDescription>
                        </DrawerHeader>
                        <div className="grid gap-1 px-4">
                          {items.slice(1, -2).map((item, index) => (
                            <Link
                              key={index}
                              to={item.to ? item.to : "#"}
                              className="text-[1rem] font-medium"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                        <DrawerFooter className="pt-4">
                          <DrawerClose asChild>
                            <Button variant="outline">Close</Button>
                          </DrawerClose>
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>
                  )}
                </BreadcrumbItem>
                <BreadcrumbSeparator />{" "}
                {/* Place separator between BreadcrumbItems */}
              </>
            ) : null}
            {items.slice(-ITEMS_TO_DISPLAY + 1).map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {item.to ? (
                    <BreadcrumbLink
                      asChild
                      className="max-w-20 truncate text-[1rem] font-medium md:max-w-none"
                    >
                      <Link to={item.to}>{item.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="max-w-20 truncate text-[1rem] font-medium text-primary dark:text-[#83aaff] md:max-w-none">
                      {item.label}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index + 1 < items.slice(-ITEMS_TO_DISPLAY + 1).length && (
                  <BreadcrumbSeparator />
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </>
  );
}
