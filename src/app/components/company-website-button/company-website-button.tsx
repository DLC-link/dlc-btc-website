import { useNavigate } from 'react-router-dom';

import { Button, Image } from '@chakra-ui/react';

export function CompanyWebsiteButton(): React.JSX.Element {
  const navigate = useNavigate();

  const logoPath = './images/logos/dlc-link-logo.svg';
  const altText = 'DLC.Link Logo';

  return (
    <Button onClick={() => navigate('/')} variant={'company'} boxSize={'65px'}>
      <Image src={logoPath} alt={altText} boxSize={'65px'} />
    </Button>
  );
}
