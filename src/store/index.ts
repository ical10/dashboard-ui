import { WalletAccount } from '@talismn/connect-wallets';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AccountState {
  activeAccount: WalletAccount | null;
  signedMessage: string | null;
  setAccount: (newAccount: WalletAccount) => void;
  setSignedMessage: (signedMessage: string) => void;
}

export const useAccountStore = create<AccountState>()(
  devtools(
    persist(
      set => ({
        activeAccount: null,
        setAccount: (newAccount: WalletAccount) => set({ activeAccount: newAccount }),
        signedMessage: null,
        setSignedMessage: (signedMessage: string) => set({ signedMessage }),
      }),
      {
        name: 'account-store',
      },
    ),
  ),
);
