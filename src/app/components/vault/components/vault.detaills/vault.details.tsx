import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Collapse, Divider, Stack, VStack } from '@chakra-ui/react';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { VaultState } from 'dlc-btc-lib/models';

import { VaultExpandedInformationButtonGroup } from './components/vault.details.button-group/vault.details.button-group';
import { VaultTransactionStack } from './components/vault.details.transaction-stack/vault.details.transaction-stack';

interface VaultDetailsProps {
  vaultUUID: string;
  vaultState: VaultState;
  vaultTotalLockedValue: number;
  vaultTotalMintedValue: number;
  isVaultExpanded: boolean;
  vaultFundingTX?: string;
  vaultWithdrawDepositTX?: string;
  variant?: 'select' | 'selected';
}

export function VaultDetails({
  vaultUUID,
  vaultState,
  vaultFundingTX,
  vaultWithdrawDepositTX,
  vaultTotalLockedValue,
  vaultTotalMintedValue,
  isVaultExpanded,
  variant,
}: VaultDetailsProps): React.JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleDepositClick() {
    navigate('/mint-withdraw');
    dispatch(mintUnmintActions.setMintStep([1, vaultUUID]));
    close();
  }

  function handleWithdrawClick() {
    navigate('/mint-withdraw');
    if (vaultTotalLockedValue === vaultTotalMintedValue) {
      dispatch(mintUnmintActions.setUnmintStep([0, vaultUUID]));
    } else {
      dispatch(mintUnmintActions.setUnmintStep([1, vaultUUID]));
    }
    close();
  }

  return (
    <Stack w={'100%'} spacing={'0px'}>
      <Collapse in={isVaultExpanded} unmountOnExit animateOpacity>
        <VStack w={'100%'}>
          <Divider w={'100%'} borderColor={'grey.01'} borderStyle={'dashed'} />
          <VStack w={'100%'} justifyContent={'space-between'}>
            <VaultTransactionStack
              vaultFundingTX={vaultFundingTX}
              vaultWithdrawDepositTX={vaultWithdrawDepositTX}
            />
            {(vaultState !== VaultState.PENDING || variant !== 'selected') && (
              <VaultExpandedInformationButtonGroup
                vaultState={vaultState}
                vaultTotalLockedValue={vaultTotalLockedValue}
                handleDepositClick={handleDepositClick}
                handleWithdrawClick={handleWithdrawClick}
              />
            )}
          </VStack>
        </VStack>
      </Collapse>
    </Stack>
  );
}
