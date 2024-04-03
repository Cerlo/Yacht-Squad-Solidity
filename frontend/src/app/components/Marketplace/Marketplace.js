"use client"
import React, { useEffect, useState } from 'react';
import Card from '../Card/Card';
import { yachtTokenizationABI, yachtTokenizationAddress } from '@/app/constants';
import { readContract } from '@wagmi/core';
import { useAuth } from '@/app/context/AuthContext';

/**
 * @title Marketplace Component
 * @notice This component displays a list of yachts available for purchase and manages the loading state.
 * It fetches yacht data from the blockchain and presents each yacht using the `Card` component.
 * @dev This component uses `readContract` from `@wagmi/core` to interact with the yachtTokenization smart contract.
 */
const Marketplace = () => {
    // State for storing yacht data and loading state
  const [yachtsData, setYachtData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isConnected } = useAuth();

  /**
   * @notice Fetches yacht data from the yachtTokenization smart contract.
   * @dev Calls the `getYachts` function of the yachtTokenization contract to retrieve all yachts.
   * Updates the state with the fetched data or logs an error if the operation fails.
   */
  const getYachts= async()=>{
    try {
      const data = await readContract({
        address: yachtTokenizationAddress,
        abi: yachtTokenizationABI,
        functionName: "getYachts"
      })
      return data
    } catch (err) {
      console.log(err.message)
      return []
    }
  }

  /**
   * @notice Effect hook to fetch yacht data on component mount.
   * @dev Calls `getYachts` function and updates the yacht data state.
   * Sets the loading state to false once the data is fetched.
   */
  useEffect(()=>{
    const getEvent = async() =>{
      const yachtData = await getYachts()
        setYachtData(yachtData);
        setIsLoading(false);
    }
    getEvent()
  }, [])

  /**
   * @notice Renders a loading skeleton while yacht data is being fetched.
   * @dev The skeleton mimics the layout of yacht cards to provide a consistent user experience during data loading.
   * @return A JSX structure representing the loading state.
   */
  const SkeletonLoader = () => (
    <div className="flex justify-center items-center my-4">
      <div className="card card-bordered bg-lessDark w-full md:w-1/2 max-w-600px flex flex-col lg:flex-row rounded-none h-auto lg:h-96">
        
        <div className="skeleton w-full rounded-none bg-dark lg:flex-1 h-48 lg:h-full "></div>
  
        <div className="flex-1 p-4 space-y-4">
          <div className="skeleton rounded-none bg-dark h-6 w-3/4 text-gold"> Data is loading ...</div>
          
          <div className="space-y-2">
            <div className="skeleton rounded-none bg-dark h-4 w-full"></div>
            <div className="skeleton rounded-none bg-dark h-4 w-5/6"></div>
            <div className="skeleton rounded-none bg-dark h-4 w-2/3"></div>
          </div>
  
          <div className="flex justify-between items-center mt-4">
            <div className="skeleton rounded-none bg-dark h-6 w-1/4"></div>
            <div className="skeleton rounded-none bg-dark h-10 w-1/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
  

  return (
    <div className="space-y-4 bg-dark">
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        yachtsData.map((item, index) => (
          <Card key={index} data={item} isBuyable={item.status <= 2 && isConnected} />
        ))
      )}
    </div>
  );
};

export default Marketplace;