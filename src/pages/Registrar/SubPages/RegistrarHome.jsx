import DefaultLayout from "../../layout/DefaultLayout";

import HamsterProfile from "../../../assets/images/profile-maizo.jpg";
import {
  FloatingInput,
  FloatingLabel,
  FloatingLabelInput,
} from "../../../components/ui/floating-label-input";
import { Input } from "../../../components/ui/input";

const RegistrarHome = () => {
  return (
    <DefaultLayout>
      <>
        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-xl font-bold">Registrar Home Page</h3>
        </div>

        <div className="mt-6 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque, rem
          quisquam! Recusandae non dignissimos quibusdam cupiditate sit adipisci
          aspernatur in, aliquid, amet sint autem nam accusamus itaque nesciunt
          ipsum. Perferendis.
        </div>

        <div className="mt-6 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="mb-2 text-center text-3xl font-semibold text-red-600">
            😭 MISSING 😭
          </h3>
          <img
            src={HamsterProfile}
            alt=""
            draggable={false}
            className="animator mx-auto w-[25%]"
          />
          <p className="text-center text-xl font-semibold text-red-600">
            Reward: P1000.00
          </p>
        </div>

        <div className="mt-6 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div>
            <FloatingLabelInput id="gwapo" label="testing..."  />
          </div>
        </div>
      </>
    </DefaultLayout>
  );
};

export default RegistrarHome;
