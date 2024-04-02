import { AttestorError } from '@models/error-types';

import { useEndpoints } from './use-endpoints';

interface UseAttestorsReturnType {
  getAttestorGroupPublicKey: () => Promise<string>;
  sendClosingTransactionToAttestors: (
    fundingTransaction: string,
    closingPSBT: string,
    uuid: string,
    userNativeSegwitAddress: string
  ) => Promise<void>;
}

export function useAttestors(): UseAttestorsReturnType {
  const { attestorAPIURLs, ethereumAttestorChainID } = useEndpoints();

  async function getAttestorGroupPublicKey(): Promise<string> {
    const coordinatorGroupPublicKeyEndpoint = `${attestorAPIURLs[0]}/tss/get-group-publickey`;
    try {
      const response = await fetch(coordinatorGroupPublicKeyEndpoint);

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const attestorGroupPublicKey = await response.text();
      return attestorGroupPublicKey;
    } catch (error) {
      throw new AttestorError(`Error getting Attestor Group Public Key: ${error}`);
    }
  }

  async function sendClosingTransactionToAttestors(
    fundingTransaction: string,
    closingPSBT: string,
    uuid: string,
    userNativeSegwitAddress: string
  ): Promise<void> {
    const createPSBTURLs = attestorAPIURLs.map(url => `${url}/app/create-psbt-event`);

    const requests = createPSBTURLs.map(async url =>
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          uuid,
          funding_transaction: fundingTransaction,
          closing_psbt: closingPSBT,
          mint_address: userNativeSegwitAddress,
          chain: ethereumAttestorChainID,
        }),
      })
        .then(response => response.ok)
        .catch(() => {
          return false;
        })
    );

    const responses = await Promise.all(requests);
    if (!responses.includes(true)) {
      throw new Error('Error sending Closing Transaction to Attestors!');
    }
  }

  return {
    getAttestorGroupPublicKey,
    sendClosingTransactionToAttestors,
  };
}
