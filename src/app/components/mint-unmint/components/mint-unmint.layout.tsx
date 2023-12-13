import { VStack, keyframes } from '@chakra-ui/react';

interface MintUnmintLayoutProps {
  children: React.ReactNode;
  animate?: boolean;
  step?: number;
}

export function MintUnmintLayout({ children, animate, step }: MintUnmintLayoutProps): React.JSX.Element {
  const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255,255,255,0); }
  25% { box-shadow: 0 0 10px rgba(255,255,255,0.5); }
  50% { box-shadow: 0 0 15px rgba(255,255,255,0.75); }
  75% { box-shadow: 0 0 10px rgba(255,255,255,0.5); }
  100% { box-shadow: 0 0 5px rgba(7,232,216,0); }
`;

const swimUp = keyframes`
  0% {
    transform: translateY(0px);
    opacity: 1;
  }
  5% {
    transform: translateY(0px);
    opacity: 0.5;
  }
  15% {
    transform: translateY(0px);
    opacity: 0;
  }
  25% {
    transform: translateY(175px);
    opacity: 0;
  }
  50% {
    transform: translateY(75px);
    opacity: 0.5;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

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
        animation: animate
        ? step === 0
          ? `${swimUp} 0.5s ease-out`
          : `${glow} 0.5s 2 ease-in-out`
        : 'none',
      }}
    >
      {children}
    </VStack>
  );
}
