import { useAccountStore } from '@/store/index';
import { u8aToHex } from '@polkadot/util';
import { encodeAddress, decodeAddress } from '@polkadot/util-crypto';
import { WalletAccount } from '@talismn/connect-wallets';

import { signIn } from 'next-auth/react';
import getConfig from 'next/config';

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
      publicAddress: polkadotAddress,
      signature,
      callbackUrl: `${publicRuntimeConfig.authURL}`,
    });

    if (signInResponse?.ok) {
      setAccount(selectedAccount);
      setSignedMessage(signature);
    }
  };

  return {
    verifyAccount,
  };
};

export default useConnect;
