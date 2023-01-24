import { stringToHex } from '@polkadot/util';
import { WalletAccount } from '@talismn/connect-wallets';

export interface SignTransactionCallbackProps {
  apiConnected?: boolean;
  signerOpened?: boolean;
  transactionSucceed?: boolean;
  transactionFailed?: boolean;
  message?: string;
}

const useAuth = () => {
  const signWithWallet = async (
    account: WalletAccount,
    message: string,
  ): Promise<string | null> => {
    try {
      const { web3FromSource, web3Enable } = await import('@polkadot/extension-dapp');

      const extension = await web3Enable('Polkadot Anti-scam Initiative');

      const injector = await web3FromSource(account.source);
      const signRaw = injector?.signer?.signRaw;

      if (!extension) return null;

      if (signRaw) {
        const { signature } = await signRaw({
          address: account.address,
          data: stringToHex(message),
          type: 'bytes',
        });

        return signature;
      } else {
        throw new Error('Signing failed!');
      }
    } catch (error) {
      return null;
    }
  };

  return {
    signWithWallet,
  };
};

export default useAuth;
