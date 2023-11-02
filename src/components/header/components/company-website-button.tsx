import { Button, Image } from '@chakra-ui/react';

export function CompanyWebsiteButton(): React.JSX.Element {
  const companyWebsiteURL = 'https://www.dlc.link/';
  const logoPath = './images/logos/dlc-link-logo.svg';
  const altText = 'DLC.Link Logo';

  return (
    <Button
      as={'a'}
      href={companyWebsiteURL}
      variant={'ghost'}
      boxSize={['75px', '150px']}
      _hover={{
        background: 'accent',
      }}
    >
      <Image src={logoPath} alt={altText} boxSize={['50px', '100px']} />
    </Button>
  );
}
