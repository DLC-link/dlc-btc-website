import { Box, Stack, Text, VStack } from '@chakra-ui/react';

interface ExplanationBlockProps {
  title: string;
  content: React.ReactNode;
  image: React.ReactNode;
}

export function ExplanationBlock({
  title,
  content,
  image,
}: ExplanationBlockProps): React.JSX.Element {
  return (
    <VStack w={'316px'} alignItems={'left'}>
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} h={'120px'}>
        {image}
      </Box>
      <Stack h={'135px'}>
        <Text variant={'title'}>{title}</Text>
        {content}
      </Stack>
    </VStack>
  );
}
