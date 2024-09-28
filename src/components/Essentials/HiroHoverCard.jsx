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
import { useEffect, useState } from "react";

const HiroHoverCard = ({ forSidebar }) => {
  const [version, setVersion] = useState("");

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/johnmaizo/frontend-MIS/commits",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch commits");
        }
        const data = await response.json();

        const commitCount = data.length;
        const major = 1; // Set major version manually if needed
        const minor = Math.floor(commitCount / 2); // Change every 10 commits
        const patch = commitCount; // Remainder for patch

        setVersion(`v${major}.${minor}.${patch}`);
      } catch (error) {
        console.error("Error fetching commits:", error);
        setVersion(""); // Set version to blank on error
      }
    };

    fetchCommits();
  }, []);

  return (
    <HoverCard>
      <HoverCardTrigger
        asChild
        // className={`py-3 dark:bg-boxdark lg:bg-white`}
        className={`py-3`}
      >
        <Button variant="link">
          {" "}
          © {new Date().getFullYear()} - MIS - Hiro {version && version}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        className={`${forSidebar && forSidebar ? "" : "ml-10"}`}
      >
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
