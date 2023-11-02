import { ConnectAccountButton } from '../connect-and-account-button/connect-button/connect-account-button';
import { CompanyWebsiteButton } from './components/company-website-button';
import { HeaderLayout } from './components/header.layout';

export function Header(): React.JSX.Element {
  return (
    <HeaderLayout>
      <CompanyWebsiteButton />
      <ConnectAccountButton handleClick={() => {}}/>
    </HeaderLayout>
  );
}
