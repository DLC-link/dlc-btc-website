import { AttestorError } from '@models/error-types';

import { useEndpoints } from './use-endpoints';

interface UseAttestorsReturnType {
  getAttestorGroupPublicKey: () => Promise<string>;
  sendClosingTransactionToAttestors: (
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
      const attestorGroupPublicKey = await response.text();
      return attestorGroupPublicKey;
    } catch (error) {
      throw new AttestorError(`Error getting Attestor Group Public Key: ${error}`);
    }
  }

  async function sendClosingTransactionToAttestors(
    closingPSBT: string,
    uuid: string,
    userNativeSegwitAddress: string
  ): Promise<void> {
    const createPSBTURLs = attestorAPIURLs.map(url => `${url}/app/create-psbt-event`);
    const requests = createPSBTURLs.map(async url => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          uuid,
          closing_psbt: closingPSBT,
          mint_address: userNativeSegwitAddress,
          chain: ethereumAttestorChainID,
        }),
      });
    });
    await Promise.all(requests);
  }

  return {
    getAttestorGroupPublicKey,
    sendClosingTransactionToAttestors,
  };
}
