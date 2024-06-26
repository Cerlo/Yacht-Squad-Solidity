require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-truffle5");
require("dotenv/config");
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 11155111,
      blockConfirmations: 6,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
  // Active le rapporteur de gaz (gas reporter) pour afficher les coûts de gaz 
  // lors des déploiements et des transactions.
  gasReporter: {
    enabled: true,
  },
  // /!\  Permet de configurer la vérifications sur Etherscan
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  sourcify: {
    enabled: true
  },
  // /!\ 
  // Configure les compilateurs Solidity utilisés par Hardhat. 
  // Dans cet exemple, la version "0.8.19" est spécifiée.
  solidity: {
    compilers: [
      {
        version: "0.8.20",
      },
    ],
  },
};
