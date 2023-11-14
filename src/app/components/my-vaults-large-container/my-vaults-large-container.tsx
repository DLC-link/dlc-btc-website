import { useSelector } from 'react-redux';

import { HStack } from '@chakra-ui/react';
import { VaultGroupContainer } from '@components/vaults-list/components/vault-group-container';
import { VaultsList } from '@components/vaults-list/vaults-list';
import { useVaults } from '@hooks/use-vaults';
import { RootState } from '@store/index';

import { DisconnectedInfoStack } from './components/disconnected-info-stack';
import { MyVaultsLargeContainerHeader } from './components/my-vaults-large-container-header/my-vaults-large-container-header';
import { MyVaultsLargeContainerLayout } from './components/my-vaults-large-container.layout';

export function MyVaultsBox(): React.JSX.Element {
  const { address, dlcBTCBalance, lockedBTCBalance } = useSelector(
    (state: RootState) => state.account
  );
  const { readyVaults, fundingVaults, fundedVaults, closingVaults, closedVaults } = useVaults();

  const bitcoinVaultsLabels = ['Lock BTC', 'Locking BTC in Progress', 'Unlocking BTC in Progress'];

  return (
    <MyVaultsLargeContainerLayout>
      <MyVaultsLargeContainerHeader
        dlcBTCBalance={dlcBTCBalance}
        lockedBTCBalance={lockedBTCBalance}
      />
      <HStack spacing={'35px'} w={'100%'}>
        {address ? (
          <VaultsList title={'In Process'} height={'475px'}>
            {[readyVaults, fundingVaults, closingVaults].map((vaults, index) => (
              <VaultGroupContainer
                key={index}
                label={bitcoinVaultsLabels[index]}
                vaults={vaults}
                isProcessing={index >= 1}
              />
            ))}
          </VaultsList>
        ) : (
          <DisconnectedInfoStack />
        )}
        <VaultsList title={'Minted dlcBTC'} height={'475px'}>
          <VaultGroupContainer vaults={fundedVaults} preventLoad={!address} />
        </VaultsList>
        <VaultsList title={'Closed Vaults'} height={'475px'}>
          <VaultGroupContainer vaults={closedVaults} preventLoad={!address} />
        </VaultsList>
      </HStack>
    </MyVaultsLargeContainerLayout>
  );
}
