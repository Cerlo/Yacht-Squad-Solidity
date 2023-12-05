// src/app/components/Footer/Footer.js

import React from 'react';
import { Box, Flex, Text, Link, Image, VStack } from '@chakra-ui/react';
import { FaLinkedin, FaGithub, FaDiscord } from 'react-icons/fa';
import theme from '../../theme/theme'; 

const Footer = () => {
    const goldShadow = `0px -8px 30px -5px ${theme.colors.gold}`; // Ombre gold
  return (
    <Box bg="#353530" color="#fff">
        <Flex
            direction="column"
            align="center"
            justify="center"
            wrap="wrap"
            padding="1rem"
            bg="#1c1b19"
        >
            <Flex align="center" mb={2}>
                <Image src="/csv-logo.svg" alt="CSV Logo" boxSize="50px" mr="10px" />
            </Flex>

            <Link href="mailto:contact@yachtsquad.com" mb={2}>Contact Us</Link>

            <Flex>
                <Link paddingInline={2}href="mailto:contact@realtoken.com">Contact Us</Link>
                <Link href="https://www.linkedin.com" isExternal mr={2}>
                    <FaLinkedin size="24px" />
                </Link>
                <Link href="https://github.com/Cerlo/Yacht-Squad-Solidity" isExternal mr={2}>
                    <FaGithub size="24px" />
                </Link>
                <Link href="https://www.discord.com" isExternal>
                    <FaDiscord size="24px" />
                </Link>
            </Flex>
        </Flex>
        <VStack 
        spacing={4} 
        p={2}
        boxShadow={goldShadow}>
            <Text>© 2023 YachtSquad Inc. All rights reserved.</Text>
        </VStack>
    </Box>
  );
};

export default Footer;