import { Button } from '@material-tailwind/react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { u8aToHex } from '@polkadot/util';
import { encodeAddress, decodeAddress } from '@polkadot/util-crypto';

import { useEffect, useState } from 'react';

import { signIn } from 'next-auth/react';
import getConfig from 'next/config';

import ReactIdenticon from 'src/components/ReactIdenticon';
import useAuthHook from 'src/hooks/use-auth.hooks';

const { publicRuntimeConfig } = getConfig();

const ExtensionAccounts = () => {
  const { signWithWallet } = useAuthHook();

  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null);

  const toggleVisible = () => {
    setVisible(!visible);
    getAccounts();
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

    signIn('credential', {
      publicAddress: polkadotAddress,
      signature,
      callbackUrl: `${publicRuntimeConfig.authURL}/dashboard`,
    });
  };

  return (
    <div>
      <Button variant="outlined" onClick={toggleVisible}>
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
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '1.5rem',
                        '&:hover': {
                          backgroundColor: 'hsl(328, 100%, 45%)',
                          color: 'white',
                        },
                      },
                    }}
                    onClick={() => handleClick(account)}
                  >
                    <ReactIdenticon address={account.address} />
                    <div className="flex flex-row gap-2">
                      <div>{account.meta.name ?? 'Unnamed Account'}</div>
                      <div>{account.address}</div>
                    </div>
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
          <Button variant="outlined" onClick={toggleVisible}>
            Cancel
          </Button>
          <Button disabled={!selectedAccount} variant="filled" autoFocus onClick={handleConnect}>
            Connect
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExtensionAccounts;
