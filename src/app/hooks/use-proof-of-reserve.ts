import { BitcoinNetwork } from '@models/bitcoin-network';
import { BitcoinTransaction, BitcoinTransactionVectorOutput } from '@models/bitcoin-transaction';
import { hex } from '@scure/base';
import { p2tr, p2tr_ns, taprootTweakPubkey } from '@scure/btc-signer';

import { useAttestors } from './use-attestors';
import { useEndpoints } from './use-endpoints';

interface UseProofOfReserveReturnType {
  verifyVaultDeposit(): Promise<void>;
}

export function useProofOfReserve(): UseProofOfReserveReturnType {
  const { bitcoinBlockchainAPIURL, bitcoinNetwork } = useEndpoints();
  const { getAttestorGroupPublicKey } = useAttestors();

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

  function createMultiSigTransaction(
    publicKeyA: string,
    publicKeyB: string,
    vaultUUID: string,
    bitcoinNetwork: BitcoinNetwork
  ) {
    const TAPROOT_UNSPENDABLE_KEY_STR =
      '50929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0';
    const TAPROOT_UNSPENDABLE_KEY = hex.decode(TAPROOT_UNSPENDABLE_KEY_STR);

    const tweakedUnspendableTaprootKey = taprootTweakPubkey(
      TAPROOT_UNSPENDABLE_KEY,
      Buffer.from(vaultUUID)
    )[0];

    const multisigPayment = p2tr_ns(2, [hex.decode(publicKeyA), hex.decode(publicKeyB)]);

    const multisigTransaction = p2tr(tweakedUnspendableTaprootKey, multisigPayment, bitcoinNetwork);
    multisigTransaction.tapInternalKey = tweakedUnspendableTaprootKey;

    return multisigTransaction;
  }

  function matchScripts(multisigScripts: Uint8Array[], outputScript: Uint8Array): boolean {
    return multisigScripts.some(
      multisigScript =>
        outputScript.length === multisigScript.length &&
        outputScript.every((value, index) => value === multisigScript[index])
    );
  }

  async function verifyVaultDeposit() {
    // This is an existing Funded Vault's Funding Transaction ID [Regtest]
    const TEST_FUNDING_TXID = 'fae0caeb413a009a049c2168d14cd5591fe3781b1494f2ed32c23c87dde929bf';
    // This is the value of the locked Bitcoin in the Funded Vault
    const TEST_VALUE = 100000;
    // This is the UUID of the Funded Vault
    const TEST_UUID = '0xc31f853e0216afc6c90a818fcc5be92ee84f789dba3dcf28b0b6b6691b0bdda1';

    try {
      // Fetch the Funding Transaction by its ID
      const fundingTransaction = await fetchFundingTransaction(TEST_FUNDING_TXID);

      // Fetch the current Bitcoin Block Height
      const bitcoinBlockHeight = await fetchBitcoinBlockHeight();

      // Check the number of Confirmations for the Funding Transaction
      const isConfirmed = await checkConfirmations(fundingTransaction, bitcoinBlockHeight);

      if (!isConfirmed) {
        throw new Error('Funding Transaction has not enough Confirmations.');
      }

      // Get the Closing Transaction Input from the Funding Transaction by the locked Bitcoin value
      const closingTransactionInput = getClosingTransactionInputFromFundingTransaction(
        fundingTransaction,
        TEST_VALUE
      );

      // Get the User Public Key from the Funding Transaction, assuming it is a P2WPKH script
      // const userPublicKey = getPublicKeyFromBitcoinTransaction(fundingTransaction);
      // TODO: Use the following hardcoded Taproot User Public Key for now, because the above function is retrieving the user's Native SegWit Public Key, not the Taproot Public Key, which is needed for the MultiSig Transaction
      const userPublicKey = 'c3bf9946d51cf18e4711bd004be784b1b184103f1596f7a98ec4c2063b38ffd1';

      // Get the Attestor Public Key from the Attestor Group
      const attestorPublicKey = await getAttestorGroupPublicKey();

      // Create two MultiSig Transactions, because the User and Attestor can sign in any order
      // Create the MultiSig Transaction A
      const multisigTransactionA = createMultiSigTransaction(
        userPublicKey,
        attestorPublicKey,
        TEST_UUID,
        bitcoinNetwork
      );

      // Create the MultiSig Transaction B
      const multisigTransactionB = createMultiSigTransaction(
        attestorPublicKey,
        userPublicKey,
        TEST_UUID,

        bitcoinNetwork
      );

      // Verify that the Funding Transaction's Output Script matches the expected MultiSig Script
      const acceptedScript = matchScripts(
        [multisigTransactionA.script, multisigTransactionB.script],
        hex.decode(closingTransactionInput.scriptpubkey)
      );

      if (!acceptedScript) {
        throw new Error('Funding Transaction does not match the expected MultiSig Script.');
      }
    } catch (error) {
      throw new Error(`Error verifying Vault Deposit: ${error}`);
    }
  }

  return {
    verifyVaultDeposit,
  };
}
