import createCache from '@emotion/cache';
import {CacheProvider} from '@emotion/react';
import {ThemeProvider, StyledEngineProvider} from '@mui/material/styles';

import type {AppProps} from 'next/app';

import '../styles/globals.css';

import muiTheme from 'src/theme/defaultMuiTheme';

const cache = createCache({
  key: 'css',
  prepend: true,
});

function MyApp({Component, pageProps}: AppProps) {
  return (
    <StyledEngineProvider injectFirst>
      <CacheProvider value={cache}>
        <ThemeProvider theme={muiTheme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
    </StyledEngineProvider>
  );
}

export default MyApp;
