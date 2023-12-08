# YachtSquad Project - Script Execution Guide

Welcome to the YachtSquad project's script execution guide. This README provides instructions on running various scripts in our project, along with brief descriptions of each script's functionality.

## Prerequisites

Before running the scripts, ensure you have the following:


* [`Node.js`](https://nodejs.org/en/) (version 12 or higher)
* [`Yarn`](https://yarnpkg.com/) or [`npm`](https://www.npmjs.com/) package manager
* [`Hardhat`](https://hardhat.org/) - Ethereum development environment
* Pinata SDK for IPFS interactions
```bash
npm install --save @pinata/sdk
```
* An .env file with necessary environment variables like PINATA_KEY, PINATA_SECRET, and YACHTSQUADCONTRACTHOLDERADDRESS

## Scripts Overview
### deploy.js

This script is used to deploy our smart contracts to the Ethereum network. It utilizes Hardhat's deployment mechanisms to compile and deploy contracts.

#### Run the deployment script:
```bash
npx hardhat run scripts/deploy.js --network localhost
```
Replace localhost with the network name you configured in hardhat.config.js.

### uploadListing.js

This script handles the uploading of yacht `assets` (images and metadata) to IPFS using the Pinata service. It reads files from the assets directory, uploads them to IPFS, and then mints yacht tokens with the corresponding IPFS URIs.
Running the Script

1. Place your yacht images and metadata JSON files in the `assets` directory located on `hardhat/assets/`.
```json
{
    //there is an example
    "id":0,
    "mmsi":319085900, 
    "tokenPrice":1000, 
    "maxSupply":100000,
    "name": "Aquijo",
    "uri": "", //leave it empty except if you already have an URI
    "legal": "a899fc0d56ef54e9a2a9e7b8ef16e79f4ca11a56d86d79f6366d14b0c3c690aa", 
    "paymentWallet":"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "status" : 0
}
```

2. Ensure your .env file contains the correct Pinata API keys and contract address.

#### Run the script using the command:

```bash
node scripts/uploadListing.js
```

### listenNewMint.js

This script listens for the NewMint event emitted by our smart contract. It connects to the Ethereum network using Hardhat's provider and listens for new mint events related to yacht tokens.

#### Running the Script

1. Ensure your .env file contains the correct YACHTSQUADCONTRACTHOLDERADDRESS.
2. Run the script using the command:

```bash
npx hardhat run scripts/listenNewMint.js
```


