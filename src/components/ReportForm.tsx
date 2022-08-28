import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';

import {TickSquare, CloseSquare} from 'iconsax-react';

const ReportForm = () => {
  const handleClickConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log('confirmed!');
  };

  const handleClickNotConfirmed = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log('confirmed!');
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
        <TextField
          required
          id="outlined-required"
          label="Urlscan Link"
          helperText="Input Urlscan Link here"
        />
        <TextField required id="outlined-required" label="Domain" helperText="Input domain here" />
        <TextField
          required
          id="outlined-required"
          label="Github PR"
          helperText="Input GitHub PR link here"
        />
        <p>Domain taken down</p>
        <div className="flex flex-row">
          <IconButton
            onClick={handleClickConfirm}
            color="primary"
            aria-label="confirm"
            component="label"
          >
            <TickSquare size="32" color="#FF8A65" />
          </IconButton>
          <IconButton onClick={handleClickNotConfirmed} aria-label="not-confirmed">
            <CloseSquare size="32" color="#FF8A65" />
          </IconButton>
        </div>
        <Button variant="contained" color="primary">
          Submit
        </Button>
      </div>
    </Box>
  );
};

export default ReportForm;
