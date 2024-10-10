import { Link, useLocation, useNavigate } from "react-router-dom";
import BenedictoLogo from "../../assets/small.png";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../components/context/AuthContext";

import toast from "react-hot-toast";

import {
  EmailIcon,
  EyeCancel,
  EyeIconSignIn,
  LogInImage,
} from "../../components/Icons";
import Loader from "../../components/styles/Loader";
import Version from "../../components/Essentials/Version";

const SignIn = () => {
  const motto = "Your Education... Our Mission.";
  const loginText = "Sign in to MIS - Benedicto College";

  const { user, login, loading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  const currentpath = useLocation().pathname;
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(currentpath);
      setRedirecting(true);
    }
  }, [user, navigate, currentpath]);

  if (loading) {
    return <Loader />;
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCapsLock = (e) => {
    if (
      typeof e.getModifierState === "function" &&
      e.getModifierState("CapsLock")
    ) {
      setCapsLockOn(true);
    } else {
      setCapsLockOn(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error message
    setIsLoading(true);

    try {
      await toast.promise(login(email, password), {
        loading: "Signing in...",
        success: "Signed in successfully!",
        error: "Failed to sign in!",
      });
      setSuccess(true);
      setIsLoading(false);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setIsLoading(false);
    }
  };

  return (
    <main className="grid h-screen place-items-center bg-white">
      {redirecting || (user && !success) ? (
        <RedirectPage />
      ) : (
        !user && (
          <div className="w-full rounded-sm bg-white">
            <div className="flex flex-wrap items-center lg:mx-auto lg:w-[60em] xl:w-[80em]">
              <div className="block w-full lg:w-1/2">
                <div className="px-26 py-0 text-center md:py-17.5">
                  <img
                    src={BenedictoLogo}
                    alt="Benedicto College"
                    className="mb-5.5 inline-block text-center"
                    draggable={false}
                  />

                  <p className="hidden md:block 2xl:px-20">{motto}</p>

                  <span className="mt-15 hidden md:inline-block">
                    <LogInImage />
                  </span>
                </div>
              </div>

              <div className="w-full border-stroke lg:w-1/2 lg:border-l-2">
                <div className="w-full p-4 sm:p-12.5 lg:p-17.5">
                  <h2 className="text-2xl font-bold text-black sm:text-title-xl2">
                    {loginText}
                  </h2>
                  <p className="my-5">
                    Welcome back! Please enter your details
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label
                        htmlFor="email"
                        className="mb-2.5 block font-medium text-black"
                      >
                        Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          placeholder="Enter your email"
                          autoComplete="on"
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />

                        <EmailIcon />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="password"
                        className="mb-2.5 block font-medium text-black"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          id="password"
                          placeholder="Enter your password"
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)} // Just update the state
                          onKeyUp={handleCapsLock} // Only use handleCapsLock here
                          required
                        />

                        <span className="absolute right-2 top-2">
                          <button
                            type="button"
                            onClick={toggleShowPassword}
                            className="p-2"
                          >
                            {showPassword ? <EyeIconSignIn /> : <EyeCancel />}
                          </button>
                        </span>
                      </div>
                      {capsLockOn && (
                        <p className="mt-2 font-semibold text-red-600">
                          Warning: Caps Lock is on!
                        </p>
                      )}
                    </div>

                    <div className="mb-5">
                      {success && (
                        <p className="pb-4 font-semibold text-green-700">
                          Login successful! Redirecting...
                        </p>
                      )}
                      {error && (
                        <p className="pb-4 font-semibold text-red-700">
                          {error}
                        </p>
                      )}

                      <button
                        type="submit"
                        className={`inline-flex w-full items-center justify-center rounded-lg border border-primary p-3 text-xl text-white transition hover:bg-opacity-90 ${
                          isLoading
                            ? "bg-[#505456] hover:!bg-opacity-100"
                            : "bg-primary"
                        } gap-2`}
                        disabled={isLoading}
                      >
                        {isLoading && (
                          <span className="block h-6 w-6 animate-spin rounded-full border-4 border-solid border-secondary border-t-transparent"></span>
                        )}
                        {isLoading ? "Please wait..." : "Login"}
                      </button>
                    </div>
                  </form>

                  <Version />
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </main>
  );
};

const RedirectPage = () => {
  return (
    <div className="grid h-screen w-full place-content-center bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <h3 className="text-2xl font-semibold text-black dark:text-white">
        You&apos;re already logged in. Redirecting...
      </h3>
    </div>
  );
};


export default SignIn;
