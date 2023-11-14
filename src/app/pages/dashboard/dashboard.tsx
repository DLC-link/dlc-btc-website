import React from 'react';
import { useSelector } from 'react-redux';

import { HStack, ScaleFade } from '@chakra-ui/react';
import { MintUnmintBox } from '@components/mint-unmint-box/mint-unmint-box';
import { MyVaultsSmallContainer } from '@components/my-vaults-small-container/my-vaults-small-container';
import { PageLayout } from '@pages/components/page.layout';
import { RootState } from '@store/index';

export function Dashboard(): React.JSX.Element {
  const { address } = useSelector((state: RootState) => state.account);
  return (
    <PageLayout>
      <HStack transition={'all 2.5s ease-in-out'} w={'auto'}>
        <MintUnmintBox />
        <ScaleFade in={address !== undefined} unmountOnExit>
          <MyVaultsSmallContainer />
        </ScaleFade>
      </HStack>
    </PageLayout>
  );
}
