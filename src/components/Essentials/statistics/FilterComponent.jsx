/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const FilterComponent = ({ filters, setFilters }) => {
  const { user } = useContext(AuthContext);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemesterId, setSelectedSemesterId] = useState(
    filters.semester_id || null,
  );

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      const response = await axios.get("/semesters", {
        params: {
          campus_id: user.campus_id,
        },
      });
      setSemesters(response.data);

      // Set default selected semester based on the active semester
      const activeSemester = response.data.find((sem) => sem.isActive);
      if (activeSemester) {
        setSelectedSemesterId(activeSemester.semester_id.toString());
        setFilters((prevFilters) => ({
          ...prevFilters,
          semester_id: activeSemester.semester_id.toString(),
        }));
      } else if (response.data.length > 0) {
        setSelectedSemesterId(response.data[0].semester_id.toString());
        setFilters((prevFilters) => ({
          ...prevFilters,
          semester_id: response.data[0].semester_id.toString(),
        }));
      }
    } catch (error) {
      console.error("Failed to fetch semesters", error);
    }
  };

  // Combine School Year and Semester Name for selector
  const combinedSemesters = semesters.map((sem) => ({
    id: sem.semester_id.toString(),
    label: `${sem.schoolYear} - ${sem.semesterName}`,
  }));

  const handleSemesterChange = (value) => {
    setSelectedSemesterId(value === "all-semesters" ? null : value);
    setFilters((prevFilters) => ({
      ...prevFilters,
      semester_id: value === "all-semesters" ? null : value,
    }));
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Semester Selector */}
      <Select
        value={selectedSemesterId || "all-semesters"}
        onValueChange={handleSemesterChange}
      >
        <SelectTrigger className="h-[3.3em] w-[18em]">
          <SelectValue placeholder="Select Semester" />
        </SelectTrigger>
        <SelectContent className="dark:bg-[#1A222C]">
          <SelectItem value="all-semesters">All Semesters</SelectItem>
          {combinedSemesters.map((sem) => (
            <SelectItem key={sem.id} value={sem.id}>
              {sem.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterComponent;
