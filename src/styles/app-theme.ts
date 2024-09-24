import { extendTheme } from '@chakra-ui/react';
// Supports weights 100-900
import '@fontsource-variable/onest';

import bgImage from '../../src/assets/images/dotted_hero.png';
import { buttonTheme } from './button-theme';
import { dividerTheme } from './divider-theme';
import { menuTheme } from './menu-theme';
import { modalTheme } from './modal-theme';
import { selectTheme } from './select-theme';
import { tabsTheme } from './tabs-theme';
import { textTheme } from './text-theme';

export const appTheme = extendTheme({
  components: {
    Menu: menuTheme,
    Button: buttonTheme,
    Modal: modalTheme,
    Select: selectTheme,
    Text: textTheme,
    Tabs: tabsTheme,
    Divider: dividerTheme,
    Progress: {
      baseStyle: {
        track: {
          bg: 'white.03',
        },
        filledTrack: {
          bg: 'border.lightBlue.01',
        },
      },
    },
  },
  styles: {
    global: () => ({
      body: {
        bg: 'background.website.01',
        bgImage: `url(${bgImage})`,
        width: '100%',
        bgPosition: 'center 130px',
        bgRepeat: 'no-repeat',
      },
    }),
  },
  colors: {
    'background.website.01': 'rgba(0, 0, 0, 1)',
    'background.container.01': 'rgba(18, 18, 18, 1)',
    'background.content.01': 'rgba(51, 51, 51, 1)',
    'border.lightBlue.01': 'rgba(50, 201, 247,0.75)',
    'border.white.01': 'rgba(255,255,255,0.25)',
    'accent.lightBlue.01': 'rgba(50, 201, 247, 1)',
    'white.01': 'rgba(255,255,255,1)',
    'white.02': 'rgba(255,255,255,0.75)',
    'white.03': 'rgba(255,255,255,0.35)',
    'warning.01': 'rgba(255,204,85, 1)',
    'error.01': 'rgba(255,51,102, 1)',
    'table.background.green': 'rgba(50, 201, 247, 0.1)',
    'table.background.red': 'rgba(172, 80, 239, 0.2)',
    'green.mint': 'rgba(50, 201, 247, 1)',
    'red.redeem': 'rgba(233, 97, 255, 1)',
  },
  fonts: {
    body: "'Onest', onest, sans-serif",
  },
  breakpoints: {
    base: '0em',
    sm: '30em',
    md: '48em',
    lg: '62em',
    xl: '80em',
    '2xl': '96em',
  },
});
