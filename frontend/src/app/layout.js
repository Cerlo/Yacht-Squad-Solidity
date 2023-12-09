'use client'
import './globals.css'
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  sepolia
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
const { chains, publicClient } = configureChains(
  [sepolia],
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
      <body className='bg-dark'>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>
            <Header />
            {children}
            <Footer />
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  )
}
