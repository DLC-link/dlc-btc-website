import { ReactNode } from 'react';

import { VStack } from '@chakra-ui/react';

interface CustomCardProps {
  width: string;
  height: string;
  padding: string;
  children: ReactNode;
}

export function CustomCard({
  children,
  width,
  height,
  padding,
}: CustomCardProps): React.JSX.Element {
  return (
    <VStack
      alignContent={'start'}
      alignItems={'start'}
      justifyContent={'space-between'}
      p={padding}
      w={width}
      h={height}
      bg={'background.container.01'}
      border={'1px solid'}
      borderRadius={'15px'}
      borderColor={'border.white.01'}
    >
      {children}
    </VStack>
  );
}
