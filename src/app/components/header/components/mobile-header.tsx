import React from 'react';
import { useNavigate } from 'react-router-dom';

import { HamburgerIcon } from '@chakra-ui/icons';
import { HStack, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { Account } from '@components/account/account';
import { CompanyWebsiteButton } from '@components/company-website-button/company-website-button';
import { NetworkBox } from '@components/network/network';

import { HeaderLayout } from './header.layout';

interface MobileHeaderProps {
  isNetworkMenuOpen: boolean;
  setIsNetworkMenuOpen: (isOpen: boolean) => void;
  isActiveTabs: boolean;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  isNetworkMenuOpen,
  setIsNetworkMenuOpen,
  isActiveTabs,
}) => {
  const navigate = useNavigate();
  return (
    <HeaderLayout>
      <HStack justifyContent={'space-between'} w={'100%'} gap={'0px'}>
        <CompanyWebsiteButton />
        <HStack>
          <NetworkBox isMenuOpen={isNetworkMenuOpen} setIsMenuOpen={setIsNetworkMenuOpen} />
          <Account />
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              height={'40px'}
              width={'40px'}
            />
            <MenuList>
              <MenuItem onClick={() => navigate('/')}>Points</MenuItem>
              <MenuItem onClick={() => navigate('/proof-of-reserve')}>Proof of Reserve</MenuItem>
              {isActiveTabs && (
                <>
                  <MenuItem onClick={() => navigate('/mint-withdraw')}>
                    Mint/Withdraw dlcBTC
                  </MenuItem>
                  <MenuItem onClick={() => navigate('/my-vaults')}>My Vaults</MenuItem>
                </>
              )}
            </MenuList>
          </Menu>
        </HStack>
      </HStack>
    </HeaderLayout>
  );
};

export default MobileHeader;
