import { MyVaultsLarge } from '@components/my-vaults/my-vaults-large';
import { PageLayout } from '@pages/components/page.layout';

export function MyVaults(): React.JSX.Element {
  return (
    <PageLayout>
      <MyVaultsLarge />
    </PageLayout>
  );
}
