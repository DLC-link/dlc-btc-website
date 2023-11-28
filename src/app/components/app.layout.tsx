import { BrowserRouter as Router, Routes } from "react-router-dom";

import { VStack } from "@chakra-ui/react";
import { Header } from "@components/header/header";
import { HasChildren } from "@models/has-children";
import { ModalContainer } from "./modals/components/modal-container";

export function AppLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <Router>
      <VStack py={"25px"}>
        <Header />
        <Routes>{children}</Routes>
        <ModalContainer />
      </VStack>
    </Router>
  );
}
