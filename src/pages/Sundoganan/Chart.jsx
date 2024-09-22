import Breadcrumb from '../../components/Sundoganan/Breadcrumbs/Breadcrumb';
import ChartOne from '../../components/Sundoganan/Charts/ChartOne';
// import ChartThree from '../../components/reuseable/PieChartDpartment';
import ChartTwo from '../../components/Sundoganan/Charts/ChartTwo';
import DefaultLayout from '../layout/DefaultLayout'
const Chart = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Chart" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        {/* <ChartThree /> */}
      </div>
    </DefaultLayout>
  );
};

export default Chart;
