import { useState, useEffect } from "react";
import axios from "axios";

/**
 * Fetches a program by its ID and campus name.
 *
 * @param {number} program_id the program ID
 * @param {string} campusName the campus name
 * @returns an object with the following properties:
 *   - `program`: the fetched program, or null if there was an error
 *   - `programLoading`: a boolean indicating whether the program is currently being fetched
 *   - `programError`: an error message if there was an error fetching the program, or null if there was no error
 */
const useFetchProgramById = (program_id, campusName) => {
  const [program, setProgram] = useState(null);
  const [programLoading, setProgramLoading] = useState(true);
  const [programError, setProgramError] = useState(null);

  useEffect(() => {
    const fetchProgramById = async () => {
      setProgramLoading(true);
      setProgramError(null);
      try {
        const response = await axios.get(`/programs/${program_id}`, {
          params: {
            campusName: campusName,
          },
        });
        setProgram(response.data);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setProgramError(err.response.data.message);
        } else {
          setProgramError("Failed to fetch program data");
        }
      } finally {
        setProgramLoading(false);
      }
    };

    if (program_id && campusName) {
      fetchProgramById();
    }
  }, [program_id, campusName]);

  return { program, programLoading, programError };
};

export default useFetchProgramById;
