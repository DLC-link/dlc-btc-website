import { Route } from 'react-router-dom';

import { AppLayout } from '@components/app.layout';
import { ProofOfReserve } from '@components/proof-of-reserve/proof-of-reserve';
import { MyVaults } from '@pages/my-vaults/my-vaults';
import { BalanceContextProvider } from '@providers/balance-context-provider';

import { About } from './pages/about/about';
import { Dashboard } from './pages/dashboard/dashboard';
import { BlockchainContextProvider } from './providers/blockchain-context-provider';
import { VaultContextProvider } from './providers/vault-context-provider';

export function App(): React.JSX.Element {
  return (
    <BlockchainContextProvider>
      <VaultContextProvider>
        <BalanceContextProvider>
          <AppLayout>
            <Route path="/" element={<Dashboard />} />
            <Route path="/my-vaults" element={<MyVaults />} />
            <Route path="/how-it-works" element={<About />} />
            <Route path="/proof-of-reserve" element={<ProofOfReserve />} />
          </AppLayout>
        </BalanceContextProvider>
      </VaultContextProvider>
    </BlockchainContextProvider>
  );
}
