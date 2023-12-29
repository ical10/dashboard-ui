import LoadingButton from '@mui/lab/LoadingButton';
import {
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

import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { useSession } from 'next-auth/react';

import { OpenSnackbarProps } from './types';

import { UrlDataProps } from 'src/types/submission';

type FormData = {
  domains: string[];
  isTakenDowns: boolean[];
  screenshotUrls: string[];
  urlscan?: string;
  implementer: string;
  pullRequestId: string;
};

type SubmissionAPIPayload = {
  pull_request_id: number;
  domainname: string;
  isTakendown: boolean;
  proof: string;
};

type ReportFormProps = {
  onOpenSnackbar?: (props: OpenSnackbarProps) => void;
  editedUrlData?: UrlDataProps;
};

export const ReportForm = ({ onOpenSnackbar, editedUrlData }: ReportFormProps) => {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      implementer: '',
      pullRequestId: '',
      domains: [],
      isTakenDowns: [],
    },
  });

  const { data: session } = useSession();

  const onSubmit: SubmitHandler<FormData> = (data, event) => {
    if (event) {
      event.preventDefault();

      const { pullRequestId, domains, isTakenDowns, screenshotUrls } = data;

      const submissionPayload: SubmissionAPIPayload[] = domains.map((x, i) => {
        return {
          pull_request_id: Number(pullRequestId) ?? '',
          domainname: x ?? '',
          isTakendown: isTakenDowns[i] ?? false,
          proof: !screenshotUrls ? urls[0] : screenshotUrls[i] ?? '',
        };
      });

      setSubmissionPayload(submissionPayload);
    }
  };

  const [implementer, setImplementer] = useState<string | null>(null);
  const [domains, setDomains] = useState<string[] | []>([]);
  const [formatted, setFormatted] = useState<string>('');

  useEffect(() => {
    if (domains.length > 0 && Array.isArray(domains)) {
      const result = domains.join('\r\n');
      setFormatted(result);
    }
  }, [domains]);

  const [rawScreenshotUrls, setRawScreenshotUrls] = useState<string | null>('');
  const [urls, setUrls] = useState<string[] | []>([]);

  const [pullRequestId, setPullRequestId] = useState<string | null>(null);

  const [submissionPayload, setSubmissionPayload] = useState<SubmissionAPIPayload[] | null>(null);

  const [sendingSubmission, setSendingSubmission] = useState(false);

  useEffect(() => {
    if (editedUrlData) {
      setDomains([...domains, editedUrlData.domainname]);
      if (!editedUrlData.proof) {
        return;
      }
      setRawScreenshotUrls(editedUrlData.proof);
      //TODO: extract this to string utils
      const formatted = editedUrlData.proof
        .split(',')
        .filter(Boolean)
        .map(element => element.trim());

      setUrls(formatted);
    }
  }, [editedUrlData]);

  const handleAsyncSubmit = async (submissionPayload: SubmissionAPIPayload[]) => {
    setSendingSubmission(true);

    try {
      if (session) {
        const { sig, address } = session.user;

        const fullSubmissionPayload = {
          payload: [...submissionPayload],
          address: address,
        };

        const resp = await fetch('/api/implementers', {
          method: 'POST',
          body: JSON.stringify(fullSubmissionPayload),
          headers: {
            Authorization: sig,
          },
        });

        const { data } = await resp.json();
        const { status, message } = data;

        if (status === 0) {
          onOpenSnackbar &&
            onOpenSnackbar({
              message,
              type: 'error',
            });
        }

        if (status === 1) {
          onOpenSnackbar &&
            onOpenSnackbar({
              message,
              type: 'success',
            });
        }
      }
    } catch (error) {
      console.warn({ error });
    } finally {
      setSendingSubmission(false);
    }
  };

  useEffect(() => {
    if (submissionPayload) handleAsyncSubmit(submissionPayload);
  }, [submissionPayload]);

  const isPRIdError = Boolean(pullRequestId !== null && pullRequestId.length === 0);

  const isDomainError = Boolean(
    domains.length === 0 ||
      (domains.length > 0 && urls.length > 0 && domains.length !== urls.length),
  );

  const isUrlError = Boolean(
    urls.length === 0 || (domains.length > 0 && urls.length > 0 && domains.length !== urls.length),
  );

  const isImplementerError = !implementer;

  const isFormInvalid = isDomainError || isUrlError || isImplementerError;

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1 },
      }}
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
    >
      <div className="flex flex-col gap-3">
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-select-small">Implementer</InputLabel>
          <Controller
            name="implementer"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Select
                required
                labelId="demo-select-small"
                id="demo-select-small"
                value={value}
                onChange={event => {
                  const implementer = event.target.value;

                  setImplementer(implementer);
                  onChange(event);
                }}
                label="Implementer"
              >
                <MenuItem key={session?.user.address} value={session?.user.address}>
                  {session?.user.address}
                </MenuItem>
              </Select>
            )}
          />
          <FormHelperText error={isImplementerError}>
            {isImplementerError ? 'Please select the implementer!' : ''}
          </FormHelperText>
        </FormControl>

        <Controller
          name="pullRequestId"
          control={control}
          render={({ field: { onChange } }) => (
            <TextField
              type="number"
              required
              error={isPRIdError}
              id="outlined-required"
              label="PR number, e.g. 2021"
              helperText={isUrlError ? 'Please submit only PR number' : 'Input PR number here'}
              value={pullRequestId}
              onChange={event => {
                const temp = event.target.value;
                onChange(temp);
                setPullRequestId(temp);
              }}
            />
          )}
        />

        <Controller
          name="domains"
          control={control}
          render={({ field: { onChange } }) => (
            <TextField
              required
              value={domains}
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
                const inputs = temp.split(',').filter(Boolean);

                const cleaned = inputs.map(input =>
                  input.replace(/^\s+|\s+$/gm, '').replace(/^["'](.+(?=["']$))["']$/, '$1'),
                );

                onChange(cleaned);
                setDomains(cleaned);

                const formatted = cleaned.join('\r\n');
                setFormatted(formatted);
              }}
            />
          )}
        />

        <TextField
          label="Formatted domains"
          helperText="Check domain entries here"
          disabled
          value={formatted}
          multiline
          maxRows={5}
        />

        <Controller
          name="screenshotUrls"
          control={control}
          render={({ field: { onChange } }) => (
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
              value={rawScreenshotUrls}
              onChange={event => {
                const temp = event.target.value;
                setRawScreenshotUrls(temp);

                const formatted = temp
                  .split(',')
                  .filter(Boolean)
                  .map(element => element.trim());
                onChange(formatted);
                setUrls(formatted);
              }}
            />
          )}
        />

        {domains.map((domain, i) => (
          <Controller
            key={`${domain}-${i}`}
            name="isTakenDowns"
            control={control}
            render={({ field: { value, onChange } }) => (
              <FormControl>
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

                        const myArray = [...value];
                        myArray[i] = checked;

                        onChange(myArray);
                      }}
                    />
                  }
                />
              </FormControl>
            )}
          />
        ))}

        {sendingSubmission ? (
          <LoadingButton
            loading
            loadingIndicator="Loading…"
            variant="contained"
            sx={{ height: '46px' }}
          />
        ) : (
          <Button disabled={isFormInvalid} variant="contained" color="primary" type="submit">
            Submit
          </Button>
        )}
      </div>
    </Box>
  );
};
