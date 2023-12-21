import { Box, Button, Image, Text, VStack } from '@chakra-ui/react';

interface WalletInfoProps {
  src: string;
  coinName: string;
  content: React.ReactNode;
}

export function WalletInfo({ src, coinName, content }: WalletInfoProps): React.JSX.Element {
  return (
    <VStack
      align={'left'}
      spacing={'12px'}
      w={'200px'}
      ml={src === '/images/metamask.png' ? '0px' : '15px'}
    >
      <Image
        src={src}
        alt={''}
        w={src === '/images/metamask.png' ? '92px' : '66px'}
        h={src === '/images/metamask.png' ? '12px' : '14px'}
      />
      <Box w={'92px'}>
        <Button variant={'vault'}>Download</Button>
      </Box>
      <Text color={'light.blue.01'} fontStyle={'bold'}>
        {coinName}
      </Text>
      <Box h={'140px'}>{content}</Box>
    </VStack>
  );
}
