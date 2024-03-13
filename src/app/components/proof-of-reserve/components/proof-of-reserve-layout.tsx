import { CustomCard } from '@components/how-it-works/components/custom-card';
import { HasChildren } from '@models/has-children';

export function ProofOfReserveLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <CustomCard width={'800px'} height={'150px'} padding={'30px'}>
      {children}
    </CustomCard>
  );
}
