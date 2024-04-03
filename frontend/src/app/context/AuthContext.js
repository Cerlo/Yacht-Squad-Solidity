import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import { yachtTokenizationABI, yachtTokenizationAddress } from '@/app/constants';

const AuthContext = createContext();
/**
 * @notice Provides the current authentication context to consuming components.
 * @return Returns an object containing user type, connection status, and connected address.
*/
export const useAuth = () => useContext(AuthContext);

/**
 * @notice Initializes the AuthProvider component, setting up user authentication context.
 * @param children The child components that will consume the authentication context.
*/
export const AuthProvider = ({ children }) => {

  /**
   * @dev Uses the wagmi `useAccount` hook to fetch the connected wallet address and connection status.
  */
  const { address: connectedAddress, isConnected } = useAccount();
  const [isOwner, setIsOwner] = useState(false);
  const [userType, setUserType] = useState('visitor'); // Default to 'visitor'

  /**
   * @dev Uses the wagmi `useContractRead` hook to read the owner address from the yacht tokenization contract.
  */
  const { data: ownerAddress } = useContractRead({
    address: yachtTokenizationAddress,
    abi: yachtTokenizationABI,
    functionName: 'owner',
  });

  /**
   * @notice Updates the user type based on the connected address and the owner address of the contract.
   * Sets the user type to 'owner' if the connected address matches the owner address, otherwise to 'investor'.
   * If there's no connected address, sets the user type to 'visitor'.
  */
  useEffect(() => {
    if (isConnected && connectedAddress) {
      const type = connectedAddress.toLowerCase() === ownerAddress?.toLowerCase() ? 'owner' : 'investor';
      setUserType(type);
    } else {
      setUserType('visitor');
    }
  }, [connectedAddress, ownerAddress, isConnected]);

  return (
    <AuthContext.Provider value={{ userType, isConnected, connectedAddress }}>
      {children}
    </AuthContext.Provider>
  );
};
