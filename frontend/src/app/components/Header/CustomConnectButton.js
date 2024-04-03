import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAuth } from '@/app/context/AuthContext';

/**
 * @title Custom Connect Button Component
 * @notice This component renders a custom button for connecting a wallet using the @rainbow-me/rainbowkit library.
 * It displays the user's address and type (owner/investor/visitor) if connected, and provides a connect button if not.
 * @dev This component uses the `ConnectButton.Custom` component from @rainbow-me/rainbowkit to create a custom-styled connect button.
 * It uses the `useAuth` hook to access the current user type and connection status.
 * The button's behavior changes based on whether the user's wallet is connected and which chain they are on.
 * If the user is not connected or on the wrong chain, clicking the button opens the connect modal.
 * If the user is connected and on the correct chain, clicking the button opens the account modal.
 */
const CustomConnectButton = () => {
  const { userType, isConnected } = useAuth();
  /**
   * @notice Formats an Ethereum address to show the first 4 and last 4 characters.
   * @dev This function is used to shorten the display of user's connected wallet address.
   * @param {string} address - The Ethereum address to format.
   * @return {string} The formatted address string.
  */
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
              {mounted && account && chain ? `${formatAddress(account.address)} (${isConnected && userType === 'owner' ? 'owner' : userType})` : 'Connect'}
            </button>
          </div>
        )}
      </ConnectButton.Custom>
    </div>
  );
};

export default CustomConnectButton;
