import { useState } from 'react';

import Xrp from '@ledgerhq/hw-app-xrp';
import Transport from '@ledgerhq/hw-transport-webusb';
import { Client } from 'dlc-btc-lib/models';
import { getRippleClient, setTrustLine } from 'dlc-btc-lib/ripple-functions';
import { encode } from 'ripple-binary-codec';

interface useXRPLLedgerReturnType {
  xrplAddress: string | undefined;
  isConnected: boolean;
  connectLedgerWallet: (derivationPath: string) => Promise<void>;
  fetchXRPLAddress: () => Promise<any>;
  signTransaction: (transaction: any) => Promise<any>;
}

export function useXRPLLedger(): useXRPLLedgerReturnType {
  const [derivationPath, setDerivationPath] = useState<string | undefined>(undefined);
  const [xrplWallet, setXRPLWallet] = useState<Xrp | undefined>(undefined);
  const [xrplAddress, setXRPLAddress] = useState<string | undefined>(undefined);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  async function connectLedgerWallet(derivationPath: string) {
    try {
      console.log('Connecting ledger wallet');
      const transport = await Transport.create();
      console.log('Transport created');
      const xrplWallet = new Xrp(transport);
      console.log('XRPL wallet created');
      const xrplAddress = await xrplWallet.getAddress(derivationPath);
      console.log('XRPL address fetched', xrplAddress);
      // const trustset = await setTrustLine(
      //   getRippleClient(appConfiguration.xrplWebsocket),
      //   xrplAddress.address,
      //   appConfiguration.rippleIssuerAddress
      // );
      // const trustset2 = {
      //   SigningPubKey: xrplAddress.publicKey.toUpperCase(),
      //   ...trustset,
      // };
      // console.log('Trustline set', trustset2);
      // const encoded = encode(trustset2);
      // console.log('Trustline encoded', encoded);
      // const signtrustset = await xrplWallet.signTransaction("44'/144'/0'/0/0", encoded);
      // console.log('Trustline signed', signtrustset);
      // const xrplClient = getRippleClient(appConfiguration.xrplWebsocket);
      // const trustline = await xrplClient.submitAndWait(signtrustset);
      // console.log('Trustline', trustline);

      setDerivationPath(derivationPath);
      setXRPLWallet(xrplWallet);
      setXRPLAddress(xrplAddress.address);
      setIsConnected(true);
      console.log('Ledger wallet connected');
    } catch (error) {
      console.error('Error connecting ledger wallet', error);
    }
  }

  function fetchXRPLAddress() {
    if (!xrplWallet) {
      throw new Error('Ledger wallet not connected');
    }

    if (!derivationPath) {
      throw new Error('Derivation path not set');
    }
    return xrplWallet.getAddress(derivationPath);
  }

  async function signTransaction(transaction: any) {
    if (!xrplWallet) {
      throw new Error('Ledger wallet not connected');
    }

    if (!derivationPath) {
      throw new Error('Derivation path not set');
    }

    const deviceData = await xrplWallet.getAddress(derivationPath);

    console.log('transaction', transaction);

    const updatedTransaction = {
      ...transaction,
      Flags: 2147483648,
      SigningPubKey: deviceData.publicKey.toUpperCase(),
    };

    console.log('Updated transaction', updatedTransaction);

    const encodedTransaction = encode(updatedTransaction);
    console.log('encodedTransaction', encodedTransaction);
    const signature = await xrplWallet.signTransaction(derivationPath, encodedTransaction);

    console.log('Signed transaction', signature);
    const signedTransaction = {
      ...updatedTransaction,
      TxnSignature: signature,
    };
    return signedTransaction;
  }

  return {
    xrplAddress,
    connectLedgerWallet,
    fetchXRPLAddress,
    signTransaction,
    isConnected,
  };
}
