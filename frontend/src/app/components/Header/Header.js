// src/app/components/Header.js
'use client'
import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Button, Link, Image, HStack, Spinner, Spacer  } from '@chakra-ui/react';
import {
  ConnectButton
} from '@rainbow-me/rainbowkit';
import theme from '../../theme/theme'; 

const Header = () => {


  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); 
    return () => clearTimeout(timer);
  }, []);


  return (
    <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding="1.5rem" bg="#353530" color="#fff">
      
      <Flex align="center">
        <Image src="/csv-logo.svg" alt="CSV Logo" boxSize="50px" mr="10px" />
        <Text fontSize="lg" fontWeight="bold" color="#fcd462">
          YachtSquad
        </Text>
      </Flex>


      <Box flex={1} textAlign="center">
        <HStack spacing={4} justify="center">
          
          <Link href="/" mr="5">Home</Link>
          <Link href="/about" mr="5">About</Link>
          <Link href="/contact">Contact</Link>
        </HStack>
      </Box>
      
      <Flex align="center">
        {loading ? (
        <Button
          size="md" 
          bg={theme.colors.gold}
          color={theme.colors.white}
          _hover={{
            bg: theme.colors.dark,
            color: theme.colors.gold,
          }}
          isLoading
        >
          <Spinner />
        </Button>
        ) : (
          <ConnectButton />
        )}
      </Flex>
    </Flex>
  );
};

export default Header;
