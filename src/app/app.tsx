import { Route } from 'react-router-dom';

import { AppLayout } from '@components/app.layout';
import { MyVaults } from '@pages/my-vaults/my-vaults';
import { ProofOfReservePage } from '@pages/proof-of-reserve/proof-of-reserve-page';
import { BalanceContextProvider } from '@providers/balance-context-provider';
import { EthereumObserverProvider } from '@providers/ethereum-observer-provider';

import { About } from './pages/about/about';
import { Dashboard } from './pages/dashboard/dashboard';
import { EthereumContextProvider } from './providers/ethereum-context-provider';
import { VaultContextProvider } from './providers/vault-context-provider';

export function App(): React.JSX.Element {
  return (
    <EthereumContextProvider>
      <EthereumObserverProvider>
        <VaultContextProvider>
          <BalanceContextProvider>
            <AppLayout>
              <Route path="/" element={<Dashboard />} />
              <Route path="/my-vaults" element={<MyVaults />} />
              <Route path="/how-it-works" element={<About />} />
              <Route path="/proof-of-reserve" element={<ProofOfReservePage />} />
            </AppLayout>
          </BalanceContextProvider>
        </VaultContextProvider>
      </EthereumObserverProvider>
    </EthereumContextProvider>
  );
}
