"use client"

import React, { useEffect, useState } from 'react'
import YachtsList from '../components/YachtsList/YachtsList'
import { yachtTokenizationABI, yachtTokenizationAddress } from '@/app/constants';
import { readContract } from '@wagmi/core';

const yachtStatus = () => {

  const [yachtsData, setYachtData] = useState([]);

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
        <YachtsList index={index} yacht={yacht} />

      ))}
    </div>
  )
}

export default yachtStatus