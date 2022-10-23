import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';
import {stringToHex} from '@polkadot/util';

export interface SignTransactionCallbackProps {
  apiConnected?: boolean;
  signerOpened?: boolean;
  transactionSucceed?: boolean;
  transactionFailed?: boolean;
  message?: string;
}

const useAuthHook = () => {
  const signWithWallet = async (
    account: InjectedAccountWithMeta,
    message: string,
    callback?: (param: SignTransactionCallbackProps) => void,
  ): Promise<string | null> => {
    try {
      const {web3FromSource} = await import('@polkadot/extension-dapp');

      callback && callback({signerOpened: true});

      const injector = await web3FromSource(account.meta.source);
      const signRaw = injector?.signer?.signRaw;

      if (signRaw) {
        const {signature} = await signRaw({
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

export default useAuthHook;
