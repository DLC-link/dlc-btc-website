import { useDispatch, useSelector } from 'react-redux';

import { Spacer, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';

import { MintUnmintLayout } from './components/mint-unmint.layout';
import { Mint } from './components/mint/mint';
import { Unmint } from './components/unmint/unmint';

export function MintUnmint(): React.JSX.Element {
  const dispatch = useDispatch();

  const { activeTab } = useSelector((state: RootState) => state.mintunmint);

  function handleTabsChange(index: number) {
    dispatch(mintUnmintActions.setActiveTab(index));
  }

  return (
    <MintUnmintLayout>
      <Tabs variant="unstyled" index={activeTab} onChange={handleTabsChange}>
        <TabList>
          <Tab>Mint</Tab>
          <Tab>Withdraw</Tab>
        </TabList>
        <TabIndicator mt="5px" h="3.5px" bg={'pink.01'} />
        <Spacer />
        <TabPanels>
          <TabPanel>
            <Mint />
          </TabPanel>
          <TabPanel>
            <Unmint />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </MintUnmintLayout>
  );
}
