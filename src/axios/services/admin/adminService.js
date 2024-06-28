import axios from "axios";

// Fetch all users (Admin only)
export const fetchAllUsers = async () => {
  try {
    const response = await axios.get("/accounts");
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

// Fetch specific user by ID
export const fetchUserById = async (id) => {
  try {
    const response = await axios.get(`/accounts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

// Authenticate user
export const authenticate = async (email, password) => {
  try {
    const response = await axios.post("/accounts/authenticate", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw error;
  }
};

// Register user
export const register = async (userDetails) => {
  try {
    const response = await axios.post("/accounts/register", userDetails);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};
