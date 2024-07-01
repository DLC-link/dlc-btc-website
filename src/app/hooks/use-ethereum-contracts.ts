/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState } from 'react';

import { EthereumError } from '@models/error-types';
import { EthereumNetwork } from '@models/ethereum-network';
import { Contract, ethers } from 'ethers';

const SOLIDITY_CONTRACT_URL = 'https://raw.githubusercontent.com/DLC-link/dlc-solidity';

interface UseEthereumContractsReturnType {
  getEthereumContracts: (
    ethereumSigner: ethers.providers.JsonRpcSigner,
    ethereumNetwork: EthereumNetwork
  ) => Promise<void>;
  dlcManagerContract: Contract | undefined;
  observerDLCManagerContract: Contract | undefined;
  dlcBTCContract: Contract | undefined;
  contractsLoaded: boolean;
}

export function useEthereumContracts(): UseEthereumContractsReturnType {
  const dlcManagerContract = useRef<Contract | undefined>(undefined);
  const observerDLCManagerContract = useRef<Contract | undefined>(undefined);
  const dlcBTCContract = useRef<Contract | undefined>(undefined);

  const [contractsLoaded, setContractsLoaded] = useState<boolean>(false);

  async function getEthereumContracts(
    ethereumSigner: ethers.providers.JsonRpcSigner,
    ethereumNetwork: EthereumNetwork
  ): Promise<void> {
    setContractsLoaded(false);

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

    if (!observerDLCManagerContract.current) {
      const dlcManagerContractData = await fetchEthereumDeploymentPlan(
        'DLCManager',
        ethereumNetwork
      );
      const contract = new ethers.Contract(
        dlcManagerContractData.contract.address,
        dlcManagerContractData.contract.abi,
        new ethers.providers.WebSocketProvider(import.meta.env.VITE_ARBITRUM_OBSERVER_NODE)
      );
      observerDLCManagerContract.current = contract;
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

    let deploymentPlanURL: string;
    switch (appConfiguration.appEnvironment) {
      case 'mainnet':
      case 'testnet':
      case 'devnet':
        deploymentPlanURL = `${SOLIDITY_CONTRACT_URL}/${branchName}/deploymentFiles/${ethereumNetwork.name.toLowerCase()}/${contractName}.json`;
        break;
      case 'localhost':
        deploymentPlanURL = `${import.meta.env.VITE_ETHEREUM_DEPLOYMENT_FILES_URL}/contracts/localhost/${contractName}.json`;
        break;
      default:
        throw new EthereumError('Invalid Ethereum Network');
    }

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
    observerDLCManagerContract: observerDLCManagerContract.current,
    dlcManagerContract: dlcManagerContract.current,
    dlcBTCContract: dlcBTCContract.current,
    contractsLoaded,
  };
}
