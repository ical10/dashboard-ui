import RewardDetails from '@/components/RewardDetails';

import { useState } from 'react';

import { useSession } from 'next-auth/react';

import Sidebar from 'src/components/Sidebar';
import WalletModal from 'src/components/connect/WalletModal';

const RewardsDetail = () => {
  const { data: session, status } = useSession();

  const [isOpenModal, setOpenModal] = useState(false);

  const handleConnect = () => {
    setOpenModal(true);
  };

  const isAuthenticated = Boolean(session && status);

  return (
    <>
      <div className="flex flex-row min-h-screen">
        <Sidebar isAuthenticated={isAuthenticated} onConnect={handleConnect} />
        <div className="flex flex-row justify-center items-start mx-auto w-[720px]">
          <div className="flex flex-col mt-6 mx-6 w-full">
            <div className="mb-12">
              <h1>Rewards Detail Page</h1>
              <h3 className="mt-12">Check implementer&apos;s rewards here</h3>
            </div>
            <RewardDetails />
          </div>
        </div>
      </div>

      <WalletModal open={isOpenModal} onClose={() => setOpenModal(false)} />
    </>
  );
};

export default RewardsDetail;
