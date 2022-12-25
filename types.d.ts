/* eslint-disable @typescript-eslint/no-unused-vars */
import type { User } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: User & {
      address: string;
      sig: string;
    };
  }
}
