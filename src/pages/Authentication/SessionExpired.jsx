import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/context/AuthContext";

const SessionExpired = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout(true);
    navigate("/auth/signin");
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        handleLogout();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed z-[10010] grid h-screen w-screen place-content-center bg-black/50 backdrop-blur-sm">
      <div className="mx-5 mb-4 rounded-lg border border-stroke bg-white p-6 text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:text-white md:mx-0">
        <h2 className="text-2xl font-semibold">Session Expired</h2>
        <p>Your session has expired. Please log in again.</p>
        <button
          onClick={handleLogout}
          className="mt-4 w-full rounded-md bg-blue-600 p-2 text-white hover:underline hover:underline-offset-4 focus:underline focus:underline-offset-4"
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default SessionExpired;
