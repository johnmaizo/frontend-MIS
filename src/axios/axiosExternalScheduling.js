import axios from "axios";

const axiosExternalScheduling = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BASE_URL_SCHEDULING_API, // Set the base URL for external API
  headers: {
    "Content-Type": "application/json", // Add any necessary headers here
  },
  // Optionally disable credentials if you don't need cookies or authentication
  withCredentials: false,
});

export default axiosExternalScheduling;
