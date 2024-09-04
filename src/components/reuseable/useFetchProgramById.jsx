import { useState, useEffect } from "react";
import axios from "axios";

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
