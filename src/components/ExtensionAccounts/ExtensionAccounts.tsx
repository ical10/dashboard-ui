import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import {web3Accounts, web3Enable} from '@polkadot/extension-dapp';
import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';
import {u8aToHex, stringToU8a} from '@polkadot/util';
import {encodeAddress, decodeAddress, signatureVerify} from '@polkadot/util-crypto';

import {useEffect, useState} from 'react';

import {signIn} from 'next-auth/react';
import getConfig from 'next/config';

import useAuthHook from 'src/hooks/use-auth.hooks';

const {publicRuntimeConfig} = getConfig();

interface IExtensionAccounts {
  onLoginSuccess: () => void;
}

const ExtensionAccounts = ({onLoginSuccess}: IExtensionAccounts) => {
  const {signWithWallet} = useAuthHook();

  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null);

  const toggleVisible = () => {
    setVisible(!visible);
  };

  const getAccounts = async () => {
    const extensions = await web3Enable('Anti-scam Initiative');
    if (extensions.length === 0) {
      return;
    }
    const allAccounts = await web3Accounts();
    setAccounts(allAccounts);
  };

  useEffect(() => {
    getAccounts();
  }, []);

  const handleClick = (selectedAccount: InjectedAccountWithMeta) => {
    setSelectedAccount(selectedAccount);
  };

  const handleConnect = async () => {
    if (!selectedAccount) return null;

    const message = publicRuntimeConfig.authMessage;
    const signature = await signWithWallet(selectedAccount, message);

    const publicKey = decodeAddress(selectedAccount.address);
    const hexPublicKey = u8aToHex(publicKey);
    const polkadotAddress = encodeAddress(hexPublicKey, 0);

    if (!signature) {
      alert('Signing cancelled!');
      return null;
    }

    const {isValid} = signatureVerify(
      message,
      signature ?? stringToU8a(''),
      selectedAccount.address,
    );

    if (isValid) {
      onLoginSuccess();

      signIn('credential', {
        publicAddress: polkadotAddress,
        signature,
        callbackUrl: `${publicRuntimeConfig.authURL}/dashboard`,
      });
    }
  };

  return (
    <div>
      <Button color="primary" variant="contained" onClick={toggleVisible}>
        Open Accounts
      </Button>
      <Dialog open={visible} onClose={toggleVisible} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">{'Your Accounts'}</DialogTitle>
        <DialogContent>
          <List>
            {typeof accounts !== undefined ? (
              accounts.map(account => (
                <ListItem
                  selected={account === selectedAccount}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'white',
                      borderStyle: 'solid',
                      borderColor: 'hsl(328, 100%, 45%)',
                      color: 'black',
                    },
                  }}
                  disablePadding
                  key={account.address}
                >
                  <ListItemButton
                    sx={{
                      '&.MuiListItemButton-root': {
                        '&:hover': {
                          backgroundColor: 'hsl(328, 100%, 45%)',
                          color: 'white',
                        },
                      },
                    }}
                    onClick={() => handleClick(account)}
                  >
                    <ListItemText>{account.address}</ListItemText>
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <ListItem disablePadding>
                <ListItemText>Empty!</ListItemText>
              </ListItem>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button color="error" variant="contained" autoFocus onClick={toggleVisible}>
            Cancel
          </Button>
          <Button
            disabled={!selectedAccount}
            color="primary"
            variant="contained"
            autoFocus
            onClick={handleConnect}
          >
            Connect
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExtensionAccounts;
