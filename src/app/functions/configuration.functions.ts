import { getEthereumContract, getProvider } from 'dlc-btc-lib/ethereum-functions';
import { EthereumDeploymentPlan, EthereumNetwork } from 'dlc-btc-lib/models';
import { Contract } from 'ethers';

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
