import { Text, VStack } from '@chakra-ui/react';
import { FadeLayer } from '@components/fade-layer/fade-layer';
import { scrollBarCSS } from '../../../styles/css-styles'

interface VaultsListProps {
  title: string;
  height: string;
  children: React.ReactNode;
}

export function VaultsList({ title, height, children }: VaultsListProps): React.JSX.Element {
  return (
    <FadeLayer height={height} fadeHeight={'35px'}>
      <Text py={'15px'} color={'white'} fontWeight={'bold'}>
        {title}
      </Text>
      <VStack
        overflowY={'scroll'}
        overflowX={'hidden'}
        alignItems={'start'}
        pr={'15px'}
        pb={'15px'}
        w={'100%'}
        css={scrollBarCSS}
      >
        {children}
      </VStack>
    </FadeLayer>
  );
}
