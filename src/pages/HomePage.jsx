import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/AuthContext";
import Loader from "../components/styles/Loader";

const HomePage = () => {
  const currentpath = useLocation().pathname;
  const { user, loading } = useContext(AuthContext);
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

  return (
    <main className="flex h-screen flex-col items-center justify-center bg-purple-400 text-4xl font-semibold">
      {redirecting ? (
        <RedirectPage />
      ) : (
        <div>
          <h1 className="text-black">Welcome to Benedicto College!</h1>
          <Link to="/auth/signin" className="text-blue-600 hover:underline">
            Click here to log in!
          </Link>
        </div>
      )}
    </main>
  );
};

const RedirectPage = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <h3 className="text-2xl font-semibold text-black dark:text-white">
        You are already logged in. Redirecting...
      </h3>
    </div>
  );
};

export default HomePage;
