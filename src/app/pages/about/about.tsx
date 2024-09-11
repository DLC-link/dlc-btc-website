import { HowItWorks } from '@components/how-it-works/how-it-works';
import { PageLayout } from '@pages/components/page.layout';

// ts-unused-exports:disable-next-line
export function About(): React.JSX.Element {
  return (
    <PageLayout>
      <HowItWorks />
    </PageLayout>
  );
}
