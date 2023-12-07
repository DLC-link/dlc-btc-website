import { Button, Image } from '@chakra-ui/react';

export function CompanyWebsiteButton(): React.JSX.Element {
  const companyWebsiteURL = 'https://www.dlc.link/';
  const logoPath = './images/logos/dlc-link-logo.svg';
  const altText = 'DLC.Link Logo';

  return (
    <Button as={'a'} href={companyWebsiteURL} variant={'company'} boxSize={'65px'}>
      <Image src={logoPath} alt={altText} boxSize={'65px'} />
    </Button>
  );
}
