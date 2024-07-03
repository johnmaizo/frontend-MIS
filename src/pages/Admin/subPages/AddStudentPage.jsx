import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import AddStudent from "../../../components/api/AddStudent";
import DefaultLayout from "../../layout/DefaultLayout";

const AddStudentPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Add Student Page" />

      {/* <div className="mt-6 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark"></div> */}
      <AddStudent />
    </DefaultLayout>
  );
};

export default AddStudentPage;
