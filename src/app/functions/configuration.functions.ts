import { WalletType } from '@models/wallet';
import { getEthereumContract, getProvider } from 'dlc-btc-lib/ethereum-functions';
import { EthereumDeploymentPlan, EthereumNetwork } from 'dlc-btc-lib/models';
import { Contract } from 'ethers';

import { getEthereumSigner } from './ethereum-account.functions';

export function getEthereumNetworkDeploymentPlans(
  ethereumNetwork: EthereumNetwork
): EthereumDeploymentPlan[] {
  const ethereumNetworkDeploymentPlans: EthereumDeploymentPlan[] =
    appConfiguration.ethereumContractInformations[ethereumNetwork.name.toLowerCase()];

  return ethereumNetworkDeploymentPlans;
}

export function getEthereumContractWithProvider(
  contractDeploymentPlans: EthereumDeploymentPlan[],
  ethereumNetwork: EthereumNetwork,
  contractName: string,
  rpcEndpoint?: string
): Contract {
  return getEthereumContract(
    contractDeploymentPlans,
    contractName,
    getProvider(rpcEndpoint ?? ethereumNetwork.defaultNodeURL)
  );
}

export async function getEthereumContractWithSigner(
  contractDeploymentPlans: EthereumDeploymentPlan[],
  contractName: string,
  walletType: WalletType,
  ethereumNetwork: EthereumNetwork
): Promise<Contract> {
  return getEthereumContract(
    contractDeploymentPlans,
    contractName,
    await getEthereumSigner(walletType, ethereumNetwork)
  );
}
