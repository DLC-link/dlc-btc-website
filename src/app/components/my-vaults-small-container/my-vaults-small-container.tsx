import { useNavigate } from 'react-router-dom';

import { Button } from '@chakra-ui/react';
import { VaultsList } from '@components/vaults-list/vaults-list';
import { useVaults } from '@hooks/use-vaults';

import { VaultGroupContainer } from '../vaults-list/components/vault-group-container';
import { MyVaultsSmallContainerLayout } from './components/my-vaults-small-container.layout';

export function MyVaultsSmallContainer(): React.JSX.Element {
  const navigate = useNavigate();
  const { fundingVaults, closingVaults, fundedVaults, closedVaults } = useVaults();

  const vaultGroups = [
    {
      label: 'Locking BTC in Progress',
      vaults: fundingVaults,
      isProcessing: true,
    },
    {
      label: 'Unlocking BTC in Progress',
      vaults: closingVaults,
      isProcessing: true,
    },
    { label: 'Minted dlcBTC', vaults: fundedVaults, isProcessing: false },
    { label: 'Closed Vaults', vaults: closedVaults, isProcessing: false },
  ];

  return (
    <MyVaultsSmallContainerLayout>
      <VaultsList title={'My Vaults'} height={'525px'}>
        {vaultGroups.map((group, index) => (
          <VaultGroupContainer
            key={index}
            label={group.label}
            vaults={group.vaults}
            isProcessing={group.isProcessing}
          />
        ))}
      </VaultsList>
      <Button variant={'action'} onClick={() => navigate('/my-vaults')}>
        Show All
      </Button>
    </MyVaultsSmallContainerLayout>
  );
}
