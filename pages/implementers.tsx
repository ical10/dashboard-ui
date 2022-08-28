import ReportForm from 'src/components/ReportForm';
import Statistics from 'src/components/ReportStatistics';
import Sidebar from 'src/components/Sidebar';

const ImplementersDetail = () => {
  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="flex flex-col mt-6 mx-6">
        <div className="mb-12">
          <h1>Implementers Detail Page</h1>
          <h3 className="mt-12">Submit your details</h3>
        </div>
        <ReportForm />
      </div>
      <div>
        <Statistics />
      </div>
    </div>
  );
};

export default ImplementersDetail;
