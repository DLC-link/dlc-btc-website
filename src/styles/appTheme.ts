import { extendTheme } from "@chakra-ui/react";

export const appTheme = extendTheme({
  components: {},
  styles: {
    global: () => ({
      body: {
        bgGradient: 'linear(to-r, background1, background2)',
      },
    }),
  },

  colors: {
    primary1: '#93009E',
    primary2: '#001FBA',
    secondary1: '#04BAB2',
    secondary2: '#2C039E',
    background1: '#500056',
    background2: '#000933',
    accent: '#07E8D8',
    warning: '#FF4500',
    header: '#9ac9ff',
  },

  fonts: {
    body: "'Poppins', poppins",
  },
});
