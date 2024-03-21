/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState } from 'react';

import { EthereumError } from '@models/error-types';
import { EthereumNetwork } from '@models/ethereum-network';
import { Contract, ethers } from 'ethers';

interface UseEthereumContractsReturnType {
  getEthereumContracts: (
    ethereumSigner: ethers.providers.JsonRpcSigner,
    ethereumNetwork: EthereumNetwork
  ) => Promise<void>;
  protocolContract: Contract | undefined;
  dlcManagerContract: Contract | undefined;
  dlcBTCContract: Contract | undefined;
  contractsLoaded: boolean;
}

export function useEthereumContracts(): UseEthereumContractsReturnType {
  const protocolContract = useRef<Contract | undefined>(undefined);
  const dlcManagerContract = useRef<Contract | undefined>(undefined);
  const dlcBTCContract = useRef<Contract | undefined>(undefined);

  const [contractsLoaded, setContractsLoaded] = useState<boolean>(false);

  async function getEthereumContracts(
    ethereumSigner: ethers.providers.JsonRpcSigner,
    ethereumNetwork: EthereumNetwork
  ): Promise<void> {
    setContractsLoaded(false);

    if (!protocolContract.current) {
      const protocolContractData = await fetchEthereumDeploymentPlan(
        'TokenManager',
        ethereumNetwork
      );
      const contract = new ethers.Contract(
        protocolContractData.contract.address,
        protocolContractData.contract.abi,
        ethereumSigner
      );
      protocolContract.current = contract;
    }

    if (!dlcManagerContract.current) {
      const dlcManagerContractData = await fetchEthereumDeploymentPlan(
        'DLCManager',
        ethereumNetwork
      );
      const contract = new ethers.Contract(
        dlcManagerContractData.contract.address,
        dlcManagerContractData.contract.abi,
        ethereumSigner
      );
      dlcManagerContract.current = contract;
    }

    if (!dlcBTCContract.current) {
      const dlcBTCContractData = await fetchEthereumDeploymentPlan('DLCBTC', ethereumNetwork);
      const contract = new ethers.Contract(
        dlcBTCContractData.contract.address,
        dlcBTCContractData.contract.abi,
        ethereumSigner
      );
      dlcBTCContract.current = contract;
    }

    setContractsLoaded(true);
  }

  async function fetchEthereumDeploymentPlan(
    contractName: string,
    ethereumNetwork: EthereumNetwork
  ) {
    const branchName = import.meta.env.VITE_ETHEREUM_DEPLOYMENT_BRANCH;
    const contractVersion = import.meta.env.VITE_ETHEREUM_DEPLOYMENT_VERSION;
    const deploymentPlanURL = `https://raw.githubusercontent.com/DLC-link/dlc-solidity/${branchName}/deploymentFiles/${ethereumNetwork.name.toLowerCase()}/v${contractVersion}/${contractName}.json`;

    // eslint-disable-next-line no-console
    console.log(
      `Fetching deployment info for ${contractName} on ${ethereumNetwork.name} from dlc-solidity/${branchName}`
    );

    try {
      const response = await fetch(deploymentPlanURL);
      const contractData = await response.json();
      return contractData;
    } catch (error) {
      throw new EthereumError(
        `Could not fetch deployment info for ${contractName} on ${ethereumNetwork.name}`
      );
    }
  }

  return {
    getEthereumContracts,
    protocolContract: protocolContract.current,
    dlcManagerContract: dlcManagerContract.current,
    dlcBTCContract: dlcBTCContract.current,
    contractsLoaded,
  };
}
