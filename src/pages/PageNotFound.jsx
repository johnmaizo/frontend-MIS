
import { useNavigate } from "react-router-dom";

import NotFoundImage from "../assets/404.svg";
import DefaultLayout from "./layout/DefaultLayout";

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <DefaultLayout>
      <div className="col-span-12 grid h-full place-content-center rounded-sm border border-stroke bg-white px-4 py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
        <div>
          <div className="text-center">
            <img src={NotFoundImage} alt="" aria-hidden draggable={false} />

            <h1 className="text-gray-900 mt-6 text-2xl font-bold tracking-tight sm:text-4xl">
              Uh-oh! We can&apos;t find that page.
            </h1>

            <p className="text-gray-500 mt-4">
              Try searching again, or return home to start from the beginning.
            </p>
            <button
              className="mt-6 inline-block rounded bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 hover:underline focus:underline focus:outline-none focus:ring"
              onClick={() => navigate(-1)}
            >
              Go Back Home
            </button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default PageNotFound;
