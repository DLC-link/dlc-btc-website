import { Header } from './components/header/header';
import { AppLayout } from './components/home.layout';
import { SelectWalletModal } from './components/modals/select-wallet-modal/select-wallet-modal';

export function App(): React.JSX.Element {
  return (
    <AppLayout>
      <Header />
      <SelectWalletModal />
    </AppLayout>
  );
}
