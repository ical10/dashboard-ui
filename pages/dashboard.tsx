import OverviewTable from 'src/components/OverviewTable';
import Sidebar from 'src/components/Sidebar';

const Dashboard = () => {
  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="flex flex-col mt-6 mx-6">
        <div className="mb-12">
          <h1>Anti-scam Bounty</h1>
          <h3 className="mt-12">Overview</h3>
        </div>
        <OverviewTable />
      </div>
    </div>
  );
};

export default Dashboard;
