import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import getConfig from 'next/config';

import * as AuthAPI from 'src/lib/api/auth';

const {serverRuntimeConfig} = getConfig();

export default NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      id: 'credential',
      name: 'Extension Credential',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        publicAddress: {label: 'Address', type: 'text'},
        signature: {label: 'Wallet Signature', type: 'text'},
      },
      //@ts-ignore
      async authorize(credentials) {
        if (!credentials?.signature) throw Error('no signature!');

        const {signature, publicAddress} = credentials;

        try {
          const {status} = await AuthAPI.login({
            signedMessage: signature,
            userAddress: publicAddress,
          });

          if (status) {
            return credentials;
          } else {
            throw new Error('Auth failed!');
          }
        } catch (error) {
          console.log({error});
        }
      },
    }),
  ],
  pages: {
    signIn: '/',
    signOut: '/',
  },
  callbacks: {
    session: async ({session}) => {
      return session; // The return type will match the one returned in `useSession()`
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: serverRuntimeConfig.appSecret,
  jwt: {
    secret: serverRuntimeConfig.appSecret,
  },
});
