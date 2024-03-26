import { CheckCircleIcon, CopyIcon } from '@chakra-ui/icons';
import { Button, HStack, Text, Tooltip } from '@chakra-ui/react';
import { easyTruncateAddress } from '@common/utilities';
import { useCopyToClipboard } from '@hooks/use-copy-to-clipboard';

interface VaultExpandedInformationUUIDRowProps {
  uuid: string;
}

export function VaultExpandedInformationUUIDRow({
  uuid,
}: VaultExpandedInformationUUIDRowProps): React.JSX.Element {
  const { hasCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <HStack pl={'35px'} w={'100%'} alignItems={'start'} spacing={'15px'}>
      <HStack w={'50%'} spacing={'0px'}>
        <Text w={'50%'} color={'white'} fontSize={'xs'}>
          UUID
        </Text>
        <Tooltip
          label={hasCopied ? 'UUID Copied!' : 'Copy UUID'}
          placement={'right'}
          fontSize={'xs'}
          hasArrow
        >
          <Button
            p={'0px'}
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
      </HStack>
      <Text textAlign={'right'} w={'50%'} color={'white'} fontSize={'xs'}>
        {easyTruncateAddress(uuid)}
      </Text>
    </HStack>
  );
}
