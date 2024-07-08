import React from 'react';

import { Text } from '@chakra-ui/react';

interface GenericTableHeaderTextProps {
  w?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  children: React.ReactNode;
  pl?: string;
}

export function GenericTableHeaderText({
  w = '20%',
  color = 'white',
  fontSize = 'small',
  children,
  fontWeight = '600',
  pl = '10px',
}: GenericTableHeaderTextProps): React.JSX.Element {
  return (
    <Text w={w} color={color} fontSize={fontSize} fontWeight={fontWeight} pl={pl}>
      {children}
    </Text>
  );
}
