import { HStack, Text } from '@chakra-ui/react';

interface ActivityCardRowProps {
  name: string;
  value: string;
}

export function ActivityCardRow({ name, value }: ActivityCardRowProps): React.JSX.Element {
  return (
    <HStack w={'100%'} justifyContent={'space-between'}>
      <Text color={'white'}>{name}</Text>
      <Text color={'white'}>{value}</Text>
    </HStack>
  );
}
