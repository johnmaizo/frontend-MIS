import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb"
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