# Project YachtSquad Solidity

**This readme file has been wrote to explain how I build my test file.**

> All the information provided has been wrote by Rémy CERLO.
> The project will be introduce here but you will find more specific.

🔗 Projects links 🔗 
[`Vercel`](https://yachtsquad.vercel.app/)
[`GitHub`](https://github.com/Cerlo/Yacht-Squad-Solidity)
[`Loom`](https://www.loom.com/share/2a979b05d6ee4ec3a4da838ce29fa149?sid=a2002993-75c3-4615-9d17-25b5d33e545a)

📅 _Deadline to submit our work 08/12/2023._

 ## Acknoledgement
 I would like to express my heartfelt gratitude to my trainers, [`Cyril Castagnet`](https://github.com/lecascyril) and [`Ben BK`](https://github.com/BenBktech), at Alyra. Your expertise, guidance, and support throughout the courses were instrumental in my learning journey. 

 I also want to extend my thanks to the entire Alyra team for creating such an enriching and supportive learning environment. The guest speakers who shared their insights, and experiences during the program added depth to our understanding. 
 
 Finally, to my project team members, Benoist, Virginie, and Peter, your collaboration, creativity, and hard work made our project a success. 
 
 Thank you all for your contributions to my growth and development in the web3 environment.

## Introduction 
Welcome to the YachtSquad project, an innovative venture into the world of luxury yacht tokenization using EVM. Our project uniquely combines the realms of luxury yachting and blockchain, offering a novel approach to asset tokenization. We've developed a suite of EVM smart contracts (SOLIDITY) to facilitate the minting, trading, and management of yacht tokens. These contracts ensure compliance with ERC1155 and ERC2981 standards, providing a secure and efficient platform for yacht enthusiasts and investors. Our comprehensive testing strategy and deployment scripts ensure reliability and ease of use, making luxury yacht investment accessible and straightforward. 



## 🍕 Project explaination :

My project is structured in two main folder : 
### Backend 🔗 : [`link here`](https://github.com/Cerlo/Yacht-Squad-Solidity/tree/main/backend)

#### Smart Contracts 🔗 : [`link here`](https://github.com/Cerlo/Yacht-Squad-Solidity/tree/main/backend/contracts)

* YachtSquadTokenization.sol: This contract is at the heart of our tokenization process. It mints new yacht tokens, embedding essential details like MMSI (a unique identifier for maritime vessels), token price, maximum supply, and the designated payment wallet. It adheres to the ERC1155 standard and incorporates royalty information for secondary sales, ensuring a continuous benefit stream for original token creators.

* YachtSquadTokenHolder.sol: Serving as a repository for yacht tokens, this contract is an ERC1155 token holder capable of receiving and storing various token types. It's integral for managing the custody of tokens post-minting.

* YachtTokenMarketplace.sol: This contract creates a dynamic marketplace for yacht tokens. Users can list their tokens for sale, and prospective buyers can purchase them, with the contract handling all aspects of pricing and token transfer.

#### Unit Test 🔗 : [`Link here`](https://github.com/Cerlo/Yacht-Squad-Solidity/tree/main/backend/test) : 

* Deployment: Verifying correct contract deployment and initialization.
* Functionality: Testing core functionalities like minting, transferring, and marketplace interactions.
* Compliance: Ensuring adherence to ERC1155 and ERC2981 standards.
* Security: Assessing robustness against unauthorized access and actions.
* Event Handling: Checking for appropriate event emissions during contract operations.

#### Scripts 🔗 : [`link here`](https://github.com/Cerlo/Yacht-Squad-Solidity/tree/main/backend/scripts) 

* Deployment Scripts: These automate the deployment process, setting up our contracts on the blockchain with predefined configurations.

* Minting Script: This script is a key part of our workflow. It processes yacht data, uploads images to IPFS, updates JSON files with IPFS URIs, and then calls the mintyachts function to create NFTs representing each yacht.

* Interaction Scripts: Designed for post-deployment activities, these scripts facilitate various interactions like token transfers and marketplace transactions, making the management of our token ecosystem efficient and user-friendly. 

### [`Frontend`](https://github.com/Cerlo/Yacht-Squad-Solidity/tree/main/frontend)



