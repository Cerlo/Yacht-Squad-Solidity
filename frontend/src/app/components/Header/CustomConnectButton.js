import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAuth } from '@/app/context/AuthContext';

const CustomConnectButton = () => {
  const { userType, isConnected } = useAuth(); // Utilisez le contexte pour obtenir le type d'utilisateur et le statut de connexion

  const formatAddress = (address) => address ? `${address.substring(0, 4)}…${address.substring(address.length - 4)}` : '';

  return (
    <div className="connect-button-wrapper">
      <ConnectButton.Custom>
        {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
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
              {mounted && account && chain ? `${formatAddress(account.address)}${isConnected && userType === 'owner' ? ' (owner)' : ''}` : 'Connect'}
            </button>
          </div>
        )}
      </ConnectButton.Custom>
    </div>
  );
};

export default CustomConnectButton;
