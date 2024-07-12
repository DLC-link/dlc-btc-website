import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, Divider, SlideFade, Stack, VStack } from '@chakra-ui/react';
import { Vault } from '@models/vault';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { VaultState } from 'dlc-btc-lib/models';

import { VaultExpandedInformationUUIDRow } from './components/vault-expanded-information-row';
import { VaultExpandedInformationTransactionRow } from './components/vault-expanded-information-transaction-row';

interface VaultExpandedInformationProps {
  vault: Vault;
  isExpanded: boolean;
  isSelected?: boolean;
  close: () => void;
}

export function VaultExpandedInformation({
  vault,
  isExpanded,
  isSelected,
  close,
}: VaultExpandedInformationProps): React.JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { fundingTX, withdrawDepositTX, state, uuid } = vault;

  function handleWithdraw() {
    navigate('/mint-withdraw');
    if (vault.valueLocked === vault.valueMinted) {
      dispatch(mintUnmintActions.setUnmintStep([0, uuid]));
    } else {
      dispatch(mintUnmintActions.setUnmintStep([1, uuid]));
    }
    close();
  }

  return (
    <Stack w={'100%'}>
      <SlideFade in={isExpanded} unmountOnExit>
        <VStack>
          <Divider w={'100%'} borderStyle={'dashed'} />
          <VStack w={'100%'} spacing={'25px'}>
            <VStack w={'100%'} justifyContent={'space-between'}>
              <VaultExpandedInformationUUIDRow uuid={uuid} />
              {!!fundingTX && (
                <VaultExpandedInformationTransactionRow label={'Funding TX'} value={fundingTX} />
              )}
              {!!withdrawDepositTX && (
                <VaultExpandedInformationTransactionRow
                  label={'Withdraw/Deposit TX'}
                  value={withdrawDepositTX}
                />
              )}
            </VStack>
            {[VaultState.READY, VaultState.FUNDED].includes(state) && !isSelected && (
              <Button
                onClick={() => {
                  navigate('/mint-withdraw');
                  dispatch(mintUnmintActions.setMintStep([1, uuid]));
                  close();
                }}
                variant={'account'}
              >
                Deposit
              </Button>
            )}
            {state === VaultState.FUNDED && !isSelected && (
              <Button onClick={() => handleWithdraw()} variant={'account'}>
                Withdraw
              </Button>
            )}
          </VStack>
        </VStack>
      </SlideFade>
    </Stack>
  );
}
