import AddStudent from "../../../components/api/AddStudent";
import UserTables from "../../../components/api/UserTables";
import DefaultLayout from "../../layout/DefaultLayout";

const StudentHome = () => {
  return (
    <DefaultLayout>
      <main>
        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-xl font-bold">GWAPO KO</h3>
        </div>

        <div className="mt-6">
          <UserTables />
        </div>


        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark mt-6">
          <AddStudent />
        </div>
        
      </main>
    </DefaultLayout>
  );
};

export default StudentHome;
