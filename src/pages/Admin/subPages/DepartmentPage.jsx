import DepartmentTables from "../../../components/api/DepartmentTables";
import { BreadcrumbResponsive } from "../../../components/reuseable/Breadcrumbs";
import DefaultLayout from "../../layout/DefaultLayout"

const DepartmentPage = () => {

  const NavItems = [
    { to: "/", label: "Dashboard" },
    // { to: "/departments/add-department", label: "Add Department" },
    { label: "Department" },
  ];

  return (
    <DefaultLayout>
      <BreadcrumbResponsive pageName={"Departments"} items={NavItems} ITEMS_TO_DISPLAY={2} />

      <DepartmentTables />
    </DefaultLayout>
  )
}

export default DepartmentPage