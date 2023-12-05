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
  appName: 'Project3',
  projectId: '1c6d2e9f223b865b6c54d9698b39e825',
  chains
});
const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient
})

export default function RootLayout({ children, pageProps }) {
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
