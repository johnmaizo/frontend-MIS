import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/context/AuthContext";

const SessionExpired = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout(true);
    navigate("/auth/signin");
  };

  return (
    <div className="fixed z-[10010] grid h-screen w-screen place-content-center bg-black/50 backdrop-blur-sm">
      <div className="mb-4 rounded-lg border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark dark:text-white text-black">
        <h2 className="text-2xl font-semibold">Session Expired</h2>
        <p>Your session has expired. Please log in again.</p>
        <button
          onClick={handleLogout}
          className="bg-blue-600 text-white p-2 mt-4 rounded-md hover:underline hover:underline-offset-4 focus:underline focus:underline-offset-4 w-full"
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default SessionExpired;
