import type { User } from 'next-auth';

export const ROLE_ID = {
  Implementor: 1,
  Administrator: 2,
  Child_Curator: 3,
  General_Curator: 4,
};

export type ROLE_ID = typeof ROLE_ID[keyof typeof ROLE_ID];

interface UserRole {
  id: number;
  user_id: number;
  role_id: ROLE_ID;
  createdAt: string;
  updatedAt: string;
}

export interface AuthenticatedUser extends User {
  address: string;
  sig: string;
  identifier: string;
  user_roles: UserRole[];
}
