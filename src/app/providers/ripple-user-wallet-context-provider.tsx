import { createContext, useState } from 'react';

import { HasChildren } from '@models/has-children';
import { getRippleWallet } from 'dlc-btc-lib/ripple-functions';
import { Client, TransactionMetadataBase, TrustSet, Wallet } from 'xrpl';

interface RippleWalletContextType {
  isRippleWalletInitialized: boolean;
  rippleWallet: Wallet | undefined;
  setRippleWallet: (userSeed: string) => Promise<void>;
  resetRippleWallet: () => void;
}

export const RippleWalletContext = createContext<RippleWalletContextType>({
  isRippleWalletInitialized: false,
  rippleWallet: undefined,
  setRippleWallet: async () => {
    throw new Error('Not Implemented');
  },
  resetRippleWallet: () => {
    throw new Error('Not Implemented');
  },
});

export function RippleWalletContextProvider({ children }: HasChildren): React.JSX.Element {
  const [isRippleWalletInitialized, setIsRippleWalletInitialized] = useState(false);
  const [rippleWallet, setRippleWallet] = useState<Wallet | undefined>(undefined);

  async function initializeRippleWallet(userSeed: string) {
    const rippleWallet = getRippleWallet(userSeed);
    const client = new Client('wss://s.altnet.rippletest.net:51233');
    if (!client.isConnected()) {
      await client.connect();
    }

    const trust_set_tx: TrustSet = {
      TransactionType: 'TrustSet',
      Account: rippleWallet.address,
      LimitAmount: {
        currency: 'DLC',
        issuer: 'ra9epzthPkNXykgfadCwu8D7mtajj8DVCP',
        value: '10000000000', // Large limit, arbitrarily chosen
      },
    };
    const ts_prepared = await client.autofill(trust_set_tx);
    const ts_signed = rippleWallet.sign(ts_prepared);
    const ts_result = await client.submitAndWait(ts_signed.tx_blob);
    const ts_result_meta = ts_result.result.meta as TransactionMetadataBase;
    if (ts_result_meta.TransactionResult !== 'tesSUCCESS') {
      throw `Error sending transaction: ${ts_result_meta.TransactionResult}`;
    }
    setRippleWallet(rippleWallet);
    setIsRippleWalletInitialized(true);
  }

  function resetRippleWallet() {
    setRippleWallet(undefined);
    setIsRippleWalletInitialized(false);
  }

  return (
    <RippleWalletContext.Provider
      value={{
        rippleWallet,
        isRippleWalletInitialized,
        setRippleWallet: initializeRippleWallet,
        resetRippleWallet,
      }}
    >
      {children}
    </RippleWalletContext.Provider>
  );
}
