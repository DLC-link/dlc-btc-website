import { AttestorError } from '@models/error-types';

import { useEndpoints } from './use-endpoints';

interface UseAttestorsReturnType {
  sendClosingTransactionToAttestors: (
    fundingTransaction: string,
    closingPSBT: string,
    uuid: string,
    userNativeSegwitAddress: string
  ) => Promise<void>;
  getExtendedAttestorGroupPublicKey: () => Promise<string>;
}

export function useAttestors(): UseAttestorsReturnType {
  const { attestorAPIURLs, ethereumAttestorChainID } = useEndpoints();

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
      throw new AttestorError('Error sending Closing Transaction to Attestors!');
    }
  }

  async function getExtendedAttestorGroupPublicKey(): Promise<string> {
    const attestorExtendedPublicKeyEndpoint = `${attestorAPIURLs[0]}/tss/get-extended-group-publickey`;
    const response = await fetch(attestorExtendedPublicKeyEndpoint);

    if (!response.ok) {
      throw new Error(`Failed to get Extended Attestor Group Public Key: ${response.statusText}`);
    }

    const extendedAttestorGroupPublicKey = await response.text();

    return extendedAttestorGroupPublicKey;
  }

  return {
    sendClosingTransactionToAttestors,
    getExtendedAttestorGroupPublicKey,
  };
}
