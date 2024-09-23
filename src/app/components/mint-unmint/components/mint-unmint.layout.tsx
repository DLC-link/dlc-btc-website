import { VStack } from '@chakra-ui/react';
import { boxShadowAnimation } from '@styles/css-styles';

interface MintUnmintLayoutProps {
  children: React.ReactNode;
}

export function MintUnmintLayout({ children }: MintUnmintLayoutProps): React.JSX.Element {
  return (
    <VStack
      px={'15px'}
      w={'68.5%'}
      h={'625px'}
      bg={'background.container.01'}
      border={'1px solid'}
      borderRadius={'md'}
      borderColor={'border.lightBlue.01'}
      css={{
        animation: `${boxShadowAnimation} 0.5s 2 ease-in-out`,
      }}
    >
      {children}
    </VStack>
  );
}
