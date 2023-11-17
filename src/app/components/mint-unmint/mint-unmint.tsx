import {
  Divider,
  Spacer,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import { MintUnmintLayout } from "./components/mint-unmint.layout";
import { Mint } from "./components/mint/mint";
import { ProtocolSummaryStack } from "./components/protocol-summary-stack/protocol-summary-stack";
import { SetupInformationStack } from "./components/setup-information-stack/setup-information-stack";
import { Unmint } from "./components/unmint/unmint";

interface MintUnmintContainerProps {
  address?: string;
}

export function MintUnmint({
  address,
}: MintUnmintContainerProps): React.JSX.Element {
  return (
    <MintUnmintLayout>
      <Tabs variant="unstyled">
        <TabList>
          <Tab>Mint</Tab>
          <Tab>Unmint</Tab>
        </TabList>
        <TabIndicator mt="5px" h="3.5px" bg={"accent.cyan.01"} />
        <Spacer />
        <TabPanels>
          {address ? (
            <TabPanel>
              <Mint />
            </TabPanel>
          ) : (
            <TabPanel>
              <SetupInformationStack />
              <Divider
                orientation={"horizontal"}
                h={"35px"}
                variant={"thick"}
              />
              <ProtocolSummaryStack />
            </TabPanel>
          )}
          <TabPanel>
            <Unmint />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </MintUnmintLayout>
  );
}
