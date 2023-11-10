import { BrowserRouter as Router, Routes } from "react-router-dom";

import { VStack } from "@chakra-ui/react";
import { Header } from "@components/header/header";
import { HasChildren } from "@models/has-children";

export function AppLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <Router>
      <VStack py={"25px"}>
        <Header />
        <Routes>{children}</Routes>
      </VStack>
    </Router>
  );
}
