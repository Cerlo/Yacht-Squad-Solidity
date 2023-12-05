import React from 'react'

import { VStack } from '@chakra-ui/react';
import Card from '../Card/Card';


const Marketplace = ({yachts}) => {
    return (
        <VStack spacing={4}>
          {yachts.map(item => (
            <Card  key={item.id} data={item} />
          ))}
        </VStack>
      );
}

export default Marketplace