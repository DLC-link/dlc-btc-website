import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Divider,
  Spacer,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';

import { MintUnmintLayout } from './components/mint-unmint.layout';
import { Mint } from './components/mint/mint';
import { ProtocolSummaryStack } from './components/protocol-summary-stack/protocol-summary-stack';
import { SetupInformationStack } from './components/setup-information-stack/setup-information-stack';
import { Unmint } from './components/unmint/unmint';

interface MintUnmintContainerProps {
  address?: string;
}

export function MintUnmint({ address }: MintUnmintContainerProps): React.JSX.Element {
  const dispatch = useDispatch();
  const [animate, setAnimate] = useState(false);

  const { activeTab, mintStep, unmintStep } = useSelector((state: RootState) => state.mintunmint);

  useEffect(() => {
    setAnimate(true);
    setTimeout(() => {
      setAnimate(false);
    }, 1000);
  }, [mintStep, unmintStep]);

  function handleTabsChange(index: number) {
    dispatch(mintUnmintActions.setActiveTab(index));
  }

  return (
    <MintUnmintLayout animate={animate} step={activeTab === 0 ? mintStep[0] : unmintStep[0]}>
      <Tabs variant="unstyled" index={activeTab} onChange={handleTabsChange}>
        <TabList>
          <Tab>Mint</Tab>
          <Tab isDisabled={!address}>Unmint</Tab>
        </TabList>
        <TabIndicator mt="5px" h="3.5px" bg={'accent.cyan.01'} />
        <Spacer />
        <TabPanels>
          <TabPanel>
            {address ? (
              <Mint />
            ) : (
              <>
                <SetupInformationStack />
                <Divider orientation={'horizontal'} h={'35px'} variant={'thick'} />
                <ProtocolSummaryStack />
              </>
            )}
          </TabPanel>
          <TabPanel>
            <Unmint />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </MintUnmintLayout>
  );
}
