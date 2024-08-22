import { Link, useLocation, useNavigate } from "react-router-dom";
import BenedictoLogo from "../../assets/small.png";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../components/context/AuthContext";

import toast from "react-hot-toast";

import { EyeCancel, EyeIconSignIn, LogInImage } from "../../components/Icons";
import Loader from "../../components/styles/Loader";

const SignIn = () => {
  const motto = "Your education is our mission.";
  // const motto = "Your tuition, is our mission.";
  const loginText = "Sign in to MIS - Benedicto College";

  const { user, login, loading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

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
            <div className="flex flex-wrap items-center xl:mx-auto xl:w-[80em]">
              <div className="hidden w-full xl:block xl:w-1/2">
                <div className="px-26 py-17.5 text-center">
                  <img
                    src={BenedictoLogo}
                    alt="Benedicto College"
                    className="mb-5.5 inline-block text-center"
                    draggable={false}
                  />

                  <p className="2xl:px-20">{motto}</p>

                  <span className="mt-15 inline-block">
                    <LogInImage />
                  </span>
                </div>
              </div>

              <div className="w-full border-stroke xl:w-1/2 xl:border-l-2">
                <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                  {/* <span className="mb-1.5 block font-medium">Start for free</span> */}
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

                        <span className="absolute right-4 top-4">
                          <svg
                            className="fill-current"
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.5">
                              <path
                                d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                                fill=""
                              />
                            </g>
                          </svg>
                        </span>
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
                          onChange={(e) => setPassword(e.target.value)}
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
                        className={`inline-flex w-full items-center justify-center rounded-lg border border-primary p-3 text-xl text-white transition hover:bg-opacity-90 ${isLoading ? "bg-[#505456] hover:!bg-opacity-100" : "bg-primary"} gap-2`}
                        disabled={isLoading}
                      >
                        {isLoading && (
                          <span className="block h-6 w-6 animate-spin rounded-full border-4 border-solid border-secondary border-t-transparent"></span>
                        )}
                        {isLoading ? "Please wait..." : "Login"}
                      </button>
                    </div>

                    {/* <div className="mt-6 text-center">
                      <p>
                        Don’t have any account?{" "}
                        <Link
                          to="/auth/signup"
                          className="text-primary hover:underline focus:underline"
                        >
                          Sign Up
                        </Link>
                      </p>
                    </div> */}
                  </form>
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
