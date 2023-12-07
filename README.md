# Project YachtSquad Solidity

**This readme file has been wrote to explain how I build my test file.**

> All the information provided has been wrote by Rémy CERLO.
> The project will be introduce here but you will find more specific.


📅 _Deadline to submit our work 08/12/2023._

 ## Acknoledgement
 I would like to express my heartfelt gratitude to my trainers, [`Cyril Castagnet`](https://github.com/lecascyril) and [`Ben BK`](https://github.com/BenBktech), at Alyra. Your expertise, guidance, and support throughout the courses were instrumental in my learning journey. 

 I also want to extend my thanks to the entire Alyra team for creating such an enriching and supportive learning environment. The guest speakers who shared their insights, and experiences during the program added depth to our understanding. 
 
 Finally, to my project team members, Benoist, Virginie, and Peter, your collaboration, creativity, and hard work made our project a success. 
 
 Thank you all for your contributions to my growth and development in the web3 environment.

## 🍕 Project explaination :

My project is structured in two main folder : 
### [`Backend`](https://github.com/Cerlo/Yacht-Squad-Solidity/tree/main/backend)

#### [`smartContracts`](https://github.com/Cerlo/Yacht-Squad-Solidity/tree/main/backend/contracts)

In our YachtSquad project, we've developed a series of smart contracts to facilitate the tokenization and trading of luxury yachts. Our main contracts include:

    * YachtSquadTokenization.sol: This contract is at the heart of our tokenization process. It mints new yacht tokens, embedding essential details like MMSI (a unique identifier for maritime vessels), token price, maximum supply, and the designated payment wallet. It adheres to the ERC1155 standard and incorporates royalty information for secondary sales, ensuring a continuous benefit stream for original token creators.

    * YachtSquadTokenHolder.sol: Serving as a repository for yacht tokens, this contract is an ERC1155 token holder capable of receiving and storing various token types. It's integral for managing the custody of tokens post-minting.

    * YachtTokenMarketplace.sol: This contract creates a dynamic marketplace for yacht tokens. Users can list their tokens for sale, and prospective buyers can purchase them, with the contract handling all aspects of pricing and token transfer.

#### [`unit tests`](https://github.com/Cerlo/Yacht-Squad-Solidity/tree/main/backend/test) : 


#### [`scripts`](https://github.com/Cerlo/Yacht-Squad-Solidity/tree/main/backend/scripts)
To streamline our development and interaction with the blockchain, we've crafted specific scripts:

    * Deployment Scripts: These automate the deployment process, setting up our contracts on the blockchain with predefined configurations.

    * Minting Script: This script is a key part of our workflow. It processes yacht data, uploads images to IPFS, updates JSON files with IPFS URIs, and then calls the mintyachts function to create NFTs representing each yacht.

    * Interaction Scripts: Designed for post-deployment activities, these scripts facilitate various interactions like token transfers and marketplace transactions, making the management of our token ecosystem efficient and user-friendly. 

### [`Frontend`](https://github.com/Cerlo/Yacht-Squad-Solidity/tree/main/frontend)



