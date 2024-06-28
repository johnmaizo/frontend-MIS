import {useContext} from "react";
import {Link} from "react-router-dom";
import {AuthContext} from "../components/context/AuthContext";

const  HomePage = () => {
  const {user} = useContext(AuthContext);

  return (
    <main className=" h-screen grid place-content-center bg-purple-400 text-4xl font-semibold text-center">
      {user ? (
        <div className="grid h-screen w-screen place-content-center bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-2xl font-semibold text-black dark:text-white">
            You&apos;re already logged in. Redirecting...
          </h3>
        </div>
      ) : (
        <div>
          <h1 className=" text-black">Welcome to Benedicto College!</h1>
          <Link to={"/auth/signin"} className=" text-blue-600 hover:underline">
            Click here to log-in!
          </Link>
        </div>
      )}
    </main>
  );
};

export default HomePage;
