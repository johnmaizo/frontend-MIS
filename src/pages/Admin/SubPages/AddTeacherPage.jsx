import AddStudent from "../../../components/api/AddStudent";
import { BreadcrumbResponsive } from "../../../components/reuseable/Breadcrumbs";
import DefaultLayout from "../../layout/DefaultLayout";

const AddTeacherPage = () => {
  const NavItems = [
    { to: "/", label: "Dashboard" },
    // { to: "/teachers/add-teacher", label: "Add Teacher" },
    { label: "Add Teacher" },
  ];

  return (
    <DefaultLayout>
      <BreadcrumbResponsive pageName={"Add Teacher"} items={NavItems} ITEMS_TO_DISPLAY={2} />

      <AddStudent />
    </DefaultLayout>
  );
};

export default AddTeacherPage;
