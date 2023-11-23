import { Route } from 'react-router-dom';

import { AppLayout } from '@components/app.layout';
import { ModalContainer } from '@components/modals/components/modal-container';
import { MyVaults } from '@pages/my-vaults/my-vaults';

import { About } from './pages/about/about';
import { Dashboard } from './pages/dashboard/dashboard';
import {
  BlockchainContextProvider
} from './providers/blockchain-context-provider';

export function App(): React.JSX.Element {
  return (
    <BlockchainContextProvider>
      <AppLayout>
        <Route path="/" element={<Dashboard />} />
        <Route path="/my-vaults" element={<MyVaults />} />
        <Route path="/how-it-works" element={<About />} />
      </AppLayout>
      <ModalContainer />
    </BlockchainContextProvider>
  );
}
