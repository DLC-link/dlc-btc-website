import { MyVaultsBox } from '@components/my-vaults-large-container/my-vaults-large-container';
import { PageLayout } from '@pages/components/page.layout';

export function MyVaults(): React.JSX.Element {
  return (
    <PageLayout>
      <MyVaultsBox />
    </PageLayout>
  );
}
