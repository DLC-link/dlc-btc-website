import React from 'react';
import { useSelector } from 'react-redux';

import { HStack } from '@chakra-ui/react';
import { MintUnmint } from '@components/mint-unmint/mint-unmint';
import { MyVaultsSmall } from '@components/my-vaults-small/my-vaults-small';
import { PageLayout } from '@pages/components/page.layout';
import { RootState } from '@store/index';
import { AddTokenButton } from '@components/add-token-button/add-token-button';

export function Dashboard(): React.JSX.Element {
  const { address } = useSelector((state: RootState) => state.account);

  return (
    <PageLayout>
      <HStack spacing={'20px'}>
        <MintUnmint address={address} />
        <MyVaultsSmall address={address} />
      </HStack>
      <AddTokenButton />
    </PageLayout>
  );
}
