import { Snackbar, Alert, AlertColor } from '@mui/material';

import { useState, useCallback } from 'react';

import { ReportForm, OpenSnackbarProps } from 'src/components/ReportForm';
import Statistics from 'src/components/ReportStatistics';
import Sidebar from 'src/components/Sidebar';

const ImplementersDetail = () => {
  const [snackbar, setSnackbar] = useState<OpenSnackbarProps | null>(null);
  const vertical = 'bottom';
  const horizontal = 'center';

  const handleOpenSnackbar = useCallback(({ message, type }: OpenSnackbarProps) => {
    setSnackbar({
      message,
      type,
    });
  }, []);

  const isOpen = Boolean(snackbar);

  const handleClose = () => {
    setSnackbar(null);
  };

  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="grid grid-cols-2">
        <div className="flex flex-col mt-6 mx-6">
          <div className="mb-12">
            <h1>Implementers Detail Page</h1>
            <h3 className="mt-12">Submit your details</h3>
          </div>
          <ReportForm onOpenSnackbar={handleOpenSnackbar} />
        </div>
        <div className="flex justify-center mt-6 mx-6">
          <Statistics />
        </div>
      </div>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        key={vertical + horizontal}
        open={isOpen}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={snackbar?.type as AlertColor} sx={{ width: '100%' }}>
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ImplementersDetail;
