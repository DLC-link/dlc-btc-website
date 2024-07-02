import { AttestorError } from '@models/error-types';

interface UseAttestorsReturnType {
  sendFundingTransactionToAttestors: (
    fundingTXAttestorInfo: FundingTXAttestorInfo
  ) => Promise<void>;
  sendDepositWithdrawTransactionToAttestors: (
    depositWithdrawTXInfo: DepositWithdrawTXAttestorInfo
  ) => Promise<void>;
}

interface FundingTXAttestorInfo {
  vaultUUID: string;
  fundingPSBT: string;
  userEthereumAddress: string;
  userBitcoinPublicKey: string;
  chain: 'evm-arbitrum' | 'evm-arbsepolia' | 'evm-localhost';
}

interface DepositWithdrawTXAttestorInfo {
  vaultUUID: string;
  depositWithdrawPSBT: string;
  chain: 'evm-arbitrum' | 'evm-arbsepolia' | 'evm-localhost';
}

export function useAttestors(): UseAttestorsReturnType {
  async function sendFundingTransactionToAttestors(
    fundingTXAttestorInfo: FundingTXAttestorInfo
  ): Promise<void> {
    const createPSBTURLs = appConfiguration.attestorURLs.map(url => `${url}/app/create-psbt-event`);

    const requests = createPSBTURLs.map(async url =>
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          uuid: fundingTXAttestorInfo.vaultUUID,
          funding_transaction_psbt: fundingTXAttestorInfo.fundingPSBT,
          mint_address: fundingTXAttestorInfo.userEthereumAddress,
          chain: fundingTXAttestorInfo.chain,
          alice_pubkey: fundingTXAttestorInfo.userBitcoinPublicKey,
        }),
      })
        .then(response => response.ok)
        .catch(() => {
          return false;
        })
    );

    const responses = await Promise.all(requests);
    if (!responses.includes(true)) {
      throw new AttestorError('Error sending Funding Transaction to Attestors!');
    }
  }

  async function sendDepositWithdrawTransactionToAttestors(
    depositWithdrawTXInfo: DepositWithdrawTXAttestorInfo
  ): Promise<void> {
    const createPSBTURLs = appConfiguration.attestorURLs.map(url => `${url}/app/withdraw`);

    const requests = createPSBTURLs.map(async url =>
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          uuid: depositWithdrawTXInfo.vaultUUID,
          wd_psbt: depositWithdrawTXInfo.depositWithdrawPSBT,
          chain: depositWithdrawTXInfo.chain,
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
    sendFundingTransactionToAttestors,
    sendDepositWithdrawTransactionToAttestors,
  };
}
