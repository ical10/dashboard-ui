import { u8aToHex } from '@polkadot/util';
import { encodeAddress, decodeAddress } from '@polkadot/util-crypto';
import { WalletAccount } from '@talismn/connect-wallets';

import { signIn } from 'next-auth/react';
import getConfig from 'next/config';

import useAuth from 'src/hooks/use-auth';

const { publicRuntimeConfig } = getConfig();

const useConnect = () => {
  const { signWithWallet } = useAuth();

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

    signIn('credential', {
      publicAddress: polkadotAddress,
      signature,
      callbackUrl: `${publicRuntimeConfig.authURL}`,
    });
  };

  return {
    verifyAccount,
  };
};

export default useConnect;
