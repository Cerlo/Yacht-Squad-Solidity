"use client"

import React, { useEffect, useState } from 'react'
import YachtsList from '../components/YachtsList/YachtsList'
import { readContract } from '@wagmi/core';
import { yachtTokenizationABI, yachtTokenizationAddress } from '@/app/constants';
import Toast from '@/app/components/Toast/Toast';

const yachtStatus = () => {

  const [yachtsData, setYachtData] = useState([]);
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

  const handleSaveStatus = (yachtId, statusId) => {
    setToastMessage(`Status is now : ${statusOptions[statusId]}`);
    setToastType('success');
    setToastTitle(`Yacht id ${yachtId} status :`);
    setShowToast(true);
    console.log('Showing Toast');
  };

  const handleToastClose = () => {
    setShowToast(false);
    setToastMessage('');
  };

  useEffect(() => {
    const getEvent = async () => {
      const yachtData = await getYachts()
      setYachtData(yachtData)
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