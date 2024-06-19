import React from 'react';

import { Text } from '@chakra-ui/react';

interface AttestorDetailsTableHeaderTextProps {
  children: React.ReactNode;
  width?: string;
}

export function AttestorDetailsTableHeaderText({
  children,
  width = '25%',
}: AttestorDetailsTableHeaderTextProps): React.JSX.Element {
  return (
    <Text w={width} color={'white'} fontSize={'sm'} fontWeight={'600'}>
      {children}
    </Text>
  );
}
