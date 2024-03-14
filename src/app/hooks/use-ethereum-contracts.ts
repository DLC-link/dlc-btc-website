/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { EthereumError } from '@models/error-types';
import { ethereumNetworks } from '@models/network';
import { RootState } from '@store/index';
import { Contract, ethers } from 'ethers';

export interface UseEthereumContractsReturnType {
  protocolContract: Contract | undefined;
  dlcManagerContract: Contract | undefined;
  dlcBTCContract: Contract | undefined;
  isLoaded: boolean;
}

export function useEthereumContracts(
  ethereumSigner?: ethers.providers.JsonRpcSigner
): UseEthereumContractsReturnType {
  // const { network } = useSelector((state: RootState) => state.account);
  const network = ethereumNetworks[2];

  const [protocolContract, setProtocolContract] = useState<Contract | undefined>(undefined);
  const [dlcManagerContract, setDlcManagerContract] = useState<Contract | undefined>(undefined);
  const [dlcBTCContract, setDlcBTCContract] = useState<Contract | undefined>(undefined);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    console.log('Ethereum Signer:', ethereumSigner);
    if (!ethereumSigner) return;
    console.log('Ethereum Signer:', ethereumSigner);

    if (!protocolContract && !dlcManagerContract && !dlcBTCContract) {
      console.log('Setting up Ethereum Contracts');
      const setupConfiguration = async () => {
        setIsLoaded(false);
        await getEthereumContracts();
        setIsLoaded(true);
      };
      setupConfiguration();
    }
  }, [ethereumSigner, network, protocolContract, dlcManagerContract, dlcBTCContract]);

  async function getEthereumContracts(): Promise<void> {
    if (!network) throw new Error('Please select a network to connect to Ethereum.');

    if (!protocolContract) {
      const protocolContractData = await fetchEthereumDeploymentPlan('TokenManager', network.name);
      const protocolContract = new ethers.Contract(
        protocolContractData.contract.address,
        protocolContractData.contract.abi,
        ethereumSigner
      );
      setProtocolContract(protocolContract);
    }

    if (!dlcManagerContract) {
      const dlcManagerContractData = await fetchEthereumDeploymentPlan('DLCManager', network.name);
      const dlcManagerContract = new ethers.Contract(
        dlcManagerContractData.contract.address,
        dlcManagerContractData.contract.abi,
        ethereumSigner
      );
      setDlcManagerContract(dlcManagerContract);
    }

    if (!dlcBTCContract) {
      const dlcBTCContractData = await fetchEthereumDeploymentPlan('DLCBTC', network.name);
      const dlcBTCContract = new ethers.Contract(
        dlcBTCContractData.contract.address,
        dlcBTCContractData.contract.abi,
        ethereumSigner
      );
      setDlcBTCContract(dlcBTCContract);
    }
  }

  async function fetchEthereumDeploymentPlan(contractName: string, chainID: string) {
    // const network = ethereumNetworks.find(network => network.id === chainID);

    const branchName = import.meta.env.VITE_ETHEREUM_DEPLOYMENT_BRANCH;
    const contractVersion = import.meta.env.VITE_ETHEREUM_DEPLOYMENT_VERSION;
    const deploymentPlanURL = `https://raw.githubusercontent.com/DLC-link/dlc-solidity/${branchName}/deploymentFiles/${network?.name.toLowerCase()}/v${contractVersion}/${contractName}.json`;

    console.log(
      `Fetching deployment info for ${contractName} on ${network?.name} from dlc-solidity/${branchName}`
    );

    try {
      const response = await fetch(deploymentPlanURL);
      const contractData = await response.json();
      return contractData;
    } catch (error) {
      throw new EthereumError(
        `Could not fetch deployment info for ${contractName} on ${network?.name}`
      );
    }
  }

  return {
    protocolContract,
    dlcManagerContract,
    dlcBTCContract,
    isLoaded,
  };
}
