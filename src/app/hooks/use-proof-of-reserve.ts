import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { customShiftValue } from '@common/utilities';
import {
  createMultisigTransaction,
  createMultisigTransactionLegacy,
} from '@functions/bitcoin-functions';
import { BitcoinTransaction, BitcoinTransactionVectorOutput } from '@models/bitcoin-models';
import { RawVault } from '@models/vault';
import { hex } from '@scure/base';
import { RootState } from '@store/index';

import { useEndpoints } from './use-endpoints';
import { useEthereum } from './use-ethereum';

interface UseProofOfReserveReturnType {
  proofOfReserve: number | undefined;
}

export function useProofOfReserve(): UseProofOfReserveReturnType {
  const { bitcoinBlockchainAPIURL, bitcoinNetwork, enabledEthereumNetworks } = useEndpoints();
  const { getAllFundedVaults, getAttestorGroupPublicKey } = useEthereum();
  const { network } = useSelector((state: RootState) => state.account);

  const [shouldFetch, setShouldFetch] = useState(false);

  const { data: proofOfReserve } = useQuery(['proofOfReserve'], calculateProofOfReserve, {
    enabled: shouldFetch,
    refetchInterval: 60000,
  });

  useEffect(() => {
    const delayFetching = setTimeout(() => {
      setShouldFetch(true);
    }, 3500);
    return () => clearTimeout(delayFetching);
  }, []);

  async function fetchFundingTransaction(txID: string): Promise<BitcoinTransaction> {
    try {
      const bitcoinExplorerTXURL = `${bitcoinBlockchainAPIURL}/tx/${txID}`;

      const response = await fetch(bitcoinExplorerTXURL);
      if (!response.ok) throw new Error('Network response was not ok');
      const bitcoinTransaction = await response.json();

      return bitcoinTransaction;
    } catch (error) {
      throw new Error(`Error fetching Bitcoin Transaction: ${error}`);
    }
  }

  async function fetchBitcoinBlockHeight(): Promise<number> {
    try {
      const bitcoinExplorerBlockHeightURL = `${bitcoinBlockchainAPIURL}/blocks/tip/height`;

      const response = await fetch(bitcoinExplorerBlockHeightURL);
      if (!response.ok) throw new Error('Bitcoin Block Height Network Response was not OK');

      const bitcoinBlockHeight = await response.json();
      return bitcoinBlockHeight;
    } catch (error) {
      throw new Error(`Error fetching Bitcoin Block Height: ${error}`);
    }
  }

  async function checkConfirmations(
    fundingTransaction: BitcoinTransaction,
    bitcoinBlockHeight: number
  ): Promise<boolean> {
    try {
      if (!fundingTransaction.status.block_height) {
        throw new Error('Funding Transaction has no Block Height.');
      }

      const confirmations = bitcoinBlockHeight - (fundingTransaction.status.block_height + 1);
      if (confirmations >= 6) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(`Error fetching Bitcoin Transaction: ${error}`);
    }
  }

  function getClosingTransactionInputFromFundingTransaction(
    fundingTransaction: BitcoinTransaction,
    bitcoinValue: number
  ): BitcoinTransactionVectorOutput {
    const closingTransactionInput = fundingTransaction.vout.find(
      output => output.value === bitcoinValue
    );
    if (!closingTransactionInput) {
      throw new Error('Could not find Closing Transaction Input.');
    }
    return closingTransactionInput;
  }

  function matchScripts(multisigScripts: Uint8Array[], outputScript: Uint8Array): boolean {
    return multisigScripts.some(
      multisigScript =>
        outputScript.length === multisigScript.length &&
        outputScript.every((value, index) => value === multisigScript[index])
    );
  }

  async function verifyVaultDeposit(vault: RawVault): Promise<boolean> {
    if (!vault.fundingTxId || !vault.taprootPubKey || !vault.valueLocked || !vault.uuid) {
      return false;
    }

    try {
      // Fetch the Funding Transaction by its ID
      const fundingTransaction = await fetchFundingTransaction(vault.fundingTxId);

      // Fetch the current Bitcoin Block Height
      const bitcoinBlockHeight = await fetchBitcoinBlockHeight();

      // Check the number of Confirmations for the Funding Transaction
      const isConfirmed = await checkConfirmations(fundingTransaction, bitcoinBlockHeight);

      if (!isConfirmed) {
        return false;
      }

      // Get the Closing Transaction Input from the Funding Transaction by the locked Bitcoin value
      const closingTransactionInput = getClosingTransactionInputFromFundingTransaction(
        fundingTransaction,
        vault.valueLocked.toNumber()
      );

      // Get the Attestor Public Key from the Attestor Group
      const attestorPublicKey = await getAttestorGroupPublicKey(network);

      // Create two MultiSig Transactions, because the User and Attestor can sign in any order
      // Create the MultiSig Transaction A
      const multisigTransactionA = createMultisigTransactionLegacy(
        vault.taprootPubKey,
        attestorPublicKey,
        vault.uuid,
        bitcoinNetwork
      );

      // Create the MultiSig Transaction B
      const multisigTransactionB = createMultisigTransactionLegacy(
        attestorPublicKey,
        vault.taprootPubKey,
        vault.uuid,
        bitcoinNetwork
      );

      const multisigTransactionC = createMultisigTransaction(
        hex.decode(vault.taprootPubKey),
        hex.decode(attestorPublicKey),
        vault.uuid,
        bitcoinNetwork
      );

      // Verify that the Funding Transaction's Output Script matches the expected MultiSig Script
      const acceptedScript = matchScripts(
        [multisigTransactionA.script, multisigTransactionB.script, multisigTransactionC.script],
        hex.decode(closingTransactionInput.scriptpubkey)
      );

      if (!acceptedScript) {
        return false;
      }

      return true;
    } catch (error) {
      throw new Error(`Error verifying Vault Deposit: ${error}`);
    }
  }

  async function calculateProofOfReserve(): Promise<number> {
    const allFundedVaults = await Promise.all(
      enabledEthereumNetworks.map(network => getAllFundedVaults(network))
    ).then(vaultsArrays => vaultsArrays.flat());

    const results = await Promise.all(
      allFundedVaults.map(async vault => {
        try {
          if (await verifyVaultDeposit(vault)) {
            return vault.valueLocked.toNumber();
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error while verifying Deposit for Vault:', vault.uuid, error);
        }
        return 0;
      })
    );

    const currentProofOfReserve = results.reduce((sum, collateral) => sum + collateral, 0);

    return customShiftValue(currentProofOfReserve, 8, true);
  }

  return {
    proofOfReserve,
  };
}
