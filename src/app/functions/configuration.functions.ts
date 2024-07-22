import { getEthereumContract, getProvider } from 'dlc-btc-lib/ethereum-functions';
import { EthereumDeploymentPlan, EthereumNetwork } from 'dlc-btc-lib/models';
import { Contract } from 'ethers';
import { isNil } from 'ramda';

export function getEthereumNetworkDeploymentPlans(
  ethereumNetwork: EthereumNetwork
): EthereumDeploymentPlan[] {
  const ethereumNetworkDeploymentPlans: EthereumDeploymentPlan[] =
    appConfiguration.ethereumContractInformations[ethereumNetwork.name.toLowerCase()];

  if (isNil(ethereumNetworkDeploymentPlans)) {
    throw new Error('Deployment plans not found');
  }

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
