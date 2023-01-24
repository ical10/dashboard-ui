import { WalletAccount } from '@talismn/connect-wallets';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AccountState {
  activeAccount: WalletAccount | null;
  setAccount: (newAccount: WalletAccount) => void;
}

export const useAccountStore = create<AccountState>()(
  devtools(
    persist(
      set => ({
        activeAccount: null,
        setAccount: (newAccount: WalletAccount) => set({ activeAccount: newAccount }),
      }),
      {
        name: 'account-store',
      },
    ),
  ),
);
