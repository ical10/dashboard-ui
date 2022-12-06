import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';

import React, { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

type FormData = {
  domains: string[];
  isTakenDowns: boolean[];
  screenshotUrls: string[];
  urlscan?: string;
  implementer: string;
};

type SubmissionPayload = {
  domain: string;
  isTakenDown: boolean;
  screenshotUrl: string;
  urlscan?: string;
  implementer?: string;
};

const ReportForm = () => {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      implementer: '',
      domains: [],
      isTakenDowns: [],
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data, event) => {
    if (event) {
      event.preventDefault();
      console.log('the data is: ', { data });
    }
  };

  const [domains, setDomains] = useState<string[] | []>([]);
  const [formatted, setFormatted] = useState<string>('');

  useEffect(() => {
    if (domains.length > 0 && Array.isArray(domains)) {
      const result = domains.join('\r\n');
      setFormatted(result);
    }
  }, [domains]);

  const [rawScreenshotUrls, setRawScreenshotUrls] = useState('');
  const [urls, setUrls] = useState<string[] | []>([]);

  const [implementers] = useState<string[] | []>(['Tim Janssen', 'frankywild', 'pastaMan']);
  const [selectedImplementer, setSelectedImplementer] = useState('');

  const [submissionPayload, setSubmissionPayload] = useState<SubmissionPayload[] | []>([]);

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
                error={selectedImplementer.length === 0}
                labelId="demo-select-small"
                id="demo-select-small"
                value={value}
                onChange={onChange}
                label="Implementer"
              >
                {implementers.map(implementer => (
                  <MenuItem key={implementer} value={implementer}>
                    {implementer}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>

        <Controller
          name="domains"
          control={control}
          render={({ field: { onChange } }) => (
            <TextField
              required
              error={
                domains.length === 0 ||
                (domains.length > 0 && urls.length > 0 && domains.length !== urls.length)
              }
              id="outlined-required"
              label="Domain"
              helperText={
                domains.length === 0 ||
                (domains.length > 0 && urls.length > 0 && domains.length !== urls.length)
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
              error={
                urls.length === 0 ||
                (domains.length > 0 && urls.length > 0 && domains.length !== urls.length)
              }
              id="outlined-required"
              label="Screenshot URLs"
              helperText={
                urls.length === 0 ||
                (domains.length > 0 && urls.length > 0 && domains.length !== urls.length)
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

        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </div>
    </Box>
  );
};

export default ReportForm;
