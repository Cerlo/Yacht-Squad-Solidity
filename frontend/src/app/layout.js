'use client'
import { ChakraProvider } from '@chakra-ui/react'
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit';
import { 
  configureChains, 
  createConfig, 
  WagmiConfig 
} from 'wagmi';
import {
  hardhat
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import theme from './theme/theme';

import Header from './components/Header/Header'
import Footer from './components/Footer/Footer';

const { chains, publicClient } = configureChains(
  [hardhat],
  [
    publicProvider()
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'YachtSquad',
  projectId: '190c1947c2c770f70c3656d11578831f',
  chains
});
const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains} theme={darkTheme({
            accentColor: theme.colors.gold,
            accentColorForeground: theme.colors.lessDark,
            borderRadius: 'none',
            fontStack: 'system',
            overlayBlur: 'small',
          })}>
          <ChakraProvider theme={theme}>
            <Header />
            {children}
            <Footer />
          </ChakraProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  )
}
