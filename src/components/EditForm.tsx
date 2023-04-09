import LoadingButton from '@mui/lab/LoadingButton';
import {
  Skeleton,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from '@mui/material';

import React, { useState, useEffect } from 'react';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import axios from 'axios';
import { UrlDataProps } from 'src/types/submission';
import useSWR from 'swr';

export type OpenSnackbarProps = {
  message: string;
  type?: string;
};

type EditFormProps = {
  onOpenSnackbar?: (props: OpenSnackbarProps) => void;
  editedUrlData?: UrlDataProps;
};

const URL = 'https://antiscam-api.paranodes.io';
const fetcher = (url: string) => axios.get(url).then(res => res.data);

//TODO: should create a different form for editing submissions, add ?Edit params
export const EditForm = ({ onOpenSnackbar }: EditFormProps) => {
  const { data: session } = useSession();
  const router = useRouter();

  const id = router.query['submission_id'];

  const { data: editedUrlData, isLoading } = useSWR(`${URL}/find/${id}`, fetcher);

  const [implementer, setImplementer] = useState<string | null>(null);
  const [domain, setDomain] = useState<string | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [isTakenDown, setTakenDown] = useState(false);
  const [pullRequestId, setPullRequestId] = useState<string | null>(null);

  const [sendingSubmission, setSendingSubmission] = useState(false);

  console.log({ editedUrlData });

  useEffect(() => {
    if (editedUrlData) {
      const { url_data } = editedUrlData.data;
      if (!url_data.proof || !url_data.pull_request_id) {
        return;
      }
      const { domainname, pull_request_id, proof } = url_data;
      setDomain(domainname);
      setPullRequestId(pull_request_id);
      setScreenshotUrl(proof);
    }
  }, [editedUrlData]);

  const handleAsyncSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    setSendingSubmission(true);

    try {
      if (session) {
        const { sig, address } = session.user;

        const payload = {
          pull_request_id: Number(pullRequestId) ?? '',
          domainname: domain,
          takendown: isTakenDown,
          proof: screenshotUrl,
        };

        const fullSubmissionPayload = {
          payload,
          address: address,
        };

        const resp = await fetch(`/api/implementers/edit/${id}`, {
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

  if (!domain || !screenshotUrl) return null;

  const isPRIdError = Boolean(pullRequestId !== null && pullRequestId.length === 0);

  const isDomainError = typeof domain !== 'string';
  const isUrlError = typeof screenshotUrl !== 'string';

  const isImplementerError = !implementer;
  const isFormInvalid = isDomainError || isUrlError || isImplementerError;

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
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-select-small">Implementer</InputLabel>
          <Select
            required
            labelId="demo-select-small"
            id="demo-select-small"
            value={implementer}
            onChange={event => {
              const implementer = event.target.value;
              setImplementer(implementer);
            }}
            label="Implementer"
          >
            <MenuItem key={session?.user.address} value={session?.user.address}>
              {session?.user.address}
            </MenuItem>
          </Select>
          <FormHelperText error={isImplementerError}>
            {isImplementerError ? 'Please select the implementer!' : ''}
          </FormHelperText>
        </FormControl>

        <TextField
          required
          type="number"
          error={isPRIdError}
          id="outlined-required"
          label="PR number, e.g. 2021"
          helperText={isUrlError ? 'Please submit only PR number' : 'Input PR number here'}
          value={pullRequestId}
          onChange={event => {
            const temp = event.target.value;
            setPullRequestId(temp);
          }}
        />

        <TextField
          required
          value={domain}
          error={isDomainError}
          id="outlined-required"
          label="Multiline domains, e.g. https://scam.site/wallets, https://scam.xyz/en"
          helperText={
            isDomainError
              ? 'Submitted urls and domains must have same length and not be empty!'
              : 'Input domain here'
          }
          multiline
          maxRows={5}
          onChange={event => {
            const temp = event.target.value;
            setDomain(temp);
          }}
        />

        <TextField
          required
          error={isUrlError}
          id="outlined-required"
          label="Screenshot URLs, e.g. https://github-image.com/image-1, https://github-image.com/image-2"
          helperText={
            isUrlError
              ? 'Submitted urls and domains must have same length and not be empty!'
              : 'Paste screenshot urls here'
          }
          multiline
          value={screenshotUrl}
          onChange={event => {
            const temp = event.target.value;
            setScreenshotUrl(temp);
          }}
        />

        <FormControl key={domain}>
          <FormLabel component="label">Toggle right to mark as taken down</FormLabel>
          <FormControlLabel
            label={domain}
            control={
              <Switch
                required
                color="primary"
                value={domain}
                onChange={event => {
                  const { checked } = event.target;
                  setTakenDown(checked);
                }}
              />
            }
          />
        </FormControl>

        {sendingSubmission ? (
          <LoadingButton
            loading
            loadingIndicator="Loading…"
            variant="contained"
            sx={{ height: '46px' }}
          />
        ) : (
          <Button disabled={isFormInvalid} variant="contained" color="primary" type="submit">
            Resubmit
          </Button>
        )}
      </div>
    </Box>
  );
};
