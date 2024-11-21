/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

const DataExportButton = ({ endpoint, filename, filters }) => {
  const handleExport = async () => {
    try {
      const response = await axios.get(endpoint, {
        params: filters,
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  return (
    <button onClick={handleExport} className="p-2 bg-blue-600 rounded-md hover:bg-blue-700 !text-white">
      Export Data
    </button>
  );
};

export default DataExportButton;
