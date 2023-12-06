// src/app/components/Marketplace.js
"use client"
import React, { useEffect, useState } from 'react';
import Card from '../Card/Card';
import { yachtTokenizationABI, yachtTokenizationAddress } from '@/app/constants';
import { readContract } from '@wagmi/core';


const Marketplace = () => {
  const [yachtsData, setYachtData] = useState([]);

  const getYachts= async()=>{
    try {
      const [data] = await readContract({
        address: yachtTokenizationAddress,
        abi: yachtTokenizationABI,
        functionName: "getYachts"
      })
      return [data]
    } catch (err) {
      console.log(err.message)
      return []
    }
  }
  useEffect(()=>{
    const getEvent = async() =>{
      const yachtData = await getYachts()
      setYachtData(yachtData)
    }
    getEvent()
  }, [])


  return (
    <div className="space-y-4">
      {yachtsData.map((item, index) => (
        <Card key={index} data={item} />
      ))}
    </div>
  );
};

export default Marketplace;