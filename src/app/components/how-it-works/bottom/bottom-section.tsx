import { HStack, VStack } from '@chakra-ui/react';

import { AuditReports } from './components/audit-reports';
import { HowToMint } from './components/how-to-mint';
import { HowToUnmint } from './components/how-to-unmint';
import { SupportedWallets } from './components/supported-wallets/supported-wallets';

export function BottomSection(): React.JSX.Element {
  return (
    <HStack spacing={'25px'} alignItems={'start'}>
      <HowToMint />
      <VStack spacing={'25px'}>
        <HowToUnmint />
        <SupportedWallets />
        <AuditReports />
      </VStack>
    </HStack>
  );
}
