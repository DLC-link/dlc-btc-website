import { useNavigate } from 'react-router-dom';

import { Button, Skeleton } from '@chakra-ui/react';
import { VaultsList } from '@components/vaults-list/vaults-list';
import { useNFTs } from '@hooks/use-nfts';

import { VaultsListGroupContainer } from '../vaults-list/components/vaults-list-group-container';
import { MyVaultsSmallLayout } from './components/my-vaults-small.layout';

export function MyVaultsSmall(): React.JSX.Element {
  const navigate = useNavigate();

  const { readyVaults, pendingVaults, fundedVaults, closingVaults, closedVaults, allVaults } =
    useNFTs();

  return (
    <MyVaultsSmallLayout>
      <VaultsList title={'My Vaults'} height={'825'} isScrollable={allVaults.length > 0}>
        <Skeleton isLoaded={true} w={'100%'}>
          <VaultsListGroupContainer label="Pending" vaults={pendingVaults} />
          <VaultsListGroupContainer label="Unlocking BTC in Progress" vaults={closingVaults} />
          <VaultsListGroupContainer label="Empty Vaults" vaults={readyVaults} />
          <VaultsListGroupContainer label="Minted dlcBTC" vaults={fundedVaults} />
          <VaultsListGroupContainer label="Closed Vaults" vaults={closedVaults} />
        </Skeleton>
      </VaultsList>
      <Button variant={'navigate'} onClick={() => navigate('/my-vaults')}>
        Show All
      </Button>
    </MyVaultsSmallLayout>
  );
}
