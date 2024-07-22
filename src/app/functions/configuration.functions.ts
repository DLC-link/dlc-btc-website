import { ContractInformation } from '@models/ethereum-models';
import { getEthereumContract, getProvider } from 'dlc-btc-lib/ethereum-functions';
import { EthereumDeploymentPlan, EthereumNetwork } from 'dlc-btc-lib/models';
import { Contract } from 'ethers';
import { isNil } from 'ramda';

export function getEthereumNetworkDeploymentPlans(
  ethereumNetwork: EthereumNetwork
): EthereumDeploymentPlan[] {
  const ethereumNetworkDeploymentPlans: ContractInformation =
    appConfiguration.ethereumContractInformations.find(
      (networkContractInformation: any) =>
        networkContractInformation.name === ethereumNetwork.name.toLowerCase()
    );

  if (isNil(ethereumNetworkDeploymentPlans)) {
    throw new Error('Deployment plans not found');
  }

  return ethereumNetworkDeploymentPlans.contractInformation;
}

export function getEthereumContractWithProvider(
  contractDeploymentPlans: EthereumDeploymentPlan[],
  ethereumNetwork: EthereumNetwork,
  contractName: string,
  rpcEndpoint: string
): Contract {
  const provider = getProvider(rpcEndpoint ?? ethereumNetwork.defaultNodeURL);

  return getEthereumContract(contractDeploymentPlans, contractName, provider);
}
