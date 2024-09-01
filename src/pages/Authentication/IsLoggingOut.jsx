import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../components/context/AuthContext";

const IsLoggingOut = () => {
  const { setIsLoggingOut, handleLogout } = useContext(AuthContext);
  const [focusedButton, setFocusedButton] = useState(0);
  const buttonsRef = useRef([]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        // Navigate between buttons using arrow keys
        setFocusedButton((prevIndex) =>
          event.key === "ArrowRight"
            ? (prevIndex + 1) % buttonsRef.current.length
            : (prevIndex - 1 + buttonsRef.current.length) % buttonsRef.current.length
        );
      } else if (event.key === "Enter") {
        // Trigger the focused button's action when "Enter" is pressed
        buttonsRef.current[focusedButton]?.click();
      } else if (event.key === "Escape") {
        // Trigger the Cancel action when "Esc" is pressed
        setIsLoggingOut(false);
      }
    };

    // Focus the initially focused button
    buttonsRef.current[focusedButton]?.focus();

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedButton]);

  return (
    <div className="fixed z-[10005] grid h-screen w-screen place-content-center bg-black/50 backdrop-blur-sm">
      <div
        className="mx-5 mb-4 rounded-lg border border-stroke bg-white p-6 text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:text-white md:mx-0"
        tabIndex={-1}
      >
        <h2 className="text-2xl font-semibold">
          Are you sure you want to log out?
        </h2>
        <p>You will be logged out of your account.</p>
        <div className="flex gap-4">
          <button
            ref={(el) => (buttonsRef.current[0] = el)}
            onClick={handleLogout}
            className={`mt-4 w-full rounded-md bg-blue-600 p-2 text-white hover:underline hover:underline-offset-4 focus:underline focus:underline-offset-4 ${
              focusedButton === 0 ? "outline-none ring-2 ring-blue-600" : ""
            }`}
          >
            Log Out
          </button>
          <button
            ref={(el) => (buttonsRef.current[1] = el)}
            onClick={() => setIsLoggingOut(false)}
            className={`mt-4 w-full rounded-md bg-red-600 p-2 text-white hover:underline hover:underline-offset-4 focus:underline focus:underline-offset-4 ${
              focusedButton === 1 ? "outline-none ring-2 ring-red-600" : ""
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default IsLoggingOut;
