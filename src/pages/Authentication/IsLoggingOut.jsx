import { useContext } from "react";
import { AuthContext } from "../../components/context/AuthContext";

const IsLoggingOut = () => {
  const { setIsLoggingOut, handleLogout } = useContext(AuthContext);

  return (
    <div className="fixed z-[10005] grid h-screen w-screen place-content-center bg-black/50 backdrop-blur-sm">
      <div
        className="mb-4 rounded-lg border border-stroke bg-white p-4 text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:text-white"
        tabIndex={-1}
      >
        <h2 className="text-2xl font-semibold">
          Are you sure you want to log out?
        </h2>
        <p>You will be logged out of your account.</p>
        <div className="flex gap-4">
          <button
            onClick={handleLogout}
            className="mt-4 w-full rounded-md bg-blue-600 p-2 text-white hover:underline hover:underline-offset-4 focus:underline focus:underline-offset-4"
          >
            Log Out
          </button>
          <button
            onClick={() => setIsLoggingOut(false)}
            className="mt-4 w-full rounded-md bg-red-600 p-2 text-white hover:underline hover:underline-offset-4 focus:underline focus:underline-offset-4"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default IsLoggingOut;
