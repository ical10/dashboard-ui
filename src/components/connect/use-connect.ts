import { useAccountStore } from '@/store/index';
import { u8aToHex } from '@polkadot/util';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { WalletAccount } from '@talismn/connect-wallets';

import { signIn } from 'next-auth/react';
import getConfig from 'next/config';
import toast from 'react-hot-toast';

import useAuth from 'src/hooks/use-auth';

const { publicRuntimeConfig } = getConfig();

const useConnect = () => {
  const { signWithWallet } = useAuth();

  const setAccount = useAccountStore(state => state.setAccount);
  const setSignedMessage = useAccountStore(state => state.setSignedMessage);

  const verifyAccount = async (selectedAccount: WalletAccount) => {
    const message = publicRuntimeConfig.authMessage;
    const signature = await signWithWallet(selectedAccount, message);

    const publicKey = decodeAddress(selectedAccount.address);
    const hexPublicKey = u8aToHex(publicKey);
    const polkadotAddress = encodeAddress(hexPublicKey, 0);

    if (!signature) {
      alert('Signing cancelled!');
      return null;
    }

    const signInResponse = await signIn('credential', {
      redirect: false,
      publicAddress: polkadotAddress,
      signature,
      callbackUrl: `${publicRuntimeConfig.authURL}`,
    });

    if (signInResponse?.ok) {
      setAccount(selectedAccount);
      setSignedMessage(signature);
      toast.success(`Successfully connected! Welcome ${selectedAccount.name}!`);
    }

    if (signInResponse?.error) {
      toast.error(
        'You have no roles. Please refresh page and connect with another account or contact the admin.',
      );
    }
  };

  return {
    verifyAccount,
  };
};

export default useConnect;
