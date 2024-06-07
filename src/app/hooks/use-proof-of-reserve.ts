import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { customShiftValue } from '@common/utilities';
import {
  createTaprootMultisigPayment,
  getDerivedPublicKey,
  getUnspendableKeyCommittedToUUID,
} from '@functions/bitcoin-functions';
import { BitcoinTransaction, BitcoinTransactionVectorOutput } from '@models/bitcoin-models';
import { Merchant, MerchantProofOfReserve } from '@models/merchant';
import { RawVault } from '@models/vault';
import { hex } from '@scure/base';
import { RootState } from '@store/index';
import { Network } from 'bitcoinjs-lib';
import { bitcoin, regtest, testnet } from 'bitcoinjs-lib/src/networks';

import {
  defaultMerchantProofOfReserveArray,
  devnetMerchants,
  mainnetMerchants,
  testnetMerchants,
} from '@shared/constants/dlc-btc-merchants';

import { useEndpoints } from './use-endpoints';
import { useEthereum } from './use-ethereum';

interface UseProofOfReserveReturnType {
  proofOfReserve: number | undefined;
  merchantProofOfReserve: MerchantProofOfReserve[];
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

  const { data: merchantProofOfReserve } = useQuery(
    ['merchantProofOfReserve'],
    calculateMerchantProofOfReserves,
    {
      enabled: shouldFetch,
      refetchInterval: 60000,
    }
  );

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

  async function verifyVaultDeposit(vault: RawVault, attestorPublicKey: Buffer): Promise<boolean> {
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

      const unspendableKeyCommittedToUUID = getDerivedPublicKey(
        getUnspendableKeyCommittedToUUID(vault.uuid, bitcoinNetwork),
        bitcoinNetwork
      );

      const multisigTransaction = createTaprootMultisigPayment(
        unspendableKeyCommittedToUUID,
        attestorPublicKey,
        Buffer.from(vault.taprootPubKey, 'hex'),
        bitcoinNetwork
      );

      // Verify that the Funding Transaction's Output Script matches the expected MultiSig Script
      const acceptedScript = matchScripts(
        [multisigTransaction.script],
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

    // Get the Attestor Public Key from the Attestor Group
    const attestorPublicKey = getDerivedPublicKey(
      await getAttestorGroupPublicKey(network),
      bitcoinNetwork
    );

    const results = await Promise.all(
      allFundedVaults.map(async vault => {
        try {
          if (await verifyVaultDeposit(vault, attestorPublicKey)) {
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

  async function calculateProofOfReserveOfAddress(ethereumAddress: string): Promise<number> {
    const allFundedVaults = await Promise.all(
      enabledEthereumNetworks.map(network => getAllFundedVaults(network))
    ).then(vaultsArrays => vaultsArrays.flat());

    const filteredVaults = allFundedVaults.filter(vault => vault.creator === ethereumAddress);

    const attestorPublicKey = getDerivedPublicKey(
      await getAttestorGroupPublicKey(network),
      bitcoinNetwork
    );

    const results = await Promise.all(
      filteredVaults.map(async vault => {
        try {
          if (await verifyVaultDeposit(vault, attestorPublicKey)) {
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

  async function calculateMerchantProofOfReserves(): Promise<MerchantProofOfReserve[]> {
    const merchants = getMerchantsByBitcoinNetwork(bitcoinNetwork);

    const promises = merchants.map(async merchant => {
      const proofOfReserve = await calculateProofOfReserveOfAddress(merchant.address);
      return {
        merchant,
        dlcBTCAmount: proofOfReserve,
      };
    });

    return Promise.all(promises);
  }

  function getMerchantsByBitcoinNetwork(bitcoinNetwork: Network): Merchant[] {
    switch (bitcoinNetwork) {
      case bitcoin:
        return mainnetMerchants;
      case testnet:
        return testnetMerchants;
      case regtest:
        return devnetMerchants;
      default:
        throw new Error('Invalid Bitcoin Network');
    }
  }

  return {
    proofOfReserve,
    merchantProofOfReserve: merchantProofOfReserve ?? defaultMerchantProofOfReserveArray,
  };
}
