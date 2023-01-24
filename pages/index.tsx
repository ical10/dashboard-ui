import { useState } from 'react';

import { useSession } from 'next-auth/react';

import OverviewTable from 'src/components/OverviewTable';
import Sidebar from 'src/components/Sidebar';
import WalletModal from 'src/components/connect/WalletModal';

const Dashboard = () => {
  const { data: session, status } = useSession();

  const [isOpenModal, setOpenModal] = useState(false);

  const isAuthenticated = Boolean(session && status);

  const handleConnect = () => {
    setOpenModal(true);
  };

  return (
    <>
      <div className="flex flex-row">
        <Sidebar isAuthenticated={isAuthenticated} onConnect={handleConnect} />
        <div className="flex flex-col mt-6 mx-6">
          <div className="mb-12">
            <h1>Anti-scam Bounty</h1>
            <h3 className="mt-12">Overview</h3>
          </div>
          <OverviewTable />
        </div>
      </div>

      <WalletModal open={isOpenModal} onClose={() => setOpenModal(false)} />
    </>
  );
};

export default Dashboard;
