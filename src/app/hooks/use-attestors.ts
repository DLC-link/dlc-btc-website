import { AttestorError } from '@models/error-types';

interface UseAttestorsReturnType {
  sendFundingTransactionToAttestors: (
    fundingTXAttestorInfo: FundingTXAttestorInfo
  ) => Promise<void>;
  sendWithdrawalTransactionToAttestors: (
    withdrawalTXAttestorInfo: WithdrawalTXAttestorInfo
  ) => Promise<void>;
  sendDepositTransactionToAttestors: (
    withdrawalTXAttestorInfo: WithdrawalTXAttestorInfo
  ) => Promise<void>;
}

export interface FundingTXAttestorInfo {
  vaultUUID: string;
  fundingPSBT: string;
  userEthereumAddress: string;
  userBitcoinPublicKey: string;
  chain: string;
}

export interface WithdrawalTXAttestorInfo {
  vaultUUID: string;
  withdrawalPSBT: string;
  chain: string;
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

  async function sendDepositTransactionToAttestors(
    withdrawalTXAttestorInfo: WithdrawalTXAttestorInfo
  ): Promise<void> {
    const createPSBTURLs = appConfiguration.attestorURLs.map(url => `${url}/app/deposit`);

    const requests = createPSBTURLs.map(async url =>
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          uuid: withdrawalTXAttestorInfo.vaultUUID,
          withdraw_psbt: withdrawalTXAttestorInfo.withdrawalPSBT,
          chain: withdrawalTXAttestorInfo.chain,
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

  async function sendWithdrawalTransactionToAttestors(
    withdrawalTXAttestorInfo: WithdrawalTXAttestorInfo
  ): Promise<void> {
    const createPSBTURLs = appConfiguration.attestorURLs.map(url => `${url}/app/withdraw`);

    const requests = createPSBTURLs.map(async url =>
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          uuid: withdrawalTXAttestorInfo.vaultUUID,
          withdraw_psbt: withdrawalTXAttestorInfo.withdrawalPSBT,
          chain: withdrawalTXAttestorInfo.chain,
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
    sendDepositTransactionToAttestors,
    sendWithdrawalTransactionToAttestors,
  };
}
