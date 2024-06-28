import { CheckCircleIcon, CopyIcon } from '@chakra-ui/icons';
import { Button, Divider, HStack, Image, Text, Tooltip } from '@chakra-ui/react';
import { useCopyToClipboard } from '@hooks/use-copy-to-clipboard';
import { VaultState } from 'dlc-btc-lib/models';
import { truncateAddress } from 'dlc-btc-lib/utilities';

const getAssetLogo = (state: VaultState) => {
  return [VaultState.FUNDED, VaultState.CLOSING, VaultState.CLOSED].includes(state)
    ? '/images/logos/dlc-btc-logo.svg'
    : '/images/logos/bitcoin-logo.svg';
};

interface VaultMiniCardInformationProps {
  collateral: number;
  uuid: string;
  state: VaultState;
  timestamp: number;
}

export function VaultMiniCardInformation({
  state,
  uuid,
  collateral,
  timestamp,
}: VaultMiniCardInformationProps): React.JSX.Element {
  const date = new Date(timestamp * 1000).toLocaleDateString('en-US');
  const { hasCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <HStack w={'100%'} justifyContent={'space-between'}>
      <HStack spacing={'10px'}>
        <Image src={getAssetLogo(state)} alt={'Icon'} boxSize={'25px'} />
        <Text color={'white.01'} fontWeight={800} fontSize={'lg'}>
          {collateral}
        </Text>
      </HStack>
      <Divider orientation={'vertical'} h={'25px'} borderStyle={'dashed'} />
      <HStack w={'35%'}>
        <Tooltip
          label={hasCopied ? 'UUID Copied!' : 'Copy UUID'}
          placement={'left'}
          fontSize={'xs'}
          hasArrow
        >
          <Button
            minW={'0px'}
            h={'15px'}
            w={'15px'}
            onClick={() => copyToClipboard(uuid)}
            variant={'ghost'}
          >
            {hasCopied ? (
              <CheckCircleIcon color={'accent.lightBlue.01'} fontSize={'xs'} />
            ) : (
              <CopyIcon color={'accent.lightBlue.01'} fontSize={'xs'} />
            )}
          </Button>
        </Tooltip>
        <Text textAlign={'right'} color={'white'} fontSize={'xs'}>
          {truncateAddress(uuid)}
        </Text>
      </HStack>
      <Text color={'white.02'} fontSize={'xs'}>
        {date}
      </Text>
    </HStack>
  );
}
