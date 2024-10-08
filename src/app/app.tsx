import { Route } from 'react-router-dom';

import { AppLayout } from '@components/app.layout';
import { MerchantDetails } from '@components/proof-of-reserve/components/merchant-details/merchant-details';
import { getWagmiConfiguration } from '@functions/configuration.functions';
import { AttestorDetailsPage } from '@pages/attestor-details/attestor-details-page';
import { AttestorDetailsSelectPage } from '@pages/attestor-details/attestor-details-select-page';
import { MyVaults } from '@pages/my-vaults/my-vaults';
import { PointsPage } from '@pages/points/points-page';
import { ProofOfReservePage } from '@pages/proof-of-reserve/proof-of-reserve-page';
import { BalanceContextProvider } from '@providers/balance-context-provider';
import { BitcoinTransactionConfirmationsProvider } from '@providers/bitcoin-query-provider';
import { BitcoinWalletContextProvider } from '@providers/bitcoin-wallet-context-provider';
import { EthereumNetworkConfigurationContextProvider } from '@providers/ethereum-network-configuration.provider';
import { EthereumObserverProvider } from '@providers/ethereum-observer-provider';
import { NetworkConfigurationContextProvider } from '@providers/network-configuration.provider';
import { ProofOfReserveContextProvider } from '@providers/proof-of-reserve-context-provider';
import {
  RippleNetworkConfigurationContext,
  RippleNetworkConfigurationContextProvider,
} from '@providers/ripple-network-configuration.provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

// import { About } from './pages/about/about';
import { Dashboard } from './pages/dashboard/dashboard';
import { VaultContextProvider } from './providers/vault-context-provider';

const queryClient = new QueryClient();
export const wagmiConfiguration = getWagmiConfiguration(appConfiguration.enabledEthereumNetworkIDs);

export function App(): React.JSX.Element {
  return (
    <WagmiProvider config={wagmiConfiguration}>
      <QueryClientProvider client={queryClient}>
        <NetworkConfigurationContextProvider>
          <RippleNetworkConfigurationContextProvider>
            <EthereumNetworkConfigurationContextProvider>
              <BitcoinWalletContextProvider>
                <VaultContextProvider>
                  <EthereumObserverProvider>
                    <BitcoinTransactionConfirmationsProvider>
                      <BalanceContextProvider>
                        <ProofOfReserveContextProvider>
                          <AppLayout>
                            <Route path="/" element={<PointsPage />} />
                            <Route path="/my-vaults" element={<MyVaults />} />
                            {/* <Route path="/how-it-works" element={<About />} /> */}
                            <Route path="/proof-of-reserve" element={<ProofOfReservePage />} />
                            <Route path="/attestor-details" element={<AttestorDetailsPage />} />
                            <Route
                              path="/attestor-details-select"
                              element={<AttestorDetailsSelectPage />}
                            />
                            <Route path="/merchant-details/:name" element={<MerchantDetails />} />
                            <Route path="/mint-withdraw" element={<Dashboard />} />
                          </AppLayout>
                        </ProofOfReserveContextProvider>
                      </BalanceContextProvider>
                    </BitcoinTransactionConfirmationsProvider>
                  </EthereumObserverProvider>
                </VaultContextProvider>
              </BitcoinWalletContextProvider>
            </EthereumNetworkConfigurationContextProvider>
          </RippleNetworkConfigurationContextProvider>
        </NetworkConfigurationContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
