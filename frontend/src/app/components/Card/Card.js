// src/app/components/Card.js

import React, { useState } from 'react';
import { 
    Box, 
    Image, 
    Text, 
    VStack, 
    Heading, 
    Button, 
    Flex, 
    useTheme, 
    Modal, 
    ModalOverlay, 
    ModalContent, 
    ModalBody, 
    useDisclosure 
} from '@chakra-ui/react';

import theme from '../../theme/theme';

const Card = ({ data }) => {
  const ipfsImageUrl = `https://ipfs.io/ipfs/${data.uri}`; 
  const theme = useTheme();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      display="flex"
      flexDirection={{ base: 'column', sm: 'row' }}
      overflow='hidden'
      borderWidth="1px"
      bg={theme.colors.lessDark} // Couleur de fond lessDark
      p={4}
      mt={2}
      mb={2}
      width="100%"
      maxW="600px" // Largeur uniforme pour toutes les cartes
    >
     <Box flex="1" cursor="pointer" onClick={onOpen}>
        <Image
          objectFit='cover'
          width="100%"
          height="100%"
          src={ipfsImageUrl}
          alt={data.name}
          transition="0.3s ease-in-out"
          _hover={{ transform: "scale(1.05)" }} // Effet de zoom
        />
      </Box>

      {/* Contenu */}
      <VStack flex="1" align="start" p={4}>
        <Heading size='md' color={theme.colors.gold} as='ins'>{data.name}</Heading>
        <Text py='2' color={theme.colors.white}>
            MMSI: {data.mmsi}<br />
            Prix du Token: {data.tokenPrice}<br />
            Max Supply: {data.maxSupply}<br />
            Wallet de Paiement: {data.paymentWallet}<br />
            Status: {data.status}
        </Text>
        <Flex width="100%" justifyContent="center">
            <Button
                variant='solid'
                backgroundColor={theme.colors.gold}
                borderRadius="0"
                color={theme.colors.lessDark}
                _hover={{
                    bg: theme.colors.lessDark,
                    color: theme.colors.gold,
                    border: `1px solid ${theme.colors.gold}`,
                }}
            >
                Buy {data.name}
            </Button>
        </Flex>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Image src={ipfsImageUrl} alt={data.name} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Card;
