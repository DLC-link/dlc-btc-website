import { Box, Image, Text, VStack } from '@chakra-ui/react';

interface ExplanationBlockProps {
  src: string;
  title: string;
  content: React.ReactNode;
}

export function ExplanationBlock({
  src,
  title,
  content,
}: ExplanationBlockProps): React.JSX.Element {
  return (
    <VStack w={'316px'} alignItems={'left'}>
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
        <Image
          src={src}
          w={src === '/images/dlc-img.png' ? '315px' : '200px'}
          h={src === '/images/dlc-img.png' ? '120px' : '100px'}
        />
      </Box>

      <Text variant={'title'}>{title}</Text>
      {content}
    </VStack>
  );
}
