import { QueryClient, QueryClientProvider } from "react-query";
import { Route } from "react-router-dom";

import { AppLayout } from "@components/app.layout";
import { ModalContainer } from "@components/modals/components/modal-container";
import { MyVaults } from "@pages/my-vaults/my-vaults";

import { About } from "./pages/about/about";
import { Dashboard } from "./pages/dashboard/dashboard";
import { BlockchainContextProvider } from "./providers/blockchain-context-provider";

const queryClient = new QueryClient();

export function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <BlockchainContextProvider>
        <AppLayout>
          <Route path="/" element={<Dashboard />} />
          <Route path="/my-vaults" element={<MyVaults />} />
          <Route path="/how-it-works" element={<About />} />
        </AppLayout>
        <ModalContainer />
      </BlockchainContextProvider>
    </QueryClientProvider>
  );
}
