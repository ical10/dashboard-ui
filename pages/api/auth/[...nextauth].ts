import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import getConfig from 'next/config';

import * as AuthAPI from 'src/lib/api/auth';
import { AuthenticatedUser } from 'types';

const { serverRuntimeConfig } = getConfig();

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
        publicAddress: { label: 'Address', type: 'text' },
        signature: { label: 'Wallet Signature', type: 'text' },
      },
      //@ts-ignore
      async authorize(credentials) {
        if (!credentials?.signature) throw Error('no signature!');

        const { signature, publicAddress } = credentials;
        try {
          const { status, data } = await AuthAPI.login({
            signedMessage: signature,
            userAddress: publicAddress,
          });

          const { id, identifier, user_roles } = data;

          const user: AuthenticatedUser = {
            id,
            address: publicAddress,
            sig: signature,
            identifier,
            user_roles,
          };

          if (status) {
            return user;
          } else {
            throw new Error('Auth failed!');
          }
        } catch (error) {
          console.log({ error });
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = token.user as unknown as AuthenticatedUser;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  pages: {
    signIn: '/',
    signOut: '/',
  },
  session: {
    strategy: 'jwt',
  },
  secret: serverRuntimeConfig.appSecret,
  jwt: {
    secret: serverRuntimeConfig.appSecret,
  },
});
