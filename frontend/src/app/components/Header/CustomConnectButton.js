// src/app/components/CustomConnectButton.js

import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const CustomConnectButton = () => {
  return (
    <div className="connect-button-wrapper">
      <ConnectButton.Custom>
        {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
          return (
            <button
              onClick={() => {
                if (!mounted || !account || !chain) {
                  openConnectModal();
                } else {
                  openAccountModal();
                }
              }}
              className="px-4 py-2 bg-gold text-lessDark border border-gold hover:bg-dark hover:text-gold"
            >
              {mounted && account && chain ? 'Connected' : 'Connect'}
            </button>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
};

export default CustomConnectButton;
