# Backend 🔗 : [`link here`](https://github.com/Cerlo/Yacht-Squad-Solidity/tree/main/backend)
Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

## Smart Contracts 🔗 : [`link here`](https://github.com/Cerlo/Yacht-Squad-Solidity/tree/main/backend/contracts)

* YachtSquadTokenization.sol: This contract is at the heart of our tokenization process. It mints new yacht tokens, embedding essential details like MMSI (a unique identifier for maritime vessels), token price, maximum supply, and the designated payment wallet. It adheres to the ERC1155 standard and incorporates royalty information for secondary sales, ensuring a continuous benefit stream for original token creators.

* YachtSquadTokenHolder.sol: Serving as a repository for yacht tokens, this contract is an ERC1155 token holder capable of receiving and storing various token types. It's integral for managing the custody of tokens post-minting.

* YachtTokenMarketplace.sol: This contract creates a dynamic marketplace for yacht tokens. Users can list their tokens for sale, and prospective buyers can purchase them, with the contract handling all aspects of pricing and token transfer.

## Unit Test 🔗 : [`Link here`](https://github.com/Cerlo/Yacht-Squad-Solidity/tree/main/backend/test) : 

* Deployment: Verifying correct contract deployment and initialization.
* Functionality: Testing core functionalities like minting, transferring, and marketplace interactions.
* Compliance: Ensuring adherence to ERC1155 and ERC2981 standards.
* Security: Assessing robustness against unauthorized access and actions.
* Event Handling: Checking for appropriate event emissions during contract operations.

## Scripts 🔗 : [`link here`](https://github.com/Cerlo/Yacht-Squad-Solidity/tree/main/backend/scripts) 

* Deployment Scripts: These automate the deployment process, setting up our contracts on the blockchain with predefined configurations.

* Minting Script: This script is a key part of our workflow. It processes yacht data, uploads images to IPFS, updates JSON files with IPFS URIs, and then calls the mintyachts function to create NFTs representing each yacht.

* Interaction Scripts: Designed for post-deployment activities, these scripts facilitate various interactions like token transfers and marketplace transactions, making the management of our token ecosystem efficient and user-friendly. 
