import Breadcrumb from "../../../components/Sundoganan/Breadcrumbs/Breadcrumb"
// import StudentTablesOLD from "../../../components/api/StudentTablesOLD"
import StudentTables from "../../../components/api/StudentTables"
import DefaultLayout from "../../layout/DefaultLayout"

const StudentTablePage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="View Student" />

      <StudentTables />
    </DefaultLayout>
  )
}

export default StudentTablePage