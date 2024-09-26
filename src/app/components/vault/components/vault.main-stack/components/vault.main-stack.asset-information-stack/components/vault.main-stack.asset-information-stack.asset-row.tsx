import { HStack, Image, Text } from '@chakra-ui/react';

interface VaultAssetRowProps {
  assetLogo: string;
  assetValue: number;
  assetSymbol: string;
}

export function VaultAssetRow({
  assetLogo,
  assetValue,
  assetSymbol,
}: VaultAssetRowProps): React.JSX.Element {
  return (
    <HStack w={'100%'}>
      <HStack w={'50%'}>
        <Image src={assetLogo} alt={'Asset Logo'} boxSize={'30px'} />
        <Text fontSize={'sm'} fontWeight={'bold'} color={'white.01'}>
          {assetValue}
        </Text>
      </HStack>
      <HStack w={'50%'} justifyContent={'flex-end'}>
        <Text fontSize={'sm'} fontWeight={'bold'} color={'white.01'}>
          {assetSymbol}
        </Text>
      </HStack>
    </HStack>
  );
}
