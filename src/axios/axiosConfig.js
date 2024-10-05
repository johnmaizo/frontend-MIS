import axios from "axios";
import { toast } from "react-hot-toast";
import { LogoutUser } from "./LogoutUser";

axios.defaults.baseURL =
  import.meta.env.VITE_NODE_ENV &&
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_REACT_APP_BASE_URL
    : import.meta.env.VITE_REACT_APP_BASE_URL_LOCAL;
axios.defaults.withCredentials = true; // Include cookies in requests

// Flag to track if an error toast has been shown
let isToastShown = false;

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Session expired or unauthorized, attempt refresh
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post("/accounts/refresh-token");
        localStorage.setItem("jwtToken", refreshResponse.data.jwtToken);

        // Update the Authorization header and retry the request
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${refreshResponse.data.jwtToken}`;
        originalRequest.headers["Authorization"] =
          `Bearer ${refreshResponse.data.jwtToken}`;

        // Reset the toast flag since the token refresh was successful
        isToastShown = false;

        return axios(originalRequest);
      } catch (refreshError) {
        // If token refresh fails, logout globally
        if (!isToastShown) {
          toast.error("Session expired. Please log in again.");
          isToastShown = true; // Set the flag to true
        }
        LogoutUser();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axios;
