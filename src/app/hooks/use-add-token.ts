import { useContext } from 'react';

import { getEthereumNetworkDeploymentPlanByName } from '@functions/configuration.functions';
import { EthereumNetworkConfigurationContext } from '@providers/ethereum-network-configuration.provider';
import { getWalletClient } from '@wagmi/core';
import { useAccount } from 'wagmi';

import { wagmiConfiguration } from '../app';

export function useAddToken(): () => Promise<void> {
  const { ethereumContractDeploymentPlans } = useContext(EthereumNetworkConfigurationContext);
  const { address, connector, chainId } = useAccount();

  async function addToken() {
    const dlcBTCContractAddress = getEthereumNetworkDeploymentPlanByName(
      ethereumContractDeploymentPlans,
      'DLCBTC'
    ).contract.address;

    const walletClient = await getWalletClient(wagmiConfiguration, {
      chainId,
      connector,
      account: address,
    });
    await walletClient.watchAsset({
      type: 'ERC20',
      options: {
        address: dlcBTCContractAddress,
        symbol: 'dlcBTC',
        decimals: 8,
        image: 'https://dlc-public-assets.s3.amazonaws.com/dlcBTC_Token.png',
      },
    });
  }

  return addToken;
}
