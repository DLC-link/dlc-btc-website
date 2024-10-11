import { createContext, useContext } from 'react';

import { useNetworkConnection } from '@hooks/use-connected';
import { HasChildren } from '@models/has-children';
import { useQuery } from '@tanstack/react-query';
import {
  getAddressDLCBTCBalance,
  getAllAddressVaults,
  getLockedBTCBalance,
} from 'dlc-btc-lib/ethereum-functions';
import {
  getDLCBTCBalance,
  getLockedBTCBalance as getLockedBTCBalanceXRPL,
} from 'dlc-btc-lib/ripple-functions';
import { useAccount } from 'wagmi';

import { EthereumNetworkConfigurationContext } from './ethereum-network-configuration.provider';
import { NetworkConfigurationContext } from './network-configuration.provider';
import { RippleNetworkConfigurationContext } from './ripple-network-configuration.provider';

interface VaultContextType {
  dlcBTCBalance: number | undefined;
  lockedBTCBalance: number | undefined;
}

export const BalanceContext = createContext<VaultContextType>({
  dlcBTCBalance: undefined,
  lockedBTCBalance: undefined,
});

export function BalanceContextProvider({ children }: HasChildren): React.JSX.Element {
  const {
    ethereumNetworkConfiguration: { dlcBTCContract, dlcManagerContract },
  } = useContext(EthereumNetworkConfigurationContext);
  const { networkType } = useContext(NetworkConfigurationContext);
  const { isConnected } = useNetworkConnection();
  const { rippleUserAddress, rippleClient, rippleWalletClient } = useContext(
    RippleNetworkConfigurationContext
  );

  const { address: ethereumUserAddress } = useAccount();

  const fetchEVMBalances = async () => {
    const dlcBTCBalance = await getAddressDLCBTCBalance(dlcBTCContract, ethereumUserAddress!);

    const lockedBTCBalance = await getLockedBTCBalance(
      await getAllAddressVaults(dlcManagerContract, ethereumUserAddress!)
    );

    return { dlcBTCBalance, lockedBTCBalance };
  };

  const fetchXRPLBalances = async () => {
    const dlcBTCBalance = await getDLCBTCBalance(
      rippleClient,
      rippleWalletClient!,
      appConfiguration.rippleIssuerAddress
    );
    console.log('dlcBTCBalance', dlcBTCBalance);
    const lockedBTCBalance = await getLockedBTCBalanceXRPL(
      rippleClient,
      rippleWalletClient!,
      appConfiguration.rippleIssuerAddress
    );
    console.log('lockedBTCBalance', lockedBTCBalance);
    return { dlcBTCBalance, lockedBTCBalance };
  };

  const { data } = useQuery({
    queryKey: ['balances', networkType === 'evm' ? ethereumUserAddress : rippleUserAddress],
    queryFn: networkType === 'evm' ? fetchEVMBalances : fetchXRPLBalances,
    enabled: isConnected,
    refetchInterval: 10000,
  });

  return (
    <BalanceContext.Provider
      value={{ dlcBTCBalance: data?.dlcBTCBalance, lockedBTCBalance: data?.lockedBTCBalance }}
    >
      {children}
    </BalanceContext.Provider>
  );
}
