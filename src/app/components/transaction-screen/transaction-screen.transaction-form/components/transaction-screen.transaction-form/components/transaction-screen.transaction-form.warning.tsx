import { HStack, Text } from '@chakra-ui/react';
import { ValidationError } from '@tanstack/react-form';

interface VaultTransactionFormWarningProps {
  formErrors: ValidationError[];
}

export function VaultTransactionFormWarning({
  formErrors,
}: VaultTransactionFormWarningProps): React.JSX.Element | false {
  if (!formErrors.length) return false;
  return (
    <HStack
      w={'100%'}
      p={'15px'}
      bgColor={'background.content.01'}
      borderRadius={'md'}
      border={'1px dashed'}
      borderColor={'rgba(229, 62, 62, 1)'}
      justifyContent={'center'}
    >
      <Text color={'white.01'} fontWeight={'bold'} fontSize={'xs'}>
        {formErrors.join(', ')}
      </Text>
    </HStack>
  );
}
