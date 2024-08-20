import StudentTables from "../../../components/api/StudentTables"
import { BreadcrumbResponsive } from "../../../components/reuseable/Breadcrumbs";
import DefaultLayout from "../../layout/DefaultLayout"

const TeacherTablePage = () => {

  const NavItems = [
    { to: "/", label: "Dashboard" },
    // { to: "/teachers/add-teacher", label: "Add Teacher" },
    { label: "Teacher List" },
  ];

  return (
    <DefaultLayout>
      <BreadcrumbResponsive pageName={"Teacher List"} items={NavItems} ITEMS_TO_DISPLAY={2} />

      <StudentTables />
    </DefaultLayout>
  )
}

export default TeacherTablePage