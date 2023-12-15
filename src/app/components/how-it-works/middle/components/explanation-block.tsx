import { Image, Text, VStack } from '@chakra-ui/react';

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
    <VStack width={'316px'} alignItems={'left'}>
      <Image src={src} width={'200px'} />
      <Text variant={'title'}>{title}</Text>
      {content}
    </VStack>
  );
}
