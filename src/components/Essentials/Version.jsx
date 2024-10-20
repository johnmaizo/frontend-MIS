/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

const Version = ({
  repoUrl = "https://api.github.com/repos/johnmaizo/frontend-MIS/commits",
  className = "",
  cacheKey = "hiro_commits_cache",
  cacheExpirationMs = 60 * 60 * 1000, // 1 hour cache expiration
}) => {
  const [version, setVersion] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Track loading status

  useEffect(() => {
    const fetchCommits = async () => {
      setIsLoading(true); // Set loading to true when starting the fetch
      let allCommits = [];
      let page = 1;
      const perPage = 30;
      let hasMoreCommits = true;

      try {
        // Check local storage for cached data
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const { commits, timestamp } = JSON.parse(cachedData);
          const isCacheValid = Date.now() - timestamp < cacheExpirationMs;

          if (isCacheValid) {
            allCommits = commits;
            console.log("Using cached commits data.");
          }
        }

        // If no valid cache, fetch from the GitHub API
        if (allCommits.length === 0) {
          while (hasMoreCommits) {
            const response = await fetch(
              `${repoUrl}?per_page=${perPage}&page=${page}`,
            );
            if (!response.ok) {
              throw new Error("Failed to fetch commits");
            }
            const data = await response.json();

            if (data.length === 0) {
              hasMoreCommits = false;
            } else {
              allCommits = [...allCommits, ...data];
              page++;
            }
          }

          // Update local storage with new data
          const currentTime = Date.now();
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ commits: allCommits, timestamp: currentTime }),
          );
          console.log("Commits data cached.");
        }

        const commitCount = allCommits.length;
        const major = Math.floor(commitCount / 100);
        const minor = Math.floor((commitCount % 100) / 10);
        const patch = commitCount % 10;

        setVersion(`v${major}.${minor}.${patch}`);
      } catch (error) {
        console.error("Error fetching commits:", error);
        setVersion(""); // Set version to blank on error
      } finally {
        setIsLoading(false); // Set loading to false after fetch completes
      }
    };

    fetchCommits();
  }, [repoUrl, cacheKey, cacheExpirationMs]);

  // Conditionally render the version or the loading indicator
  return isLoading ? (
    <span className={`inline-block text-sm ${className}`}>Current Version: Loading...</span>
  ) : version ? (
    <span className={`inline-block text-sm ${className}`}>
      Current Version: {version}
    </span>
  ) : (
    <span className={`inline-block text-sm ${className}`}>
      Version not available
    </span>
  );
};

export default Version;
