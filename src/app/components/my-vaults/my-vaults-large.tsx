import { useContext } from 'react';
import { useSelector } from 'react-redux';

import { HStack } from '@chakra-ui/react';
import { VaultsListGroupBlankContainer } from '@components/vaults-list/components/vaults-list-group-blank-container';
import { VaultsListGroupContainer } from '@components/vaults-list/components/vaults-list-group-container';
import { VaultsList } from '@components/vaults-list/vaults-list';
import { BalanceContext } from '@providers/balance-context-provider';
import { VaultContext } from '@providers/vault-context-provider';
import { RootState } from '@store/index';

import { MyVaultsLargeHeader } from './components/my-vaults-header/my-vaults-header';
import { MyVaultsLargeLayout } from './components/my-vaults-large.layout';
import { MyVaultsSetupInformationStack } from './components/my-vaults-setup-information-stack';

export function MyVaultsLarge(): React.JSX.Element {
  const { address } = useSelector((state: RootState) => state.account);
  const { dlcBTCBalance, lockedBTCBalance } = useContext(BalanceContext);
  const vaultContext = useContext(VaultContext);
  const {
    allVaults,
    readyVaults,
    fundingVaults,
    fundedVaults,
    closingVaults,
    closedVaults,
    pendingVaults,
  } = vaultContext;

  return (
    <MyVaultsLargeLayout>
      <MyVaultsLargeHeader
        address={address}
        dlcBTCBalance={dlcBTCBalance}
        lockedBTCBalance={lockedBTCBalance}
      />
      <HStack spacing={'35px'} w={'100%'}>
        {address ? (
          <VaultsList
            title={'In Process'}
            height={'475px'}
            isScrollable={!!address && allVaults.length > 0}
          >
            <VaultsListGroupContainer label="Empty Vaults" vaults={readyVaults} />
            <VaultsListGroupContainer
              label="Pending"
              vaults={[...fundingVaults, ...pendingVaults]}
            />
            <VaultsListGroupContainer label="Unlocking BTC in Progress" vaults={closingVaults} />
          </VaultsList>
        ) : (
          <MyVaultsSetupInformationStack />
        )}
        <VaultsList
          title={'Minted dlcBTC'}
          height={'475px'}
          isScrollable={!!address && fundedVaults.length > 0}
        >
          {address ? (
            <VaultsListGroupContainer vaults={fundedVaults} />
          ) : (
            <VaultsListGroupBlankContainer />
          )}
        </VaultsList>
        <VaultsList
          title={'Closed Vaults'}
          height={'475px'}
          isScrollable={!!address && closedVaults.length > 0}
        >
          {address ? (
            <VaultsListGroupContainer vaults={closedVaults} />
          ) : (
            <VaultsListGroupBlankContainer />
          )}
        </VaultsList>
      </HStack>
    </MyVaultsLargeLayout>
  );
}
