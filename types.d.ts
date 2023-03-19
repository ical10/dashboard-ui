/* eslint-disable @typescript-eslint/no-unused-vars */
import { AuthenticatedUser } from 'src/types/db';

declare module 'next-auth' {
  interface Session {
    user: AuthenticatedUser;
  }
}
