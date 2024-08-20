import AddStudent from "../../../components/api/AddStudent";
import { BreadcrumbResponsive } from "../../../components/reuseable/Breadcrumbs";
import DefaultLayout from "../../layout/DefaultLayout";

const AddStudentPage = () => {
  const NavItems = [
    { to: "/", label: "Dashboard" },
    // { to: "/students/add-student", label: "Add Student" },
    { label: "Add Student" },
  ];

  return (
    <DefaultLayout>
      <BreadcrumbResponsive pageName={"Add Student"} items={NavItems} ITEMS_TO_DISPLAY={2} />

      <AddStudent />
    </DefaultLayout>
  );
};

export default AddStudentPage;
