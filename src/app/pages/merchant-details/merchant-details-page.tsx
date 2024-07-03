import { MerchantDetails } from '@components/proof-of-reserve/components/merchant-details/merchant-details';
import { PageLayout } from '@pages/components/page.layout';

export function MerchantFocusPage(): React.JSX.Element {
  return (
    <PageLayout>
      <MerchantDetails />
    </PageLayout>
  );
}
