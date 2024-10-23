import { useNavigate } from 'react-router-dom';

import { Button, Image, useBreakpointValue } from '@chakra-ui/react';

export function CompanyWebsiteButton(): React.JSX.Element {
  const navigate = useNavigate();

  const logoPath = './images/logos/dlc-btc-logo.svg';
  const altText = 'dlcBTC Logo';
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Button onClick={() => navigate('/')} variant={'company'} boxSize={isMobile ? '54px' : '65px'}>
      <Image src={logoPath} alt={altText} width={isMobile ? '54px' : '65px'} />
    </Button>
  );
}
