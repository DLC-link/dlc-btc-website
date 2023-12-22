import { VStack } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

export function HowItWorksLayout({ children }: HasChildren): React.JSX.Element {
  return <VStack>{children}</VStack>;
}
