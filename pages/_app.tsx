import createCache from '@emotion/cache';
import {CacheProvider} from '@emotion/react';
import {ThemeProvider, StyledEngineProvider} from '@mui/material/styles';

import {SessionProvider} from 'next-auth/react';
import type {AppProps} from 'next/app';

import '../styles/globals.css';

import muiTheme from 'src/theme/defaultMuiTheme';

const cache = createCache({
  key: 'css',
  prepend: true,
});

function MyApp({Component, pageProps: {session, ...pageProps}}: AppProps) {
  return (
    <StyledEngineProvider injectFirst>
      <CacheProvider value={cache}>
        <ThemeProvider theme={muiTheme}>
          <SessionProvider session={session}>
            <Component {...pageProps} />
          </SessionProvider>
        </ThemeProvider>
      </CacheProvider>
    </StyledEngineProvider>
  );
}

export default MyApp;
