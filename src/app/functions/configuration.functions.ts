import { ContractInformation } from '@models/ethereum-models';
import { getEthereumContract } from 'dlc-btc-lib/ethereum-functions';
import { EthereumDeploymentPlan, EthereumNetwork } from 'dlc-btc-lib/models';
import { Contract, ethers } from 'ethers';
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

export function getEthereumContractWithDefaultNode(
  contractDeploymentPlans: EthereumDeploymentPlan[],
  ethereumNetwork: EthereumNetwork,
  contractName: string
): Contract {
  const provider = new ethers.providers.JsonRpcProvider(ethereumNetwork.defaultNodeURL);

  return getEthereumContract(contractDeploymentPlans, contractName, provider);
}
