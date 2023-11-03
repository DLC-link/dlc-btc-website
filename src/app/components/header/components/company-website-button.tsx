import { Button, Image } from '@chakra-ui/react';

export function CompanyWebsiteButton(): React.JSX.Element {
  const companyWebsiteURL = 'https://www.dlc.link/';
  const logoPath = './images/logos/dlc-link-logo.svg';
  const altText = 'DLC.Link Logo';

  return (
    <Button
      as={'a'}
      href={companyWebsiteURL}
      variant={'company'}
      padding={'0'}
      boxSize={['75px', '100px']}
      >
      <Image src={logoPath} alt={altText} boxSize={['50px', '75px']} />
    </Button>
  );
}
