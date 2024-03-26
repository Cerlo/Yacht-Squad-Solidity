import React, { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContractRead, useAccount } from 'wagmi';
import { yachtTokenizationABI, yachtTokenizationAddress } from '@/app/constants'; // Assurez-vous que ces importations sont correctes

const CustomConnectButton = () => {
  
  const { address: connectedAddress, isConnected } = useAccount();
  const [isOwner, setIsOwner] = useState(false);

  // Lecture de l'adresse du propriétaire du contrat
  const { data: ownerAddress } = useContractRead({
    address: yachtTokenizationAddress,
    abi: yachtTokenizationABI,
    functionName: 'owner',
});

useEffect(() => {
  if (isConnected && connectedAddress && ownerAddress) {
    setIsOwner(connectedAddress.toLowerCase() === ownerAddress.toLowerCase());
  } else {
    setIsOwner(false);
  }
}, [connectedAddress, ownerAddress, isConnected]);

  const formatAddress = (connectedAddress) => connectedAddress ? `${connectedAddress.substring(0, 4)}…${connectedAddress.substring(connectedAddress.length - 4)}` : '';

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
            {mounted && account && chain ? `${formatAddress(account.address)}${isOwner ? ' (owner)' : ''}` : 'Connect'}
            </button>
          </div>
        )}
      </ConnectButton.Custom>
    </div>
  );
};

export default CustomConnectButton;
