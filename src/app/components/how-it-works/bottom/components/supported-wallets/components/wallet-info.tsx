import { Button, Image, Text, VStack } from '@chakra-ui/react';

interface WalletInfoProps {
  src: string;
  coinName: string;
  content: React.ReactNode;
}

export function WalletInfo({ src, coinName, content }: WalletInfoProps): React.JSX.Element {
  return (
    <VStack align={'left'} gap={'12px'} width={'206px'}>
      <Image src={src} alt={''} width={'92px'} height={'14px'} />
      <Button variant={'vault'}>Download</Button>
      <Text color={'rgba(154, 201, 255, 1)'} fontStyle={'bold'}>
        {coinName}
      </Text>
      {content}
    </VStack>
  );
}
