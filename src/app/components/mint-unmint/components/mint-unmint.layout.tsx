import { VStack } from '@chakra-ui/react';
import { boxShadowAnimation } from '@styles/css-styles';

interface MintUnmintLayoutProps {
  children: React.ReactNode;
  animate?: boolean;
}

export function MintUnmintLayout({ children, animate }: MintUnmintLayoutProps): React.JSX.Element {
  return (
    <VStack
      px={'15px'}
      w={'650px'}
      h={'625px'}
      bg={'background.container.01'}
      border={'1px solid'}
      borderRadius={'md'}
      borderColor={'border.cyan.01'}
      css={{
        animation: animate ? `${boxShadowAnimation} 0.5s 2 ease-in-out` : 'none',
      }}
    >
      {children}
    </VStack>
  );
}
