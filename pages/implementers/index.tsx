import { Snackbar, Alert, AlertColor } from '@mui/material';

import { useState, useCallback } from 'react';

import { useSession } from 'next-auth/react';

import { ReportForm } from 'src/components/ReportForm';
import Sidebar from 'src/components/Sidebar';
import WalletModal from 'src/components/connect/WalletModal';
import { OpenSnackbarProps } from 'src/components/types';

const ImplementersDetail = () => {
  const { data: session, status } = useSession();

  const [snackbar, setSnackbar] = useState<OpenSnackbarProps | null>(null);
  const vertical = 'bottom';
  const horizontal = 'center';

  const [isOpenModal, setOpenModal] = useState(false);

  const handleOpenSnackbar = useCallback(({ message, type }: OpenSnackbarProps) => {
    setSnackbar({
      message,
      type,
    });
  }, []);

  const handleClose = () => {
    setSnackbar(null);
  };

  const handleConnect = () => {
    setOpenModal(true);
  };

  const isOpen = Boolean(snackbar);
  const isAuthenticated = Boolean(session && status);

  return (
    <>
      <div className="flex flex-row min-h-screen">
        <Sidebar isAuthenticated={isAuthenticated} onConnect={handleConnect} />
        <div className="flex flex-row justify-center items-start mx-auto w-[720px]">
          <div className="flex flex-col mt-6 mx-6 w-full">
            <div className="mb-12">
              <h1>Implementers Detail Page</h1>
              <h3 className="mt-12">Submit your details</h3>
            </div>
            <ReportForm onOpenSnackbar={handleOpenSnackbar} />
          </div>
          {
            // <div className="flex justify-center mt-6 mx-6">
            //   <Statistics />
            // </div>
          }
        </div>

        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          key={vertical + horizontal}
          open={isOpen}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={snackbar?.type as AlertColor}
            sx={{ width: '100%' }}
          >
            {snackbar?.message}
          </Alert>
        </Snackbar>
      </div>

      <WalletModal open={isOpenModal} onClose={() => setOpenModal(false)} />
    </>
  );
};

export default ImplementersDetail;
