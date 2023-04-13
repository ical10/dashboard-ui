import LoadingButton from '@mui/lab/LoadingButton';
import {
  Skeleton,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Switch,
  TextField,
} from '@mui/material';

import React, { useState } from 'react';

import { useSession } from 'next-auth/react';

import { OpenSnackbarProps } from './types';

import { InputFormProps } from 'pages/curators/edit';

type CurateFormProps = {
  curateFormData: InputFormProps;
  isLoading: boolean;
  onOpenSnackbar?: (props: OpenSnackbarProps) => void;
};

export const CurateForm = ({ onOpenSnackbar, curateFormData, isLoading }: CurateFormProps) => {
  const { domainname, pull_request_id, proof, takendown, id } = curateFormData;

  // TODO: show identifier as muted value
  //   const [implementer, setImplementer] = useState<string | null>(null);
  // TODO: check if takendown has changed from initial value
  const [isConfirmedTakenDown, setConfirmedTakenDown] = useState(takendown);
  const [eligible, setEligible] = useState(false);
  const [comment, setComment] = useState('');

  const { data: session } = useSession();

  const [sendingSubmission, setSendingSubmission] = useState(false);

  const handleAsyncSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    setSendingSubmission(true);

    try {
      if (session) {
        const { sig, address } = session.user;

        const payload = {
          confirmed_takendown: isConfirmedTakenDown,
          eligible,
          comment,
        };

        const fullSubmissionPayload = {
          payload,
          address: address,
        };

        const resp = await fetch(`/api/curators/edit/${id}`, {
          method: 'POST',
          body: JSON.stringify(fullSubmissionPayload),
          headers: {
            Authorization: sig,
          },
        });

        const { data } = await resp.json();
        const { status, message } = data;
        if (status === 1) {
          onOpenSnackbar &&
            onOpenSnackbar({
              message,
              type: 'success',
            });
        } else {
          onOpenSnackbar &&
            onOpenSnackbar({
              message,
              type: 'error',
            });
        }
      }
    } catch (error) {
      console.warn({ error });
    } finally {
      setSendingSubmission(false);
    }
  };

  if (isLoading) return <Skeleton variant="rounded" width={900} height={400} />;

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1 },
      }}
      noValidate
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleAsyncSubmit(e)}
      autoComplete="off"
    >
      <div className="flex flex-col gap-3">
        <label>PR ID:</label>
        <a
          href={`https://github.com/polkadot-js/phishing/pull/${pull_request_id}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          {pull_request_id}
        </a>

        <label>Full scam URL:</label>
        <a href={`${domainname}`} target="_blank" rel="noreferrer noopener">
          {domainname}
        </a>

        <label>Proof URL:</label>

        {proof && (
          <a href={proof} target="_blank" rel="noreferrer noopener">
            {proof}
          </a>
        )}

        <FormControl key={'confirmed-takendown'}>
          <FormLabel component="label">Toggle right to confirm as taken down</FormLabel>
          <FormControlLabel
            name={'confirmed-takendown'}
            label={'confirmed taken down'}
            control={
              <Switch
                required
                color="primary"
                value={isConfirmedTakenDown}
                onChange={event => {
                  const { checked } = event.target;
                  setConfirmedTakenDown(checked);
                }}
              />
            }
          />
        </FormControl>

        <FormControl key={'eligible'}>
          <FormLabel component="label">Toggle right to confirm as eligible</FormLabel>
          <FormControlLabel
            label={'site is eligible'}
            control={
              <Switch
                required
                color="primary"
                value={eligible}
                onChange={event => {
                  const { checked } = event.target;
                  setEligible(checked);
                }}
              />
            }
          />
        </FormControl>

        <TextField
          id="comment-required"
          multiline
          value={comment}
          onChange={e => setComment(e.target.value)}
          helperText="Add your comments here"
        />

        {sendingSubmission ? (
          <LoadingButton
            loading
            loadingIndicator="Loading…"
            variant="contained"
            sx={{ height: '46px' }}
          />
        ) : (
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        )}
      </div>
    </Box>
  );
};
