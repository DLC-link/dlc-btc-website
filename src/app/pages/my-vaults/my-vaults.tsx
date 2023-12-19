import { AddTokenButton } from '@components/add-token-button/add-token-button';
import { MyVaultsLarge } from '@components/my-vaults/my-vaults-large';
import { PageLayout } from '@pages/components/page.layout';

export function MyVaults(): React.JSX.Element {
  return (
    <PageLayout>
      <MyVaultsLarge />
      <AddTokenButton />
    </PageLayout>
  );
}
