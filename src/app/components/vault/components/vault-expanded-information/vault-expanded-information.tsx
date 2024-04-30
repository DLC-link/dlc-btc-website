import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, Divider, SlideFade, Stack, VStack } from '@chakra-ui/react';
import { useBitcoin } from '@hooks/use-bitcoin';
import { Vault, VaultState } from '@models/vault';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';

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
  const { signAndSendReplacementClosingTransaction } = useBitcoin();

  return (
    <Stack w={'100%'}>
      <SlideFade in={isExpanded} unmountOnExit>
        <VStack>
          <Divider w={'100%'} borderStyle={'dashed'} />
          <VStack w={'100%'} spacing={'25px'}>
            <VStack w={'100%'} justifyContent={'space-between'}>
              <VaultExpandedInformationUUIDRow uuid={vault.uuid} />
              {Boolean(vault.fundingTX) && (
                <VaultExpandedInformationTransactionRow
                  label={'Funding TX'}
                  value={vault.fundingTX}
                />
              )}
              {Boolean(vault.closingTX) && (
                <VaultExpandedInformationTransactionRow
                  label={'Closing TX'}
                  value={vault.closingTX}
                />
              )}
            </VStack>
            {vault.state === VaultState.READY && !isSelected && (
              <Button
                onClick={() => {
                  navigate('/');
                  dispatch(mintUnmintActions.setMintStep([1, vault.uuid]));
                  close();
                }}
                variant={'account'}
              >
                Lock BTC
              </Button>
            )}
            {vault.state === VaultState.FUNDED && !isSelected && (
              <Button
                onClick={() => {
                  navigate('/');
                  dispatch(mintUnmintActions.setUnmintStep([0, vault.uuid]));
                  close();
                }}
                variant={'account'}
              >
                Redeem dlcBTC
              </Button>
            )}
            {vault.state === VaultState.CLOSING ||
              (vault.state === VaultState.FUNDED && (
                <Button
                  onClick={() => signAndSendReplacementClosingTransaction(vault)}
                  variant={'account'}
                >
                  Update Closing Transaction
                </Button>
              ))}
          </VStack>
        </VStack>
      </SlideFade>
    </Stack>
  );
}
