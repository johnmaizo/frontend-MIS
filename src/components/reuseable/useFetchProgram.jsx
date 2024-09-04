import { useState, useEffect } from "react";
import axios from "axios";

const useFetchProgram = (campus_id, programCode) => {
  const [programs, setPrograms] = useState(null);
  const [programLoading, setProgramLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgram = async () => {
      setProgramLoading(true);
      setError(null);
      try {
        const response = await axios.get("/programs/get-program", {
          params: {
            campus_id: campus_id,
            programCode: programCode,
          },
        });
        setPrograms(response.data);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to fetch program data");
        }
      } finally {
        setProgramLoading(false);
      }
    };

    if (campus_id && programCode) {
      fetchProgram();
    }
  }, [campus_id, programCode]);

  return { programs, programLoading, error };
};

export default useFetchProgram;
