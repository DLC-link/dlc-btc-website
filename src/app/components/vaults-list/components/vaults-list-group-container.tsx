import { Button, HStack, Image, Spinner, Text, VStack } from '@chakra-ui/react';
import { VaultCard } from '@components/vault/vault-card';
import { useEthereumAccount } from '@hooks/use-ethereum-account';
import { Vault } from '@models/vault';

interface VaultsListGroupContainerProps {
  label?: string;
  vaults: Vault[];
  selectedVaultUUID?: string;
  isSelectable?: boolean;
  handleSelect?: (uuid: string) => void;
}

export function VaultsListGroupContainer({
  label,
  vaults,
  selectedVaultUUID,
  isSelectable = false,
  handleSelect,
}: VaultsListGroupContainerProps): React.JSX.Element | boolean {
  const { recommendTokenToMetamask } = useEthereumAccount();

  if (vaults.length === 0) return false;

  return (
    <VStack pt={'15px'} alignItems={'start'} w={'100%'} spacing={'15px'}>
      {label && (
        <HStack pt={'15px'} justifyContent={'space-between'} w={'100%'}>
          <HStack>
            {['Locking BTC in Progress', 'Unlocking BTC in Progress'].includes(label) && (
              <Spinner color={'accent.lightBlue.01'} size={'md'} />
            )}
            <Text color={'white'}>{label}</Text>
          </HStack>
          {label === 'Minted dlcBTC' && (
            <Button
              variant={'ghost'}
              size={'xs'}
              _hover={{ backgroundColor: 'accent.lightBlue.01' }}
              onClick={async () => await recommendTokenToMetamask()}
            >
              <HStack>
                <Image src={'/images/logos/dlc-btc-logo.svg'} alt={'dlcBTC'} boxSize={'15px'} />
                <Text fontSize={'2xs'} color={'white.01'}>
                  {' '}
                  Add Token to Wallet
                </Text>
              </HStack>
            </Button>
          )}
        </HStack>
      )}
      {vaults.map((vault, index) => (
        <VaultCard
          key={index}
          vault={vault}
          isSelected={selectedVaultUUID === vault.uuid}
          isSelectable={isSelectable}
          handleSelect={() => handleSelect && handleSelect(vault.uuid)}
        />
      ))}
    </VStack>
  );
}
