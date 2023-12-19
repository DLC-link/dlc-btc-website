import { extendTheme } from '@chakra-ui/react';

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
          bg: 'border.cyan.01',
        },
      },
    },
  },
  styles: {
    global: () => ({
      body: {
        bgGradient: 'linear(to-r, background.website.01, background.website.02)',
      },
    }),
  },
  colors: {
    'background.website.01': 'rgba(50,3,69,1)',
    'background.website.02': 'rgba(0,9,51,1)',
    'background.container.01': 'rgba(40,7,78,1)',
    'background.content.01': 'rgba(31,9,78,0.25)',
    'background.content.02': 'rgba(4,13,72,0.25)',
    'border.cyan.01': 'rgba(7,232,216,0.75)',
    'border.white.01': 'rgba(255,255,255,0.25)',
    'accent.cyan.01': 'rgba(7,232,216,1)',
    'accent.blue.01': 'rgba(0,40,187,1)',
    'accent.orange.01': 'rgba(247,147,26,1)',
    'white.01': 'rgba(255,255,255,1)',
    'white.02': 'rgba(255,255,255,0.75)',
    'white.03': 'rgba(255,255,255,0.35)',
    'light.blue.01': 'rgba(154, 201, 255, 1)',
  },
  fonts: {
    body: "'Poppins', poppins",
  },
});
