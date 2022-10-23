import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';

import {useState, useEffect} from 'react';

type SubmissionPayload = {
  domain: string;
  isTakenDown: boolean;
  screenshotUrl: string;
  urlscan?: string;
  implementer?: string;
};

const ReportForm = () => {
  const [rawDomains, setRawDomains] = useState('');
  const [domains, setDomains] = useState<string[] | []>([]);
  const [formatted, setFormatted] = useState<string>('');

  useEffect(() => {
    if (domains.length > 0 && Array.isArray(domains)) {
      const result = domains.join('\r\n');
      setFormatted(result);
    }
  }, [domains]);

  const handleChangeDomains = (event: React.ChangeEvent<HTMLInputElement>) => {
    const temp = event.target.value;
    setRawDomains(temp);
    const inputs = temp.split(',').filter(Boolean);

    const cleaned = inputs.map(input =>
      input.replace(/^\s+|\s+$/gm, '').replace(/^["'](.+(?=["']$))["']$/, '$1'),
    );

    setDomains(cleaned);
  };

  const [rawScreenshotUrls, setRawScreenshotUrls] = useState('');
  const [urls, setUrls] = useState<string[] | []>([]);

  const handleChangeScreenshotUrls = (event: React.ChangeEvent<HTMLInputElement>) => {
    const temp = event.target.value;
    setRawScreenshotUrls(temp);

    const formatted = temp
      .split(',')
      .filter(Boolean)
      .map(element => element.trim());
    setUrls(formatted);
  };

  const [implementers] = useState<string[] | []>(['Tim Janssen', 'frankywild', 'pastaMan']);
  const [selectedImplementer, setSelectedImplementer] = useState('');

  const handleChangeImplementer = (event: SelectChangeEvent<string>) => {
    setSelectedImplementer(event.target.value);
  };

  const [submissionPayload, setSubmissionPayload] = useState<SubmissionPayload[] | []>([]);

  const handleTakenDownChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const checked = event.target.checked;
    if (checked && value.length) {
      const updatedSubmissions = [...submissionPayload];
      const submission = updatedSubmissions.find(submission => submission.domain === value);
      if (submission) {
        submission.isTakenDown = checked;
      }
      setSubmissionPayload(updatedSubmissions);
    }
  };

  const [submittable, setSubmittable] = useState(false);

  const isInvalidSubmission = () => {
    if (
      domains.length > 0 &&
      urls.length > 0 &&
      domains.length === urls.length &&
      selectedImplementer.length > 0
    ) {
      setSubmittable(true);
      return false;
    } else {
      setSubmittable(false);
      return true;
    }
  };

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': {m: 1},
      }}
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-col gap-3">
        <FormControl sx={{m: 1, minWidth: 120}} size="small">
          <InputLabel id="demo-select-small">Implementer</InputLabel>
          <Select
            required
            error={selectedImplementer.length === 0}
            labelId="demo-select-small"
            id="demo-select-small"
            value={selectedImplementer}
            label="Implementer"
            onChange={handleChangeImplementer}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {implementers.map(implementer => (
              <MenuItem key={implementer} value={implementer}>
                {implementer}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
          value={rawDomains}
          onChange={handleChangeDomains}
        />
        <TextField
          label="Formatted domains"
          helperText="Check domain entries here"
          disabled
          value={formatted}
          multiline
          maxRows={5}
        />

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
          onChange={handleChangeScreenshotUrls}
        />

        {domains.map((domain, i) => (
          <FormControl key={`${domain}-${i}`}>
            <FormControlLabel
              label={domain}
              control={
                <Switch required color="primary" value={domain} onChange={handleTakenDownChecked} />
              }
            />
          </FormControl>
        ))}

        <Button disabled={isInvalidSubmission()} variant="contained" color="primary">
          Submit
        </Button>
      </div>
    </Box>
  );
};

export default ReportForm;
