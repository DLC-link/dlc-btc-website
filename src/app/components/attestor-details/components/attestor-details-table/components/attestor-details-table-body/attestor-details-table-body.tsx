import { VStack } from '@chakra-ui/react';
import { scrollBarCSS } from '@styles/css-styles';

import { exampleAttestorDetailsTableItems } from '@shared/examples/example-attestor-details-table-items';

import { AttestorDetailsTableItem } from '../attestor-details-table-item';

export function AttestorDetailsTableBody(): React.JSX.Element {
  return (
    <VStack
      w={'100%'}
      pb={'15px'}
      pr={'15px'}
      alignItems={'start'}
      overflowY={'scroll'}
      overflowX={'hidden'}
      css={scrollBarCSS}
    >
      {exampleAttestorDetailsTableItems.map(item => (
        <AttestorDetailsTableItem key={item.node} {...item} />
      ))}
    </VStack>
  );
}
