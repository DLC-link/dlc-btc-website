import { useContext, useState } from 'react';

import {
  createTaprootMultisigPayment,
  getDerivedPublicKey,
  getFeeRate,
  getUnspendableKeyCommittedToUUID,
} from '@functions/bitcoin-functions';
import { createClosingTransaction, createFundingTransaction } from '@functions/psbt-functions';
import { LeatherError } from '@models/error-types';
import {
  Address,
  BitcoinNativeSegwitAddress,
  BitcoinTaprootAddress,
  RpcResponse,
  SignPsbtRequestParams,
} from '@models/leather';
import { RawVault } from '@models/vault';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import {
  BitcoinWalletContext,
  BitcoinWalletContextState,
} from '@providers/ledger-context-provider';
import { P2Ret, P2TROut, Transaction, p2wpkh } from '@scure/btc-signer';

import { useAttestors } from './use-attestors';
import { useEndpoints } from './use-endpoints';
import { useEthereum } from './use-ethereum';

export function useLeather() {
  const {
    bitcoinNetwork,
    bitcoinNetworkName,
    bitcoinBlockchainAPIURL,
    bitcoinBlockchainAPIFeeURL,
  } = useEndpoints();
  const {
    taprootMultisigAddressInformation,
    setTaprootMultisigAddressInformation,
    nativeSegwitAddressInformation,
    setNativeSegwitAddressInformation,
    setBitcoinWalletContextState,
  } = useContext(BitcoinWalletContext);

  const { getRawVault } = useEthereum();

  const [isLoading, setIsLoading] = useState<[boolean, string]>([false, '']);
  const { getExtendedAttestorGroupPublicKey } = useAttestors();

  /**
   * Signs the PSBTs. Requests the user's wallet to sign the PSBT.
   * Current implementation is using Leather Wallet.
   *
   * @param psbt - The PSBT to sign.
   * @returns A promise that resolves to the signed PSBT.
   */
  async function signPSBT(psbt: Uint8Array): Promise<string> {
    try {
      const requestParams: SignPsbtRequestParams = {
        hex: bytesToHex(psbt),
      };
      const result = await window.btc.request('signPsbt', requestParams);
      return result.result.hex;
    } catch (error) {
      throw new LeatherError(`Error signing PSBT: ${error}`);
    }
  }

  /**
   * Checks if the user's wallet is on the same network as the app.
   *
   * @param userNativeSegwitAddress - The user's native segwit address.
   * @throws BitcoinError - If the user's wallet is not on the same network as the app.
   */
  function checkUserWalletNetwork(userNativeSegwitAddress: Address): void {
    if (bitcoinNetworkName === 'mainnet' && !userNativeSegwitAddress.address.startsWith('bc1')) {
      throw new LeatherError('User wallet is not on Bitcoin Mainnet');
    } else if (
      bitcoinNetworkName === 'testnet' &&
      !userNativeSegwitAddress.address.startsWith('tb1')
    ) {
      throw new LeatherError('User wallet is not on Bitcoin Testnet');
    } else if (
      bitcoinNetworkName === 'regtest' &&
      !userNativeSegwitAddress.address.startsWith('bcrt1')
    ) {
      throw new LeatherError('User wallet is not on Bitcoin Regtest');
    } else {
      return;
    }
  }

  /**
   * Fetches the user's native segwit and taproot addresses from the user's wallet. Taproot address is required for the user's public key, which is used in the multisig transaction.
   * Current implementation is using Leather Wallet.
   *
   * @returns A promise that resolves to the user's native segwit and taproot addresses.
   */
  async function getBitcoinAddresses(): Promise<Address[]> {
    try {
      setIsLoading([true, 'Connecting To Leather Wallet']);
      const rpcResponse: RpcResponse = await window.btc?.request('getAddresses');
      const userAddresses = rpcResponse.result.addresses;
      console.log(userAddresses);
      checkUserWalletNetwork(userAddresses[0]);
      return userAddresses;
    } catch (error) {
      setIsLoading([false, '']);
      throw new LeatherError(`Error getting bitcoin addresses: ${error}`);
    }
  }

  function getNativeSegwitPayment(nativeSegwitAdress: BitcoinNativeSegwitAddress): P2Ret {
    return p2wpkh(Buffer.from(nativeSegwitAdress.publicKey, 'hex'), bitcoinNetwork);
  }

  async function getTaprootMultisigPayment(
    vaultUUID: string,
    userTaprootPublicKey: string
  ): Promise<P2TROut> {
    console.log('vaultUUID', vaultUUID);
    console.log('userTaprootPublicKey', userTaprootPublicKey);
    const unspendableExtendedPublicKey = getUnspendableKeyCommittedToUUID(
      vaultUUID,
      bitcoinNetwork
    );
    console.log('unspendableExtendedPublicKey', unspendableExtendedPublicKey);

    const attestorExtendedPublicKey = await getExtendedAttestorGroupPublicKey();

    console.log('attestorExtendedPublicKey', attestorExtendedPublicKey);
    const unspendableDerivedPublicKey = getDerivedPublicKey(
      unspendableExtendedPublicKey,
      bitcoinNetwork
    );

    console.log('unspendableDerivedPublicKey', unspendableDerivedPublicKey);

    const attestorDerivedPublicKey = getDerivedPublicKey(attestorExtendedPublicKey, bitcoinNetwork);

    console.log('unspendableDerivedPublicKey', unspendableDerivedPublicKey);
    const userTaprootPublicKeyBuffer = Buffer.from(userTaprootPublicKey, 'hex');
    console.log('userTaprootPublicKeyBuffer', userTaprootPublicKeyBuffer);
    const taprootMultisigPayment = createTaprootMultisigPayment(
      unspendableDerivedPublicKey,
      attestorDerivedPublicKey,
      userTaprootPublicKeyBuffer,
      bitcoinNetwork
    );
    return taprootMultisigPayment;
  }

  async function getLeatherWalletInformation(vaultUUID: string): Promise<void> {
    try {
      setIsLoading([true, 'Connecting To Leather Wallet']);
      const userAddresses = await getBitcoinAddresses();
      const bitcoinAddresses = userAddresses.filter(
        address => address.symbol === 'BTC'
      ) as BitcoinNativeSegwitAddress[];

      const userNativeSegwitAddress = bitcoinAddresses.find(
        address => address.type === 'p2wpkh'
      ) as BitcoinNativeSegwitAddress;

      const userTaprootAddress = bitcoinAddresses.find(
        address => address.type === 'p2tr'
      ) as BitcoinTaprootAddress;

      const nativeSegwitPayment = getNativeSegwitPayment(userNativeSegwitAddress);
      const taprootMultisigPayment = await getTaprootMultisigPayment(
        vaultUUID,
        userTaprootAddress.publicKey
      );

      setNativeSegwitAddressInformation({
        nativeSegwitPayment,
        nativeSegwitDerivedPublicKey: Buffer.from(userNativeSegwitAddress.publicKey, 'hex'),
      });

      setTaprootMultisigAddressInformation({
        taprootMultisigPayment,
        userTaprootMultisigDerivedPublicKey: Buffer.from(userTaprootAddress.publicKey, 'hex'),
      });

      setBitcoinWalletContextState(BitcoinWalletContextState.TAPROOT_MULTISIG_ADDRESS_READY);
      setIsLoading([false, '']);
    } catch (error) {
      setIsLoading([false, '']);
      throw new LeatherError(`Error getting Leather Wallet Information: ${error}`);
    }
  }

  async function handleFundingTransaction(vaultUUID: string): Promise<Transaction> {
    try {
      setIsLoading([true, 'Creating Funding Transaction']);

      const vault: RawVault = await getRawVault(vaultUUID);

      const { nativeSegwitPayment } = nativeSegwitAddressInformation!;
      const { taprootMultisigPayment } = taprootMultisigAddressInformation!;

      const feeRate = await getFeeRate(bitcoinBlockchainAPIFeeURL);

      // ==> Create Funding Transaction
      const fundingPSBT = await createFundingTransaction(
        vault.valueLocked.toBigInt(),
        bitcoinNetwork,
        taprootMultisigPayment.address!,
        nativeSegwitPayment,
        BigInt(feeRate),
        vault.btcFeeRecipient,
        vault.btcMintFeeBasisPoints.toBigInt(),
        bitcoinBlockchainAPIURL
      );

      setIsLoading([true, 'Sign Funding Transaction in your Leather Wallet']);
      // ==> Sign Funding PSBT with Ledger
      const fundingTransactionHex = await signPSBT(fundingPSBT);

      // ==> Finalize Funding Transaction
      const fundingTransaction = Transaction.fromPSBT(hexToBytes(fundingTransactionHex));
      fundingTransaction.finalize();

      setIsLoading([false, '']);
      return fundingTransaction;
    } catch (error) {
      setIsLoading([false, '']);
      throw new LeatherError(`Error handling Funding Transaction: ${error}`);
    }
  }

  async function handleClosingTransaction(
    vaultUUID: string,
    fundingTransactionID: string
  ): Promise<string> {
    try {
      setIsLoading([true, 'Creating Closing Transaction']);

      const vault: RawVault = await getRawVault(vaultUUID);

      const { nativeSegwitPayment } = nativeSegwitAddressInformation!;
      const { taprootMultisigPayment } = taprootMultisigAddressInformation!;

      const feeRate = await getFeeRate(bitcoinBlockchainAPIFeeURL);
      // ==> Create Closing PSBT
      const closingTransaction = createClosingTransaction(
        vault.valueLocked.toBigInt(),
        bitcoinNetwork,
        fundingTransactionID,
        taprootMultisigPayment,
        nativeSegwitPayment.address!,
        BigInt(feeRate),
        vault.btcFeeRecipient,
        vault.btcRedeemFeeBasisPoints.toBigInt()
      );

      setIsLoading([true, 'Sign Closing Transaction in your Leather Wallet']);
      // ==> Sign Closing PSBT with Ledger
      const closingTransactionHex = await signPSBT(closingTransaction);

      setIsLoading([false, '']);
      return closingTransactionHex;
    } catch (error) {
      setIsLoading([false, '']);
      throw new LeatherError(`Error handling Closing Transaction: ${error}`);
    }
  }

  return {
    getLeatherWalletInformation,
    handleFundingTransaction,
    handleClosingTransaction,
    isLoading,
  };
}
