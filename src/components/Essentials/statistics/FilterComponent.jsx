/* eslint-disable react/prop-types */

const FilterComponent = ({ filters, setFilters }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex space-x-4">
      {/* Example for campus filter */}
      <select name="campus_id" onChange={handleInputChange}>
        <option value="">All Campuses</option>
        <option value="1">Campus 1</option>
        {/* ... */}
      </select>

      {/* Example for semester filter */}
      <select name="semester_id" onChange={handleInputChange}>
        <option value="">All Semesters</option>
        <option value="1">Semester 1</option>
        {/* ... */}
      </select>

      {/* Add more filters as needed */}
    </div>
  );
};

export default FilterComponent;
