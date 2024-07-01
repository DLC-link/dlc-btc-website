/* eslint-disable */
import { HStack } from '@chakra-ui/react';
import { CustomSkeleton } from '@components/custom-skeleton/custom-skeleton';

interface GenericTableItemProps {
  children: React.ReactNode;
}

export function GenericTableItem(genericTableItem: GenericTableItemProps): React.JSX.Element {
  if (!genericTableItem) return <CustomSkeleton height={'35px'} />;

  const { children } = genericTableItem;

  return (
    <HStack
      p={'10px'}
      w={'100%'}
      h={'35px'}
      bg={'background.content.01'}
      blendMode={'screen'}
      border={'1px solid'}
      borderRadius={'md'}
      borderColor={'border.white.01'}
    >
      {children}
    </HStack>
  );
}
