import axios from "axios";

const axiosExternal = axios.create({
  baseURL: "https://afknon.pythonanywhere.com", // Set the base URL for external API
  headers: {
    "Content-Type": "application/json", // Add any necessary headers here
  },
  // Optionally disable credentials if you don't need cookies or authentication
  withCredentials: false,
});

export default axiosExternal;
