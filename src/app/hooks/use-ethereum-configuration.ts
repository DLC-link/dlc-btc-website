import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { EthereumNetwork, EthereumNetworkID, ethereumNetworks } from '@models/ethereum-network';
import { RootState } from '@store/index';

interface NetworkEndpoints {
  ethereumExplorerAPIURL: string;
  ethereumAttestorChainID: 'evm-arbitrum' | 'evm-arbsepolia' | 'evm-localhost';
  enabledEthereumNetworks: EthereumNetwork[];
}

function getEthereumNetworkByID(ethereumNetworkID: EthereumNetworkID): EthereumNetwork {
  const ethereumNetwork = ethereumNetworks.find(network => network.id === ethereumNetworkID);
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

  useEffect(() => {
    if (!network) return;

    const { ethereumExplorerAPIURL, ethereumAttestorChainID, enabledEthereumNetworks } =
      getEndpoints();

    setEthereumExplorerAPIURL(ethereumExplorerAPIURL);
    setEthereumAttestorChainID(ethereumAttestorChainID);
    setEnabledEthereumNetworks(enabledEthereumNetworks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network]);

  function getEndpoints(): NetworkEndpoints {
    const enabledEthereumNetworks: EthereumNetwork[] =
      appConfiguration.enabledEthereumNetworkIDs.map(id =>
        getEthereumNetworkByID(id as EthereumNetworkID)
      );

    switch (network?.id) {
      case EthereumNetworkID.ArbSepolia:
        return {
          ethereumExplorerAPIURL: 'https://sepolia.arbiscan.io',
          ethereumAttestorChainID: 'evm-arbsepolia',
          enabledEthereumNetworks,
        };
      case EthereumNetworkID.Arbitrum:
        return {
          ethereumExplorerAPIURL: 'https://arbiscan.io',
          ethereumAttestorChainID: 'evm-arbitrum',
          enabledEthereumNetworks,
        };
      case EthereumNetworkID.Hardhat:
        return {
          ethereumExplorerAPIURL: 'https://arbiscan.io',
          ethereumAttestorChainID: 'evm-localhost',
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
  };
}
