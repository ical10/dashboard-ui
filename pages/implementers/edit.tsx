import { Snackbar, Alert, AlertColor } from '@mui/material';

import { useState, useCallback } from 'react';

import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';

import { EditForm, OpenSnackbarProps } from 'src/components/EditForm';
import Sidebar from 'src/components/Sidebar';
import WalletModal from 'src/components/connect/WalletModal';
import { getASubmission } from 'src/lib/api/queries';
import { UrlDataProps } from 'src/types/submission';

type EditSubmissionPageProps = {
  urlData: UrlDataProps;
};

const EditSubmissionPage = (props: EditSubmissionPageProps) => {
  const { urlData } = props;
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
              <h3 className="mt-12">Edit your submission</h3>
            </div>
            <EditForm onOpenSnackbar={handleOpenSnackbar} editedUrlData={urlData} />
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

export const getServerSideProps: GetServerSideProps = async context => {
  const id = context.query['submission_id'] as string;

  const urlData = await getASubmission(id);

  // Return the ID to the component
  return {
    props: {
      urlData,
    },
  };
};

export default EditSubmissionPage;
