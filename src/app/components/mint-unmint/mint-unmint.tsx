import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Spacer, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';

import { MintUnmintLayout } from './components/mint-unmint.layout';
import { Mint } from './components/mint/mint';
import { Unmint } from './components/unmint/unmint';

interface MintUnmintContainerProps {
  address?: string;
}

export function MintUnmint({ address }: MintUnmintContainerProps): React.JSX.Element {
  const dispatch = useDispatch();
  const [animate, setAnimate] = useState(false);

  const { activeTab, mintStep, unmintStep } = useSelector((state: RootState) => state.mintunmint);

  useEffect(() => {
    if (!address) return;
    setAnimate(true);
    setTimeout(() => {
      setAnimate(false);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mintStep, unmintStep]);

  function handleTabsChange(index: number) {
    dispatch(mintUnmintActions.setActiveTab(index));
  }

  return (
    <MintUnmintLayout animate={animate}>
      <Tabs variant="unstyled" index={activeTab} onChange={handleTabsChange}>
        <TabList>
          <Tab>Mint</Tab>
          <Tab isDisabled={!address}>Redeem</Tab>
        </TabList>
        <TabIndicator mt="5px" h="3.5px" bg={'accent.lightBlue.01'} />
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
