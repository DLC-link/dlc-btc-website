import { useNavigate } from 'react-router-dom';

import { Button, Image } from '@chakra-ui/react';

export function CompanyWebsiteButton(): React.JSX.Element {
  const navigate = useNavigate();

  const logoPath = './images/logos/dlc-btc-logo.svg';
  const altText = 'dlcBTC Logo';

  return (
    <Button onClick={() => navigate('/')} variant={'company'} boxSize={'65px'}>
      <Image src={logoPath} alt={altText} boxSize={'65px'} />
    </Button>
  );
}
