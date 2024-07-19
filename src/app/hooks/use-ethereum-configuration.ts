import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { getEthereumNetworkDeploymentPlans } from '@functions/configuration.functions';
import { RootState } from '@store/index';
import { supportedEthereumNetworks } from 'dlc-btc-lib/constants';
import { EthereumDeploymentPlan, EthereumNetwork, EthereumNetworkID } from 'dlc-btc-lib/models';

interface NetworkEndpoints {
  ethereumExplorerAPIURL: string;
  ethereumAttestorChainID: 'evm-arbitrum' | 'evm-arbsepolia' | 'evm-localhost';
  enabledEthereumNetworks: EthereumNetwork[];
  ethereumContractDeploymentPlans: EthereumDeploymentPlan[];
}

function getEthereumNetworkByID(ethereumNetworkID: EthereumNetworkID): EthereumNetwork {
  const ethereumNetwork = supportedEthereumNetworks.find(
    network => network.id === ethereumNetworkID
  );
  if (!ethereumNetwork) {
    throw new Error(`Unsupported Ethereum network: ${ethereumNetworkID}`);
  }
  return ethereumNetwork;
}

export function useEthereumConfiguration(): NetworkEndpoints {
  const { network } = useSelector((state: RootState) => state.account);

  const [ethereumExplorerAPIURL, setEthereumExplorerAPIURL] = useState<string>('');
  const [ethereumAttestorChainID, setEthereumAttestorChainID] = useState<
    'evm-arbitrum' | 'evm-arbsepolia' | 'evm-localhost'
  >('evm-arbsepolia');
  const [enabledEthereumNetworks, setEnabledEthereumNetworks] = useState<EthereumNetwork[]>([]);
  const [ethereumContractDeploymentPlans, setEthereumContractDeploymentPlans] = useState<
    EthereumDeploymentPlan[]
  >(getEthereumNetworkDeploymentPlans(network));

  useEffect(() => {
    if (!network) return;

    const {
      ethereumExplorerAPIURL,
      ethereumAttestorChainID,
      enabledEthereumNetworks,
      ethereumContractDeploymentPlans,
    } = getEndpoints();

    setEthereumExplorerAPIURL(ethereumExplorerAPIURL);
    setEthereumAttestorChainID(ethereumAttestorChainID);
    setEnabledEthereumNetworks(enabledEthereumNetworks);
    setEthereumContractDeploymentPlans(ethereumContractDeploymentPlans);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network]);

  function getEndpoints(): NetworkEndpoints {
    const enabledEthereumNetworks: EthereumNetwork[] =
      appConfiguration.enabledEthereumNetworkIDs.map(id =>
        getEthereumNetworkByID(id as EthereumNetworkID)
      );

    const ethereumContractDeploymentPlans = getEthereumNetworkDeploymentPlans(network);

    switch (network?.id) {
      case EthereumNetworkID.ArbitrumSepolia:
        return {
          ethereumExplorerAPIURL: 'https://sepolia.arbiscan.io',
          ethereumAttestorChainID: 'evm-arbsepolia',
          ethereumContractDeploymentPlans,
          enabledEthereumNetworks,
        };
      case EthereumNetworkID.Arbitrum:
        return {
          ethereumExplorerAPIURL: 'https://arbiscan.io',
          ethereumAttestorChainID: 'evm-arbitrum',
          ethereumContractDeploymentPlans,
          enabledEthereumNetworks,
        };
      case EthereumNetworkID.Hardhat:
        return {
          ethereumExplorerAPIURL: 'https://arbiscan.io',
          ethereumAttestorChainID: 'evm-localhost',
          ethereumContractDeploymentPlans,
          enabledEthereumNetworks,
        };
      default:
        throw new Error(`Unsupported network: ${network?.name}`);
    }
  }
  return {
    ethereumExplorerAPIURL,
    ethereumAttestorChainID,
    enabledEthereumNetworks,
    ethereumContractDeploymentPlans,
  };
}
