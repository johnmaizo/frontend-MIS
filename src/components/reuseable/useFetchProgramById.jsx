import { useState, useEffect } from "react";
import axios from "axios";

const useFetchProgramById = (program_id, campusName) => {
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgramById = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/programs/${program_id}`, {
          params: {
            campusName: campusName,
          },
        });
        setProgram(response.data);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to fetch program data");
        }
      } finally {
        setLoading(false);
      }
    };

    if (program_id && campusName) {
      fetchProgramById();
    }
  }, [program_id, campusName]);

  return { program, loading, error };
};

export default useFetchProgramById;
