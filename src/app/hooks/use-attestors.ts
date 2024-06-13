import { AttestorError } from '@models/error-types';

import { useEthereumConfiguration } from './use-ethereum-configuration';

interface UseAttestorsReturnType {
  sendClosingTransactionToAttestors: (
    fundingTransaction: string,
    closingPSBT: string,
    uuid: string,
    userNativeSegwitAddress: string
  ) => Promise<void>;
}

export function useAttestors(): UseAttestorsReturnType {
  const { ethereumAttestorChainID } = useEthereumConfiguration();

  async function sendClosingTransactionToAttestors(
    fundingTransaction: string,
    closingPSBT: string,
    uuid: string,
    userNativeSegwitAddress: string
  ): Promise<void> {
    const createPSBTURLs = appConfiguration.attestorURLs.map(url => `${url}/app/create-psbt-event`);

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

  return {
    sendClosingTransactionToAttestors,
  };
}
