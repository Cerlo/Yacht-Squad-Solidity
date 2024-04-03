'use client'
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { readContract } from '@wagmi/core';

import Card from '@/app/components/Card/Card';
import { yachtTokenizationABI, yachtTokenizationAddress } from '@/app/constants';


/**
 * @title Yacht Ownership Dashboard
 * @dev Displays a list of yachts owned by the connected wallet address. It fetches yacht data
 * from a smart contract and renders each yacht using the Card component. A skeleton loader
 * is shown while the data is being fetched.
 */
const dashboard = () => {
  const { address, isConnected } = useAccount();
  const [yachts, setYachts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);

   /**
   * @notice Fetches yacht data associated with the connected user's address.
   * @dev Calls the 'getInvestments' function of the yacht tokenization smart contract.
   * Handles loading state and potential errors.
   */
  const fetchYachts = async () => {
    setLoading(true);
    try {
      const yachtData = await readContract({
        address: yachtTokenizationAddress,
        abi: yachtTokenizationABI,
        functionName: 'getInvestments',
        args: [address],
      })
      console.log(yachtData)
      return yachtData
    } catch (err) {
      console.log(err.message)
      return []
    }
  };

  /**
   * @notice Effect hook to fetch yacht data on component mount and when user's address changes.
  */
  useEffect(() => {
    const getEvent = async () => {
      const yachtData = await fetchYachts()
      setYachts(yachtData)
      setIsLoading(false);
    }
    if (isConnected && address) {
      console.log(isConnected)
      getEvent()
    }
  }, [address, isConnected])

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
        yachts.map((item, index) => (
          <Card key={index} data={item} isBuyable={item.status <= 2 && isConnected} />
        ))
      )}
    </div>
  )
}

export default dashboard