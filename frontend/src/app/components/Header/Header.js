// src/app/components/Header.js
'use Client'
import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Button, useColorMode, Image, HStack, Spinner  } from '@chakra-ui/react';
import {
  ConnectButton
} from '@rainbow-me/rainbowkit';
import theme from '../../theme/theme'; // Ajustez le chemin si nécessaire

const Header = () => {


  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // Ajustez le délai si nécessaire
    return () => clearTimeout(timer);
  }, []);


  return (
    <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding="0.5rem" bg="#353530" color="#fff">
      <Flex align="center" mr={5}>
        <Image src="/csv-logo.svg" alt="CSV Logo" boxSize="100px" mr="1rem" ml="1rem" />
        <Text fontSize="lg" fontWeight="bold" color="#fcd462">
          YachtSquad
        </Text>
      </Flex>

      <Flex align="center">
        {/* Liens de navigation */}
        <HStack spacing={4} mr={4}>
          <Button variant="ghost" _hover={{ bg: "#fcd462", color: "#353530" }}>Lien 1</Button>
          <Button variant="ghost" _hover={{ bg: "#fcd462", color: "#353530" }}>Lien 2</Button>
          <Button variant="ghost" _hover={{ bg: "#fcd462", color: "#353530" }}>Lien 3</Button>
        </HStack>

        {loading ? (
        <Button
          size="md" // Ajustez la taille pour correspondre au ConnectButton
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
