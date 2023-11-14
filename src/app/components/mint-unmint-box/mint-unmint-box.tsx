import {
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import { MintUnmintBoxLayout } from "./components/mint-unmint-box.layout";
import { SetupInformationStack } from "./components/setup-information-stack/setup-information-stack";
import { ProtocolSummaryStack } from "./components/protocol-summary-stack/protocol-summary-stack";

export function MintUnmintBox(): React.JSX.Element {
  return (
    <MintUnmintBoxLayout>
      <Tabs variant="unstyled">
        <TabList>
          <Tab>Mint</Tab>
          <Tab>Unmint</Tab>
        </TabList>
        <TabIndicator mt="5px" h="3.5px" bg="accent.cyan.01" />
        <TabPanels>
          <TabPanel>
            <SetupInformationStack />
            <ProtocolSummaryStack />
          </TabPanel>
          <TabPanel></TabPanel>
        </TabPanels>
      </Tabs>
    </MintUnmintBoxLayout>
  );
}
