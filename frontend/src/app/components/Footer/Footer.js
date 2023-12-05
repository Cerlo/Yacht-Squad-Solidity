// src/app/components/Footer/Footer.js

import React from 'react';
import { Box, Flex, Text, Link, Image, VStack } from '@chakra-ui/react';
import { FaLinkedin, FaGithub, FaDiscord } from 'react-icons/fa';

const Footer = () => {
  return (
    <Box bg="#353530" color="#fff">
        <VStack 
        spacing={4} 
        p={2}>
            <Text>© 2023 YachtSquad Inc. All rights reserved.</Text>
        </VStack>
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

            <Link href="mailto:contact@realtoken.com" mb={2}>Contact Us</Link>

            <Flex>
                <Link paddingInline={2}href="mailto:contact@realtoken.com">Contact Us</Link>
                <Link href="https://www.linkedin.com" isExternal mr={2}>
                    <FaLinkedin size="24px" />
                </Link>
                <Link href="https://www.github.com" isExternal mr={2}>
                    <FaGithub size="24px" />
                </Link>
                <Link href="https://www.discord.com" isExternal>
                    <FaDiscord size="24px" />
                </Link>
            </Flex>
        </Flex>
    </Box>
  );
};

export default Footer;