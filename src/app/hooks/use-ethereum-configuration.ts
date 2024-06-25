import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { getNetworkName } from '@functions/ethereum-account.functions';
import { RootState } from '@store/index';
import { supportedEthereumNetworks } from 'dlc-btc-lib/constants';
import { EthereumNetwork, EthereumNetworkID, SupportedNetwork } from 'dlc-btc-lib/models';

interface NetworkEndpoints {
  ethereumExplorerAPIURL: string;
  ethereumAttestorChainID: string;
  ethereumNetworkName: SupportedNetwork;
  enabledEthereumNetworks: EthereumNetwork[];
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
  const [ethereumAttestorChainID, setEthereumAttestorChainID] = useState<string>('');
  const [ethereumNetworkName, setEthereumNetworkName] = useState<SupportedNetwork>(
    appConfiguration.arbitrumNetworkName
  );
  const [enabledEthereumNetworks, setEnabledEthereumNetworks] = useState<EthereumNetwork[]>([]);

  useEffect(() => {
    if (!network) return;

    const {
      ethereumExplorerAPIURL,
      ethereumAttestorChainID,
      enabledEthereumNetworks,
      ethereumNetworkName,
    } = getEndpoints();

    setEthereumExplorerAPIURL(ethereumExplorerAPIURL);
    setEthereumAttestorChainID(ethereumAttestorChainID);
    setEthereumNetworkName(ethereumNetworkName);
    setEnabledEthereumNetworks(enabledEthereumNetworks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network]);

  function getEndpoints(): NetworkEndpoints {
    const enabledEthereumNetworks: EthereumNetwork[] =
      appConfiguration.enabledEthereumNetworkIDs.map(id =>
        getEthereumNetworkByID(id as EthereumNetworkID)
      );

    const networkName = getNetworkName(network?.id as EthereumNetworkID);

    switch (network?.id) {
      case EthereumNetworkID.ArbitrumSepolia:
        return {
          ethereumExplorerAPIURL: 'https://sepolia.arbiscan.io',
          ethereumAttestorChainID: 'evm-arbsepolia',
          ethereumNetworkName: networkName,
          enabledEthereumNetworks,
        };
      case EthereumNetworkID.Arbitrum:
        return {
          ethereumExplorerAPIURL: 'https://arbiscan.io',
          ethereumAttestorChainID: 'evm-arbitrum',
          ethereumNetworkName: networkName,
          enabledEthereumNetworks,
        };
      default:
        throw new Error(`Unsupported network: ${network?.name}`);
    }
  }
  return {
    ethereumExplorerAPIURL,
    ethereumAttestorChainID,
    ethereumNetworkName,
    enabledEthereumNetworks,
  };
}
