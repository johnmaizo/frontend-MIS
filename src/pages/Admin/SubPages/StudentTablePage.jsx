// import StudentTablesOLD from "../../../components/api/StudentTablesOLD"
import StudentTables from "../../../components/api/StudentTables"
import { BreadcrumbResponsive } from "../../../components/reuseable/Breadcrumbs";
import DefaultLayout from "../../layout/DefaultLayout"

const StudentTablePage = () => {

  const NavItems = [
    { to: "/", label: "Dashboard" },
    // { to: "/students/add-student", label: "Add Student" },
    { label: "Student List" },
  ];

  return (
    <DefaultLayout>
      <BreadcrumbResponsive pageName={"Student List"} items={NavItems} ITEMS_TO_DISPLAY={2} />

      <StudentTables />
    </DefaultLayout>
  )
}

export default StudentTablePage