import { useContext } from "react";
import { AuthContext } from "../components/context/AuthContext";

export const LogoutUser = () => {
  const { handleLogout } = useContext(AuthContext);
  handleLogout(); // Logs out the user globally
};
