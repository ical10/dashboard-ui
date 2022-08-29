import {createTheme} from '@mui/material/styles';

const font = "'Lato', sans-serif";

const muiTheme = createTheme({
  typography: {
    fontFamily: font,
    button: {
      textTransform: 'none',
    },
  },
  palette: {
    primary: {
      main: 'hsla(328, 100%, 39%, 0.91)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',

          fontFamily: font,
          fontWeight: 700,
          fontSize: '28px',
          lineHeight: '33.6px',

          color: 'white',
        },
      },
    },
  },
});

export default muiTheme;
