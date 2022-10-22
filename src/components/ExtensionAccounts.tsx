import {web3Accounts, web3Enable} from '@polkadot/extension-dapp';
import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {useEffect, useState} from 'react';

const ExtensionAccounts = () => {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);

  const [visible, setVisible] = useState<boolean>(false);

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

  return (
    <div className="font-sans">
      <button onClick={toggleVisible}>Open Accounts</button>
      <div>
        <div>
          {typeof accounts !== undefined ? (
            <div className="w-max text-sm font-medium text-gray-900 bg-white rounded-lg border border-solid border-gray-200">
              {accounts.map(account => (
                <div
                  key={account.address}
                  className="py-2 px-4 w-full text-black hover:bg-gray-700 hover:text-white hover:bg-pink-700"
                >
                  {account.address}
                </div>
              ))}
            </div>
          ) : (
            <></>
          )}
        </div>
        <div>
          <button onClick={toggleVisible}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ExtensionAccounts;
