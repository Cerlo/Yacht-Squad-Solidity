// src/app/theme.js

import { extendTheme } from '@chakra-ui/react';

const colors = {
  dark: '#1c1b19',
  lessDark: '#353530',
  gold: '#fcd462',
  white: '#fff',
};

const theme = extendTheme({
  colors,
  components: {
    Button: {
      // Custom styles for all buttons
      baseStyle: {
        _hover: {
          bg: 'gold',
          color: 'dark',
        },
      },
    },
    // Customizing the ConnectButton from RainbowKit
    ConnectButton: {
      baseStyle: {
        background: 'gold',
        color: 'white',
        border: `1px solid ${colors.gold}`,
        _hover: {
          bg: 'dark',
          color: 'gold',
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'dark',
        color: 'white',
      },
      a: {
        color: 'gold',
        _hover: {
          textDecoration: 'underline',
        },
      },
    },
  },
});

export default theme;
