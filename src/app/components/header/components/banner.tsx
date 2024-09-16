import { Button, HStack, Text } from '@chakra-ui/react';

interface BannerProps {
  handleButtonClick: () => void;
}
export function Banner({ handleButtonClick }: BannerProps): React.JSX.Element {
  return (
    <HStack
      w={'100%'}
      justifyContent={'center'}
      bg={'error.01'}
      p={4}
      border={'1px solid'}
      borderRadius={'md'}
      mb={4}
    >
      <Text fontSize={'lg'} fontWeight={600} color={'white'}>
        Please switch to a supported network to continue.
      </Text>
      <Button onClick={handleButtonClick} size="sm">
        Switch Network
      </Button>
    </HStack>
  );
}
