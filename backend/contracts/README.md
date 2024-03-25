# YachtSquad Project - Smart Contract Deployment Guide

Welcome to the YachtSquad project's smart contract deployment guide. This README provides detailed instructions on deploying and interacting with our Ethereum smart contracts using Hardhat. Our contracts enable the tokenization of luxury yachts, offering a unique investment opportunity in the blockchain space.

##Prerequisites

Before you begin, ensure you have the following installed:

* [`Node.js`](https://nodejs.org/en/) (version 12 or higher)
* [`Yarn`](https://yarnpkg.com/) or [`npm`](https://www.npmjs.com/) package manager
* [`Hardhat`](https://hardhat.org/) - Ethereum development environment

Contract deployed with `0x8702A748754cb24454849787302Cf759eC27D02A`
* YachtSquadTokenization deployed and verified to: [`0x7A8AfEd95b0eF14FfA602838FD27d5A14921F8DB`](https://sepolia.etherscan.io/address/0x7A8AfEd95b0eF14FfA602838FD27d5A14921F8DB#code)
* YachtSquadTokenHolder deployed and verified to: [`0xC0626132e04da0a96544d4cF8e2fEF512b6F3829`](https://sepolia.etherscan.io/address/0xC0626132e04da0a96544d4cF8e2fEF512b6F3829#code)

* YachtTokenMarketplace deployed to: [`0x484f124AD1e69F0b8CC904a36eEDFE10ec4ff746`](https://sepolia.etherscan.io/address/0x484f124AD1e69F0b8CC904a36eEDFE10ec4ff746#code)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Cerlo/Yacht-Squad-Solidity
cd backend
```

1. Install dependencies:

```bash

    yarn install
    # or
    npm install
```

## Setting Up Hardhat

1. Initialize a Hardhat project (if not already done):

```bash

    npx hardhat init
```

2. Configure hardhat.config.js with the desired network settings and compiler versions.
here is 
```javascript
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-truffle5");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
};
```

## Deploying Contracts

1. Create a deployment script under the scripts directory.

2. In the deployment script, import the contract artifacts and write a function to deploy them.

Example for this project :

```javascript
const hre = require("hardhat");

async function main() {
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deployment of YachtSquadTokenization
  const YachtSquadTokenization = await hre.ethers.getContractFactory("YachtSquadTokenization");
  const yachtSquadTokenization = await YachtSquadTokenization.deploy();
  console.log("YachtSquadTokenization deployed to:", yachtSquadTokenization.target);

  // Deployment of YachtSquadTokenHolder
  const YachtSquadTokenHolder = await hre.ethers.getContractFactory("YachtSquadTokenHolder");
  const yachtSquadTokenHolder = await YachtSquadTokenHolder.deploy(yachtSquadTokenization.target);
  console.log("YachtSquadTokenHolder deployed to:", yachtSquadTokenHolder.target);

  // Deployment of YachtTokenMarketplace
  const YachtTokenMarketplace = await hre.ethers.getContractFactory("YachtTokenMarketplace");
  const yachtTokenMarketplace = await YachtTokenMarketplace.deploy(yachtSquadTokenization.target, yachtSquadTokenHolder.target);
  console.log("YachtTokenMarketplace deployed to:", yachtTokenMarketplace.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Run the deployment script:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

Replace localhost with the network name you configured in hardhat.config.js.

## Smart Contracts Overview

* YachtSquadTokenization.sol: This contract handles the creation (minting) of yacht tokens. It includes functionality for setting token URIs, managing token supplies, and handling yacht-specific data like MMSI, legal information, and payment wallets.

* YachtSquadTokenHolder.sol: A contract designed to hold yacht tokens. It includes mechanisms for receiving, storing, and transferring tokens securely.

* YachtTokenMarketplace.sol: This contract facilitates the buying and selling of yacht tokens. It manages sale offers, handles token pricing, and processes transactions.

* interfaces/IYachtSquadTokenHolder.sol: Interface for the YachtSquadTokenHolder contract, defining essential functions and events.

* interfaces/IYachtSquadTokenization.sol: Interface for the YachtSquadTokenization contract, outlining the required functionalities for yacht token management.


```mermaid
   flowchart TD
     A[YachtSquad RWA solution] -->|Token management| B(YachtSquadTokenization.sol)
     B -->|yes| C[start]
     B -->|no| D[check]
     A -->|Manage intial mint| E(YachtSquadTokenHolder.sol)
     E -->|yes| F[check]
     E -->|no| G[create & fund]
     A -->|Marketplace management| H(YachtTokenMarketplace.sol)
     H -->|yes| I(workspace = true?)
     I -->|yes| J[build, deploy, init]
     I -->|no| K[spoon]
     H -->|no| L[check]
     J --> M[bind & import]
     K --> M
     L --> M
   ```