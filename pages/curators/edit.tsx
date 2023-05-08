import { Snackbar, Alert, AlertColor } from '@mui/material';

import { useState, useCallback } from 'react';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import axios from 'axios';
import { CurateForm } from 'src/components/CurateForm';
import Sidebar from 'src/components/Sidebar';
import WalletModal from 'src/components/connect/WalletModal';
import { OpenSnackbarProps } from 'src/components/types';
import { UrlDataProps } from 'src/types/submission';
import useSWR from 'swr';

const URL = 'https://antiscam-api.paranodes.io';
const fetcher = (url: string) => axios.get(url).then(res => res.data);

export type InputFormProps = Pick<
  UrlDataProps,
  'domainname' | 'pull_request_id' | 'proof' | 'takendown' | 'id'
>;

const CurateSubmissionPage = () => {
  const { data: session, status } = useSession();

  const router = useRouter();
  const id = router.query['submission_id'];

  const { data: curatedUrlData, isLoading } = useSWR(`${URL}/find/${id}`, fetcher);
  const {
    id: domainname_id,
    domainname,
    pull_request_id,
    proof,
    takendown,
  } = curatedUrlData?.data?.url_data || {};

  const curateFormData = {
    id: domainname_id,
    domainname,
    pull_request_id,
    proof,
    takendown,
  } as InputFormProps;

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
              <h1>Curators Detail Page</h1>
              <h3 className="mt-12">Curate a submission</h3>
            </div>
            <CurateForm
              onOpenSnackbar={handleOpenSnackbar}
              curateFormData={curateFormData}
              isLoading={isLoading}
            />
          </div>
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

export default CurateSubmissionPage;
