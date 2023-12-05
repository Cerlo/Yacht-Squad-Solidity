import React from 'react'

import { VStack } from '@chakra-ui/react';
import Card from '../Card/Card';


const Marketplace = () => {
    /**
* data to retrive from blockchain
*/
const yachtsData = [
 {
   "id": 0,
   "mmsi": 319085900,
   "tokenPrice": 1000,
   "maxSupply": 100000,
   "uri": "bafybeift7hj22si3lwgtozmccw6h4ut4e4ox2tauvclh6hl7t3xh4l25am", 
   "name": "Aquijo",
   "legal": "a899fc0d56ef54e9a2a9e7b8ef16e79f4ca11a56d86d79f6366d14b0c3c690aa",
   "paymentWallet": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
   "status": 0
 },{
   "id":1,
   "mmsi":319113100, 
   "tokenPrice":2000, 
   "maxSupply":100000,
   "name": "Black_Pearl",
   "uri": "bafybeidlko2jbq7wifsc743akyg6w7yv5nhtryamfn7z27jjjksollqa7e", 
   "legal": "07762f76dfdbb1597218313ea27680c28bac238600230cc7a20c7e2cd9de4d73", 
   "paymentWallet":"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
   "status" : 0
}
];
    return (
        <VStack spacing={4}>
          {yachtsData.map(item => (
            <Card  key={item.id} data={item} />
          ))}
        </VStack>
      );
}

export default Marketplace