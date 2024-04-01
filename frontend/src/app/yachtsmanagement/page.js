"use client"

import React, { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/navigation';
import YachtsList from '../components/YachtsList/YachtsList'
import { readContract, prepareWriteContract, writeContract, waitForTransaction, watchContractEvent } from '@wagmi/core';
import { yachtTokenizationABI, yachtTokenizationAddress } from '@/app/constants';

import { useToast } from '@/app/context/ToastContext';
import { useAuth } from '@/app/context/AuthContext';


const yachtStatus = () => {
  const router = useRouter();
  const { userType, isConnected } = useAuth();
  const [yachtsData, setYachtsData] = useState([]);
  const [shouldWatchEvent, setisshouldWatchEvent] = useState(false);
  const [lastProcessedEvent, setLastProcessedEvent] = useState(null);
  const statusOptions = ["Initial Mint", "PreSale", "Public Sale", "Chartered", "Maintenance", "Sold"];
  const { showToast } = useToast();

  /**
   * @notice Retrieves yacht data from the blockchain and updates the local state.
   */
  const getYachts = async () => {
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
   * @notice Initiates a transaction to change the status of a yacht on the blockchain.
   * 
   * @param {number} yachtId - The ID of the yacht whose status is to be changed.
   * @param {number} statusId - The new status ID to be set for the yacht.
   */
  const changeStatus = async (yachtId, statusId) => {
    try {
      const { request } = await prepareWriteContract({
        address: yachtTokenizationAddress,
        abi: yachtTokenizationABI,
        functionName: 'statusManagement',
        args: [yachtId, statusId]
      });
      const { hash } = await writeContract(request);
      setisshouldWatchEvent(true)
      const refreshedYachtsData = await getYachts();
      setYachtsData(refreshedYachtsData);
    } catch (error) {
      console.error('Error updating yacht status:', error);
    }
  };

  /**
   * @notice Handler for saving yacht status changes. Checks if the status change is necessary and executes it.
   * @param {number} yachtId - The ID of the yacht to update.
   * @param {number} statusId - The new status to set for the yacht.
   */
  const handleSaveStatus = async (yachtId, statusId) => {
    if (yachtsData[yachtId].status !== statusId) {
      try {
        await changeStatus(yachtId, statusId);
      } catch (error) {
        console.error("Failed to update yacht status:", error);
        showToast('error', 'Error', 'Failed to update yacht status.');
      }
    } else {
      showToast('error', 'Revert', `${yachtsData[yachtId].name} status is already: ${statusOptions[statusId]}`);
    }
  };


  /**
   * @notice Sets up a watch for the 'StatusChange' event on the yacht tokenization contract.
   * @notice Displays a toast notification when a status change event is received.
   */
  useEffect(() => {
    if (shouldWatchEvent) {
      const unwatch = watchContractEvent({
        address: yachtTokenizationAddress,
        abi: yachtTokenizationABI,
        eventName: 'StatusChange',
      }, (event) => {
        const getEvent = event[0];

        if (getEvent && getEvent.args) {
          const { transactionHash, blockNumber, args: { _tokenId, _prevYachtStatus, _newYachtStatus } } = getEvent;
          const eventId = `${transactionHash}-${blockNumber}`;
          if (eventId !== lastProcessedEvent) {
            showToast('success', `Yacht ID: ${_tokenId.toString()}`, `Status has changed from: ${statusOptions[_prevYachtStatus]} to ${statusOptions[_newYachtStatus]}`);
            setLastProcessedEvent(eventId);
          }
        }
      });
      return () => unwatch();
    }
  }, [shouldWatchEvent, statusOptions, lastProcessedEvent, showToast]);


  /**
   * @notice Redirects non-owners or disconnected users to the home page.
   */ 
  useEffect(() => {
    // Redirect to '/' if the user is not the owner or not connected
    if (!isConnected || userType !== 'owner') {
      router.push('/');
    }
  }, [userType, isConnected, router]);

  /**
   * @notice Fetches yacht data on component mount or update.
   * */ 
  useEffect(() => {
    const getEvent = async () => {
      const yachtData = await getYachts()
      setYachtsData(yachtData)
    }
    getEvent()
  }, [])


  return (
    <div className="flex flex-col justify-center items-center my-4">
      {yachtsData.map((yacht, index) => (
        <YachtsList key={index} yachtIndex={yacht.id} yacht={yacht} onSave={handleSaveStatus} />
      ))}
    </div>
  )
}

export default yachtStatus