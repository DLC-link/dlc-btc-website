import { Route } from "react-router-dom";

import { AppLayout } from "@components/app.layout";
import { ModalContainer } from "@components/modals/components/modal-container";

import { About } from "./pages/about/about";
import { Dashboard } from "./pages/dashboard/dashboard";
import { MyDLCBTC } from "@pages/my-dlc-btc/my-dlc-btc";

export function App(): React.JSX.Element {
  return (
    <>
      <AppLayout>
        <Route path="/" element={<Dashboard />} />
        <Route path="/my-dlc-btc" element={<MyDLCBTC />} />
        <Route path="/how-it-works" element={<About />} />
      </AppLayout>
      <ModalContainer />
    </>
  );
}
