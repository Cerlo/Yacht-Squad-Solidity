import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import { yachtTokenizationABI, yachtTokenizationAddress } from '@/app/constants';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  const { address: connectedAddress, isConnected } = useAccount();
  const [isOwner, setIsOwner] = useState(false);
  const [userType, setUserType] = useState('visitor'); // Default to 'visitor'

  const { data: ownerAddress } = useContractRead({
    address: yachtTokenizationAddress,
    abi: yachtTokenizationABI,
    functionName: 'owner',
  });

  useEffect(() => {
    if (isConnected && connectedAddress) {
      const type = connectedAddress.toLowerCase() === ownerAddress?.toLowerCase() ? 'owner' : 'investor';
      setUserType(type);
    } else {
      setUserType('visitor');
    }
  }, [connectedAddress, ownerAddress, isConnected]);

  return (
    <AuthContext.Provider value={{ userType, isConnected }}>
      {children}
    </AuthContext.Provider>
  );
};
