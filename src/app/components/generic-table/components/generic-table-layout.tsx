import { VStack } from '@chakra-ui/react';

interface GenericTableLayoutProps {
  width?: string;
  height?: string;
  padding?: string;
  alignItems?: string;
  borderRadius?: string;
  bg?: string;
  children: React.ReactNode;
}

export function GenericTableLayout({
  width = '100%',
  height = '500px',
  padding = '15px',
  alignItems = 'flex-start',
  borderRadius = 'md',
  children,
  bg = 'background.container.01',
}: GenericTableLayoutProps): React.JSX.Element {
  return (
    <VStack
      w={width}
      h={height}
      minH={'100px'}
      padding={padding}
      alignItems={alignItems}
      borderRadius={borderRadius}
      bg={bg}
    >
      {children}
    </VStack>
  );
}
