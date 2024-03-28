import { BitcoinTransaction } from '@models/bitcoin-transaction';
import { opcodes, script } from 'bitcoinjs-lib';

import { useAttestors } from './use-attestors';
import { useEndpoints } from './use-endpoints';

interface UseProofOfReserveReturnType {
  checkIfScriptIsAcceptable(): Promise<void>;
}

export function useProofOfReserve(): UseProofOfReserveReturnType {
  const { bitcoinBlockchainAPIURL } = useEndpoints();
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

  function getClosingTransactionInputFromFundingTransaction(
    fundingTransaction: BitcoinTransaction,
    bitcoinValue: number
  ) {
    return fundingTransaction.vout.find(output => output.value === bitcoinValue);
  }

  function getPublicKeyFromBitcoinTransaction(BitcoinTransaction: BitcoinTransaction) {
    switch (BitcoinTransaction.vin[0].prevout.scriptpubkey_type) {
      case 'v0_p2wpkh':
        return BitcoinTransaction.vin[0].witness[1];
      default:
        throw new Error('Unsupported ScriptPubKey type');
    }
  }

  function buildAcceptableBitcoinTransactionScript(
    userPublicKey: string,
    attestorPublicKey: string,
    outputScriptASM: string
  ): Buffer {
    // The Acceptable Script can be in either order, so we try both
    const acceptablePublicKeyOrder = [
      [userPublicKey, attestorPublicKey],
      [attestorPublicKey, userPublicKey],
    ];

    let acceptedScript: Buffer | undefined = undefined;

    // Loop through the Acceptable Public Key orders
    for (const [key_a, key_b] of acceptablePublicKeyOrder) {
      // Create the Acceptable Script with the Public Keys
      const acceptableScript = script.compile([
        Buffer.from(key_a, 'hex'),
        opcodes.OP_CHECKSIGVERIFY,
        Buffer.from(key_b, 'hex'),
        opcodes.OP_CHECKSIG,
      ]);

      console.log('Acceptable Script ASM:', script.toASM(acceptableScript));
      console.log('Funding Transaction Output Script ASM:', outputScriptASM);

      // Check if the Funding Transaction Output Script matches the Acceptable Script
      if (outputScriptASM === script.toASM(acceptableScript)) {
        acceptedScript = acceptableScript;
      }
    }

    if (!acceptedScript) {
      throw new Error('Could not find Acceptable Script.');
    }

    return acceptedScript;
  }

  async function checkIfScriptIsAcceptable() {
    // This is an existing Funded Vault's Funding Transaction ID [Regtest]
    const TEST_FUNDING_TXID = 'fae0caeb413a009a049c2168d14cd5591fe3781b1494f2ed32c23c87dde929bf';

    // This is the value of the locked Bitcoin in the Funded Vault
    const TEST_VALUE = 100000;

    try {
      // Fetch the Funding Transaction by its ID
      const fundingTransaction = await fetchFundingTransaction(TEST_FUNDING_TXID);

      // Get the Closing Transaction Input from the Funding Transaction by the locked Bitcoin value
      const closingTransactionInput = getClosingTransactionInputFromFundingTransaction(
        fundingTransaction,
        TEST_VALUE
      );

      if (!closingTransactionInput) {
        throw new Error('Could not find Closing Transaction Input.');
      }

      // Get the User Public Key from the Funding Transaction, assuming it is a P2WPKH script
      const userPublicKey = getPublicKeyFromBitcoinTransaction(fundingTransaction);
      console.log('User Public Key:', userPublicKey);

      // Get the Attestor Public Key from the Attestor Group
      const attestorPublicKey = await getAttestorGroupPublicKey();
      console.log('Attestor Public Key:', attestorPublicKey);

      // Build the acceptable Bitcoin Transaction Script from the User and Attestor Public Keys
      const acceptableBitcoinTransactionScript = buildAcceptableBitcoinTransactionScript(
        userPublicKey,
        attestorPublicKey,
        closingTransactionInput.scriptpubkey_asm
      );

      console.log(
        'Acceptable Bitcoin Transaction Script:',
        acceptableBitcoinTransactionScript.toString('hex')
      );
    } catch (error) {
      console.error('Error checking if Script is Acceptable:', error);
    }
  }

  return {
    checkIfScriptIsAcceptable,
  };
}
