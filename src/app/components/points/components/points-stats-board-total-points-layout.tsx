import { VStack } from '@chakra-ui/react';

interface TokenStatsBoardTotalPointsLayoutProps {
  isMobile: boolean | undefined;
  children: React.ReactNode;
}

export function TokenStatsBoardTotalPointsLayout({
  isMobile,
  children,
}: TokenStatsBoardTotalPointsLayoutProps): React.JSX.Element {
  const px = isMobile ? '0px' : '25px';
  const spacing = isMobile ? '10px' : '20px';

  return (
    <VStack w={'100%'} px={px} alignItems={'flex-start'} spacing={spacing}>
      {children}
    </VStack>
  );
}
