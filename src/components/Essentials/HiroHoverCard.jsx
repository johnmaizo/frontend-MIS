/* eslint-disable react/prop-types */
import { CalendarDays } from "lucide-react";

import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "../ui/hover-card";
import { Button } from "../ui/button";

import Profile from "../../assets/images/john.jfif";

import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

const HiroHoverCard = ({ forSidebar }) => {
  return (
    <HoverCard>
      <HoverCardTrigger
        asChild
        // className={`py-3 dark:bg-boxdark lg:bg-white`}
        className={`py-3`}
      >
        <Button variant="link">
          {" "}
          © {new Date().getFullYear()} - MIS - Hiro
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className={`${forSidebar && forSidebar ? "" : "ml-10"}`}>
        <div className="space-y-1">
          <h4 className="inline-flex items-center gap-2 text-sm font-semibold">
            <Avatar>
              <AvatarImage src={Profile} />
              <AvatarFallback>JRM</AvatarFallback>
            </Avatar>
            @John Robert Maizo
          </h4>
          <p className="text-sm">
            {/* React  – created and maintained by @vercel. */}
            Full stack developer and creator.
          </p>
          <div className="flex items-center pt-2">
            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
            <span className="text-muted-foreground text-xs">
              Joined December 2021
            </span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default HiroHoverCard;
