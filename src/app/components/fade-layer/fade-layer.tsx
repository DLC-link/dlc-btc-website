import { VStack } from '@chakra-ui/react';

interface FadeLayerProps {
  children: React.ReactNode;
  h: string;
  fh: string;
}

export function FadeLayer({ children, h, fh }: FadeLayerProps): React.JSX.Element {
  const afterStyles = {
    height: fh,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    content: '""',
    backgroundImage: 'linear-gradient(to top, background.container.01, transparent)',
  };

  return (
    <VStack w={'100%'} h={h} position="relative" _after={afterStyles}>
      {children}
    </VStack>
  );
}
