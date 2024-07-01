import { VStack } from '@chakra-ui/react';

interface GenericTableBodyProps {
  renderItems: () => React.JSX.Element;
}

export function GenericTableBody({ renderItems }: GenericTableBodyProps): React.JSX.Element {
  return <VStack w={'100%'}>{renderItems()}</VStack>;
}
