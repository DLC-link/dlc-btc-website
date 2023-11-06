import { Route } from "react-router-dom";

import { AppLayout } from "@components/app.layout";
import { ModalContainer } from "@components/modals/components/modal-container";

import { About } from "./pages/about/about";
import { Dashboard } from "./pages/dashboard/dashboard";

export function App(): React.JSX.Element {
  return (
    <>
      <AppLayout>
        <Route path="/" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
      </AppLayout>
      <ModalContainer />
    </>
  );
}
