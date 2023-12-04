// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy YachtSquadTokenization
  const YachtSquadTokenization = await hre.ethers.getContractFactory("YachtSquadTokenization");
  const yachtSquadTokenization = await YachtSquadTokenization.deploy();
  console.log("YachtSquadTokenization deployed to:", yachtSquadTokenization.target);

  // Deploy YachtSquadTokenHolder
  const YachtSquadTokenHolder = await hre.ethers.getContractFactory("YachtSquadTokenHolder");
  const yachtSquadTokenHolder = await YachtSquadTokenHolder.deploy(yachtSquadTokenization.target);
  console.log("YachtSquadTokenHolder deployed to:", yachtSquadTokenHolder.target);

  // Deploy YachtTokenMarketplace
  const YachtTokenMarketplace = await hre.ethers.getContractFactory("YachtTokenMarketplace");
  const yachtTokenMarketplace = await YachtTokenMarketplace.deploy(yachtSquadTokenization.target, yachtSquadTokenHolder.target);
  console.log("YachtTokenMarketplace deployed to:", yachtTokenMarketplace.target);
  
 

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
