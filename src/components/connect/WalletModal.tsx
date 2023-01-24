import { WalletSelect } from '@talismn/connect-components';

import useConnect from './use-connect';

type WalletModalProps = {
  open: boolean;
  onClose: () => void;
};

const WalletModal = ({ open, onClose }: WalletModalProps) => {
  const { verifyAccount } = useConnect();

  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <WalletSelect
      makeInstallable
      // [Required] The dapp name
      dappName="Polkadot anti-scam dashboard"
      // Use if the dapp is controlling the modal toggle.
      open={open}
      // The component that opens the WalletSelect Modal
      //   triggerComponent={
      //     <button
      //       // `onClick` is optional here
      //       onClick={(wallets) => {
      //         // Do stuff with the supported wallets
      //       }}
      //     >
      //       Connect to wallet
      //     </button>
      //   }

      // Override the default header
      header={<p className="font-bold">Select your wallet</p>}
      // Override the default footer
      //   footer={}
      // If `showAccountsList={true}`, then account selection modal will show up after selecting the a wallet. Default is `false`.
      showAccountsList={true}
      // Callback when the WalletSelect Modal is opened
      //   onWalletConnectOpen={(wallets) => { ... }}

      // Callback when the WalletSelect Modal is closed
      onWalletConnectClose={handleClose}
      // Callback when a wallet is selected on the WalletSelect Modal
      //   onWalletSelected={(wallet) => { ... }}

      // Callback when the subscribed accounts for a selected wallet are updated
      //   onUpdatedAccounts={(accounts) => { ... }}

      // Callback when an account is selected on the WalletSelect Account Modal. Only relevant when `showAccountsList=true`
      onAccountSelected={account => verifyAccount(account)}
      // Callback when an error occurs. Also clears the error on Modal actions:
      // `onWalletConnectOpen`, `onWalletSelected`, `onAccountSelected` and `onWalletConnectClose`,
      onError={error => console.warn({ error })}
    />
  );
};

export default WalletModal;
