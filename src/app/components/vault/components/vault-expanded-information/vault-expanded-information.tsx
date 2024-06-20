import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, Divider, SlideFade, Stack, VStack } from '@chakra-ui/react';
import { VaultState } from '@models/vault';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';

import { VaultExpandedInformationUUIDRow } from './components/vault-expanded-information-row';
import { VaultExpandedInformationTransactionRow } from './components/vault-expanded-information-transaction-row';

interface VaultExpandedInformationProps {
  uuid: string;
  state: VaultState;
  fundingTX: string;
  closingTX: string;
  isExpanded: boolean;
  isSelected?: boolean;
  close: () => void;
}

export function VaultExpandedInformation({
  uuid,
  state,
  fundingTX,
  closingTX,
  isExpanded,
  isSelected,
  close,
}: VaultExpandedInformationProps): React.JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <Stack w={'100%'}>
      <SlideFade in={isExpanded} unmountOnExit>
        <VStack>
          <Divider w={'100%'} borderStyle={'dashed'} />
          <VStack w={'100%'} spacing={'25px'}>
            <VStack w={'100%'} justifyContent={'space-between'}>
              <VaultExpandedInformationUUIDRow uuid={uuid} />
              {Boolean(fundingTX) && (
                <VaultExpandedInformationTransactionRow label={'Funding TX'} value={fundingTX} />
              )}
              {Boolean(closingTX) && (
                <VaultExpandedInformationTransactionRow label={'Closing TX'} value={closingTX} />
              )}
            </VStack>
            {state === VaultState.READY && !isSelected && (
              <Button
                onClick={() => {
                  navigate('/');
                  dispatch(mintUnmintActions.setMintStep([1, uuid]));
                  close();
                }}
                variant={'account'}
              >
                Deposit
              </Button>
            )}
            {state === VaultState.FUNDED && !isSelected && (
              <Button
                onClick={() => {
                  navigate('/');
                  dispatch(mintUnmintActions.setUnmintStep([0, uuid]));
                  close();
                }}
                variant={'account'}
              >
                Withdraw
              </Button>
            )}
          </VStack>
        </VStack>
      </SlideFade>
    </Stack>
  );
}
