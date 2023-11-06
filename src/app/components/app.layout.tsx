import { BrowserRouter as Router, Routes } from "react-router-dom";

import { Stack } from "@chakra-ui/react";

import { HasChildren } from "@models/has-children";
import { Header } from "@components/header/header";

export function AppLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <Router>
      <Stack py={["5%", "1.5%"]}>
        <Header />
        <Routes>{children}</Routes>
      </Stack>
    </Router>
  );
}
