import { QueryClient, QueryClientProvider } from 'react-query';
import { Route } from 'react-router-dom';

import { AppLayout } from '@components/app.layout';
import { AttestorDetailsPage } from '@pages/attestor-details/attestor-details-page';
import { MyVaults } from '@pages/my-vaults/my-vaults';
import { PointsPage } from '@pages/points/points-page';
import { ProofOfReservePage } from '@pages/proof-of-reserve/proof-of-reserve-page';
import { BalanceContextProvider } from '@providers/balance-context-provider';
import { BlockchainHeightContextProvider } from '@providers/bitcoin-query-provider';
import { BitcoinWalletContextProvider } from '@providers/bitcoin-wallet-context-provider';
import { EthereumObserverProvider } from '@providers/ethereum-observer-provider';
import { ProofOfReserveContextProvider } from '@providers/proof-of-reserve-context-provider';
import { initEccLib } from 'bitcoinjs-lib';
import * as ellipticCurveCryptography from 'tiny-secp256k1';

import { About } from './pages/about/about';
import { Dashboard } from './pages/dashboard/dashboard';
import { EthereumContextProvider } from './providers/ethereum-context-provider';
import { VaultContextProvider } from './providers/vault-context-provider';

const queryClient = new QueryClient();

initEccLib(ellipticCurveCryptography);

export function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <EthereumContextProvider>
        <EthereumObserverProvider>
          <BitcoinWalletContextProvider>
            <VaultContextProvider>
              <BlockchainHeightContextProvider>
                <BalanceContextProvider>
                  <ProofOfReserveContextProvider>
                    <AppLayout>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/my-vaults" element={<MyVaults />} />
                      <Route path="/how-it-works" element={<About />} />
                      <Route path="/proof-of-reserve" element={<ProofOfReservePage />} />
                      <Route path="/points" element={<PointsPage />} />
                      <Route path="/attestor-details" element={<AttestorDetailsPage />} />
                    </AppLayout>
                  </ProofOfReserveContextProvider>
                </BalanceContextProvider>
              </BlockchainHeightContextProvider>
            </VaultContextProvider>
          </BitcoinWalletContextProvider>
        </EthereumObserverProvider>
      </EthereumContextProvider>
    </QueryClientProvider>
  );
}
