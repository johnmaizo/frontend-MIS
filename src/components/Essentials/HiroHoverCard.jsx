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
  const [lastFetched, setLastFetched] = useState(null);

  useEffect(() => {
    const CACHE_KEY = "hiro_commits_cache";
    const CACHE_EXPIRATION_MS = 60 * 60 * 1000; // 1 hour

    const fetchCommits = async () => {
      let allCommits = [];
      let page = 1;
      const perPage = 30; // Number of commits per page
      let hasMoreCommits = true; // Flag to control the loop

      try {
        // Check local storage for cached data
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { commits, timestamp } = JSON.parse(cachedData);
          const isCacheValid = Date.now() - timestamp < CACHE_EXPIRATION_MS;

          if (isCacheValid) {
            allCommits = commits;
            setLastFetched(new Date(timestamp)); // Set last fetched timestamp from cache
            console.log("Using cached commits data.");
          }
        }

        // If no valid cache, fetch from the GitHub API
        if (allCommits.length === 0) {
          while (hasMoreCommits) {
            const response = await fetch(
              `https://api.github.com/repos/johnmaizo/frontend-MIS/commits?per_page=${perPage}&page=${page}`,
            );
            if (!response.ok) {
              throw new Error("Failed to fetch commits");
            }
            const data = await response.json();

            // If no more commits are returned, stop the loop
            if (data.length === 0) {
              hasMoreCommits = false;
            } else {
              // Append fetched commits to the list
              allCommits = [...allCommits, ...data];
              page++;
            }
          }

          // Update local storage with new data
          const currentTime = Date.now();
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ commits: allCommits, timestamp: currentTime }),
          );
          setLastFetched(new Date(currentTime)); // Set last fetched timestamp from current time
          console.log("Commits data cached.");
        }

        const commitCount = allCommits.length;

        // Dynamic versioning rules defined here
        const major = Math.floor(commitCount / 100); // Every 100 commits
        const minor = Math.floor((commitCount % 100) / 10); // Every 10 commits within the current hundred
        const patch = commitCount % 10; // Remainder as patch version

        setVersion(`v${major}.${minor}.${patch}`);
      } catch (error) {
        console.error("Error fetching commits:", error);
        setVersion(""); // Set version to blank on error
        setLastFetched(null); // Clear the last fetched timestamp on error
      }
    };

    fetchCommits();
  }, []);

  // Format the last fetched date
  const formattedLastFetched = lastFetched
    ? lastFetched.toLocaleString()
    : "Not available";

  return (
    <HoverCard>
      <HoverCardTrigger asChild className={`py-3`}>
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
          <p className="text-sm">Full stack developer and creator.</p>
          <div className="flex items-center pt-2">
            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
            <span className="text-muted-foreground text-xs">
              Joined December 2021
            </span>
          </div>
          <div className="pt-2 text-xs">
            <strong>Last fetched:</strong> {formattedLastFetched}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default HiroHoverCard;
