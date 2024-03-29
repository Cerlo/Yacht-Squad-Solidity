"use client"

import React, { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/navigation';
import YachtsList from '../components/YachtsList/YachtsList'
import { readContract, prepareWriteContract, writeContract } from '@wagmi/core';
import { yachtTokenizationABI, yachtTokenizationAddress } from '@/app/constants';
import Toast from '@/app/components/Toast/Toast';
import { useAuth } from '@/app/context/AuthContext';

const yachtStatus = () => {
  const router = useRouter(); // Use Next.js useRouter hook for redirection
  const { userType, isConnected } = useAuth();
  const [yachtsData, setYachtsData] = useState([]);
  const statusOptions = ["Initial Mint", "PreSale", "Public Sale", "Chartered", "Maintenance", "Sold"];
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('');
  const [toastTitle, setToastTitle] = useState('');

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

  const handleSaveStatus = async (yachtId, statusId) => {
    if (yachtsData[yachtId].status !== statusId) {
      try {
        await changeStatus(yachtId, statusId);
        setToastType('success');
        setToastTitle(`${yachtsData[yachtId].name}`);
        setToastMessage(`Status has changed to: ${statusOptions[statusId]}`);
      } catch (error) {
        console.error("Failed to update yacht status:", error);
        setToastType('error');
        setToastTitle('Error');
        setToastMessage('Failed to update yacht status.');
      }
    } else {
      setToastType('error');
      setToastTitle(`Revert`);
      setToastMessage(`${yachtsData[yachtId].name} status is already: ${statusOptions[statusId]}`);
    }
    setShowToast(true);
  };


  const changeStatus = async (yachtId, statusId) => {
    try {
      const { request } = await prepareWriteContract({
        address: yachtTokenizationAddress,
        abi: yachtTokenizationABI,
        functionName: 'statusManagement',
        args: [yachtId, statusId]
      });
      const { hash } = await writeContract(request);
      const refreshedYachtsData = await getYachts();
      setYachtsData(refreshedYachtsData);
    } catch (error) {
      console.error('Error updating yacht status:', error);
    }

  };

  const handleToastClose = () => {
    setShowToast(false);
    setToastMessage('');
  };


  useEffect(() => {
    // Redirect to '/' if the user is not the owner or not connected
    if (!isConnected || userType !== 'owner') {
      router.push({
        pathname: '/',
        query: { unauthorized: true },
      });
    }
  }, [userType, isConnected, router]);

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

      {showToast && (
        <Toast type={toastType} title={toastTitle} message={toastMessage} onClose={handleToastClose} />
      )}
    </div>
  )
}

export default yachtStatus