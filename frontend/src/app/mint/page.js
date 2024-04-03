"use client"
import React, { useEffect, useState, useContext } from 'react';
import { redirect } from 'next/navigation'

import   MintYacht from "@/app/components/MintYacht/MintYacht";
import { useAuth } from '@/app/context/AuthContext';

export default function mint() {
  const { userType, isConnected } = useAuth();

    /**
   * @notice Redirects non-owners or disconnected users to the home page.
   */ 
    useEffect(() => {
      // Redirect to '/' if the user is not the owner or not connected
      if (!isConnected || userType !== 'owner') {
        redirect('/')
      }
    }, [userType, isConnected]);

    return (
        <>
          <MintYacht />
        </>
      )
  }